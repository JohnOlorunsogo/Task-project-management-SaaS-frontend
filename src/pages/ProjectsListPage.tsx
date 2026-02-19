import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    Plus,
    Folder,
    Search,
    Calendar,
    Trash2,
    MoreHorizontal,
    ArrowRight,
    Globe,
    User as UserIcon,
} from "lucide-react";
import { useOrgStore } from "@/store/orgStore";
import { useProjectStore } from "@/store/projectStore";
import CreateProjectModal from "@/components/CreateProjectModal";
import { usePermissions } from "@/hooks/usePermissions";

const ProjectsListPage: React.FC = () => {
    const { currentOrgId } = useOrgStore();
    const { projects, fetchProjects, deleteProject, loading: storeLoading } = useProjectStore();
    const queryClient = useQueryClient();

    const [isCreateOpen, setIsCreateOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);
    const [showAllProjects, setShowAllProjects] = React.useState(false);

    const { isAdmin } = usePermissions();

    // Fetch projects on mount or when org changes or toggle changes
    useEffect(() => {
        if (currentOrgId) {
            fetchProjects(showAllProjects && isAdmin); // Pass isAdmin flag if showAll is true
        }
    }, [currentOrgId, fetchProjects, showAllProjects, isAdmin]);

    const deleteMutation = useMutation({
        mutationFn: async (projectId: string) => {
            await deleteProject(projectId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] }); // Keep cache in sync if used elsewhere
            setDeletingId(null);
            setMenuOpenId(null);
        },
    });

    const filtered = React.useMemo(() => {
        if (!projects) return [];
        if (!searchQuery.trim()) return projects;
        const q = searchQuery.toLowerCase();
        return projects.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                (p.description || "").toLowerCase().includes(q)
        );
    }, [projects, searchQuery]);

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Random pastel color from project name
    const getProjectColor = (name: string) => {
        const colors = [
            "bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-orange-500",
            "bg-pink-500", "bg-cyan-500", "bg-indigo-500", "bg-amber-500",
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Projects</h1>
                    <p className="text-slate-500 text-lg">
                        Manage your {projects?.length || 0} active project{projects?.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold flex items-center shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5 mr-1.5" />
                    New Project
                </button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60">
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-md flex-1 group">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50/50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all shadow-sm"
                    />
                </div>

                {/* Admin View Toggle */}
                {isAdmin && (
                    <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setShowAllProjects(false)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center transition-all ${!showAllProjects ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        >
                            <UserIcon className="w-4 h-4 mr-2" />
                            My Projects
                        </button>
                        <button
                            onClick={() => setShowAllProjects(true)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center transition-all ${showAllProjects ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        >
                            <Globe className="w-4 h-4 mr-2" />
                            All Projects
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            {storeLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/60 rounded-3xl border border-slate-200 p-6 animate-pulse shadow-sm">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                                <div className="flex-1">
                                    <div className="h-5 bg-slate-200 rounded-md w-2/3 mb-2" />
                                    <div className="h-4 bg-slate-100 rounded-md w-1/3" />
                                </div>
                            </div>
                            <div className="h-4 bg-slate-100 rounded-md w-full mb-3" />
                            <div className="h-4 bg-slate-100 rounded-md w-4/5" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-16 text-center max-w-2xl mx-auto mt-12">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Folder className="w-10 h-10 text-slate-400" />
                    </div>
                    {searchQuery ? (
                        <>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No matching projects found</h3>
                            <p className="text-slate-500 text-base">We couldn't find any projects matching "{searchQuery}".</p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">You don't have any projects</h3>
                            <p className="text-slate-500 text-base mb-8">
                                {showAllProjects ? "There are no projects in this organization yet. Get started by creating one." : "You are not a member of any projects. Create one or ask to be invited."}
                            </p>
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="bg-primary text-white px-6 py-3 rounded-xl font-bold inline-flex items-center shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create New Project
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group relative hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Abstract Header Gradient based on Project Name */}
                            <div className={`h-28 w-full ${getProjectColor(project.name)} opacity-10 absolute top-0 left-0 transition-opacity group-hover:opacity-20`} />

                            <div className="p-6 relative z-10 h-full flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-4 min-w-0">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shrink-0 shadow-lg ${getProjectColor(project.name)} bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm border border-white/20`}>
                                            {project.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors truncate block tracking-tight"
                                            >
                                                {project.name}
                                            </Link>
                                            <p className="text-sm text-slate-500 font-medium">
                                                Created {formatDate(project.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Menu */}
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setMenuOpenId(menuOpenId === project.id ? null : project.id);
                                            }}
                                            className="p-2 bg-white hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                        {menuOpenId === project.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                                                <div className="absolute right-0 top-10 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-20 w-40 animate-in fade-in zoom-in-95">
                                                    <button
                                                        onClick={() => {
                                                            setDeletingId(project.id);
                                                            setMenuOpenId(null);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2.5" />
                                                        Delete Project
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <p className="text-slate-600 line-clamp-2 mb-6 min-h-[3rem] text-sm leading-relaxed flex-grow">
                                    {project.description || <span className="text-slate-400 italic">No description provided</span>}
                                </p>

                                {/* Placeholder progress bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5 px-0.5">
                                        <span>Progress</span>
                                        <span>75%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full w-3/4 rounded-full ${getProjectColor(project.name)} opacity-80`} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
                                    {project.start_date || project.end_date ? (
                                        <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                            {formatDate(project.start_date) || "—"}
                                            <span className="mx-1.5 text-slate-300">→</span>
                                            {formatDate(project.end_date) || "—"}
                                        </div>
                                    ) : (
                                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">No dates set</span>
                                    )}

                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all group-hover:scale-110"
                                    >
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Delete confirmation overlay */}
                            {deletingId === project.id && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-3xl flex items-center justify-center p-6 z-30 animate-in fade-in">
                                    <div className="text-center bg-white p-6 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm transform scale-100">
                                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Trash2 className="w-6 h-6" />
                                        </div>
                                        <p className="text-lg font-bold text-slate-900 mb-2">Delete Project?</p>
                                        <p className="text-sm text-slate-500 mb-6 px-4">This action is permanent and cannot be undone.</p>
                                        <div className="flex space-x-3 justify-center">
                                            <button
                                                onClick={() => setDeletingId(null)}
                                                className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex-1"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => deleteMutation.mutate(project.id)}
                                                disabled={deleteMutation.isPending}
                                                className="px-4 py-2.5 text-sm font-bold bg-destructive text-white rounded-xl hover:bg-destructive/90 transition-colors disabled:opacity-50 flex-1 shadow-md shadow-red-500/20"
                                            >
                                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </div>
    );
};

export default ProjectsListPage;
