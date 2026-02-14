import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OrgService } from "../api/org";
import { Organization, OrgMember, Team } from "../types/org";

interface OrgState {
    currentOrgId: string | null;
    orgs: Organization[];
    currentOrg: Organization | null;
    members: OrgMember[];
    teams: Team[];

    // Actions
    setOrgs: (orgs: Organization[]) => void;
    setCurrentOrg: (orgId: string) => void;
    fetchOrgs: () => Promise<Organization[]>;
    fetchMembers: (orgId: string) => Promise<OrgMember[]>;
    fetchTeams: (orgId: string) => Promise<Team[]>;
    clearOrgs: () => void;
}

export const useOrgStore = create<OrgState>()(
    persist(
        (set, get) => ({
            currentOrgId: null,
            orgs: [],
            currentOrg: null,
            members: [],
            teams: [],

            setOrgs: (orgs) => set({ orgs }),

            setCurrentOrg: (orgId) => {
                const org = get().orgs.find((o) => o.id === orgId) || null;
                set({ currentOrgId: orgId, currentOrg: org });
                // When org changes, we should probably fetch members and teams, 
                // but we let components trigger that to avoid side-effects in setter
            },

            fetchOrgs: async () => {
                try {
                    const orgs = await OrgService.listMyOrganizations();
                    set({ orgs });

                    // Auto-select first org if none selected or current is invalid
                    const currentId = get().currentOrgId;
                    if (orgs.length > 0 && (!currentId || !orgs.find((o) => o.id === currentId))) {
                        set({
                            currentOrgId: orgs[0].id,
                            currentOrg: orgs[0]
                        });
                    }
                    return orgs;
                } catch (error) {
                    console.error("Failed to fetch organizations", error);
                    return [];
                }
            },

            fetchMembers: async (orgId: string) => {
                try {
                    const members = await OrgService.listMembers(orgId);
                    set({ members });
                    return members;
                } catch (error) {
                    console.error("Failed to fetch members", error);
                    return [];
                }
            },

            fetchTeams: async (orgId: string) => {
                try {
                    const teams = await OrgService.listTeams(orgId);
                    set({ teams });
                    return teams;
                } catch (error) {
                    console.error("Failed to fetch teams", error);
                    return [];
                }
            },

            clearOrgs: () => set({ currentOrgId: null, orgs: [], currentOrg: null, members: [], teams: [] }),
        }),
        {
            name: "org-storage",
            partialize: (state) => ({ currentOrgId: state.currentOrgId, orgs: state.orgs }), // Only persist org selection
        }
    )
);
