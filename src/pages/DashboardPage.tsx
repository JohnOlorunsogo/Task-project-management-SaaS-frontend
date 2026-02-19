import React, { useEffect } from "react";
import { Plus, Folder, Users, Clock, ArrowRight, Settings } from "lucide-react";
import { Link } from "react-router-dom";
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

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Overview</h1>
                    <p className="text-slate-500 text-lg">Welcome back, {user?.full_name}! Here is your command center.</p>
                </div>
                <div className="flex gap-3">
                    {isAdmin && (
                        <Link
                            to="/settings"
                            className="bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-medium flex items-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all active:scale-[0.98]"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Link>
                    )}
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-primary text-white px-4 py-2.5 rounded-xl font-semibold flex items-center shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5 mr-1.5" />
                        New Project
                    </button>
                </div>
            </div>

            {/* Stats Grid - Bento Box Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-primary p-6 rounded-3xl shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                    <Folder className="w-8 h-8 text-indigo-100 mb-6" />
                    <div>
                        <p className="text-indigo-100 font-medium mb-1">Active Projects</p>
                        <p className="text-4xl font-black tracking-tight">{projects?.length || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -mr-20"></div>
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shadow-purple-500/20">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 font-medium mb-1">Team Members</p>
                        <p className="text-4xl font-black text-slate-800 tracking-tight">{members.length || "—"}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl -mr-20"></div>
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shadow-orange-500/20">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 font-medium mb-1">Check-ins Today</p>
                        <p className="text-4xl font-black text-slate-800 tracking-tight">—</p>
                    </div>
                </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800 tracking-tight">Recent Projects</h3>
                    <Link to="/projects" className="text-sm font-semibold text-primary hover:text-indigo-700 bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">View all</Link>
                </div>

                <div className="divide-y divide-slate-100">
                    {projectsLoading ? (
                        <div className="px-8 py-16 text-center text-slate-400 flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-primary rounded-full animate-spin mb-4"></div>
                            <p className="font-medium">Loading your projects...</p>
                        </div>
                    ) : projects?.length === 0 ? (
                        <div className="px-8 py-16 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                                <Folder className="w-10 h-10 text-slate-300" />
                            </div>
                            <p className="text-slate-500 text-lg mb-4">You don't have any projects yet.</p>
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="text-primary font-semibold hover:text-indigo-700 underline underline-offset-4"
                            >
                                Create your first project
                            </button>
                        </div>
                    ) : (
                        projects?.slice(0, 5).map((project: any) => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/80 transition-all group block"
                            >
                                <div className="flex items-center space-x-5">
                                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm border border-slate-200 group-hover:from-indigo-100 group-hover:to-primary/20 group-hover:text-primary transition-all group-hover:border-primary/20">
                                        {project.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors mb-0.5 tracking-tight">{project.name}</h4>
                                        <p className="text-sm text-slate-500 truncate max-w-md">{project.description || "No description provided"}</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-md group-hover:scale-105">
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                                </div>
                            </Link>
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
