export interface UserGetDto {
    id: number;
    roleMasterId: number;
    roleName: string;
    username: string;
    password: string;
}

export interface UserCreateDto {
    roleMasterId: number;
    username: string;
    password: string;
    createdBy: number;
}

export interface UserUpdateDto {
    id: number;
    companyId: number;
    roleMasterId: number;
    username: string;
    password: string;
    currentPassword: string | null;
    newPassword: string | null;
    updatedBy: number;
}