export interface Login {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface JwtClaims {
    user: string;
    userId: number;
    role: number;
}
