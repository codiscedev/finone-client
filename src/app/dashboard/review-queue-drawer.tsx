"use client";

import * as React from "react";
import { X, Check, Edit2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { apiClient } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  transactionDate: string;
  category: { id: string; name: string } | null;
  sourceType: string;
  sourceRef: string;
}

interface ReviewQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onRefresh: () => void;
  onApprove: (tx: any) => void;
}

const inputCls = "w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 text-sm font-medium focus:border-blue-500 focus:bg-white transition-colors";

export default function ReviewQueueDrawer({
  isOpen,
  onClose,
  categories,
  onRefresh,
  onApprove,
}: ReviewQueueDrawerProps) {
  const [loading, setLoading] = React.useState(false);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({
    amount: "",
    merchant: "",
    transactionDate: "",
    categoryId: "",
  });

  const fetchReviewQueue = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/v1/imports/review");
      if (res.data && res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load review queue", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchReviewQueue();
      setEditingId(null);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleAccept = async (id: string) => {
    try {
      const res = await apiClient.post(`/v1/imports/review/${id}/accept`);
      if (res.data && res.data.success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        onApprove(res.data.data);
        onRefresh();
      }
    } catch (e) {
      console.error("Failed to accept transaction", e);
    }
  };

  const startEdit = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm({
      amount: t.amount.toString(),
      merchant: t.merchant,
      transactionDate: t.transactionDate,
      categoryId: t.category?.id || "",
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const payload = {
        amount: parseFloat(editForm.amount),
        merchant: editForm.merchant,
        transactionDate: editForm.transactionDate,
        categoryId: editForm.categoryId || null,
      };
      const res = await apiClient.put(`/v1/imports/review/${id}`, payload);
      if (res.data && res.data.success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        setEditingId(null);
        onApprove(res.data.data);
        onRefresh();
      }
    } catch (e) {
      console.error("Failed to update transaction", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="relative flex flex-col h-screen w-full max-w-[600px] bg-white border-l border-zinc-200 shadow-2xl z-10 transition-transform duration-300 transform translate-x-0 animate-in slide-in-from-right overflow-hidden">
        
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-150/70 bg-zinc-50/50">
          <div>
            <h3 className="text-sm font-black text-zinc-900 leading-none">Import Review Queue</h3>
            <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
              Verify and correct low-confidence transactions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-650 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin bg-zinc-50/50">
          {loading ? (
            <p className="text-xs text-zinc-400 font-semibold text-center py-8">Loading review queue...</p>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Check className="h-10 w-10 text-emerald-500 mb-2" />
              <p className="text-sm font-bold text-zinc-800">Clear Queue!</p>
              <p className="text-xs text-zinc-400 font-semibold mt-1">No transactions require manual review.</p>
            </div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Low Confidence ({t.sourceType})
                    </span>
                    <p className="text-[10px] text-zinc-400 font-medium pt-1">Ref: {t.sourceRef}</p>
                  </div>
                  
                  {editingId !== t.id && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => startEdit(t)}
                        className="h-7 px-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200 flex items-center gap-1 rounded-lg font-bold text-xs"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(t.id)}
                        className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 rounded-lg font-bold text-xs shadow-xs"
                      >
                        <Check className="h-3.5 w-3.5" /> Accept
                      </Button>
                    </div>
                  )}
                </div>

                {editingId === t.id ? (
                  <div className="space-y-3 border-t border-zinc-100 pt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 block">Merchant</label>
                        <input
                          className={inputCls}
                          value={editForm.merchant}
                          onChange={e => setEditForm(p => ({ ...p, merchant: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 block">Amount</label>
                        <input
                          type="number"
                          className={inputCls}
                          value={editForm.amount}
                          onChange={e => setEditForm(p => ({ ...p, amount: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 block">Date</label>
                        <input
                          type="date"
                          className={inputCls}
                          value={editForm.transactionDate}
                          onChange={e => setEditForm(p => ({ ...p, transactionDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 block">Category</label>
                        <Select
                          className="text-xs h-9"
                          value={editForm.categoryId}
                          onChange={e => setEditForm(p => ({ ...p, categoryId: e.target.value }))}
                        >
                          <option value="">Select category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                      <Button
                        size="sm"
                        onClick={() => setEditingId(null)}
                        className="h-8 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200 rounded-lg font-bold text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(t.id)}
                        className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs"
                      >
                        Save & Approve
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 text-xs bg-zinc-50 rounded-lg p-2.5 font-medium border border-zinc-150/70">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 block uppercase">Merchant</span>
                      <span className="text-zinc-900 font-semibold">{t.merchant}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 block uppercase">Amount</span>
                      <span className="text-zinc-900 font-semibold">${t.amount}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 block uppercase">Category</span>
                      <span className="text-zinc-900 font-semibold">{t.category?.name || "Uncategorized"}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
