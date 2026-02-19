// ---- Response Models ----

export interface TaskAssignmentResponse {
    user_id: string;
    email: string;
    full_name: string;
}

export interface TaskResponse {
    id: string;
    project_id: string;
    org_id: string;
    parent_id?: string;
    title: string;
    description?: string;
    status_id?: string;
    status_name: string;
    priority: string;
    due_date?: string;
    start_date?: string;
    end_date?: string;
    custom_properties?: Record<string, any>;
    position: number;
    created_by: string;
    created_at: string;
    updated_at: string;
    assignments: TaskAssignmentResponse[];
    subtask_count: number;
}

export interface TaskListResponse {
    id: string;
    project_id: string;
    title: string;
    status_name: string;
    priority: string;
    due_date?: string;
    position: number;
    assignee_count: number;
    subtask_count: number;
}

export interface CommentResponse {
    id: string;
    task_id: string;
    parent_id?: string;
    author_id: string;
    content: string;
    mentions: string[];
    created_at: string;
    updated_at: string;
    replies: CommentResponse[];
}

export interface TimeEntryResponse {
    id: string;
    task_id: string;
    user_id: string;
    started_at: string;
    ended_at?: string;
    duration_seconds?: number;
    description?: string;
    created_at: string;
}

export interface StartTimerResponse {
    id: string;
    task_id: string;
    user_id: string;
    started_at: string;
}

export interface KanbanColumn {
    status_id: string;
    status_name: string;
    tasks: TaskListResponse[];
}

export interface KanbanResponse {
    columns: KanbanColumn[];
}

export interface GanttTaskResponse {
    id: string;
    title: string;
    start_date?: string;
    end_date?: string;
    due_date?: string;
    dependencies: string[];
    progress: number;
}

export interface CalendarTaskResponse {
    id: string;
    title: string;
    due_date?: string;
    priority: string;
    status_name: string;
}

// ---- Request Models ----

export interface CreateTaskRequest {
    project_id: string;
    title: string;
    description?: string;
    status_id?: string;
    status_name?: string;
    priority?: string;
    due_date?: string;
    start_date?: string;
    end_date?: string;
    custom_properties?: Record<string, any>;
    assignee_ids?: string[];
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status_id?: string;
    status_name?: string;
    priority?: string;
    due_date?: string;
    start_date?: string;
    end_date?: string;
    custom_properties?: Record<string, any>;
    position?: number;
}

export interface CreateCommentRequest {
    content: string;
    parent_id?: string;
    mentions?: string[];
}

export interface CreateTimeEntryRequest {
    started_at: string;
    ended_at?: string;
    duration_seconds?: number;
    description?: string;
}
