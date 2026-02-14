import { apiClient } from "./client";
import {
    CreateOrgRequest,
    OrgResponse,
    UserMembershipResponse,
    UpdateOrgRequest,
    OrgMemberResponse,
    AddMemberRequest,
    ChangeMemberRoleRequest,
    CreateTeamRequest,
    TeamResponse,
    AddTeamMemberRequest,
    TeamMemberResponse
} from "../types/org";

export const OrgService = {
    // 1. Create Organization
    createOrganization: async (data: CreateOrgRequest): Promise<OrgResponse> => {
        const response = await apiClient.post("/organizations/", data);
        return response.data;
    },

    // 2. List My Organizations
    listMyOrganizations: async (): Promise<OrgResponse[]> => {
        const response = await apiClient.get("/organizations/me");
        return response.data;
    },

    // 3. List User Memberships
    listUserMemberships: async (userId?: string): Promise<UserMembershipResponse[]> => {
        const params = userId ? { user_id: userId } : {};
        const response = await apiClient.get("/organizations/memberships", { params });
        return response.data;
    },

    // 4. Get Organization
    getOrganization: async (orgId: string): Promise<OrgResponse> => {
        const response = await apiClient.get(`/organizations/${orgId}`);
        return response.data;
    },

    // 5. Update Organization
    updateOrganization: async (orgId: string, data: UpdateOrgRequest): Promise<OrgResponse> => {
        const response = await apiClient.put(`/organizations/${orgId}`, data);
        return response.data;
    },

    // 6. List Members
    listMembers: async (orgId: string): Promise<OrgMemberResponse[]> => {
        const response = await apiClient.get(`/organizations/${orgId}/members`);
        return response.data;
    },

    // 7. Add Member
    addMember: async (orgId: string, data: AddMemberRequest): Promise<OrgMemberResponse> => {
        const response = await apiClient.post(`/organizations/${orgId}/members`, data);
        return response.data;
    },

    // 8. Remove Member
    removeMember: async (orgId: string, userId: string): Promise<void> => {
        await apiClient.delete(`/organizations/${orgId}/members/${userId}`);
    },

    // 9. Change Member Role
    changeMemberRole: async (orgId: string, userId: string, data: ChangeMemberRoleRequest): Promise<OrgMemberResponse> => {
        const response = await apiClient.put(`/organizations/${orgId}/members/${userId}/role`, data);
        return response.data;
    },

    // 10. Create Team
    createTeam: async (orgId: string, data: CreateTeamRequest): Promise<TeamResponse> => {
        const response = await apiClient.post(`/organizations/${orgId}/teams`, data);
        return response.data;
    },

    // 11. List Teams
    listTeams: async (orgId: string): Promise<TeamResponse[]> => {
        const response = await apiClient.get(`/organizations/${orgId}/teams`);
        return response.data;
    },

    // 12. Add Team Member
    addTeamMember: async (orgId: string, teamId: string, data: AddTeamMemberRequest): Promise<TeamMemberResponse> => {
        const response = await apiClient.post(`/organizations/${orgId}/teams/${teamId}/members`, data);
        return response.data;
    },

    // 13. List Team Members
    listTeamMembers: async (orgId: string, teamId: string): Promise<TeamMemberResponse[]> => {
        const response = await apiClient.get(`/organizations/${orgId}/teams/${teamId}/members`);
        return response.data;
    },

    // 14. Remove Team Member
    removeTeamMember: async (orgId: string, teamId: string, userId: string): Promise<void> => {
        await apiClient.delete(`/organizations/${orgId}/teams/${teamId}/members/${userId}`);
    }
};
