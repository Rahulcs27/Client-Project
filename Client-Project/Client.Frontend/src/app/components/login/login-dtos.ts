export interface Login {
    username: string;
    password: string;
    // captchaToken: string;
}

export interface AuthResponse {
    token: string;
}

export interface JwtClaims {
    user: string;
    userId: number;
    role: string;
    companyId: number;
}
