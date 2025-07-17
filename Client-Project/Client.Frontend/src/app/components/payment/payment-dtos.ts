export interface PaymentGetDto {
    r_id: number;
    r_invoiceId: number;
    r_paymentDate: string;
    r_amountPaid: number;
    r_paymentMode: string;
    r_bankName: string;
    r_bankId: number | null;
    r_paymentStatus: string;
}

export interface PaymentCreateDto {
    invoiceId: number | null;
    companyId: number;
    paymentDate: string;
    amountPaid: number;
    paymentMode: string
    bankId: number | null;
    paymentStatus: string;
    createdBy: number;
}

export interface PaymentUpdateDto {
    id: number;
    companyId: number;
    invoiceId: number | null;
    paymentDate: string;
    amountPaid: number;
    paymentMode: string
    bankId: number | null;
    paymentStatus: string;
    updatedBy: number;
}