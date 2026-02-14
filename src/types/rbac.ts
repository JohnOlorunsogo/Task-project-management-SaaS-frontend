export enum OrgRole {
    ORG_ADMIN = "org_admin",
    PROJ_ADMIN = "proj_admin",
    MEMBER = "member",
}

export enum ProjectRole {
    OWNER = "owner",
    ADMIN = "admin",
    PROJECT_MANAGER = "project_manager",
    TEAM_MEMBER = "team_member",
    VIEWER = "viewer",
}

export enum ProjectPermission {
    DELETE_PROJECT = "delete_project",
    EDIT_PROJECT = "edit_project",
    MANAGE_MEMBERS = "manage_members",
    ASSIGN_ROLES = "assign_roles",
    CREATE_TASK = "create_task",
    EDIT_ANY_TASK = "edit_any_task",
    DELETE_ANY_TASK = "delete_any_task",
    EDIT_ASSIGNED_TASK = "edit_assigned_task",
    DELETE_ASSIGNED_TASK = "delete_assigned_task",
    ASSIGN_TASK = "assign_task",
    CHANGE_STATUS = "change_status",
    POST_COMMENT = "post_comment",
    LOG_TIME = "log_time",
    MANAGE_ATTACHMENTS = "manage_attachments",
    VIEW = "view",
}

export enum OrgPermission {
    MANAGE_ORG_MEMBERS = "manage_org_members",
    MANAGE_ORG_ROLES = "manage_org_roles",
    MANAGE_PROJECTS = "manage_projects",
    MANAGE_TEAMS = "manage_teams",
    MANAGE_ORG_SETTINGS = "manage_org_settings",
    VIEW_ANALYTICS = "view_analytics",
}

export const PROJECT_PERMISSIONS: Record<ProjectRole, ProjectPermission[]> = {
    [ProjectRole.OWNER]: Object.values(ProjectPermission),
    [ProjectRole.ADMIN]: [
        ProjectPermission.EDIT_PROJECT,
        ProjectPermission.MANAGE_MEMBERS,
        ProjectPermission.ASSIGN_ROLES,
        ProjectPermission.CREATE_TASK,
        ProjectPermission.EDIT_ANY_TASK,
        ProjectPermission.DELETE_ANY_TASK,
        ProjectPermission.ASSIGN_TASK,
        ProjectPermission.CHANGE_STATUS,
        ProjectPermission.POST_COMMENT,
        ProjectPermission.LOG_TIME,
        ProjectPermission.MANAGE_ATTACHMENTS,
        ProjectPermission.VIEW,
    ],
    [ProjectRole.PROJECT_MANAGER]: [
        ProjectPermission.CREATE_TASK,
        ProjectPermission.EDIT_ANY_TASK,
        ProjectPermission.DELETE_ANY_TASK,
        ProjectPermission.ASSIGN_TASK,
        ProjectPermission.CHANGE_STATUS,
        ProjectPermission.POST_COMMENT,
        ProjectPermission.LOG_TIME,
        ProjectPermission.MANAGE_ATTACHMENTS,
        ProjectPermission.VIEW,
    ],
    [ProjectRole.TEAM_MEMBER]: [
        ProjectPermission.CREATE_TASK,
        ProjectPermission.EDIT_ASSIGNED_TASK,
        ProjectPermission.DELETE_ASSIGNED_TASK,
        ProjectPermission.CHANGE_STATUS,
        ProjectPermission.POST_COMMENT,
        ProjectPermission.LOG_TIME,
        ProjectPermission.MANAGE_ATTACHMENTS,
        ProjectPermission.VIEW,
    ],
    [ProjectRole.VIEWER]: [ProjectPermission.VIEW],
};

export const ORG_PERMISSIONS: Record<OrgRole, OrgPermission[]> = {
    [OrgRole.ORG_ADMIN]: [
        OrgPermission.MANAGE_ORG_MEMBERS,
        OrgPermission.MANAGE_ORG_ROLES,
        OrgPermission.MANAGE_PROJECTS,
        OrgPermission.MANAGE_TEAMS,
        OrgPermission.MANAGE_ORG_SETTINGS,
        OrgPermission.VIEW_ANALYTICS,
    ],
    [OrgRole.PROJ_ADMIN]: [
        OrgPermission.MANAGE_PROJECTS,
        OrgPermission.MANAGE_TEAMS,
    ],
    [OrgRole.MEMBER]: [],
};
