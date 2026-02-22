import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/auth";
import { AuthService } from "../api/auth";

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string, refreshToken: string) => void;
    switchOrg: (orgId: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            setAuth: (user, token, refreshToken) => {
                localStorage.setItem("auth_token", token);
                set({ user, token, refreshToken, isAuthenticated: true });
            },
            switchOrg: async (orgId: string) => {
                try {
                    const response = await AuthService.switchOrg({ org_id: orgId });
                    localStorage.setItem("auth_token", response.access_token);
                    set({
                        user: { ...response.user, permissions: response.permissions || response.user.permissions || [] },
                        token: response.access_token,
                        refreshToken: response.refresh_token,
                    });
                } catch (error) {
                    console.error("Failed to switch organization", error);
                    throw error;
                }
            },
            logout: async () => {
                const refreshToken = get().refreshToken;
                // Attempt server-side logout, but don't block on failure
                if (refreshToken) {
                    try {
                        await AuthService.logout({ refresh_token: refreshToken });
                    } catch (error) {
                        console.warn("Server-side logout failed", error);
                    }
                }
                localStorage.removeItem("auth_token");
                set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);
