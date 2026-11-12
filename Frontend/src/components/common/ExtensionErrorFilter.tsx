"use client";

import { useEffect } from "react";

/**
 * ExtensionErrorFilter
 * Tự động phát hiện và ngăn chặn các lỗi / timeout phát sinh từ các Tiện ích mở rộng (Chrome Extensions)
 * của trình duyệt (như CRX Emulator, Adblocker, Web3 Wallet...) gây bật popup đỏ Next.js Unhandled Runtime Error.
 */
export default function ExtensionErrorFilter() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isExtensionError = (err: any): boolean => {
      if (!err) return false;
      const msg = String(err.message || err.reason?.message || err || "");
      const stack = String(err.stack || err.reason?.stack || "");
      const filename = String(err.filename || "");

      return (
        filename.includes("chrome-extension://") ||
        stack.includes("chrome-extension://") ||
        msg.includes("chrome: call method") ||
        msg.includes('Window message "chrome: call method" timed out') ||
        msg.includes("ResizeObserver loop completed with undelivered notifications") ||
        msg.includes("ResizeObserver loop limit exceeded")
      );
    };

    const handleError = (event: ErrorEvent) => {
      if (isExtensionError(event.error) || isExtensionError(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (isExtensionError(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    // Sử dụng capture: true để chặn ngay từ đầu chu kỳ sự kiện
    window.addEventListener("error", handleError, true);
    window.addEventListener("unhandledrejection", handleRejection, true);

    return () => {
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("unhandledrejection", handleRejection, true);
    };
  }, []);

  return null;
}
