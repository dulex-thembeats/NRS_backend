import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsArray,
  IsNumber,
  IsIn,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';




// Re-export all the nested DTOs from create-invoice.dto.ts

class PostalAddressDto {
  @ApiProperty({
    description: 'Street name',
    example: '123 Main Street',
  })
  @IsString()
  @IsNotEmpty()
  street_name: string;

  @ApiProperty({
    description: 'City name',
    example: 'Lagos',
  })
  @IsString()
  @IsNotEmpty()
  city_name: string;

  @ApiProperty({
    description: 'Postal zone',
    example: '100001',
  })
  @IsString()
  @IsNotEmpty()
  postal_zone: string;

  @ApiProperty({
    description: 'Country',
    example: 'Nigeria',
  })
  @IsString()
  @IsNotEmpty()
  country: string;
}

class PartyDto {
  @ApiProperty({
    description: 'Party name',
    example: 'John Doe Limited',
  })
  @IsString()
  @IsNotEmpty()
  party_name: string;

  @ApiProperty({
    description: 'Tax Identification Number',
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  tin: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'Telephone number',
    example: '+2348012345678',
  })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({
    description: 'Business description',
    example: 'Software Development Company',
  })
  @IsOptional()
  @IsString()
  business_description?: string;

  @ApiPropertyOptional({
    description: 'Postal address',
    type: PostalAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PostalAddressDto)
  postal_address?: PostalAddressDto;
}


 class DocumentReferenceDto {
  @ApiProperty({
    description: 'Invoice Reference Number',
    example: 'ITW20853450-6997D6BB-20240703',
  })
  @IsString()
  @IsNotEmpty()
  irn: string;

  @ApiProperty({
    description: 'Issue date',
    example: '2024-05-14',
  })
  @IsDateString()
  issue_date: string;
}

 class InvoiceDeliveryPeriodDto {
  @ApiProperty({
    description: 'Start date',
    example: '2024-05-14',
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    description: 'End date',
    example: '2024-05-20',
  })
  @IsDateString()
  end_date: string;
}

 class PaymentMeansDto {
  @ApiProperty({
    description: 'Payment means code',
    example: '10',
  })
  @IsString()
  @IsNotEmpty()
  payment_means_code: string;

  @ApiProperty({
    description: 'Payment due date',
    example: '2024-06-14',
  })
  @IsDateString()
  payment_due_date: string;
}

 class AllowanceChargeDto {
  @ApiProperty({
    description: 'Charge indicator',
    example: true,
  })
  @IsNumber()
  charge_indicator: number;

  @ApiProperty({
    description: 'Amount',
    example: 100.00,
  })
  @IsNumber()
  @Min(0)
  amount: number;
}

 class TaxCategoryDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'S',
  })
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty({
    description: 'Percentage',
    example: 15.0,
  })
  @IsNumber()
  @Min(0)
  percent: number;
}

 class TaxSubtotalDto {
  @ApiProperty({
    description: 'Taxable amount',
    example: 1000.00,
  })
  @IsNumber()
  @Min(0)
  taxable_amount: number;

  @ApiProperty({
    description: 'Tax amount',
    example: 150.00,
  })
  @IsNumber()
  @Min(0)
  tax_amount: number;

  @ApiPropertyOptional({
    description: 'Tax category',
    type: TaxCategoryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaxCategoryDto)
  tax_category?: TaxCategoryDto;
}

 class TaxTotalDto {
  @ApiProperty({
    description: 'Tax amount',
    example: 150.00,
  })
  @IsNumber()
  @Min(0)
  tax_amount: number;

  @ApiPropertyOptional({
    description: 'Tax subtotals',
    type: [TaxSubtotalDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxSubtotalDto)
  tax_subtotal?: TaxSubtotalDto[];
}

 class LegalMonetaryTotalDto {
  @ApiProperty({
    description: 'Line extension amount',
    example: 1000.00,
  })
  @IsNumber()
  @Min(0)
  line_extension_amount: number;

  @ApiProperty({
    description: 'Tax exclusive amount',
    example: 1000.00,
  })
  @IsNumber()
  @Min(0)
  tax_exclusive_amount: number;

  @ApiProperty({
    description: 'Tax inclusive amount',
    example: 1150.00,
  })
  @IsNumber()
  @Min(0)
  tax_inclusive_amount: number;

  @ApiProperty({
    description: 'Payable amount',
    example: 1150.00,
  })
  @IsNumber()
  @Min(0)
  payable_amount: number;
}

 class ItemDto {
  @ApiProperty({
    description: 'Item name',
    example: 'Software License',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Item description',
    example: 'Annual software license subscription',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Sellers item identification',
    example: 'SKU-001',
  })
  @IsOptional()
  @IsString()
  sellers_item_identification?: string;
}

 class PriceDto {
  @ApiProperty({
    description: 'Price amount',
    example: 100.00,
  })
  @IsNumber()
  @Min(0)
  price_amount: number;

  @ApiProperty({
    description: 'Base quantity',
    example: 1,
  })
  @IsNumber()
  @Min(0)
  base_quantity: number;

  @ApiProperty({
    description: 'Price unit',
    example: 'Each',
  })
  @IsString()
  @IsNotEmpty()
  price_unit: string;
}

 class InvoiceLineDto {
  @ApiProperty({
    description: 'HSN code',
    example: 'CC-001',
  })
  @IsString()
  @IsNotEmpty()
  hsn_code: string;

  @ApiProperty({
    description: 'Product category',
    example: 'Food and Beverages',
  })
  @IsString()
  @IsNotEmpty()
  product_category: string;

  @ApiProperty({
    description: 'Discount rate',
    example: 2.01,
  })
  @IsNumber()
  @Min(0)
  discount_rate: number;

  @ApiProperty({
    description: 'Discount amount',
    example: 3500,
  })
  @IsNumber()
  @Min(0)
  discount_amount: number;

  @ApiProperty({
    description: 'Fee rate',
    example: 1.01,
  })
  @IsNumber()
  @Min(0)
  fee_rate: number;

  @ApiProperty({
    description: 'Fee amount',
    example: 50,
  })
  @IsNumber()
  @Min(0)
  fee_amount: number;

  @ApiProperty({
    description: 'Invoiced quantity',
    example: 15,
  })
  @IsNumber()
  @Min(0)
  invoiced_quantity: number;

  @ApiProperty({
    description: 'Line extension amount',
    example: 30,
  })
  @IsNumber()
  @Min(0)
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

export class UpdateInvoiceDto {
  @ApiPropertyOptional({
    description: 'Business ID',
    example: '{{TEST_BUSINESS_ID}}',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  business_id?: string;

  @ApiPropertyOptional({
    description: 'Invoice Reference Number',
    example: 'ITW20853450-6997D6BB-20240703',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  irn?: string;

  @ApiPropertyOptional({
    description: 'Issue date',
    example: '2024-05-14',
  })
  @IsOptional()
  @IsDateString()
  issue_date?: string;

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

  @ApiPropertyOptional({
    description: 'Invoice type code',
    example: '396',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  invoice_type_code?: string;

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

  @ApiPropertyOptional({
    description: 'Document currency code',
    example: 'NGN',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  document_currency_code?: string;

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
    example: 'Cost Center 001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  accounting_cost?: string;

  @ApiPropertyOptional({
    description: 'Buyer reference',
    example: 'BUYER-REF-001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  buyer_reference?: string;

  @ApiPropertyOptional({
    description: 'Order reference',
    example: 'ORDER-REF-001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  order_reference?: string;

  @ApiPropertyOptional({
    description: 'Invoice delivery period',
    type: InvoiceDeliveryPeriodDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => InvoiceDeliveryPeriodDto)
  invoice_delivery_period?: InvoiceDeliveryPeriodDto;

  @ApiPropertyOptional({
    description: 'Billing reference',
    type: DocumentReferenceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentReferenceDto)
  billing_reference?: DocumentReferenceDto;

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

  @ApiPropertyOptional({
    description: 'Accounting supplier party',
    type: PartyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartyDto)
  accounting_supplier_party?: PartyDto;

  @ApiPropertyOptional({
    description: 'Accounting customer party',
    type: PartyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartyDto)
  accounting_customer_party?: PartyDto;

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

  @ApiPropertyOptional({
    description: 'Legal monetary total',
    type: LegalMonetaryTotalDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LegalMonetaryTotalDto)
  legal_monetary_total?: LegalMonetaryTotalDto;

  @ApiPropertyOptional({
    description: 'Invoice lines',
    type: [InvoiceLineDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineDto)
  invoice_line?: InvoiceLineDto[];
}
