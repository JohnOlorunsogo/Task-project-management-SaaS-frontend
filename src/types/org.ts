import { OrgRole } from "./rbac";

export interface Organization {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface OrgMember {
    id: string;
    org_id: string;
    user_id: string;
    role: OrgRole;
    joined_at: string;
    email: string;
    full_name: string;
    avatar_url?: string;
}

export interface UserMembership {
    org_id: string;
    org_name: string;
    role: OrgRole;
}

export interface Team {
    id: string;
    org_id: string;
    name: string;
    description?: string;
    created_at: string;
}

export interface TeamMember {
    id: string;
    team_id: string;
    user_id: string;
    created_at: string;
    // user details might be joined
    email?: string;
    full_name?: string;
}

// Request Models

export interface CreateOrgRequest {
    name: string;
    slug: string;
}

export interface UpdateOrgRequest {
    name?: string;
}

export interface AddMemberRequest {
    user_id?: string;
    email?: string;
    role?: OrgRole;
}

export interface ChangeMemberRoleRequest {
    role: OrgRole;
}

export interface CreateTeamRequest {
    name: string;
    description?: string;
}

export interface AddTeamMemberRequest {
    user_id: string;
}

// Response Models (Aliases for clarity, though they match the interfaces above)
export type OrgResponse = Organization;
export type OrgMemberResponse = OrgMember;
export type UserMembershipResponse = UserMembership;
export type TeamResponse = Team;
export type TeamMemberResponse = TeamMember;
