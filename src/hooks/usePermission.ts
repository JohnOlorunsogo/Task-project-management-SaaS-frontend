import { useAuthStore } from "@/store/authStore";
import { useProjectStore } from "@/store/projectStore";

type PermissionScope = "org" | "project";

/**
 * Hook to check if the current user has a specific permission.
 * 
 * @param requiredPermission The permission string to check for.
 * @param scope The scope to check within ('org' or 'project'). Defaults to 'org'.
 * @returns boolean indicating if the user has the permission.
 */
export const usePermission = (requiredPermission: string, scope: PermissionScope = "org"): boolean => {
    const { user } = useAuthStore();
    const { currentProjectPermissions } = useProjectStore();

    if (scope === "org") {
        return user?.permissions?.includes(requiredPermission) || false;
    }

    if (scope === "project") {
        return currentProjectPermissions?.includes(requiredPermission) || false;
    }

    return false;
};
