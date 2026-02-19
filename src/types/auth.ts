export interface User {
    id: string;
    email: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
    permissions: string[];
}

// Request Models

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
    org_name?: string;
}

export interface RefreshRequest {
    refresh_token: string;
}

export interface SwitchOrgRequest {
    org_id: string;
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
}

// Response Models

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: User;
    permissions: string[];
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface MessageResponse {
    message: string;
}
