"use client";

import * as React from "react";
import {
  Star,
  Sparkles,
  Send,
  Copy,
  Save,
  Pin,
  FileDown,
  BrainCircuit,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  Percent,
  Coins,
  ChevronRight,
  ShieldAlert,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAssistantViewProps {
  onUpgradeClick?: () => void;
}

export default function AIAssistantView({ onUpgradeClick }: AIAssistantViewProps) {
  // Suggested Prompts list
  const suggestedPrompts = [
    "Analyze my portfolio",
    "Improve my Financial Health Score",
    "Retirement planning",
    "Tax saving suggestions",
    "Explain my spending",
    "Predict my future net worth"
  ];

  // Chat message state
  const [messages, setMessages] = React.useState([
    {
      sender: "bot",
      text: "Hello Anandha. I have compiled your current financial profile (Health Score: 78, Net Worth: ₹1.24 Cr). Ask me anything about budgeting, retirement, tax-saving strategies, or portfolio rebalancing.",
      time: "10:15 AM"
    }
  ]);
  const [inputText, setInputText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<number | null>(null);
  const [pinnedMsgs, setPinnedMsgs] = React.useState<number[]>([]);

  // Simulation prompt responses
  const getSimulatedResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("portfolio") || q.includes("analyze")) {
      return "Your portfolio currently has a 65% large-cap equity allocation. This represents a high concentration risk. I recommend rebalancing 15% of your equity holding into International Funds and Debt ETFs to hedge against local corrections.";
    }
    if (q.includes("health") || q.includes("score")) {
      return "Your Financial Health Score is 78/100 (Grade B). To cross into Grade A (80+), consider: 1) Increasing your emergency fund coverage from 2.5 months to 6 months (+8 pts), and 2) capping your entertainment/dining out variance below 80% (+5 pts).";
    }
    if (q.includes("retire") || q.includes("retirement")) {
      return "To retire at age 60 with a corpus of ₹2.5 Crore (adjusted for 6% inflation), you need a monthly SIP of ₹12,500. Currently, your retirement SIP stands at ₹1,500. Incrementing this by ₹5,000 monthly will accelerate your goal timeline by 3 years.";
    }
    if (q.includes("tax") || q.includes("regime")) {
      return "Based on your income of ₹24 Lakhs and deductions, the New Tax Regime is projected to save you ₹64,200 compared to the Old Tax Regime. I recommend opting for the New Regime during your tax declaration.";
    }
    if (q.includes("net worth") || q.includes("predict")) {
      return "At your current monthly savings rate of ₹25,000 and 8% returns, your net worth is projected to compound from ₹1.24 Cr to ₹2.18 Cr in 10 years. Boosting the yield rate to 12% via equity index funds yields ₹2.65 Cr.";
    }
    return "That's a great question about managing your capital. I suggest looking at your Net Worth trend projection inside the Wealth card simulator to visualize long-term compounding effects.";
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    
    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = {
        sender: "bot",
        text: getSimulatedResponse(text),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 850);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handlePin = (idx: number) => {
    if (pinnedMsgs.includes(idx)) {
      setPinnedMsgs(pinnedMsgs.filter((id) => id !== idx));
    } else {
      setPinnedMsgs([...pinnedMsgs, idx]);
    }
  };

  const handleExport = () => {
    alert("Exporting chat transcript as PDF document... Download started.");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950">AI Assistant</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 text-[10px] font-bold">
            <Star className="h-3 w-3 fill-indigo-600 text-indigo-600" />
            Premium
          </span>
        </div>
        <p className="text-sm text-zinc-500 mt-1">Reasoning-based wealth strategy planner and context-trained personal chatbot.</p>
      </div>

      {/* Pro Upgrade Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20">
            <Sparkles className="h-5 w-5 text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Unlock Advanced AI Wealth Mentor</h4>
            <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed max-w-2xl">
              You are currently viewing a basic sandbox preview. Upgrade to **Pro** to unlock deep reasoning-based capital rebalancing, automated tax-saving audits, and unlimited chat questions.
            </p>
          </div>
        </div>
        <button
          onClick={onUpgradeClick}
          className="h-9 px-4 shrink-0 rounded-xl bg-white text-blue-600 hover:bg-zinc-50 text-xs font-bold transition-all shadow-sm cursor-pointer outline-none"
        >
          Upgrade to Pro
        </button>
      </div>

      {/* Split Dashboard: 1. Mentor, 2. Chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ==========================================
            1. AI Financial Mentor ⭐ (7 Columns)
            ========================================== */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">AI Financial Mentor</h3>
              <p className="text-xs text-zinc-500">Autonomous strategic rebalancing and concentration checks</p>
            </div>
          </div>

          {/* Quick Metrics Summaries */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Health Score</span>
              <span className="text-sm font-extrabold text-zinc-800 block mt-1">78 / 100</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Net Worth</span>
              <span className="text-sm font-extrabold text-zinc-800 block mt-1">₹1.24 Crore</span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Risk Rating</span>
              <span className="text-sm font-extrabold text-zinc-800 block mt-1">Moderate</span>
            </div>
          </div>

          {/* Strategies */}
          <div className="space-y-4 text-xs">
            {/* Asset Allocation Rebalancing */}
            <div className="space-y-1.5 p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
              <h4 className="font-bold text-zinc-950 flex items-center justify-between">
                <span>Investment Strategy</span>
                <span className="text-[10px] text-zinc-400 font-semibold">Active Profile</span>
              </h4>
              <p className="text-zinc-600 mt-1 leading-relaxed text-[11px]">
                Your equity exposure is 65%, concentrated heavily in large-cap Indian indices. Rebalance 15% to gold or debt funds to safeguard portfolio values.
              </p>
              <div className="flex gap-2 pt-2">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[9px]">Equity: 65%</span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[9px]">Debt: 20%</span>
                <span className="px-2 py-0.5 rounded bg-yellow-50 text-yellow-700 font-bold text-[9px]">Gold: 10%</span>
              </div>
            </div>

            {/* Wealth Growth & NPS suggestion */}
            <div className="space-y-1.5 p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
              <h4 className="font-bold text-zinc-950">Wealth Growth & Taxes</h4>
              <p className="text-zinc-600 mt-1 leading-relaxed text-[11px]">
                Contributing an extra ₹50,000 under Section 80CCD(1B) to NPS saves ₹15,600 in tax. Set up automatic monthly SIP allocations.
              </p>
            </div>

            {/* Retirement Readiness calculator metrics */}
            <div className="space-y-1.5 p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
              <h4 className="font-bold text-zinc-950">Retirement Forecasting</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <span className="text-zinc-400 block text-[10px] font-bold">Target Corpus:</span>
                  <span className="font-bold text-zinc-800">₹2.5 Crore</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] font-bold">Years Remaining:</span>
                  <span className="font-bold text-zinc-800">30 Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights feed */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">AI Insights Feed</h4>
            
            <div className="flex items-start justify-between p-3 border border-zinc-150 rounded-xl text-xs bg-white">
              <div>
                <p className="font-bold text-zinc-900">Emergency Buffer Adequacy</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Your safety buffer covers 2.5 months expenses. Build 6 months capacity.</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">High Priority</span>
              </div>
            </div>

            <div className="flex items-start justify-between p-3 border border-zinc-150 rounded-xl text-xs bg-white">
              <div>
                <p className="font-bold text-zinc-900">Tax Saving Optimization</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Automated checks indicate underutilization of Section 80D limits.</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[9px] font-bold text-zinc-500 bg-zinc-50 px-1.5 py-0.5 rounded">Med Priority</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            2. AI Financial Chatbot 💬 (5 Columns)
            ========================================== */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col h-[600px] overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-zinc-150 bg-zinc-50/50 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="text-xs font-bold text-zinc-900 leading-none">FinOne Advisor</h3>
                <span className="text-[9px] text-zinc-400 font-semibold block mt-0.5">Reasoning Engine Online</span>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="text-zinc-400 hover:text-zinc-600 outline-none p-1.5 rounded-lg hover:bg-zinc-100"
              title="Export Conversation"
            >
              <FileDown className="h-4 w-4" />
            </button>
          </div>

          {/* Chat message logs */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} space-y-1`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-zinc-100 text-zinc-950 rounded-bl-none border border-zinc-150/70"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                
                <div className="flex items-center gap-2 text-[9px] text-zinc-400 px-1 font-semibold">
                  <span>{msg.time}</span>
                  {msg.sender === "bot" && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(msg.text, idx)}
                        className="hover:text-zinc-600 text-zinc-400"
                      >
                        {copiedId === idx ? "Copied!" : "Copy"}
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handlePin(idx)}
                        className={`hover:text-zinc-600 ${pinnedMsgs.includes(idx) ? "text-indigo-600" : "text-zinc-400"}`}
                      >
                        {pinnedMsgs.includes(idx) ? "Pinned" : "Pin"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-150/70 rounded-2xl px-4 py-3 max-w-[80%] text-zinc-500 rounded-bl-none">
                <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce" />
                <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Quick suggestions chips */}
          <div className="p-3 border-t border-zinc-150 bg-zinc-50/30 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[10px] font-bold text-zinc-500 bg-white border border-zinc-200 rounded-full px-3 py-1 hover:border-indigo-600 hover:text-indigo-600 transition-all select-none outline-none"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-3 bg-white border-t border-zinc-150 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask about goals, tax, budgeting..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1 h-9 rounded-xl border border-zinc-200 px-3 bg-zinc-50/50 text-xs outline-none focus:border-indigo-500 focus:bg-white"
            />
            <button
              onClick={() => handleSend()}
              className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shadow-sm outline-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
