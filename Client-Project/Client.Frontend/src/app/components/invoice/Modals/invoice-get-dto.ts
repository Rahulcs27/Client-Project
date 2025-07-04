export interface InvoiceGetDto {
    r_id: number;
    r_companyId: number;
    r_subcontractorId: number;
    r_productId: number;
    r_invoiceDate: string;
    r_status: string;
    r_quantity: number;
    r_totalAmount: number;
    r_paymentMode: number;
}
