import { PrismaService } from "../../database";
import { EmailService } from "../../shared/email/mail.service";
import { CreateUserDto, UpdateUserDto, RegisterUserDto, CompleteProfileDto } from "./dtos";
import { User } from "./entities/user.entity";
export declare class UsersService {
    private readonly prisma;
    private readonly emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    createUser(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        user: User;
        password: string;
    }>;
    createUserLightweight(registerUserDto: RegisterUserDto): Promise<User>;
    completeProfile(userId: number, completeProfileDto: CompleteProfileDto): Promise<User>;
    findAllUsers(): Promise<any[]>;
    findUserById(id: number): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<{
        isEmailVerified: boolean;
        isActive: boolean;
        entityId: string | null;
        id: number;
        email: string;
        password: string;
        businessName: string | null;
        businessAddress: string | null;
        rcNumber: string | null;
        role: import(".prisma/client").$Enums.Role;
        dateOfIncorporation: Date | null;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
        isProfileComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<void>;
    findByEmailAndOtp(email: string, otp: string): Promise<User | null>;
    verifyEmail(email: string, otp: string): Promise<User>;
    generateNewVerificationToken(email: string): Promise<string>;
    private mapPrismaUserToEntity;
}
