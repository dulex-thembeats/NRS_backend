import { InvoiceService } from "./invoice.service";
import { GetEntityDto, CreateInvoiceDto, UpdateInvoiceDto } from "./dtos";
export declare class InvoiceController {
    private readonly invoiceService;
    private readonly logger;
    constructor(invoiceService: InvoiceService);
    getEntityById(params: GetEntityDto): Promise<any>;
    transmitSelfHealthCheck(): Promise<any>;
    transmitLookupTin(tin: string): Promise<any>;
    transmitPullInvoice(): Promise<any>;
    transmitLookupById(invoiceId: number): Promise<any>;
    transmitInvoiceById(invoiceId: number): Promise<any>;
    retryTransmitInvoiceById(invoiceId: number): Promise<any>;
    transmitConfirmReceiptById(invoiceId: number): Promise<any>;
    createInvoice(user: any, payload: CreateInvoiceDto): Promise<any>;
    getMyInvoices(user: any, page?: number, limit?: number): Promise<{
        invoices: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    getInvoiceById(invoiceId: number): Promise<any>;
    signInvoiceById(invoiceId: number): Promise<{
        ok: boolean;
        invoice: any;
    }>;
    confirmInvoiceById(invoiceId: number): Promise<{
        ok: boolean;
        invoice: any;
    }>;
    updateInvoiceById(invoiceId: number, payload: UpdateInvoiceDto): Promise<any>;
}
