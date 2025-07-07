export interface ProductGetDto {
    r_id: number;
    r_description: string;
    r_unitPrice: number;
}

export interface ProductCreateDto {
    description: string;
    unitPrice: number;
    createdBy: number;
}

export interface ProductUpdateDto {
    id: number;
    description: string;
    unitPrice: number;
    updatedBy: number;
}
