export interface InvoiceUpdateDto {
    id: number,
    productId: number,
    invoiceDate: string,
    quantity: number,
    totalAmount: number,
    paymentMode: string
    status: string,
    updatedBy: number,
}
