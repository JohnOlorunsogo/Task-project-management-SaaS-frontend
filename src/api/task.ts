import { apiClient } from "./client";
import {
    TaskResponse,
    TaskListResponse,
    CreateTaskRequest,
    UpdateTaskRequest,
    CommentResponse,
    CreateCommentRequest,
    TimeEntryResponse,
    CreateTimeEntryRequest,
    StartTimerResponse,
    KanbanResponse,
    GanttTaskResponse,
    CalendarTaskResponse,
} from "../types/task";

export const TaskService = {
    // 1. Create Task
    createTask: async (data: CreateTaskRequest): Promise<TaskResponse> => {
        const response = await apiClient.post("/tasks", data);
        return response.data;
    },

    // 2. List Tasks (with optional filters)
    listTasks: async (params?: {
        project_id?: string;
        assignee_id?: string;
        status_name?: string;
        priority?: string;
    }): Promise<TaskListResponse[]> => {
        const response = await apiClient.get("/tasks", { params });
        return response.data;
    },

    // 3. My Tasks
    myTasks: async (): Promise<TaskListResponse[]> => {
        const response = await apiClient.get("/tasks/my");
        return response.data;
    },

    // 4. Get Task
    getTask: async (taskId: string): Promise<TaskResponse> => {
        const response = await apiClient.get(`/tasks/${taskId}`);
        return response.data;
    },

    // 5. Update Task
    updateTask: async (taskId: string, data: UpdateTaskRequest): Promise<TaskResponse> => {
        const response = await apiClient.put(`/tasks/${taskId}`, data);
        return response.data;
    },

    // 6. Delete Task
    deleteTask: async (taskId: string): Promise<void> => {
        await apiClient.delete(`/tasks/${taskId}`);
    },

    // 7. Add Comment
    addComment: async (taskId: string, data: CreateCommentRequest): Promise<CommentResponse> => {
        const response = await apiClient.post(`/tasks/${taskId}/comments`, data);
        return response.data;
    },

    // 8. List Comments
    listComments: async (taskId: string): Promise<CommentResponse[]> => {
        const response = await apiClient.get(`/tasks/${taskId}/comments`);
        return response.data;
    },

    // 9. Log Time
    logTime: async (taskId: string, data: CreateTimeEntryRequest): Promise<TimeEntryResponse> => {
        const response = await apiClient.post(`/tasks/${taskId}/time-logs`, data);
        return response.data;
    },

    // 10. Start Timer
    startTimer: async (taskId: string): Promise<StartTimerResponse> => {
        const response = await apiClient.post(`/tasks/${taskId}/time-entries/start`);
        return response.data;
    },

    // 11. Stop Timer
    stopTimer: async (taskId: string, entryId: string): Promise<TimeEntryResponse> => {
        const response = await apiClient.put(`/tasks/${taskId}/time-entries/${entryId}/stop`);
        return response.data;
    },

    // 12. List Time Entries
    listTimeEntries: async (taskId: string): Promise<TimeEntryResponse[]> => {
        const response = await apiClient.get(`/tasks/${taskId}/time-entries`);
        return response.data;
    },

    // 13. Kanban View
    kanbanView: async (projectId: string): Promise<KanbanResponse> => {
        const response = await apiClient.get("/tasks/views/kanban", { params: { project_id: projectId } });
        return response.data;
    },

    // 14. Gantt View
    ganttView: async (projectId: string): Promise<GanttTaskResponse[]> => {
        const response = await apiClient.get("/tasks/views/gantt", { params: { project_id: projectId } });
        return response.data;
    },

    // 15. Calendar View
    calendarView: async (projectId: string): Promise<CalendarTaskResponse[]> => {
        const response = await apiClient.get("/tasks/views/calendar", { params: { project_id: projectId } });
        return response.data;
    },
};
