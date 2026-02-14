import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    X,
    Settings,
    Users,
    ListTodo,
    Loader2,
    Trash2,
    Plus,
    Check,
    GripVertical,
} from "lucide-react";
import { apiClient } from "@/api/client";
import { cn } from "@/lib/utils";
import { useOrgStore } from "@/store/orgStore";

interface ProjectSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({ isOpen, onClose, projectId }) => {
    const [activeTab, setActiveTab] = React.useState<"general" | "members" | "statuses">("general");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Sidebar */}
                <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900">Project Settings</h2>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={cn(
                                "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                activeTab === "general"
                                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <Settings className="w-4 h-4 mr-3" />
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab("members")}
                            className={cn(
                                "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                activeTab === "members"
                                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <Users className="w-4 h-4 mr-3" />
                            Members
                        </button>
                        <button
                            onClick={() => setActiveTab("statuses")}
                            className={cn(
                                "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                activeTab === "statuses"
                                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <ListTodo className="w-4 h-4 mr-3" />
                            Statuses
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center justify-end px-6 py-4 border-b border-slate-100">
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8">
                        {activeTab === "general" && <GeneralTab projectId={projectId} />}
                        {activeTab === "members" && <MembersTab projectId={projectId} />}
                        {activeTab === "statuses" && <StatusesTab projectId={projectId} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

const GeneralTab: React.FC<{ projectId: string }> = ({ projectId }) => {
    const queryClient = useQueryClient();
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [msg, setMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

    const { data: project, isLoading } = useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            const res = await apiClient.get(`/projects/${projectId}`);
            return res.data;
        },
    });

    React.useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description || "");
            setStartDate(project.start_date || "");
            setEndDate(project.end_date || "");
        }
    }, [project]);

    const updateMutation = useMutation({
        mutationFn: async () => {
            await apiClient.put(`/projects/${projectId}`, {
                name,
                description: description || null,
                start_date: startDate || null,
                end_date: endDate || null,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            setMsg({ type: "success", text: "Project updated successfully" });
            setTimeout(() => setMsg(null), 3000);
        },
        onError: () => {
            setMsg({ type: "error", text: "Failed to update project" });
        },
    });

    if (isLoading) return <div className="text-center py-10 text-slate-500">Loading settings...</div>;

    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">General Settings</h3>
                <p className="text-sm text-slate-500">Manage basic project information.</p>
            </div>
            {msg && (
                <div
                    className={cn(
                        "p-3 rounded-md text-sm border",
                        msg.type === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    )}
                >
                    {msg.text}
                </div>
            )}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                        />
                    </div>
                </div>
                <div className="pt-4">
                    <button
                        onClick={() => updateMutation.mutate()}
                        disabled={updateMutation.isPending}
                        className="bg-primary text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition flex items-center disabled:opacity-50"
                    >
                        {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const MembersTab: React.FC<{ projectId: string }> = ({ projectId }) => {
    const queryClient = useQueryClient();
    const currentOrgId = useOrgStore((state) => state.currentOrgId);
    const [isAddOpen, setIsAddOpen] = React.useState(false);

    const { data: members, isLoading } = useQuery({
        queryKey: ["project-members", projectId],
        queryFn: async () => {
            const res = await apiClient.get(`/projects/${projectId}/members`);
            return res.data;
        },
    });

    const { data: orgMembers, isLoading: orgLoading } = useQuery({
        queryKey: ["org-members", currentOrgId],
        queryFn: async () => {
            const res = await apiClient.get(`/organizations/${currentOrgId}/members`);
            return res.data;
        },
        enabled: !!currentOrgId,
    });

    const addMutation = useMutation({
        mutationFn: async (userId: string) => {
            await apiClient.post(`/projects/${projectId}/members`, {
                user_id: userId,
                role: "team_member",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
            setIsAddOpen(false);
        },
    });

    const removeMutation = useMutation({
        mutationFn: async (userId: string) => {
            await apiClient.delete(`/projects/${projectId}/members/${userId}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["project-members", projectId] }),
    });

    const changeRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
            await apiClient.put(`/projects/${projectId}/members/${userId}/role`, { role });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["project-members", projectId] }),
    });

    if (isLoading || orgLoading) return <div className="text-center py-10 text-slate-500">Loading members...</div>;

    const availableToAdd = orgMembers?.filter(
        (om: any) => !members?.find((pm: any) => pm.user_id === om.user_id)
    );

    const getMemberDetails = (userId: string) => {
        return orgMembers?.find((m: any) => m.user_id === userId) || { user: { full_name: "Unknown User", email: "" } };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Project Members</h3>
                    <p className="text-sm text-slate-500">Manage who has access to this project.</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-primary text-white px-3 py-2 rounded-md font-medium text-sm flex items-center hover:bg-primary/90 transition"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                </button>
            </div>

            {isAddOpen && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-sm font-semibold text-slate-800 mb-3">Add from Organization</h4>
                    <div className="space-y-2">
                        {availableToAdd?.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">No other organization members to add.</p>
                        ) : (
                            availableToAdd?.map((m: any) => (
                                <div key={m.user_id} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                                            {m.user.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{m.user.full_name}</p>
                                            <p className="text-xs text-slate-400">{m.user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addMutation.mutate(m.user_id)}
                                        className="text-primary hover:bg-primary/5 px-3 py-1.5 rounded text-xs font-medium transition"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))
                        )}
                        <button onClick={() => setIsAddOpen(false)} className="text-xs text-slate-500 hover:underline mt-2">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
                {members?.map((member: any) => {
                    const details = getMemberDetails(member.user_id);
                    return (
                        <div key={member.id} className="p-4 flex items-center justify-between bg-white">
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                                    {details.user.full_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{details.user.full_name}</p>
                                    <p className="text-xs text-slate-500">{details.user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <select
                                    value={member.role}
                                    onChange={(e) => changeRoleMutation.mutate({ userId: member.user_id, role: e.target.value })}
                                    className="text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-primary bg-slate-50"
                                >
                                    <option value="owner">Owner</option>
                                    <option value="project_manager">Manager</option>
                                    <option value="team_member">Member</option>
                                    <option value="viewer">Viewer</option>
                                </select>
                                {member.role !== "owner" && (
                                    <button
                                        onClick={() => removeMutation.mutate(member.user_id)}
                                        className="text-slate-400 hover:text-destructive transition p-1"
                                        title="Remove member"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const StatusesTab: React.FC<{ projectId: string }> = ({ projectId }) => {
    const queryClient = useQueryClient();
    const [isCreating, setIsCreating] = React.useState(false);
    const [newName, setNewName] = React.useState("");
    const [newColor, setNewColor] = React.useState("#6B7280");

    const { data: statuses, isLoading } = useQuery({
        queryKey: ["project-statuses", projectId],
        queryFn: async () => {
            const res = await apiClient.get(`/projects/${projectId}/statuses`);
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async () => {
            await apiClient.post(`/projects/${projectId}/statuses`, {
                name: newName,
                color: newColor,
                position: Array.isArray(statuses) ? statuses.length : 0,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["project-statuses", projectId] });
            setIsCreating(false);
            setNewName("");
            setNewColor("#6B7280");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (statusId: string) => {
            await apiClient.delete(`/projects/${projectId}/statuses/${statusId}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["project-statuses", projectId] }),
    });

    if (isLoading) return <div className="text-center py-10 text-slate-500">Loading statuses...</div>;

    const colors = [
        "#6B7280", // Gray
        "#EF4444", // Red
        "#F59E0B", // Amber
        "#10B981", // Emerald
        "#3B82F6", // Blue
        "#8B5CF6", // Violet
        "#EC4899", // Pink
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Custom Statuses</h3>
                    <p className="text-sm text-slate-500">Define the workflow steps for tasks in this project.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-white px-3 py-2 rounded-md font-medium text-sm flex items-center hover:bg-primary/90 transition"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Status
                </button>
            </div>

            {isCreating && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center space-x-4 animate-in fade-in slide-in-from-top-2">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Status Name"
                        autoFocus
                        className="flex-1 px-3 py-2 border rounded-md border-slate-300 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <div className="flex space-x-1">
                        {colors.map((c) => (
                            <button
                                key={c}
                                onClick={() => setNewColor(c)}
                                className={cn(
                                    "w-6 h-6 rounded-full border-2 transition-all",
                                    newColor === c ? "border-slate-600 scale-110" : "border-transparent"
                                )}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => createMutation.mutate()}
                        disabled={!newName.trim()}
                        className="bg-primary text-white p-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsCreating(false)}
                        className="p-2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="space-y-2">
                {statuses?.map((status: any) => (
                    <div key={status.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 group">
                        <div className="flex items-center space-x-3">
                            <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: status.color }}
                            />
                            <span className="font-medium text-sm text-slate-700">{status.name}</span>
                            {status.is_default && (
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                                    Default
                                </span>
                            )}
                        </div>
                        <div className="flex items-center">
                            {!status.is_default && (
                                <button
                                    onClick={() => deleteMutation.mutate(status.id)}
                                    className="p-1.5 text-slate-300 hover:text-destructive transition opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectSettingsModal;
