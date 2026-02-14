import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { OrgPermission, ProjectPermission, ProjectRole } from "@/types/rbac";

interface PermissionGateProps {
    permission?: ProjectPermission;     // Rename for clarity, was Permission
    orgPermission?: OrgPermission;      // New prop for Org permissions
    projectRole?: ProjectRole | string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
    permission,
    orgPermission,
    projectRole,
    fallback = null,
    children,
}) => {
    const { hasProjectPermission, hasOrgPermission } = usePermissions(projectRole);

    if (permission && !hasProjectPermission(permission)) {
        return <>{fallback}</>;
    }

    if (orgPermission && !hasOrgPermission(orgPermission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
