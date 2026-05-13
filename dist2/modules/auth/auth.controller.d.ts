import { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterUserDto, CompleteProfileDto } from "../users/dtos";
import { LoginDto, ResendVerificationDto, VerifyEmailDto } from "./dtos";
import { EmailService } from "../../shared/email/mail.service";
export declare class AuthController {
    private readonly authService;
    private readonly emailService;
    constructor(authService: AuthService, emailService: EmailService);
    register(registerUserDto: RegisterUserDto, res: Response): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: any;
        };
        isProfileComplete: boolean;
        entity_id: string | null;
        business_id: null;
        businesses: never[];
        message: string;
    } | {
        access_token: string;
        user: {
            id: number;
            email: string;
            role: any;
        };
        isProfileComplete: boolean;
        entity_id: null;
        business_id: null;
        businesses: never[];
        message?: undefined;
    }>;
    completeProfile(req: any, completeProfileDto: CompleteProfileDto, res: Response): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            businessName: string | undefined;
            role: any;
        };
        isProfileComplete: boolean;
        entity_id: string | null;
        business_id: string | null;
        businesses: {
            business_id: string;
            name: string;
            tin: string;
            is_active: boolean;
        }[];
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            businessName: string | undefined;
            role: any;
        };
        isProfileComplete: boolean;
        entity_id: string | null;
        business_id: string | null;
        businesses: {
            business_id: string;
            name: string;
            tin: string;
            is_active: boolean;
        }[];
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<import("../users/entities/user.entity").User>;
    resendVerification(resendVerificationDto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
    syncBusinesses(req: any): Promise<any>;
    logout(res: Response): Promise<{
        message: string;
    }>;
    testEmail(email: string): Promise<{
        message: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
    }>;
    testEmailConnection(): Promise<{
        connected: boolean;
        message: string;
    }>;
}
