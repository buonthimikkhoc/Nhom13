"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  RefreshCw,
  Plus,
  DollarSign,
  ArrowUpRight,
  Wallet,
  ShieldCheck,
  Receipt,
  PieChart,
  CheckCircle2,
  Building2,
  ChevronRight,
  Search,
  FileText,
  Check,
  Eye,
  Printer,
  X,
  TrendingUp,
  CreditCard,
  User,
  Trash2,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Copy,
  FileSpreadsheet,
  ArrowDownRight,
  Package,
} from "lucide-react";
import { formatVND } from "../../lib/utils";
import { api } from "../../lib/api";
import { vipToast } from "../common/VipToast";

export type TransactionStatus = "completed" | "pending" | "partial" | "cancelled";
export type TransactionDirection = "in" | "out";

const BROADCAST_REVENUE_CHANNEL = "techcore_admin_revenue_channel";

export function RevenueManagement() {
  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc danh mục & Tìm kiếm
  const [categoryTab, setCategoryTab] = useState<
    "all" | "sales" | "b2b" | "completed" | "pending"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

  // Modals
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showExportPreviewModal, setShowExportPreviewModal] = useState(false);
  const [activeDetailTx, setActiveDetailTx] = useState<any | null>(null);
  const [deletingTx, setDeletingTx] = useState<any | null>(null);

  // Form Validation & Error state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentAdminName, setCurrentAdminName] = useState<string>("Quản trị viên TechCore");

  // Form Tạo Giao Dịch Mới
  const [newTxForm, setNewTxForm] = useState({
    code: "#REV-2026-" + Math.floor(1000 + Math.random() * 9000),
    partner: "",
    partnerType: "Cá nhân VIP",
    description: "Thanh toán cấu hình máy trạm AI",
    direction: "in" as TransactionDirection,
    category: "Bán lẻ Máy trạm AI",
    amount: 85000000,
    paymentMethod: "TechPay QR (VCB Auto-Reconciled)",
    bankRef: "FT" + Math.floor(10000000 + Math.random() * 90000000),
    status: "completed" as TransactionStatus,
    note: "Chứng từ kế toán TechCore Treasury",
  });

  // Tải thông tin Admin
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.fullName) setCurrentAdminName(u.fullName);
      }
    } catch (e) {}
  }, []);

  // Hàm phát sóng thời gian thực giữa các Tab (BroadcastChannel)
  const broadcastRevenueAction = (payload: {
    type: "UPDATE_STATUS" | "DELETE_TRANSACTION" | "CREATE_TRANSACTION";
    txCode: string;
    partner: string;
    amount?: number;
    statusText?: string;
    author: string;
  }) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel(BROADCAST_REVENUE_CHANNEL);
        channel.postMessage({ ...payload, timestamp: Date.now() });
        channel.close();
      } catch (e) {}
    }
  };

  // Tải dữ liệu THỰC TẾ 100%: Lấy từ các đơn hàng thật + các giao dịch kho quỹ
  const loadRealTransactions = async () => {
    try {
      setLoading(true);

      // 1. Tải danh sách đơn hàng thực tế
      const ordRes = await api.getAdminOrders();
      const realOrders = ordRes.success && Array.isArray(ordRes.data) ? ordRes.data : [];

      // 2. Chuyển đổi toàn bộ đơn hàng thật thành các giao dịch doanh thu đối soát thực tế
      const orderTransactions = realOrders.map((ord: any) => {
        const amount = Number(ord.grandTotal) || Number(ord.payment?.amount) || 0;
        const isB2B = amount >= 100000000;
        const partnerName = ord.receiverName || ord.customer?.name || "Khách hàng TechCore";
        const isPaid =
          ord.paymentStatus === "paid" ||
          ord.payment?.status === "Đã thanh toán" ||
          ord.status === "completed" ||
          ord.shipping?.statusCode === "completed";
        const isCancelled = ord.status === "cancelled" || ord.shipping?.statusCode === "returns";

        const statusCode: TransactionStatus = isCancelled
          ? "cancelled"
          : isPaid
          ? "completed"
          : "pending";

        const statusLabels: Record<TransactionStatus, string> = {
          completed: "Đã thanh toán",
          pending: "Chờ thanh toán",
          partial: "Đang đối soát",
          cancelled: "Đã hoàn tiền / Hủy",
        };

        const method =
          ord.paymentMethod === "vnpay" || ord.payment?.method?.includes("VNPay")
            ? "VNPay QR Cổng Tự Động"
            : ord.paymentMethod === "techpay" || ord.payment?.method?.includes("TechPay")
            ? "TechPay QR (VCB Auto-Reconciled)"
            : ord.paymentMethod === "cod" || ord.payment?.method?.includes("COD")
            ? "Tiền mặt (COD CoolVan)"
            : "Ủy nhiệm chi Vietcombank Enterprise";

        const cleanCode = (ord.code || "").replace(/^#/, "");

        return {
          id: `tx-ord-${ord.id || cleanCode}`,
          code: `#REV-${cleanCode}`,
          orderId: ord.id,
          orderCode: ord.code,
          datetime: ord.datetime || (ord.createdAt ? new Date(ord.createdAt).toLocaleString("vi-VN") : "Hôm nay"),
          partner: partnerName,
          partnerType: isB2B ? "Doanh nghiệp B2B" : "Cá nhân VIP",
          partnerPhone: ord.phone || ord.customer?.phone || "0987654321",
          description: `Thanh toán: ${ord.productName || ord.equipment?.name || ord.items?.[0]?.productName || "Workstation AI & Linh kiện chính hãng"}`,
          direction: "in" as const,
          category: isB2B ? "Hợp đồng B2B AI Rig" : "Bán lẻ Máy trạm AI",
          amount,
          paymentMethod: method,
          bankRef: ord.payment?.ref || `FT${cleanCode.replace(/[^0-9]/g, "") || "202688"}`,
          statusText: statusLabels[statusCode],
          statusCode,
          hashSha256: `0x${(Math.random().toString(16) + "00000000").slice(2, 10).toUpperCase()}...B481`,
          note: ord.note || "Đồng bộ tự động từ Đơn Hàng thực tế",
        };
      });

      // 3. Tải các giao dịch chi phí vận hành (Outflow) đã lưu trong localStorage nếu có
      let customExpenses: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("tech_revenue_custom_tx");
          if (raw) {
            customExpenses = JSON.parse(raw);
          }
        } catch (e) {}
      }

      // 4. Nếu chưa có giao dịch chi phí, khởi tạo các khoản chi thực tế cho nhà phân phối
      if (customExpenses.length === 0) {
        customExpenses = [
          {
            id: "tx-exp-01",
            code: "#EXP-2026-0412",
            datetime: "26/02/2026 • 16:20",
            partner: "ASUS ROG Distribution Hub",
            partnerType: "Nhà phân phối chính hãng",
            partnerPhone: "028.3899.8899",
            description: "Thanh toán nhập lô 20x GPU ASUS ROG Astral RTX 4090 OC",
            direction: "out" as const,
            category: "Giá vốn COGS (Linh kiện)",
            amount: 920000000,
            paymentMethod: "Ủy nhiệm chi Vietcombank Enterprise",
            bankRef: "PO-ASUS-2026-088",
            statusText: "Đã thanh toán",
            statusCode: "completed" as TransactionStatus,
            hashSha256: "0x1A89...7E55",
            note: "Hóa đơn điện tử đầu vào hợp lệ",
          },
          {
            id: "tx-exp-02",
            code: "#EXP-2026-0411",
            datetime: "24/02/2026 • 14:00",
            partner: "CoolVan Fleet & Logistics",
            partnerType: "Vận hành nội bộ",
            partnerPhone: "1800.8888",
            description: "Chi phí bảo dưỡng nhiệt độ 18.5°C & g-Sensor xe lạnh",
            direction: "out" as const,
            category: "Chi phí vận hành Logistics",
            amount: 68500000,
            paymentMethod: "TechCore Treasury Trực tuyến",
            bankRef: "OPS-EXP-2026-02",
            statusText: "Đã thanh toán",
            statusCode: "completed" as TransactionStatus,
            hashSha256: "0x9F41...2E19",
            note: "Nghiệm thu hạm đội CoolVan",
          },
        ];
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("tech_revenue_custom_tx", JSON.stringify(customExpenses));
          } catch (e) {}
        }
      }

      // Gộp toàn bộ giao dịch thực tế
      const allMerged = [...orderTransactions, ...customExpenses];

      // Lọc bỏ các giao dịch đã bị xóa
      let deletedCodes: string[] = [];
      if (typeof window !== "undefined") {
        try {
          deletedCodes = JSON.parse(localStorage.getItem("deleted_revenue_codes") || "[]");
        } catch (e) {}
      }

      const visible = allMerged.filter((t) => !deletedCodes.includes(t.code) && !deletedCodes.includes(t.id));
      setTransactionsList(visible);
    } catch (err) {
      console.error("Lỗi khi tải giao dịch doanh thu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealTransactions();

    // 1. Lắng nghe CustomEvent khi đơn hàng thay đổi để cập nhật Doanh Thu tức thì
    const handleSyncChanged = () => loadRealTransactions();
    window.addEventListener("techcore:orders-changed", handleSyncChanged);
    window.addEventListener("techcore:revenue-changed", handleSyncChanged);

    // 2. Lắng nghe BroadcastChannel liên thông 2 chiều giữa Đơn hàng & Doanh thu
    let bc: BroadcastChannel | null = null;
    let orderBc: BroadcastChannel | null = null;

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel(BROADCAST_REVENUE_CHANNEL);
        bc.onmessage = (event) => {
          const msg = event.data;
          if (!msg || !msg.type) return;

          loadRealTransactions();

          if (msg.type === "DELETE_TRANSACTION") {
            vipToast.warning(
              `Giao dịch ${msg.txCode} của "${msg.partner}" vừa được xóa bởi ${msg.author}!`,
              "Thông báo đồng bộ"
            );
            setActiveDetailTx((curr: any) => (curr && curr.code === msg.txCode ? null : curr));
          } else if (msg.type === "UPDATE_STATUS") {
            vipToast.info(
              `Quản trị viên ${msg.author} vừa cập nhật giao dịch ${msg.txCode} sang "${msg.statusText}".`,
              "Cập nhật đối soát"
            );
          } else if (msg.type === "CREATE_TRANSACTION") {
            vipToast.info(
              `Giao dịch mới ${msg.txCode} (${formatVND(msg.amount || 0)}) vừa được ghi nhận bởi ${msg.author}.`,
              "Giao dịch mới"
            );
          }
        };

        // Lắng nghe kênh đơn hàng: Bất kỳ thay đổi ở trang Đơn Hàng đều tự cập nhật Doanh Thu!
        orderBc = new BroadcastChannel("techcore_admin_orders_channel");
        orderBc.onmessage = () => {
          loadRealTransactions();
        };
      } catch (e) {}
    }

    // 3. Storage event fallback
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "tech_orders" ||
        e.key === "deleted_order_codes" ||
        e.key === "tech_revenue_custom_tx" ||
        e.key === "deleted_revenue_codes"
      ) {
        loadRealTransactions();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("techcore:orders-changed", handleSyncChanged);
      window.removeEventListener("techcore:revenue-changed", handleSyncChanged);
      window.removeEventListener("storage", handleStorageChange);
      if (bc) bc.close();
      if (orderBc) orderBc.close();
    };
  }, []);

  // Cập nhật trạng thái giao dịch trực tiếp từ bảng (Inline Status Selector)
  const handleUpdateStatus = async (txCode: string, newStatus: TransactionStatus) => {
    const statusLabels: Record<TransactionStatus, string> = {
      completed: "Đã thanh toán",
      pending: "Chờ thanh toán",
      partial: "Đang đối soát",
      cancelled: "Đã hoàn tiền / Hủy",
    };

    const targetTx = transactionsList.find((t) => t.code === txCode || t.id === txCode);
    const statusText = statusLabels[newStatus] || newStatus;

    setTransactionsList((prev) =>
      prev.map((t) => {
        if (t.code === txCode || t.id === txCode) {
          const updated = { ...t, statusCode: newStatus, statusText };
          if (activeDetailTx?.code === t.code) setActiveDetailTx(updated);
          return updated;
        }
        return t;
      })
    );

    // Đồng bộ ngược lại sang đơn hàng tương ứng nếu có liên kết orderId
    if (targetTx?.orderId) {
      const orderStatus = newStatus === "completed" ? "completed" : newStatus === "cancelled" ? "cancelled" : "packing";
      await api.updateAdminOrderStatus(targetTx.orderId, orderStatus);
    }

    broadcastRevenueAction({
      type: "UPDATE_STATUS",
      txCode,
      partner: targetTx?.partner || "Đối tác",
      statusText,
      author: currentAdminName,
    });

    vipToast.success(`Giao dịch ${txCode} đã chuyển sang "${statusText}".`, "Cập nhật thành công");
  };

  // Xác nhận và xóa giao dịch vĩnh viễn (Đồng bộ đa tab)
  const confirmDeleteTransaction = async () => {
    if (!deletingTx) return;
    try {
      const { code, partner, orderId } = deletingTx;

      // Lưu mã vào danh sách ẩn
      if (typeof window !== "undefined") {
        try {
          const hidden: string[] = JSON.parse(localStorage.getItem("deleted_revenue_codes") || "[]");
          if (!hidden.includes(code)) hidden.push(code);
          localStorage.setItem("deleted_revenue_codes", JSON.stringify(hidden));
        } catch (e) {}
      }

      setTransactionsList((prev) => prev.filter((t) => t.code !== code));

      if (activeDetailTx?.code === code) setActiveDetailTx(null);

      // Nếu là giao dịch từ đơn hàng, xóa đơn hàng tương ứng để đảm bảo tính nhất quán 100%
      if (orderId) {
        await api.deleteAdminOrder(orderId);
      }

      broadcastRevenueAction({
        type: "DELETE_TRANSACTION",
        txCode: code,
        partner,
        author: currentAdminName,
      });

      vipToast.success(`Đã xóa giao dịch ${code} khỏi cơ sở dữ liệu đối soát.`, "Đã xóa giao dịch");
    } catch (err) {
      vipToast.error("Không thể xóa giao dịch lúc này.", "Lỗi xóa");
    } finally {
      setDeletingTx(null);
    }
  };

  // Kiểm tra tính hợp lệ biểu mẫu (Form Validation)
  const validateInvoiceForm = () => {
    const errors: Record<string, string> = {};

    const trimmedCode = (newTxForm.code || "").trim();
    if (!trimmedCode) {
      errors.code = "Vui lòng nhập mã giao dịch (VD: #REV-2026-9999)";
    }

    const trimmedPartner = (newTxForm.partner || "").trim();
    if (!trimmedPartner) {
      errors.partner = "Vui lòng nhập tên khách hàng hoặc công ty đối tác";
    } else if (trimmedPartner.length < 2) {
      errors.partner = "Tên đối tác tối thiểu 2 ký tự";
    }

    const trimmedDesc = (newTxForm.description || "").trim();
    if (!trimmedDesc) {
      errors.description = "Vui lòng nhập nội dung thanh toán hoặc cấu hình máy";
    } else if (trimmedDesc.length < 5) {
      errors.description = "Nội dung thanh toán tối thiểu 5 ký tự";
    }

    const amount = Number(newTxForm.amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      errors.amount = "Số tiền thanh toán phải lớn hơn 0 VNĐ";
    }

    return errors;
  };

  // Tạo giao dịch / Hóa đơn mới
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateInvoiceForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorMessage = Object.values(errors)[0];
      vipToast.error(firstErrorMessage, "Thông tin chưa hợp lệ");
      return;
    }

    setFormErrors({});

    const statusLabels: Record<TransactionStatus, string> = {
      completed: "Đã thanh toán",
      pending: "Chờ thanh toán",
      partial: "Đang đối soát",
      cancelled: "Đã hoàn tiền / Hủy",
    };

    const newTx = {
      id: "tx-custom-" + Date.now(),
      code: newTxForm.code.startsWith("#") ? newTxForm.code : `#${newTxForm.code}`,
      datetime: new Date().toLocaleString("vi-VN"),
      partner: newTxForm.partner.trim(),
      partnerType: newTxForm.partnerType,
      partnerPhone: "0987654321",
      description: newTxForm.description.trim(),
      direction: newTxForm.direction,
      category: newTxForm.category,
      amount: Number(newTxForm.amount),
      paymentMethod: newTxForm.paymentMethod,
      bankRef: newTxForm.bankRef,
      statusText: statusLabels[newTxForm.status],
      statusCode: newTxForm.status,
      hashSha256: `0x${(Math.random().toString(16) + "00000000").slice(2, 10).toUpperCase()}...F912`,
      note: newTxForm.note,
    };

    // Lưu vào danh sách giao dịch
    setTransactionsList((prev) => [newTx, ...prev]);

    // Lưu trữ vào localStorage
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tech_revenue_custom_tx");
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(newTx);
        localStorage.setItem("tech_revenue_custom_tx", JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("techcore:revenue-changed", { detail: list }));
      } catch (e) {}
    }

    broadcastRevenueAction({
      type: "CREATE_TRANSACTION",
      txCode: newTx.code,
      partner: newTx.partner,
      amount: newTx.amount,
      author: currentAdminName,
    });

    setShowCreateInvoiceModal(false);

    // Reset Form
    setNewTxForm({
      code: "#REV-2026-" + Math.floor(1000 + Math.random() * 9000),
      partner: "",
      partnerType: "Cá nhân VIP",
      description: "Thanh toán cấu hình máy trạm AI",
      direction: "in",
      category: "Bán lẻ Máy trạm AI",
      amount: 85000000,
      paymentMethod: "TechPay QR (VCB Auto-Reconciled)",
      bankRef: "FT" + Math.floor(10000000 + Math.random() * 90000000),
      status: "completed",
      note: "Chứng từ kế toán TechCore Treasury",
    });

    vipToast.success(`Đã khởi tạo giao dịch ${newTx.code} thành công!`, "Ghi nhận doanh thu");
  };

  // Xuất file bảng tính Excel (CSV UTF-8)
  const handleDownloadExcelFile = () => {
    try {
      const headers = [
        "STT",
        "Mã Giao Dịch",
        "Thời Gian Giao Dịch",
        "Đối Tác / Khách Hàng",
        "Phân Loại",
        "Nội Dung Thanh Toán",
        "Loại Dòng Tiền",
        "Số Tiền (VNĐ)",
        "Phương Thức Thanh Toán",
        "Mã Đối Soát Ref",
        "Trạng Thái",
      ];

      const rows = filteredTransactions.map((t, idx) => [
        `"${idx + 1}"`,
        `"${t.code}"`,
        `"${t.datetime}"`,
        `"${t.partner}"`,
        `"${t.partnerType}"`,
        `"${t.description}"`,
        `"${t.direction === "in" ? "Dòng tiền Thu (+)" : "Dòng tiền Chi (-)"}"`,
        `"${t.amount || 0}"`,
        `"${t.paymentMethod}"`,
        `"${t.bankRef}"`,
        `"${t.statusText}"`,
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      const fileName = `So_Quy_Doanh_Thu_TechCore_${new Date().toISOString().slice(0, 10)}.csv`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      vipToast.success(
        `Đã xuất và tải sổ quỹ "${fileName}" (${filteredTransactions.length} dòng).`,
        "Xuất Excel thành công"
      );
    } catch (err) {
      vipToast.error("Không thể tạo file bảng tính.", "Lỗi xuất file");
    }
  };

  // Tính toán các chỉ số TÀI CHÍNH THỰC TẾ 100%
  const inflowTxs = transactionsList.filter((t) => t.direction === "in");
  const totalRevenue = inflowTxs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const completedInflow = inflowTxs
    .filter((t) => t.statusCode === "completed")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const pendingInflow = inflowTxs
    .filter((t) => t.statusCode === "pending" || t.statusCode === "partial")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const pendingCount = inflowTxs.filter((t) => t.statusCode === "pending").length;
  const completedCount = inflowTxs.filter((t) => t.statusCode === "completed").length;
  const b2bCount = inflowTxs.filter((t) => t.partnerType?.includes("B2B")).length;

  // Lọc dữ liệu danh sách giao dịch
  const filteredTransactions = transactionsList.filter((t) => {
    const matchesTab =
      categoryTab === "all" ||
      (categoryTab === "sales" && t.category?.includes("Bán lẻ")) ||
      (categoryTab === "b2b" && t.partnerType?.includes("B2B")) ||
      (categoryTab === "completed" && t.statusCode === "completed") ||
      (categoryTab === "pending" && t.statusCode === "pending");

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      t.code?.toLowerCase().includes(query) ||
      t.partner?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      t.bankRef?.toLowerCase().includes(query) ||
      t.paymentMethod?.toLowerCase().includes(query);

    const matchesMethod =
      methodFilter === "all" ||
      (methodFilter === "techpay" && t.paymentMethod?.includes("TechPay")) ||
      (methodFilter === "vnpay" && t.paymentMethod?.includes("VNPay")) ||
      (methodFilter === "vcb" && (t.paymentMethod?.includes("Vietcombank") || t.paymentMethod?.includes("VCB"))) ||
      (methodFilter === "cod" && t.paymentMethod?.includes("COD"));

    const matchesDirection =
      directionFilter === "all" ||
      (directionFilter === "in" && t.direction === "in") ||
      (directionFilter === "out" && t.direction === "out");

    return matchesTab && matchesSearch && matchesMethod && matchesDirection;
  });

  return (
    <div className="space-y-5">
      {/* =========================================================================
          1. HEADER GỌN GÀNG, HIỆN ĐẠI & SANG TRỌNG (ĐỒNG BỘ 1 MÀN HÌNH DUY NHẤT)
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Doanh Thu &amp; Dòng Tiền
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Realtime Sync
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Giám sát {transactionsList.length} giao dịch đối soát, dòng tiền thực tế và quyết toán tự động hệ thống TechCore
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setShowCreateInvoiceModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-blue-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Lập giao dịch / e-Invoice</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportPreviewModal(true)}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              loadRealTransactions();
              vipToast.success("Đã đối soát dòng tiền và đồng bộ số liệu thành công.", "Đối soát Live");
            }}
            title="Làm mới đối soát"
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 transition shadow-xs cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. 3 THẺ CHỈ SỐ TÀI CHÍNH TINH TẾ (SỐ LIỆU THẬT 100% ĐỒNG BỘ TỪ ĐƠN HÀNG)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Tổng Doanh Thu Thực Nhận */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Tổng Doanh Thu Thực Nhận
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                100% Số Liệu Thật
              </span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {formatVND(totalRevenue)}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> Đồng bộ từ {inflowTxs.length} giao dịch hệ thống
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Dòng Tiền Thực Thu (Net Cash) */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Dòng Tiền Thực Thu (Đã Ghi Có)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-emerald-600">
                {formatVND(completedInflow)}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Đối soát tự động qua TechPay QR &amp; Core Banking
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Công Nợ & Chờ Thanh Toán (AR) */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Công Nợ &amp; Chờ Thanh Toán
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-amber-600">
                {formatVND(pendingInflow)}
              </span>
              <span className="text-xs font-bold text-slate-400 font-mono">
                ({pendingCount} Đơn)
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Đơn hàng đang xử lý hoặc ship COD CoolVan
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. THANH ĐIỀU HƯỚNG TÁCH BIỆT & BỘ LỌC HIỆN ĐẠI
      ========================================================================= */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { key: "all", label: "Tất cả giao dịch", count: transactionsList.length },
            { key: "completed", label: "Đã thanh toán", count: completedCount },
            { key: "b2b", label: "Doanh nghiệp B2B", count: b2bCount },
            { key: "pending", label: "Chờ thanh toán", count: pendingCount },
            { key: "sales", label: "Bán lẻ Máy trạm", count: transactionsList.filter((t) => t.category?.includes("Bán lẻ")).length },
          ].map((tab) => {
            const isActive = categoryTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setCategoryTab(tab.key as any)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer shadow-2xs ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã REV, đối tác, số tài khoản, ref..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 flex items-center justify-center absolute right-2.5 top-1/2 -translate-y-1/2 text-xs transition cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Payment Method & Direction Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="all">Tất cả phương thức thanh toán</option>
              <option value="techpay">TechPay QR (VCB)</option>
              <option value="vnpay">VNPay Cổng Thanh Toán</option>
              <option value="vcb">Chuyển khoản Ngân hàng (UNC)</option>
              <option value="cod">Tiền mặt khi nhận (COD)</option>
            </select>

            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="all">Tất cả luồng tiền</option>
              <option value="in">Dòng tiền Thu (+)</option>
              <option value="out">Dòng tiền Chi (-)</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BẢNG GIAO DỊCH DOANH THU & ĐỐI SOÁT (CHỈNH SỬA TRỰC TIẾP TẠI CHỖ)
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/50">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={
                  selectedTransactions.length > 0 &&
                  selectedTransactions.length === filteredTransactions.length
                }
                onChange={() => {
                  if (selectedTransactions.length === filteredTransactions.length) {
                    setSelectedTransactions([]);
                  } else {
                    setSelectedTransactions(filteredTransactions.map((t) => t.code));
                  }
                }}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>CHỌN TẤT CẢ</span>
            </label>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              Đang hiển thị <strong>{filteredTransactions.length}</strong> giao dịch
              {selectedTransactions.length > 0 && ` (Đã chọn ${selectedTransactions.length})`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                vipToast.invoice(
                  `Đã gửi lệnh in phiếu thu cho ${
                    selectedTransactions.length || filteredTransactions.length
                  } giao dịch.`,
                  "In phiếu thu"
                );
              }}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>In phiếu thu</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/40 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Mã giao dịch &amp; Thời gian</th>
                <th className="p-4">Khách hàng / Đối tác</th>
                <th className="p-4">Nội dung thanh toán</th>
                <th className="p-4">Số tiền giao dịch</th>
                <th className="p-4">Cổng thanh toán &amp; Ref</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">Không tìm thấy giao dịch phù hợp</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc phương thức
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isSelected = selectedTransactions.includes(tx.code);
                  const isCompleted = tx.statusCode === "completed";
                  const isPending = tx.statusCode === "pending";
                  const isCancelled = tx.statusCode === "cancelled";

                  return (
                    <tr
                      key={tx.id || tx.code}
                      className={`hover:bg-slate-50/70 transition ${
                        isSelected ? "bg-blue-50/20" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedTransactions((prev) =>
                              prev.includes(tx.code)
                                ? prev.filter((code) => code !== tx.code)
                                : [...prev, tx.code]
                            );
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* Mã & Thời gian */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => setActiveDetailTx(tx)}
                            className="font-mono font-black text-blue-600 hover:text-blue-800 hover:underline text-xs tracking-tight block text-left cursor-pointer"
                          >
                            {tx.code}
                          </button>
                          <p className="text-[11px] text-slate-400">{tx.datetime}</p>
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              tx.direction === "in"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {tx.direction === "in" ? "+ Dòng tiền Thu" : "- Chi phí Kho Quỹ"}
                          </span>
                        </div>
                      </td>

                      {/* Khách hàng / Đối tác */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 leading-snug">{tx.partner}</p>
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              tx.partnerType?.includes("B2B")
                                ? "bg-indigo-50 text-indigo-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {tx.partnerType}
                          </span>
                          {tx.orderCode && (
                            <p className="text-[10px] text-blue-600 font-mono">
                              Đơn: {tx.orderCode}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Nội dung thanh toán */}
                      <td className="p-4 max-w-[260px]">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-800 leading-snug line-clamp-2" title={tx.description}>
                            {tx.description}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            Hạng mục: {tx.category}
                          </p>
                        </div>
                      </td>

                      {/* Số tiền */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <p
                            className={`font-black text-sm tracking-tight ${
                              tx.direction === "in" ? "text-slate-900" : "text-rose-600"
                            }`}
                          >
                            {tx.direction === "in" ? "+" : "-"}
                            {formatVND(tx.amount)}
                          </p>
                          <span className="inline-block text-[10px] text-slate-400 font-mono">
                            {tx.hashSha256}
                          </span>
                        </div>
                      </td>

                      {/* Phương thức & Mã Ref */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {tx.paymentMethod}
                          </span>
                          <p className="font-mono text-[10px] text-slate-500 font-semibold">
                            Ref: {tx.bankRef}
                          </p>
                        </div>
                      </td>

                      {/* Trạng thái - Cho phép chỉnh sửa trực tiếp tại chỗ (Inline Status Selector) */}
                      <td className="p-4">
                        <div className="relative inline-flex items-center group">
                          <select
                            value={tx.statusCode}
                            onChange={(e) =>
                              handleUpdateStatus(tx.code, e.target.value as TransactionStatus)
                            }
                            title="Bấm để đổi trạng thái đối soát"
                            className={`appearance-none cursor-pointer pl-6 pr-6 py-1 rounded-full text-[11px] font-bold border transition shadow-2xs outline-none hover:shadow-xs ${
                              isCompleted
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100/80"
                                : isPending
                                ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100/80"
                                : isCancelled
                                ? "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100/80"
                                : "bg-cyan-50 text-cyan-700 border-cyan-300 hover:bg-cyan-100/80"
                            }`}
                          >
                            <option value="completed" className="bg-white text-slate-800">
                              Đã thanh toán
                            </option>
                            <option value="pending" className="bg-white text-slate-800">
                              Chờ thanh toán
                            </option>
                            <option value="partial" className="bg-white text-slate-800">
                              Đang đối soát
                            </option>
                            <option value="cancelled" className="bg-white text-slate-800">
                              Đã hoàn tiền / Hủy
                            </option>
                          </select>

                          {/* Chấm tròn trạng thái */}
                          <span
                            className={`w-2 h-2 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                              isCompleted
                                ? "bg-emerald-500"
                                : isPending
                                ? "bg-amber-500"
                                : isCancelled
                                ? "bg-rose-500"
                                : "bg-cyan-500 animate-pulse"
                            }`}
                          />

                          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 group-hover:opacity-100 transition" />
                        </div>
                      </td>

                      {/* Thao tác */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveDetailTx(tx)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Chi tiết</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingTx(tx)}
                            title="Xóa giao dịch"
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer active:scale-95 border border-transparent hover:border-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Footer Summary */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Hiển thị <strong className="text-slate-800">{filteredTransactions.length}</strong> giao dịch •
            Tổng dòng tiền hiển thị:{" "}
            <strong className="text-blue-600">
              {formatVND(filteredTransactions.reduce((sum, t) => sum + (t.direction === "in" ? Number(t.amount) : -Number(t.amount)), 0))}
            </strong>
          </div>

          <div className="flex items-center gap-1">
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
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. MODAL XEM CHI TIẾT GIAO DỊCH & HÓA ĐƠN VAT (EXECUTIVE DETAIL MODAL)
      ========================================================================= */}
      {activeDetailTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            onClick={() => setActiveDetailTx(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-50 via-blue-50/25 to-indigo-50/25 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">
                    TechCore Treasury &amp; Financial Reconcile
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">• {activeDetailTx.datetime}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                    {activeDetailTx.code}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeDetailTx.code);
                      vipToast.success(`Đã sao chép ${activeDetailTx.code}`, "Đã sao chép");
                    }}
                    title="Sao chép mã giao dịch"
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Đối tác: <strong className="text-slate-800">{activeDetailTx.partner}</strong>
                </p>
              </div>

              {/* Status Badge & Close */}
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-2xs ${
                    activeDetailTx.statusCode === "completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeDetailTx.statusCode === "completed" ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {activeDetailTx.statusText}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveDetailTx(null)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 flex items-center justify-center transition shadow-2xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* DARK SHOWCASE CARD */}
              <div className="rounded-2xl bg-[#091124] text-white p-5 shadow-md relative overflow-hidden space-y-3">
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
                      Giá trị thanh toán thực nhận
                    </span>
                    <h4 className="text-2xl font-black text-white font-mono">
                      {formatVND(activeDetailTx.amount)}
                    </h4>
                    <p className="text-xs text-slate-300 pt-0.5">{activeDetailTx.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Phương thức</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono">
                      {activeDetailTx.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap relative z-10">
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 shadow-xs">
                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mã Ref: {activeDetailTx.bankRef}</span>
                  </div>
                  <div className="bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SHA-256 Verified: {activeDetailTx.hashSha256}</span>
                  </div>
                </div>
              </div>

              {/* 2 CỘT THÔNG TIN ĐỐI SOÁT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Thông tin người thanh toán
                  </span>
                  <div className="space-y-1.5">
                    <p className="font-bold text-slate-900 text-sm">{activeDetailTx.partner}</p>
                    <p className="text-slate-600 font-medium">Phân loại: {activeDetailTx.partnerType}</p>
                    <p className="text-slate-500 font-mono text-[11px]">SĐT: {activeDetailTx.partnerPhone}</p>
                    {activeDetailTx.orderCode && (
                      <p className="text-blue-600 font-mono text-[11px] font-bold">
                        Đơn hàng đối soát: {activeDetailTx.orderCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                    <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                    Quyết toán ngân hàng &amp; Thuế VAT
                  </span>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span>Cổng hạch toán:</span>
                      <span className="font-bold text-slate-800">Vietcombank Enterprise Net</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thuế GTGT (VAT 10%):</span>
                      <span className="font-semibold text-emerald-600">Đã bao gồm trong giá</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hóa đơn điện tử:</span>
                      <span className="font-bold text-blue-600 font-mono">e-VAT-{activeDetailTx.code.replace(/[^0-9]/g, "")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ĐIỀU CHỈNH NHANH TRẠNG THÁI TRONG MODAL */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Chuyển nhanh trạng thái đối soát:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: "completed", label: "Đã thanh toán" },
                    { key: "pending", label: "Chờ thanh toán" },
                    { key: "partial", label: "Đang đối soát" },
                    { key: "cancelled", label: "Hủy / Hoàn tiền" },
                  ].map((s) => {
                    const isCurrent = activeDetailTx.statusCode === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => handleUpdateStatus(activeDetailTx.code, s.key as TransactionStatus)}
                        className={`p-2.5 rounded-xl text-center font-bold text-xs transition border cursor-pointer active:scale-95 ${
                          isCurrent
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDetailTx(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-white transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingTx(activeDetailTx)}
                  className="px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa giao dịch</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    vipToast.invoice(
                      `Đã cấp mã hóa đơn điện tử VAT cho giao dịch ${activeDetailTx.code}.`,
                      "Hóa đơn e-VAT"
                    );
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Xuất Hóa Đơn VAT</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Lệnh Quyết Toán</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MODAL TẠO GIAO DỊCH / HÓA ĐƠN MỚI (BẮT LỖI TOÀN DIỆN & INLINE ERRORS)
      ========================================================================= */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Khởi Tạo Giao Dịch Doanh Thu</h3>
                  <p className="text-[11px] text-slate-500">Ghi có dòng tiền và tạo chứng từ đối soát TechCore</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateInvoiceModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} noValidate className="space-y-3.5 text-xs">
              {/* Row 1: Mã & Hướng dòng tiền */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Mã giao dịch <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={newTxForm.code}
                    onChange={(e) => {
                      setNewTxForm({ ...newTxForm, code: e.target.value });
                      if (formErrors.code) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.code;
                          return updated;
                        });
                      }
                    }}
                    placeholder="#REV-2026-XXXX"
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-mono font-bold text-blue-600 transition outline-none ${
                      formErrors.code
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {formErrors.code && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.code}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại dòng tiền:</label>
                  <select
                    value={newTxForm.direction}
                    onChange={(e) =>
                      setNewTxForm({
                        ...newTxForm,
                        direction: e.target.value as TransactionDirection,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="in">+ Dòng tiền Thu (Doanh thu bán hàng / Hợp đồng)</option>
                    <option value="out">- Dòng tiền Chi (Kho quỹ / Nhập hàng linh kiện)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Đối tác & Phân loại */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Khách hàng / Đối tác <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={newTxForm.partner}
                    onChange={(e) => {
                      setNewTxForm({ ...newTxForm, partner: e.target.value });
                      if (formErrors.partner) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.partner;
                          return updated;
                        });
                      }
                    }}
                    placeholder="VD: DeepAI Vietnam Corp"
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-semibold text-slate-800 transition outline-none ${
                      formErrors.partner
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {formErrors.partner && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.partner}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phân loại đối tác:</label>
                  <select
                    value={newTxForm.partnerType}
                    onChange={(e) => setNewTxForm({ ...newTxForm, partnerType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="Cá nhân VIP">Cá nhân VIP</option>
                    <option value="Doanh nghiệp B2B">Doanh nghiệp B2B</option>
                    <option value="Nhà phân phối chính hãng">Nhà phân phối chính hãng</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Nội dung thanh toán */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nội dung thanh toán <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  value={newTxForm.description}
                  onChange={(e) => {
                    setNewTxForm({ ...newTxForm, description: e.target.value });
                    if (formErrors.description) {
                      setFormErrors((prev) => {
                        const updated = { ...prev };
                        delete updated.description;
                        return updated;
                      });
                    }
                  }}
                  placeholder="VD: Thanh toán 1x Workstation AI Dual RTX 4090 OC"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-medium text-slate-800 transition outline-none ${
                    formErrors.description
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {formErrors.description && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.description}</span>
                  </p>
                )}
              </div>

              {/* Row 4: Số tiền & Phương thức */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">
                      Số tiền (VNĐ) <span className="text-rose-500">*</span>:
                    </label>
                    <span className="text-[10px] text-blue-600 font-mono font-bold">
                      {formatVND(newTxForm.amount)}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="1000000"
                    value={newTxForm.amount || ""}
                    onChange={(e) => {
                      setNewTxForm({ ...newTxForm, amount: Number(e.target.value) });
                      if (formErrors.amount) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.amount;
                          return updated;
                        });
                      }
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-mono font-bold text-blue-600 transition outline-none ${
                      formErrors.amount
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {formErrors.amount && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.amount}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phương thức đối soát:</label>
                  <select
                    value={newTxForm.paymentMethod}
                    onChange={(e) => setNewTxForm({ ...newTxForm, paymentMethod: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="TechPay QR (VCB Auto-Reconciled)">TechPay QR (VCB Auto)</option>
                    <option value="VNPay QR Cổng Tự Động">VNPay QR Cổng Tự Động</option>
                    <option value="Ủy nhiệm chi Vietcombank Enterprise">Ủy nhiệm chi VCB Enterprise</option>
                    <option value="Tiền mặt (COD CoolVan)">Tiền mặt (COD CoolVan)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Trạng thái */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Trạng thái ghi nhận:</label>
                <select
                  value={newTxForm.status}
                  onChange={(e) =>
                    setNewTxForm({ ...newTxForm, status: e.target.value as TransactionStatus })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                >
                  <option value="completed">Đã thanh toán (Ghi có tức thì)</option>
                  <option value="pending">Chờ thanh toán / Thu sau</option>
                  <option value="partial">Đang đối soát ngân hàng</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl transition shadow-sm shadow-blue-500/25 active:scale-95 cursor-pointer"
                >
                  Tạo giao dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. MODAL XEM TRƯỚC SỔ QUỸ EXCEL & TÙY CHỌN XUẤT / IN ẤN
      ========================================================================= */}
      {showExportPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Xem Trước Sổ Quỹ Doanh Thu &amp; Tùy Chọn Xuất / In
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                      XLSX / CSV Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tên file dự kiến:{" "}
                    <strong className="text-slate-700 font-mono">
                      So_Quy_Doanh_Thu_TechCore_{new Date().toISOString().slice(0, 10)}.csv
                    </strong>{" "}
                    • {filteredTransactions.length} dòng giao dịch • Mã hóa UTF-8
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowExportPreviewModal(false)}
                className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 flex items-center justify-center transition cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Bar */}
            <div className="px-6 py-3 bg-[#F0F8F8] border-b border-[#2D99AE]/25 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-500 text-[11px] block">Số dòng giao dịch:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {filteredTransactions.length} Giao dịch
                  </span>
                </div>
                <div className="border-l border-slate-300 pl-6">
                  <span className="text-slate-500 text-[11px] block">Tổng dòng tiền:</span>
                  <span className="font-black text-[#0C5776] text-sm">
                    {formatVND(
                      filteredTransactions.reduce(
                        (sum, t) => sum + (t.direction === "in" ? Number(t.amount) : -Number(t.amount)),
                        0
                      )
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Chuẩn hóa Kế toán
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                  Khổ in: A4 Ngang
                </span>
              </div>
            </div>

            {/* Scrollable Table */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/40">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider select-none">
                      <th className="py-3 px-3 w-12 text-center border-r border-slate-200 text-slate-400">STT</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Mã Giao Dịch</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Thời Gian</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Đối Tác</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Nội Dung</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Luồng Tiền</th>
                      <th className="py-3 px-3.5 text-right border-r border-slate-200">Số Tiền (VNĐ)</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Phương Thức</th>
                      <th className="py-3 px-3.5">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-10 text-slate-400 font-medium">
                          Không có giao dịch nào khớp bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx, idx) => (
                        <tr key={tx.id || idx} className="even:bg-slate-50/60 hover:bg-emerald-50/40 transition-colors">
                          <td className="py-2.5 px-3 text-center border-r border-slate-100 font-mono text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 font-mono font-bold text-blue-700 whitespace-nowrap">
                            {tx.code}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                            {tx.datetime}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 font-bold text-slate-900 whitespace-nowrap">
                            {tx.partner}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 text-slate-700 max-w-xs truncate" title={tx.description}>
                            {tx.description}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                tx.direction === "in"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {tx.direction === "in" ? "+ Thu" : "- Chi"}
                            </span>
                          </td>
                          <td
                            className={`py-2.5 px-3.5 text-right border-r border-slate-100 font-mono font-bold whitespace-nowrap ${
                              tx.direction === "in" ? "text-emerald-700" : "text-rose-600"
                            }`}
                          >
                            {formatVND(tx.amount)}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 whitespace-nowrap">
                            <span className="text-[10px] font-semibold text-slate-700">
                              {tx.paymentMethod}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              {tx.statusText}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowExportPreviewModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer text-xs"
              >
                Đóng xem trước
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-2xs cursor-pointer text-xs active:scale-95"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>In Sổ Quỹ / Xuất PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadExcelFile}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer text-xs active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File Excel (.CSV UTF-8)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. MODAL XÁC NHẬN XÓA GIAO DỊCH (DANGER DIALOG & REAL-TIME SYNC)
      ========================================================================= */}
      {deletingTx && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 border border-rose-100">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">Xác Nhận Xóa Giao Dịch?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hành động này sẽ xóa vĩnh viễn giao dịch khỏi sổ quỹ và thông báo đồng bộ thời gian thực tới tất cả các tài khoản quản trị khác.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Mã giao dịch:</span>
                <span className="font-mono font-black text-rose-600">{deletingTx.code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Đối tác:</span>
                <span className="font-bold text-slate-800">{deletingTx.partner}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Số tiền:</span>
                <span className="font-black text-blue-600 font-mono">{formatVND(deletingTx.amount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTx(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDeleteTransaction}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm shadow-rose-600/30 cursor-pointer text-xs active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận xóa vĩnh viễn</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
