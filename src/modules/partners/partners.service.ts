import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database';
import { InvoiceService } from '../invoice/invoice.service';

export interface ProxyResult {
  ok: boolean;
  data?: any;
}

@Injectable()
export class PartnersService {
  private readonly logger = new Logger(PartnersService.name);
  constructor(private readonly prisma: PrismaService, private readonly invoiceService: InvoiceService) {}

  async createOrRotateKeys(userId: number): Promise<{ apiKey: string; apiSecret: string }> {
    await this.ensurePartner(userId);
    const apiKey = this.generateToken();
    const apiSecret = this.generateToken();

    const existing = await (this.prisma as any).partnerApiCredential.findUnique({ where: { userId } });
    if (existing) {
      await (this.prisma as any).partnerApiCredential.update({ where: { userId }, data: { apiKey, apiSecret, isActive: true } });
    } else {
      await (this.prisma as any).partnerApiCredential.create({ data: { userId, apiKey, apiSecret } });
    }
    return { apiKey, apiSecret };
  }

  async getKeys(userId: number): Promise<{ apiKey: string; apiSecret: string } | null> {
    await this.ensurePartner(userId);
    const cred = await (this.prisma as any).partnerApiCredential.findUnique({ where: { userId } });
    if (!cred) return null;
    return { apiKey: cred.apiKey, apiSecret: cred.apiSecret };
  }

  async proxyValidateInvoice(userId: number, payload: any): Promise<ProxyResult> {
    const endpoint = '/api/v1/invoice/validate';
    try {
      this.logger.log(`Partner validate invoice request`);
      const result = await this.invoiceService.validateInvoice(payload);
      await this.saveLog(userId, 'POST', endpoint, payload, 200, result);
      this.logger.log(`Partner validate invoice success`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Partner validate invoice failed`, error.stack);
      await this.saveLog(userId, 'POST', endpoint, payload, 500, { message: error.message });
      throw new Error(`Failed to validate invoice: ${error.message}`);
    }
  }

  async proxySignInvoice(userId: number, payload: any): Promise<ProxyResult> {
    const endpoint = '/api/v1/invoice/sign';
    try {
      this.logger.log(`Partner sign invoice request`);
      const result = await this.invoiceService.signInvoice(payload);
      await this.saveLog(userId, 'POST', endpoint, payload, 200, result);
      this.logger.log(`Partner sign invoice success`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Partner sign invoice failed`, error.stack);
      await this.saveLog(userId, 'POST', endpoint, payload, 500, { message: error.message });
      throw new Error(`Failed to sign invoice: ${error.message}`);
    }
    }

  async proxyConfirmInvoice(userId: number, irn: string): Promise<ProxyResult> {
    const endpoint = `/api/v1/invoice/confirm/${irn}`;
    try {
      this.logger.log(`Partner confirm invoice request for IRN: ${irn}`);
      const result = await this.invoiceService.getInvoiceConfirmation(irn);
      await this.saveLog(userId, 'GET', endpoint, undefined, 200, result);
      this.logger.log(`Partner confirm invoice success for IRN: ${irn}`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Partner confirm invoice failed for IRN: ${irn}`, error.stack);
      await this.saveLog(userId, 'GET', endpoint, undefined, 500, { message: error.message });
      throw new Error(`Failed to confirm invoice: ${error.message}`);
    }
  }

  async proxyValidateIrn(userId: number, payload: any): Promise<ProxyResult> {
    const endpoint = '/api/v1/invoice/irn/validate';
    try {
      this.logger.log(`Partner validate IRN request`);
      const result = await this.invoiceService.validateIrn(payload);
      await this.saveLog(userId, 'POST', endpoint, payload, 200, result);
      this.logger.log(`Partner validate IRN success`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Partner validate IRN failed`, error.stack);
      await this.saveLog(userId, 'POST', endpoint, payload, 500, { message: error.message });
      throw new Error(`Failed to validate IRN: ${error.message}`);
    }
  }

  async proxyTransmitSelfHealthCheck(userId: number): Promise<ProxyResult> {
    const endpoint = '/api/v1/invoice/transmit/self-health-check';
    try {
      this.logger.log('Partner transmit self health check request');
      const result = await this.invoiceService.transmitSelfHealthCheck();
      await this.saveLog(userId, 'GET', endpoint, undefined, 200, result);
      this.logger.log('Partner transmit self health check success');
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error('Partner transmit self health check failed', error.stack);
      await this.saveLog(userId, 'GET', endpoint, undefined, 500, { message: error.message });
      throw new Error(`Failed to transmit self health check: ${error.message}`);
    }
  }

  async proxyTransmitLookupIrn(userId: number, irn: string): Promise<ProxyResult> {
    const endpoint = `/api/v1/invoice/transmit/lookup/${irn}`;
    try {
      this.logger.log(`Partner transmit lookup IRN request: ${irn}`);
      const result = await this.invoiceService.transmitLookupIrn(irn);
      await this.saveLog(userId, 'GET', endpoint, undefined, 200, result);
      this.logger.log(`Partner transmit lookup IRN success: ${irn}`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Partner transmit lookup IRN failed: ${irn}`, error.stack);
      await this.saveLog(userId, 'GET', endpoint, undefined, 500, { message: error.message });
      throw new Error(`Failed to transmit lookup IRN: ${error.message}`);
    }
  }

  async proxyTransmitLookupTin(userId: number, tin: string): Promise<ProxyResult> {
    const endpoint = `/api/v1/invoice/transmit/lookup/tin/${tin}`;
    try {
      this.logger.log(`Partner transmit lookup TIN request: ${tin}`);
      const result = await this.invoiceService.transmitLookupTin(tin);
      await this.saveLog(userId, 'GET', endpoint, undefined, 200, result);
      this.logger.log(`Partner transmit lookup TIN success: ${tin}`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Partner transmit lookup TIN failed: ${tin}`, error.stack);
      await this.saveLog(userId, 'GET', endpoint, undefined, 500, { message: error.message });
      throw new Error(`Failed to transmit lookup TIN: ${error.message}`);
    }
  }

  async proxyTransmitInvoice(userId: number, irn: string): Promise<ProxyResult> {
    const endpoint = `/api/v1/invoice/transmit/${irn}`;
    try {
      this.logger.log(`Partner transmit invoice request: ${irn}`);
      const result = await this.invoiceService.transmitInvoice(irn);
      await this.saveLog(userId, 'POST', endpoint, undefined, 200, result);
      this.logger.log(`Partner transmit invoice success: ${irn}`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Partner transmit invoice failed: ${irn}`, error.stack);
      await this.saveLog(userId, 'POST', endpoint, undefined, 500, { message: error.message });
      throw new Error(`Failed to transmit invoice: ${error.message}`);
    }
  }

  async proxyTransmitConfirmReceipt(userId: number, irn: string): Promise<ProxyResult> {
    const endpoint = `/api/v1/invoice/transmit/${irn}`;
    try {
      this.logger.log(`Partner transmit confirm receipt request: ${irn}`);
      const result = await this.invoiceService.transmitConfirmReceipt(irn);
      await this.saveLog(userId, 'PATCH', endpoint, undefined, 200, result);
      this.logger.log(`Partner transmit confirm receipt success: ${irn}`);
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error(`Partner transmit confirm receipt failed: ${irn}`, error.stack);
      await this.saveLog(userId, 'PATCH', endpoint, undefined, 500, { message: error.message });
      throw new Error(`Failed to transmit confirm receipt: ${error.message}`);
    }
  }

  async proxyTransmitPullInvoice(userId: number): Promise<ProxyResult> {
    const endpoint = '/api/v1/invoice/transmit/pull';
    try {
      this.logger.log('Partner transmit pull invoice request');
      const result = await this.invoiceService.transmitPullInvoice();
      await this.saveLog(userId, 'GET', endpoint, undefined, 200, result);
      this.logger.log('Partner transmit pull invoice success');
      return { ok: true, data: result };
    } catch (error: any) {
      this.logger.error('Partner transmit pull invoice failed', error.stack);
      await this.saveLog(userId, 'GET', endpoint, undefined, 500, { message: error.message });
      throw new Error(`Failed to transmit pull invoice: ${error.message}`);
    }
  }

  async getLogs(userId: number, page: number = 1, limit: number = 10) {
    await this.ensurePartner(userId);
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      (this.prisma as any).partnerApiLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      (this.prisma as any).partnerApiLog.count({ where: { userId } }),
    ]);
    return { logs, total, page, limit };
  }

  private async saveLog(userId: number, method: string, endpoint: string, requestBody: any, responseStatus: number, responseBody: any): Promise<void> {
    await (this.prisma as any).partnerApiLog.create({
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

  private async ensurePartner(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || (user as any).role !== 'USER') {
      throw new ForbiddenException('Only partners may access this resource');
    }
  }

  private generateToken(length: number = 48): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
}


