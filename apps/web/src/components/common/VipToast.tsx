"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "invoice";

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type?: ToastType;
  tag?: string;
  code?: string;
  duration?: number;
  timestamp?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  success: (message: string, title?: string, code?: string) => string;
  error: (message: string, title?: string, code?: string) => string;
  warning: (message: string, title?: string, code?: string) => string;
  info: (message: string, title?: string, code?: string) => string;
  invoice: (message: string, title?: string, code?: string) => string;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Cấu hình giao diện Toast Sang Trọng, High-Tech, Hiện Đại (Linear & Sonner inspired)
const TOAST_STYLES: Record<
  ToastType,
  {
    glow: string;
    border: string;
    iconBg: string;
    iconColor: string;
    tagBg: string;
    tagText: string;
    indicatorDot: string;
    progressBar: string;
  }
> = {
  success: {
    glow: "shadow-[0_16px_40px_-12px_rgba(16,185,129,0.25)]",
    border: "border-emerald-500/25 dark:border-emerald-500/30",
    iconBg: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    iconColor: "text-emerald-500",
    tagBg: "bg-emerald-500/10",
    tagText: "text-emerald-400",
    indicatorDot: "bg-emerald-400",
    progressBar: "from-emerald-500 to-teal-400",
  },
  info: {
    glow: "shadow-[0_16px_40px_-12px_rgba(45,153,174,0.35)]",
    border: "border-[#2D99AE]/35",
    iconBg: "bg-[#2D99AE]/15 text-[#BCFEFE] border border-[#2D99AE]/30",
    iconColor: "text-[#BCFEFE]",
    tagBg: "bg-[#2D99AE]/15",
    tagText: "text-[#BCFEFE]",
    indicatorDot: "bg-[#BCFEFE]",
    progressBar: "from-[#0C5776] via-[#2D99AE] to-[#BCFEFE]",
  },
  warning: {
    glow: "shadow-[0_16px_40px_-12px_rgba(245,158,11,0.25)]",
    border: "border-amber-500/25 dark:border-amber-500/30",
    iconBg: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    iconColor: "text-amber-500",
    tagBg: "bg-amber-500/10",
    tagText: "text-amber-400",
    indicatorDot: "bg-amber-400",
    progressBar: "from-amber-500 to-orange-400",
  },
  error: {
    glow: "shadow-[0_16px_40px_-12px_rgba(244,63,94,0.25)]",
    border: "border-rose-500/25 dark:border-rose-500/30",
    iconBg: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    iconColor: "text-rose-500",
    tagBg: "bg-rose-500/10",
    tagText: "text-rose-400",
    indicatorDot: "bg-rose-400",
    progressBar: "from-rose-500 to-pink-500",
  },
  invoice: {
    glow: "shadow-[0_16px_40px_-12px_rgba(248,218,208,0.3)]",
    border: "border-[#F8DAD0]/35",
    iconBg: "bg-[#F8DAD0]/15 text-[#F8DAD0] border border-[#F8DAD0]/30",
    iconColor: "text-[#F8DAD0]",
    tagBg: "bg-[#F8DAD0]/15",
    tagText: "text-[#F8DAD0]",
    indicatorDot: "bg-[#F8DAD0]",
    progressBar: "from-[#2D99AE] to-[#F8DAD0]",
  },
};

export function VipToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = "toast-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
      const newToast: ToastItem = {
        ...toast,
        id,
        type: toast.type || "info",
        duration: toast.duration ?? 3800,
        timestamp: Date.now(),
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 4));

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title = "Thành công!", code?: string) =>
      showToast({ type: "success", title, message, code }),
    [showToast]
  );

  const error = useCallback(
    (message: string, title = "Có lỗi xảy ra", code?: string) =>
      showToast({ type: "error", title, message, code }),
    [showToast]
  );

  const warning = useCallback(
    (message: string, title = "Lưu ý", code?: string) =>
      showToast({ type: "warning", title, message, code }),
    [showToast]
  );

  const info = useCallback(
    (message: string, title = "Thông báo", code?: string) =>
      showToast({ type: "info", title, message, code }),
    [showToast]
  );

  const invoice = useCallback(
    (message: string, title = "Hóa đơn điện tử", code?: string) =>
      showToast({ type: "invoice", title, message, code }),
    [showToast]
  );

  // Lắng nghe sự kiện toàn cục và chuyển hướng alert mặc định
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVipToastEvent = (e: CustomEvent<Omit<ToastItem, "id">>) => {
      if (e.detail) {
        showToast(e.detail);
      }
    };

    window.addEventListener("techcore:vip-toast" as any, handleVipToastEvent as any);

    // Ghi đè alert của browser
    const nativeAlert = window.alert;
    window.alert = (msg?: any) => {
      if (msg === undefined || msg === null) return;
      const text = String(msg);
      const lower = text.toLowerCase();

      if (
        lower.includes("thành công") ||
        lower.includes("đã thêm") ||
        lower.includes("đã hủy") ||
        lower.includes("đã xóa") ||
        lower.includes("hoàn tất")
      ) {
        showToast({
          title: "Thao tác thành công",
          message: text,
          type: "success",
        });
      } else if (
        lower.includes("lỗi") ||
        lower.includes("thất bại") ||
        lower.includes("từ chối") ||
        lower.includes("sai") ||
        lower.includes("không hợp lệ")
      ) {
        showToast({
          title: "Thông báo lỗi",
          message: text,
          type: "error",
        });
      } else if (
        lower.includes("cảnh báo") ||
        lower.includes("chú ý") ||
        lower.includes("vui lòng") ||
        lower.includes("chưa") ||
        lower.includes("không tìm thấy")
      ) {
        showToast({
          title: "Lưu ý",
          message: text,
          type: "warning",
        });
      } else {
        showToast({
          title: "Thông báo",
          message: text,
          type: "info",
        });
      }
    };

    return () => {
      window.removeEventListener("techcore:vip-toast" as any, handleVipToastEvent as any);
      window.alert = nativeAlert;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
        invoice,
      }}
    >
      {children}

      {/* KHU VỰC HIỂN THỊ TOAST SIÊU CAO CẤP & CÔNG NGHỆ (TOP-RIGHT) */}
      <aside
        aria-live="polite"
        className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type || "info"];
          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto w-full bg-[#001C44]/95 backdrop-blur-xl border ${style.border} ${style.glow} rounded-2xl p-3.5 shadow-2xl relative overflow-hidden transition-all duration-300 animate-in slide-in-from-top-3 fade-in`}
            >
              <div className="flex items-start gap-3 relative z-10">
                {/* Icon Squircle công nghệ cao với live pulse dot */}
                <div
                  className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0 relative mt-0.5`}
                >
                  {toast.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : toast.type === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : toast.type === "error" ? (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  ) : toast.type === "invoice" ? (
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <Package className="w-5 h-5 text-blue-400" />
                  )}
                  {/* Micro Pulse Indicator */}
                  <span
                    className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${style.indicatorDot} ring-2 ring-slate-900 animate-pulse`}
                  />
                </div>

                {/* Nội dung thông báo */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h4 className="text-xs font-bold text-white tracking-tight truncate">
                        {toast.title}
                      </h4>
                      {toast.code && (
                        <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-1.5 py-0.5 rounded-md font-semibold">
                          {toast.code}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 shrink-0">
                      Realtime
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words font-medium">
                    {toast.message}
                  </p>
                </div>

                {/* Nút đóng tối giản sang trọng */}
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Đóng thông báo"
                  className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Đường viền micro gradient đáy tinh tế (1.5px) */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${style.progressBar} animate-[shrink_4s_linear_forwards]`}
                  style={{
                    animationDuration: `${toast.duration || 3800}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
}

// Hook để các component gọi nhanh
export function useVipToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useVipToast must be used within a VipToastProvider");
  }
  return context;
}

// Helper hàm gọi nhanh toàn cục
export const vipToast = {
  show: (toast: Omit<ToastItem, "id">) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("techcore:vip-toast", { detail: toast })
      );
    }
  },
  success: (message: string, title = "Thành công!", code?: string) => {
    vipToast.show({ type: "success", title, message, code });
  },
  error: (message: string, title = "Có lỗi xảy ra", code?: string) => {
    vipToast.show({ type: "error", title, message, code });
  },
  warning: (message: string, title = "Lưu ý", code?: string) => {
    vipToast.show({ type: "warning", title, message, code });
  },
  info: (message: string, title = "Thông báo", code?: string) => {
    vipToast.show({ type: "info", title, message, code });
  },
  invoice: (message: string, title = "Hóa đơn điện tử", code?: string) => {
    vipToast.show({ type: "invoice", title, message, code });
  },
};
