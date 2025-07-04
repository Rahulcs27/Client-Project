export interface InvoiceCreateDto {
    companyId: number;
    subcontractorId: number;
    productId: number;
    invoiceDate: string;
    quantity: number;
    totalAmount: number;
    paymentMode: string;
    createdBy: number;
}
