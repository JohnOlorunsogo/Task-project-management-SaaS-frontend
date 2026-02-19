import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Clock,
    GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TaskListResponse } from "@/types/task";

interface KanbanTaskProps {
    task: TaskListResponse;
    isOverlay?: boolean;
}

const KanbanTask: React.FC<KanbanTaskProps> = ({ task, isOverlay }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical': return 'bg-purple-600';
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-orange-500';
            case 'low': return 'bg-blue-500';
            default: return 'bg-slate-400';
        }
    };

    const isCompleted = (statusName: string) => {
        const lower = statusName.toLowerCase();
        return lower.includes('done') || lower.includes('completed');
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group relative",
                isOverlay ? "shadow-2xl border-primary/30 ring-2 ring-primary/20 rotate-3 scale-105 z-50 cursor-grabbing" : "cursor-grab",
                isDragging ? "opacity-30 border-dashed border-slate-400 shadow-none bg-slate-50/50" : ""
            )}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide text-white shadow-sm", getPriorityColor(task.priority))}>
                    {task.priority}
                </div>
                <div {...attributes} {...listeners} className="p-1 -mr-2 -mt-1 text-slate-200 hover:text-slate-400 active:text-slate-600 opacity-0 group-hover:opacity-100 transition-all outline-none">
                    <GripVertical className="w-4 h-4" />
                </div>
            </div>

            <h4 className={cn(
                "font-semibold text-slate-800 text-sm mb-2",
                isCompleted(task.status_name) && "line-through text-slate-400"
            )}>
                {task.title}
            </h4>

            <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100/80">
                <div className="flex items-center space-x-3 text-slate-500 font-medium">
                    {task.subtask_count > 0 && (
                        <div className="flex items-center text-[11px] bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            {task.subtask_count} sub
                        </div>
                    )}
                    {task.due_date && (
                        <div className="flex items-center text-[11px] bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {format(new Date(task.due_date), 'MMM d')}
                        </div>
                    )}
                </div>

                {task.assignee_count > 0 && (
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-inner border border-slate-200/50">
                        {task.assignee_count}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanTask;
