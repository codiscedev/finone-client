"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Bot, User as UserIcon, RefreshCw, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
}

export default function FinanceChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content:
        "Hi! I'm **FinBot** 👋 Your personal finance assistant.\n\nYou can ask me things like:\n- *How much did I spend on food this month?*\n- *Am I on track for my savings goal?*\n- *What's my total debt?*\n- *How can I save more tax this year?*",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [reindexing, setReindexing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = text.trim();
    if (!textToSend) setInput("");

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMsg },
    ]);
    setLoading(true);

    try {
      const res = await apiClient.post("/v1/ai/chat/message", {
        message: userMsg,
        sessionId,
      });

      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        if (data.sessionId) setSessionId(data.sessionId);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "_bot",
            role: "model",
            content: data.reply || data.answer || "No response received.",
          },
        ]);
      } else {
        throw new Error("Chat call failed");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_err",
          role: "model",
          content: "Sorry, I couldn't process that right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReindex = async () => {
    setReindexing(true);
    try {
      await apiClient.post("/v1/ai/chat/reindex");
    } catch (err) {
      console.error("Reindex error:", err);
    } finally {
      setReindexing(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  const suggestedQueries = [
    "How much did I spend this month?",
    "Am I on track for my goals?",
    "What are my biggest expenses?",
    "How can I reduce my debt faster?",
  ];

  return (
    <div className="flex flex-col h-[600px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              FinBot
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                RAG Online
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              AI Finance Assistant • Powered by Gemini & Vector Embeddings
            </p>
          </div>
        </div>

        <button
          onClick={handleReindex}
          disabled={reindexing}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
          title="Refresh RAG financial index"
        >
          <RefreshCw className={`h-4 w-4 ${reindexing ? "animate-spin text-indigo-400" : ""}`} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-purple-900/60 text-purple-300 border border-purple-500/30"
              }`}
            >
              {msg.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-slate-200 leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                  : "bg-slate-900 border border-slate-800 rounded-tl-none"
              }`}
              dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
            />
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-900/60 text-purple-300 border border-purple-500/30">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips */}
      {messages.length <= 2 && (
        <div className="p-3 border-t border-slate-800 bg-slate-900/50 flex gap-2 overflow-x-auto whitespace-nowrap text-[11px] shrink-0">
          {suggestedQueries.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="px-3 py-1 rounded-full border border-slate-700 bg-slate-800/80 text-slate-300 hover:border-indigo-500 hover:text-white transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 shrink-0">
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask anything about your finances..."
          className="flex-1 h-10 rounded-xl bg-slate-950 border border-slate-800 px-4 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:bg-slate-900 transition-colors"
        />
        <button
          id="chat-send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
