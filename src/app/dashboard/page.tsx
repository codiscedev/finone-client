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
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Plus,
  Filter,
  Download,
  Calendar,
  Sparkles,
  DollarSign,
  FileText,
  MessageSquare,
  User
} from "lucide-react";
import WealthView from "./wealth-view";
import MoneyFlowView from "./money-flow-view";
import CollaborationView from "./collaboration-view";
import SettingsView from "./settings-view";
import TaxPlannerView from "./tax-planner-view";
import AIAssistantView from "./ai-assistant-view";

export default function DashboardPage() {
  const [activeMenu, setActiveMenu] = React.useState("Dashboard");
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Wealth", icon: Coins },
    { name: "Money Flow", icon: ArrowUpDown },
    { name: "Tax Planner", icon: CalendarCheck },
    { name: "Collaboration", icon: Users },
    { name: "AI Assistant", icon: BrainCircuit },
    { name: "Settings", icon: Settings },
  ];

  const notifications = [
    { id: 1, text: "Your monthly tax projection is ready to view.", time: "10m ago", read: false },
    { id: 2, text: "AI Assistant suggested rebalancing your growth portfolio.", time: "2h ago", read: false },
    { id: 3, text: "Collaboration invite accepted by Sarah (Financial Advisor).", time: "1d ago", read: true },
  ];

  // Helper component to render active menu screen
  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <DashboardView />;
      case "Wealth":
        return <WealthView />;
      case "Money Flow":
        return <MoneyFlowView />;
      case "Tax Planner":
        return <TaxPlannerView />;
      case "Collaboration":
        return <CollaborationView />;
      case "AI Assistant":
        return <AIAssistantView />;
      case "Settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50/50 text-zinc-900 font-sans antialiased overflow-hidden">
      {/* 1. Left Fixed Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-zinc-200 bg-white">
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-zinc-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <span className="text-base font-bold tracking-tight bg-gradient-to-r from-zinc-950 to-zinc-700 bg-clip-text text-transparent">
            FinOne client
          </span>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 outline-none ${
                  isActive
                    ? "bg-blue-50/70 text-blue-600"
                    : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 stroke-[1.8] transition-transform group-hover:scale-102 ${
                      isActive ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-600"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {/* Active selection dot indicator */}
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Account Preview */}
        <div className="border-t border-zinc-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-2.5">
            <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-600 text-sm">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 truncate">Anand Member</p>
              <p className="text-[10px] text-zinc-500 truncate">anand@finone.io</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container Area */}
      <div className="flex flex-1 flex-col pl-64 overflow-hidden">
        {/* 2. Top Navigation Bar */}
        <header className="flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-8 relative z-10">
          {/* Page title and navigation depth */}
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-zinc-950">{activeMenu}</h1>
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-medium text-zinc-500">Overview</span>
          </div>

          {/* Search, Notifications & Profile */}
          <div className="flex items-center gap-5">
            {/* Minimal Search Bar */}
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search commands, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 pl-9 pr-4 text-xs font-medium text-zinc-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Notification Bell with Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative rounded-lg p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 outline-none transition-colors border border-transparent hover:border-zinc-200/60"
              >
                <Bell className="h-4.5 w-4.5" />
                {/* Unread indicator */}
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-80 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg shadow-zinc-200/50 animate-in fade-in-50 slide-in-from-top-1">
                  <div className="flex items-center justify-between border-b border-zinc-100 px-3.5 py-2">
                    <span className="text-xs font-bold text-zinc-900">Notifications</span>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline">Mark all read</button>
                  </div>
                  <div className="divide-y divide-zinc-100 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-zinc-50/80 transition-colors flex items-start justify-between gap-2.5">
                        <div>
                          <p className={`text-xs ${n.read ? 'text-zinc-600' : 'text-zinc-900 font-semibold'}`}>{n.text}</p>
                          <span className="text-[10px] text-zinc-400 mt-1 block">{n.time}</span>
                        </div>
                        {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 mt-1.5" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <span className="h-5 w-[1px] bg-zinc-200" />

            {/* User Profile Section with Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-zinc-50 transition-colors text-left outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-zinc-100 shadow-sm">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-zinc-900 leading-tight">Anand Member</p>
                  <p className="text-[10px] text-zinc-500 leading-none mt-0.5">Premium Plan</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg shadow-zinc-200/50">
                  <div className="px-3 py-1.5 border-b border-zinc-100 mb-1">
                    <p className="text-xs text-zinc-500">Signed in as</p>
                    <p className="text-xs font-bold text-zinc-900 truncate">anand@finone.io</p>
                  </div>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100">
                    <User className="h-3.5 w-3.5" /> My Profile
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100">
                    <Settings className="h-3.5 w-3.5" /> Billing & Settings
                  </button>
                  <div className="border-t border-zinc-100 my-1" />
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-red-600 hover:bg-red-50/50">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// ==========================================
// Dashboard Component View (12-Column Grid)
// ==========================================
function DashboardView() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">Welcome back, Anand</h2>
          <p className="text-sm text-zinc-500 mt-1">Here is a quick breakdown of your portfolios and wealth indicators today.</p>
        </div>
        
        {/* Quick Utilities */}
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            Last 30 Days
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors">
            <Download className="h-3.5 w-3.5 text-zinc-500" />
            Export Statement
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Add Account
          </button>
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
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">$1,248,390.40</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <TrendingUp className="h-3 w-3" />
                +4.2%
              </span>
              <span className="text-zinc-400 font-medium">from last month</span>
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Monthly Net Flow</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpDown className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">+$12,480.00</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <TrendingUp className="h-3 w-3" />
                +12.8%
              </span>
              <span className="text-zinc-400 font-medium">savings index</span>
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Quarterly Taxes Est.</span>
            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <CalendarCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">$8,450.00</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded-md">
                15 Jun
              </span>
              <span className="text-zinc-400 font-medium">next payment deadline</span>
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">AI Asset Insights</span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BrainCircuit className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">4 Suggestions</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">
                <Sparkles className="h-3 w-3" />
                Optimized
              </span>
              <span className="text-zinc-400 font-medium">risk profile rebalanced</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main grid section (12 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side (8/12 Columns) - Charts and Transactions */}
        <div className="lg:col-span-8 space-y-8">
          {/* Premium Vector Chart Representation */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Wealth Accumulation Trend</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Historical growth across connected portfolios</p>
              </div>
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
                <button className="text-[10px] font-semibold px-2 py-1 rounded bg-white text-zinc-900 shadow-sm">1Y</button>
                <button className="text-[10px] font-semibold px-2 py-1 rounded text-zinc-500 hover:text-zinc-900">3Y</button>
                <button className="text-[10px] font-semibold px-2 py-1 rounded text-zinc-500 hover:text-zinc-900">ALL</button>
              </div>
            </div>
            {/* SVG Visualizing Stripe-like minimalist gradient curve */}
            <div className="relative h-64 w-full">
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
                <path
                  d="M 0 160 C 80 130, 120 170, 200 110 C 280 50, 360 80, 500 30 L 500 200 L 0 200 Z"
                  fill="url(#chartGradient)"
                />
                
                {/* Line Curve */}
                <path
                  d="M 0 160 C 80 130, 120 170, 200 110 C 280 50, 360 80, 500 30"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="200" cy="110" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <circle cx="500" cy="30" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              </svg>
              {/* Tooltip Overlay */}
              <div className="absolute top-16 left-[36%] rounded-lg bg-zinc-950 px-2.5 py-1.5 text-[10px] text-white font-medium shadow-md">
                <span className="text-zinc-400">Oct:</span> $1,192,300
              </div>
            </div>
            
            {/* Chart Month Labels */}
            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-semibold mt-4 px-1">
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
              <span>Jan</span>
              <span>Mar</span>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Recent Transactions</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Real-time asset deposits and advisory settlements</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-semibold hover:bg-zinc-50 transition-colors">
                <Filter className="h-3 w-3 text-zinc-500" />
                Filter
              </button>
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
                  <tr className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-zinc-900">Vanguard Growth ETF Deposit</td>
                    <td className="px-6 py-3.5 text-zinc-500">Security Investment</td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-600">+$4,200.00</td>
                    <td className="px-6 py-3.5 text-zinc-500">Jun 26, 2026</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Completed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-zinc-900">Sarah Jenkins (Advisory Fee)</td>
                    <td className="px-6 py-3.5 text-zinc-500">Professional Fees</td>
                    <td className="px-6 py-3.5 font-semibold text-zinc-900">-$250.00</td>
                    <td className="px-6 py-3.5 text-zinc-500">Jun 25, 2026</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Completed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-zinc-900">IRS Estimated Tax Q2</td>
                    <td className="px-6 py-3.5 text-zinc-500">Taxes</td>
                    <td className="px-6 py-3.5 font-semibold text-zinc-900">-$2,100.00</td>
                    <td className="px-6 py-3.5 text-zinc-500">Jun 15, 2026</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Completed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-zinc-900">Coinbase USDC Transfer</td>
                    <td className="px-6 py-3.5 text-zinc-500">Crypto Liquidity</td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-600">+$1,500.00</td>
                    <td className="px-6 py-3.5 text-zinc-500">Jun 12, 2026</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side (4/12 Columns) - Quick Actions & AI Advisor */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Actions Pane */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <h3 className="text-sm font-bold text-zinc-900 mb-4">Quick Wealth Actions</h3>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/40 p-3 text-left transition-all hover:bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <DollarSign className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Transfer & Move Wealth</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Fund portfolios or adjust cash reserves</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </button>

              <button className="flex w-full items-center justify-between rounded-xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/40 p-3 text-left transition-all hover:bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Schedule Tax Projections</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Optimize long-term capital tax offsets</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </button>

              <button className="flex w-full items-center justify-between rounded-xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/40 p-3 text-left transition-all hover:bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <MessageSquare className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">Request Consultant Call</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Collaborate directly with certified CPAs</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* AI Asset Insights Pane */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/40 to-indigo-50/30 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative overflow-hidden">
            {/* Small subtle background graphics */}
            <div className="absolute top-[-20px] right-[-20px] h-24 w-24 rounded-full bg-blue-500/5 blur-xl" />
            
            <div className="flex items-center gap-2 text-blue-600 mb-3">
              <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider">AI Asset Suggestion</h3>
            </div>
            <p className="text-xs font-bold text-zinc-900">Optimize Growth Portfolio allocations</p>
            <p className="text-xs text-zinc-600 leading-relaxed mt-1">
              Your growth portfolio risk profile is currently 14.2% higher than your set baseline. Reallocating $15,000 from high-volatility crypto indexes to treasury indexes can preserve yield while capping downside risk.
            </p>
            
            <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-blue-100/50">
              <button className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-[10px] font-bold text-white transition-colors">
                Apply Allocation
              </button>
              <button className="rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 px-3 py-1.5 text-[10px] font-bold text-zinc-700 transition-colors">
                Ignore Recommendation
              </button>
            </div>
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
        <p className="text-sm text-zinc-500 max-w-md mx-auto">{description}</p>
      </div>
      <button className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 px-4 text-xs font-semibold text-white shadow-sm transition-colors">
        Configure Module
      </button>
    </div>
  );
}
