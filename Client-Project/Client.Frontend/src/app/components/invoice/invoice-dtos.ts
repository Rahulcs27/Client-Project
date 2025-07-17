export interface InvoiceGetDto {
    r_id: number;
    r_companyId: number;
    r_companyName: string;
    r_subcontractorId: number;
    name: string
    r_productId: number;
    r_productDescription: string;
    r_unitAmount: number;
    r_invoiceDate: string;
    r_status: string;
    r_quantity: number;
    unitPrice: number;
    r_commissionPercentage: number;
    r_commissionAmount: number;
    r_totalAmount: number;
    r_paymentMode: number;
}

export interface InvoiceCreateDto {
    companyId: number;
    subcontractorId: number;
    productId: number;
    unitAmount: number;
    invoiceDate: string;
    commissionPercentage: number;
    commissionAmount: number;
    quantity: number;
    totalAmount: number;
    paymentMode: string;
    createdBy: number;
}

export interface InvoiceUpdateDto {
    id: number,
    companyId: number;
    productId: number,
    invoiceDate: string,
    unitAmount: number;
    quantity: number,
    commissionPercentage: number;
    commissionAmount: number;
    totalAmount: number,
    paymentMode: string
    status: string,
    updatedBy: number,
}