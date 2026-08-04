"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Trash2, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api";

interface Alert {
  id: string;
  alertType: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  explanation: string;
  detectedAt: string;
  isRead: boolean;
}

export default function AnomalyAlertBell() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await apiClient.get("/v1/ai/anomalies");
      if (res.data?.success && res.data?.data) {
        setAlerts(res.data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch anomaly alerts:", err);
    }
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const markRead = async (id: string) => {
    try {
      await apiClient.patch(`/v1/ai/anomalies/${id}/read`);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
      );
    } catch (err) {
      console.error("Failed to mark alert as read:", err);
    }
  };

  const dismiss = async (id: string) => {
    try {
      await apiClient.patch(`/v1/ai/anomalies/${id}/dismiss`);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to dismiss alert:", err);
    }
  };

  const severityColor = (s: string) =>
    ({
      HIGH: "bg-red-500 text-white",
      MEDIUM: "bg-amber-500 text-white",
      LOW: "bg-blue-500 text-white",
    }[s] ?? "bg-zinc-500 text-white");

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors focus:outline-none"
        aria-label="Anomaly Alerts"
        id="anomaly-alert-bell"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-4 w-4 text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 rounded-2xl bg-white border border-zinc-200 shadow-2xl z-50 overflow-hidden text-xs">
          <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="font-bold text-zinc-900 text-sm">Spending Alerts</h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-semibold">
              {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-zinc-400">
                ✅ No anomalies detected. Your spending looks normal!
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => markRead(alert.id)}
                  className={`p-4 transition-colors cursor-pointer ${
                    alert.isRead ? "bg-white" : "bg-indigo-50/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${severityColor(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismiss(alert.id);
                      }}
                      className="text-zinc-400 hover:text-zinc-600 p-1 rounded hover:bg-zinc-100"
                      title="Dismiss alert"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-zinc-700 text-xs leading-relaxed font-medium">
                    {alert.explanation}
                  </p>
                  <span className="text-[10px] text-zinc-400 block mt-2">
                    {new Date(alert.detectedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
