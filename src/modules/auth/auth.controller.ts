import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dtos';
import {
  LoginDto,
  ResendVerificationDto,
  VerifyEmailDto,
  SetEntityIdDto,
} from './dtos';
import { Public,CurrentUser } from '../../common/decorators';
import { EmailService } from 'src/shared/email/mail.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('api/v1/auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerification(resendVerificationDto);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  /**
   * One-time: set FIRS entity ID on the account after registration (only when `entityId` is not yet set).
   */
  @Post('entity-id')
  @HttpCode(HttpStatus.OK)
  async setEntityId(
    @CurrentUser() req: any,
    @Body() dto: SetEntityIdDto,
  ) {
    return this.authService.bindEntityIdIfUnset(req.id, dto.entityId);
  }

  @Get('profile')
  async getProfile(
    @CurrentUser() req: any,
  ) {
    const user = await this.authService.validateUser(req);
    if (!user || user.id != req.id) {
      throw new UnauthorizedException('User not found or not authorized');
    }
    return user;
  }

  // @Post('fetch-entity/:entityId')
  // @HttpCode(HttpStatus.OK)
  // async fetchEntityData(@Request() req, @Param('entityId') entityId: string) {
  //   const user = await this.authService.validateUser(req.user);
  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }
  //   return this.authService.fetchAndSaveEntityData(entityId, user.id);
  // }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // Since JWT is stateless, we don't need to do anything server-side
    // The client should handle removing the token
    return { message: 'Successfully logged out' };
  }

  // Test email endpoint (remove in production)
  @Public()
  @Post('test-email')
  async testEmail(@Body('email') email: string) {
    try {
      await this.emailService.sendCustomEmail(
        email,
        'Test Email',
        '<h1>Test Email</h1><p>If you receive this, email is working!</p>',
      );
      return { message: 'Test email sent successfully!' };
    } catch (error) {
      return { message: 'Failed to send test email', error: error.message };
    }
  }

  // Test email connection
  @Public()
  @Get('test-email-connection')
  async testEmailConnection() {
    const isConnected = await this.emailService.testConnection();
    return {
      connected: isConnected,
      message: isConnected
        ? 'Email service is working!'
        : 'Email service connection failed',
    };
  }

}
