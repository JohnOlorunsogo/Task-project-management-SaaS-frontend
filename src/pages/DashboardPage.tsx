import React, { useEffect } from "react";
import { Plus, Folder, Users, Clock, ArrowRight, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useOrgStore } from "@/store/orgStore";
import { useAuthStore } from "@/store/authStore";
import { useProjectStore } from "@/store/projectStore";
import CreateProjectModal from "@/components/CreateProjectModal";
import { usePermissions } from "@/hooks/usePermissions";

const DashboardPage: React.FC = () => {
    const { currentOrgId, members } = useOrgStore();
    const { user } = useAuthStore();
    const { projects, fetchProjects, loading: projectsLoading } = useProjectStore();
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);

    const { isAdmin } = usePermissions();

    useEffect(() => {
        if (currentOrgId) {
            // Fetch projects. If admin, we might want to see all, but for dashboard "Overview" 
            // usually showing "My Projects" or "All" depends on requirements. 
            // Let's stick to default (My Projects) or All if we want to show stats.
            // For now, let's fetch based on admin status to show relevant counts? 
            // Actually, usually dashboard shows what user has access to. 
            // Let's use fetchProjects(false) for now to show "My Projects" in the list, 
            // or pass isAdmin if we want them to see everything.
            // Given the previous implementation used "/projects" which is usually "my projects" unless strictly admin endpoint used.
            // Let's assume fetchProjects() default (false) is safe.
            fetchProjects(false);
        }
    }, [currentOrgId, fetchProjects]);

    const stats = [
        { label: "Active Projects", value: projects?.length || 0, icon: Folder, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Team Members", value: members.length || "—", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Check-ins Today", value: "—", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Organization Overview</h1>
                    <p className="text-slate-500">Welcome back, {user?.full_name}! Here is what is happening in your organization.</p>
                </div>
                <div className="flex gap-3">
                    {isAdmin && (
                        <Link
                            to="/settings"
                            className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-md font-medium flex items-center shadow-sm hover:bg-slate-50 transition"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-primary text-white px-4 py-2 rounded-md font-medium flex items-center shadow-sm hover:bg-primary/90 transition"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center hover:shadow-md transition-shadow">
                        <div className={cn("p-3 rounded-lg mr-4", stat.bg)}>
                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800">Recent Projects</h3>
                    <Link to="/projects" className="text-sm font-medium text-primary hover:text-primary/80 hover:underline">View all</Link>
                </div>

                <div className="divide-y divide-slate-100">
                    {projectsLoading ? (
                        <div className="px-6 py-12 text-center text-slate-500 flex flex-col items-center">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                            Loading projects...
                        </div>
                    ) : projects?.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Folder className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                            <p className="text-slate-500 mb-4">No projects yet.</p>
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="text-primary font-medium hover:underline"
                            >
                                Create your first project
                            </button>
                        </div>
                    ) : (
                        projects?.slice(0, 5).map((project: any) => (
                            <div key={project.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg">
                                        {project.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{project.name}</h4>
                                        <p className="text-sm text-slate-500 truncate max-w-md">{project.description || "No description"}</p>
                                    </div>
                                </div>
                                <Link
                                    to={`/projects/${project.id}`}
                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <CreateProjectModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </div>
    );
};

export default DashboardPage;
