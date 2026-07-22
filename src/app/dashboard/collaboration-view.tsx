"use client";

import * as React from "react";
import {
  Heart,
  Users,
  Building,
  Plane,
  Plus,
  ChevronRight,
  UserPlus,
  Settings,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface CollaborationViewProps {
  onUpgradeClick?: () => void;
}

interface WorkspaceMember {
  userId: string;
  name: string;
  email: string;
  contribution: number;
  role: string;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  type: string;
  targetAmount: number;
  targetDate: string;
  members: WorkspaceMember[];
}

export default function CollaborationView({ onUpgradeClick }: CollaborationViewProps) {
  const { dbUser } = useAuth();
  
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modal/Form States for Create Workspace
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = React.useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = React.useState("");
  const [newWorkspaceType, setNewWorkspaceType] = React.useState("Couple");
  const [newWorkspaceTarget, setNewWorkspaceTarget] = React.useState(100000);
  const [newWorkspaceDate, setNewWorkspaceDate] = React.useState("");

  // Modal States for Invite Member
  const [inviteWorkspaceId, setInviteWorkspaceId] = React.useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteError, setInviteError] = React.useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = React.useState<string | null>(null);

  const fetchWorkspaces = React.useCallback(async () => {
    try {
      const res = await apiClient.get("/v1/collaboration/workspaces");
      if (res.data?.success) {
        setWorkspaces(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch workspaces", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    try {
      const res = await apiClient.post("/v1/collaboration/workspaces", {
        name: newWorkspaceName,
        description: newWorkspaceDesc,
        type: newWorkspaceType,
        targetAmount: newWorkspaceTarget,
        targetDate: newWorkspaceDate
      });

      if (res.data?.success) {
        setIsCreateOpen(false);
        setNewWorkspaceName("");
        setNewWorkspaceDesc("");
        setNewWorkspaceType("Couple");
        setNewWorkspaceTarget(100000);
        setNewWorkspaceDate("");
        fetchWorkspaces();
      }
    } catch (err) {
      console.error("Failed to create workspace", err);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteWorkspaceId || !inviteEmail.trim()) return;

    setInviteError(null);
    setInviteSuccess(null);

    try {
      const res = await apiClient.post(`/v1/collaboration/workspaces/${inviteWorkspaceId}/invite`, {
        email: inviteEmail
      });

      if (res.data?.success) {
        setInviteSuccess(`Successfully added ${inviteEmail} to the workspace!`);
        setInviteEmail("");
        fetchWorkspaces();
        setTimeout(() => {
          setInviteWorkspaceId(null);
          setInviteSuccess(null);
        }, 2000);
      }
    } catch (err: any) {
      console.error("Failed to invite member", err);
      const errMsg = err.response?.data?.message || "Failed to add member. Please check if the email is registered.";
      setInviteError(errMsg);
    }
  };

  const handleContributionChange = async (workspaceId: string, contribution: number) => {
    // Optimistically update local UI state immediately to feel snappy
    setWorkspaces(prev => prev.map(w => {
      if (w.id === workspaceId) {
        return {
          ...w,
          members: w.members.map(m => {
            if (m.userId === dbUser?.userId) {
              return { ...m, contribution };
            }
            return m;
          })
        };
      }
      return w;
    }));

    try {
      await apiClient.put(`/v1/collaboration/workspaces/${workspaceId}/contribution`, {
        contribution
      });
      fetchWorkspaces();
    } catch (err) {
      console.error("Failed to save contribution", err);
    }
  };

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const getWorkspaceDetails = (type: string) => {
    switch (type) {
      case "Couple":
        return {
          icon: <Heart className="h-5 w-5 fill-red-500/10" />,
          colorClass: "bg-red-50 text-red-500",
          desc: "Designed for spouses or partners co-managing household investments"
        };
      case "Family":
        return {
          icon: <Users className="h-5 w-5" />,
          colorClass: "bg-indigo-50 text-indigo-500",
          desc: "Manage household insurance, medical assets, and budgets together"
        };
      case "Sibling":
        return {
          icon: <Building className="h-5 w-5" />,
          colorClass: "bg-amber-50 text-amber-500",
          desc: "Joint construction project & inherited asset oversight"
        };
      case "Trip":
        default:
        return {
          icon: <Plane className="h-5 w-5" />,
          colorClass: "bg-teal-50 text-teal-500",
          desc: "Collaborative travel budgeting & split settlements tracker"
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Collaboration</h2>
          <p className="text-sm text-zinc-500 mt-1">Manage shared finances, goals, and expenses with your family and friends.</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-semibold transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Create Workspace
        </Button>
      </div>

      {/* Collaboration Family Plan Upgrade Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-indigo-800 p-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20">
            <Users className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Collaborate with Spouses & Families</h4>
            <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed max-w-2xl">
              Add up to 6 members, set up joint net worth dashboards, co-manage loans, and coordinate savings goals in real-time.
            </p>
          </div>
        </div>
        <button
          onClick={onUpgradeClick}
          className="h-9 px-4 shrink-0 rounded-xl bg-white text-indigo-900 hover:bg-zinc-50 text-xs font-bold transition-all shadow-sm cursor-pointer outline-none"
        >
          Start Family Plan
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-zinc-500 animate-pulse">Loading collaboration workspaces...</p>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] rounded-2xl border-2 border-dashed border-zinc-200 bg-white p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">No workspaces yet</h3>
          <p className="text-xs text-zinc-500 max-w-xs mt-1">Create your first shared workspace to start co-tracking targets and contributions with partners.</p>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            Create Workspace
          </Button>
        </div>
      ) : (
        /* Grid Layout of Shared Workspaces */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {workspaces.map((workspace) => {
            const { icon, colorClass, desc } = getWorkspaceDetails(workspace.type);
            const totalContributions = workspace.members.reduce((sum, m) => sum + m.contribution, 0);
            const progress = workspace.targetAmount > 0 
              ? Math.min(Math.round((totalContributions / workspace.targetAmount) * 100), 100) 
              : 0;

            const myMemberRecord = workspace.members.find(m => m.userId === dbUser?.userId);

            return (
              <div key={workspace.id} className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group flex flex-col justify-between">
                <div>
                  {/* Card Header utilities */}
                  <div className="flex justify-between items-start">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
                      {icon}
                    </div>
                    <div className="flex gap-2.5">
                      <button 
                        onClick={() => {
                          setInviteWorkspaceId(workspace.id);
                          setInviteEmail("");
                          setInviteError(null);
                          setInviteSuccess(null);
                        }}
                        className="text-xs text-zinc-500 font-semibold hover:text-zinc-700 flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="h-3.5 w-3.5" /> Invite
                      </button>
                      <span className="text-zinc-200">|</span>
                      <span className="text-xs text-zinc-400 font-medium capitalize">{workspace.type} Target</span>
                    </div>
                  </div>

                  {/* Title & description */}
                  <div className="mt-5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-zinc-900">{workspace.name}</h3>
                      <div className="flex -space-x-1.5">
                        {workspace.members.map((m, idx) => (
                          <div 
                            key={m.userId}
                            className={`h-5 w-5 rounded-full border border-white flex items-center justify-center text-[9px] text-white font-bold ${
                              idx % 3 === 0 ? "bg-blue-500" : idx % 3 === 1 ? "bg-purple-500" : "bg-teal-500"
                            }`}
                          >
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold">{workspace.members.length} {workspace.members.length === 1 ? "Participant" : "Participants"}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{workspace.description || desc}</p>
                  </div>

                  {/* Goal Box */}
                  <div className="mt-5 rounded-xl border border-zinc-150 bg-zinc-50/50 p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-800">Workspace Savings Target</span>
                      {workspace.targetDate && (
                        <span className="text-[10px] font-bold text-zinc-400">Target Date: {workspace.targetDate}</span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Current: {formatRupee(totalContributions)} / {formatRupee(workspace.targetAmount)}</span>
                        <span className="text-blue-600 font-bold">{progress}% Progress</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" style={{ width: `${progress}%` }} />
                      </div>
                      {workspace.targetAmount > totalContributions && (
                        <p className="text-[10px] text-zinc-400 mt-1">Remaining to fund: {formatRupee(workspace.targetAmount - totalContributions)}</p>
                      )}
                    </div>

                    {/* Member contributions */}
                    <div className="space-y-3 pt-3 border-t border-zinc-200/50">
                      {workspace.members.map((m) => {
                        const isMe = m.userId === dbUser?.userId;
                        return (
                          <div key={m.userId} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-zinc-600">
                              <span>{m.name} {isMe && "(You)"}:</span>
                              <span className="font-bold text-zinc-800">{formatRupee(m.contribution)}</span>
                            </div>
                            {isMe ? (
                              <input
                                type="range"
                                min="0"
                                max={workspace.targetAmount || 1000000}
                                step={Math.round((workspace.targetAmount || 1000000) / 100)}
                                value={m.contribution}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setWorkspaces(prev => prev.map(w => {
                                    if (w.id === workspace.id) {
                                      return {
                                        ...w,
                                        members: w.members.map(mem => mem.userId === dbUser?.userId ? { ...mem, contribution: val } : mem)
                                      };
                                    }
                                    return w;
                                  }));
                                }}
                                onMouseUp={(e) => handleContributionChange(workspace.id, Number(e.currentTarget.value))}
                                onTouchEnd={(e) => handleContributionChange(workspace.id, Number(e.currentTarget.value))}
                                className="w-full h-1.2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AI Tip and action */}
                <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-start gap-2 max-w-sm">
                    <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      AI Suggestion: Standardize targets and coordinate periodic updates to reach your target of {formatRupee(workspace.targetAmount)} early.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setInviteWorkspaceId(workspace.id);
                      setInviteEmail("");
                      setInviteError(null);
                      setInviteSuccess(null);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0 cursor-pointer"
                  >
                    + Add Collaborator
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Overlay Modal for Create Workspace */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl relative border border-zinc-200 text-zinc-900">
            <button 
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-900 mb-2">Create Collaborative Workspace</h3>
            <p className="text-xs text-zinc-500 mb-4">Set up a target and track financial progress together with others.</p>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Workspace Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Couple", "Family", "Sibling", "Trip"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewWorkspaceType(type)}
                      className={`h-9 rounded-xl text-xs font-bold transition-all border ${
                        newWorkspaceType === type 
                          ? "bg-blue-600 border-transparent text-white shadow-sm" 
                          : "border-zinc-250 hover:border-zinc-350 text-zinc-600 bg-zinc-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Workspace Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Savings, Hawaii Trip"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="w-full h-10 px-3 border border-zinc-250 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-zinc-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Spouses co-managing home downpayment"
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                  className="w-full h-10 px-3 border border-zinc-250 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-zinc-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Target Goal (INR)</label>
                  <input
                    type="number"
                    min="1"
                    value={newWorkspaceTarget}
                    onChange={(e) => setNewWorkspaceTarget(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-zinc-250 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-zinc-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Target Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Dec 2027"
                    value={newWorkspaceDate}
                    onChange={(e) => setNewWorkspaceDate(e.target.value)}
                    className="w-full h-10 px-3 border border-zinc-250 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-zinc-50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-[0.99] mt-2"
              >
                Create Workspace
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Overlay Modal for Invite Member */}
      {inviteWorkspaceId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl relative border border-zinc-200 text-zinc-900">
            <button 
              onClick={() => setInviteWorkspaceId(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-900 mb-1">Add Workspace Partner</h3>
            <p className="text-xs text-zinc-500 mb-4">Invite another registered user to collaborate in this workspace.</p>

            <form onSubmit={handleInviteMember} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Registered Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="partner@finone.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-10 px-3 border border-zinc-250 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-zinc-50"
                />
              </div>

              {inviteError && (
                <div className="rounded-xl bg-red-55 text-red-700 border border-red-200/50 p-3 text-[11px] font-semibold flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}

              {inviteSuccess && (
                <div className="rounded-xl bg-emerald-55 text-emerald-700 border border-emerald-255 p-3 text-[11px] font-semibold flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{inviteSuccess}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={!!inviteSuccess}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-[0.99] mt-2 disabled:opacity-50"
              >
                Add Partner
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
