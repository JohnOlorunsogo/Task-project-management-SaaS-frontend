import { apiClient } from "./client";
import {
    LoginRequest,
    RegisterRequest,
    RefreshRequest,
    SwitchOrgRequest,
    ChangePasswordRequest,
    AuthResponse,
    TokenResponse,
    MessageResponse,
    User,
} from "../types/auth";

export const AuthService = {
    // 1. Register User
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post("/auth/register", data);
        return response.data;
    },

    // 2. Login
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post("/auth/login", data);
        return response.data;
    },

    // 3. Refresh Token
    refreshToken: async (data: RefreshRequest): Promise<TokenResponse> => {
        const response = await apiClient.post("/auth/refresh", data);
        return response.data;
    },

    // 4. Logout
    logout: async (data: RefreshRequest): Promise<MessageResponse> => {
        const response = await apiClient.post("/auth/logout", data);
        return response.data;
    },

    // 5. Switch Organization
    switchOrg: async (data: SwitchOrgRequest): Promise<AuthResponse> => {
        const response = await apiClient.post("/auth/switch-org", data);
        return response.data;
    },

    // 6. Get Current User
    getMe: async (): Promise<User> => {
        const response = await apiClient.get("/auth/me");
        return response.data;
    },

    // 7. Get User by Email
    getUserByEmail: async (email: string): Promise<User> => {
        const response = await apiClient.get(`/auth/users/by-email/${email}`);
        return response.data;
    },

    // 8. Change Password
    changePassword: async (data: ChangePasswordRequest): Promise<MessageResponse> => {
        const response = await apiClient.put("/auth/password", data);
        return response.data;
    },
};
