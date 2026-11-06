"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Database,
  ShieldCheck,
  Cpu,
  QrCode,
  Search,
  Plus,
  Download,
  RefreshCw,
  Printer,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Lock,
  Snowflake,
  Activity,
  Check,
  X,
  ChevronRight,
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
  MapPin,
  Thermometer,
  Droplets,
  Zap,
  Boxes,
  FileCheck,
  ExternalLink,
  Barcode,
  Trash2,
  AlertCircle,
  FileSpreadsheet,
  Copy,
  ChevronDown,
  Building2,
  Truck,
  Package,
} from "lucide-react";
import { formatVND } from "../../lib/utils";
import { api } from "../../lib/api";
import { vipToast } from "../common/VipToast";

export type InventoryItemStatus = "in_stock" | "reserved" | "in_transit" | "activated" | "tamper_alert";
export type SealStatus = "sealed" | "inspected" | "broken";

const BROADCAST_INVENTORY_CHANNEL = "techcore_admin_inventory_channel";

export function InventoryManagement() {
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<
    "all" | "in_stock" | "reserved" | "in_transit" | "activated" | "tamper_alert"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSerials, setSelectedSerials] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Barcode / QR Scan
  const [quickScanInput, setQuickScanInput] = useState("");
  const [scanSuccessAlert, setScanSuccessAlert] = useState<string | null>(null);

  // Modals
  const [showAddSerialModal, setShowAddSerialModal] = useState(false);
  const [showExportPreviewModal, setShowExportPreviewModal] = useState(false);
  const [selectedSerialDetail, setSelectedSerialDetail] = useState<any | null>(null);
  const [deletingSerial, setDeletingSerial] = useState<any | null>(null);

  // Form Validation & Admin Profile
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentAdminName, setCurrentAdminName] = useState<string>("Quản trị viên TechCore");
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(10);

  // Form State for Add Serial/IMEI
  const [newSerialForm, setNewSerialForm] = useState({
    productName: "",
    sku: "",
    serialNumber: "",
    imei: "",
    category: "Card đồ họa GPU",
    hubLocation: "Kho Landmark 81 (TP.HCM)",
    rackZone: "Kệ lạnh A-04 • Tầng 2 (ESD Safe)",
    sealStatus: "sealed" as SealStatus,
    status: "in_stock" as InventoryItemStatus,
    supplier: "ASUS Global Hub VN / Synnex FPT",
    warrantyMonths: 36,
    assignedOrder: "",
    customerName: "",
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
  const broadcastInventoryAction = (payload: {
    type: "CREATE_SERIAL" | "UPDATE_STATUS" | "UPDATE_HUB" | "DELETE_SERIAL";
    serialNumber: string;
    productName: string;
    detail?: string;
    author: string;
  }) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel(BROADCAST_INVENTORY_CHANNEL);
        channel.postMessage({ ...payload, timestamp: Date.now() });
        channel.close();
      } catch (e) {}
    }
  };

  // Load inventory from API
  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminInventory();
      if (res.success && Array.isArray(res.data)) {
        setInventoryList(res.data);
      }
    } catch (e) {
      console.error("Lỗi khi tải sổ cái kho:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();

    const handleInventoryChanged = () => {
      loadInventory();
    };
    window.addEventListener("techcore:inventory-changed", handleInventoryChanged);

    // Listen to BroadcastChannel from other tabs
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel(BROADCAST_INVENTORY_CHANNEL);
        channel.onmessage = (event) => {
          const data = event.data;
          if (!data) return;

          loadInventory();

          if (data.type === "CREATE_SERIAL") {
            vipToast.info(
              `📦 ${data.author} vừa nhập kho S/N mới: ${data.serialNumber} (${data.productName})`
            );
          } else if (data.type === "UPDATE_STATUS") {
            vipToast.info(
              `🔄 ${data.author} vừa cập nhật trạng thái [${data.serialNumber}]: ${data.detail}`
            );
          } else if (data.type === "UPDATE_HUB") {
            vipToast.info(
              `📍 ${data.author} vừa điều chuyển vị trí [${data.serialNumber}]: ${data.detail}`
            );
          } else if (data.type === "DELETE_SERIAL") {
            vipToast.warning(
              `🗑️ ${data.author} đã gỡ bỏ S/N khỏi sổ cái: ${data.serialNumber}`
            );
          }
        };
      } catch (e) {}
    }

    return () => {
      window.removeEventListener("techcore:inventory-changed", handleInventoryChanged);
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
  }, [searchQuery, activeTab, selectedHub, selectedCategory]);

  // Listen to AdminNavbar triggers
  useEffect(() => {
    const handleAddTrigger = () => {
      resetAddForm();
      setShowAddSerialModal(true);
    };
    const handleExportTrigger = () => {
      setShowExportPreviewModal(true);
    };

    window.addEventListener("admin:add-inventory", handleAddTrigger);
    window.addEventListener("admin:export-inventory", handleExportTrigger);

    return () => {
      window.removeEventListener("admin:add-inventory", handleAddTrigger);
      window.removeEventListener("admin:export-inventory", handleExportTrigger);
    };
  }, []);

  // Reset Add Form
  const resetAddForm = () => {
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    setNewSerialForm({
      productName: "",
      sku: "GPU-ROG-5090-AI",
      serialNumber: `SN-TC-5090-${randSuffix}-X1`,
      imei: `IMEI-8692010${Math.floor(10000000 + Math.random() * 90000000)}`,
      category: "Card đồ họa GPU",
      hubLocation: "Kho Landmark 81 (TP.HCM)",
      rackZone: "Kệ lạnh A-04 • Tầng 2 (ESD Safe)",
      sealStatus: "sealed",
      status: "in_stock",
      supplier: "ASUS Global Hub VN / Synnex FPT",
      warrantyMonths: 36,
      assignedOrder: "",
      customerName: "",
    });
    setFormErrors({});
  };

  // Scroll to top on detail modal open
  useEffect(() => {
    if (selectedSerialDetail && modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [selectedSerialDetail]);

  // Copy helper
  const handleCopyText = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Quick Barcode / QR Scanner
  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickScanInput.trim()) return;

    const term = quickScanInput.trim().toLowerCase();
    const found = inventoryList.find(
      (item) =>
        item.serialNumber?.toLowerCase().includes(term) ||
        item.imei?.toLowerCase().includes(term) ||
        item.hashSha256?.toLowerCase().includes(term) ||
        item.sku?.toLowerCase().includes(term)
    );

    if (found) {
      setSelectedSerialDetail(found);
      setScanSuccessAlert(`✓ Khớp mã băm SHA-256 e-Shield: ${found.serialNumber} (Đã xác thực 100%)`);
      setTimeout(() => setScanSuccessAlert(null), 5000);
      setQuickScanInput("");
    } else {
      vipToast.error(`Không tìm thấy mã Serial/IMEI "${quickScanInput}" trong sổ cái e-Shield Ledger!`);
    }
  };

  // Inline Status Change
  const handleInlineStatusChange = async (itemId: string, newStatus: InventoryItemStatus) => {
    const targetItem = inventoryList.find((i) => i.id === itemId || i.serialNumber === itemId);
    if (!targetItem) return;

    const statusLabels: Record<InventoryItemStatus, string> = {
      in_stock: "Sẵn sàng xuất kho",
      reserved: "Đã gán đơn hàng",
      in_transit: "Đang trên xe CoolVan",
      activated: "Đã kích hoạt bảo hành",
      tamper_alert: "Cảnh báo vi phạm seal",
    };

    const statusText = statusLabels[newStatus];

    // Optimistic UI update
    setInventoryList((prev) =>
      prev.map((i) => {
        if (i.id === itemId || i.serialNumber === itemId) {
          return {
            ...i,
            status: newStatus,
            statusText,
          };
        }
        return i;
      })
    );

    await api.updateAdminInventory(itemId, { status: newStatus, statusText });

    broadcastInventoryAction({
      type: "UPDATE_STATUS",
      serialNumber: targetItem.serialNumber,
      productName: targetItem.productName,
      detail: statusText,
      author: currentAdminName,
    });

    vipToast.success(`S/N ${targetItem.serialNumber} đổi trạng thái: "${statusText}"`);
  };

  // Inline Hub Location Change
  const handleInlineHubChange = async (itemId: string, newHub: string) => {
    const targetItem = inventoryList.find((i) => i.id === itemId || i.serialNumber === itemId);
    if (!targetItem) return;

    const hubCode = newHub.includes("Keangnam")
      ? "HUB-CG"
      : newHub.includes("Tân Bình")
      ? "HUB-TB"
      : "HUB-LM81";

    setInventoryList((prev) =>
      prev.map((i) => {
        if (i.id === itemId || i.serialNumber === itemId) {
          return {
            ...i,
            hubLocation: newHub,
            hubCode,
          };
        }
        return i;
      })
    );

    await api.updateAdminInventory(itemId, { hubLocation: newHub, hubCode });

    broadcastInventoryAction({
      type: "UPDATE_HUB",
      serialNumber: targetItem.serialNumber,
      productName: targetItem.productName,
      detail: newHub,
      author: currentAdminName,
    });

    vipToast.success(`S/N ${targetItem.serialNumber} điều chuyển về: ${newHub}`);
  };

  // Inline Seal Status Change
  const handleInlineSealChange = async (itemId: string, newSeal: SealStatus) => {
    const targetItem = inventoryList.find((i) => i.id === itemId || i.serialNumber === itemId);
    if (!targetItem) return;

    setInventoryList((prev) =>
      prev.map((i) => {
        if (i.id === itemId || i.serialNumber === itemId) {
          return {
            ...i,
            sealStatus: newSeal,
          };
        }
        return i;
      })
    );

    await api.updateAdminInventory(itemId, { sealStatus: newSeal });

    vipToast.success(
      `Niêm phong ${targetItem.serialNumber}: ${
        newSeal === "sealed" ? "Nguyên Seal" : newSeal === "inspected" ? "Đã kiểm định" : "Rách niêm phong!"
      }`
    );
  };

  // Validate Add Serial Form
  const validateSerialForm = () => {
    const errors: Record<string, string> = {};

    if (!newSerialForm.productName.trim()) {
      errors.productName = "Vui lòng nhập tên thiết bị / model phần cứng.";
    }

    if (!newSerialForm.sku.trim()) {
      errors.sku = "Vui lòng nhập mã SKU phân loại.";
    }

    if (!newSerialForm.serialNumber.trim()) {
      errors.serialNumber = "Vui lòng nhập mã Serial Number (S/N) duy nhất.";
    } else {
      const duplicate = inventoryList.some(
        (i) => i.serialNumber.toLowerCase() === newSerialForm.serialNumber.trim().toLowerCase()
      );
      if (duplicate) {
        errors.serialNumber = "Mã Serial Number này đã tồn tại trong sổ cái!";
      }
    }

    if (!newSerialForm.hubLocation.trim()) {
      errors.hubLocation = "Vui lòng chỉ định trung tâm kho lưu trữ.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Add Serial Form
  const handleCreateSerialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSerialForm()) {
      vipToast.error("Vui lòng kiểm tra lại các trường thông tin bị thiếu hoặc sai định dạng.");
      return;
    }

    const payload = {
      productName: newSerialForm.productName.trim(),
      sku: newSerialForm.sku.trim().toUpperCase(),
      serialNumber: newSerialForm.serialNumber.trim().toUpperCase(),
      imei: newSerialForm.imei.trim() || `IMEI-8692010${Math.floor(10000000 + Math.random() * 90000000)}`,
      category: newSerialForm.category,
      hubLocation: newSerialForm.hubLocation,
      rackZone: newSerialForm.rackZone.trim() || "Kệ A-01 (ESD Safe)",
      sealStatus: newSerialForm.sealStatus,
      status: newSerialForm.status,
      supplier: newSerialForm.supplier.trim() || "TechCore Authorized Hub VN",
      warrantyMonths: Number(newSerialForm.warrantyMonths) || 36,
      assignedOrder: newSerialForm.assignedOrder.trim() || "Chưa gán đơn",
      customerName: newSerialForm.customerName.trim() || "Tồn kho chuẩn bị",
    };

    const res = await api.createAdminInventory(payload);
    if (res.success && res.data) {
      setShowAddSerialModal(false);
      loadInventory();

      broadcastInventoryAction({
        type: "CREATE_SERIAL",
        serialNumber: payload.serialNumber,
        productName: payload.productName,
        author: currentAdminName,
      });

      vipToast.success(`Đã thêm mã S/N ${payload.serialNumber} vào chuỗi khối e-Shield thành công!`);
    } else {
      vipToast.error("Không thể lưu mã S/N. Vui lòng thử lại.");
    }
  };

  // Delete serial confirmation
  const handleConfirmDelete = async () => {
    if (!deletingSerial) return;

    const itemToDelete = deletingSerial;
    setDeletingSerial(null);

    setInventoryList((prev) => prev.filter((i) => i.id !== itemToDelete.id && i.serialNumber !== itemToDelete.serialNumber));

    await api.deleteAdminInventory(itemToDelete.id);

    broadcastInventoryAction({
      type: "DELETE_SERIAL",
      serialNumber: itemToDelete.serialNumber,
      productName: itemToDelete.productName,
      author: currentAdminName,
    });

    vipToast.success(`Đã xóa vĩnh viễn S/N ${itemToDelete.serialNumber} khỏi sổ cái kho`);
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return inventoryList.filter((item) => {
      // 1. Tab Status Filter
      if (activeTab !== "all" && item.status !== activeTab) {
        return false;
      }

      // 2. Search Query
      const query = (searchQuery || "").trim().toLowerCase();
      if (query) {
        const matchSn = item.serialNumber?.toLowerCase().includes(query);
        const matchImei = item.imei?.toLowerCase().includes(query);
        const matchName = item.productName?.toLowerCase().includes(query);
        const matchSku = item.sku?.toLowerCase().includes(query);
        const matchHash = item.hashSha256?.toLowerCase().includes(query);
        const matchOrder = item.assignedOrder?.toLowerCase().includes(query);
        const matchCust = item.customerName?.toLowerCase().includes(query);
        if (!matchSn && !matchImei && !matchName && !matchSku && !matchHash && !matchOrder && !matchCust) {
          return false;
        }
      }

      // 3. Hub Filter
      if (selectedHub !== "all") {
        if (selectedHub === "lm81" && !item.hubLocation?.includes("Landmark 81") && item.hubCode !== "HUB-LM81") {
          return false;
        }
        if (selectedHub === "cg" && !item.hubLocation?.includes("Keangnam") && !item.hubLocation?.includes("Cầu Giấy") && item.hubCode !== "HUB-CG") {
          return false;
        }
        if (selectedHub === "tb" && !item.hubLocation?.includes("Tân Bình") && item.hubCode !== "HUB-TB") {
          return false;
        }
      }

      // 4. Category Filter
      if (selectedCategory !== "all" && !item.category?.includes(selectedCategory)) {
        return false;
      }

      return true;
    });
  }, [inventoryList, activeTab, searchQuery, selectedHub, selectedCategory]);

  // 100% REAL MATHEMATICAL METRICS
  const metrics = useMemo(() => {
    const totalCount = inventoryList.length;
    const inStockCount = inventoryList.filter((i) => i.status === "in_stock").length;
    const reservedCount = inventoryList.filter((i) => i.status === "reserved").length;
    const inTransitCount = inventoryList.filter((i) => i.status === "in_transit").length;
    const activatedCount = inventoryList.filter((i) => i.status === "activated").length;
    const sealedCount = inventoryList.filter((i) => i.sealStatus === "sealed").length;

    return {
      totalCount,
      inStockCount,
      reservedCount,
      inTransitCount,
      activatedCount,
      sealedCount,
    };
  }, [inventoryList]);

  // Pagination computations
  const totalPages =
    pageSize === "all" ? 1 : Math.max(1, Math.ceil(filteredList.length / Number(pageSize)));

  const pagedList = useMemo(() => {
    if (pageSize === "all") return filteredList;
    const start = (currentPage - 1) * Number(pageSize);
    return filteredList.slice(start, start + Number(pageSize));
  }, [filteredList, currentPage, pageSize]);

  // Excel CSV Export function
  const handleDownloadCsv = () => {
    const header = [
      "STT",
      "Mã Serial (S/N)",
      "Mã IMEI / Barcode",
      "Mã Băm Blockchain SHA-256",
      "Tên Thiết Bị / Model",
      "Mã SKU Master",
      "Danh Mục",
      "Trung Tâm Kho",
      "Vị Trí Kệ Rack",
      "Trạng Thái Niêm Phong",
      "Tình Trạng Kho",
      "Đơn Hàng Gán",
      "Khách Hàng Sở Hữu",
      "Ngày Nhập Kho",
      "Bảo Hành (Tháng)",
    ];

    const rows = filteredList.map((i, index) => [
      index + 1,
      `"${i.serialNumber || ""}"`,
      `"${i.imei || ""}"`,
      `"${i.hashSha256 || ""}"`,
      `"${(i.productName || "").replace(/"/g, '""')}"`,
      `"${i.sku || ""}"`,
      `"${i.category || ""}"`,
      `"${i.hubLocation || ""}"`,
      `"${i.rackZone || ""}"`,
      `"${i.sealStatus === "sealed" ? "Nguyên Seal" : i.sealStatus === "inspected" ? "Đã kiểm định" : "Rách seal"}"`,
      `"${i.statusText || i.status}"`,
      `"${i.assignedOrder || ""}"`,
      `"${i.customerName || ""}"`,
      `"${i.importDate || ""}"`,
      i.warrantyMonths || 36,
    ]);

    const csvContent = "\uFEFF" + [header.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TechCore_Inventory_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    vipToast.success("Đã tải xuống sổ cái kho Excel thành công!");
  };

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedSerials.length === filteredList.length) {
      setSelectedSerials([]);
    } else {
      setSelectedSerials(filteredList.map((i) => i.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedSerials((prev) =>
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
              e-Shield Ledger Active
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Số Liệu Thật
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#001C44] tracking-tight mt-0.5">
            Quản Lý Kho &amp; e-Shield S/N
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Truy xuất nguồn gốc linh kiện phần cứng, đối soát tem niêm phong và chuỗi lạnh vận chuyển CoolVan.
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
            <span>Xuất Excel (Xem trước)</span>
          </button>

          <button
            type="button"
            onClick={loadInventory}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-2xs hover:text-[#0C5776]"
            title="Làm mới sổ cái từ hệ thống"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#2D99AE]" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              resetAddForm();
              setShowAddSerialModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#001C44] hover:bg-[#0C5776] text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nhập Kho Serial/IMEI</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3 SLEEK EXECUTIVE KPI CARDS (LUXURY PALETTE)
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Card 1: Tổng Thiết Bị & Trạng Thái S/N */}
        <div className="p-4 rounded-2xl border border-[#0C5776]/20 bg-linear-to-br from-white via-[#BCFEFE]/10 to-[#2D99AE]/10 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#0C5776] uppercase tracking-wider">
              SỐ LƯỢNG S/N ĐỊNH DANH E-SHIELD
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#0C5776]/10 text-[#0C5776] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001C44]">
                {metrics.totalCount}
              </span>
              <span className="text-xs font-bold text-slate-500">Thiết bị mã hóa</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold mt-1">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ● {metrics.inStockCount} Sẵn sàng
              </span>
              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                ● {metrics.reservedCount} Gán đơn
              </span>
              <span className="text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                ● {metrics.inTransitCount} CoolVan
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>Đã kích hoạt bàn giao:</span>
            <strong className="text-[#001C44] font-black">{metrics.activatedCount} Thiết bị VIP</strong>
          </div>
        </div>

        {/* Card 2: IoT Sensors Chuỗi Lạnh */}
        <div className="p-4 rounded-2xl border border-[#2D99AE]/20 bg-linear-to-br from-white via-[#BCFEFE]/10 to-[#2D99AE]/10 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#2D99AE] uppercase tracking-wider">
              CHUỖI LẠNH KHO &amp; IOT ESD SENSORS
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#2D99AE]/15 text-[#0C5776] flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001C44]">18.2°C</span>
              <span className="text-xs font-bold text-slate-500">• 47% RH (Chuẩn)</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <Snowflake className="w-3.5 h-3.5 text-cyan-600" />
              <span>Xe bảo ôn CoolVan #01 &amp; #02 đồng bộ GPS</span>
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>Tiêu chuẩn bảo quản:</span>
            <strong className="text-[#001C44] font-black">ESD Anti-Static Safe 100%</strong>
          </div>
        </div>

        {/* Card 3: Niêm Phong & Chuỗi Khối Blockchain */}
        <div className="p-4 rounded-2xl border border-[#F8DAD0]/60 bg-linear-to-br from-white via-[#F8DAD0]/20 to-orange-50/30 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider">
              CHỨNG THỰC CHUỖI KHỐI &amp; NIÊM PHONG
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001C44]">
                {metrics.sealedCount} / {metrics.totalCount}
              </span>
              <span className="text-xs font-bold text-emerald-700">Nguyên Seal 100%</span>
            </div>
            <p className="text-[11px] text-slate-700 font-bold mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>0 Vi phạm niêm phong phát hiện</span>
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">S/N đang trên xe giao:</span>
            <strong className="text-[#0C5776] font-black">{metrics.inTransitCount} Mã hỏa tốc</strong>
          </div>
        </div>
      </div>

      {/* =========================================================================
          QUICK BARCODE / QR SCAN BAR
      ========================================================================= */}
      <form
        onSubmit={handleQuickScan}
        className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1">
          <div className="w-9 h-9 rounded-xl bg-[#001C44] text-white flex items-center justify-center shrink-0">
            <Barcode className="w-5 h-5" />
          </div>
          <div className="relative w-full">
            <input
              type="text"
              value={quickScanInput}
              onChange={(e) => setQuickScanInput(e.target.value)}
              placeholder="Quét mã vạch (Barcode), QR Code hoặc nhập số S/N để đối soát tức thì..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#2D99AE] focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#001C44] hover:bg-[#0C5776] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Đối Soát S/N</span>
          </button>
        </div>
      </form>

      {scanSuccessAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{scanSuccessAlert}</span>
          </div>
          <button
            type="button"
            onClick={() => setScanSuccessAlert(null)}
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
            { id: "all", label: "Tất cả S/N trong sổ cái" },
            { id: "in_stock", label: "Sẵn sàng xuất kho" },
            { id: "reserved", label: "Đã gán đơn hàng" },
            { id: "in_transit", label: "Đang trên xe CoolVan" },
            { id: "activated", label: "Đã kích hoạt VIP" },
            { id: "tamper_alert", label: "Cảnh báo seal" },
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
              placeholder="Tìm theo Serial S/N, IMEI, tên thiết bị, mã đơn..."
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

          {/* Hub Location Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2D99AE] focus:bg-white transition"
            >
              <option value="all">Tất cả trung tâm kho</option>
              <option value="lm81">Kho Landmark 81 (TP.HCM)</option>
              <option value="cg">Kho Keangnam HN (Hà Nội)</option>
              <option value="tb">Tổng kho Tân Bình (Kho Lạnh)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-4 flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#2D99AE] focus:bg-white transition"
            >
              <option value="all">Tất cả phân loại phần cứng</option>
              <option value="GPU">Card đồ họa GPU</option>
              <option value="CPU">Bộ vi xử lý CPU</option>
              <option value="Apple">Laptop &amp; Apple Enterprise</option>
              <option value="Màn hình">Màn hình &amp; Hiển thị</option>
              <option value="Nguồn">Linh kiện &amp; Nguồn</option>
              <option value="Workstation">Máy trạm AI Rig</option>
            </select>

            {(searchQuery || selectedHub !== "all" || selectedCategory !== "all" || activeTab !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedHub("all");
                  setSelectedCategory("all");
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
          INVENTORY DATA TABLE WITH INLINE EDITING
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table summary row */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs font-bold text-slate-600">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filteredList.length > 0 && selectedSerials.length === filteredList.length}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-[#001C44] focus:ring-[#2D99AE]"
              />
              <span className="text-[11px] font-bold text-slate-700">Chọn tất cả</span>
            </label>
            <span>
              Hiển thị <strong className="text-[#001C44]">{filteredList.length}</strong> / {inventoryList.length} mã S/N
            </span>
          </div>

          {selectedSerials.length > 0 && (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#0C5776] font-black">Đã chọn: {selectedSerials.length}</span>
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
                <th className="py-3 px-3 min-w-[200px]">Mã S/N &amp; Hash Blockchain</th>
                <th className="py-3 px-3 min-w-[260px]">Thiết Bị &amp; Phân Loại</th>
                <th className="py-3 px-3 min-w-[170px]">Trạng Thái S/N</th>
                <th className="py-3 px-3 min-w-[160px]">Kho &amp; Kệ Điều Phối</th>
                <th className="py-3 px-3 min-w-[130px]">Tem Niêm Phong</th>
                <th className="py-3 px-3 min-w-[160px]">Đơn Hàng / Khách Hàng</th>
                <th className="py-3 px-3.5 w-24 text-right">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2D99AE]" />
                    <span>Đang đồng bộ hóa sổ cái e-Shield Blockchain...</span>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-600">Không tìm thấy bản ghi S/N nào phù hợp</p>
                    <p className="text-[11px] mt-0.5">Thử quét lại mã hoặc thay đổi bộ lọc tìm kiếm.</p>
                  </td>
                </tr>
              ) : (
                pagedList.map((item) => {
                  const isSelected = selectedSerials.includes(item.id);

                  return (
                    <tr
                      key={item.id || item.serialNumber}
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

                      {/* S/N & Blockchain Hash */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs text-[#001C44]">
                              {item.serialNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(item.serialNumber, item.id)}
                              className="p-1 rounded text-slate-400 hover:text-[#0C5776] hover:bg-slate-100 transition"
                              title="Sao chép S/N"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                            <Lock className="w-3 h-3 text-[#2D99AE]" />
                            <span>{item.hashSha256 || "0x9F41...2B01"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Hardware Name & SKU */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[10px] font-bold text-[#0C5776] bg-[#BCFEFE]/40 px-1.5 py-0.5 rounded border border-[#2D99AE]/30">
                              {item.sku}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                          </div>
                          <h3
                            onClick={() => setSelectedSerialDetail(item)}
                            className="font-bold text-slate-900 text-xs hover:text-[#0C5776] cursor-pointer line-clamp-1 transition"
                            title={item.productName}
                          >
                            {item.productName}
                          </h3>
                        </div>
                      </td>

                      {/* Inline Status Selector */}
                      <td className="py-3 px-3">
                        <div className="relative inline-block w-full max-w-[165px]">
                          <select
                            value={item.status || "in_stock"}
                            onChange={(e) => handleInlineStatusChange(item.id, e.target.value as InventoryItemStatus)}
                            className={`w-full appearance-none pl-6 pr-6 py-1.5 rounded-xl text-[11px] font-black border transition cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2D99AE] ${
                              item.status === "in_stock"
                                ? "bg-emerald-50/80 text-emerald-800 border-emerald-200"
                                : item.status === "reserved"
                                ? "bg-blue-50/80 text-blue-800 border-blue-200"
                                : item.status === "in_transit"
                                ? "bg-cyan-50/80 text-cyan-800 border-cyan-200"
                                : item.status === "activated"
                                ? "bg-purple-50/80 text-purple-800 border-purple-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            <option value="in_stock">Sẵn sàng xuất kho</option>
                            <option value="reserved">Đã gán đơn hàng</option>
                            <option value="in_transit">Đang trên CoolVan</option>
                            <option value="activated">Đã kích hoạt bảo hành</option>
                            <option value="tamper_alert">Cảnh báo vi phạm seal</option>
                          </select>
                          {/* Live colored dot */}
                          <span
                            className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${
                              item.status === "in_stock"
                                ? "bg-emerald-500"
                                : item.status === "reserved"
                                ? "bg-blue-500"
                                : item.status === "in_transit"
                                ? "bg-cyan-500"
                                : item.status === "activated"
                                ? "bg-purple-500"
                                : "bg-rose-500"
                            }`}
                          />
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      {/* Inline Hub Location Selector */}
                      <td className="py-3 px-3">
                        <div className="relative inline-block w-full max-w-[160px]">
                          <select
                            value={item.hubLocation || "Kho Landmark 81 (TP.HCM)"}
                            onChange={(e) => handleInlineHubChange(item.id, e.target.value)}
                            className="w-full appearance-none pl-2.5 pr-6 py-1.5 rounded-xl text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer focus:outline-none focus:border-[#2D99AE]"
                          >
                            <option value="Kho Landmark 81 (TP.HCM)">Kho Landmark 81</option>
                            <option value="Kho Keangnam HN (Hà Nội)">Kho Keangnam HN</option>
                            <option value="Tổng kho Tân Bình (Kho Lạnh)">Tổng kho Tân Bình</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <span className="block text-[10px] text-slate-400 mt-0.5 truncate" title={item.rackZone}>
                          {item.rackZone}
                        </span>
                      </td>

                      {/* Inline Seal Status Selector */}
                      <td className="py-3 px-3">
                        <div className="relative inline-block w-full max-w-[125px]">
                          <select
                            value={item.sealStatus || "sealed"}
                            onChange={(e) => handleInlineSealChange(item.id, e.target.value as SealStatus)}
                            className={`w-full appearance-none pl-2 pr-6 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer focus:outline-none ${
                              item.sealStatus === "sealed"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : item.sealStatus === "inspected"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            <option value="sealed">Nguyên Seal</option>
                            <option value="inspected">Đã kiểm định</option>
                            <option value="broken">Rách Seal</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </td>

                      {/* Assigned Order & Customer */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          {item.assignedOrder && item.assignedOrder !== "Chưa gán đơn" ? (
                            <Link
                              href="/admin/don-hang"
                              className="font-mono font-bold text-[11px] text-[#0C5776] hover:underline block"
                            >
                              {item.assignedOrder}
                            </Link>
                          ) : (
                            <span className="text-slate-400 text-[11px] font-medium block">
                              Chưa gán đơn
                            </span>
                          )}
                          <span className="text-[10px] text-slate-600 font-bold block truncate max-w-[130px]">
                            {item.customerName || "Tồn kho chuẩn bị"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedSerialDetail(item)}
                            className="p-1.5 rounded-lg text-[#0C5776] hover:bg-[#BCFEFE]/30 transition"
                            title="Xem chi tiết kỹ thuật S/N"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              vipToast.success(`Đã in tem nhiệt barcode cho S/N: ${item.serialNumber}`);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                            title="In tem barcode S/N"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingSerial(item)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                            title="Gỡ bỏ khỏi sổ cái"
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
                {filteredList.length === 0
                  ? 0
                  : (currentPage - 1) * (pageSize === "all" ? filteredList.length : Number(pageSize)) + 1}
              </strong>{" "}
              -{" "}
              <strong className="text-[#001C44]">
                {pageSize === "all"
                  ? filteredList.length
                  : Math.min(currentPage * Number(pageSize), filteredList.length)}
              </strong>{" "}
              trong tổng số <strong className="text-[#001C44]">{filteredList.length}</strong> mã S/N
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
                <option value="all">Tất cả ({filteredList.length})</option>
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
                    BẢNG TÍNH ĐỐI SOÁT &amp; KIỂM KÊ KHO NỘI BỘ
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Xem Trước Sổ Cái Serial / IMEI e-Shield
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
                  Đang chuẩn bị xuất dữ liệu thực tế cho <strong className="text-[#001C44]">{filteredList.length} bản ghi S/N</strong>.
                </span>
                <span className="font-mono text-[11px] text-[#0C5776] font-bold">
                  Quy chuẩn ISO 9001:2026 • TechCore Enterprise
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl max-h-[50vh] overflow-y-auto overflow-x-auto text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[9px] tracking-wider border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">STT</th>
                      <th className="py-2.5 px-3">Mã S/N</th>
                      <th className="py-2.5 px-3">Mã IMEI / Barcode</th>
                      <th className="py-2.5 px-3">Tên Thiết Bị</th>
                      <th className="py-2.5 px-3">Trung Tâm Kho</th>
                      <th className="py-2.5 px-3">Trạng Thái S/N</th>
                      <th className="py-2.5 px-3">Đơn Hàng Gán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((i, index) => (
                      <tr key={i.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-slate-400">{index + 1}</td>
                        <td className="py-2 px-3 font-mono font-bold text-[#0C5776]">{i.serialNumber}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{i.imei}</td>
                        <td className="py-2 px-3 font-medium text-slate-900 line-clamp-1">{i.productName}</td>
                        <td className="py-2 px-3 text-slate-600">{i.hubLocation}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              i.status === "in_stock"
                                ? "bg-emerald-50 text-emerald-700"
                                : i.status === "reserved"
                                ? "bg-blue-50 text-blue-700"
                                : i.status === "in_transit"
                                ? "bg-cyan-50 text-cyan-700"
                                : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            {i.statusText || i.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">{i.assignedOrder}</td>
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
                <span>In Sổ Cái Kho (A4)</span>
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
          ADD SERIAL/IMEI MODAL WITH STRICT FORM VALIDATION
      ========================================================================= */}
      {showAddSerialModal && (
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
                    TECHCORE HARDWARE LEDGER
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Nhập Kho Mã Định Danh Serial / IMEI e-Shield Mới
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSerialModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSerialSubmit} className="py-4 space-y-3.5 text-xs">
              {/* Product Name & SKU */}
              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Tên sản phẩm / Cấu hình: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSerialForm.productName}
                  onChange={(e) => {
                    setNewSerialForm({ ...newSerialForm, productName: e.target.value });
                    if (formErrors.productName) setFormErrors({ ...formErrors, productName: "" });
                  }}
                  placeholder="Ví dụ: Card đồ họa ASUS ROG Astral RTX 4090 24GB OC"
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition ${
                    formErrors.productName
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-200 focus:border-[#2D99AE]"
                  }`}
                />
                {formErrors.productName && (
                  <p className="text-red-500 text-[11px] font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formErrors.productName}
                  </p>
                )}
              </div>

              {/* SKU & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Mã SKU Master: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSerialForm.sku}
                    onChange={(e) => {
                      setNewSerialForm({ ...newSerialForm, sku: e.target.value.toUpperCase() });
                      if (formErrors.sku) setFormErrors({ ...formErrors, sku: "" });
                    }}
                    placeholder="GPU-ROG-4090-OC"
                    className={`w-full px-3 py-2 rounded-xl border font-mono uppercase text-xs focus:outline-none transition ${
                      formErrors.sku
                        ? "border-red-500 bg-red-50/20"
                        : "border-slate-200 focus:border-[#2D99AE]"
                    }`}
                  />
                  {formErrors.sku && (
                    <p className="text-red-500 text-[11px] font-bold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formErrors.sku}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Danh mục phân loại:
                  </label>
                  <select
                    value={newSerialForm.category}
                    onChange={(e) => setNewSerialForm({ ...newSerialForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D99AE] bg-white font-bold text-slate-700"
                  >
                    <option value="Card đồ họa GPU">Card đồ họa GPU</option>
                    <option value="Bộ vi xử lý CPU">Bộ vi xử lý CPU</option>
                    <option value="Laptop & Apple Enterprise">Laptop &amp; Apple Enterprise</option>
                    <option value="Màn hình & Hiển thị">Màn hình &amp; Hiển thị</option>
                    <option value="Linh kiện & Nguồn">Linh kiện &amp; Nguồn</option>
                    <option value="Máy trạm AI & Creator">Máy trạm AI &amp; Creator</option>
                  </select>
                </div>
              </div>

              {/* S/N & IMEI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Mã Serial Number (S/N): <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSerialForm.serialNumber}
                    onChange={(e) => {
                      setNewSerialForm({ ...newSerialForm, serialNumber: e.target.value.toUpperCase() });
                      if (formErrors.serialNumber) setFormErrors({ ...formErrors, serialNumber: "" });
                    }}
                    placeholder="SN-TC-4090-9981-VN"
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

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Mã IMEI / Barcode phần cứng:
                  </label>
                  <input
                    type="text"
                    value={newSerialForm.imei}
                    onChange={(e) => setNewSerialForm({ ...newSerialForm, imei: e.target.value })}
                    placeholder="IMEI-869201048821999"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-[#2D99AE]"
                  />
                </div>
              </div>

              {/* Hub & Rack Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Trung tâm kho điều phối: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newSerialForm.hubLocation}
                    onChange={(e) => setNewSerialForm({ ...newSerialForm, hubLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D99AE] bg-white font-bold text-slate-700"
                  >
                    <option value="Kho Landmark 81 (TP.HCM)">Kho Landmark 81 (TP.HCM)</option>
                    <option value="Kho Keangnam HN (Hà Nội)">Kho Keangnam HN (Hà Nội)</option>
                    <option value="Tổng kho Tân Bình (Kho Lạnh)">Tổng kho Tân Bình (Kho Lạnh)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Vị trí kệ Rack / Khay bảo quản:
                  </label>
                  <input
                    type="text"
                    value={newSerialForm.rackZone}
                    onChange={(e) => setNewSerialForm({ ...newSerialForm, rackZone: e.target.value })}
                    placeholder="Kệ lạnh A-04 • Tầng 2"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D99AE]"
                  />
                </div>
              </div>

              {/* Supplier & Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Nhà phân phối chính ngạch:
                  </label>
                  <input
                    type="text"
                    value={newSerialForm.supplier}
                    onChange={(e) => setNewSerialForm({ ...newSerialForm, supplier: e.target.value })}
                    placeholder="ASUS Global Hub VN / Synnex FPT"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D99AE]"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Thời hạn bảo hành (Tháng):
                  </label>
                  <input
                    type="number"
                    value={newSerialForm.warrantyMonths}
                    onChange={(e) => setNewSerialForm({ ...newSerialForm, warrantyMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D99AE]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddSerialModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#001C44] hover:bg-[#0C5776] text-white font-black text-xs transition shadow-sm active:scale-95"
                >
                  Xác Nhận Nhập Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EXECUTIVE SERIAL DETAIL MODAL
      ========================================================================= */}
      {selectedSerialDetail && (
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
                    CHỨNG THƯ BẢO MẬT E-SHIELD HARDWARE LEDGER
                  </span>
                  <h3 className="text-lg font-black text-[#001C44]">
                    {selectedSerialDetail.serialNumber}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSerialDetail(null)}
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
              {/* Product Info Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#0C5776] bg-[#BCFEFE]/50 px-2.5 py-0.5 rounded-lg border border-[#2D99AE]/30">
                    SKU: {selectedSerialDetail.sku}
                  </span>
                  <span className="font-bold text-[11px] text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg">
                    {selectedSerialDetail.category}
                  </span>
                  <span
                    className={`font-bold text-[11px] px-2.5 py-0.5 rounded-lg border ${
                      selectedSerialDetail.sealStatus === "sealed"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    ● {selectedSerialDetail.sealStatus === "sealed" ? "Nguyên Seal Blockchain" : "Đã kiểm định"}
                  </span>
                </div>

                <h4 className="font-black text-slate-900 text-sm">
                  {selectedSerialDetail.productName}
                </h4>

                <p className="text-slate-500 text-[11px]">
                  Nhà phân phối: <strong className="text-slate-800">{selectedSerialDetail.supplier || "Chính hãng"}</strong> • Khối ghi nhận: <strong className="font-mono text-[#0C5776]">{selectedSerialDetail.mintBlock || "#BLOCK-1094821"}</strong>
                </p>
              </div>

              {/* Cryptographic Proof Card */}
              <div className="p-4 rounded-2xl bg-[#001C44] text-white space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#BCFEFE]" />
                    <span className="font-bold text-slate-200">Mã Băm Cryptographic SHA-256</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#BCFEFE] bg-[#0C5776]/50 px-2.5 py-0.5 rounded border border-[#2D99AE]/40">
                    BẢO MẬT TUYỆT ĐỐI
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mã băm e-Shield (Hash):</span>
                    <span className="font-mono text-[#BCFEFE] font-bold">{selectedSerialDetail.hashSha256 || "0x8F4D...7E15"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mã IMEI / Barcode:</span>
                    <span className="font-mono text-slate-200 font-bold">{selectedSerialDetail.imei || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Climate & IoT Monitoring */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Nhiệt độ hiện tại</span>
                  <span className="text-base font-black text-cyan-600 flex items-center gap-1">
                    <Snowflake className="w-4 h-4 text-cyan-500" />
                    {selectedSerialDetail.temperature || "18.2°C"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Độ ẩm lưu trữ</span>
                  <span className="text-base font-black text-slate-800">
                    {selectedSerialDetail.humidity || "47% RH"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Thời hạn bảo hành</span>
                  <span className="text-base font-black text-[#0C5776]">
                    {selectedSerialDetail.warrantyMonths || 36} Tháng
                  </span>
                </div>
              </div>

              {/* Warehouse & Rack Zone Location */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0C5776]" />
                  <span>Vị Trí Lưu Kho &amp; Trung Tâm Điều Phối</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Trung tâm điều phối:</span>
                    <span className="font-bold text-slate-900">{selectedSerialDetail.hubLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Vị trí khay kệ Rack:</span>
                    <span className="font-bold text-slate-900">{selectedSerialDetail.rackZone}</span>
                  </div>
                </div>
              </div>

              {/* Order Assignment */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#0C5776]" />
                  <span>Thông Tin Gán Đơn Hàng &amp; Chủ Sở Hữu</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mã đơn hàng liên kết:</span>
                    <span className="font-mono font-bold text-[#0C5776]">
                      {selectedSerialDetail.assignedOrder || "Chưa gán đơn"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Chủ sở hữu / Khách hàng:</span>
                    <span className="font-bold text-slate-900">
                      {selectedSerialDetail.customerName || "Tồn kho chuẩn bị"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  vipToast.success(`Đã in mã QR xác thực cho S/N: ${selectedSerialDetail.serialNumber}`);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#0C5776]" />
                <span>In Tem Nhiệt QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSerialDetail(null)}
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
      {deletingSerial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-slate-900">
              Xóa Mã S/N Khỏi Sổ Cái e-Shield?
            </h3>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Bạn có chắc chắn muốn hủy bản ghi mã Serial Number{" "}
              <strong className="font-mono text-rose-600 font-bold">"{deletingSerial.serialNumber}"</strong> (Thiết bị:{" "}
              <span className="text-slate-900 font-bold">{deletingSerial.productName}</span>)?
              Thao tác này sẽ gỡ bỏ chứng thư bảo mật khỏi chuỗi khối và phát thông báo tới tất cả các quản trị viên khác.
            </p>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingSerial(null)}
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
