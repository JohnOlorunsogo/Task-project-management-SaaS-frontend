import { ProjectRole } from "./rbac";

export interface Project {
    id: string;
    org_id: string;
    name: string;
    description?: string;
    owner_id: string;
    start_date?: string;
    end_date?: string;
    is_template: boolean;
    created_at: string;
    status?: string; // Optional per UI usage (Active etc), though not in API response spec explicitly it was in detailed page
}

export interface ProjectMember {
    id: string;
    project_id: string;
    user_id: string;
    role: ProjectRole;
    created_at: string;
    // potential join fields
    full_name?: string;
    email?: string;
}

export interface UserProjectMembership {
    project_id: string;
    user_id: string;
    role: ProjectRole;
}

export interface CustomStatus {
    id: string;
    project_id: string;
    name: string;
    position: number;
    color?: string;
    is_default: boolean;
    created_at: string;
}

// Request Models

export interface CreateProjectRequest {
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
}

export interface CreateFromTemplateRequest extends CreateProjectRequest { }

export interface AddProjectMemberRequest {
    user_id: string;
    role?: ProjectRole;
}

export interface ChangeProjectRoleRequest {
    role: ProjectRole;
}

export interface CreateStatusRequest {
    name: string;
    color?: string;
    position?: number;
}

export interface UpdateStatusRequest {
    name?: string;
    color?: string;
    position?: number;
}

// Response Models
export type ProjectResponse = Project;
export type ProjectMemberResponse = ProjectMember;
export type UserProjectMembershipResponse = UserProjectMembership;
export type CustomStatusResponse = CustomStatus;
