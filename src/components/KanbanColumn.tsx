import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import KanbanTask from "./KanbanTask.tsx";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: any[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "w-80 flex flex-col h-full bg-slate-100/40 rounded-3xl border border-slate-200/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 relative overflow-hidden",
                isOver ? "bg-primary/5 border-primary/30 shadow-[inset_0_0_20px_rgba(var(--primary),0.05)] ring-1 ring-primary/20" : ""
            )}
        >
            {/* Subtle top indicator line based on status could go here */}
            {id === "To Do" && <div className="absolute top-0 left-0 right-0 h-1 bg-slate-300" />}
            {id === "In Progress" && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400" />}
            {id === "Completed" && <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400" />}

            <div className="p-5 flex items-center justify-between z-10">
                <div className="flex items-center space-x-2.5">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{title}</h3>
                    <span className="bg-white border border-slate-200 shadow-sm text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>
            </div>

            <div className="flex-1 px-3 pb-4 space-y-3 overflow-y-auto">
                <SortableContext
                    id={id}
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task) => (
                        <KanbanTask key={task.id} task={task} />
                    ))}
                </SortableContext>

                {tasks.length === 0 && !isOver && (
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs text-center p-4">
                        No tasks here
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
