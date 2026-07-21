"use client";

import * as React from "react";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

interface IncomeAddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (income: {
    source: string;
    amount: number;
    dateOfCredit: string;
    isFixed: boolean;
    fetchType: "Manual" | "Auto";
  }) => void;
}

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-zinc-500 block">{label}{required && " *"}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 text-sm font-medium focus:border-blue-500 focus:bg-white transition-colors";

export default function IncomeAddDrawer({
  isOpen,
  onClose,
  onAdd,
}: IncomeAddDrawerProps) {
  const [form, setForm] = React.useState({
    source: "",
    amount: "",
    dateOfCredit: "",
    isFixed: true,
  });

  // Reset form when drawer opens
  React.useEffect(() => {
    if (isOpen) {
      setForm({
        source: "",
        amount: "",
        dateOfCredit: new Date().toISOString().split("T")[0],
        isFixed: true,
      });
    }
  }, [isOpen]);

  // Escape key handler
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.source.trim() || !form.amount || !form.dateOfCredit) return;

    onAdd({
      source: form.source,
      amount: parseFloat(form.amount),
      dateOfCredit: form.dateOfCredit,
      isFixed: form.isFixed,
      fetchType: "Manual",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer panel */}
      <div className="relative flex flex-col h-screen w-full max-w-[540px] bg-white border-l border-zinc-200 shadow-2xl z-10 transition-transform duration-300 transform translate-x-0 animate-in slide-in-from-right overflow-hidden">
        
        {/* Sticky Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-150/70 bg-zinc-50/50">
          <div>
            <h3 className="text-sm font-black text-zinc-900 leading-none">Add Income</h3>
            <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
              Fill out details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-between scrollbar-thin bg-white">
          
          <div className="space-y-5">
            <FormField label="Income Source" required>
              <input
                className={inputCls}
                required
                value={form.source}
                onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
                placeholder="e.g. Salary, Freelance"
              />
            </FormField>

            <FormField label="Amount (INR)" required>
              <div className="relative">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  className={`${inputCls} pl-7`}
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="e.g. 50000"
                />
                <span className="absolute left-3 top-2 text-xs text-zinc-400">₹</span>
              </div>
            </FormField>

            <FormField label="Date of Credit" required>
              <div className="relative">
                <input
                  type="date"
                  required
                  className={`${inputCls} pl-8`}
                  value={form.dateOfCredit}
                  onChange={(e) => setForm((p) => ({ ...p, dateOfCredit: e.target.value }))}
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </FormField>

            <FormField label="Income Type" required>
              <Select
                className="text-sm"
                value={form.isFixed ? "Fixed" : "One-time"}
                required
                onChange={(e) => setForm((p) => ({ ...p, isFixed: e.target.value === "Fixed" }))}
              >
                <option value="Fixed">Fixed</option>
                <option value="One-time">One-time</option>
              </Select>
            </FormField>
          </div>

          {/* Sticky Actions Footer */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 p-4 -mx-6 -mb-6 flex justify-end gap-3 mt-8 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-655 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98]"
            >
              Save Income Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
