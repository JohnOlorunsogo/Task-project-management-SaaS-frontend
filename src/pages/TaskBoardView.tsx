import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import {
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { TaskService } from "@/api/task";
import { TaskListResponse } from "@/types/task";
import KanbanColumn from "../components/KanbanColumn";
import KanbanTask from "../components/KanbanTask";

interface TaskBoardViewProps {
    projectId: string;
}

const COLUMNS = [
    { id: "To Do", title: "To Do" },
    { id: "In Progress", title: "In Progress" },
    { id: "Completed", title: "Completed" },
];

const TaskBoardView: React.FC<TaskBoardViewProps> = ({ projectId }) => {
    const queryClient = useQueryClient();
    const [activeTask, setActiveTask] = useState<TaskListResponse | null>(null);

    const { data: tasks, isLoading } = useQuery({
        queryKey: ["tasks", projectId],
        queryFn: () => TaskService.listTasks({ project_id: projectId }),
    });

    const updateTaskMutation = useMutation({
        mutationFn: async ({ taskId, status_name }: { taskId: string; status_name: string }) => {
            return TaskService.updateTask(taskId, { status_name });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        },
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const tasksByStatus = useMemo(() => {
        const groups: Record<string, TaskListResponse[]> = {};
        COLUMNS.forEach((col) => { groups[col.id] = []; });
        tasks?.forEach((task: TaskListResponse) => {
            if (groups[task.status_name]) {
                groups[task.status_name].push(task);
            }
        });
        return groups;
    }, [tasks]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks?.find((t: TaskListResponse) => t.id === active.id);
        setActiveTask(task || null);
    };

    const handleDragOver = (_event: DragOverEvent) => {
        // Implement logic for moving between columns if using sorting within columns
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id as string;
        const overId = over.id as string;

        // If dropped on a column
        const isOverColumn = COLUMNS.some((col) => col.id === overId);
        const task = tasks?.find((t: TaskListResponse) => t.id === taskId);

        if (isOverColumn && task && task.status_name !== overId) {
            updateTaskMutation.mutate({ taskId, status_name: overId });
        } else {
            // If dropped on another task
            const overTask = tasks?.find((t: TaskListResponse) => t.id === overId);
            if (overTask && task && task.status_name !== overTask.status_name) {
                updateTaskMutation.mutate({ taskId, status_name: overTask.status_name });
            }
        }
    };

    if (isLoading) return <div className="p-12 text-center text-slate-500">Loading board...</div>;

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5",
                },
            },
        }),
    };

    return (
        <div className="h-full bg-slate-50/50 p-6 overflow-x-auto">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex space-x-6 h-full min-w-max">
                    {COLUMNS.map((column) => (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            tasks={tasksByStatus[column.id]}
                        />
                    ))}
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeTask ? (
                        <div className="w-80 rotate-2 pointer-events-none">
                            <KanbanTask task={activeTask} isOverlay />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default TaskBoardView;
