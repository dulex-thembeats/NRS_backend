import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  UseGuards,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterUserDto, CompleteProfileDto } from "../users/dtos";
import { LoginDto, ResendVerificationDto, VerifyEmailDto } from "./dtos";
import { Public, CurrentUser } from "../../common/decorators";
import { EmailService } from "../../shared/email/mail.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { RateLimitGuard } from "../../common/guards/rate-limit.guard";

@Controller("api/v1/auth")
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(registerUserDto);
    res.cookie('Authentication', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    return result;
  }

  /**
   * Phase 2: Complete profile with business info and directors.
   * Requires JWT from Phase 1 registration or login.
   */
  @Post("complete-profile")
  @HttpCode(HttpStatus.OK)
  async completeProfile(
    @CurrentUser() req: any,
    @Body() completeProfileDto: CompleteProfileDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.completeProfile(req.id, completeProfileDto);
    res.cookie('Authentication', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
    });
    return result;
  }

  @Public()
  @UseGuards(RateLimitGuard)
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    res.cookie('Authentication', result.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
    });
    return result;
  }

  @Public()
  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Public()
  @Post("resend-verification")
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @Body() resendVerificationDto: ResendVerificationDto,
  ) {
    return this.authService.resendVerification(resendVerificationDto);
  }

  @Public()
  @Post("forgot-password")
  async forgotPassword(@Body("email") email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Get("profile")
  async getProfile(@CurrentUser() req: any) {
    const user = await this.authService.getProfile(req.id);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }

  @Post("sync-businesses")
  @HttpCode(HttpStatus.OK)
  async syncBusinesses(@CurrentUser() req: any) {
    return this.authService.syncEntityBusinesses(req.id);
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

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication');
    return { message: "Successfully logged out" };
  }

  // Test email endpoint (remove in production)
  @Public()
  @Post("test-email")
  async testEmail(@Body("email") email: string) {
    try {
      await this.emailService.sendCustomEmail(
        email,
        "Test Email",
        "<h1>Test Email</h1><p>If you receive this, email is working!</p>",
      );
      return { message: "Test email sent successfully!" };
    } catch (error) {
      return { message: "Failed to send test email", error: error.message };
    }
  }

  // Test email connection
  @Public()
  @Get("test-email-connection")
  async testEmailConnection() {
    const isConnected = await this.emailService.testConnection();
    return {
      connected: isConnected,
      message: isConnected
        ? "Email service is working!"
        : "Email service connection failed",
    };
  }
}
