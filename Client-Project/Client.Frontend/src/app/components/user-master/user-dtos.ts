export interface UserGetDto {
    id: number;
    companyId: number;
    roleMasterId: number;
    roleName: string;
    username: string;
    email: string;
    password: string;
}

export interface UserCreateDto {
    roleMasterId: number;
    companyId: number;
    username: string;
    email: string;
    password: string;
    createdBy: number;
}

export interface UserUpdateDto {
    id: number;
    companyId: number;
    roleMasterId: number;
    username: string;
    email: string;
    password: string;
    currentPassword: string | null;
    newPassword: string | null;
    updatedBy: number;
}