// src/modules/users/entities/user.entity.ts

export class User {
  id: number;
  entityId?: string;
  email: string;
  password: string;
  businessName?: string;
  businessAddress?: string;
  rcNumber?: string;
  role: any; // Using any to avoid type conflicts with Prisma's Role enum
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
