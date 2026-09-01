"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Coins,
  ArrowUpDown,
  CalendarCheck,
  Users,
  BrainCircuit,
  Settings,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  Download,
  Calendar,
  Sparkles,
  Menu,
  Star,
  ChevronLeft,
  ChevronRight,
  CreditCard
} from "lucide-react";
import WealthView from "./wealth-view";
import MoneyFlowView from "./money-flow-view";
import WealthAddDrawer from "./wealth-add-drawer";
import CollaborationView from "./collaboration-view";
import SettingsView from "./settings-view";
import TaxPlannerView from "./tax-planner-view";
import AIAssistantView from "./ai-assistant-view";
import PricingView from "./pricing-view";
import ProFeatureGuard from "@/components/licensing/pro-feature-guard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";
import { BrandLogo } from "@/components/brand-logo";

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "Just now";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(diffInSeconds) || diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch (e) {
    return "Recently";
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const { firebaseUser, dbUser, loading: authLoading, logout: handleLogout } = useAuth();
  const [activeMenu, setActiveMenu] = React.useState("Dashboard");
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = React.useState(false);

  const [profileName, setProfileName] = React.useState(dbUser?.name || firebaseUser?.displayName || "User");
  const [summary, setSummary] = React.useState<any>(null);
  const [trends, setTrends] = React.useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = React.useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = React.useState(true);

  React.useEffect(() => {
    if (dbUser?.name) {
      setProfileName(dbUser.name);
    } else if (firebaseUser?.displayName) {
      setProfileName(firebaseUser.displayName);
    }
  }, [dbUser, firebaseUser]);

  const fetchDashboardData = React.useCallback(async () => {
    const userId = dbUser?.userId;
    if (!userId) return;
    setDashboardLoading(true);
    try {
      const [profileRes, summaryRes, trendsRes, txRes] = await Promise.all([
        apiClient.get(`/v1/profile/${userId}`),
        apiClient.get(`/v1/dashboard/summary`),
        apiClient.get(`/v1/dashboard/trends?months=6`),
        apiClient.get(`/v1/transaction/users/${userId}`)
      ]);

      if (profileRes.data?.success) {
        setProfileName(profileRes.data.data.name || "User");
      }
      if (summaryRes.data?.success) {
        setSummary(summaryRes.data.data);
      }
      if (trendsRes.data?.success) {
        setTrends(trendsRes.data.data);
      }
      if (txRes.data?.success) {
        setRecentTransactions(txRes.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setDashboardLoading(false);
    }
  }, [dbUser?.userId]);

  React.useEffect(() => {
    if (activeMenu === "Dashboard" && dbUser?.userId) {
      fetchDashboardData();
    }
    const handleWealthUpdated = () => {
      if (dbUser?.userId) {
        fetchDashboardData();
      }
    };
    window.addEventListener("finone-wealth-updated", handleWealthUpdated);
    return () => window.removeEventListener("finone-wealth-updated", handleWealthUpdated);
  }, [activeMenu, dbUser?.userId, fetchDashboardData]);

  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Wealth", icon: Coins },
    { name: "Money Flow", icon: ArrowUpDown },
    { name: "Tax Planner", icon: CalendarCheck },
    { name: "Collaboration", icon: Users },
    { name: "AI Assistant", icon: BrainCircuit },
    { name: "Settings", icon: Settings },
    { name: "Pricing", icon: CreditCard },
  ];

  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = React.useState<number>(0);
  const [notifLoading, setNotifLoading] = React.useState<boolean>(false);

  const fetchNotifications = React.useCallback(async () => {
    if (!dbUser?.userId) return;
    try {
      setNotifLoading(true);
      const res = await apiClient.get("/v1/notifications");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setNotifications(res.data.data);
        const unread = res.data.data.filter((n: any) => !n.isRead).length;
        setUnreadNotifCount(unread);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setNotifLoading(false);
    }
  }, [dbUser?.userId]);

  React.useEffect(() => {
    if (dbUser?.userId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 45000);
      return () => clearInterval(interval);
    }
  }, [dbUser?.userId, fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await apiClient.put("/v1/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotifCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleMarkAsRead = async (id: string, actionUrl?: string) => {
    try {
      await apiClient.put(`/v1/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadNotifCount((prev) => Math.max(0, prev - 1));
      if (actionUrl) {
        const menuMatch = ["Wealth", "Money Flow", "Tax Planner", "Collaboration", "AI Assistant", "Settings", "Pricing"].find(
          (m) =>
            actionUrl.toLowerCase().includes(m.toLowerCase().replace(" ", "-")) ||
            actionUrl.toLowerCase().includes(m.toLowerCase())
        );
        if (menuMatch) {
          setActiveMenu(menuMatch);
          setShowNotifications(false);
        } else if (actionUrl.startsWith("/")) {
          router.push(actionUrl);
          setShowNotifications(false);
        }
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await apiClient.delete(`/v1/notifications/${id}`);
      setNotifications((prev) => {
        const filtered = prev.filter((n) => n.id !== id);
        setUnreadNotifCount(filtered.filter((n) => !n.isRead).length);
        return filtered;
      });
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  // Helper component to render active menu screen
  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return (
          <DashboardView
            userName={profileName}
            summary={summary}
            trends={trends}
            recentTransactions={recentTransactions}
            loading={dashboardLoading}
          />
        );
      case "Wealth":
        return <WealthView onAddClick={() => setIsAddDrawerOpen(true)} onUpgradeClick={() => setActiveMenu("Pricing")} />;
      case "Money Flow":
        return <MoneyFlowView onUpgradeClick={() => setActiveMenu("Pricing")} />;
      case "Tax Planner":
        return <TaxPlannerView onUpgradeClick={() => setActiveMenu("Pricing")} />;
      case "Collaboration":
        return <CollaborationView onUpgradeClick={() => setActiveMenu("Pricing")} />;
      case "AI Assistant":
        return <AIAssistantView onUpgradeClick={() => setActiveMenu("Pricing")} />;
      case "Settings":
        return <SettingsView />;
      case "Pricing":
        return <PricingView />;
      default:
        return (
          <DashboardView
            userName={profileName}
            summary={summary}
            trends={trends}
            recentTransactions={recentTransactions}
            loading={dashboardLoading}
          />
        );
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-semibold tracking-wide text-zinc-400">Authenticating session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-zinc-50/50 text-zinc-900 font-sans antialiased overflow-hidden">
      <WealthAddDrawer isOpen={isAddDrawerOpen} onClose={() => setIsAddDrawerOpen(false)} />
      {/* 1. Left Fixed Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-zinc-200 bg-white transition-all duration-300 ${
        isSidebarExpanded ? "w-[260px]" : "w-[72px]"
      }`}>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-center px-4 border-b border-zinc-100">
          <div className={`flex items-center gap-2.5 overflow-hidden w-full ${
            isSidebarExpanded ? "justify-start pl-1.5 animate-in fade-in duration-200" : "justify-center"
          }`}>
            {isSidebarExpanded ? (
              <BrandLogo className="text-base" />
            ) : (
              <span className="text-sm font-black select-none tracking-tighter"><span className="text-[#0047AB]">F</span><span className="text-[#FFB347]">D</span></span>
            )}
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className={`flex-1 space-y-1.5 py-6 ${isSidebarExpanded ? "px-4" : "px-3"}`}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`group relative flex w-full items-center rounded-lg h-9 text-sm font-medium transition-all duration-200 outline-none ${
                  isSidebarExpanded ? "px-3 justify-between" : "px-0 justify-center"
                } ${
                  isActive
                    ? "bg-blue-50/70 text-blue-600"
                    : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"
                }`}
              >
                {/* Active left border indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-blue-600 animate-in fade-in" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 stroke-[1.8] transition-transform group-hover:scale-105 shrink-0 ${
                      isActive ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-600"
                    } ${!isSidebarExpanded ? "mx-auto" : ""}`}
                  />
                  {isSidebarExpanded && (
                    <span className="truncate flex items-center gap-1.5 animate-in fade-in duration-200">
                      {item.name}
                      {item.name === "AI Assistant" && (
                        <Star className="h-3 w-3 fill-indigo-600 text-indigo-600 shrink-0" />
                      )}
                    </span>
                  )}
                </div>



                {/* Collapsed Tooltip */}
                {!isSidebarExpanded && (
                  <div className="absolute left-16 scale-0 rounded bg-zinc-950 px-2 py-1.5 text-xs font-semibold text-white shadow-md transition-all group-hover:scale-100 z-50 pointer-events-none whitespace-nowrap">
                    {item.name}
                    {item.name === "AI Assistant" && " ⭐"}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Collapse/Expand Toggle Button */}
        <div className="px-3 py-1.5 border-t border-zinc-100/70">
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className={`flex w-full items-center rounded-lg h-9 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all outline-none relative group ${
              isSidebarExpanded ? "justify-start gap-3 px-3" : "justify-center"
            }`}
            title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarExpanded ? (
              <>
                <ChevronLeft className="h-4.5 w-4.5 shrink-0" />
                <span className="truncate">Collapse Sidebar</span>
              </>
            ) : (
              <>
                <ChevronRight className="h-4.5 w-4.5 shrink-0" />
                {/* Tooltip for bottom expand toggle */}
                <div className="absolute left-16 scale-0 rounded bg-zinc-950 px-2 py-1.5 text-xs font-semibold text-white shadow-md transition-all group-hover:scale-100 z-50 pointer-events-none whitespace-nowrap">
                  Expand Sidebar
                </div>
              </>
            )}
          </button>
        </div>

      </aside>

      {/* Main Container Area */}
      <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
        isSidebarExpanded ? "pl-[260px]" : "pl-[72px]"
      }`}>
        {/* 2. Top Navigation Bar */}
        <header className="flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-8 relative z-10">
          {/* Page title and navigation depth */}
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-zinc-950">{activeMenu}</h1>
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-medium text-zinc-500">Overview</span>
          </div>

          {/* Notifications & Profile */}
          <div className="flex items-center gap-5">

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(true);
                  setShowProfileMenu(false);
                  fetchNotifications();
                }}
                className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 outline-none transition-colors border border-transparent hover:border-zinc-200/60"
                title="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {/* Unread indicator */}
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 ring-2 ring-white"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  {/* Backdrop overlay */}
                  <div
                    onClick={() => setShowNotifications(false)}
                    className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
                  />
                  {/* Notification Drawer Side-bar */}
                  <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 border-l border-zinc-200 bg-white p-6 shadow-2xl flex flex-col transition-all duration-300 transform translate-x-0 animate-in slide-in-from-right duration-300 ease-out">
                    <div className="flex items-center justify-between border-b border-zinc-150 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4.5 w-4.5 text-blue-600" />
                        <h2 className="text-sm font-bold text-zinc-900">Notifications</h2>
                        {unreadNotifCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                            {unreadNotifCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        {notifications.length > 0 && unreadNotifCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors border border-transparent outline-none cursor-pointer flex items-center justify-center font-bold text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 divide-y divide-zinc-100 overflow-y-auto pr-1">
                      {notifLoading && notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-zinc-400 gap-2">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                          <span className="text-xs">Loading notifications...</span>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                          <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                            <Bell className="h-5 w-5" />
                          </div>
                          <p className="text-xs font-semibold text-zinc-800">No notifications</p>
                          <p className="text-[11px] text-zinc-400 mt-1 max-w-[220px]">
                            You are all caught up! Reminders and alerts will appear here.
                          </p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleMarkAsRead(n.id, n.actionUrl)}
                            className={`group py-3 px-2.5 rounded-lg hover:bg-zinc-50 transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                              !n.isRead ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${n.isRead ? "text-zinc-600 font-normal" : "text-zinc-900 font-semibold"}`}>
                                {n.title || n.message}
                              </p>
                              {n.title && n.message && n.title !== n.message && (
                                <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug break-words">
                                  {n.message}
                                </p>
                              )}
                              <span className="text-[10px] text-zinc-400 mt-1 block">
                                {formatRelativeTime(n.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 mt-1">
                              {!n.isRead && (
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              )}
                              <button
                                onClick={(e) => handleDeleteNotification(e, n.id)}
                                className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity p-0.5 rounded text-xs"
                                title="Delete notification"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Vertical Divider */}
            <span className="h-5 w-[1px] bg-zinc-200" />

            {/* User Profile Section with Dropdown Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-zinc-50 transition-colors text-left outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-zinc-100 shadow-sm">
                  {dbUser?.name ? dbUser.name[0].toUpperCase() : (firebaseUser?.displayName ? firebaseUser.displayName[0].toUpperCase() : (dbUser?.email ? dbUser.email[0].toUpperCase() : (firebaseUser?.email ? firebaseUser.email[0].toUpperCase() : "U")))}
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-zinc-900 leading-tight">
                    {dbUser?.name || firebaseUser?.displayName || "FinOne User"}
                  </p>
                  <p className="text-[10px] text-zinc-500 leading-none mt-0.5">Premium Plan</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg shadow-zinc-200/50">
                  <div className="px-3 py-1.5 border-b border-zinc-100 mb-1">
                    <p className="text-xs font-bold text-zinc-900">
                      {dbUser?.name || firebaseUser?.displayName || "FinOne User"}
                    </p>
                    <p className="text-[9px] text-zinc-400 truncate mt-0.5">
                      {dbUser?.email || firebaseUser?.email || ""}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50/50 flex items-center gap-2 outline-none"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/20 p-8 scrollbar-thin">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// ==========================================
// Dashboard Component View (12-Column Grid)
// ==========================================
interface DashboardViewProps {
  userName: string;
  summary: any;
  trends: any[];
  recentTransactions: any[];
  loading: boolean;
}

const formatRupee = (value: number | undefined) => {
  if (value === undefined || value === null) return "₹0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  return "₹" + num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

function DashboardView({ userName, summary, trends, recentTransactions, loading }: DashboardViewProps) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Welcome Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-7 w-64 bg-zinc-200/80 rounded-lg" />
            <div className="h-4 w-96 bg-zinc-200/80 rounded-lg" />
          </div>
          <div className="h-10 w-32 bg-zinc-200/80 rounded-lg" />
        </div>
        
        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-zinc-150 rounded" />
                <div className="h-8 w-8 bg-zinc-150 rounded-lg" />
              </div>
              <div className="h-6 w-32 bg-zinc-150 rounded" />
            </div>
          ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-80 bg-white border border-zinc-200/80 rounded-2xl p-6" />
            <div className="h-64 bg-white border border-zinc-200/80 rounded-2xl p-6" />
          </div>
          <div className="lg:col-span-4 space-y-8">
            <div className="h-48 bg-white border border-zinc-200/80 rounded-2xl p-5" />
            <div className="h-48 bg-blue-50/50 border border-blue-100 rounded-2xl p-5" />
          </div>
        </div>
      </div>
    );
  }

  // Process SVG Trend Chart curve points
  const savingsValues = trends.map(t => t.savings);
  const maxSavings = Math.max(...savingsValues, 1);
  const minSavings = Math.min(...savingsValues, 0);
  const range = maxSavings - minSavings;

  const points = trends.map((t, index) => {
    const x = 10 + (index * 480) / (trends.length - 1 || 1);
    const pct = range > 0 ? (t.savings - minSavings) / range : 0.5;
    const y = 160 - pct * 130;
    return { x, y, ...t };
  });

  let lineD = "";
  let areaD = "";
  if (points.length > 0) {
    lineD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
    areaD = `${lineD} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">Welcome back, {userName}</h2>
          <p className="text-sm text-zinc-500 mt-1">Here is a quick breakdown of your portfolios and wealth indicators today.</p>
        </div>
      </div>

      {/* Dashboard Cards Placer (4 metrics) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Net Worth</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Coins className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">{formatRupee(summary?.netWorth)}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <TrendingUp className="h-3 w-3" />
                Live
              </span>
              <span className="text-zinc-400 font-medium">from connected assets</span>
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Monthly Income</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">{formatRupee(summary?.totalIncome)}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="text-zinc-400 font-medium">inward cash flow</span>
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Monthly Expenses</span>
            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <TrendingDown className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold tracking-tight text-rose-600">{formatRupee(summary?.totalExpense)}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="text-zinc-400 font-medium">outward spending</span>
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Monthly Net Savings</span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowUpDown className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-bold tracking-tight ${summary?.savings >= 0 ? "text-emerald-605" : "text-rose-605"}`}>
              {summary?.savings >= 0 ? "+" : ""}{formatRupee(summary?.savings)}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
                <Sparkles className="h-3 w-3" />
                {(summary?.savingsRate || 0).toFixed(1)}%
              </span>
              <span className="text-zinc-400 font-medium">savings rate</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main section - Charts and Transactions */}
      <div className="space-y-8">
        {/* Premium Vector Chart Representation */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Savings Accumulation Trend</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Historical growth across connected portfolios</p>
            </div>
          </div>
          {/* SVG Visualizing minimalist gradient curve */}
          <div className="relative h-64 w-full">
            {trends.length === 0 ? (
              <div className="flex items-center justify-center h-full text-zinc-400 text-xs">
                No historical trend data available.
              </div>
            ) : (
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f4f4f5" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#f4f4f5" strokeWidth="1" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f4f4f5" strokeWidth="1" />
                
                {/* Area Gradient */}
                {areaD && <path d={areaD} fill="url(#chartGradient)" />}
                
                {/* Line Curve */}
                {lineD && (
                  <path
                    d={lineD}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                )}

                {/* Data Points */}
                {points.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer"
                  >
                    <title>{`${p.month}: ${formatRupee(p.savings)}`}</title>
                  </circle>
                ))}
              </svg>
            )}
          </div>
          
          {/* Chart Month Labels */}
          {trends.length > 0 && (
            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-semibold mt-4 px-2.5">
              {trends.map((t, idx) => {
                const date = new Date(t.month + "-01");
                const label = date.toLocaleString("en-US", { month: "short" });
                return <span key={idx}>{label}</span>;
              })}
            </div>
          )}
        </div>

        {/* Recent Activity Table */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Recent Transactions</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Real-time asset deposits and advisory settlements</p>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-zinc-400">
                      No transactions logged yet.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-semibold text-zinc-900">{tx.merchant || tx.note || "Untitled Transaction"}</td>
                      <td className="px-6 py-3.5 text-zinc-500">{tx.categoryName || "Uncategorized"}</td>
                      <td className={`px-6 py-3.5 font-semibold ${tx.type === "INCOME" ? "text-emerald-600" : "text-zinc-900"}`}>
                        {tx.type === "INCOME" ? "+" : "-"}{formatRupee(tx.amount)}
                      </td>
                      <td className="px-6 py-3.5 text-zinc-500">
                        {new Date(tx.transactionDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          tx.reviewRequired 
                            ? "bg-amber-55 text-amber-705" 
                            : "bg-emerald-55 text-emerald-705"
                        }`}>
                          {tx.reviewRequired ? "Under Review" : "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Placeholder Component for Menu Screens
// ==========================================
interface PlaceholderProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

function PlaceholderView({ title, description, icon: Icon }: PlaceholderProps) {
  return (
    <div className="max-w-4xl mx-auto py-16 text-center space-y-6 flex flex-col items-center justify-center">
      <div className="h-16 w-16 rounded-2xl bg-zinc-100 border border-zinc-200/60 flex items-center justify-center text-zinc-400">
        <Icon className="h-8 w-8 stroke-[1.5]" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
        <p className="text-sm text-zinc-505 max-w-md mx-auto">{description}</p>
      </div>
      <button className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 px-4 text-xs font-semibold text-white shadow-sm transition-colors">
        Configure Module
      </button>
    </div>
  );
}

