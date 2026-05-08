import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TenantsService } from "./tenants.service";
import { ApiKeyAuthGuard } from "./security/api-key-auth.guard";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ValidateInvoiceDto, ValidateIrnDto } from "./dtos";
import { CurrentUser, Public } from "../../common/decorators";

@ApiTags("Tenants")
@Controller("api/v1/tenants")
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  // Tenant APIs via API Key/Secret headers
  @Post("invoice/validate")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async validateInvoice(
    @Body() payload: ValidateInvoiceDto,
    @Param() _p: any,
    @Query() _q: any,
    @CurrentUser() req: any,
  ) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyValidateInvoice(
      userId,
      payload,
    );
    return result.data ?? { ok: true };
  }

  @Post("invoice/sign")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signInvoice(
    @Body() payload: ValidateInvoiceDto,
    @CurrentUser() req: any,
  ) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxySignInvoice(userId, payload);
    return result.data ?? { ok: true };
  }

  @Get("invoice/confirm/:irn")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async confirmInvoice(@Param("irn") irn: string, @CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyConfirmInvoice(userId, irn);
    return result.data;
  }

  // --- Exchange E-Invoice Transmit APIs (Tenant) ---

  @Get("invoice/transmit/self-health-check")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async transmitSelfHealthCheck(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result =
      await this.tenantsService.proxyTransmitSelfHealthCheck(userId);
    return result.data;
  }

  @Get("invoice/transmit/lookup/tin/:tin")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async transmitLookupTin(@Param("tin") tin: string, @CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyTransmitLookupTin(
      userId,
      tin,
    );
    return result.data;
  }

  @Get("invoice/transmit/lookup/:irn")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async transmitLookupIrn(@Param("irn") irn: string, @CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyTransmitLookupIrn(
      userId,
      irn,
    );
    return result.data;
  }

  @Get("invoice/transmit/pull")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async transmitPullInvoice(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyTransmitPullInvoice(userId);
    return result.data;
  }

  @Post("invoice/transmit/:irn")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async transmitInvoice(@Param("irn") irn: string, @CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyTransmitInvoice(userId, irn);
    return result.data;
  }

  @Patch("invoice/transmit/:irn")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async transmitConfirmReceipt(
    @Param("irn") irn: string,
    @CurrentUser() req: any,
  ) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyTransmitConfirmReceipt(
      userId,
      irn,
    );
    return result.data;
  }

  @Post("invoice/irn/validate")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async validateIrn(@Body() payload: ValidateIrnDto, @CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyValidateIrn(userId, payload);
    return result.data ?? { ok: true };
  }

  // Key management (JWT, role must be TENANT handled at business layer)
  @Post("keys")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createOrRotateKeys(@CurrentUser() req: any) {
    const userId: number = req.id;
    // Optionally verify role from Users table
    const keys = await this.tenantsService.createOrRotateKeys(userId);
    return keys;
  }

  @Get("keys")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getKeys(@CurrentUser() req: any) {
    const userId: number = req.id;
    const keys = await this.tenantsService.getKeys(userId);
    return keys;
  }

  @Get("logs")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getLogs(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @CurrentUser() req: any,
  ) {
    const userId: number = req.id;
    const result = await this.tenantsService.getLogs(
      userId,
      Number(page) || 1,
      Number(limit) || 10,
    );
    return result;
  }
}
