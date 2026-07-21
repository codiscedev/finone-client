"use client";

import * as React from "react";
import { X, Calendar, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreditCardAddDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: {
    cardName: string;
    lastFour: string;
    creditLimit: number;
    outstanding: number;
    minDue: number;
    dueDate: number;
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

export default function CreditCardAddDrawer({
  isOpen,
  onClose,
  onAdd,
}: CreditCardAddDrawerProps) {
  const [form, setForm] = React.useState({
    cardName: "",
    lastFour: "",
    creditLimit: "",
    dueDate: "",
  });

  // Reset form when drawer opens
  React.useEffect(() => {
    if (isOpen) {
      setForm({
        cardName: "",
        lastFour: "",
        creditLimit: "",
        dueDate: "",
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
    if (!form.cardName.trim() || !form.lastFour || !form.creditLimit || !form.dueDate) return;

    onAdd({
      cardName: form.cardName,
      lastFour: form.lastFour,
      creditLimit: parseFloat(form.creditLimit),
      outstanding: 0,
      minDue: 0,
      dueDate: parseInt(form.dueDate, 10),
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
            <h3 className="text-sm font-black text-zinc-900 leading-none">Add Credit Card</h3>
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
            <FormField label="Card Name" required>
              <input
                className={inputCls}
                required
                value={form.cardName}
                onChange={(e) => setForm((p) => ({ ...p, cardName: e.target.value }))}
                placeholder="e.g. HDFC Regalia, Amex Gold"
              />
            </FormField>

            <FormField label="Last 4 Digits" required>
              <input
                className={inputCls}
                required
                maxLength={4}
                value={form.lastFour}
                onChange={(e) =>
                  setForm((p) => ({ ...p, lastFour: e.target.value.replace(/\D/g, "") }))
                }
                placeholder="e.g. 4829"
              />
            </FormField>

            <FormField label="Credit Limit (INR)" required>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  required
                  className={`${inputCls} pl-7`}
                  value={form.creditLimit}
                  onChange={(e) => setForm((p) => ({ ...p, creditLimit: e.target.value }))}
                  placeholder="e.g. 300000"
                />
                <span className="absolute left-3 top-2 text-xs text-zinc-400">₹</span>
              </div>
            </FormField>

            <FormField label="Due Day of Month" required>
              <input
                type="number"
                min="1"
                max="31"
                required
                className={inputCls}
                value={form.dueDate}
                onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                placeholder="e.g. 20"
              />
            </FormField>

            {/* Security notice badge */}
            <div className="rounded-xl border border-zinc-150 bg-zinc-50/50 p-4 flex gap-3 mt-6">
              <Lock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-800">Secure Storage Verified</p>
                <p className="text-[10px] text-zinc-450 leading-relaxed">
                  Your credit card details are encrypted and stored locally in your browser workspace. They are never transmitted or shared without your direct actions.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Actions Footer */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-150 p-4 -mx-6 -mb-6 flex justify-end gap-3 mt-8 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-650 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 font-bold shadow-sm transition-all active:scale-[0.98]"
            >
              Save Card Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
