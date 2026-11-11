"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cpu,
  ShoppingBag,
  Users,
  TrendingUp,
  Database,
  ShieldCheck,
  Tag,
  Lock,
  Settings,
  ExternalLink,
  LogOut,
  LayoutDashboard,
  Layers,
  ChevronRight,
  Boxes,
} from "lucide-react";

interface AdminSidebarProps {
  activeSidebarItem?: string;
  setActiveSidebarItem?: (item: any) => void;
  currentUser?: {
    fullName?: string;
    email?: string;
    role?: string;
  } | null;
  onLogout?: () => void;
}

export function AdminSidebar({
  activeSidebarItem: propActiveItem,
  currentUser,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Tự động xác định tab active chuẩn xác theo URL
  const getActiveTab = () => {
    if (propActiveItem) return propActiveItem;
    if (pathname === "/admin/dashboard") return "dashboard";
    if (pathname.includes("/admin/san-pham")) return "products";
    if (pathname.includes("/admin/khach-hang")) return "customers";
    if (pathname.includes("/admin/doanh-thu")) return "revenue";
    if (pathname.includes("/admin/kho")) return "inventory";
    if (pathname.includes("/admin/bao-hanh")) return "warranty";
    if (pathname.includes("/admin/voucher")) return "vouchers";
    if (pathname.includes("/admin/phan-quyen")) return "rbac";
    if (pathname.includes("/admin/cai-dat")) return "settings";
    if (pathname.includes("/admin/don-hang") || pathname.includes("/admin/quanlidonhang")) return "orders";
    if (pathname === "/admin") return "orders";
    return "orders";
  };

  const activeSidebarItem = getActiveTab();
  const [orderCount, setOrderCount] = useState<number>(4);

  useEffect(() => {
    const updateCount = () => {
      try {
        const raw = localStorage.getItem("tech_orders");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setOrderCount(parsed.length);
            return;
          }
        }
      } catch (e) {}
    };
    updateCount();
    window.addEventListener("techcore:orders-changed", updateCount);
    return () => window.removeEventListener("techcore:orders-changed", updateCount);
  }, []);

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      window.location.href = "/dang-nhap";
    }
  };

  return (
    <aside className="w-64 xl:w-72 bg-[#001C44] text-slate-300 border-r border-[#0C5776]/40 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto selection:bg-[#2D99AE] selection:text-white">
      {/* Top Header & Navigation */}
      <div className="p-4 sm:p-5 space-y-6">
        {/* Brand Header */}
        <div className="space-y-3">
          <Link href="/admin/don-hang" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0C5776] via-[#2D99AE] to-[#BCFEFE] flex items-center justify-center text-white shadow-lg shadow-[#0C5776]/35 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white tracking-tight leading-none">TechCore</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#2D99AE]/20 text-[#BCFEFE] border border-[#2D99AE]/40">
                  PRO
                </span>
              </div>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                Admin Workspace
              </span>
            </div>
          </Link>

          {/* System Status Pill */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#082E52]/70 border border-[#0C5776]/50 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BCFEFE] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BCFEFE]"></span>
              </span>
              <span className="text-[11px] font-medium text-slate-200">Hệ thống Trực tuyến</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#BCFEFE] bg-[#001C44] border border-[#2D99AE]/40 px-1.5 py-0.5 rounded">
              Core Node 01
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5 text-xs">
          {/* Group 1: BẢNG ĐIỀU KHIỂN & TỔNG QUAN */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-3 block mb-1">
              Bảng điều khiển &amp; Tổng quan
            </span>
            <Link
              href="/admin/doanh-thu"
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                activeSidebarItem === "dashboard"
                  ? "bg-gradient-to-r from-[#0C5776] to-[#2D99AE] text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard
                  className={`w-4 h-4 transition ${
                    activeSidebarItem === "dashboard" ? "text-white" : "text-slate-400 group-hover:text-[#BCFEFE]"
                  }`}
                />
                <span>Bảng điều khiển (KPI)</span>
              </div>
              <span
                className={`w-1.5 h-1.5 rounded-full transition ${
                  activeSidebarItem === "dashboard" ? "bg-white" : "bg-slate-700 group-hover:bg-blue-400"
                }`}
              />
            </Link>
          </div>

          {/* Group 2: QUẢN LÝ KINH DOANH */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-3 block mb-1">
              Quản lý kinh doanh
            </span>

            {/* Quản lý đơn hàng */}
            <Link
              href="/admin/don-hang"
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                activeSidebarItem === "orders"
                  ? "bg-gradient-to-r from-[#0C5776] to-[#2D99AE] text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag
                  className={`w-4 h-4 transition ${
                    activeSidebarItem === "orders" ? "text-white" : "text-slate-400 group-hover:text-[#BCFEFE]"
                  }`}
                />
                <span>Quản lý đơn hàng</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                  activeSidebarItem === "orders"
                    ? "bg-white/20 text-white backdrop-blur-xs"
                    : "bg-[#2D99AE]/20 text-[#BCFEFE] border border-[#2D99AE]/30"
                }`}
              >
                {orderCount}
              </span>
            </Link>

            {/* Khách hàng & VIP */}
            <Link
              href="/admin/khach-hang"
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                activeSidebarItem === "customers"
                  ? "bg-gradient-to-r from-[#0C5776] to-[#2D99AE] text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users
                  className={`w-4 h-4 transition ${
                    activeSidebarItem === "customers" ? "text-white" : "text-slate-400 group-hover:text-[#BCFEFE]"
                  }`}
                />
                <span>Khách hàng &amp; VIP</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                  activeSidebarItem === "customers"
                    ? "bg-white/20 text-white backdrop-blur-xs"
                    : "bg-slate-800/90 text-slate-300 border border-slate-700/60"
                }`}
              >
                3.8k
              </span>
            </Link>

            {/* Doanh thu & Dòng tiền */}
            <Link
              href="/admin/doanh-thu"
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                activeSidebarItem === "revenue"
                  ? "bg-gradient-to-r from-[#0C5776] to-[#2D99AE] text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp
                  className={`w-4 h-4 transition ${
                    activeSidebarItem === "revenue" ? "text-white" : "text-slate-400 group-hover:text-[#BCFEFE]"
                  }`}
                />
                <span>Doanh thu &amp; Dòng tiền</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                  activeSidebarItem === "revenue"
                    ? "bg-white/20 text-white backdrop-blur-xs"
                    : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                }`}
              >
                +28%
              </span>
            </Link>
          </div>

          {/* Group 3: QUẢN LÝ KHO & KỸ THUẬT */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-3 block mb-1">
              Quản lý kho &amp; Kỹ thuật
            </span>

            {/* Sản phẩm & Linh kiện AI */}
            <Link
              href="/admin/san-pham"
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                activeSidebarItem === "products"
                  ? "bg-gradient-to-r from-[#0C5776] to-[#2D99AE] text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu
                  className={`w-4 h-4 transition ${
                    activeSidebarItem === "products" ? "text-white" : "text-slate-400 group-hover:text-[#BCFEFE]"
                  }`}
                />
                <span>Sản phẩm &amp; Linh kiện AI</span>
              </div>
            </Link>

            {/* Kho & Serial/IMEI Shield */}
            <Link
              href="/admin/kho"
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                activeSidebarItem === "inventory"
                  ? "bg-gradient-to-r from-[#0C5776] to-[#2D99AE] text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Boxes
                  className={`w-4 h-4 transition ${
                    activeSidebarItem === "inventory" ? "text-white" : "text-slate-400 group-hover:text-[#BCFEFE]"
                  }`}
                />
                <span>Kho &amp; Serial/IMEI Shield</span>
              </div>
            </Link>

            {/* Bảo hành TechCare+ */}
            <Link
              href="/admin/bao-hanh"
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                activeSidebarItem === "warranty"
                  ? "bg-gradient-to-r from-[#0C5776] to-[#2D99AE] text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck
                  className={`w-4 h-4 transition ${
                    activeSidebarItem === "warranty" ? "text-white" : "text-slate-400 group-hover:text-[#BCFEFE]"
                  }`}
                />
                <span>Bảo hành TechCare+</span>
              </div>
            </Link>
          </div>

          {/* Group 4: CẤU HÌNH & HỆ THỐNG */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-3 block mb-1">
              Cấu hình &amp; Hệ thống
            </span>

            {/* Mã giảm giá & Voucher */}
            <Link
              href="/admin/voucher"
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                activeSidebarItem === "vouchers"
                  ? "bg-gradient-to-r from-[#0C5776] to-[#2D99AE] text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag
                  className={`w-4 h-4 transition ${
                    activeSidebarItem === "vouchers" ? "text-white" : "text-slate-400 group-hover:text-[#BCFEFE]"
                  }`}
                />
                <span>Mã giảm giá &amp; Voucher</span>
              </div>
            </Link>

            {/* Phân quyền RBAC */}
            <Link
              href="/admin/phan-quyen"
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                activeSidebarItem === "rbac"
                  ? "bg-gradient-to-r from-[#0C5776] to-[#2D99AE] text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock
                  className={`w-4 h-4 transition ${
                    activeSidebarItem === "rbac" ? "text-white" : "text-slate-400 group-hover:text-[#BCFEFE]"
                  }`}
                />
                <span>Phân quyền RBAC</span>
              </div>
            </Link>

            {/* Cấu hình & API Core */}
            <Link
              href="/admin/cai-dat"
              className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
                activeSidebarItem === "settings"
                  ? "bg-gradient-to-r from-[#0C5776] to-[#2D99AE] text-white font-bold shadow-md shadow-blue-600/25 border border-blue-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings
                  className={`w-4 h-4 transition ${
                    activeSidebarItem === "settings" ? "text-white" : "text-slate-400 group-hover:text-[#BCFEFE]"
                  }`}
                />
                <span>Cấu hình &amp; API Core</span>
              </div>
            </Link>
          </div>
        </nav>
      </div>

      {/* Footer Profile & Storefront Link */}
      <div className="p-4 border-t border-[#0C5776]/40 space-y-3 bg-[#001433]/90 backdrop-blur-xs">
        {/* Quick Link to Customer Store */}
        <Link
          href="/"
          className="group flex items-center justify-between text-xs text-slate-300 hover:text-white bg-[#082E52]/60 hover:bg-[#082E52]/90 border border-[#0C5776]/40 hover:border-[#2D99AE]/50 p-2.5 rounded-xl transition duration-150 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#2D99AE]/20 text-[#BCFEFE] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#0C5776] group-hover:text-white transition duration-200">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-300 group-hover:text-white">Xem Cửa Hàng</span>
          </div>
          <span className="text-[10px] text-slate-400 group-hover:text-[#BCFEFE] font-bold flex items-center gap-1 transition">
            Về Website <span className="group-hover:translate-x-0.5 transition-transform duration-150">→</span>
          </span>
        </Link>

        {/* User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#082E52]/70 border border-[#0C5776]/40 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0C5776] to-[#2D99AE] text-white font-black text-xs flex items-center justify-center shadow-sm">
                {currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#001C44]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {currentUser?.fullName || "Nguyễn Quốc Anh"}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.email || "admin1@techcore.vn"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogoutAction}
            title="Đăng xuất khỏi hệ thống"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
