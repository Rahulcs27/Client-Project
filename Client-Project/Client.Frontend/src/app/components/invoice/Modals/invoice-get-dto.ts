export interface InvoiceGetDto {
    r_id: number;
    r_companyId: number;
    r_companyName: string;
    r_subcontractorId: number;
    r_subcontractorName: string
    r_productId: number;
    r_productDescription: string;
    r_invoiceDate: string;
    r_status: string;
    r_quantity: number;
    r_totalAmount: number;
    r_paymentMode: number;
}
