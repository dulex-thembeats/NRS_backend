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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInvoiceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PostalAddressDto {
    street_name;
    city_name;
    postal_zone;
    country;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Street name',
        example: '123 Main Street',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PostalAddressDto.prototype, "street_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City name',
        example: 'Lagos',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PostalAddressDto.prototype, "city_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Postal zone',
        example: '100001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PostalAddressDto.prototype, "postal_zone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country',
        example: 'Nigeria',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PostalAddressDto.prototype, "country", void 0);
class PartyDto {
    party_name;
    tin;
    email;
    telephone;
    business_description;
    postal_address;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Party name',
        example: 'John Doe Limited',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PartyDto.prototype, "party_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax Identification Number',
        example: '12345678901',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PartyDto.prototype, "tin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'john@example.com',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PartyDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Telephone number',
        example: '+2348012345678',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PartyDto.prototype, "telephone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business description',
        example: 'Software Development Company',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PartyDto.prototype, "business_description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Postal address',
        type: PostalAddressDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PostalAddressDto),
    __metadata("design:type", PostalAddressDto)
], PartyDto.prototype, "postal_address", void 0);
class DocumentReferenceDto {
    irn;
    issue_date;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Invoice Reference Number',
        example: 'ITW20853450-6997D6BB-20240703',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], DocumentReferenceDto.prototype, "irn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Issue date',
        example: '2024-05-14',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DocumentReferenceDto.prototype, "issue_date", void 0);
class InvoiceDeliveryPeriodDto {
    start_date;
    end_date;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date',
        example: '2024-05-14',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InvoiceDeliveryPeriodDto.prototype, "start_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date',
        example: '2024-05-20',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], InvoiceDeliveryPeriodDto.prototype, "end_date", void 0);
class PaymentMeansDto {
    payment_means_code;
    payment_due_date;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment means code',
        example: '10',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PaymentMeansDto.prototype, "payment_means_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment due date',
        example: '2024-06-14',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PaymentMeansDto.prototype, "payment_due_date", void 0);
class AllowanceChargeDto {
    charge_indicator;
    amount;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Charge indicator',
        example: true,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AllowanceChargeDto.prototype, "charge_indicator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount',
        example: 100.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AllowanceChargeDto.prototype, "amount", void 0);
class TaxCategoryDto {
    category_id;
    percent;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category ID',
        example: 'S',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TaxCategoryDto.prototype, "category_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Percentage',
        example: 15.0,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TaxCategoryDto.prototype, "percent", void 0);
class TaxSubtotalDto {
    taxable_amount;
    tax_amount;
    tax_category;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Taxable amount',
        example: 1000.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TaxSubtotalDto.prototype, "taxable_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax amount',
        example: 150.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TaxSubtotalDto.prototype, "tax_amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax category',
        type: TaxCategoryDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TaxCategoryDto),
    __metadata("design:type", TaxCategoryDto)
], TaxSubtotalDto.prototype, "tax_category", void 0);
class TaxTotalDto {
    tax_amount;
    tax_subtotal;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax amount',
        example: 150.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TaxTotalDto.prototype, "tax_amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax subtotals',
        type: [TaxSubtotalDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TaxSubtotalDto),
    __metadata("design:type", Array)
], TaxTotalDto.prototype, "tax_subtotal", void 0);
class LegalMonetaryTotalDto {
    line_extension_amount;
    tax_exclusive_amount;
    tax_inclusive_amount;
    payable_amount;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Line extension amount',
        example: 1000.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LegalMonetaryTotalDto.prototype, "line_extension_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax exclusive amount',
        example: 1000.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LegalMonetaryTotalDto.prototype, "tax_exclusive_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tax inclusive amount',
        example: 1150.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LegalMonetaryTotalDto.prototype, "tax_inclusive_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payable amount',
        example: 1150.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], LegalMonetaryTotalDto.prototype, "payable_amount", void 0);
class ItemDto {
    name;
    description;
    sellers_item_identification;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Item name',
        example: 'Software License',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Item description',
        example: 'Annual software license subscription',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sellers item identification',
        example: 'SKU-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItemDto.prototype, "sellers_item_identification", void 0);
class PriceDto {
    price_amount;
    base_quantity;
    price_unit;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price amount',
        example: 100.00,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PriceDto.prototype, "price_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base quantity',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PriceDto.prototype, "base_quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price unit',
        example: 'Each',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PriceDto.prototype, "price_unit", void 0);
class InvoiceLineDto {
    hsn_code;
    product_category;
    discount_rate;
    discount_amount;
    fee_rate;
    fee_amount;
    invoiced_quantity;
    line_extension_amount;
    item;
    price;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'HSN code',
        example: 'CC-001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InvoiceLineDto.prototype, "hsn_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product category',
        example: 'Food and Beverages',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InvoiceLineDto.prototype, "product_category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Discount rate',
        example: 2.01,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "discount_rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Discount amount',
        example: 3500,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "discount_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fee rate',
        example: 1.01,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "fee_rate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fee amount',
        example: 50,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "fee_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Invoiced quantity',
        example: 15,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "invoiced_quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Line extension amount',
        example: 30,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], InvoiceLineDto.prototype, "line_extension_amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Item details',
        type: ItemDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ItemDto),
    __metadata("design:type", ItemDto)
], InvoiceLineDto.prototype, "item", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Price details',
        type: PriceDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PriceDto),
    __metadata("design:type", PriceDto)
], InvoiceLineDto.prototype, "price", void 0);
class UpdateInvoiceDto {
    business_id;
    irn;
    issue_date;
    due_date;
    issue_time;
    invoice_type_code;
    payment_status;
    note;
    tax_point_date;
    document_currency_code;
    tax_currency_code;
    accounting_cost;
    buyer_reference;
    order_reference;
    invoice_delivery_period;
    billing_reference;
    dispatch_document_reference;
    receipt_document_reference;
    originator_document_reference;
    contract_document_reference;
    _document_reference;
    accounting_supplier_party;
    accounting_customer_party;
    actual_delivery_date;
    payment_means;
    payment_terms_note;
    allowance_charge;
    tax_total;
    legal_monetary_total;
    invoice_line;
}
exports.UpdateInvoiceDto = UpdateInvoiceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Business ID',
        example: '{{TEST_BUSINESS_ID}}',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "business_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Invoice Reference Number',
        example: 'ITW20853450-6997D6BB-20240703',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "irn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Issue date',
        example: '2024-05-14',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "issue_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Due date',
        example: '2024-06-14',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "due_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Issue time',
        example: '17:59:04',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
        message: 'Issue time must be in HH:MM:SS format',
    }),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "issue_time", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Invoice type code',
        example: '396',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "invoice_type_code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment status',
        example: 'PENDING',
        enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "payment_status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Note',
        example: 'dummy_note (will be encrypted in storage)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax point date',
        example: '2024-05-14',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "tax_point_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Document currency code',
        example: 'NGN',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "document_currency_code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax currency code',
        example: 'NGN',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "tax_currency_code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Accounting cost',
        example: 'Cost Center 001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "accounting_cost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Buyer reference',
        example: 'BUYER-REF-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "buyer_reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Order reference',
        example: 'ORDER-REF-001',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "order_reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Invoice delivery period',
        type: InvoiceDeliveryPeriodDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => InvoiceDeliveryPeriodDto),
    __metadata("design:type", InvoiceDeliveryPeriodDto)
], UpdateInvoiceDto.prototype, "invoice_delivery_period", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Billing reference',
        type: DocumentReferenceDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DocumentReferenceDto),
    __metadata("design:type", DocumentReferenceDto)
], UpdateInvoiceDto.prototype, "billing_reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dispatch document reference',
        type: DocumentReferenceDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DocumentReferenceDto),
    __metadata("design:type", DocumentReferenceDto)
], UpdateInvoiceDto.prototype, "dispatch_document_reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Receipt document reference',
        type: DocumentReferenceDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DocumentReferenceDto),
    __metadata("design:type", DocumentReferenceDto)
], UpdateInvoiceDto.prototype, "receipt_document_reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Originator document reference',
        type: DocumentReferenceDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DocumentReferenceDto),
    __metadata("design:type", DocumentReferenceDto)
], UpdateInvoiceDto.prototype, "originator_document_reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contract document reference',
        type: DocumentReferenceDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DocumentReferenceDto),
    __metadata("design:type", DocumentReferenceDto)
], UpdateInvoiceDto.prototype, "contract_document_reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Document references',
        type: [DocumentReferenceDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DocumentReferenceDto),
    __metadata("design:type", Array)
], UpdateInvoiceDto.prototype, "_document_reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Accounting supplier party',
        type: PartyDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PartyDto),
    __metadata("design:type", PartyDto)
], UpdateInvoiceDto.prototype, "accounting_supplier_party", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Accounting customer party',
        type: PartyDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PartyDto),
    __metadata("design:type", PartyDto)
], UpdateInvoiceDto.prototype, "accounting_customer_party", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Actual delivery date',
        example: '2024-05-14',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "actual_delivery_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment means',
        type: [PaymentMeansDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentMeansDto),
    __metadata("design:type", Array)
], UpdateInvoiceDto.prototype, "payment_means", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment terms note',
        example: 'dummy payment terms note (will be encrypted in storage)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "payment_terms_note", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Allowance charges',
        type: [AllowanceChargeDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AllowanceChargeDto),
    __metadata("design:type", Array)
], UpdateInvoiceDto.prototype, "allowance_charge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tax totals',
        type: [TaxTotalDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TaxTotalDto),
    __metadata("design:type", Array)
], UpdateInvoiceDto.prototype, "tax_total", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Legal monetary total',
        type: LegalMonetaryTotalDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LegalMonetaryTotalDto),
    __metadata("design:type", LegalMonetaryTotalDto)
], UpdateInvoiceDto.prototype, "legal_monetary_total", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Invoice lines',
        type: [InvoiceLineDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InvoiceLineDto),
    __metadata("design:type", Array)
], UpdateInvoiceDto.prototype, "invoice_line", void 0);
//# sourceMappingURL=update-invoice.dto.js.map