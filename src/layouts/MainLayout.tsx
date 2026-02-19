import React from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom";
import {
    LayoutDashboard,
    FolderKanban,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import NotificationCenter from "@/components/NotificationCenter";
import { useOrgStore } from "@/store/orgStore";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const { user, logout, switchOrg } = useAuthStore();
    const { orgs, currentOrgId, setCurrentOrg, fetchOrgs, teams, fetchTeams } = useOrgStore();
    const navigate = useNavigate();

    const [orgCheckDone, setOrgCheckDone] = React.useState(false);
    const [hasOrgs, setHasOrgs] = React.useState(true);

    React.useEffect(() => {
        fetchOrgs().then((orgs) => {
            setHasOrgs(orgs.length > 0);
            setOrgCheckDone(true);
        });
    }, [fetchOrgs]);

    React.useEffect(() => {
        if (currentOrgId) {
            fetchTeams(currentOrgId);
        }
    }, [currentOrgId, fetchTeams]);

    const handleLogout = async () => {
        useOrgStore.getState().clearOrgs();
        await logout();
        navigate("/login");
    };


    // If user has no orgs, redirect to onboarding
    if (orgCheckDone && !hasOrgs) {
        return <Navigate to="/onboarding" replace />;
    }

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: FolderKanban, label: "My Projects", path: "/projects" }, // Future: expanded list
        { icon: Settings, label: "Settings", path: "/settings" },
    ];

    return (
        <div className="flex h-screen bg-slate-50/50 text-slate-900 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={cn(
                    "glass border-r border-slate-200/60 transition-all duration-300 flex flex-col z-20 shrink-0",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-slate-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-primary rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
                        <span className="text-white font-bold text-lg leading-none">T</span>
                    </div>
                    {!isCollapsed && <span className="ml-3 font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 truncate">Project Hub</span>}
                </div>

                {!isCollapsed && (
                    <div className="px-5 py-5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Organization
                        </label>
                        <select
                            value={currentOrgId || ""}
                            onChange={async (e) => {
                                if (e.target.value === "create-new") {
                                    navigate("/onboarding");
                                } else {
                                    setCurrentOrg(e.target.value);
                                    try {
                                        await switchOrg(e.target.value);
                                    } catch (error) {
                                        console.error("Failed to switch org", error);
                                    }
                                }
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition"
                        >
                            <option value="" disabled>Select Organization</option>
                            {orgs.map((org) => (
                                <option key={org.id} value={org.id}>
                                    {org.name}
                                </option>
                            ))}
                            <option value="create-new" className="text-primary font-medium">
                                + Create New Org
                            </option>
                        </select>
                    </div>
                )}

                <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/10 text-primary font-semibold shadow-sm"
                                    : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                                isCollapsed ? "mx-auto" : ""
                            )} />
                            {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                        </NavLink>
                    ))}

                    <div className="pt-6 pb-2">
                        <div className={cn("px-3 mb-3", isCollapsed ? "opacity-0" : "opacity-100 transition-opacity")}>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Teams
                            </span>
                        </div>
                        <div className="space-y-1">
                            {teams.length === 0 && !isCollapsed && (
                                <p className="px-3 text-xs text-slate-400 italic">No teams found</p>
                            )}
                            {teams.map((team) => (
                                <div
                                    key={team.id}
                                    className={cn(
                                        "w-full flex items-center px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 text-sm cursor-pointer transition-colors",
                                        isCollapsed ? "justify-center" : ""
                                    )}
                                >
                                    <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 shadow-sm shadow-indigo-400/50" />
                                    {!isCollapsed && <span className="ml-3 truncate font-medium">{team.name}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="p-3 border-t border-slate-200/50 space-y-1">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 transition-colors group"
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5 mx-auto transition-transform group-hover:translate-x-1" /> : <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />}
                        {!isCollapsed && <span className="ml-3 font-medium">Collapse</span>}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2.5 rounded-xl text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors group"
                    >
                        <LogOut className={cn("w-5 h-5 transition-transform group-hover:-translate-x-1", isCollapsed ? "mx-auto" : "")} />
                        {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 glass border-b border-slate-200/60 flex items-center justify-between px-8 z-10 shrink-0 sticky top-0">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-bold tracking-tight text-slate-800 truncate">
                            {user?.full_name ? `Dashboard` : "Welcome"}
                        </h2>
                        {currentOrgId && orgs.find(o => o.id === currentOrgId) && (
                            <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
                                {orgs.find(o => o.id === currentOrgId)?.name}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-6">
                        <NotificationCenter />

                        <div className="h-8 w-px bg-slate-200" />

                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-3 hover:bg-slate-100/80 p-1.5 pr-3 rounded-full transition-colors outline-none border border-transparent hover:border-slate-200"
                            >
                                <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-primary/20 text-indigo-700 rounded-full flex items-center justify-center font-bold shadow-inner">
                                    {user?.full_name?.charAt(0)}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-800 leading-none mb-0.5">{user?.full_name}</p>
                                    <p className="text-[10px] text-slate-500 leading-none">Admin</p>
                                </div>
                            </button>

                            {/* User Dropdown */}
                            {isUserMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-14 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-5 py-4 border-b border-slate-100 mb-1">
                                            <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name}</p>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                                        </div>
                                        <div className="px-2">
                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    navigate("/settings");
                                                }}
                                                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center"
                                            >
                                                <Settings className="w-4 h-4 mr-3 text-slate-400" />
                                                Account Settings
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors flex items-center mt-1"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
