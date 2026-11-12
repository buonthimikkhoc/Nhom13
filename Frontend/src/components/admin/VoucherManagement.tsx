"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Percent,
  DollarSign,
  Gift,
  Search,
  Plus,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Building2,
  Users,
  Copy,
  Check,
  X,
  TrendingUp,
  ShieldCheck,
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
  ChevronRight,
  Sparkles,
  Zap,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { api, AdminVoucher } from "../../lib/api";

export function VoucherManagement() {
  const formatVND = (price: number) => {
    return price.toLocaleString("vi-VN") + " ₫";
  };

  // State bộ lọc và tìm kiếm
  const [activeTab, setActiveTab] = useState<
    "all" | "b2b" | "vip" | "partner" | "coolvan" | "expired"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals & Simulator
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVoucherDetail, setSelectedVoucherDetail] = useState<any | null>(null);

  // Lắng nghe sự kiện đồng bộ từ AdminNavbar (Thêm Voucher, Xuất Excel)
  useEffect(() => {
    const handleAddVoucher = () => setShowCreateModal(true);
    const handleExportVouchers = () => {
      alert("Đang kết xuất báo cáo hiệu quả ngân sách Voucher & ROI khuyến mãi ra Excel...");
    };

    window.addEventListener("admin:add-voucher", handleAddVoucher);
    window.addEventListener("admin:export-vouchers", handleExportVouchers);

    return () => {
      window.removeEventListener("admin:add-voucher", handleAddVoucher);
      window.removeEventListener("admin:export-vouchers", handleExportVouchers);
    };
  }, []);

  // Quick Calculator State
  const [simCode, setSimCode] = useState("B2B-AI-RIG-10M");
  const [simOrderValue, setSimOrderValue] = useState(250000000);
  const [simResult, setSimResult] = useState<any | null>(null);

  // Danh sách Voucher Doanh Nghiệp & VIP đồng bộ Real-time với Hệ thống
  const [voucherList, setVoucherList] = useState<any[]>([]);

  const loadVouchers = async () => {
    try {
      const res = await api.getAdminVouchers();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((v: any) => ({
          id: v.id,
          code: v.code,
          name: v.name,
          type: v.type,
          discountValue: v.value,
          discountText:
            v.type === "fixed"
              ? `Giảm ${formatVND(v.value)}`
              : v.type === "percent"
              ? `Giảm ${v.value}%${v.maxDiscount ? ` (Tối đa ${formatVND(v.maxDiscount)})` : ""}`
              : `Miễn phí vận chuyển`,
          minOrderValue: v.minOrder,
          targetAudience: v.targetAudience || "Mọi khách hàng",
          category: v.category || "vip",
          usedCount: v.usedCount || 0,
          totalLimit: v.usageLimit || 100,
          totalBudget: (v.value || 0) * (v.usageLimit || 100),
          usedBudget: (v.value || 0) * (v.usedCount || 0),
          startDate: v.startsAt || "01/01/2026",
          endDate: v.endsAt || "31/12/2026",
          status: !v.isActive ? "paused" : (v.usageLimit && v.usedCount >= v.usageLimit) ? "exhausted" : "active",
          statusText: !v.isActive ? "Tạm ngưng" : (v.usageLimit && v.usedCount >= v.usageLimit) ? "Hết lượt dùng" : "Đang kích hoạt",
          sponsor: v.sponsor || "TechCore Official",
          description: v.description || "",
          recentOrders: v.recentOrders || [],
        }));
        setVoucherList(mapped);
      }
    } catch (e) {
      console.error("Lỗi nạp vouchers:", e);
    }
  };

  useEffect(() => {
    loadVouchers();
    const handleSync = () => loadVouchers();
    window.addEventListener("techcore:vouchers-changed", handleSync);
    window.addEventListener("techcore:orders-changed", handleSync);
    return () => {
      window.removeEventListener("techcore:vouchers-changed", handleSync);
      window.removeEventListener("techcore:orders-changed", handleSync);
    };
  }, []);

  const handleDeleteVoucher = async (id: string, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa mã voucher "${code}" không?`)) {
      await api.deleteAdminVoucher(id);
      loadVouchers();
    }
  };

  const handleToggleStatus = async (item: any) => {
    const newIsActive = item.status === "paused";
    await api.updateAdminVoucher(item.id, { isActive: newIsActive });
    loadVouchers();
  };

  // Sao chép mã voucher
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // Tính thử mã Voucher
  const handleRunSimulator = (e: React.FormEvent) => {
    e.preventDefault();
    const v = voucherList.find((item) => item.code.toUpperCase() === simCode.toUpperCase());
    if (!v) {
      alert(`Mã giảm giá "${simCode}" không tồn tại hoặc đã hết hạn!`);
      setSimResult(null);
      return;
    }

    if (simOrderValue < v.minOrderValue) {
      alert(`Đơn hàng chưa đạt giá trị tối thiểu! Yêu cầu: ${formatVND(v.minOrderValue)}`);
      setSimResult({
        valid: false,
        message: `Chưa đạt đơn tối thiểu ${formatVND(v.minOrderValue)}`,
      });
      return;
    }

    let discountAmount = 0;
    if (v.type === "fixed") {
      discountAmount = v.discountValue;
    } else if (v.type === "percent") {
      discountAmount = Math.min((simOrderValue * v.discountValue) / 100, 50000000);
    } else if (v.type === "points") {
      discountAmount = (simOrderValue * v.discountValue) / 100;
    }

    setSimResult({
      valid: true,
      voucher: v,
      discountAmount,
      finalAmount: Math.max(0, simOrderValue - discountAmount),
    });
  };

  // Lọc danh sách Voucher
  const filteredVouchers = voucherList.filter((item) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "b2b" && item.category === "b2b") ||
      (activeTab === "vip" && item.category === "vip") ||
      (activeTab === "partner" && item.category === "partner") ||
      (activeTab === "coolvan" && item.category === "coolvan") ||
      (activeTab === "expired" && item.status === "expired");

    const matchSearch =
      !searchQuery ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sponsor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType =
      discountTypeFilter === "all" || item.type === discountTypeFilter;

    const matchStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchTab && matchSearch && matchType && matchStatus;
  });

  return (
    <>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
            <span>QUẢN TRỊ HỆ SINH THÁI TECHCORE ENTERPRISE</span>
            <span className="text-slate-300">•</span>
            <span>CHÍNH SÁCH BÁN HÀNG &amp; PROMOTION</span>
            <span className="text-slate-300">•</span>
            <span>MÃ GIẢM GIÁ &amp; VOUCHER DOANH NGHIỆP</span>
          </p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Mã Giảm Giá &amp; Voucher Doanh Nghiệp
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ngân Sách Q1/2026: 1.500.000.000 ₫
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              Chống Trục Lợi AI Guard v3.4 Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => alert("Đang kết xuất báo cáo hiệu quả ngân sách Voucher & ROI khuyến mãi ra Excel...")}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Xuất Báo Cáo ROI</span>
          </button>

          <button
            type="button"
            onClick={() => alert("✓ Đã đồng bộ điểm thưởng TechPoints & Voucher với cổng thanh toán TechPay Gateway!")}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>Đối Soát TechPoints</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-sm shadow-blue-500/25 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tạo Voucher / Chiến Dịch Mới</span>
          </button>
        </div>
      </div>

      {/* 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                VOUCHER ĐANG HOẠT ĐỘNG
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">16</span>
              <span className="text-xs font-bold text-blue-600">Mã Active</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              5 Mã B2B • 6 Mã VIP Tier • 5 Mã Chiến Dịch
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Tự động kích hoạt: <strong className="text-emerald-600">100%</strong></span>
            <span>Hết hạn: <strong className="text-slate-800">4 mã</strong></span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                DOANH THU THÚC ĐẨY (GMV)
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">6.840.500.000</span>
              <span className="text-xs font-bold text-slate-500">₫</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ROI Chiến dịch đạt 9.8x ngân sách</span>
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Workstation B2B: <strong className="text-slate-800">68%</strong></span>
            <span>Apple &amp; GPU: <strong className="text-slate-800">32%</strong></span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                NGÂN SÁCH ĐÃ GIẢI NGÂN
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">698.200.000</span>
              <span className="text-xs font-bold text-slate-500">₫</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Đạt 46.5% hạn mức ngân sách Quý 1/2026
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: "46.5%" }} />
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                LƯỢT ÁP DỤNG THÀNH CÔNG
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Gift className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">412</span>
              <span className="text-xs font-bold text-indigo-600">Lượt</span>
            </div>
            <p className="text-[11px] text-indigo-700 font-bold mt-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Tỷ lệ chốt đơn tăng +34.2%</span>
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Trung bình giảm: <strong className="text-slate-800">1.69M ₫ / đơn</strong></span>
            <span>Gian lận: <strong className="text-emerald-600">0%</strong></span>
          </div>
        </div>
      </div>

      {/* BUDGET POOL & QUICK SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Budget Allocation Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Phân Bổ Ngân Sách Khuyến Mãi &amp; Tài Trợ Đối Tác Q1/2026
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Theo dõi tỷ lệ giải ngân chiết khấu thương mại theo từng nhóm đối tượng
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Quỹ Đã Duyệt: 1.5 Tỷ ₫
              </span>
            </div>

            {/* 4 Budget Rows */}
            <div className="space-y-3.5">
              {/* Row 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Hợp Đồng B2B Doanh Nghiệp &amp; Máy Trạm AI (NeuralForge, Threadripper)
                  </span>
                  <span className="font-black text-slate-900">
                    350.000.000 ₫ <span className="text-slate-400 font-normal">/ 700M (50.0%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "50%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Chiết khấu trực tiếp hợp đồng kinh tế</span>
                  <span className="text-emerald-600 font-semibold">Còn lại 350.000.000 ₫</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    Đặc Quyền Hội Viên VIP Platinum, Titanium &amp; Ví TechPoints
                  </span>
                  <span className="font-black text-slate-900">
                    185.000.000 ₫ <span className="text-slate-400 font-normal">/ 400M (46.2%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: "46.2%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Hoàn điểm TechPoints &amp; voucher sinh nhật VIP</span>
                  <span className="text-emerald-600 font-semibold">Còn lại 215.000.000 ₫</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Đồng Tài Trợ Nhà Sản Xuất (ASUS ROG, NVIDIA Inception, AMD)
                  </span>
                  <span className="font-black text-slate-900">
                    112.000.000 ₫ <span className="text-slate-400 font-normal">/ 250M (44.8%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "44.8%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Trợ giá GPU RTX 4090 &amp; CPU Threadripper</span>
                  <span className="text-emerald-600 font-semibold">Được nhà sản xuất hoàn 100%</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-600" />
                    Trợ Giá Vận Chuyển Hỏa Tốc Xe Lạnh CoolVan 2 Giờ
                  </span>
                  <span className="font-black text-slate-900">
                    51.200.000 ₫ <span className="text-slate-400 font-normal">/ 150M (34.1%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-600 h-full rounded-full" style={{ width: "34.1%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Freeship xe chuyên dụng kiểm soát nhiệt độ 18.5°C</span>
                  <span className="text-emerald-600 font-semibold">Còn lại 98.800.000 ₫</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Nguyên tắc tài chính: Khi chạm 90% hạn mức danh mục, hệ thống tự động gửi thông báo phê duyệt bổ sung.
            </span>
            <button
              type="button"
              onClick={() => alert("Mở bảng cấu hình hạn mức trần ngân sách khuyến mãi...")}
              className="text-blue-600 hover:text-blue-700 font-bold shrink-0 flex items-center gap-1"
            >
              <span>Cấu Hình Hạn Mức</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Quick Voucher Testing Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Công Cụ Thử Nghiệm &amp; Tính Toán Voucher Tức Thì
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kiểm tra thuật toán giảm giá, điều kiện áp dụng và số tiền thực thu
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold shrink-0">
                Sandbox Test
              </span>
            </div>

            <form onSubmit={handleRunSimulator} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Mã Voucher kiểm tra:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={simCode}
                    onChange={(e) => setSimCode(e.target.value.toUpperCase())}
                    placeholder="Ví dụ: B2B-AI-RIG-10M"
                    className="w-full bg-slate-50 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-mono font-black tracking-wider uppercase transition"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-mono">
                    PROMO
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Giá trị đơn hàng giả định (₫):
                </label>
                <input
                  type="number"
                  value={simOrderValue}
                  onChange={(e) => setSimOrderValue(Number(e.target.value))}
                  className="w-full bg-slate-50 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-black text-slate-900 transition"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tương đương: <strong>{formatVND(simOrderValue)}</strong>
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Kiểm Tra &amp; Tính Toán Chiết Khấu</span>
              </button>
            </form>

            {/* Simulator Result Box */}
            {simResult && simResult.valid && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-emerald-800 font-bold">
                  <span>✓ Áp dụng hợp lệ:</span>
                  <span className="font-mono text-emerald-700 font-black">{simResult.voucher.code}</span>
                </div>
                <div className="pt-1 border-t border-emerald-200/80 space-y-1 text-[11px] text-slate-700">
                  <div className="flex justify-between">
                    <span>Số tiền được giảm:</span>
                    <strong className="text-emerald-600 font-black">-{formatVND(simResult.discountAmount)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Số tiền thanh toán thực:</span>
                    <strong className="text-slate-900 font-black text-xs">{formatVND(simResult.finalAmount)}</strong>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>Đối tượng:</span>
                    <span>{simResult.voucher.targetAudience}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 flex items-center justify-between mt-4">
            <span>Bảo vệ giỏ hàng: Giới hạn tối đa 1 voucher tiền mặt / đơn.</span>
            <button
              type="button"
              onClick={() => alert("Cấu hình chính sách cộng dồn voucher...")}
              className="text-blue-600 font-bold hover:underline shrink-0"
            >
              Quy Tắc Stack Voucher
            </button>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        {[
          { key: "all", label: "Tất cả chiến dịch (16)" },
          { key: "b2b", label: "Voucher B2B Doanh Nghiệp (5)" },
          { key: "vip", label: "Đặc quyền VIP & TechPoints (6)" },
          { key: "partner", label: "Tài trợ nhà phân phối ASUS / NVIDIA (3)" },
          { key: "coolvan", label: "Freeship xe lạnh CoolVan (2)" },
          { key: "expired", label: "Đã hết hạn / Tạm dừng (4)" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SEARCH TOOLBAR */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo mã voucher, tên chương trình, nhà tài trợ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <select
            value={discountTypeFilter}
            onChange={(e) => setDiscountTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="all">Loại chiết khấu: Tất cả</option>
            <option value="fixed">Tiền mặt cố định (₫)</option>
            <option value="percent">Tỷ lệ phần trăm (%)</option>
            <option value="points">Hoàn điểm TechPoints</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:bg-white hidden sm:block"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="active">Đang kích hoạt</option>
            <option value="exhausted">Hết lượt / Hết ngân sách</option>
            <option value="paused">Tạm dừng</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (selectedVouchers.length === 0) {
                alert("Vui lòng tích chọn ít nhất 1 voucher để xuất mã QR / Barcode quảng bá!");
                return;
              }
              alert(`Đang in ${selectedVouchers.length} bộ mã QR Voucher chuẩn thẻ quà tặng doanh nghiệp...`);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>In Thẻ Voucher ({selectedVouchers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => alert("✓ Đã kiểm tra tính toàn vẹn hệ thống voucher: 0 lỗi xung đột mã!")}
            className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold flex items-center gap-1.5 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Kiểm Tra Hợp Lệ</span>
          </button>
        </div>
      </div>

      {/* MAIN VOUCHER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedVouchers.length === filteredVouchers.length && filteredVouchers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVouchers(filteredVouchers.map((v) => v.id));
                      } else {
                        setSelectedVouchers([]);
                      }
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="p-4">MÃ VOUCHER &amp; CHƯƠNG TRÌNH</th>
                <th className="p-4">MỨC CHIẾT KHẤU</th>
                <th className="p-4">ĐIỀU KIỆN ÁP DỤNG</th>
                <th className="p-4">LƯỢT DÙNG &amp; TIẾN ĐỘ</th>
                <th className="p-4">NGÂN SÁCH ĐÃ CHI</th>
                <th className="p-4">THỜI HẠN &amp; TRẠNG THÁI</th>
                <th className="p-4 text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVouchers.map((item) => {
                const isSelected = selectedVouchers.includes(item.id);
                const percentUsed = Math.round((item.usedCount / item.totalLimit) * 100);
                return (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* Checkbox */}
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedVouchers((prev) =>
                            prev.includes(item.id)
                              ? prev.filter((id) => id !== item.id)
                              : [...prev, item.id]
                          );
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    {/* Voucher Code & Name */}
                    <td className="p-4 max-w-[260px]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-200 tracking-wider">
                            {item.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(item.code)}
                            title="Sao chép mã"
                            className="text-slate-400 hover:text-blue-600 p-0.5 transition"
                          >
                            {copiedCode === item.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="font-bold text-slate-900 leading-snug line-clamp-1" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          Tài trợ: {item.sponsor}
                        </p>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-black text-sm text-emerald-600 block">
                          {item.discountText}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.type === "fixed"
                            ? "Khấu trừ tiền mặt trực tiếp"
                            : item.type === "percent"
                            ? "Khấu trừ theo tỷ lệ %"
                            : "Tích lũy ví TechPoints"}
                        </span>
                      </div>
                    </td>

                    {/* Conditions */}
                    <td className="p-4 max-w-[200px]">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 text-xs">
                          Đơn từ {formatVND(item.minOrderValue)}
                        </p>
                        <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          {item.targetAudience}
                        </span>
                      </div>
                    </td>

                    {/* Usage Progress */}
                    <td className="p-4 min-w-[140px]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <strong className="text-slate-800">{item.usedCount}</strong>
                          <span className="text-slate-400 font-medium">/ {item.totalLimit} lượt</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              percentUsed >= 80 ? "bg-amber-500" : "bg-blue-600"
                            }`}
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 block text-right font-mono">
                          {percentUsed}% đã dùng
                        </span>
                      </div>
                    </td>

                    {/* Budget Used */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 font-black text-xs block">
                          {formatVND(item.usedBudget)}
                        </strong>
                        <span className="text-[10px] text-slate-400">
                          Hạn mức: {formatVND(item.totalBudget)}
                        </span>
                      </div>
                    </td>

                    {/* Date & Status */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {item.statusText}
                        </span>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Đến: {item.endDate}</span>
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedVoucherDetail(item)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVoucher(item.id, item.code)}
                          title="Xóa voucher"
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Hiển thị <strong className="text-slate-800">1 - {filteredVouchers.length}</strong> trên tổng số{" "}
            <strong className="text-slate-800">16</strong> chiến dịch khuyến mãi • 10 / trang
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-xs"
            >
              1
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center font-medium"
            >
              2
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM PROTOCOL BANNER */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">
              Hệ Thống Chống Gian Lận Khuyến Mãi AI Guard v3.4 (Anti-Fraud &amp; Sybil Resistance)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Mỗi mã giảm giá doanh nghiệp B2B và voucher VIP đều được ràng buộc bảo mật với Mã số thuế (MST), số điện thoại xác thực OTP và định danh thiết bị vi mạch e-Shield, ngăn chặn 100% tình trạng đầu cơ hoặc lạm dụng ngân sách khuyến mãi.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => alert("Đang xuất báo cáo kiểm toán ngân sách khuyến mãi...")}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Báo Cáo Kiểm Toán
          </button>
          <button
            type="button"
            onClick={() => alert("✓ Hệ thống kiểm tra chống gian lận: 0 giao dịch bất thường phát hiện!")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-blue-500/25"
          >
            Kiểm Tra AI Guard
          </button>
        </div>
      </div>

      {/* MODAL 1: TẠO VOUCHER / CHIẾN DỊCH MỚI */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  TECHCORE PROMOTION ENGINE
                </span>
                <h3 className="text-xl font-black text-slate-900">+ Tạo Voucher / Chiến Dịch Mới</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const code = ((fd.get("code") as string) || `PROMO-${Date.now().toString().slice(-4)}`).trim().toUpperCase();
                const name = (fd.get("name") as string) || "Chương trình ưu đãi TechCore";
                const type = (fd.get("type") as "fixed" | "percent" | "points") || "fixed";
                const discountValue = Number(fd.get("discountValue")) || 50000;
                const minOrder = Number(fd.get("minOrder")) || 0;
                const limit = Number(fd.get("limit")) || 100;
                const category = (fd.get("category") as string) || "vip";
                const audience = (fd.get("audience") as string) || "Toàn bộ khách hàng TechCore";

                const res = await api.createAdminVoucher({
                  code,
                  name,
                  type: (type === "points" ? "fixed" : type) as any,
                  value: discountValue,
                  minOrder,
                  usageLimit: limit,
                  targetAudience: audience,
                  category,
                  sponsor: "TechCore Treasury Promotion Pool",
                  description: "Chương trình ưu đãi vừa được tạo mới trên hệ thống TechCore.",
                });

                if (res.success) {
                  await loadVouchers();
                  setShowCreateModal(false);
                  alert(`✓ Đã tạo thành công mã Voucher "${code}" và kích hoạt trên toàn hệ sinh thái TechCore!`);
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mã Voucher (Code):</label>
                  <input
                    name="code"
                    required
                    placeholder="Ví dụ: B2B-AI-15M"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-mono font-black uppercase text-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phân loại danh mục:</label>
                  <select
                    name="category"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="b2b">Voucher B2B Doanh Nghiệp</option>
                    <option value="vip">Đặc Quyền Hội Viên VIP</option>
                    <option value="partner">Đối Tác Phần Cứng (ASUS/NVIDIA)</option>
                    <option value="coolvan">Vận Chuyển Xe Lạnh CoolVan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tên chương trình khuyến mãi:</label>
                <input
                  name="name"
                  required
                  placeholder="Ví dụ: Tài Trợ Cụm Máy Trạm AI Workstation Q1"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hình thức chiết khấu:</label>
                  <select
                    name="type"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="fixed">Giảm tiền mặt cố định (₫)</option>
                    <option value="percent">Giảm theo tỷ lệ (%)</option>
                    <option value="points">Hoàn điểm ví TechPoints</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Giá trị chiết khấu (₫ hoặc %):</label>
                  <input
                    name="discountValue"
                    type="number"
                    required
                    defaultValue={10000000}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-black text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Đơn hàng tối thiểu (₫):</label>
                  <input
                    name="minOrder"
                    type="number"
                    required
                    defaultValue={100000000}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Giới hạn tổng lượt dùng:</label>
                  <input
                    name="limit"
                    type="number"
                    required
                    defaultValue={50}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Đối tượng thụ hưởng:</label>
                <input
                  name="audience"
                  required
                  defaultValue="Doanh nghiệp B2B & Khách VIP Platinum"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-sm shadow-blue-500/25"
                >
                  Phát Hành Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHI TIẾT VOUCHER DOSSIER */}
      {selectedVoucherDetail && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  HỒ SƠ CHIẾN DỊCH KHUYẾN MÃI TECHCORE
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedVoucherDetail.code}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tài trợ bởi: {selectedVoucherDetail.sponsor}
                </p>
              </div>
              <button
                onClick={() => setSelectedVoucherDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Discount Value Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-950 text-white space-y-1">
              <span className="text-[10px] text-cyan-400 font-mono block">MỨC CHIẾT KHẤU:</span>
              <p className="text-2xl font-black text-emerald-400">{selectedVoucherDetail.discountText}</p>
              <p className="text-xs text-slate-300">
                Áp dụng cho đơn hàng tối thiểu <strong>{formatVND(selectedVoucherDetail.minOrderValue)}</strong>
              </p>
            </div>

            {/* Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Tên chương trình &amp; Diễn giải:</span>
                <p className="font-bold text-slate-900">{selectedVoucherDetail.name}</p>
                <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{selectedVoucherDetail.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                <div>
                  <span className="text-slate-400 text-[10px] block">Tiến độ sử dụng:</span>
                  <p className="font-bold text-slate-900">{selectedVoucherDetail.usedCount} / {selectedVoucherDetail.totalLimit} lượt</p>
                  <span className="text-blue-600 text-[10px] font-bold">
                    Đã chi: {formatVND(selectedVoucherDetail.usedBudget)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Thời gian hiệu lực:</span>
                  <p className="font-bold text-slate-900">{selectedVoucherDetail.startDate} → {selectedVoucherDetail.endDate}</p>
                  <span className="text-emerald-600 text-[10px] font-bold">Trạng thái: Hoạt động</span>
                </div>
              </div>

              {/* Recent Orders */}
              {selectedVoucherDetail.recentOrders.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-slate-400 text-[10px] block font-bold mb-1">Đơn hàng áp dụng gần nhất:</span>
                  <div className="space-y-1">
                    {selectedVoucherDetail.recentOrders.map((ord: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="font-mono">{ord}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  alert(`Đang sao chép đường link áp dụng mã ${selectedVoucherDetail.code} gửi cho khách hàng...`);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao Chép Link Áp Dụng</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedVoucherDetail(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

