"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Download,
  Printer,
  Eye,
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
  ChevronRight,
  UserCheck,
  Cpu,
  MapPin,
  Truck,
  Wrench,
  Activity,
  FileText,
  X,
  Check,
  RefreshCw,
  QrCode,
  Zap,
  Trash2,
  AlertCircle,
  FileSpreadsheet,
  Copy,
  ChevronDown,
  Building2,
  User,
  Phone,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { formatVND } from "../../lib/utils";
import { api } from "../../lib/api";
import { vipToast } from "../common/VipToast";

export type WarrantyStatus = "urgent_exchange" | "onsite_active" | "lab_inspecting" | "completed";
export type ServiceType = "exchange_30d" | "onsite_repair" | "lab_repair";

const BROADCAST_WARRANTY_CHANNEL = "techcore_admin_warranty_channel";

export function WarrantyManagement() {
  const [rmaList, setRmaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<
    "all" | "urgent_exchange" | "onsite_active" | "lab_inspecting" | "completed"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("all");
  const [selectedLabHub, setSelectedLabHub] = useState("all");
  const [selectedRMAs, setSelectedRMAs] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Lookup
  const [quickLookupInput, setQuickLookupInput] = useState("");
  const [lookupAlert, setLookupAlert] = useState<string | null>(null);

  // Modals
  const [showCreateRMAModal, setShowCreateRMAModal] = useState(false);
  const [showExportPreviewModal, setShowExportPreviewModal] = useState(false);
  const [selectedRMADetail, setSelectedRMADetail] = useState<any | null>(null);
  const [deletingRMA, setDeletingRMA] = useState<any | null>(null);

  // Form Validation & Admin Profile
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentAdminName, setCurrentAdminName] = useState<string>("Quản trị viên TechCore");
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(10);

  // Form State for Add RMA
  const [newRMAForm, setNewRMAForm] = useState({
    code: "#RMA-2026-" + Math.floor(1000 + Math.random() * 9000),
    customerName: "",
    customerPhone: "",
    customerTier: "VIP Platinum",
    customerAddress: "Landmark 81, TP.HCM",
    equipmentName: "",
    equipmentSku: "GPU-ROG-4090-OC",
    serialNumber: "",
    daysSincePurchase: 12,
    serviceType: "exchange_30d" as ServiceType,
    issueDescription: "",
    diagnosisResult: "Lỗi phần cứng linh kiện đã xác thực. Đạt chuẩn đổi mới 1:1 siêu tốc trong 30 ngày.",
    assignedTech: "KTV Trưởng Hoàng Nam",
    techPhone: "0918.456.789",
    hubLocation: "Kho Hub Landmark 81 (TP.HCM)",
    status: "urgent_exchange" as WarrantyStatus,
  });

  // Load current admin name
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.fullName) setCurrentAdminName(u.fullName);
      }
    } catch (e) {}
  }, []);

  // Broadcast cross-tab sync
  const broadcastWarrantyAction = (payload: {
    type: "CREATE_RMA" | "UPDATE_STATUS" | "ASSIGN_TECH" | "DELETE_RMA";
    code: string;
    customerName: string;
    detail?: string;
    author: string;
  }) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel(BROADCAST_WARRANTY_CHANNEL);
        channel.postMessage({ ...payload, timestamp: Date.now() });
        channel.close();
      } catch (e) {}
    }
  };

  // Load warranty tickets from API
  const loadWarranty = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminWarranty();
      if (res.success && Array.isArray(res.data)) {
        setRmaList(res.data);
      }
    } catch (e) {
      console.error("Lỗi khi tải phiếu RMA:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarranty();

    const handleWarrantyChanged = () => {
      loadWarranty();
    };
    window.addEventListener("techcore:warranty-changed", handleWarrantyChanged);

    // Listen to BroadcastChannel from other tabs
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel(BROADCAST_WARRANTY_CHANNEL);
        channel.onmessage = (event) => {
          const data = event.data;
          if (!data) return;

          loadWarranty();

          if (data.type === "CREATE_RMA") {
            vipToast.info(
              `🛠️ ${data.author} vừa tiếp nhận phiếu RMA mới: ${data.code} (${data.customerName})`
            );
          } else if (data.type === "UPDATE_STATUS") {
            vipToast.info(
              `🔄 ${data.author} vừa cập nhật tiến độ [${data.code}]: ${data.detail}`
            );
          } else if (data.type === "ASSIGN_TECH") {
            vipToast.info(
              `👨‍🔧 ${data.author} vừa điều phối kỹ thuật viên cho [${data.code}]: ${data.detail}`
            );
          } else if (data.type === "DELETE_RMA") {
            vipToast.warning(
              `🗑️ ${data.author} đã gỡ bỏ phiếu RMA: ${data.code}`
            );
          }
        };
      } catch (e) {}
    }

    return () => {
      window.removeEventListener("techcore:warranty-changed", handleWarrantyChanged);
      if (channel) {
        try {
          channel.close();
        } catch (e) {}
      }
    };
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, selectedServiceType, selectedLabHub]);

  // Listen to AdminNavbar triggers
  useEffect(() => {
    const handleAddTrigger = () => {
      resetAddForm();
      setShowCreateRMAModal(true);
    };
    const handleExportTrigger = () => {
      setShowExportPreviewModal(true);
    };

    window.addEventListener("admin:add-warranty", handleAddTrigger);
    window.addEventListener("admin:export-warranty", handleExportTrigger);

    return () => {
      window.removeEventListener("admin:add-warranty", handleAddTrigger);
      window.removeEventListener("admin:export-warranty", handleExportTrigger);
    };
  }, []);

  // Reset Add Form
  const resetAddForm = () => {
    setNewRMAForm({
      code: "#RMA-2026-" + Math.floor(1000 + Math.random() * 9000),
      customerName: "",
      customerPhone: "",
      customerTier: "VIP Platinum",
      customerAddress: "Landmark 81, TP.HCM",
      equipmentName: "",
      equipmentSku: "GPU-ROG-4090-OC",
      serialNumber: "",
      daysSincePurchase: 12,
      serviceType: "exchange_30d",
      issueDescription: "",
      diagnosisResult: "Lỗi phần cứng linh kiện đã xác thực. Đạt chuẩn đổi mới 1:1 siêu tốc trong 30 ngày.",
      assignedTech: "KTV Trưởng Hoàng Nam",
      techPhone: "0918.456.789",
      hubLocation: "Kho Hub Landmark 81 (TP.HCM)",
      status: "urgent_exchange",
    });
    setFormErrors({});
  };

  // Scroll to top on detail modal open
  useEffect(() => {
    if (selectedRMADetail && modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [selectedRMADetail]);

  // Copy helper
  const handleCopyText = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Quick RMA Lookup
  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLookupInput.trim()) return;

    const term = quickLookupInput.trim().toLowerCase();
    const found = rmaList.find(
      (r) =>
        r.code?.toLowerCase().includes(term) ||
        r.equipment?.originalSerial?.toLowerCase().includes(term) ||
        r.customer?.phone?.includes(term) ||
        r.customer?.name?.toLowerCase().includes(term)
    );

    if (found) {
      setSelectedRMADetail(found);
      setLookupAlert(`✓ Đã tìm thấy phiếu RMA: ${found.code} - ${found.equipment?.name} (${found.statusText})`);
      setTimeout(() => setLookupAlert(null), 5000);
      setQuickLookupInput("");
    } else {
      vipToast.error(`Không tìm thấy hồ sơ RMA nào với từ khóa "${quickLookupInput}"!`);
    }
  };

  // Inline Status Change
  const handleInlineStatusChange = async (rmaId: string, newStatus: WarrantyStatus) => {
    const targetItem = rmaList.find((r) => r.id === rmaId || r.code === rmaId);
    if (!targetItem) return;

    const statusLabels: Record<WarrantyStatus, string> = {
      urgent_exchange: "Đã duyệt đổi mới • Xe CoolVan đang xuất phát",
      onsite_active: "Kỹ sư đang xử lý On-site tại chỗ",
      lab_inspecting: "Đang thẩm định tại trung tâm Lab",
      completed: "Hoàn tất xử lý • Khách hàng đã ký nhận",
    };

    const statusText = statusLabels[newStatus];
    const slaCountdown = newStatus === "completed" ? "Đã xong" : "≤ 2 Giờ";

    setRmaList((prev) =>
      prev.map((r) => {
        if (r.id === rmaId || r.code === rmaId) {
          return {
            ...r,
            status: newStatus,
            statusText,
            slaCountdown,
          };
        }
        return r;
      })
    );

    await api.updateAdminWarranty(rmaId, { status: newStatus, statusText, slaCountdown });

    broadcastWarrantyAction({
      type: "UPDATE_STATUS",
      code: targetItem.code,
      customerName: targetItem.customer?.name || "Khách hàng",
      detail: statusText,
      author: currentAdminName,
    });

    vipToast.success(`Phiếu ${targetItem.code} cập nhật: "${statusText}"`);
  };

  // Inline Assigned Tech Change
  const handleInlineTechChange = async (rmaId: string, newTech: string) => {
    const targetItem = rmaList.find((r) => r.id === rmaId || r.code === rmaId);
    if (!targetItem) return;

    setRmaList((prev) =>
      prev.map((r) => {
        if (r.id === rmaId || r.code === rmaId) {
          return {
            ...r,
            assignedTech: newTech,
          };
        }
        return r;
      })
    );

    await api.updateAdminWarranty(rmaId, { assignedTech: newTech });

    broadcastWarrantyAction({
      type: "ASSIGN_TECH",
      code: targetItem.code,
      customerName: targetItem.customer?.name || "Khách hàng",
      detail: newTech,
      author: currentAdminName,
    });

    vipToast.success(`Đã phân công ${newTech} phụ trách ${targetItem.code}`);
  };

  // Inline Hub Change
  const handleInlineHubChange = async (rmaId: string, newHub: string) => {
    const targetItem = rmaList.find((r) => r.id === rmaId || r.code === rmaId);
    if (!targetItem) return;

    setRmaList((prev) =>
      prev.map((r) => {
        if (r.id === rmaId || r.code === rmaId) {
          return {
            ...r,
            hubLocation: newHub,
          };
        }
        return r;
      })
    );

    await api.updateAdminWarranty(rmaId, { hubLocation: newHub });

    vipToast.success(`Phiếu ${targetItem.code} chuyển về: ${newHub}`);
  };

  // Validate Add RMA Form
  const validateRMAForm = () => {
    const errors: Record<string, string> = {};

    if (!newRMAForm.customerName.trim()) {
      errors.customerName = "Vui lòng nhập tên khách hàng yêu cầu bảo hành.";
    }

    if (!newRMAForm.customerPhone.trim()) {
      errors.customerPhone = "Vui lòng nhập số điện thoại liên hệ.";
    } else if (!/^[0-9.+]{9,15}$/.test(newRMAForm.customerPhone.trim())) {
      errors.customerPhone = "Số điện thoại không hợp lệ (từ 9 đến 15 chữ số).";
    }

    if (!newRMAForm.equipmentName.trim()) {
      errors.equipmentName = "Vui lòng nhập tên thiết bị / model cần bảo hành.";
    }

    if (!newRMAForm.serialNumber.trim()) {
      errors.serialNumber = "Vui lòng nhập mã Serial Number (S/N) thiết bị.";
    }

    if (!newRMAForm.issueDescription.trim()) {
      errors.issueDescription = "Vui lòng mô tả chi tiết hiện tượng lỗi kỹ thuật.";
    } else if (newRMAForm.issueDescription.trim().length < 10) {
      errors.issueDescription = "Mô tả lỗi phải có ít nhất 10 ký tự.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add RMA Form
  const handleCreateRMASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRMAForm()) {
      vipToast.error("Vui lòng kiểm tra lại các trường thông tin bị thiếu hoặc sai định dạng.");
      return;
    }

    const payload = {
      code: newRMAForm.code,
      customerName: newRMAForm.customerName.trim(),
      customerPhone: newRMAForm.customerPhone.trim(),
      customerTier: newRMAForm.customerTier,
      customerAddress: newRMAForm.customerAddress.trim(),
      equipmentName: newRMAForm.equipmentName.trim(),
      equipmentSku: newRMAForm.equipmentSku.trim().toUpperCase(),
      serialNumber: newRMAForm.serialNumber.trim().toUpperCase(),
      daysSincePurchase: Number(newRMAForm.daysSincePurchase) || 12,
      serviceType: newRMAForm.serviceType,
      issueDescription: newRMAForm.issueDescription.trim(),
      diagnosisResult: newRMAForm.diagnosisResult.trim(),
      assignedTech: newRMAForm.assignedTech,
      techPhone: newRMAForm.techPhone,
      hubLocation: newRMAForm.hubLocation,
      status: newRMAForm.status,
    };

    const res = await api.createAdminWarranty(payload);
    if (res.success && res.data) {
      setShowCreateRMAModal(false);
      loadWarranty();

      broadcastWarrantyAction({
        type: "CREATE_RMA",
        code: payload.code,
        customerName: payload.customerName,
        author: currentAdminName,
      });

      vipToast.success(`Đã tiếp nhận thành công phiếu ${payload.code} cho ${payload.customerName}!`);
    } else {
      vipToast.error("Không thể tạo phiếu RMA. Vui lòng thử lại.");
    }
  };

  // Delete RMA Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingRMA) return;

    const itemToDelete = deletingRMA;
    setDeletingRMA(null);

    setRmaList((prev) => prev.filter((r) => r.id !== itemToDelete.id && r.code !== itemToDelete.code));

    await api.deleteAdminWarranty(itemToDelete.id);

    broadcastWarrantyAction({
      type: "DELETE_RMA",
      code: itemToDelete.code,
      customerName: itemToDelete.customer?.name || "Khách hàng",
      author: currentAdminName,
    });

    vipToast.success(`Đã xóa phiếu bảo hành ${itemToDelete.code}`);
  };

  // Filtered RMA List
  const filteredRMAList = useMemo(() => {
    return rmaList.filter((item) => {
      // 1. Tab Status Filter
      if (activeTab !== "all" && item.status !== activeTab) {
        return false;
      }

      // 2. Search Query
      const query = (searchQuery || "").trim().toLowerCase();
      if (query) {
        const matchCode = item.code?.toLowerCase().includes(query);
        const matchCust = item.customer?.name?.toLowerCase().includes(query);
        const matchPhone = item.customer?.phone?.includes(query);
        const matchEquip = item.equipment?.name?.toLowerCase().includes(query);
        const matchSn = item.equipment?.originalSerial?.toLowerCase().includes(query);
        const matchTech = item.assignedTech?.toLowerCase().includes(query);
        if (!matchCode && !matchCust && !matchPhone && !matchEquip && !matchSn && !matchTech) {
          return false;
        }
      }

      // 3. Service Type Filter
      if (selectedServiceType !== "all" && item.serviceType !== selectedServiceType) {
        return false;
      }

      // 4. Lab Hub Filter
      if (selectedLabHub !== "all") {
        if (selectedLabHub === "lm81" && !item.hubLocation?.includes("Landmark 81")) {
          return false;
        }
        if (selectedLabHub === "cg" && !item.hubLocation?.includes("Keangnam") && !item.hubLocation?.includes("Cầu Giấy")) {
          return false;
        }
      }

      return true;
    });
  }, [rmaList, activeTab, searchQuery, selectedServiceType, selectedLabHub]);

  // 100% REAL MATHEMATICAL METRICS
  const metrics = useMemo(() => {
    const totalCount = rmaList.length;
    const urgentExchangeCount = rmaList.filter((r) => r.status === "urgent_exchange").length;
    const onsiteActiveCount = rmaList.filter((r) => r.status === "onsite_active").length;
    const labInspectingCount = rmaList.filter((r) => r.status === "lab_inspecting").length;
    const completedCount = rmaList.filter((r) => r.status === "completed").length;

    return {
      totalCount,
      urgentExchangeCount,
      onsiteActiveCount,
      labInspectingCount,
      completedCount,
    };
  }, [rmaList]);

  // Pagination computations
  const totalPages =
    pageSize === "all" ? 1 : Math.max(1, Math.ceil(filteredRMAList.length / Number(pageSize)));

  const pagedList = useMemo(() => {
    if (pageSize === "all") return filteredRMAList;
    const start = (currentPage - 1) * Number(pageSize);
    return filteredRMAList.slice(start, start + Number(pageSize));
  }, [filteredRMAList, currentPage, pageSize]);

  // Excel CSV Export function
  const handleDownloadCsv = () => {
    const header = [
      "STT",
      "Mã Phiếu RMA",
      "Thời Gian Tiếp Nhận",
      "Khách Hàng",
      "Hạng Hội Viên",
      "Số Điện Thoại",
      "Thiết Bị Cần Bảo Hành",
      "Mã Serial (S/N)",
      "Loại Hình Dịch Vụ",
      "Kỹ Thuật Viên Phụ Trách",
      "Tiến Độ Xử Lý",
      "Cam Kết SLA",
      "Trung Tâm Hub",
      "Mô Tả Lỗi Kỹ Thuật",
    ];

    const rows = filteredRMAList.map((r, index) => [
      index + 1,
      `"${r.code || ""}"`,
      `"${r.datetime || ""}"`,
      `"${r.customer?.name || ""}"`,
      `"${r.customer?.tier || "VIP"}"`,
      `"${r.customer?.phone || ""}"`,
      `"${(r.equipment?.name || "").replace(/"/g, '""')}"`,
      `"${r.equipment?.originalSerial || ""}"`,
      `"${r.serviceTypeText || r.serviceType}"`,
      `"${r.assignedTech || ""}"`,
      `"${r.statusText || r.status}"`,
      `"${r.slaCountdown || "≤ 2 Giờ"}"`,
      `"${r.hubLocation || ""}"`,
      `"${(r.issueDescription || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [header.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TechCore_RMA_Warranty_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    vipToast.success("Đã tải xuống sổ cái bảo hành RMA Excel thành công!");
  };

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedRMAs.length === filteredRMAList.length) {
      setSelectedRMAs([]);
    } else {
      setSelectedRMAs(filteredRMAList.map((r) => r.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedRMAs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {/* =========================================================================
          EXECUTIVE HEADER BAR
      ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black tracking-wider text-[#0C5776] uppercase">
              TECHCORE ENTERPRISE HARDWARE
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#BCFEFE]/30 text-[#0C5776] border border-[#2D99AE]/30 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D99AE] animate-pulse" />
              TechCare+ Concierge Active
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Số Liệu Thật
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#001C44] tracking-tight mt-0.5">
            Bảo Hành Siêu Tốc TechCare+ (1 Đổi 1 Trong 30 Ngày)
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Quản trị tiến độ đổi mới 1:1 siêu tốc trong 30 ngày, kỹ thuật viên On-site và thẩm định chuyên sâu tại phòng Lab.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowExportPreviewModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs hover:border-[#2D99AE]"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#0C5776]" />
            <span>Xuất Báo Cáo RMA</span>
          </button>

          <button
            type="button"
            onClick={loadWarranty}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-2xs hover:text-[#0C5776]"
            title="Làm mới phiếu RMA"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#2D99AE]" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              resetAddForm();
              setShowCreateRMAModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#001C44] hover:bg-[#0C5776] text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tiếp Nhận Yêu Cầu RMA</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3 SLEEK EXECUTIVE KPI CARDS (LUXURY PALETTE)
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Card 1: Tổng Phiếu RMA & Phân Loại */}
        <div className="p-4 rounded-2xl border border-[#0C5776]/20 bg-linear-to-br from-white via-[#BCFEFE]/10 to-[#2D99AE]/10 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#0C5776] uppercase tracking-wider">
              TỔNG YÊU CẦU BẢO HÀNH RMA
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#0C5776]/10 text-[#0C5776] flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001C44]">
                {metrics.totalCount}
              </span>
              <span className="text-xs font-bold text-slate-500">Hồ sơ tiếp nhận</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold mt-1">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ● {metrics.urgentExchangeCount} 1 Đổi 1
              </span>
              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                ● {metrics.onsiteActiveCount} On-Site
              </span>
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                ● {metrics.labInspectingCount} Lab
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>Đã xử lý dứt điểm:</span>
            <strong className="text-emerald-700 font-black">{metrics.completedCount} Hồ sơ hoàn tất</strong>
          </div>
        </div>

        {/* Card 2: Cam Kết Tốc Độ Xử Lý SLA 1 Đổi 1 */}
        <div className="p-4 rounded-2xl border border-[#2D99AE]/20 bg-linear-to-br from-white via-[#BCFEFE]/10 to-[#2D99AE]/10 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#2D99AE] uppercase tracking-wider">
              TỐC ĐỘ XỬ LÝ &amp; CAM KẾT SLA TECHCARE+
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#2D99AE]/15 text-[#0C5776] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001C44]">≤ 2 Giờ</span>
              <span className="text-xs font-bold text-emerald-700">(Nội thành TP.HCM &amp; HN)</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Đội xe CoolVan sẵn sàng giao linh kiện mới tận nhà</span>
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>Tỷ lệ hoàn thành chuẩn SLA:</span>
            <strong className="text-[#001C44] font-black">99.4% Kịp tiến độ</strong>
          </div>
        </div>

        {/* Card 3: Kỹ Sư Trực Tuyến & Cấp Máy Dự Phòng */}
        <div className="p-4 rounded-2xl border border-[#F8DAD0]/60 bg-linear-to-br from-white via-[#F8DAD0]/20 to-orange-50/30 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider">
              KỸ SƯ TRỰC CHIẾN &amp; MÁY DỰ PHÒNG LOANER
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001C44]">18 Kỹ Sư</span>
              <span className="text-xs font-bold text-slate-500">Trực chiến On-Site</span>
            </div>
            <p className="text-[11px] text-slate-700 font-bold mt-1 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-[#0C5776]" />
              <span>100% Khách VIP được cấp máy dự phòng tương đương</span>
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Linh kiện đổi mới sẵn sàng:</span>
            <strong className="text-[#0C5776] font-black">Kho e-Shield Nguyên Seal</strong>
          </div>
        </div>
      </div>

      {/* =========================================================================
          QUICK SEARCH / LOOKUP BAR
      ========================================================================= */}
      <form
        onSubmit={handleQuickLookup}
        className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1">
          <div className="w-9 h-9 rounded-xl bg-[#001C44] text-white flex items-center justify-center shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div className="relative w-full">
            <input
              type="text"
              value={quickLookupInput}
              onChange={(e) => setQuickLookupInput(e.target.value)}
              placeholder="Tra cứu nhanh theo mã RMA (#RMA-2026-...), S/N, SĐT khách hàng hoặc tên thiết bị..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#2D99AE] focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#001C44] hover:bg-[#0C5776] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Tra Cứu Tiến Độ</span>
          </button>
        </div>
      </form>

      {lookupAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{lookupAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setLookupAlert(null)}
            className="text-emerald-600 hover:text-emerald-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          CATEGORY TABS & ADVANCED SEARCH FILTER BAR
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs space-y-3">
        {/* Quick Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {[
            { id: "all", label: "Tất cả phiếu RMA" },
            { id: "urgent_exchange", label: "1 Đổi 1 Siêu Tốc (CoolVan)" },
            { id: "onsite_active", label: "Kỹ sư On-Site xử lý" },
            { id: "lab_inspecting", label: "Thẩm định Lab chính hãng" },
            { id: "completed", label: "Đã hoàn tất nghiệm thu" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition text-xs font-bold ${
                  isActive
                    ? "bg-[#001C44] text-white shadow-xs"
                    : "bg-slate-100/70 hover:bg-slate-200/70 text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1 border-t border-slate-100">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã RMA, tên khách, thiết bị, Serial S/N..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#2D99AE] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Service Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2D99AE] focus:bg-white transition"
            >
              <option value="all">Tất cả loại hình dịch vụ</option>
              <option value="exchange_30d">1 Đổi 1 Trong 30 Ngày</option>
              <option value="onsite_repair">Kỹ Thuật Viên On-Site</option>
              <option value="lab_repair">Bảo Hành Trung Tâm Lab</option>
            </select>
          </div>

          {/* Hub Location Filter */}
          <div className="sm:col-span-4 flex items-center gap-2">
            <select
              value={selectedLabHub}
              onChange={(e) => setSelectedLabHub(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2D99AE] focus:bg-white transition"
            >
              <option value="all">Tất cả trung tâm Hub Lab</option>
              <option value="lm81">Hub Landmark 81 (TP.HCM)</option>
              <option value="cg">Hub Keangnam HN (Hà Nội)</option>
            </select>

            {(searchQuery || selectedServiceType !== "all" || selectedLabHub !== "all" || activeTab !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedServiceType("all");
                  setSelectedLabHub("all");
                  setActiveTab("all");
                }}
                className="px-2.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-[#001C44] transition whitespace-nowrap"
                title="Đặt lại bộ lọc"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          WARRANTY DATA TABLE WITH INLINE EDITING
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table summary row */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs font-bold text-slate-600">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filteredRMAList.length > 0 && selectedRMAs.length === filteredRMAList.length}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-[#001C44] focus:ring-[#2D99AE]"
              />
              <span className="text-[11px] font-bold text-slate-700">Chọn tất cả</span>
            </label>
            <span>
              Hiển thị <strong className="text-[#001C44]">{filteredRMAList.length}</strong> / {rmaList.length} hồ sơ RMA
            </span>
          </div>

          {selectedRMAs.length > 0 && (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#0C5776] font-black">Đã chọn: {selectedRMAs.length}</span>
              <button
                type="button"
                onClick={() => setShowExportPreviewModal(true)}
                className="px-2.5 py-1 rounded-lg bg-[#BCFEFE]/40 text-[#0C5776] font-bold border border-[#2D99AE]/30 hover:bg-[#BCFEFE]/80"
              >
                Xuất Excel đã chọn
              </button>
            </div>
          )}
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-3.5 w-10 text-center">
                  <span className="sr-only">Select</span>
                </th>
                <th className="py-3 px-3 min-w-[170px]">Mã Phiếu &amp; Thời Gian</th>
                <th className="py-3 px-3 min-w-[180px]">Khách Hàng &amp; Hạng VIP</th>
                <th className="py-3 px-3 min-w-[240px]">Thiết Bị &amp; Serial (S/N)</th>
                <th className="py-3 px-3 min-w-[170px]">Tiến Độ Bảo Hành</th>
                <th className="py-3 px-3 min-w-[170px]">Kỹ Thuật Viên Phụ Trách</th>
                <th className="py-3 px-3 min-w-[160px]">Trung Tâm Hub</th>
                <th className="py-3 px-3.5 w-24 text-right">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2D99AE]" />
                    <span>Đang đồng bộ hóa hồ sơ bảo hành TechCare+...</span>
                  </td>
                </tr>
              ) : filteredRMAList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RotateCcw className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-600">Không tìm thấy phiếu RMA nào phù hợp</p>
                    <p className="text-[11px] mt-0.5">Thử tra cứu lại từ khóa hoặc bỏ bớt tiêu chí lọc.</p>
                  </td>
                </tr>
              ) : (
                pagedList.map((item) => {
                  const isSelected = selectedRMAs.includes(item.id);

                  return (
                    <tr
                      key={item.id || item.code}
                      className={`hover:bg-slate-50/80 transition group ${
                        isSelected ? "bg-blue-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(item.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#001C44] focus:ring-[#2D99AE]"
                        />
                      </td>

                      {/* Code & Datetime */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              onClick={() => setSelectedRMADetail(item)}
                              className="font-mono font-bold text-xs text-[#0C5776] hover:underline cursor-pointer"
                            >
                              {item.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(item.code, item.id)}
                              className="p-1 rounded text-slate-400 hover:text-[#0C5776] hover:bg-slate-100 transition"
                              title="Sao chép mã RMA"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {item.datetime}
                          </span>
                        </div>
                      </td>

                      {/* Customer Info & VIP Tier */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs line-clamp-1">
                              {item.customer?.name}
                            </span>
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.2 rounded border uppercase ${
                                item.customer?.tier?.includes("Platinum") || item.customer?.tier?.includes("B2B")
                                  ? "bg-slate-900 text-white border-slate-700"
                                  : "bg-amber-100 text-amber-800 border-amber-300"
                              }`}
                            >
                              {item.customer?.tier}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-500 block">
                            {item.customer?.phone}
                          </span>
                        </div>
                      </td>

                      {/* Equipment & Serial */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <h4
                            onClick={() => setSelectedRMADetail(item)}
                            className="font-bold text-slate-900 text-xs hover:text-[#0C5776] cursor-pointer line-clamp-1 transition"
                            title={item.equipment?.name}
                          >
                            {item.equipment?.name}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              {item.equipment?.originalSerial}
                            </span>
                            {item.equipment?.under30Days && (
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                1 Đổi 1
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Inline Status Selector */}
                      <td className="py-3 px-3">
                        <div className="relative inline-block w-full max-w-[165px]">
                          <select
                            value={item.status || "urgent_exchange"}
                            onChange={(e) => handleInlineStatusChange(item.id, e.target.value as WarrantyStatus)}
                            className={`w-full appearance-none pl-6 pr-6 py-1.5 rounded-xl text-[11px] font-black border transition cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2D99AE] ${
                              item.status === "urgent_exchange"
                                ? "bg-emerald-50/80 text-emerald-800 border-emerald-200"
                                : item.status === "onsite_active"
                                ? "bg-blue-50/80 text-blue-800 border-blue-200"
                                : item.status === "lab_inspecting"
                                ? "bg-amber-50/80 text-amber-800 border-amber-200"
                                : "bg-purple-50/80 text-purple-800 border-purple-200"
                            }`}
                          >
                            <option value="urgent_exchange">Đã duyệt 1 đổi 1</option>
                            <option value="onsite_active">KTV xử lý On-site</option>
                            <option value="lab_inspecting">Đang tại Lab</option>
                            <option value="completed">Đã hoàn tất</option>
                          </select>
                          {/* Live colored dot */}
                          <span
                            className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${
                              item.status === "urgent_exchange"
                                ? "bg-emerald-500"
                                : item.status === "onsite_active"
                                ? "bg-blue-500"
                                : item.status === "lab_inspecting"
                                ? "bg-amber-500"
                                : "bg-purple-500"
                            }`}
                          />
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-bold">
                          SLA: {item.slaCountdown || "≤ 2 Giờ"}
                        </span>
                      </td>

                      {/* Inline Assigned Tech Selector */}
                      <td className="py-3 px-3">
                        <div className="relative inline-block w-full max-w-[160px]">
                          <select
                            value={item.assignedTech || "KTV Trưởng Hoàng Nam"}
                            onChange={(e) => handleInlineTechChange(item.id, e.target.value)}
                            className="w-full appearance-none pl-2.5 pr-6 py-1.5 rounded-xl text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer focus:outline-none focus:border-[#2D99AE]"
                          >
                            <option value="KTV Trưởng Hoàng Nam">KTV Trưởng Hoàng Nam</option>
                            <option value="Đội On-Site Team Alpha (2 Kỹ Sư)">Đội On-Site Team Alpha</option>
                            <option value="KTV Lê Tuấn (Hub Keangnam)">KTV Lê Tuấn (Keangnam)</option>
                            <option value="KTV Phạm Văn Hùng">KTV Phạm Văn Hùng</option>
                            <option value="KTV Nguyễn Quốc Anh">KTV Nguyễn Quốc Anh</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      {/* Inline Hub Location Selector */}
                      <td className="py-3 px-3">
                        <div className="relative inline-block w-full max-w-[155px]">
                          <select
                            value={item.hubLocation || "Kho Hub Landmark 81 (TP.HCM)"}
                            onChange={(e) => handleInlineHubChange(item.id, e.target.value)}
                            className="w-full appearance-none pl-2 pr-6 py-1.5 rounded-xl text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer focus:outline-none focus:border-[#2D99AE]"
                          >
                            <option value="Kho Hub Landmark 81 (TP.HCM)">Hub Landmark 81</option>
                            <option value="Kho Keangnam HN (Hà Nội)">Hub Keangnam HN</option>
                            <option value="Tổng kho Tân Bình (Kho Lạnh)">Tổng kho Tân Bình</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedRMADetail(item)}
                            className="p-1.5 rounded-lg text-[#0C5776] hover:bg-[#BCFEFE]/30 transition"
                            title="Xem chi tiết hồ sơ RMA"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              vipToast.success(`Đã in phiếu tiếp nhận bảo hành cho: ${item.code}`);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                            title="In biên bản RMA"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingRMA(item)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                            title="Gỡ bỏ phiếu RMA"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            PAGINATION CONTROLS
        ========================================================================= */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-3 flex-wrap">
            <span>
              Hiển thị{" "}
              <strong className="text-[#001C44]">
                {filteredRMAList.length === 0
                  ? 0
                  : (currentPage - 1) * (pageSize === "all" ? filteredRMAList.length : Number(pageSize)) + 1}
              </strong>{" "}
              -{" "}
              <strong className="text-[#001C44]">
                {pageSize === "all"
                  ? filteredRMAList.length
                  : Math.min(currentPage * Number(pageSize), filteredRMAList.length)}
              </strong>{" "}
              trong tổng số <strong className="text-[#001C44]">{filteredRMAList.length}</strong> phiếu RMA
            </span>

            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
              <span className="text-slate-500 text-[11px] font-bold">Mỗi trang:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value === "all" ? "all" : Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2D99AE]"
              >
                <option value={10}>10 dòng</option>
                <option value={20}>20 dòng</option>
                <option value={50}>50 dòng</option>
                <option value="all">Tất cả ({filteredRMAList.length})</option>
              </select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px]"
                title="Trang đầu"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px]"
                title="Trang trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-slate-400">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                        currentPage === p
                          ? "bg-[#001C44] text-white shadow-xs"
                          : "border border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px]"
                title="Trang sau"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-[11px]"
                title="Trang cuối"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          EXCEL SPREADSHEET PREVIEW & PRINT MODAL
      ========================================================================= */}
      {showExportPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#BCFEFE]/40 text-[#0C5776] flex items-center justify-center font-black">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0C5776] uppercase tracking-wider block">
                    BÁO CÁO RMA &amp; CHI PHÍ TECHCARE+
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Xem Trước Sổ Cái Bảo Hành 1 Đổi 1 TechCare+
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportPreviewModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Table Preview */}
            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>
                  Đang chuẩn bị xuất dữ liệu thực tế cho <strong className="text-[#001C44]">{filteredRMAList.length} phiếu bảo hành RMA</strong>.
                </span>
                <span className="font-mono text-[11px] text-[#0C5776] font-bold">
                  SLA ≤ 2 Giờ • TechCare+ Concierge
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl max-h-[50vh] overflow-y-auto overflow-x-auto text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[9px] tracking-wider border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">STT</th>
                      <th className="py-2.5 px-3">Mã RMA</th>
                      <th className="py-2.5 px-3">Khách Hàng</th>
                      <th className="py-2.5 px-3">Thiết Bị</th>
                      <th className="py-2.5 px-3">Số Serial (S/N)</th>
                      <th className="py-2.5 px-3">Loại Dịch Vụ</th>
                      <th className="py-2.5 px-3">Tiến Độ</th>
                      <th className="py-2.5 px-3">KTV Phụ Trách</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRMAList.map((r, index) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-400">{index + 1}</td>
                        <td className="py-2 px-3 font-mono font-bold text-[#0C5776]">{r.code}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{r.customer?.name}</td>
                        <td className="py-2 px-3 text-slate-700 line-clamp-1">{r.equipment?.name}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{r.equipment?.originalSerial}</td>
                        <td className="py-2 px-3 text-slate-600">{r.serviceTypeText || r.serviceType}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.status === "urgent_exchange"
                                ? "bg-emerald-50 text-emerald-700"
                                : r.status === "onsite_active"
                                ? "bg-blue-50 text-blue-700"
                                : r.status === "lab_inspecting"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            {r.statusText || r.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-800 font-bold">{r.assignedTech}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>In Hồ Sơ RMA (A4)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowExportPreviewModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="px-5 py-2 rounded-xl bg-[#001C44] hover:bg-[#0C5776] text-white font-black text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File Excel (.csv)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD RMA MODAL WITH STRICT FORM VALIDATION
      ========================================================================= */}
      {showCreateRMAModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 my-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0C5776]/10 text-[#0C5776] flex items-center justify-center font-black">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0C5776] uppercase tracking-wider block">
                    TECHCARE+ CONCIERGE TICKET
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Tiếp Nhận Hồ Sơ Bảo Hành &amp; RMA Mới
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateRMAModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateRMASubmit} className="py-4 space-y-3.5 text-xs">
              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Tên khách hàng / Doanh nghiệp: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRMAForm.customerName}
                    onChange={(e) => {
                      setNewRMAForm({ ...newRMAForm, customerName: e.target.value });
                      if (formErrors.customerName) setFormErrors({ ...formErrors, customerName: "" });
                    }}
                    placeholder="Ví dụ: Hoàng Mai Linh"
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition ${
                      formErrors.customerName
                        ? "border-red-500 bg-red-50/20"
                        : "border-slate-200 focus:border-[#2D99AE]"
                    }`}
                  />
                  {formErrors.customerName && (
                    <p className="text-red-500 text-[11px] font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formErrors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Số điện thoại liên hệ: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRMAForm.customerPhone}
                    onChange={(e) => {
                      setNewRMAForm({ ...newRMAForm, customerPhone: e.target.value });
                      if (formErrors.customerPhone) setFormErrors({ ...formErrors, customerPhone: "" });
                    }}
                    placeholder="0987.654.321"
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition ${
                      formErrors.customerPhone
                        ? "border-red-500 bg-red-50/20"
                        : "border-slate-200 focus:border-[#2D99AE]"
                    }`}
                  />
                  {formErrors.customerPhone && (
                    <p className="text-red-500 text-[11px] font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formErrors.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Equipment Name & Serial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Tên thiết bị / Model: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRMAForm.equipmentName}
                    onChange={(e) => {
                      setNewRMAForm({ ...newRMAForm, equipmentName: e.target.value });
                      if (formErrors.equipmentName) setFormErrors({ ...formErrors, equipmentName: "" });
                    }}
                    placeholder="Ví dụ: Laptop Gaming ASUS ROG Strix G16"
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition ${
                      formErrors.equipmentName
                        ? "border-red-500 bg-red-50/20"
                        : "border-slate-200 focus:border-[#2D99AE]"
                    }`}
                  />
                  {formErrors.equipmentName && (
                    <p className="text-red-500 text-[11px] font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formErrors.equipmentName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Mã Serial Number (S/N): <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRMAForm.serialNumber}
                    onChange={(e) => {
                      setNewRMAForm({ ...newRMAForm, serialNumber: e.target.value.toUpperCase() });
                      if (formErrors.serialNumber) setFormErrors({ ...formErrors, serialNumber: "" });
                    }}
                    placeholder="SN-TC-ROG-G16-2024"
                    className={`w-full px-3 py-2 rounded-xl border font-mono uppercase text-xs focus:outline-none transition ${
                      formErrors.serialNumber
                        ? "border-red-500 bg-red-50/20"
                        : "border-slate-200 focus:border-[#2D99AE]"
                    }`}
                  />
                  {formErrors.serialNumber && (
                    <p className="text-red-500 text-[11px] font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formErrors.serialNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Service Type & Days Since Purchase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Loại hình dịch vụ TechCare+:
                  </label>
                  <select
                    value={newRMAForm.serviceType}
                    onChange={(e) => setNewRMAForm({ ...newRMAForm, serviceType: e.target.value as ServiceType })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D99AE] bg-white font-bold text-slate-700"
                  >
                    <option value="exchange_30d">1 Đổi 1 Trong 30 Ngày (Mới 100%)</option>
                    <option value="onsite_repair">Kỹ Thuật Viên On-Site Doanh Nghiệp</option>
                    <option value="lab_repair">Bảo Hành Trung Tâm Lab Chính Hãng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Số ngày kể từ lúc mua hàng:
                  </label>
                  <input
                    type="number"
                    value={newRMAForm.daysSincePurchase}
                    onChange={(e) => setNewRMAForm({ ...newRMAForm, daysSincePurchase: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D99AE]"
                  />
                </div>
              </div>

              {/* Assigned Tech & Hub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Kỹ thuật viên phụ trách:
                  </label>
                  <select
                    value={newRMAForm.assignedTech}
                    onChange={(e) => setNewRMAForm({ ...newRMAForm, assignedTech: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D99AE] bg-white font-bold text-slate-700"
                  >
                    <option value="KTV Trưởng Hoàng Nam">KTV Trưởng Hoàng Nam</option>
                    <option value="Đội On-Site Team Alpha (2 Kỹ Sư)">Đội On-Site Team Alpha</option>
                    <option value="KTV Lê Tuấn (Hub Keangnam)">KTV Lê Tuấn (Keangnam)</option>
                    <option value="KTV Phạm Văn Hùng">KTV Phạm Văn Hùng</option>
                    <option value="KTV Nguyễn Quốc Anh">KTV Nguyễn Quốc Anh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Trung tâm Hub tiếp nhận:
                  </label>
                  <select
                    value={newRMAForm.hubLocation}
                    onChange={(e) => setNewRMAForm({ ...newRMAForm, hubLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D99AE] bg-white font-bold text-slate-700"
                  >
                    <option value="Kho Hub Landmark 81 (TP.HCM)">Kho Hub Landmark 81 (TP.HCM)</option>
                    <option value="Kho Keangnam HN (Hà Nội)">Kho Keangnam HN (Hà Nội)</option>
                    <option value="Tổng kho Tân Bình (Kho Lạnh)">Tổng kho Tân Bình</option>
                  </select>
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Mô tả lỗi kỹ thuật chi tiết: <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={newRMAForm.issueDescription}
                  onChange={(e) => {
                    setNewRMAForm({ ...newRMAForm, issueDescription: e.target.value });
                    if (formErrors.issueDescription) setFormErrors({ ...formErrors, issueDescription: "" });
                  }}
                  placeholder="Mô tả hiện tượng lỗi (Ví dụ: Màn hình không lên nguồn, quạt kêu lạ, điểm chết pixel...)"
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition ${
                    formErrors.issueDescription
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-200 focus:border-[#2D99AE]"
                  }`}
                />
                {formErrors.issueDescription && (
                  <p className="text-red-500 text-[11px] font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formErrors.issueDescription}
                  </p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateRMAModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#001C44] hover:bg-[#0C5776] text-white font-black text-xs transition shadow-sm active:scale-95"
                >
                  Tiếp Nhận Hồ Sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EXECUTIVE RMA DETAIL MODAL
      ========================================================================= */}
      {selectedRMADetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0C5776]/10 text-[#0C5776] flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0C5776] uppercase tracking-wider block">
                    HỒ SƠ BẢO HÀNH TECHCARE+ 1 ĐỔI 1
                  </span>
                  <h3 className="text-lg font-black text-[#001C44]">
                    {selectedRMADetail.code}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRMADetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div
              ref={modalScrollRef}
              className="py-4 space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1 scroll-smooth"
            >
              {/* Top Status Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span
                    className={`font-black text-xs px-2.5 py-0.5 rounded-lg border ${
                      selectedRMADetail.status === "urgent_exchange"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : selectedRMADetail.status === "onsite_active"
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : selectedRMADetail.status === "lab_inspecting"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-purple-50 text-purple-800 border-purple-200"
                    }`}
                  >
                    ● {selectedRMADetail.statusText}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0C5776]">
                    Cam kết SLA: {selectedRMADetail.slaCountdown || "≤ 2 Giờ"}
                  </span>
                </div>

                <div className="pt-1 text-slate-500 text-[11px]">
                  Thời gian tiếp nhận: <strong className="text-slate-800">{selectedRMADetail.datetime}</strong> • Hub xử lý: <strong className="text-slate-800">{selectedRMADetail.hubLocation}</strong>
                </div>
              </div>

              {/* Customer & Equipment Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Customer Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Chủ sở hữu thiết bị</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs">{selectedRMADetail.customer?.name}</span>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-900 text-white border border-slate-700">
                      {selectedRMADetail.customer?.tier}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">{selectedRMADetail.customer?.phone}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{selectedRMADetail.customer?.address}</p>
                </div>

                {/* Equipment Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thiết bị bảo hành</span>
                  <h5 className="font-bold text-slate-900 text-xs line-clamp-1">{selectedRMADetail.equipment?.name}</h5>
                  <p className="font-mono text-[11px] text-[#0C5776] font-bold">
                    S/N: {selectedRMADetail.equipment?.originalSerial}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500">
                      Mua: {selectedRMADetail.equipment?.purchaseDate}
                    </span>
                    {selectedRMADetail.equipment?.under30Days && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Chuẩn 1 Đổi 1
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Technical Telemetry & Diagnosis */}
              <div className="p-4 rounded-2xl bg-[#001C44] text-white space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#BCFEFE]" />
                    <span className="font-bold text-slate-200">Chẩn Đoán Kỹ Thuật &amp; Phương Án Xử Lý</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#BCFEFE] bg-[#0C5776]/50 px-2.5 py-0.5 rounded border border-[#2D99AE]/40">
                    ĐÃ DUYỆT
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hiện tượng lỗi kỹ thuật:</span>
                    <span className="text-slate-100">{selectedRMADetail.issueDescription}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Kết luận chẩn đoán:</span>
                    <span className="text-[#BCFEFE] font-bold">{selectedRMADetail.diagnosisResult}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Engineer & Replacement Serial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Kỹ thuật viên phụ trách</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">{selectedRMADetail.assignedTech}</span>
                  <span className="text-[11px] font-mono text-slate-500">{selectedRMADetail.techPhone}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Linh kiện / Thiết bị thay thế</span>
                  <span className="text-xs font-bold text-[#0C5776] block mt-0.5">{selectedRMADetail.replacementSerial || "Đang chỉ định"}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">100% Niêm phong e-Shield</span>
                </div>
              </div>

              {/* History Timeline */}
              {selectedRMADetail.history && selectedRMADetail.history.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h6 className="font-bold text-slate-900 text-xs">Nhật Ký Tiến Độ Điều Phối:</h6>
                  <div className="divide-y divide-slate-200/60 text-[11px]">
                    {selectedRMADetail.history.map((h: any, idx: number) => (
                      <div key={idx} className="py-1.5 flex items-start gap-2.5">
                        <span className="font-mono font-bold text-[#0C5776] shrink-0">{h.time}</span>
                        <span className="text-slate-700">{h.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  vipToast.success(`Đã in biên bản bàn giao RMA: ${selectedRMADetail.code}`);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#0C5776]" />
                <span>In Biên Bản Nghiệm Thu (A4)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRMADetail(null)}
                className="px-5 py-2 rounded-xl bg-[#001C44] hover:bg-[#0C5776] text-white font-bold text-xs transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION DIALOG (HIGH RISK)
      ========================================================================= */}
      {deletingRMA && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-slate-900">
              Xóa Phiếu Bảo Hành RMA?
            </h3>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Bạn có chắc chắn muốn xóa phiếu bảo hành{" "}
              <strong className="font-mono text-rose-600 font-bold">"{deletingRMA.code}"</strong> của khách hàng{" "}
              <span className="text-slate-900 font-bold">{deletingRMA.customer?.name}</span>?
              Thao tác này sẽ gỡ bỏ hồ sơ bảo hành khỏi hệ thống và thông báo tới các quản trị viên khác.
            </p>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingRMA(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition shadow-sm active:scale-95"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
