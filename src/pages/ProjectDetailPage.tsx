import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
    List,
    Trello,
    Calendar,
    GanttChart,
    Settings,
    Plus,
    Filter,
    Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/projectStore";
import TaskListView from "./TaskListView.tsx";
import TaskBoardView from "./TaskBoardView.tsx";
import CreateTaskModal from "@/components/CreateTaskModal";
import ProjectSettingsModal from "@/components/ProjectSettingsModal";

const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const currentView = searchParams.get("view") || "list";

    const { currentProject, fetchProject, loading } = useProjectStore();

    useEffect(() => {
        if (projectId) {
            fetchProject(projectId);
        }
    }, [projectId, fetchProject]);

    const views = [
        { id: "list", label: "List", icon: List },
        { id: "board", label: "Board", icon: Trello },
        { id: "timeline", label: "Timeline", icon: GanttChart },
        { id: "calendar", label: "Calendar", icon: Calendar },
    ];

    if (loading) return <div className="p-8 text-center text-slate-500">Loading project...</div>;
    if (!currentProject) return <div className="p-8 text-center text-destructive">Project not found</div>;

    return (
        <div className="h-full flex flex-col -m-6">
            {/* Project Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-6 shrink-0 z-10 sticky top-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-primary rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-primary/20">
                            {currentProject.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{currentProject.name}</h1>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">Active Project</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Member Stack */}
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm z-[${4 - i}] bg-gradient-to-br from-slate-400 to-slate-500`}>
                                    U{i}
                                </div>
                            ))}
                            <button className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition shadow-sm z-0">
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="h-6 w-px bg-slate-200" />
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors shadow-sm border border-slate-200/60"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* View Switcher and Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 self-start">
                        {views.map((view) => (
                            <button
                                key={view.id}
                                onClick={() => setSearchParams({ view: view.id })}
                                className={cn(
                                    "flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                                    currentView === view.id
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                )}
                            >
                                <view.icon className={cn("w-4 h-4 mr-2", currentView === view.id ? "text-primary" : "text-slate-400")} />
                                {view.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                placeholder="Search tasks..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary md:w-56 md:focus:w-72 transition-all shadow-sm shadow-slate-200/50"
                            />
                        </div>
                        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm shadow-slate-200/50">
                            <Filter className="w-4 h-4 mr-2 text-slate-400" />
                            Filters
                        </button>
                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98]"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Task
                        </button>
                    </div>
                </div>
            </div>

            {/* View Content */}
            <div className="flex-1 overflow-hidden">
                {currentView === "list" && <TaskListView projectId={projectId!} />}
                {currentView === "board" && <TaskBoardView projectId={projectId!} />}
                {currentView === "timeline" && <div className="p-8 text-center text-slate-400">Timeline View Coming Soon</div>}
                {currentView === "calendar" && <div className="p-8 text-center text-slate-400">Calendar View Coming Soon</div>}
            </div>

            <CreateTaskModal
                projectId={projectId!}
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
            />

            <ProjectSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                projectId={projectId!}
            />
        </div>
    );
};

export default ProjectDetailPage;
