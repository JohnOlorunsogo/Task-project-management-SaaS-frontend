import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProjectService } from "../api/project";
import { Project, ProjectMember, CustomStatus } from "../types/project";

interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    projectMembers: ProjectMember[];
    customStatuses: CustomStatus[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchProjects: (isAdmin?: boolean) => Promise<void>;
    fetchProject: (projectId: string) => Promise<Project | null>;
    createProject: (data: any) => Promise<void>;
    deleteProject: (projectId: string) => Promise<void>;

    fetchProjectMembers: (projectId: string) => Promise<void>;
    fetchCustomStatuses: (projectId: string) => Promise<void>;

    // Setters
    setCurrentProject: (project: Project | null) => void;
    clearProjectState: () => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],
            currentProject: null,
            projectMembers: [],
            customStatuses: [],
            loading: false,
            error: null,

            fetchProjects: async (isAdmin = false) => {
                set({ loading: true, error: null });
                try {
                    const projects = isAdmin
                        ? await ProjectService.listAllProjects()
                        : await ProjectService.listMyProjects();
                    set({ projects, loading: false });
                } catch (error: any) {
                    set({ error: error.message || "Failed to fetch projects", loading: false });
                }
            },

            fetchProject: async (projectId: string) => {
                set({ loading: true, error: null });
                try {
                    const project = await ProjectService.getProject(projectId);
                    set({ currentProject: project, loading: false });
                    return project;
                } catch (error: any) {
                    set({ error: error.message || "Failed to fetch project", loading: false });
                    return null;
                }
            },

            createProject: async (data) => {
                set({ loading: true, error: null });
                try {
                    await ProjectService.createProject(data);
                    // Refresh list
                    await get().fetchProjects();
                    set({ loading: false });
                } catch (error: any) {
                    set({ error: error.message || "Failed to create project", loading: false });
                }
            },

            deleteProject: async (projectId: string) => {
                set({ loading: true, error: null });
                try {
                    await ProjectService.deleteProject(projectId);
                    // Refresh list
                    const projects = get().projects.filter(p => p.id !== projectId);
                    set({ projects, loading: false });
                } catch (error: any) {
                    set({ error: error.message || "Failed to delete project", loading: false });
                }
            },

            fetchProjectMembers: async (projectId: string) => {
                try {
                    const members = await ProjectService.listMembers(projectId);
                    set({ projectMembers: members });
                } catch (error) {
                    console.error("Failed to fetch project members", error);
                }
            },

            fetchCustomStatuses: async (projectId: string) => {
                try {
                    const statuses = await ProjectService.listStatuses(projectId);
                    set({ customStatuses: statuses });
                } catch (error) {
                    console.error("Failed to fetch custom statuses", error);
                }
            },

            setCurrentProject: (project) => set({ currentProject: project }),
            clearProjectState: () => set({ projects: [], currentProject: null, projectMembers: [], customStatuses: [] }),
        }),
        {
            name: "project-storage",
            partialize: (state) => ({ projects: state.projects }), // Persist only list to avoid stale detail data
        }
    )
);
