"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

interface AdminNavbarProps {
  activeSidebarItem?: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onAddNew?: () => void;
  onExportExcel?: () => void;
  currentUser?: { fullName?: string; email?: string } | null;
}

export function AdminNavbar({
  activeSidebarItem: propActiveItem,
  currentUser,
}: AdminNavbarProps) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (propActiveItem) return propActiveItem;
    if (pathname.includes("/admin/san-pham")) return "products";
    if (pathname.includes("/admin/khach-hang")) return "customers";
    if (pathname.includes("/admin/doanh-thu")) return "revenue";
    if (pathname.includes("/admin/kho")) return "inventory";
    if (pathname.includes("/admin/bao-hanh")) return "warranty";
    if (pathname.includes("/admin/voucher")) return "vouchers";
    if (pathname.includes("/admin/phan-quyen")) return "rbac";
    if (pathname.includes("/admin/cai-dat")) return "settings";
    if (pathname.includes("/admin/don-hang") || pathname.includes("/admin/quanlidonhang")) return "orders";
    return "orders";
  };

  const activeSidebarItem = getActiveTab();

  const getBreadcrumbTitle = () => {
    switch (activeSidebarItem) {
      case "products":
        return "Sản phẩm & Phần cứng AI";
      case "customers":
        return "Khách hàng & VIP CRM";
      case "revenue":
        return "Doanh thu & Dòng tiền";
      case "inventory":
        return "Quản lý Kho & e-Shield S/N";
      case "warranty":
        return "Bảo hành TechCare+";
      case "vouchers":
        return "Mã giảm giá & Voucher";
      case "rbac":
        return "Phân quyền quản trị RBAC";
      case "settings":
        return "Cấu hình & API Core";
      default:
        return "Quản lý đơn hàng & Điều phối";
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400">TechCore</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400">Quản trị viên</span>
        <span className="text-slate-300">/</span>
        <span className="font-bold text-slate-800">
          {getBreadcrumbTitle()}
        </span>
      </div>

      {/* Right: Notifications & Admin Profile */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          title="Thông báo hệ thống"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0C5776] to-[#2D99AE] text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {currentUser?.fullName ? currentUser.fullName.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {currentUser?.fullName || "Nguyễn Quốc Anh"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {currentUser?.email || "admin1@techcore.vn"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
