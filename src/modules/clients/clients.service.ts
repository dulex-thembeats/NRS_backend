import { ForbiddenException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database";
import { InvoiceService } from "../invoice/invoice.service";

export interface ProxyResult {
  ok: boolean;
  data?: any;
}

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async createOrRotateKeys(
    userId: number,
  ): Promise<{ apiKey: string; apiSecret: string }> {
    await this.ensureClient(userId);
    const apiKey = this.generateToken();
    const apiSecret = this.generateToken();

    const existing = await (this.prisma as any).clientApiCredential.findUnique({
      where: { userId },
    });
    if (existing) {
      await (this.prisma as any).clientApiCredential.update({
        where: { userId },
        data: { apiKey, apiSecret, isActive: true },
      });
    } else {
      await (this.prisma as any).clientApiCredential.create({
        data: { userId, apiKey, apiSecret },
      });
    }
    return { apiKey, apiSecret };
  }

  async getKeys(
    userId: number,
  ): Promise<{ apiKey: string; apiSecret: string } | null> {
    await this.ensureClient(userId);
    const cred = await (this.prisma as any).clientApiCredential.findUnique({
      where: { userId },
    });
    if (!cred) return null;
    return { apiKey: cred.apiKey, apiSecret: cred.apiSecret };
  }

  async proxyValidateInvoice(
    userId: number,
    payload: any,
  ): Promise<ProxyResult> {
    const endpoint = "/api/v1/invoice/validate";
    try {
      this.logger.log(`Client validate invoice request`);
      const result = await this.invoiceService.validateInvoice(payload);
      await this.saveLog(userId, "POST", endpoint, payload, 200, result);
      this.logger.log(`Client validate invoice success`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Client validate invoice failed`, error.stack);
      await this.saveLog(userId, "POST", endpoint, payload, 500, {
        message: error.message,
      });
      throw new Error(`Failed to validate invoice: ${error.message}`);
    }
  }

  async proxySignInvoice(userId: number, payload: any): Promise<ProxyResult> {
    const endpoint = "/api/v1/invoice/sign";
    try {
      this.logger.log(`Client sign invoice request`);
      const result = await this.invoiceService.signInvoice(payload);
      await this.saveLog(userId, "POST", endpoint, payload, 200, result);
      this.logger.log(`Client sign invoice success`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Client sign invoice failed`, error.stack);
      await this.saveLog(userId, "POST", endpoint, payload, 500, {
        message: error.message,
      });
      throw new Error(`Failed to sign invoice: ${error.message}`);
    }
  }

  async proxyConfirmInvoice(userId: number, irn: string): Promise<ProxyResult> {
    const endpoint = `/api/v1/invoice/confirm/${irn}`;
    try {
      this.logger.log(`Client confirm invoice request for IRN: ${irn}`);
      const result = await this.invoiceService.getInvoiceConfirmation(irn);
      await this.saveLog(userId, "GET", endpoint, undefined, 200, result);
      this.logger.log(`Client confirm invoice success for IRN: ${irn}`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(
        `Client confirm invoice failed for IRN: ${irn}`,
        error.stack,
      );
      await this.saveLog(userId, "GET", endpoint, undefined, 500, {
        message: error.message,
      });
      throw new Error(`Failed to confirm invoice: ${error.message}`);
    }
  }

  async proxyValidateIrn(userId: number, payload: any): Promise<ProxyResult> {
    const endpoint = "/api/v1/invoice/irn/validate";
    try {
      this.logger.log(`Client validate IRN request`);
      const result = await this.invoiceService.validateIrn(payload);
      await this.saveLog(userId, "POST", endpoint, payload, 200, result);
      this.logger.log(`Client validate IRN success`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Client validate IRN failed`, error.stack);
      await this.saveLog(userId, "POST", endpoint, payload, 500, {
        message: error.message,
      });
      throw new Error(`Failed to validate IRN: ${error.message}`);
    }
  }

  async proxyTransmitSelfHealthCheck(userId: number): Promise<ProxyResult> {
    const endpoint = "/api/v1/invoice/transmit/self-health-check";
    try {
      this.logger.log("Client transmit self health check request");
      const result = await this.invoiceService.transmitSelfHealthCheck();
      await this.saveLog(userId, "GET", endpoint, undefined, 200, result);
      this.logger.log("Client transmit self health check success");
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(
        "Client transmit self health check failed",
        error.stack,
      );
      await this.saveLog(userId, "GET", endpoint, undefined, 500, {
        message: error.message,
      });
      throw new Error(`Failed to transmit self health check: ${error.message}`);
    }
  }

  async proxyTransmitLookupIrn(
    userId: number,
    irn: string,
  ): Promise<ProxyResult> {
    const endpoint = `/api/v1/invoice/transmit/lookup/${irn}`;
    try {
      this.logger.log(`Client transmit lookup IRN request: ${irn}`);
      const result = await this.invoiceService.transmitLookupIrn(irn);
      await this.saveLog(userId, "GET", endpoint, undefined, 200, result);
      this.logger.log(`Client transmit lookup IRN success: ${irn}`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(
        `Client transmit lookup IRN failed: ${irn}`,
        error.stack,
      );
      await this.saveLog(userId, "GET", endpoint, undefined, 500, {
        message: error.message,
      });
      throw new Error(`Failed to transmit lookup IRN: ${error.message}`);
    }
  }

  async proxyTransmitLookupTin(
    userId: number,
    tin: string,
  ): Promise<ProxyResult> {
    const endpoint = `/api/v1/invoice/transmit/lookup/tin/${tin}`;
    try {
      this.logger.log(`Client transmit lookup TIN request: ${tin}`);
      const result = await this.invoiceService.transmitLookupTin(tin);
      await this.saveLog(userId, "GET", endpoint, undefined, 200, result);
      this.logger.log(`Client transmit lookup TIN success: ${tin}`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(
        `Client transmit lookup TIN failed: ${tin}`,
        error.stack,
      );
      await this.saveLog(userId, "GET", endpoint, undefined, 500, {
        message: error.message,
      });
      throw new Error(`Failed to transmit lookup TIN: ${error.message}`);
    }
  }

  async proxyTransmitInvoice(
    userId: number,
    irn: string,
  ): Promise<ProxyResult> {
    const endpoint = `/api/v1/invoice/transmit/${irn}`;
    try {
      this.logger.log(`Client transmit invoice request: ${irn}`);
      const result = await this.invoiceService.transmitInvoice(irn);
      await this.saveLog(userId, "POST", endpoint, undefined, 200, result);
      this.logger.log(`Client transmit invoice success: ${irn}`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Client transmit invoice failed: ${irn}`, error.stack);
      await this.saveLog(userId, "POST", endpoint, undefined, 500, {
        message: error.message,
      });
      throw new Error(`Failed to transmit invoice: ${error.message}`);
    }
  }

  async proxyTransmitConfirmReceipt(
    userId: number,
    irn: string,
  ): Promise<ProxyResult> {
    const endpoint = `/api/v1/invoice/transmit/${irn}`;
    try {
      this.logger.log(`Client transmit confirm receipt request: ${irn}`);
      const result = await this.invoiceService.transmitConfirmReceipt(irn);
      await this.saveLog(userId, "PATCH", endpoint, undefined, 200, result);
      this.logger.log(`Client transmit confirm receipt success: ${irn}`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(
        `Client transmit confirm receipt failed: ${irn}`,
        error.stack,
      );
      await this.saveLog(userId, "PATCH", endpoint, undefined, 500, {
        message: error.message,
      });
      throw new Error(`Failed to transmit confirm receipt: ${error.message}`);
    }
  }

  async proxyTransmitPullInvoice(userId: number): Promise<ProxyResult> {
    const endpoint = "/api/v1/invoice/transmit/pull";
    try {
      this.logger.log("Client transmit pull invoice request");
      const result = await this.invoiceService.transmitPullInvoice();
      await this.saveLog(userId, "GET", endpoint, undefined, 200, result);
      this.logger.log("Client transmit pull invoice success");
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error("Client transmit pull invoice failed", error.stack);
      await this.saveLog(userId, "GET", endpoint, undefined, 500, {
        message: error.message,
      });
      throw new Error(`Failed to transmit pull invoice: ${error.message}`);
    }
  }

  async getLogs(userId: number, page: number = 1, limit: number = 10) {
    await this.ensureClient(userId);
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      (this.prisma as any).clientApiLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      (this.prisma as any).clientApiLog.count({ where: { userId } }),
    ]);
    return { logs, total, page, limit };
  }

  private async saveLog(
    userId: number,
    method: string,
    endpoint: string,
    requestBody: any,
    responseStatus: number,
    responseBody: any,
  ): Promise<void> {
    await (this.prisma as any).clientApiLog.create({
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

  private async ensureClient(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user as any).role !== "CLIENT") {
      throw new ForbiddenException("Only clients may access this resource");
    }
  }

  private generateToken(length: number = 48): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}
