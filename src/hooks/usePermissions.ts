import { useAuthStore } from "@/store/authStore";
import { OrgPermission, ProjectPermission, PROJECT_PERMISSIONS, ProjectRole } from "@/types/rbac";

export const usePermissions = (currentProjectRole?: ProjectRole | string) => {
    const { user } = useAuthStore();

    const hasOrgPermission = (permission: OrgPermission) => {
        return user?.permissions?.includes(permission) || false;
    };

    const hasProjectPermission = (permission: ProjectPermission) => {
        // If user has manage_org_settings, they have all project permissions implicitly
        if (user?.permissions?.includes(OrgPermission.MANAGE_ORG_SETTINGS)) return true;

        if (!currentProjectRole) return false;

        const role = currentProjectRole as ProjectRole;
        const allowedPermissions = PROJECT_PERMISSIONS[role] || [];

        return allowedPermissions.includes(permission);
    };

    // Alias for compatibility/clarity
    const hasPermission = hasProjectPermission;

    const canEditTask = (taskAssigneeId?: string) => {
        if (hasProjectPermission(ProjectPermission.EDIT_ANY_TASK)) return true;

        if (hasProjectPermission(ProjectPermission.EDIT_ASSIGNED_TASK)) {
            return taskAssigneeId === user?.id;
        }

        return false;
    };

    return {
        hasOrgPermission,
        hasProjectPermission,
        hasPermission,
        canEditTask,
        isAdmin: user?.permissions?.includes(OrgPermission.MANAGE_ORG_SETTINGS) || false,
    };
};
