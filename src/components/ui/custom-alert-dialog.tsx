"use client";

import React, { createContext, useContext, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trash2, AlertCircle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "success" | "warning" | "delete";

interface AlertOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface CustomAlertContextType {
  showAlert: (type: AlertType, options: AlertOptions) => void;
  showSuccess: (title: string, description: string, onConfirm?: () => void) => void;
  showWarning: (title: string, description: string, onConfirm?: () => void, onCancel?: () => void) => void;
  showDelete: (title: string, description: string, onConfirm?: () => void, onCancel?: () => void) => void;
  closeAlert: () => void;
}

const CustomAlertContext = createContext<CustomAlertContextType | undefined>(undefined);

export function CustomAlertProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<AlertType>("success");
  const [options, setOptions] = useState<AlertOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showAlert = (type: AlertType, options: AlertOptions) => {
    setType(type);
    setOptions(options);
    setIsOpen(true);
    setIsLoading(false);
  };

  const showSuccess = (title: string, description: string, onConfirm?: () => void) => {
    showAlert("success", { title, description, onConfirm });
  };

  const showWarning = (title: string, description: string, onConfirm?: () => void, onCancel?: () => void) => {
    showAlert("warning", { title, description, onConfirm, onCancel });
  };

  const showDelete = (title: string, description: string, onConfirm?: () => void, onCancel?: () => void) => {
    showAlert("delete", { title, description, onConfirm, onCancel });
  };

  const closeAlert = () => {
    setIsOpen(false);
    if (options?.onCancel) {
      options.onCancel();
    }
  };

  const handleConfirm = async () => {
    if (options?.onConfirm) {
      try {
        setIsLoading(true);
        await options.onConfirm();
      } catch (err) {
        console.error("Error in alert confirmation:", err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsOpen(false);
  };

  return (
    <CustomAlertContext.Provider value={{ showAlert, showSuccess, showWarning, showDelete, closeAlert }}>
      {children}
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeAlert(); }}>
        <DialogContent className="max-w-[360px] p-6 rounded-2xl gap-0 bg-white border-0 shadow-xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-200" showCloseButton={false}>
          {/* Close button for Delete and Warning dialogs */}
          {type !== "success" && (
            <button
              onClick={closeAlert}
              className="absolute top-4 right-4 flex items-center justify-center w-5 h-5 rounded-full bg-[#7E8B9B] hover:bg-[#6C7989] text-white transition-colors"
            >
              <X className="h-3 w-3 stroke-[3]" />
            </button>
          )}

          <div className="flex flex-col items-center text-center w-full mt-2">
            {/* Icon */}
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-4",
              type === "success" && "bg-[#EAF8F2] text-[#4CB98E]",
              type === "warning" && "bg-[#FFF6ED] text-[#E6993F]",
              type === "delete" && "bg-[#FFF0F0] text-[#D34E59]"
            )}>
              {type === "success" && <Check className="h-6 w-6 stroke-[3]" />}
              {type === "warning" && <AlertCircle className="h-6 w-6 stroke-[2.5]" />}
              {type === "delete" && <Trash2 className="h-5 w-5 stroke-[2.5]" />}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-zinc-800 mb-1">
              {options?.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-zinc-500 mb-6 max-w-[240px] leading-relaxed">
              {options?.description}
            </p>

            {/* Actions */}
            <div className="w-full flex gap-3">
              {type !== "success" ? (
                <>
                  <button
                    onClick={closeAlert}
                    className="flex-1 py-2 rounded-xl bg-[#F5F6F8] hover:bg-[#ECEEF1] text-[#2D3748] font-bold text-xs transition-colors border border-transparent"
                  >
                    {options?.cancelText || "Cancel"}
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-white font-bold text-xs transition-colors shadow-sm",
                      type === "delete"
                        ? "bg-[#D34E59] hover:bg-[#C2414B] active:bg-[#B1353E]"
                        : "bg-[#E6993F] hover:bg-[#D5882E] active:bg-[#C37820]"
                    )}
                  >
                    {isLoading ? "Loading..." : (options?.confirmText || "Confirm")}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="w-full py-2.5 rounded-xl bg-[#4CB98E] hover:bg-[#3FA67D] active:bg-[#35906B] text-white font-bold text-xs transition-colors shadow-sm"
                >
                  {options?.confirmText || "Confirm"}
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CustomAlertContext.Provider>
  );
}

export function useCustomAlert() {
  const context = useContext(CustomAlertContext);
  if (!context) {
    throw new Error("useCustomAlert must be used within a CustomAlertProvider");
  }
  return context;
}
