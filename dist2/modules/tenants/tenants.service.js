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
var TenantsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../database");
const invoice_service_1 = require("../invoice/invoice.service");
let TenantsService = TenantsService_1 = class TenantsService {
    prisma;
    invoiceService;
    logger = new common_1.Logger(TenantsService_1.name);
    constructor(prisma, invoiceService) {
        this.prisma = prisma;
        this.invoiceService = invoiceService;
    }
    async createOrRotateKeys(userId) {
        await this.ensureTenant(userId);
        const apiKey = this.generateToken();
        const apiSecret = this.generateToken();
        const existing = await this.prisma.tenantApiCredential.findUnique({
            where: { userId },
        });
        if (existing) {
            await this.prisma.tenantApiCredential.update({
                where: { userId },
                data: { apiKey, apiSecret, isActive: true },
            });
        }
        else {
            await this.prisma.tenantApiCredential.create({
                data: { userId, apiKey, apiSecret },
            });
        }
        return { apiKey, apiSecret };
    }
    async getKeys(userId) {
        await this.ensureTenant(userId);
        const cred = await this.prisma.tenantApiCredential.findUnique({
            where: { userId },
        });
        if (!cred)
            return null;
        return { apiKey: cred.apiKey, apiSecret: cred.apiSecret };
    }
    async proxyValidateInvoice(userId, payload) {
        const endpoint = "/api/v1/invoice/validate";
        try {
            this.logger.log(`Tenant validate invoice request`);
            const result = await this.invoiceService.validateInvoice(payload);
            await this.saveLog(userId, "POST", endpoint, payload, 200, result);
            this.logger.log(`Tenant validate invoice success`);
            return { ok: true, data: result };
        }
        catch (error) {
            this.logger.error(`Tenant validate invoice failed`, error.stack);
            await this.saveLog(userId, "POST", endpoint, payload, 500, {
                message: error.message,
            });
            throw new common_1.BadGatewayException(`Failed to validate invoice: ${error.message}`);
        }
    }
    async proxySignInvoice(userId, payload) {
        const endpoint = "/api/v1/invoice/sign";
        try {
            this.logger.log(`Tenant sign invoice request`);
            const result = await this.invoiceService.signInvoice(payload);
            await this.saveLog(userId, "POST", endpoint, payload, 200, result);
            this.logger.log(`Tenant sign invoice success`);
            return { ok: true, data: result };
        }
        catch (error) {
            this.logger.error(`Tenant sign invoice failed`, error.stack);
            await this.saveLog(userId, "POST", endpoint, payload, 500, {
                message: error.message,
            });
            throw new common_1.BadGatewayException(`Failed to sign invoice: ${error.message}`);
        }
    }
    async proxyConfirmInvoice(userId, irn) {
        const endpoint = `/api/v1/invoice/confirm/${irn}`;
        try {
            this.logger.log(`Tenant confirm invoice request for IRN: ${irn}`);
            const result = await this.invoiceService.getInvoiceConfirmation(irn);
            await this.saveLog(userId, "GET", endpoint, undefined, 200, result);
            this.logger.log(`Tenant confirm invoice success for IRN: ${irn}`);
            return { ok: true, data: result };
        }
        catch (error) {
            this.logger.error(`Tenant confirm invoice failed for IRN: ${irn}`, error.stack);
            await this.saveLog(userId, "GET", endpoint, undefined, 500, {
                message: error.message,
            });
            throw new common_1.BadGatewayException(`Failed to confirm invoice: ${error.message}`);
        }
    }
    async proxyValidateIrn(userId, payload) {
        const endpoint = "/api/v1/invoice/irn/validate";
        try {
            this.logger.log(`Tenant validate IRN request`);
            const result = await this.invoiceService.validateIrn(payload);
            await this.saveLog(userId, "POST", endpoint, payload, 200, result);
            this.logger.log(`Tenant validate IRN success`);
            return { ok: true, data: result };
        }
        catch (error) {
            this.logger.error(`Tenant validate IRN failed`, error.stack);
            await this.saveLog(userId, "POST", endpoint, payload, 500, {
                message: error.message,
            });
            throw new common_1.BadGatewayException(`Failed to validate IRN: ${error.message}`);
        }
    }
    async proxyTransmitSelfHealthCheck(userId) {
        const endpoint = "/api/v1/invoice/transmit/self-health-check";
        try {
            this.logger.log("Tenant transmit self health check request");
            const result = await this.invoiceService.transmitSelfHealthCheck();
            await this.saveLog(userId, "GET", endpoint, undefined, 200, result);
            this.logger.log("Tenant transmit self health check success");
            return { ok: true, data: result };
        }
        catch (error) {
            this.logger.error("Tenant transmit self health check failed", error.stack);
            await this.saveLog(userId, "GET", endpoint, undefined, 500, {
                message: error.message,
            });
            throw new common_1.BadGatewayException(`Failed to transmit self health check: ${error.message}`);
        }
    }
    async proxyTransmitLookupIrn(userId, irn) {
        const endpoint = `/api/v1/invoice/transmit/lookup/${irn}`;
        try {
            this.logger.log(`Tenant transmit lookup IRN request: ${irn}`);
            const result = await this.invoiceService.transmitLookupIrn(irn);
            await this.saveLog(userId, "GET", endpoint, undefined, 200, result);
            this.logger.log(`Tenant transmit lookup IRN success: ${irn}`);
            return { ok: true, data: result };
        }
        catch (error) {
            this.logger.error(`Tenant transmit lookup IRN failed: ${irn}`, error.stack);
            await this.saveLog(userId, "GET", endpoint, undefined, 500, {
                message: error.message,
            });
            throw new common_1.BadGatewayException(`Failed to transmit lookup IRN: ${error.message}`);
        }
    }
    async proxyTransmitLookupTin(userId, tin) {
        const endpoint = `/api/v1/invoice/transmit/lookup/tin/${tin}`;
        try {
            this.logger.log(`Tenant transmit lookup TIN request: ${tin}`);
            const result = await this.invoiceService.transmitLookupTin(tin);
            await this.saveLog(userId, "GET", endpoint, undefined, 200, result);
            this.logger.log(`Tenant transmit lookup TIN success: ${tin}`);
            return { ok: true, data: result };
        }
        catch (error) {
            this.logger.error(`Tenant transmit lookup TIN failed: ${tin}`, error.stack);
            await this.saveLog(userId, "GET", endpoint, undefined, 500, {
                message: error.message,
            });
            throw new common_1.BadGatewayException(`Failed to transmit lookup TIN: ${error.message}`);
        }
    }
    async proxyTransmitInvoice(userId, irn) {
        const endpoint = `/api/v1/invoice/transmit/${irn}`;
        try {
            this.logger.log(`Tenant transmit invoice request: ${irn}`);
            const result = await this.invoiceService.transmitInvoice(irn);
            await this.saveLog(userId, "POST", endpoint, undefined, 200, result);
            this.logger.log(`Tenant transmit invoice success: ${irn}`);
            return { ok: true, data: result };
        }
        catch (error) {
            this.logger.error(`Tenant transmit invoice failed: ${irn}`, error.stack);
            const responseStatus = error instanceof common_1.HttpException ? error.getStatus() : 500;
            await this.saveLog(userId, "POST", endpoint, undefined, responseStatus, {
                message: error.message,
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.BadGatewayException(`Failed to transmit invoice: ${error.message}`);
        }
    }
    async proxyTransmitConfirmReceipt(userId, irn) {
        const endpoint = `/api/v1/invoice/transmit/${irn}`;
        try {
            this.logger.log(`Tenant transmit confirm receipt request: ${irn}`);
            const result = await this.invoiceService.transmitConfirmReceipt(irn);
            await this.saveLog(userId, "PATCH", endpoint, undefined, 200, result);
            this.logger.log(`Tenant transmit confirm receipt success: ${irn}`);
            return { ok: true, data: result };
        }
        catch (error) {
            this.logger.error(`Tenant transmit confirm receipt failed: ${irn}`, error.stack);
            await this.saveLog(userId, "PATCH", endpoint, undefined, 500, {
                message: error.message,
            });
            throw new common_1.BadGatewayException(`Failed to transmit confirm receipt: ${error.message}`);
        }
    }
    async proxyTransmitPullInvoice(userId) {
        const endpoint = "/api/v1/invoice/transmit/pull";
        try {
            this.logger.log("Tenant transmit pull invoice request");
            const result = await this.invoiceService.transmitPullInvoice();
            await this.saveLog(userId, "GET", endpoint, undefined, 200, result);
            this.logger.log("Tenant transmit pull invoice success");
            return { ok: true, data: result };
        }
        catch (error) {
            this.logger.error("Tenant transmit pull invoice failed", error.stack);
            await this.saveLog(userId, "GET", endpoint, undefined, 500, {
                message: error.message,
            });
            throw new common_1.BadGatewayException(`Failed to transmit pull invoice: ${error.message}`);
        }
    }
    async getLogs(userId, page = 1, limit = 10) {
        await this.ensureTenant(userId);
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            this.prisma.tenantApiLog.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            this.prisma.tenantApiLog.count({ where: { userId } }),
        ]);
        return { logs, total, page, limit };
    }
    async saveLog(userId, method, endpoint, requestBody, responseStatus, responseBody) {
        await this.prisma.tenantApiLog.create({
            data: {
                userId,
                method,
                endpoint,
                requestBody: requestBody ? JSON.stringify(requestBody) : null,
                responseStatus,
                responseBody: responseBody ? JSON.stringify(responseBody) : null,
            },
        });
    }
    async ensureTenant(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== "TENANT") {
            throw new common_1.ForbiddenException("Only tenants may access this resource");
        }
    }
    generateToken(length = 48) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let token = "";
        for (let i = 0; i < length; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = TenantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        invoice_service_1.InvoiceService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map