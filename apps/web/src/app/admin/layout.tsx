"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Trạng thái người dùng và phân quyền RBAC
  const [currentUser, setCurrentUser] = useState<{
    fullName: string;
    email: string;
    role: string;
  } | null>(null);

  const [authStatus, setAuthStatus] = useState<
    "checking" | "authorized" | "forbidden" | "unauthenticated"
  >("checking");

  // Kiểm tra quyền hạn RBAC khi load trang
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");

    if (!stored || !token) {
      setAuthStatus("unauthenticated");
      return;
    }

    try {
      const userObj = JSON.parse(stored);
      setCurrentUser(userObj);

      if (userObj.role !== "admin") {
        setAuthStatus("forbidden");
        return;
      }

      setAuthStatus("authorized");
    } catch {
      setAuthStatus("unauthenticated");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    router.push("/dang-nhap");
  };

  // MÀN HÌNH CHẶN TRUY CẬP (403 FORBIDDEN DÀNH CHO USER THƯỜNG)
  if (authStatus === "forbidden") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-3xl p-8 shadow-2xl space-y-5 text-white">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">403 - Quyền Truy Cập Bị Từ Chối</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tài khoản <strong>{currentUser?.email}</strong> thuộc quyền hạn Khách Hàng (Customer).
            Bạn không có đặc quyền truy cập Trung Tâm Điều Phối TechCore Enterprise.
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-2xl transition"
            >
              Quay lại Trang Chủ Cửa Hàng
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-2xl transition"
            >
              Đăng nhập tài khoản Quản trị viên (Admin)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MÀN HÌNH CHƯA ĐĂNG NHẬP
  if (authStatus === "unauthenticated") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5 text-white">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Yêu Cầu Xác Thực Quản Trị</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Vui lòng đăng nhập với tư cách Quản trị viên TechCore để truy cập hệ thống này.
          </p>
          <Link
            href="/dang-nhap"
            className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-2xl transition"
          >
            Đến Trang Đăng Nhập
          </Link>
        </div>
      </div>
    );
  }

  // MÀN HÌNH ĐANG KIỂM TRA QUYỀN
  if (authStatus === "checking") {
    return (
      <div className="min-h-screen bg-[#091124] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400 tracking-wider">
            VERIFYING RBAC CREDENTIALS...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white">
      <div className="flex flex-1 min-h-screen">
        {/* THANH ĐIỀU HƯỚNG BÊN TRÁI (AdminSidebar) */}
        <AdminSidebar
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* KHU VỰC NỘI DUNG CHÍNH (Content Area) */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* THANH CÔNG CỤ TRÊN CÙNG (AdminNavbar) */}
          <AdminNavbar
            currentUser={currentUser}
          />

          {/* NỘI DUNG TỪNG TRANG CON (Children routes) */}
          <main className="p-6 space-y-6 flex-1 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

