import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interface/jwt-payload.interface';
import { compare, hash } from 'bcryptjs';
import { RegisterUserDto } from '../users/dtos';
import { LoginDto, ResendVerificationDto, VerifyEmailDto } from './dtos';
import * as bcrypt from 'bcryptjs';
import { EmailService } from '../../shared/email/mail.service';
import { PrismaService } from '../../database';
import axios from 'axios';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly firsApiUrl: string = process.env.FIRS_API_URL ?? '';
  private readonly firsApiKey: string = process.env.FIRS_API_KEY ?? '';
  private readonly firsApiSecret: string = process.env.FIRS_API_SECRET ?? '';

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  /**
   * Extracts the middle part of the IRN template (e.g., "9BB244DE" from "{{invoice_id(e.g:INV00XXX)}}-9BB244DE-{{YYYYMMDD(e.g:20250909)}}")
   * @param irnTemplate - The full IRN template string
   * @returns The extracted middle part or the original string if pattern doesn't match
   */
  private extractIrnTemplate(irnTemplate: string): string {
    if (!irnTemplate) return irnTemplate;
    
    // Pattern to match: {{...}}-MIDDLE_PART-{{...}}
    const match = irnTemplate.match(/\{\{.*?\}\}-([A-Z0-9]+)-\{\{.*?\}\}/);
    return match ? match[1] : irnTemplate;
  }

  async register(registerUserDto: RegisterUserDto) {
    // Check if user already exists
    try {
      const existingUser = await this.userService.findUserByEmail(
        registerUserDto.email,
      );
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }

      // Create new user with directors
      const user = await this.userService.createUserWithDirectors(registerUserDto);

      // Generate JWT token
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        entityId: user.entityId ?? '',
        businessName: user.businessName ?? '',
      };

      if (user.entityId) {
        await this.fetchAndSaveEntityData(user.entityId, user.id);
      }
      // await this.emailService.sendWelcomeEmail(user.email, {
      //   businessName: user.businessName,
      //   email: user.email,
      //   loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
      // });

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          businessName: user.businessName,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      // Find user
      const user = await this.userService.findUserByEmail(loginDto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      // Check if user is email verified
      if (!user.isEmailVerified) {
        throw new UnauthorizedException('Email is not verified');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        entityId: user.entityId ?? '',
        businessName: user.businessName ?? '',
      };
      try {
        await this.emailService.sendWelcomeEmail(user.email, {
          businessName: user.businessAddress ?? '',
          email: user.email,
          loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
        });
      } catch (emailError) {
        // Log error but don't fail registration
        console.error('Failed to send welcome email:', emailError);
      }
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          businessName: user.businessName,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.userService.verifyEmail(verifyEmailDto.token);
    try {
      await this.emailService.sendWelcomeEmail(user.email, {
        businessName: user?.businessName ?? '',
        email: user.email ?? '',
        loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }
    return user;
  }

  async resendVerification(resendVerificationDto: ResendVerificationDto) {
    try {
      const verificationToken =
        await this.userService.generateNewVerificationToken(
          resendVerificationDto.email,
        );

      // Send new verification email
      const user = await this.userService.findUserByEmail(
        resendVerificationDto.email,
      );

      if (!user) {
        throw new BadRequestException('User not found');
      }

      await this.emailService.sendVerificationEmail(user.email, {
        businessName: user.businessName ?? '',
        verificationToken,
        verificationUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`,
      });

      return {
        message: 'Verification email sent! Please check your inbox.',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to resend verification email');
    }
  }

  async validateUser(payload: any) {
    // This is used by the JWT strategy
    return await this.userService.findUserById(payload.id);
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return {
        message:
          'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // Generate reset token (in a real app, store this in database with expiration)
    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    // Send password reset email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, {
        businessName: user.businessName ?? '',
        resetToken,
        resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`,
        expiresIn: '1 hour',
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      throw new Error('Failed to send password reset email');
    }

    return {
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };
  }

  /**
   * Fetches entity data from FIRS API and saves it to the database.
   * @param entityId - The entity ID to fetch from FIRS.
   * @param userId - The user ID to associate the entity with.
   * @returns The saved entity data with businesses.
   */
  async fetchAndSaveEntityData(entityId: string, userId: number): Promise<any> {
    if (!this.firsApiUrl || !this.firsApiKey || !this.firsApiSecret) {
      throw new Error(
        'FIRS API credentials are not set in environment variables',
      );
    }

    const url = `${this.firsApiUrl}/api/v1/entity/${entityId}`;

    try {
      this.logger.log(`Fetching entity data from FIRS for entityId: ${entityId}`);

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.firsApiKey,
          'x-api-secret': this.firsApiSecret,
        },
      });

      const entityData = response.data.data;

      if (!entityData) {
        throw new Error('No entity data received from FIRS API');
      }

      this.logger.log(`Successfully fetched entity data for entityId: ${entityId}`);

      // Check if entity already exists for this user
      const existingEntity = await this.prisma.entity.findFirst({
        where: { userId },
      });

      if (existingEntity) {
        this.logger.log(`Entity already exists for user ${userId}, updating...`);
        
        // Update existing entity
        const updatedEntity = await this.prisma.entity.update({
          where: { id: existingEntity.id },
          data: {
            reference: entityData.reference,
            customSettings: entityData.custom_settings ? JSON.stringify(entityData.custom_settings) : null,
            isActive: entityData.is_active,
            appReference: entityData.app_reference,
            updatedAt: new Date(),
          },
          include: {
            businesses: true,
          },
        });

        // Delete existing businesses and create new ones
        await this.prisma.business.deleteMany({
          where: { entityId: existingEntity.id },
        });

        // Create new businesses
        if (entityData.businesses && entityData.businesses.length > 0) {
          await this.prisma.business.createMany({
            data: entityData.businesses.map((business: any) => ({
              id: business.id,
              reference: business.reference,
              name: business.name,
              customSettings: business.custom_settings ? JSON.stringify(business.custom_settings) : null,
              tin: business.tin,
              sector: business.sector,
              annualTurnover: business.annual_turnover,
              supportPeppol: business.support_peppol,
              isRealtimeReporting: business.is_realtime_reporting,
              notificationChannels: business.notification_channels,
              erpSystem: business.erp_system,
              irnTemplate: this.extractIrnTemplate(business.irn_template),
              isActive: business.is_active,
              createdAt: new Date(business.created_at),
              updatedAt: new Date(business.updated_at),
              entityId: existingEntity.id,
            })),
          });
        }

        return updatedEntity;
      } else {
        this.logger.log(`Creating new entity for user ${userId}`);
        
        // Create new entity with businesses
        const newEntity = await this.prisma.entity.create({
          data: {
            id: entityData.id,
            reference: entityData.reference,
            customSettings: entityData.custom_settings ? JSON.stringify(entityData.custom_settings) : null,
            isActive: entityData.is_active,
            appReference: entityData.app_reference,
            createdAt: new Date(entityData.created_at),
            updatedAt: new Date(entityData.updated_at),
            userId: userId,
            businesses: {
              create: entityData.businesses?.map((business: any) => ({
                id: business.id,
                reference: business.reference,
                name: business.name,
                customSettings: business.custom_settings ? JSON.stringify(business.custom_settings) : null,
                tin: business.tin,
                sector: business.sector,
                annualTurnover: business.annual_turnover,
                supportPeppol: business.support_peppol,
                isRealtimeReporting: business.is_realtime_reporting,
                notificationChannels: business.notification_channels,
                erpSystem: business.erp_system,
                irnTemplate: this.extractIrnTemplate(business.irn_template),
                isActive: business.is_active,
                createdAt: new Date(business.created_at),
                updatedAt: new Date(business.updated_at),
              })) || [],
            },
          },
          include: {
            businesses: true,
          },
        });

        this.logger.log(`Successfully created entity with ID: ${newEntity.id} for user ${userId}`);
        return newEntity;
      }
    } catch (error) {
      this.logger.error(`Failed to fetch and save entity data for entityId: ${entityId}`, error.stack);
      
      if (error.response) {
        throw new Error(
          `Failed to fetch entity from FIRS: ${error.response.status} ${JSON.stringify(error.response.data)}`,
        );
      }
      throw new Error(`Failed to fetch and save entity data: ${error.message}`);
    }
  }
}
