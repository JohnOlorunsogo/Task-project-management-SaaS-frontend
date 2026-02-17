import React, { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { useOrgStore } from "@/store/orgStore";
import {
    Users,
    Settings as SettingsIcon,
    UserPlus,
    Trash2,
    Mail,
    Loader2,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrgService } from "@/api/org";
import { OrgRole } from "@/types/rbac";
import { usePermission } from "@/hooks/usePermission";


export default function SettingsPage() {
    const canManageMembers = usePermission("manage_org_members");
    const canManageTeams = usePermission("manage_teams");
    const [activeTab, setActiveTab] = useState<"general" | "members" | "teams">("members");
    const { currentOrgId, orgs, members, teams, fetchMembers, fetchTeams } = useOrgStore();

    const currentOrg = orgs.find(o => o.id === currentOrgId);

    // Fetch members and teams on mount or org change
    React.useEffect(() => {
        if (currentOrgId) {
            fetchMembers(currentOrgId);
            fetchTeams(currentOrgId);
        }
    }, [currentOrgId, fetchMembers, fetchTeams]);

    const [error, setError] = useState<string | null>(null);

    // Invite member mutation
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<OrgRole>(OrgRole.MEMBER);

    const inviteMutation = useMutation({
        mutationFn: async () => {
            if (!currentOrgId) return;
            return OrgService.addMember(currentOrgId, {
                email: inviteEmail,
                role: inviteRole
            });
        },
        onSuccess: () => {
            if (currentOrgId) fetchMembers(currentOrgId);
            setInviteEmail("");
            setInviteRole(OrgRole.MEMBER);
            setError(null);
        },
        onError: (err: any) => {
            setError(err.response?.data?.detail || "Failed to invite member");
        }
    });

    // Remove member mutation
    const removeMutation = useMutation({
        mutationFn: async (userId: string) => {
            if (!currentOrgId) return;
            return OrgService.removeMember(currentOrgId, userId);
        },
        onSuccess: () => {
            if (currentOrgId) fetchMembers(currentOrgId);
            setError(null);
        },
        onError: (err: any) => {
            setError(err.response?.data?.detail || "Failed to remove member");
        }
    });

    // Change role mutation
    const roleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: string, role: OrgRole }) => {
            if (!currentOrgId) return;
            return OrgService.changeMemberRole(currentOrgId, userId, { role });
        },
        onSuccess: () => {
            if (currentOrgId) fetchMembers(currentOrgId);
            setError(null);
        },
        onError: (err: any) => {
            setError(err.response?.data?.detail || "Failed to change role");
        }
    });

    // Create Team Mutation
    const [teamName, setTeamName] = useState("");
    const [teamDesc, setTeamDesc] = useState("");
    const createTeamMutation = useMutation({
        mutationFn: async () => {
            if (!currentOrgId) return;
            return OrgService.createTeam(currentOrgId, { name: teamName, description: teamDesc });
        },
        onSuccess: () => {
            if (currentOrgId) fetchTeams(currentOrgId);
            setTeamName("");
            setTeamDesc("");
        }
    });

    if (!currentOrgId) {
        return <div className="p-8 text-center text-slate-500">No organization selected.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your organization, team members, and teams.</p>
            </div>

            <div className="flex border-b border-slate-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("general")}
                    className={cn(
                        "px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center space-x-2 whitespace-nowrap",
                        activeTab === "general" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                >
                    <SettingsIcon className="w-4 h-4" />
                    <span>General</span>
                </button>
                <button
                    onClick={() => setActiveTab("members")}
                    className={cn(
                        "px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center space-x-2 whitespace-nowrap",
                        activeTab === "members" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Users className="w-4 h-4" />
                    <span>Members</span>
                </button>
                <button
                    onClick={() => setActiveTab("teams")}
                    className={cn(
                        "px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center space-x-2 whitespace-nowrap",
                        activeTab === "teams" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Users className="w-4 h-4" />
                    <span>Teams</span>
                </button>
            </div>

            {activeTab === "general" && (
                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Organization Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Organization Name</p>
                            <p className="text-slate-900 font-medium">{currentOrg?.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Slug</p>
                            <p className="text-slate-900 font-mono text-sm">{currentOrg?.slug}</p>
                        </div>
                    </div>
                </div>
            )}



            {activeTab === "members" && (
                <div className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center animate-in fade-in slide-in-from-top-1">
                            <span className="font-bold mr-2">Error:</span> {error}
                            <button onClick={() => setError(null)} className="ml-auto hover:text-red-900">
                                <span className="sr-only">Dismiss</span>
                                ×
                            </button>
                        </div>
                    )}

                    {/* Invite Section */}
                    {canManageMembers && (
                        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold">Invite Members</h3>
                                    <p className="text-sm text-slate-500">Add new people to your organization by email.</p>
                                </div>
                                <UserPlus className="w-8 h-8 text-primary/20" />
                            </div>

                            <form
                                onSubmit={(e) => { e.preventDefault(); inviteMutation.mutate(); }}
                                className="flex flex-col md:flex-row gap-4"
                            >
                                <div className="flex-1">
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white text-sm"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-48">
                                    <select
                                        className="w-full px-4 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white text-sm"
                                        value={inviteRole}
                                        onChange={(e) => setInviteRole(e.target.value as OrgRole)}
                                    >
                                        <option value={OrgRole.MEMBER}>Member</option>
                                        <option value={OrgRole.PROJ_ADMIN}>Project Admin</option>
                                        <option value={OrgRole.ORG_ADMIN}>Org Admin</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={inviteMutation.isPending || !inviteEmail}
                                    className="bg-primary text-white px-8 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition shadow-md disabled:opacity-50 flex items-center justify-center whitespace-nowrap min-w-[140px]"
                                >
                                    {inviteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Invite"}
                                </button>
                            </form>
                            {inviteMutation.isSuccess && (
                                <p className="mt-3 text-sm text-emerald-600 flex items-center font-medium animate-in fade-in slide-in-from-top-1">
                                    <Check className="w-4 h-4 mr-1.5" /> Invitation sent!
                                </p>
                            )}
                        </div>
                    )}

                    {/* Members List */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-200">
                            <h3 className="font-bold text-slate-800">Org Members ({members?.length || 0})</h3>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {members?.map((m) => (
                                <div key={m.id} className="px-8 py-5 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                            {m.full_name?.charAt(0) || m.email?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {m.full_name || m.email}
                                            </p>
                                            <div className="flex items-center mt-1">
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                                                    m.role === OrgRole.ORG_ADMIN ? "bg-amber-100 text-amber-700" :
                                                        m.role === OrgRole.PROJ_ADMIN ? "bg-blue-100 text-blue-700" :
                                                            "bg-slate-100 text-slate-600"
                                                )}>
                                                    {m.role.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {canManageMembers && (
                                        <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <select
                                                value={m.role}
                                                onChange={(e) => roleMutation.mutate({ userId: m.user_id, role: e.target.value as OrgRole })}
                                                className="text-xs bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-primary/10"
                                            >
                                                <option value={OrgRole.MEMBER}>Member</option>
                                                <option value={OrgRole.PROJ_ADMIN}>Admin</option>
                                                <option value={OrgRole.ORG_ADMIN}>Org Admin</option>
                                            </select>
                                            <button
                                                onClick={() => removeMutation.mutate(m.user_id)}
                                                className="p-1.5 text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-md transition-colors"
                                                title="Remove member"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "teams" && (
                <div className="space-y-6">
                    {/* Create Team Section */}
                    {canManageTeams && (
                        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold">Create Team</h3>
                                    <p className="text-sm text-slate-500">Organize members into teams.</p>
                                </div>
                            </div>
                            <form
                                onSubmit={(e) => { e.preventDefault(); createTeamMutation.mutate(); }}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Team Name (e.g. Frontend)"
                                            className="w-full px-4 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white text-sm"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Description (Optional)"
                                            className="w-full px-4 py-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white text-sm"
                                            value={teamDesc}
                                            onChange={(e) => setTeamDesc(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={createTeamMutation.isPending || !teamName}
                                        className="bg-primary text-white px-8 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition shadow-md disabled:opacity-50 flex items-center justify-center whitespace-nowrap"
                                    >
                                        {createTeamMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Team"}
                                    </button>
                                </div>
                            </form>
                            {createTeamMutation.isSuccess && (
                                <p className="mt-3 text-sm text-emerald-600 flex items-center font-medium animate-in fade-in slide-in-from-top-1">
                                    <Check className="w-4 h-4 mr-1.5" /> Team created!
                                </p>
                            )}
                        </div>
                    )}


                    {/* Teams List */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-200">
                            <h3 className="font-bold text-slate-800">Teams ({teams?.length || 0})</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {teams?.map((team) => (
                                <div key={team.id} className="px-8 py-5 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{team.name}</h4>
                                        <p className="text-sm text-slate-500">{team.description || "No description"}</p>
                                    </div>
                                    {/* Future: Add Manage Team Members button or similar */}
                                </div>
                            ))}
                            {teams?.length === 0 && (
                                <div className="p-8 text-center text-slate-500">
                                    No teams yet. Create one above!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
