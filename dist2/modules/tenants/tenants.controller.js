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
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tenants_service_1 = require("./tenants.service");
const api_key_auth_guard_1 = require("./security/api-key-auth.guard");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
const rate_limit_guard_1 = require("../../common/guards/rate-limit.guard");
const dtos_1 = require("./dtos");
const decorators_1 = require("../../common/decorators");
let TenantsController = class TenantsController {
    tenantsService;
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    async validateInvoice(payload, req) {
        const userId = req.id;
        const result = await this.tenantsService.proxyValidateInvoice(userId, payload);
        return result.data ?? { ok: true };
    }
    async signInvoice(payload, req) {
        const userId = req.id;
        const result = await this.tenantsService.proxySignInvoice(userId, payload);
        return result.data ?? { ok: true };
    }
    async confirmInvoice(irn, req) {
        const userId = req.id;
        const result = await this.tenantsService.proxyConfirmInvoice(userId, irn);
        return result.data;
    }
    async transmitSelfHealthCheck(req) {
        const userId = req.id;
        const result = await this.tenantsService.proxyTransmitSelfHealthCheck(userId);
        return result.data;
    }
    async transmitLookupTin(tin, req) {
        const userId = req.id;
        const result = await this.tenantsService.proxyTransmitLookupTin(userId, tin);
        return result.data;
    }
    async transmitLookupIrn(irn, req) {
        const userId = req.id;
        const result = await this.tenantsService.proxyTransmitLookupIrn(userId, irn);
        return result.data;
    }
    async transmitPullInvoice(req) {
        const userId = req.id;
        const result = await this.tenantsService.proxyTransmitPullInvoice(userId);
        return result.data;
    }
    async transmitInvoice(irn, req) {
        const userId = req.id;
        const result = await this.tenantsService.proxyTransmitInvoice(userId, irn);
        return result.data;
    }
    async transmitConfirmReceipt(irn, req) {
        const userId = req.id;
        const result = await this.tenantsService.proxyTransmitConfirmReceipt(userId, irn);
        return result.data;
    }
    async validateIrn(payload, req) {
        const userId = req.id;
        const result = await this.tenantsService.proxyValidateIrn(userId, payload);
        return result.data ?? { ok: true };
    }
    async createOrRotateKeys(req) {
        const userId = req.id;
        const keys = await this.tenantsService.createOrRotateKeys(userId);
        return keys;
    }
    async getKeys(req) {
        const userId = req.id;
        const keys = await this.tenantsService.getKeys(userId);
        return keys;
    }
    async getLogs(page = "1", limit = "10", req) {
        const userId = req.id;
        const result = await this.tenantsService.getLogs(userId, Number(page) || 1, Number(limit) || 10);
        return result;
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)("invoice/validate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ValidateInvoiceDto, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "validateInvoice", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)("invoice/sign"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ValidateInvoiceDto, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "signInvoice", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)("invoice/confirm/:irn"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard),
    __param(0, (0, common_1.Param)("irn")),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "confirmInvoice", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)("invoice/transmit/self-health-check"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "transmitSelfHealthCheck", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)("invoice/transmit/lookup/tin/:tin"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard),
    __param(0, (0, common_1.Param)("tin")),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "transmitLookupTin", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)("invoice/transmit/lookup/:irn"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard),
    __param(0, (0, common_1.Param)("irn")),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "transmitLookupIrn", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)("invoice/transmit/pull"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "transmitPullInvoice", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)("invoice/transmit/:irn"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard),
    __param(0, (0, common_1.Param)("irn")),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "transmitInvoice", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Patch)("invoice/transmit/:irn"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard),
    __param(0, (0, common_1.Param)("irn")),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "transmitConfirmReceipt", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)("invoice/irn/validate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(api_key_auth_guard_1.ApiKeyAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ValidateIrnDto, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "validateIrn", null);
__decorate([
    (0, common_1.Post)("keys"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "createOrRotateKeys", null);
__decorate([
    (0, common_1.Get)("keys"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getKeys", null);
__decorate([
    (0, common_1.Get)("logs"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getLogs", null);
exports.TenantsController = TenantsController = __decorate([
    (0, swagger_1.ApiTags)("Tenants"),
    (0, common_1.Controller)("api/v1/tenants"),
    (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map