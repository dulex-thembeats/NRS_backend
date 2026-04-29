import {
  ForbiddenException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database';
import { EmailService } from 'src/shared/email/mail.service';
import { CreateUserDto, UpdateUserDto, RegisterUserDto } from './dtos';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';


@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    // Check if user already exists with the same email
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if user already exists with the same entityId
    // const existingUserByEntityId = await this.prisma.user.findUnique({
    //   where: {
    //     entityId: createUserDto.entityId,
    //   },
    // });

    // if (existingUserByEntityId) {
    //   throw new ConflictException('User with this entity ID already exists');
    // }

    // Generate random password and hash it
    const randomPassword = crypto.randomBytes(12).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        // entityId: crypto.randomUUID(),
        password: hashedPassword,
        // business fields intentionally omitted (nullable)
        role: createUserDto.role as any, // Cast to avoid type conflicts
        isEmailVerified: true,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });
    // Send email to user with password
    // await this.emailService.sendCustomEmail(
    //   createUserDto.email,
    //   'Your Account Credentials',
    //   `
    //     <h2>Welcome!</h2>
    //     <p>Your account has been created successfully.</p>
    //     <p><strong>Email:</strong> ${createUserDto.email}</p>
    //     <p><strong>Password:</strong> ${randomPassword}</p>
    //     <p>Please log in and change your password for security.</p>
    //   `,
    // );

    return {
      success: true,
      user: this.sanitizeUser(this.mapPrismaUserToEntity(user)),
    };
  }

  async createUserWithDirectors(registerUserDto: RegisterUserDto): Promise<User> {
    // Check if user already exists with the same email
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: {
        email: registerUserDto.email,
      },
    });

    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if user already exists with the same entityId
    const existingUserByEntityId = await this.prisma.user.findUnique({
      where: {
        entityId: registerUserDto.entityId,
      },
    });

    if (existingUserByEntityId) {
      throw new ConflictException('User with this entity ID already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user with directors
    const user = await this.prisma.user.create({
      data: {
        email: registerUserDto.email,
        entityId: registerUserDto.entityId,
        password: hashedPassword,
        businessName: registerUserDto.businessName,
        businessAddress: registerUserDto.businessAddress,
        rcNumber: registerUserDto.rcNumber,
        role: 'USER' as any,
        dateOfIncorporation: registerUserDto.dateOfIncorporation 
          ? new Date(registerUserDto.dateOfIncorporation) 
          : new Date(),
        isEmailVerified: true,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        directors: {
          create: registerUserDto.directors.map(director => ({
            firstName: director.firstName,
            lastName: director.lastName,
            email: director.email,
            phoneNumber: director.phoneNumber,
            nin: director.nin,
          })),
        },
      },
      include: {
        directors: true,
      },
    });

    return this.mapPrismaUserToEntity(user);
  }

  async findAllUsers(): Promise<any[]> {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
    });

    return users.map((user) => this.sanitizeUser(user));
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        entityId: true,
        email: true,
        businessAddress: true,
        businessName: true,
        rcNumber: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        entity: {
          include: {
            businesses: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }
    return this.mapPrismaUserToEntity(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return this.mapPrismaUserToEntity(user); // Return with password for auth validation
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        role: updateUserDto.role as any, // Cast to avoid type conflicts
      },
    });

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async removeAsRequester(id: number, requesterId: number, requesterRole: string): Promise<void> {
    if (requesterRole !== 'ADMIN' && id !== requesterId) {
      throw new ForbiddenException('You can only deactivate your own account');
    }
    await this.remove(id);
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return null;
    }

    return this.mapPrismaUserToEntity(user);
  }
  async verifyEmail(token: string): Promise<User> {
    const user = await this.findByVerificationToken(token);

    if (!user) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    return this.mapPrismaUserToEntity(updatedUser);
  }

  async generateNewVerificationToken(email: string): Promise<string> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    return verificationToken;
  }

  private mapPrismaUserToEntity(u: any): User {
    return {
      ...(u as User),
      businessName: u.businessName ?? undefined,
      businessAddress: u.businessAddress ?? undefined,
      rcNumber: u.rcNumber ?? undefined,
      entityId: u.entityId ?? undefined,
      emailVerificationToken: u.emailVerificationToken ?? undefined,
      emailVerificationExpires: u.emailVerificationExpires ?? undefined,
    } as User;
  }

  private sanitizeUser(user: any) {
    const {
      password,
      emailVerificationToken,
      emailVerificationExpires,
      ...safeUser
    } = user;
    return safeUser;
  }
}
