import { useAuthStore } from "@/store/authStore";
import { OrgRole, OrgPermission, ORG_PERMISSIONS, ProjectPermission, PROJECT_PERMISSIONS, ProjectRole } from "@/types/rbac";

export const usePermissions = (currentProjectRole?: ProjectRole | string) => {
    const { user } = useAuthStore();

    const hasOrgRole = (roles: OrgRole[]) => {
        return user?.org_role && roles.includes(user.org_role as OrgRole);
    };

    const hasOrgPermission = (permission: OrgPermission) => {
        if (!user?.org_role) return false;
        // OrgAdmin has all permissions implicitly, but our map covers it explicitly too.
        // If we want to rely on the map:
        const role = user.org_role as OrgRole;
        const allowedPermissions = ORG_PERMISSIONS[role] || [];
        return allowedPermissions.includes(permission);
    };

    const hasProjectPermission = (permission: ProjectPermission) => {
        // OrgAdmin has all project permissions implicitly
        if (user?.org_role === OrgRole.ORG_ADMIN) return true;

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
        hasOrgRole,
        hasOrgPermission,
        hasProjectPermission,
        hasPermission,
        canEditTask,
        isAdmin: user?.org_role === OrgRole.ORG_ADMIN || user?.org_role === OrgRole.PROJ_ADMIN,
    };
};
