export interface RoleGetDto {
    id: number;
    roleName: string;
    description: string;
}

export interface RoleCreateDto {
    roleName: string;
    description: string;
    createdBy: number;
}

export interface RoleUpdateDto {
    id: number;
    roleName: string;
    description: string;
    updatedBy: number;
}

export interface RoleAccessDto {
    u_roleName: string;
    a_screenName: string;
    a_screenCode: string;
    a_viewAccess: boolean;
    a_createAccess: boolean;
    a_editAccess: boolean;
    a_deleteAccess: boolean;
}