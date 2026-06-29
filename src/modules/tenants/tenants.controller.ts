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
import { ApiTags, ApiHeader, ApiExcludeEndpoint } from "@nestjs/swagger";
import { TenantsService } from "./tenants.service";
import { ApiKeyAuthGuard } from "./security/api-key-auth.guard";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { Throttle } from "@nestjs/throttler";
import { ValidateInvoiceDto, ValidateIrnDto } from "./dtos";
import { CurrentUser, Public } from "../../common/decorators";

@ApiTags("Tenants")
@Controller("api/v1/tenants")
@Throttle({ default: { limit: 60, ttl: 60000 } })
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  // Tenant APIs via API Key/Secret headers
  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Post("invoice/validate")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async validateInvoice(
    @Body() payload: ValidateInvoiceDto,
    @CurrentUser() req: any,
  ) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyValidateInvoice(
      userId,
      payload,
    );
    return result.data ?? { ok: true };
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
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

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/confirm/:irn")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async confirmInvoice(@Param("irn") irn: string, @CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyConfirmInvoice(userId, irn);
    return result.data;
  }

  // --- Exchange E-Invoice Transmit APIs (Tenant) ---

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/transmit/self-health-check")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async transmitSelfHealthCheck(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result =
      await this.tenantsService.proxyTransmitSelfHealthCheck(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
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

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
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

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/transmit/pull")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async transmitPullInvoice(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyTransmitPullInvoice(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Post("invoice/transmit/:irn")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async transmitInvoice(@Param("irn") irn: string, @CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyTransmitInvoice(userId, irn);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
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

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Post("invoice/irn/validate")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async validateIrn(@Body() payload: ValidateIrnDto, @CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyValidateIrn(userId, payload);
    return result.data ?? { ok: true };
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/resources/tax-categories")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async getTaxCategories(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyGetTaxCategories(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/resources/payment-means")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async getPaymentMeans(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyGetPaymentMeans(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/resources/countries")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async getCountries(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyGetCountries(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/resources/currencies")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async getCurrencies(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyGetCurrencies(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/resources/invoice-types")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async getInvoiceTypes(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyGetInvoiceTypes(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/resources/service-codes")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async getServiceCodes(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyGetServiceCodes(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/resources/vat-exemptions")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async getVatExemptions(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyGetVatExemptions(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/resources/hs-codes")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async getHsCodes(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyGetHsCodes(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/resources/lgas")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async getLgas(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyGetLgas(userId);
    return result.data;
  }

  @Public()
  @ApiHeader({ name: 'x-api-key', required: true, description: 'Tenant API Key' })
  @ApiHeader({ name: 'x-api-secret', required: true, description: 'Tenant API Secret' })
  @Get("invoice/resources/states")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyAuthGuard)
  async getStates(@CurrentUser() req: any) {
    const userId: number = req.id;
    const result = await this.tenantsService.proxyGetStates(userId);
    return result.data;
  }

  // Key management (JWT, role must be TENANT handled at business layer)
  @Post("keys")
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOrRotateKeys(@CurrentUser() req: any) {
    const userId: number = req.id;
    // Optionally verify role from Users table
    const keys = await this.tenantsService.createOrRotateKeys(userId);
    return keys;
  }

  @Get("keys")
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getKeys(@CurrentUser() req: any) {
    const userId: number = req.id;
    const keys = await this.tenantsService.getKeys(userId);
    return keys;
  }

  @Get("logs")
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
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
