"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, X, ArrowRight, UserPlus } from "lucide-react";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
  title?: string;
  message?: string;
}

export default function LoginPromptModal({
  isOpen,
  onClose,
  redirectUrl = "/thanh-toan",
  title = "Yêu Cầu Đăng Nhập Để Thanh Toán",
  message = "Bạn cần đăng nhập tài khoản TechCore để tiếp tục thanh toán đơn hàng. Thông tin đơn hàng và bảo hành điện tử chính hãng sẽ được liên kết trực tiếp với tài khoản của bạn.",
}: LoginPromptModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoLogin = () => {
    onClose();
    router.push(`/dang-nhap?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  const handleGoRegister = () => {
    onClose();
    router.push(`/dang-ky?redirect=${encodeURIComponent(redirectUrl)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Nút X đóng góc trên */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer z-10"
          title="Đóng hộp thoại"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-2 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7 text-blue-600" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              XÁC THỰC TÀI KHOẢN
            </span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
          </div>
        </div>

        {/* Highlight Note */}
        <div className="px-6 py-2">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Nếu chưa muốn thanh toán bây giờ, bạn có thể bấm <strong>"Để sau"</strong> để ở lại trang hiện tại.
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 pt-4 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Nút 1: Hủy / Để sau (Người dùng không thanh toán nữa thì ở lại bình thường) */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer text-center"
            >
              Để sau / Ở lại
            </button>

            {/* Nút 2: Đồng ý đăng nhập để thanh toán */}
            <button
              type="button"
              onClick={handleGoLogin}
              className="w-full py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 cursor-pointer text-center active:scale-95"
            >
              <span>Đăng nhập ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Đăng ký tài khoản nếu chưa có */}
          <button
            type="button"
            onClick={handleGoRegister}
            className="w-full py-2.5 rounded-xl text-center text-xs text-blue-600 hover:text-blue-700 font-bold hover:bg-blue-50 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Chưa có tài khoản? Đăng ký ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
