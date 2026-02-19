import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    CheckCircle2,
    Circle,
    Clock,
    MoreHorizontal,
    GripVertical
} from "lucide-react";
import { TaskService } from "@/api/task";
import { TaskListResponse } from "@/types/task";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskListViewProps {
    projectId: string;
}

const TaskListView: React.FC<TaskListViewProps> = ({ projectId }) => {
    const { data: tasks, isLoading } = useQuery({
        queryKey: ["tasks", projectId],
        queryFn: () => TaskService.listTasks({ project_id: projectId }),
    });

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical': return 'text-purple-600';
            case 'high': return 'text-red-500';
            case 'medium': return 'text-orange-500';
            case 'low': return 'text-blue-500';
            default: return 'text-slate-400';
        }
    };

    const getStatusStyle = (statusName: string) => {
        const lower = statusName.toLowerCase();
        if (lower.includes('done') || lower.includes('completed')) return "bg-green-100 text-green-700";
        if (lower.includes('progress')) return "bg-blue-100 text-blue-700";
        return "bg-slate-100 text-slate-600";
    };

    const isCompleted = (statusName: string) => {
        const lower = statusName.toLowerCase();
        return lower.includes('done') || lower.includes('completed');
    };

    if (isLoading) return <div className="p-12 text-center text-slate-500 text-sm">Loading tasks...</div>;

    return (
        <div className="h-full bg-slate-50/50 p-6 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                            <th className="w-10 px-4 py-3"></th>
                            <th className="px-4 py-3 font-semibold">Task Name</th>
                            <th className="w-32 px-4 py-3 font-semibold">Status</th>
                            <th className="w-32 px-4 py-3 font-semibold">Assignees</th>
                            <th className="w-32 px-4 py-3 font-semibold">Due Date</th>
                            <th className="w-24 px-4 py-3 font-semibold">Priority</th>
                            <th className="w-20 px-4 py-3 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {tasks?.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                    No tasks found in this project.
                                </td>
                            </tr>
                        ) : (
                            tasks?.map((task: TaskListResponse) => (
                                <tr key={task.id} className="group hover:bg-slate-50/80 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition mr-2 cursor-grab" />
                                            <button className="text-slate-300 hover:text-primary transition">
                                                {isCompleted(task.status_name) ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Circle className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "font-medium text-slate-900",
                                                isCompleted(task.status_name) && "line-through text-slate-400"
                                            )}>
                                                {task.title}
                                            </span>
                                            {task.subtask_count > 0 && (
                                                <span className="text-[11px] text-slate-400 mt-1">
                                                    {task.subtask_count} subtask{task.subtask_count !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider",
                                            getStatusStyle(task.status_name)
                                        )}>
                                            {task.status_name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-slate-600 text-xs">
                                            {task.assignee_count > 0
                                                ? `${task.assignee_count} assignee${task.assignee_count !== 1 ? 's' : ''}`
                                                : 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center text-slate-500">
                                            <Clock className="w-3 h-3 mr-1.5" />
                                            {task.due_date ? format(new Date(task.due_date), 'MMM d') : '-'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn("capitalize flex items-center", getPriorityColor(task.priority))}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="p-1 text-slate-400 hover:text-slate-900 rounded opacity-0 group-hover:opacity-100 transition">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskListView;
