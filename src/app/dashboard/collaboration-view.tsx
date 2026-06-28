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
  DollarSign,
  TrendingUp,
  FileText,
  MessageSquare,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollaborationViewProps {
  onUpgradeClick?: () => void;
}

export default function CollaborationView({ onUpgradeClick }: CollaborationViewProps) {
  // Couple Workspace interactive contributions
  const [husbandCont, setHusbandCont] = React.useState(2500000);
  const [wifeCont, setWifeCont] = React.useState(1500000);
  const coupleTotalGoal = 4000000;
  const coupleCurrentTotal = husbandCont + wifeCont;
  const coupleProgress = Math.min(Math.round((coupleCurrentTotal / coupleTotalGoal) * 100), 100);

  // Sibling Workspace interactive contributions
  const [brotherA, setBrotherA] = React.useState(1500000);
  const [brotherB, setBrotherB] = React.useState(1500000);
  const [brotherC, setBrotherC] = React.useState(1200000);
  const siblingTotalGoal = 5000000;
  const siblingCurrentTotal = brotherA + brotherB + brotherC;
  const siblingProgress = Math.min(Math.round((siblingCurrentTotal / siblingTotalGoal) * 100), 100);

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">Collaboration</h2>
          <p className="text-sm text-zinc-500 mt-1">Manage shared finances, goals, and expenses with your family and friends.</p>
        </div>
        <Button className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-semibold transition-all active:scale-[0.98]">
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
              You are currently viewing a basic sandbox preview. Upgrade to the **Family Plan** to add up to 6 members, set up joint net worth dashboards, and co-manage loans or travel splits.
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

      {/* Grid Layout of Shared Workspaces (2 per row on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ==========================================
            1. Couple Workspace Card ❤️
            ========================================== */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group flex flex-col justify-between">
          <div>
            {/* Card Header utilities */}
            <div className="flex justify-between items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Heart className="h-5 w-5 fill-red-500/10" />
              </div>
              <div className="flex gap-2.5">
                <button className="text-xs text-zinc-500 font-semibold hover:text-zinc-700 flex items-center gap-1">
                  <UserPlus className="h-3.5 w-3.5" /> Invite
                </button>
                <span className="text-zinc-200">|</span>
                <button className="text-xs text-zinc-500 font-semibold hover:text-zinc-700 flex items-center gap-1">
                  <Settings className="h-3.5 w-3.5" /> Manage
                </button>
                <span className="text-zinc-200">|</span>
                <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                  Details <ChevronRight className="h-3 w-3 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Title & description */}
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900">Couple Workspace</h3>
                <div className="flex -space-x-1.5">
                  <div className="h-5 w-5 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">H</div>
                  <div className="h-5 w-5 rounded-full bg-purple-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">W</div>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">2 Participants</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">Designed for spouses or partners co-managing household investments</p>
            </div>

            {/* Example Goal Box: Home Purchase Goal */}
            <div className="mt-5 rounded-xl border border-zinc-150 bg-zinc-50/50 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-800">Home Purchase Goal</span>
                <span className="text-[10px] font-bold text-zinc-400">Target Date: Dec 2027</span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Current: {formatRupee(coupleCurrentTotal)} / {formatRupee(coupleTotalGoal)}</span>
                  <span className="text-blue-600 font-bold">{coupleProgress}% Progress</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${coupleProgress}%` }} />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">Remaining to fund: {formatRupee(coupleTotalGoal - coupleCurrentTotal)}</p>
              </div>

              {/* Interactive sliders for Spouses' shares */}
              <div className="space-y-3 pt-3 border-t border-zinc-200/50">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-600">
                    <span>Husband Contribution share:</span>
                    <span className="font-bold text-zinc-800">{formatRupee(husbandCont)}</span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="3000000"
                    step="50000"
                    value={husbandCont}
                    onChange={(e) => setHusbandCont(Number(e.target.value))}
                    className="w-full h-1.2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-600">
                    <span>Wife Contribution share:</span>
                    <span className="font-bold text-zinc-800">{formatRupee(wifeCont)}</span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="2000000"
                    step="50000"
                    value={wifeCont}
                    onChange={(e) => setWifeCont(Number(e.target.value))}
                    className="w-full h-1.2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Tip and action */}
          <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-start gap-2 max-w-sm">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-500 leading-normal">
                AI Suggestion: Increasing monthly mutual SIP contributions by 10% reaches your target 3 months early.
              </p>
            </div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0">+ Add Shared Goal</button>
          </div>
        </div>

        {/* ==========================================
            2. Family Workspace Card 👨👩👧👦
            ========================================== */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group flex flex-col justify-between">
          <div>
            {/* Card Header utilities */}
            <div className="flex justify-between items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex gap-2.5">
                <button className="text-xs text-zinc-500 font-semibold hover:text-zinc-700 flex items-center gap-1">
                  <UserPlus className="h-3.5 w-3.5" /> Invite
                </button>
                <span className="text-zinc-200">|</span>
                <button className="text-xs text-zinc-500 font-semibold hover:text-zinc-700 flex items-center gap-1">
                  <Settings className="h-3.5 w-3.5" /> Manage
                </button>
                <span className="text-zinc-200">|</span>
                <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                  Details <ChevronRight className="h-3 w-3 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Title & description */}
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900">Family Workspace</h3>
                <div className="flex -space-x-1.5">
                  <div className="h-5 w-5 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">F</div>
                  <div className="h-5 w-5 rounded-full bg-pink-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">M</div>
                  <div className="h-5 w-5 rounded-full bg-green-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">S</div>
                  <div className="h-5 w-5 rounded-full bg-yellow-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">D</div>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">4 Participants</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">Manage household insurance, medical assets, and budgets together</p>
            </div>

            {/* Shared Family Modules Overview */}
            <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/50">
                <span className="text-[10px] text-zinc-400 font-bold uppercase block">Family Net Worth</span>
                <p className="text-base font-bold text-zinc-800 mt-0.5">{formatRupee(18000000)}</p>
                <span className="text-[9px] text-emerald-600 font-semibold mt-1 inline-block">Includes properties</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/50">
                <span className="text-[10px] text-zinc-400 font-bold uppercase block">Medical Expenses YTD</span>
                <p className="text-base font-bold text-zinc-800 mt-0.5">{formatRupee(45000)}</p>
                <span className="text-[9px] text-zinc-450 font-semibold mt-1 inline-block">Renewals pending</span>
              </div>
            </div>

            {/* Insurance Check table */}
            <div className="mt-4 space-y-2 text-xs">
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Household Protection Status</p>
              
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="text-zinc-600">Parents' Life Coverage:</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="text-zinc-600">Family Health Cover:</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                <span className="text-zinc-600">Property Home Shield:</span>
                <span className="font-bold text-red-500">Expired</span>
              </div>
            </div>
          </div>

          {/* AI Tip and action */}
          <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-start gap-2 max-w-sm">
              <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-500 leading-normal">
                AI Alert: Parents' Health Premium payment of ₹12,000 is due in 12 days. Complete renewal to avoid policy lapses.
              </p>
            </div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0">+ Add Family Asset</button>
          </div>
        </div>

        {/* ==========================================
            3. Sibling Workspace Card 👥
            ========================================== */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group flex flex-col justify-between">
          <div>
            {/* Card Header utilities */}
            <div className="flex justify-between items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <Building className="h-5 w-5" />
              </div>
              <div className="flex gap-2.5">
                <button className="text-xs text-zinc-500 font-semibold hover:text-zinc-700 flex items-center gap-1">
                  <UserPlus className="h-3.5 w-3.5" /> Invite
                </button>
                <span className="text-zinc-200">|</span>
                <button className="text-xs text-zinc-500 font-semibold hover:text-zinc-700 flex items-center gap-1">
                  <Settings className="h-3.5 w-3.5" /> Manage
                </button>
                <span className="text-zinc-200">|</span>
                <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                  Details <ChevronRight className="h-3 w-3 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Title & description */}
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900">Sibling Workspace</h3>
                <div className="flex -space-x-1.5">
                  <div className="h-5 w-5 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">A</div>
                  <div className="h-5 w-5 rounded-full bg-indigo-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">B</div>
                  <div className="h-5 w-5 rounded-full bg-purple-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">C</div>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">3 Participants</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">Joint construction project & inherited asset oversight</p>
            </div>

            {/* House Construction detail box */}
            <div className="mt-5 rounded-xl border border-zinc-150 bg-zinc-50/50 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-800">Project: House Construction</span>
                <span className="text-[10px] font-bold text-zinc-400">Milestone: Foundations complete</span>
              </div>

              {/* Progress metrics */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Spent: {formatRupee(siblingCurrentTotal)} / {formatRupee(siblingTotalGoal)}</span>
                  <span className="text-blue-600 font-bold">{siblingProgress}% Progress</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${siblingProgress}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-zinc-400 mt-1.5 font-bold">
                  <span>Remaining: {formatRupee(siblingTotalGoal - siblingCurrentTotal)}</span>
                  <span>Approved: 14 Expenses</span>
                </div>
              </div>

              {/* Interactive Sibling Sliders */}
              <div className="space-y-3 pt-3 border-t border-zinc-200/50">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-600">
                    <span>Brother A Share:</span>
                    <span className="font-bold text-zinc-800">{formatRupee(brotherA)}</span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="2000000"
                    step="50000"
                    value={brotherA}
                    onChange={(e) => setBrotherA(Number(e.target.value))}
                    className="w-full h-1.2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-600">
                    <span>Brother B Share:</span>
                    <span className="font-bold text-zinc-800">{formatRupee(brotherB)}</span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="2000000"
                    step="50000"
                    value={brotherB}
                    onChange={(e) => setBrotherB(Number(e.target.value))}
                    className="w-full h-1.2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-600">
                    <span>Brother C Share:</span>
                    <span className="font-bold text-zinc-800">{formatRupee(brotherC)}</span>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="1500000"
                    step="50000"
                    value={brotherC}
                    onChange={(e) => setBrotherC(Number(e.target.value))}
                    className="w-full h-1.2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Tip and action */}
          <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-start gap-2 max-w-sm">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-500 leading-normal">
                AI Estimate: Rising concrete raw material indexes may overshoot construction budget by 5.2% in Q3.
              </p>
            </div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0">+ Add Expense</button>
          </div>
        </div>

        {/* ==========================================
            4. Trip Workspace Card ✈️
            ========================================== */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow group flex flex-col justify-between">
          <div>
            {/* Card Header utilities */}
            <div className="flex justify-between items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <Plane className="h-5 w-5" />
              </div>
              <div className="flex gap-2.5">
                <button className="text-xs text-zinc-500 font-semibold hover:text-zinc-700 flex items-center gap-1">
                  <UserPlus className="h-3.5 w-3.5" /> Invite
                </button>
                <span className="text-zinc-200">|</span>
                <button className="text-xs text-zinc-500 font-semibold hover:text-zinc-700 flex items-center gap-1">
                  <Settings className="h-3.5 w-3.5" /> Manage
                </button>
                <span className="text-zinc-200">|</span>
                <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center">
                  Details <ChevronRight className="h-3 w-3 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Title & description */}
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900">Thailand Trip</h3>
                <div className="flex -space-x-1.5">
                  <div className="h-5 w-5 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">A</div>
                  <div className="h-5 w-5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">K</div>
                  <div className="h-5 w-5 rounded-full bg-pink-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">S</div>
                  <div className="h-5 w-5 rounded-full bg-yellow-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">P</div>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">4 Participants</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">Collaborative travel budgeting & split settlements tracker</p>
            </div>

            {/* Trip details overview */}
            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-800 mb-1.5">
                  <span>Savings Target: {formatRupee(200000)}</span>
                  <span>75% Funded</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: "75%" }} />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-semibold">
                  <span>Saved: {formatRupee(150000)}</span>
                  <span>Remaining: {formatRupee(50000)}</span>
                </div>
              </div>

              {/* Individual tracker log */}
              <div className="space-y-2 text-xs pt-3 border-t border-zinc-100">
                <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Contribution Standings</p>
                <div className="flex items-center justify-between bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                  <span className="text-zinc-700">Anandha (Host):</span>
                  <span className="font-bold text-emerald-600">{formatRupee(50000)} (Paid)</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                  <span className="text-zinc-700">Karan:</span>
                  <span className="font-bold text-emerald-600">{formatRupee(50000)} (Paid)</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                  <span className="text-zinc-700">Sarah:</span>
                  <span className="font-bold text-orange-600">{formatRupee(50000)} (Pending)</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Tip and action */}
          <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-start gap-2 max-w-sm">
              <Clock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-500 leading-normal">
                Trip Countdown: <span className="font-bold text-zinc-800">24 Days remaining</span> until departure. AI estimated total flight split: ₹45,000.
              </p>
            </div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0">+ Add Expense</button>
          </div>
        </div>

      </div>
    </div>
  );
}
