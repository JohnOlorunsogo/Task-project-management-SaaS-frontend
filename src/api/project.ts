import { apiClient } from "./client";
import {
    ProjectResponse,
    CreateProjectRequest,
    UpdateProjectRequest,
    CreateFromTemplateRequest,
    ProjectMemberResponse,
    AddProjectMemberRequest,
    ChangeProjectRoleRequest,
    UserProjectMembershipResponse,
    CustomStatusResponse,
    CreateStatusRequest,
    UpdateStatusRequest
} from "../types/project";

export const ProjectService = {
    // 1. Create Project
    createProject: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
        const response = await apiClient.post("/projects/", data);
        return response.data;
    },

    // 2. List My Projects
    listMyProjects: async (): Promise<ProjectResponse[]> => {
        const response = await apiClient.get("/projects/");
        return response.data;
    },

    // 3. List All Projects
    listAllProjects: async (): Promise<ProjectResponse[]> => {
        const response = await apiClient.get("/projects/all");
        return response.data;
    },

    // 4. Get Project
    getProject: async (projectId: string): Promise<ProjectResponse> => {
        const response = await apiClient.get(`/projects/${projectId}`);
        return response.data;
    },

    // 5. Update Project
    updateProject: async (projectId: string, data: UpdateProjectRequest): Promise<ProjectResponse> => {
        const response = await apiClient.put(`/projects/${projectId}`, data);
        return response.data;
    },

    // 6. Delete Project
    deleteProject: async (projectId: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}`);
    },

    // 7. Create Template
    createTemplate: async (data: CreateProjectRequest): Promise<ProjectResponse> => {
        const response = await apiClient.post("/projects/templates", data);
        return response.data;
    },

    // 8. List Templates
    listTemplates: async (): Promise<ProjectResponse[]> => {
        const response = await apiClient.get("/projects/templates/list");
        return response.data;
    },

    // 9. Create from Template
    createFromTemplate: async (templateId: string, data: CreateFromTemplateRequest): Promise<ProjectResponse> => {
        const response = await apiClient.post(`/projects/from-template/${templateId}`, data);
        return response.data;
    },

    // 10. List Members
    listMembers: async (projectId: string): Promise<ProjectMemberResponse[]> => {
        const response = await apiClient.get(`/projects/${projectId}/members`);
        return response.data;
    },

    // 11. Add Member
    addMember: async (projectId: string, data: AddProjectMemberRequest): Promise<ProjectMemberResponse> => {
        const response = await apiClient.post(`/projects/${projectId}/members`, data);
        return response.data;
    },

    // 12. Change Member Role
    changeMemberRole: async (projectId: string, userId: string, data: ChangeProjectRoleRequest): Promise<ProjectMemberResponse> => {
        const response = await apiClient.put(`/projects/${projectId}/members/${userId}/role`, data);
        return response.data;
    },

    // 13. Remove Member
    removeMember: async (projectId: string, userId: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/members/${userId}`);
    },

    // 14. Check Membership
    checkMembership: async (projectId: string, userId: string): Promise<UserProjectMembershipResponse> => {
        const response = await apiClient.get(`/projects/${projectId}/check-membership`, { params: { user_id: userId } });
        return response.data;
    },

    // 15. List Custom Statuses
    listStatuses: async (projectId: string): Promise<CustomStatusResponse[]> => {
        const response = await apiClient.get(`/projects/${projectId}/statuses`);
        return response.data;
    },

    // 16. Create Status
    createStatus: async (projectId: string, data: CreateStatusRequest): Promise<CustomStatusResponse> => {
        const response = await apiClient.post(`/projects/${projectId}/statuses`, data);
        return response.data;
    },

    // 17. Update Status
    updateStatus: async (projectId: string, statusId: string, data: UpdateStatusRequest): Promise<CustomStatusResponse> => {
        const response = await apiClient.put(`/projects/${projectId}/statuses/${statusId}`, data);
        return response.data;
    },

    // 18. Delete Status
    deleteStatus: async (projectId: string, statusId: string): Promise<void> => {
        await apiClient.delete(`/projects/${projectId}/statuses/${statusId}`);
    }
};
