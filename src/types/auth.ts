export interface User {
    id: string;
    email: string;
    full_name: string;
    org_id: string | null;
    org_role: string | null;
    is_active: boolean;
    created_at: string;
    permissions: string[];
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: User;
    permissions: string[]; // Redundant with user.permissions but often provided at top level too
}
