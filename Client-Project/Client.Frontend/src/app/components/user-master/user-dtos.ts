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
    roleMasterId: number;
    username: string;
    updatedBy: number;
}