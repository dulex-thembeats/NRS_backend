import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto } from "./dtos";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<import("./entities/user.entity").User>;
    create(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        user: import("./entities/user.entity").User;
        password: string;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
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
    remove(id: number): Promise<{
        message: string;
    }>;
}
