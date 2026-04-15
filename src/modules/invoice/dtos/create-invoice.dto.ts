import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsNumber,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

 class PostalAddressDto {
  @ApiProperty({
    description: 'Street name',
    example: '32, owonikoko street',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  street_name: string;

  @ApiProperty({
    description: 'City name',
    example: 'Gwarikpa',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  city_name: string;

  @ApiProperty({
    description: 'Postal zone',
    example: '023401',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  postal_zone: string;

  @ApiProperty({
    description: 'Country code',
    example: 'NG',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  country: string;
}

 class PartyDto {
  @ApiProperty({
    description: 'Party name',
    example: 'Test Pls',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  party_name: string;

  @ApiProperty({
    description: 'Tax Identification Number',
    example: 'TIN-0099990001',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  tin: string;

  @ApiProperty({
    description: 'Email address',
    example: 'supplier_business@email.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Telephone number with country code',
    example: '+23480254099000',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Telephone must start with + and include country code',
  })
  telephone?: string;

  @ApiPropertyOptional({
    description: 'Business description',
    example: 'this entity is into sales of Cement and building materials',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  business_description?: string;

  @ApiProperty({
    description: 'Postal address',
    type: PostalAddressDto,
  })
  @ValidateNested()
  @Type(() => PostalAddressDto)
  postal_address: PostalAddressDto;
}

 class InvoiceDeliveryPeriodDto {
  @ApiProperty({
    description: 'Start date',
    example: '2024-06-14',
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    description: 'End date',
    example: '2024-06-16',
  })
  @IsDateString()
  end_date: string;
}

 class BillingReferenceDto {
  @ApiProperty({
    description: 'Invoice Reference Number',
    example: 'ITW001-E9E0C0D3-20240619',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  irn: string;

  @ApiProperty({
    description: 'Issue date',
    example: '2024-05-14',
  })
  @IsDateString()
  issue_date: string;
}

 class DocumentReferenceDto {
  @ApiProperty({
    description: 'Invoice Reference Number',
    example: 'ITW001-E9E0C0D3-20240619',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  irn: string;

  @ApiProperty({
    description: 'Issue date',
    example: '2024-05-14',
  })
  @IsDateString()
  issue_date: string;
}

 class PaymentMeansDto {
  @ApiProperty({
    description: 'Payment means code',
    example: '10',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  payment_means_code: string;

  @ApiProperty({
    description: 'Payment due date',
    example: '2024-05-14',
  })
  @IsDateString()
  payment_due_date: string;
}

 class AllowanceChargeDto {
  @ApiProperty({
    description: 'Charge indicator - true for charge, false for allowance',
    example: true,
  })
  @IsBoolean()
  charge_indicator: boolean;

  @ApiProperty({
    description: 'Amount',
    example: 800.60,
  })
  @IsNumber()
  amount: number;
}

 class TaxCategoryDto {
  @ApiProperty({
    description: 'Tax category ID',
    example: 'LOCAL_SALES_TAX',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  id: string;

  @ApiProperty({
    description: 'Tax percentage',
    example: 2.3,
  })
  @IsNumber()
  percent: number;
}

 class TaxSubtotalDto {
  @ApiProperty({
    description: 'Taxable amount',
    example: 800,
  })
  @IsNumber()
  taxable_amount: number;

  @ApiProperty({
    description: 'Tax amount',
    example: 8,
  })
  @IsNumber()
  tax_amount: number;

  @ApiProperty({
    description: 'Tax category',
    type: TaxCategoryDto,
  })
  @ValidateNested()
  @Type(() => TaxCategoryDto)
  tax_category: TaxCategoryDto;
}

 class TaxTotalDto {
  @ApiProperty({
    description: 'Total tax amount',
    example: 56.07,
  })
  @IsNumber()
  tax_amount: number;

  @ApiProperty({
    description: 'Tax subtotals',
    type: [TaxSubtotalDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxSubtotalDto)
  tax_subtotal: TaxSubtotalDto[];
}

 class LegalMonetaryTotalDto {
  @ApiProperty({
    description: 'Line extension amount',
    example: 340.50,
  })
  @IsNumber()
  line_extension_amount: number;

  @ApiProperty({
    description: 'Tax exclusive amount',
    example: 400,
  })
  @IsNumber()
  tax_exclusive_amount: number;

  @ApiProperty({
    description: 'Tax inclusive amount',
    example: 430,
  })
  @IsNumber()
  tax_inclusive_amount: number;

  @ApiProperty({
    description: 'Payable amount',
    example: 30,
  })
  @IsNumber()
  payable_amount: number;
}

 class ItemDto {
  @ApiProperty({
    description: 'Item name',
    example: 'item name',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Item description',
    example: 'item description',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({
    description: 'Sellers item identification',
    example: 'identified as spoon by the seller',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sellers_item_identification?: string;
}

 class PriceDto {
  @ApiProperty({
    description: 'Price amount',
    example: 10,
  })
  @IsNumber()
  price_amount: number;

  @ApiProperty({
    description: 'Base quantity',
    example: 3,
  })
  @IsNumber()
  base_quantity: number;

  @ApiProperty({
    description: 'Price unit',
    example: 'NGN per 1',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  price_unit: string;
}

 class InvoiceLineDto {
  @ApiProperty({
    description: 'HSN code',
    example: 'CC-001',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  hsn_code: string;

  @ApiProperty({
    description: 'Product category',
    example: 'Food and Beverages',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  product_category: string;

  @ApiProperty({
    description: 'Discount rate',
    example: 2.01,
  })
  @IsNumber()
  discount_rate: number;

  @ApiProperty({
    description: 'Discount amount',
    example: 3500,
  })
  @IsNumber()
  discount_amount: number;

  @ApiProperty({
    description: 'Fee rate',
    example: 1.01,
  })
  @IsNumber()
  fee_rate: number;

  @ApiProperty({
    description: 'Fee amount',
    example: 50,
  })
  @IsNumber()
  fee_amount: number;

  @ApiProperty({
    description: 'Invoiced quantity',
    example: 15,
  })
  @IsNumber()
  invoiced_quantity: number;

  @ApiProperty({
    description: 'Line extension amount',
    example: 30,
  })
  @IsNumber()
  line_extension_amount: number;

  @ApiProperty({
    description: 'Item details',
    type: ItemDto,
  })
  @ValidateNested()
  @Type(() => ItemDto)
  item: ItemDto;

  @ApiProperty({
    description: 'Price details',
    type: PriceDto,
  })
  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;
}

 export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Business ID',
    example: '{{TEST_BUSINESS_ID}}',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  business_id: string;

  @ApiProperty({
    description: 'Invoice Reference Number',
    example: 'ITW20853450-6997D6BB-20240703',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  irn: string;

  @ApiProperty({
    description: 'Issue date',
    example: '2024-05-14',
  })
  @IsDateString()
  issue_date: string;

  @ApiPropertyOptional({
    description: 'Due date',
    example: '2024-06-14',
  })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiPropertyOptional({
    description: 'Issue time',
    example: '17:59:04',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
    message: 'Issue time must be in HH:MM:SS format',
  })
  issue_time?: string;

  @ApiProperty({
    description: 'Invoice type code',
    example: '396',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  invoice_type_code: string;

  @ApiPropertyOptional({
    description: 'Payment status',
    example: 'PENDING',
    enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
  })
  @IsOptional()
  @IsIn(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'])
  payment_status?: string;

  @ApiPropertyOptional({
    description: 'Note',
    example: 'dummy_note (will be encrypted in storage)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @ApiPropertyOptional({
    description: 'Tax point date',
    example: '2024-05-14',
  })
  @IsOptional()
  @IsDateString()
  tax_point_date?: string;

  @ApiProperty({
    description: 'Document currency code',
    example: 'NGN',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  document_currency_code: string;

  @ApiPropertyOptional({
    description: 'Tax currency code',
    example: 'NGN',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  tax_currency_code?: string;

  @ApiPropertyOptional({
    description: 'Accounting cost',
    example: '2000',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  accounting_cost?: string;

  @ApiPropertyOptional({
    description: 'Buyer reference',
    example: 'buyer REF IRN?',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  buyer_reference?: string;

  @ApiPropertyOptional({
    description: 'Invoice delivery period',
    type: InvoiceDeliveryPeriodDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => InvoiceDeliveryPeriodDto)
  invoice_delivery_period?: InvoiceDeliveryPeriodDto;

  @ApiPropertyOptional({
    description: 'Order reference',
    example: 'order REF IRN?',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  order_reference?: string;

  @ApiPropertyOptional({
    description: 'Billing references',
    type: [BillingReferenceDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillingReferenceDto)
  billing_reference?: BillingReferenceDto[];

  @ApiPropertyOptional({
    description: 'Dispatch document reference',
    type: DocumentReferenceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentReferenceDto)
  dispatch_document_reference?: DocumentReferenceDto;

  @ApiPropertyOptional({
    description: 'Receipt document reference',
    type: DocumentReferenceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentReferenceDto)
  receipt_document_reference?: DocumentReferenceDto;

  @ApiPropertyOptional({
    description: 'Originator document reference',
    type: DocumentReferenceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentReferenceDto)
  originator_document_reference?: DocumentReferenceDto;

  @ApiPropertyOptional({
    description: 'Contract document reference',
    type: DocumentReferenceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentReferenceDto)
  contract_document_reference?: DocumentReferenceDto;

  @ApiPropertyOptional({
    description: 'Document references',
    type: [DocumentReferenceDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentReferenceDto)
  _document_reference?: DocumentReferenceDto[];

  @ApiProperty({
    description: 'Accounting supplier party',
    type: PartyDto,
  })
  @ValidateNested()
  @Type(() => PartyDto)
  accounting_supplier_party: PartyDto;

  @ApiProperty({
    description: 'Accounting customer party',
    type: PartyDto,
  })
  @ValidateNested()
  @Type(() => PartyDto)
  accounting_customer_party: PartyDto;

  @ApiPropertyOptional({
    description: 'Actual delivery date',
    example: '2024-05-14',
  })
  @IsOptional()
  @IsDateString()
  actual_delivery_date?: string;

  @ApiPropertyOptional({
    description: 'Payment means',
    type: [PaymentMeansDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMeansDto)
  payment_means?: PaymentMeansDto[];

  @ApiPropertyOptional({
    description: 'Payment terms note',
    example: 'dummy payment terms note (will be encrypted in storage)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  payment_terms_note?: string;

  @ApiPropertyOptional({
    description: 'Allowance charges',
    type: [AllowanceChargeDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllowanceChargeDto)
  allowance_charge?: AllowanceChargeDto[];

  @ApiPropertyOptional({
    description: 'Tax totals',
    type: [TaxTotalDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxTotalDto)
  tax_total?: TaxTotalDto[];

  @ApiProperty({
    description: 'Legal monetary total',
    type: LegalMonetaryTotalDto,
  })
  @ValidateNested()
  @Type(() => LegalMonetaryTotalDto)
  legal_monetary_total: LegalMonetaryTotalDto;

  @ApiProperty({
    description: 'Invoice lines',
    type: [InvoiceLineDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineDto)
  invoice_line: InvoiceLineDto[];
}
