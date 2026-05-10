"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcryptjs");
const mail_service_1 = require("../../shared/email/mail.service");
const database_1 = require("../../database");
const axios_1 = require("axios");
let AuthService = AuthService_1 = class AuthService {
    userService;
    jwtService;
    emailService;
    prisma;
    logger = new common_1.Logger(AuthService_1.name);
    firsApiUrl = process.env.FIRS_API_URL ?? "";
    firsApiKey = process.env.FIRS_API_KEY ?? "";
    firsApiSecret = process.env.FIRS_API_SECRET ?? "";
    constructor(userService, jwtService, emailService, prisma) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.prisma = prisma;
    }
    async buildBusinessContext(userId) {
        const entity = await this.prisma.entity.findFirst({
            where: { userId },
            include: { businesses: true },
        });
        const businesses = (entity?.businesses ?? []).map((business) => ({
            business_id: business.id,
            name: business.name,
            tin: business.tin,
            is_active: business.isActive,
        }));
        return {
            entityId: entity?.id ?? null,
            business_id: businesses[0]?.business_id ?? null,
            businesses,
        };
    }
    sanitizeUserProfile(user) {
        const { password, emailVerificationToken, emailVerificationExpires, ...safeUser } = user;
        return safeUser;
    }
    extractIrnTemplate(irnTemplate) {
        if (!irnTemplate)
            return irnTemplate;
        const match = irnTemplate.match(/\{\{.*?\}\}-([A-Z0-9]+)-\{\{.*?\}\}/);
        return match ? match[1] : irnTemplate;
    }
    async register(registerUserDto) {
        try {
            const existingUser = await this.userService.findUserByEmail(registerUserDto.email);
            if (existingUser) {
                throw new common_1.UnauthorizedException("User already exists");
            }
            const user = await this.userService.createUserLightweight(registerUserDto);
            const payload = {
                sub: user.id,
                email: user.email,
                entityId: "",
                businessName: "",
            };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                },
                isProfileComplete: false,
                entity_id: null,
                business_id: null,
                businesses: [],
            };
        }
        catch (error) {
            throw error;
        }
    }
    async completeProfile(userId, completeProfileDto) {
        const user = await this.userService.completeProfile(userId, completeProfileDto);
        if (user.entityId) {
            try {
                await this.fetchAndSaveEntityData(user.entityId, user.id);
            }
            catch (fetchError) {
                this.logger.warn(`Could not sync entity data during profile completion: ${fetchError.message}. Proceeding anyway.`);
            }
        }
        const businessContext = await this.buildBusinessContext(user.id);
        const payload = {
            sub: user.id,
            email: user.email,
            entityId: user.entityId ?? "",
            businessName: user.businessName ?? "",
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                businessName: user.businessName,
            },
            isProfileComplete: true,
            entity_id: businessContext.entityId ?? user.entityId ?? null,
            business_id: businessContext.business_id,
            businesses: businessContext.businesses,
        };
    }
    async login(loginDto) {
        try {
            const user = await this.userService.findUserByEmail(loginDto.email);
            if (!user) {
                throw new common_1.UnauthorizedException("Invalid credentials");
            }
            if (!user.isActive) {
                throw new common_1.UnauthorizedException("Account is deactivated");
            }
            if (!user.isEmailVerified) {
                throw new common_1.UnauthorizedException("Email is not verified");
            }
            const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException("Invalid email or password");
            }
            const payload = {
                sub: user.id,
                email: user.email,
                entityId: user.entityId ?? "",
                businessName: user.businessName ?? "",
            };
            if (user.entityId) {
                try {
                    await this.fetchAndSaveEntityData(user.entityId, user.id);
                }
                catch (fetchError) {
                    this.logger.warn(`Could not sync entity data with FIRS during login for user ${user.id}: ${fetchError.message}. Returning last known business records.`);
                }
            }
            const businessContext = await this.buildBusinessContext(user.id);
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    businessName: user.businessName,
                },
                isProfileComplete: user.isProfileComplete ?? false,
                entity_id: businessContext.entityId ?? user.entityId ?? null,
                business_id: businessContext.business_id,
                businesses: businessContext.businesses,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async verifyEmail(verifyEmailDto) {
        const user = await this.userService.verifyEmail(verifyEmailDto.token);
        try {
            await this.emailService.sendWelcomeEmail(user.email, {
                businessName: user?.businessName ?? "",
                email: user.email ?? "",
                loginUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login`,
            });
        }
        catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
        }
        return user;
    }
    async resendVerification(resendVerificationDto) {
        try {
            const verificationToken = await this.userService.generateNewVerificationToken(resendVerificationDto.email);
            const user = await this.userService.findUserByEmail(resendVerificationDto.email);
            if (!user) {
                throw new common_1.BadRequestException("User not found");
            }
            await this.emailService.sendVerificationEmail(user.email, {
                businessName: user.businessName ?? "",
                verificationToken,
                verificationUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${verificationToken}`,
            });
            return {
                message: "Verification email sent! Please check your inbox.",
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException("Failed to resend verification email");
        }
    }
    async validateUser(payload) {
        return await this.userService.findUserById(payload.id);
    }
    async getProfile(userId) {
        const user = await this.userService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        const businessContext = await this.buildBusinessContext(userId);
        const safeUser = this.sanitizeUserProfile(user);
        return {
            ...safeUser,
            isProfileComplete: safeUser.isProfileComplete ?? false,
            entityId: businessContext.entityId ?? safeUser.entityId ?? null,
            business_id: businessContext.business_id,
            businesses: businessContext.businesses,
        };
    }
    async syncEntityBusinesses(userId) {
        const user = await this.userService.findUserById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        if (!user.entityId) {
            throw new common_1.BadRequestException("No entity ID is linked to this user. Register an entity first.");
        }
        await this.fetchAndSaveEntityData(user.entityId, user.id);
        const businessContext = await this.buildBusinessContext(userId);
        return {
            message: "Entity businesses synced successfully.",
            entity_id: businessContext.entityId ?? user.entityId,
            business_id: businessContext.business_id,
            businesses: businessContext.businesses,
        };
    }
    async requestPasswordReset(email) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            return {
                message: "If an account with that email exists, a password reset link has been sent.",
            };
        }
        const resetToken = this.jwtService.sign({ sub: user.id, type: "password-reset" }, { expiresIn: "1h" });
        try {
            await this.emailService.sendPasswordResetEmail(user.email, {
                businessName: user.businessName ?? "",
                resetToken,
                resetUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`,
                expiresIn: "1 hour",
            });
        }
        catch (emailError) {
            console.error("Failed to send password reset email:", emailError);
            throw new common_1.InternalServerErrorException("Failed to send password reset email");
        }
        return {
            message: "If an account with that email exists, a password reset link has been sent.",
        };
    }
    async fetchAndSaveEntityData(entityId, userId) {
        if (!this.firsApiUrl || !this.firsApiKey || !this.firsApiSecret) {
            throw new common_1.InternalServerErrorException("FIRS API credentials are not set in environment variables");
        }
        const url = `${this.firsApiUrl}/api/v1/entity/${entityId}`;
        try {
            this.logger.log(`Fetching entity data from FIRS for entityId: ${entityId}`);
            const response = await axios_1.default.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": this.firsApiKey,
                    "x-api-secret": this.firsApiSecret,
                },
            });
            const entityData = response.data.data;
            if (!entityData) {
                throw new common_1.BadGatewayException("No entity data received from FIRS API");
            }
            this.logger.log(`Successfully fetched entity data for entityId: ${entityId}`);
            const existingEntity = await this.prisma.entity.findFirst({
                where: { userId },
            });
            if (existingEntity) {
                this.logger.log(`Entity already exists for user ${userId}, updating...`);
                const updatedEntity = await this.prisma.entity.update({
                    where: { id: existingEntity.id },
                    data: {
                        reference: entityData.reference,
                        customSettings: entityData.custom_settings
                            ? JSON.stringify(entityData.custom_settings)
                            : null,
                        isActive: entityData.is_active,
                        appReference: entityData.app_reference,
                        updatedAt: new Date(),
                    },
                    include: {
                        businesses: true,
                    },
                });
                await this.prisma.business.deleteMany({
                    where: { entityId: existingEntity.id },
                });
                if (entityData.businesses && entityData.businesses.length > 0) {
                    await this.prisma.business.createMany({
                        data: entityData.businesses.map((business) => ({
                            id: business.id,
                            reference: business.reference,
                            name: business.name,
                            customSettings: business.custom_settings
                                ? JSON.stringify(business.custom_settings)
                                : null,
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
            }
            else {
                this.logger.log(`Creating new entity for user ${userId}`);
                const newEntity = await this.prisma.entity.create({
                    data: {
                        id: entityData.id,
                        reference: entityData.reference,
                        customSettings: entityData.custom_settings
                            ? JSON.stringify(entityData.custom_settings)
                            : null,
                        isActive: entityData.is_active,
                        appReference: entityData.app_reference,
                        createdAt: new Date(entityData.created_at),
                        updatedAt: new Date(entityData.updated_at),
                        userId: userId,
                        businesses: {
                            create: entityData.businesses?.map((business) => ({
                                id: business.id,
                                reference: business.reference,
                                name: business.name,
                                customSettings: business.custom_settings
                                    ? JSON.stringify(business.custom_settings)
                                    : null,
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
        }
        catch (error) {
            this.logger.error(`Failed to fetch and save entity data for entityId: ${entityId}`, error.stack);
            if (error.response) {
                throw new common_1.BadGatewayException(`Failed to fetch entity from FIRS: ${error.response.status} ${JSON.stringify(error.response.data)}`);
            }
            throw new common_1.BadGatewayException(`Failed to fetch and save entity data: ${error.message}`);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mail_service_1.EmailService,
        database_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map