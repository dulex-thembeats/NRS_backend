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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const dtos_1 = require("../users/dtos");
const dtos_2 = require("./dtos");
const decorators_1 = require("../../common/decorators");
const mail_service_1 = require("../../shared/email/mail.service");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const rate_limit_guard_1 = require("../../common/guards/rate-limit.guard");
let AuthController = class AuthController {
    authService;
    emailService;
    constructor(authService, emailService) {
        this.authService = authService;
        this.emailService = emailService;
    }
    async register(registerUserDto) {
        return this.authService.register(registerUserDto);
    }
    async completeProfile(req, completeProfileDto) {
        return this.authService.completeProfile(req.id, completeProfileDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async verifyEmail(verifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto);
    }
    async resendVerification(resendVerificationDto) {
        return this.authService.resendVerification(resendVerificationDto);
    }
    async forgotPassword(email) {
        return this.authService.requestPasswordReset(email);
    }
    async getProfile(req) {
        const user = await this.authService.getProfile(req.id);
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        return user;
    }
    async syncBusinesses(req) {
        return this.authService.syncEntityBusinesses(req.id);
    }
    async logout() {
        return { message: "Successfully logged out" };
    }
    async testEmail(email) {
        try {
            await this.emailService.sendCustomEmail(email, "Test Email", "<h1>Test Email</h1><p>If you receive this, email is working!</p>");
            return { message: "Test email sent successfully!" };
        }
        catch (error) {
            return { message: "Failed to send test email", error: error.message };
        }
    }
    async testEmailConnection() {
        const isConnected = await this.emailService.testConnection();
        return {
            connected: isConnected,
            message: isConnected
                ? "Email service is working!"
                : "Email service connection failed",
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("complete-profile"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CompleteProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeProfile", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)("verify-email"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)("resend-verification"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.ResendVerificationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)("forgot-password"),
    __param(0, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Get)("profile"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)("sync-businesses"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "syncBusinesses", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)("test-email"),
    __param(0, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testEmail", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)("test-email-connection"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testEmailConnection", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("api/v1/auth"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mail_service_1.EmailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map