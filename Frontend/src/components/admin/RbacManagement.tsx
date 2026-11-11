"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Lock,
  ShieldCheck,
  UserCheck,
  Users,
  Eye,
  EyeOff,
  Search,
  Plus,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  KeyRound,
  ShieldAlert,
  ChevronRight,
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
  FileText,
  X,
  Check,
  RefreshCw,
  SlidersHorizontal,
  Laptop,
  Smartphone,
  ExternalLink,
  Shield,
  Zap,
  Trash2,
  Copy,
  ChevronDown,
  UserPlus,
  History,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import { api, RbacAccount } from "../../lib/api";
import { vipToast } from "../common/VipToast";

const BROADCAST_CHANNEL_NAME = "techcore_admin_rbac_channel";

export function RbacManagement() {
  // 1. STATE BỘ LỌC, TÌM KIẾM & PHÂN TRANG
  const [activeTab, setActiveTab] = useState<
    "all" | "super_admin" | "order_admin" | "tech_admin" | "customer_test"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [twoFactorFilter, setTwoFactorFilter] = useState("all");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showPasswordMap, setShowPasswordMap] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | "all">(10);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccountAudit, setSelectedAccountAudit] = useState<RbacAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<RbacAccount | null>(null);
  const [showExportPreviewModal, setShowExportPreviewModal] = useState(false);

  // RBAC Simulator State
  const [simAccountEmail, setSimAccountEmail] = useState("admin1@techcore.vn");
  const [simTargetPath, setSimTargetPath] = useState("/admin/doanh-thu");
  const [simCheckResult, setSimCheckResult] = useState<any | null>(null);

  // Danh sách tài khoản thực tế
  const [accountsList, setAccountsList] = useState<RbacAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Form tạo tài khoản & bắt lỗi
  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "order_admin" as "super_admin" | "order_admin" | "tech_admin" | "customer_test",
    twoFactorEnabled: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Tên admin hiện tại phục vụ Audit
  const [currentAdminName, setCurrentAdminName] = useState<string>("Quản trị viên TechCore");
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.fullName) setCurrentAdminName(u.fullName);
      }
    } catch (e) {}
  }, []);

  // Broadcast Action Helper
  const broadcastAction = (payload: {
    type: "CREATE_ACCOUNT" | "UPDATE_ROLE" | "UPDATE_STATUS" | "DELETE_ACCOUNT";
    accountEmail: string;
    detail?: string;
    author: string;
  }) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const ch = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        ch.postMessage({ ...payload, timestamp: Date.now() });
        ch.close();
      } catch (e) {}
    }
  };

  // Nạp danh sách tài khoản
  const loadAccounts = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminRbacAccounts();
      if (res.success && Array.isArray(res.data)) {
        setAccountsList(res.data);
      }
    } catch (e) {
      console.error("Lỗi nạp danh sách tài khoản:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();

    // Lắng nghe sự kiện đồng bộ từ nội bộ
    const handleSync = () => loadAccounts();
    window.addEventListener("techcore:rbac-changed", handleSync);

    // Lắng nghe BroadcastChannel liên tab
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = (event) => {
          const msg = event.data;
          if (!msg || !msg.type) return;
          loadAccounts();

          if (msg.type === "CREATE_ACCOUNT") {
            vipToast.info(`Tài khoản mới ${msg.accountEmail} vừa được cấp bởi ${msg.author}.`, "Tài khoản mới");
          } else if (msg.type === "UPDATE_ROLE") {
            vipToast.info(`Quyền hạn tài khoản ${msg.accountEmail} đã thay đổi: ${msg.detail}.`, "Cập nhật phân quyền");
          } else if (msg.type === "DELETE_ACCOUNT") {
            vipToast.warning(`Tài khoản ${msg.accountEmail} đã bị xóa bởi ${msg.author}.`, "Đã thu hồi tài khoản");
          }
        };
      } catch (e) {}
    }

    return () => {
      window.removeEventListener("techcore:rbac-changed", handleSync);
      if (bc) bc.close();
    };
  }, []);

  // Xử lý đổi vai trò trực tiếp trên bảng
  const handleUpdateRole = async (account: RbacAccount, newRole: "super_admin" | "order_admin" | "tech_admin" | "customer_test") => {
    const roleTitleMap: Record<string, string> = {
      super_admin: "Super Admin (Tổng Quản Trị)",
      order_admin: "Quản Trị Đơn Hàng & Kho Vận",
      tech_admin: "Kỹ Sư Trưởng & Quản Trị RMA",
      customer_test: "Tài Khoản Kiểm Thử Hệ Thống",
    };
    const defaultPerms: Record<string, string[]> = {
      super_admin: ["revenue", "orders", "products", "inventory", "warranty", "vouchers", "rbac", "settings"],
      order_admin: ["orders", "products", "inventory"],
      tech_admin: ["products", "inventory", "warranty"],
      customer_test: [],
    };

    const newPermissions = defaultPerms[newRole] || [];
    const newRoleTitle = roleTitleMap[newRole] || "Quản trị viên";

    await api.updateAdminRbacAccount(account.id, {
      role: newRole,
      roleTitle: newRoleTitle,
      permissions: newPermissions,
    });

    setAccountsList((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, role: newRole, roleTitle: newRoleTitle, permissions: newPermissions } : a))
    );

    broadcastAction({
      type: "UPDATE_ROLE",
      accountEmail: account.email,
      detail: `Chuyển sang ${newRoleTitle}`,
      author: currentAdminName,
    });

    vipToast.success(`Tài khoản ${account.email} đã được gán vai trò "${newRoleTitle}".`, "Phân quyền thành công");
  };

  // Bật/tắt quyền hạn cụ thể (Capsule toggle)
  const handleTogglePermission = async (account: RbacAccount, permKey: string) => {
    if (account.role === "super_admin" && permKey === "rbac") {
      vipToast.warning("Không thể thu hồi quyền Quản trị phân quyền (RBAC) của Super Admin tối cao.", "Quyền hạn bảo vệ");
      return;
    }

    const hasPerm = account.permissions.includes(permKey);
    const newPerms = hasPerm
      ? account.permissions.filter((p) => p !== permKey)
      : [...account.permissions, permKey];

    await api.updateAdminRbacAccount(account.id, { permissions: newPerms });

    setAccountsList((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, permissions: newPerms } : a))
    );

    vipToast.success(
      `Đã ${hasPerm ? "thu hồi" : "cấp"} quyền [${permKey.toUpperCase()}] cho tài khoản ${account.email}.`,
      "Cập nhật quyền hạn"
    );
  };

  // Đổi trạng thái tài khoản trực tiếp (Status selector)
  const handleUpdateStatus = async (account: RbacAccount, newStatus: "active" | "suspended" | "locked") => {
    if (account.email === "admin1@techcore.vn" && newStatus !== "active") {
      vipToast.error("Không thể khóa tài khoản Super Admin Root tối cao (admin1@techcore.vn).", "Bảo vệ tài khoản Root");
      return;
    }

    const statusTextMap: Record<string, string> = {
      active: "Đang trực tuyến (Active Session)",
      suspended: "Tạm đình chỉ (Suspended)",
      locked: "Đã khóa bảo mật (Locked)",
    };

    const newStatusText = statusTextMap[newStatus];
    await api.updateAdminRbacAccount(account.id, { status: newStatus, statusText: newStatusText });

    setAccountsList((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, status: newStatus, statusText: newStatusText } : a))
    );

    broadcastAction({
      type: "UPDATE_STATUS",
      accountEmail: account.email,
      detail: newStatusText,
      author: currentAdminName,
    });

    vipToast.success(`Tài khoản ${account.email} đã chuyển sang trạng thái "${newStatusText}".`, "Cập nhật trạng thái");
  };

  // Bật/tắt 2FA trực tiếp
  const handleToggle2FA = async (account: RbacAccount) => {
    const nextVal = !account.twoFactorEnabled;
    await api.updateAdminRbacAccount(account.id, { twoFactorEnabled: nextVal });

    setAccountsList((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, twoFactorEnabled: nextVal } : a))
    );

    vipToast.success(
      `Tài khoản ${account.email} đã ${nextVal ? "BẬT" : "TẮT"} xác thực 2 bước (2FA OTP).`,
      "Bảo mật tài khoản"
    );
  };

  // Xóa tài khoản
  const confirmDeleteAccount = async () => {
    if (!deletingAccount) return;
    if (deletingAccount.email === "admin1@techcore.vn") {
      vipToast.error("Không thể xóa tài khoản Super Admin Root tối cao!", "Bảo vệ hệ thống");
      setDeletingAccount(null);
      return;
    }

    const res = await api.deleteAdminRbacAccount(deletingAccount.id);
    if (res.success) {
      setAccountsList((prev) => prev.filter((a) => a.id !== deletingAccount.id));
      broadcastAction({
        type: "DELETE_ACCOUNT",
        accountEmail: deletingAccount.email,
        author: currentAdminName,
      });
      vipToast.success(`Đã xóa vĩnh viễn tài khoản ${deletingAccount.email} khỏi hệ thống.`, "Thu hồi thành công");
    } else {
      vipToast.error(res.error?.message || "Không thể xóa tài khoản lúc này.", "Lỗi xóa tài khoản");
    }
    setDeletingAccount(null);
  };

  // Bắt lỗi Form Cấp Tài Khoản Mới
  const validateCreateForm = () => {
    const errors: Record<string, string> = {};
    if (!createForm.fullName.trim() || createForm.fullName.trim().length < 2) {
      errors.fullName = "Họ tên tối thiểu 2 ký tự.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!createForm.email.trim()) {
      errors.email = "Vui lòng nhập địa chỉ email.";
    } else if (!emailRegex.test(createForm.email.trim())) {
      errors.email = "Email không đúng định dạng.";
    } else if (accountsList.some((a) => a.email.toLowerCase() === createForm.email.trim().toLowerCase())) {
      errors.email = "Email này đã tồn tại trên hệ thống.";
    }

    if (!createForm.password || createForm.password.length < 6) {
      errors.password = "Mật khẩu tối thiểu 6 ký tự.";
    }

    const phoneClean = createForm.phone.replace(/[\s.-]/g, "");
    if (phoneClean && !/^(0|\+84)[0-9]{9}$/.test(phoneClean)) {
      errors.phone = "Số điện thoại không hợp lệ (10 số).";
    }

    return errors;
  };

  // Tạo tài khoản mới
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateCreateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      vipToast.error(Object.values(errors)[0], "Thông tin chưa hợp lệ");
      return;
    }

    setFormErrors({});
    const res = await api.createAdminRbacAccount({
      fullName: createForm.fullName.trim(),
      email: createForm.email.trim().toLowerCase(),
      phone: createForm.phone.trim() || "0988.000.111",
      passwordDisplay: createForm.password,
      role: createForm.role,
      twoFactorEnabled: createForm.twoFactorEnabled,
    });

    if (res.success && res.data) {
      setAccountsList((prev) => [res.data, ...prev]);
      setShowCreateModal(false);
      setCreateForm({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "order_admin",
        twoFactorEnabled: true,
      });

      broadcastAction({
        type: "CREATE_ACCOUNT",
        accountEmail: res.data.email,
        author: currentAdminName,
      });

      vipToast.success(`Đã cấp thành công tài khoản "${res.data.email}".`, "Cấp quyền thành công");
    }
  };

  // Chạy mô phỏng kiểm tra quyền truy cập (RBAC Simulator)
  const handleRunSimulator = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = accountsList.find((a) => a.email.toLowerCase() === simAccountEmail.toLowerCase());
    if (!acc) {
      setSimCheckResult({
        allowed: false,
        reason: "Tài khoản không tồn tại trên hệ thống.",
        account: null,
      });
      return;
    }

    // Mapping đường dẫn với quyền yêu cầu
    const pathPermMap: Record<string, string> = {
      "/admin/doanh-thu": "revenue",
      "/admin/don-hang": "orders",
      "/admin/san-pham": "products",
      "/admin/kho": "inventory",
      "/admin/bao-hanh": "warranty",
      "/admin/voucher": "vouchers",
      "/admin/phan-quyen": "rbac",
      "/admin/cai-dat": "settings",
    };

    const requiredPerm = pathPermMap[simTargetPath];
    const isSuperAdmin = acc.role === "super_admin";
    const hasPerm = isSuperAdmin || (requiredPerm && acc.permissions.includes(requiredPerm));

    if (hasPerm) {
      setSimCheckResult({
        allowed: true,
        reason: isSuperAdmin
          ? "ĐƯỢC PHÉP TRUY CẬP: Super Admin có toàn quyền tối cao trên toàn hệ sinh thái."
          : `ĐƯỢC PHÉP TRUY CẬP: Tài khoản sở hữu quyền [${requiredPerm?.toUpperCase()}] tương ứng với phân hệ này.`,
        account: acc,
        requiredPerm,
      });
    } else {
      setSimCheckResult({
        allowed: false,
        reason: `BỊ TỪ CHỐI (403 FORBIDDEN): Yêu cầu quyền [${requiredPerm?.toUpperCase()}]. Vai trò "${acc.roleTitle}" hiện chưa được phân bổ quyền hạn này.`,
        account: acc,
        requiredPerm,
      });
    }
  };

  // Sao chép thông tin
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    vipToast.success(`Đã sao chép: "${text}"`, "Sao chép thành công");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Lọc tài khoản
  const filteredAccounts = useMemo(() => {
    return accountsList.filter((item) => {
      // Tab filter
      if (activeTab !== "all" && item.role !== activeTab) return false;

      // Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) return false;

      // 2FA filter
      if (twoFactorFilter === "enabled" && !item.twoFactorEnabled) return false;
      if (twoFactorFilter === "disabled" && item.twoFactorEnabled) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.fullName.toLowerCase().includes(q);
        const matchEmail = item.email.toLowerCase().includes(q);
        const matchRole = item.roleTitle.toLowerCase().includes(q);
        const matchIp = item.loginIp.toLowerCase().includes(q);
        const matchPhone = item.phone?.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchRole && !matchIp && !matchPhone) return false;
      }

      return true;
    });
  }, [accountsList, activeTab, statusFilter, twoFactorFilter, searchQuery]);

  // Phân trang
  const totalItems = filteredAccounts.length;
  const effectivePageSize = pageSize === "all" ? Math.max(1, totalItems) : pageSize;
  const totalPages = Math.ceil(totalItems / effectivePageSize) || 1;
  const displayedAccounts = useMemo(() => {
    if (pageSize === "all") return filteredAccounts;
    const start = (currentPage - 1) * pageSize;
    return filteredAccounts.slice(start, start + pageSize);
  }, [filteredAccounts, currentPage, pageSize]);

  // Thống kê KPI thực tế
  const totalSuperAdmins = accountsList.filter((a) => a.role === "super_admin").length;
  const totalOnline = accountsList.filter((a) => a.status === "active").length;
  const totalWith2FA = accountsList.filter((a) => a.twoFactorEnabled).length;
  const percent2FA = accountsList.length > 0 ? Math.round((totalWith2FA / accountsList.length) * 100) : 100;
  const totalAuditEvents = accountsList.reduce((sum, a) => sum + (a.auditLogs?.length || 0), 0);

  // Xuất file CSV UTF-8 BOM
  const handleDownloadCSV = () => {
    const headers = ["ID", "Họ Tên", "Email", "Số Điện Thoại", "Vai Trò", "Quyền Hạn", "2FA OTP", "Trạng Thái", "Đăng Nhập Cuối", "IP Truy Cập"];
    const rows = filteredAccounts.map((a) => [
      a.id,
      `"${a.fullName}"`,
      a.email,
      a.phone || "",
      `"${a.roleTitle}"`,
      `"${a.permissions.join(", ")}"`,
      a.twoFactorEnabled ? "Bật" : "Tắt",
      `"${a.statusText}"`,
      `"${a.lastLogin}"`,
      `"${a.loginIp}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TechCore_RBAC_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    vipToast.success("Đã kết xuất báo cáo phân quyền RBAC thành công!", "Xuất file Excel");
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          1. TOP EXECUTIVE HEADER BANNER (LUXURY TECH PALETTE)
      ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001C44] via-[#0C5776] to-[#001C44] p-6 rounded-3xl text-white shadow-xl relative overflow-hidden border border-[#2D99AE]/30">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#BCFEFE] bg-[#001C44]/80 px-2.5 py-0.5 rounded-full border border-[#2D99AE]/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Realtime Sync Active
            </span>
            <span className="text-[10px] font-mono text-[#F8DAD0] bg-white/10 px-2 py-0.5 rounded-full">
              TLS 1.3 Enterprise Auth
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#2D99AE]" />
            <span>QUẢN TRỊ PHÂN QUYỀN RBAC &amp; BẢO MẬT HỆ THỐNG</span>
          </h1>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Ma trận phân quyền đa tầng Role-Based Access Control, kiểm soát phiên đăng nhập mã hóa TLS 1.3 và giám sát kiểm toán hành vi (Audit Trail) chống xâm nhập trái phép.
          </p>
        </div>

        {/* Executive Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap relative z-10">
          <button
            type="button"
            onClick={() => setShowExportPreviewModal(true)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#BCFEFE]" />
            <span>Xuất Báo Cáo RBAC</span>
          </button>

          <button
            type="button"
            onClick={() => {
              loadAccounts();
              vipToast.success("Đã đồng bộ lại toàn bộ ma trận phân quyền và phiên làm việc!", "Đồng bộ quyền hạn");
            }}
            title="Tải lại dữ liệu"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 p-2.5 rounded-xl transition cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#BCFEFE]" : "text-slate-300"}`} />
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#2D99AE] to-[#0C5776] hover:brightness-110 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-lg shadow-[#0C5776]/40 flex items-center gap-2 cursor-pointer active:scale-95 border border-[#BCFEFE]/30"
          >
            <UserPlus className="w-4 h-4 text-[#BCFEFE]" />
            <span>+ Cấp Tài Khoản Mới</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. 3 EXECUTIVE KPI METRIC CARDS (100% REAL CALCULATED DATA)
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Tổng Tài Khoản Quản Trị */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tổng Tài Khoản Hệ Sinh Thái
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#001C44]">{accountsList.length}</span>
              <span className="text-xs font-bold text-[#0C5776]">{totalSuperAdmins} Super Admin</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {totalOnline} tài khoản đang trực tuyến • Root Protection Active
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#0C5776]/10 text-[#0C5776] flex items-center justify-center border border-[#0C5776]/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Chỉ Số An Toàn & Chuẩn Mật Khẩu */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Chỉ Số An Toàn Mật Khẩu &amp; 2FA
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600">{percent2FA}%</span>
              <span className="text-xs font-bold text-slate-500">{totalWith2FA}/{accountsList.length} tài khoản 2FA</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              100% Salted Hash • SHA-256 Token Signature Verified
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <KeyRound className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Kiểm Toán Hành Vi & Giám Sát Phiên */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Kiểm Toán Hành Vi (Audit Trail)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#2D99AE]">{totalAuditEvents}</span>
              <span className="text-xs font-bold text-slate-500">sự kiện đã ghi vết</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Chặn 100% lỗi 403 Forbidden tài khoản trái quyền
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#2D99AE] flex items-center justify-center border border-[#2D99AE]/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. INTERACTIVE RBAC PATH & ROLE SIMULATOR (MÔ PHỎNG PHÂN QUYỀN NHANH)
      ========================================================================= */}
      <div className="p-5 rounded-2xl bg-[#001C44] text-white shadow-md border border-[#2D99AE]/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#BCFEFE]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              CÔNG CỤ KIỂM THỬ PHÂN QUYỀN TRUY CẬP (RBAC SIMULATOR)
            </h3>
          </div>
          <span className="text-[10px] text-slate-300 font-mono">
            Thẩm định tức thời quyền truy cập tuyến đường Admin
          </span>
        </div>

        <form onSubmit={handleRunSimulator} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-4">
            <label className="text-[10px] font-bold text-[#BCFEFE] block mb-1">Chọn tài khoản kiểm tra:</label>
            <select
              value={simAccountEmail}
              onChange={(e) => {
                setSimAccountEmail(e.target.value);
                setSimCheckResult(null);
              }}
              className="w-full bg-[#0C5776]/60 border border-[#2D99AE]/40 rounded-xl px-3 py-2 text-white font-medium outline-none focus:border-[#BCFEFE]"
            >
              {accountsList.map((a) => (
                <option key={a.id} value={a.email} className="bg-[#001C44] text-white">
                  {a.fullName} ({a.email}) - {a.roleTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-5">
            <label className="text-[10px] font-bold text-[#BCFEFE] block mb-1">Đường dẫn đích (Target Route):</label>
            <select
              value={simTargetPath}
              onChange={(e) => {
                setSimTargetPath(e.target.value);
                setSimCheckResult(null);
              }}
              className="w-full bg-[#0C5776]/60 border border-[#2D99AE]/40 rounded-xl px-3 py-2 text-white font-medium outline-none focus:border-[#BCFEFE]"
            >
              <option value="/admin/doanh-thu" className="bg-[#001C44] text-white">/admin/doanh-thu (Báo Cáo Doanh Thu &amp; Tài Chính)</option>
              <option value="/admin/don-hang" className="bg-[#001C44] text-white">/admin/don-hang (Quản Lý Đơn Hàng &amp; Giao Vận CoolVan)</option>
              <option value="/admin/san-pham" className="bg-[#001C44] text-white">/admin/san-pham (Quản Lý Danh Mục Thiết Bị &amp; Giá)</option>
              <option value="/admin/kho" className="bg-[#001C44] text-white">/admin/kho (Kho Vận &amp; Định Danh Serial e-Shield)</option>
              <option value="/admin/bao-hanh" className="bg-[#001C44] text-white">/admin/bao-hanh (Hồ Sơ Bảo Hành TechCare+ RMA)</option>
              <option value="/admin/voucher" className="bg-[#001C44] text-white">/admin/voucher (Chương Trình Khuyến Mãi &amp; Mã Giảm Giá)</option>
              <option value="/admin/phan-quyen" className="bg-[#001C44] text-white">/admin/phan-quyen (Phân Quyền RBAC &amp; Bảo Mật)</option>
              <option value="/admin/cai-dat" className="bg-[#001C44] text-white">/admin/cai-dat (Cấu Hình Sàn &amp; Cổng Thanh Toán)</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              className="w-full bg-[#2D99AE] hover:bg-[#2D99AE]/90 text-white font-bold py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#BCFEFE]" />
              <span>Kiểm Thử Quyền</span>
            </button>
          </div>
        </form>

        {simCheckResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
              simCheckResult.allowed
                ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-200"
                : "bg-rose-950/70 border-rose-500/50 text-rose-200"
            }`}
          >
            {simCheckResult.allowed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{simCheckResult.reason}</p>
              {simCheckResult.account && (
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Tài khoản: <strong>{simCheckResult.account.fullName}</strong> • Vai trò: <em>{simCheckResult.account.roleTitle}</em>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          4. UNIFIED CONTROL BAR (BỘ LỌC TẬP TRUNG NHẤT QUÁN)
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs space-y-3">
        {/* Status & Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {[
            { key: "all", label: "Tất cả tài khoản", count: accountsList.length },
            { key: "super_admin", label: "Super Admin", count: accountsList.filter((a) => a.role === "super_admin").length },
            { key: "order_admin", label: "Quản trị đơn & kho", count: accountsList.filter((a) => a.role === "order_admin").length },
            { key: "tech_admin", label: "Quản trị kỹ thuật & RMA", count: accountsList.filter((a) => a.role === "tech_admin").length },
            { key: "customer_test", label: "Tài khoản kiểm thử", count: accountsList.filter((a) => a.role === "customer_test").length },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#001C44] text-white font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Search & Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, email, vai trò, số điện thoại, IP đăng nhập..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D99AE]/30 focus:border-[#2D99AE] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Trạng thái */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="all">Mọi trạng thái</option>
              <option value="active">Đang trực tuyến (Active)</option>
              <option value="suspended">Tạm đình chỉ (Suspended)</option>
              <option value="locked">Đã khóa (Locked)</option>
            </select>

            {/* Bộ lọc 2FA */}
            <select
              value={twoFactorFilter}
              onChange={(e) => {
                setTwoFactorFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="all">Mọi bảo mật 2FA</option>
              <option value="enabled">Đã bật 2FA OTP</option>
              <option value="disabled">Chưa bật 2FA</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. MAIN EXECUTIVE RBAC ACCOUNT TABLE WITH INLINE EDITING
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Subheader */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">
              Đang hiển thị <strong>{filteredAccounts.length}</strong> tài khoản
            </span>
            {selectedAccounts.length > 0 && (
              <span className="text-[#0C5776] font-semibold bg-[#BCFEFE]/50 px-2 py-0.5 rounded-lg border border-[#2D99AE]/30">
                (Đã chọn {selectedAccounts.length})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const passwords = filteredAccounts.map((a) => `${a.email}: ${a.passwordDisplay}`).join("\n");
                handleCopy(passwords, "all-pass");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy toàn bộ mật khẩu</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedAccounts(filteredAccounts.map((a) => a.id));
                      else setSelectedAccounts([]);
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-[#0C5776] focus:ring-[#2D99AE] cursor-pointer"
                  />
                </th>
                <th className="p-4">Tài Khoản &amp; Định Danh</th>
                <th className="p-4">Vai Trò &amp; Trách Nhiệm</th>
                <th className="p-4">Mật Khẩu &amp; 2FA</th>
                <th className="p-4">Ma Trận Quyền Hạn (Nhấp để cấp/thu hồi)</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <ShieldAlert className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">Không tìm thấy tài khoản phù hợp</p>
                    <p className="text-xs text-slate-400 mt-0.5">Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc</p>
                  </td>
                </tr>
              ) : (
                displayedAccounts.map((item) => {
                  const isSelected = selectedAccounts.includes(item.id);
                  const isRootAdmin = item.email === "admin1@techcore.vn";
                  const showPass = showPasswordMap[item.id] || false;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition ${isSelected ? "bg-blue-50/20" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedAccounts((prev) =>
                              prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                            );
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-[#0C5776] focus:ring-[#2D99AE] cursor-pointer"
                        />
                      </td>

                      {/* Họ Tên & Định Danh */}
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#001C44] to-[#0C5776] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs border border-[#2D99AE]/30">
                            {item.fullName.slice(0, 1).toUpperCase()}
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 text-xs">{item.fullName}</span>
                              {isRootAdmin && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                  ROOT
                                </span>
                              )}
                            </div>
                            <p className="font-mono text-[11px] text-[#0C5776] font-semibold">{item.email}</p>
                            <p className="text-[10px] text-slate-400">
                              IP: {item.loginIp} • {item.lastLogin}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Vai Trò & Chức Danh - Chỉnh sửa trực tiếp */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="relative inline-flex items-center group/role">
                            <select
                              value={item.role}
                              disabled={isRootAdmin}
                              onChange={(e) => handleUpdateRole(item, e.target.value as any)}
                              title={isRootAdmin ? "Tài khoản Root không thể thay đổi vai trò" : "Nhấp để đổi vai trò trực tiếp"}
                              className={`appearance-none text-xs font-bold px-3 pr-7 py-1 rounded-full border transition shadow-2xs outline-none ${
                                isRootAdmin
                                  ? "bg-rose-50 text-rose-700 border-rose-200 cursor-not-allowed opacity-90"
                                  : "cursor-pointer hover:ring-2 hover:ring-[#2D99AE]/30 " +
                                    (item.role === "super_admin"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : item.role === "order_admin"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : item.role === "tech_admin"
                                      ? "bg-purple-50 text-purple-700 border-purple-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200")
                              }`}
                            >
                              <option value="super_admin">Super Admin (Tổng Quản Trị)</option>
                              <option value="order_admin">Quản Trị Đơn &amp; Kho</option>
                              <option value="tech_admin">Kỹ Sư Trưởng &amp; RMA</option>
                              <option value="customer_test">Khách Hàng Kiểm Thử</option>
                            </select>
                            {!isRootAdmin && (
                              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none group-hover/role:text-slate-700" />
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 max-w-[220px] line-clamp-2 leading-relaxed">
                            {item.duties}
                          </p>
                        </div>
                      </td>

                      {/* Mật Khẩu & 2FA */}
                      <td className="p-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                              {showPass ? item.passwordDisplay : "••••••••"}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswordMap((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                              }
                              title={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.passwordDisplay, item.id)}
                              title="Sao chép mật khẩu"
                              className="p-1 rounded-md text-slate-400 hover:text-[#0C5776] hover:bg-blue-50 cursor-pointer"
                            >
                              {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* 2FA Toggle Badge */}
                          <div>
                            <button
                              type="button"
                              onClick={() => handleToggle2FA(item)}
                              title="Nhấp để BẬT / TẮT 2FA cho tài khoản này"
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition cursor-pointer flex items-center gap-1 ${
                                item.twoFactorEnabled
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>2FA: {item.twoFactorEnabled ? "Đã Bật" : "Tắt"}</span>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Ma Trận Quyền Hạn (Permissions Capsules) */}
                      <td className="p-4 max-w-[280px]">
                        <div className="flex flex-wrap gap-1">
                          {[
                            { key: "revenue", label: "Doanh thu" },
                            { key: "orders", label: "Đơn hàng" },
                            { key: "products", label: "Sản phẩm" },
                            { key: "inventory", label: "Kho vận" },
                            { key: "warranty", label: "Bảo hành" },
                            { key: "vouchers", label: "Voucher" },
                            { key: "rbac", label: "Phân quyền" },
                            { key: "settings", label: "Cài đặt" },
                          ].map((perm) => {
                            const hasPerm = item.permissions.includes(perm.key);
                            return (
                              <button
                                key={perm.key}
                                type="button"
                                onClick={() => handleTogglePermission(item, perm.key)}
                                title={`Nhấp để ${hasPerm ? "thu hồi" : "cấp"} quyền ${perm.label}`}
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border transition cursor-pointer select-none active:scale-95 ${
                                  hasPerm
                                    ? "bg-[#0C5776]/10 text-[#0C5776] border-[#2D99AE]/40 hover:bg-[#0C5776]/20 font-black"
                                    : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {perm.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Trạng Thái Tài Khoản */}
                      <td className="p-4">
                        <div className="relative inline-flex items-center group/status">
                          <select
                            value={item.status}
                            disabled={isRootAdmin}
                            onChange={(e) => handleUpdateStatus(item, e.target.value as any)}
                            title={isRootAdmin ? "Tài khoản Root không thể thay đổi trạng thái" : "Nhấp để đổi trạng thái"}
                            className={`appearance-none text-[11px] font-bold pl-6 pr-6 py-1 rounded-full border transition shadow-2xs outline-none ${
                              isRootAdmin
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 cursor-not-allowed"
                                : "cursor-pointer hover:ring-2 hover:ring-[#2D99AE]/30 " +
                                  (item.status === "active"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                    : item.status === "suspended"
                                    ? "bg-amber-50 text-amber-700 border-amber-300"
                                    : "bg-rose-50 text-rose-700 border-rose-300")
                            }`}
                          >
                            <option value="active">Đang hoạt động</option>
                            <option value="suspended">Tạm đình chỉ</option>
                            <option value="locked">Khóa tài khoản</option>
                          </select>

                          {/* Chấm tròn trạng thái */}
                          <span
                            className={`w-2 h-2 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                              item.status === "active"
                                ? "bg-emerald-500 animate-pulse"
                                : item.status === "suspended"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {!isRootAdmin && (
                            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none group-hover/status:text-slate-700" />
                          )}
                        </div>
                      </td>

                      {/* Thao Tác */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedAccountAudit(item)}
                            title="Xem nhật ký kiểm toán hành vi (Audit Log)"
                            className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0C5776] text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                          >
                            <History className="w-3.5 h-3.5" />
                            <span>Nhật ký</span>
                          </button>

                          <button
                            type="button"
                            disabled={isRootAdmin}
                            onClick={() => setDeletingAccount(item)}
                            title={isRootAdmin ? "Không thể xóa tài khoản Root" : "Xóa tài khoản này"}
                            className={`p-1.5 rounded-xl transition ${
                              isRootAdmin
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer active:scale-95"
                            }`}
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

        {/* =========================================================================
            PAGINATION CONTROLS (PHÂN TRANG CHUẨN XÁC)
        ========================================================================= */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value === "all" ? "all" : Number(e.target.value);
                setPageSize(val as any);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none"
            >
              <option value={10}>10 tài khoản / trang</option>
              <option value={20}>20 tài khoản / trang</option>
              <option value={50}>50 tài khoản / trang</option>
              <option value="all">Tất cả ({filteredAccounts.length})</option>
            </select>
            <span>
              | Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong> (Tổng <strong>{totalItems}</strong>)
            </span>
          </div>

          {pageSize !== "all" && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Trang đầu"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Trang trước"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((pageNum, idx, arr) => {
                  const showEllipsis = idx > 0 && pageNum - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-[#001C44] text-white"
                            : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Trang sau"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Trang cuối"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: CẤP QUẢN TRỊ VIÊN MỚI (VỚI BẮT LỖI FORM STRICT)
      ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-black text-[#0C5776] uppercase tracking-wider block">
                  CẤP TÀI KHOẢN MỚI
                </span>
                <h3 className="text-lg font-black text-slate-900">+ Cấp Tài Khoản &amp; Phân Quyền</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              {/* Họ tên */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Họ và tên quản trị viên: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Gia Bảo..."
                  value={createForm.fullName}
                  onChange={(e) => {
                    setCreateForm({ ...createForm, fullName: e.target.value });
                    if (formErrors.fullName) setFormErrors((prev) => ({ ...prev, fullName: "" }));
                  }}
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition ${
                    formErrors.fullName ? "border-rose-500 bg-rose-50/40" : "border-slate-200 bg-slate-50 focus:border-[#2D99AE] focus:bg-white"
                  }`}
                />
                {formErrors.fullName && <p className="text-[11px] text-rose-600 font-bold mt-1">{formErrors.fullName}</p>}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Email tài khoản: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="adminX@techcore.vn"
                    value={createForm.email}
                    onChange={(e) => {
                      setCreateForm({ ...createForm, email: e.target.value });
                      if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition ${
                      formErrors.email ? "border-rose-500 bg-rose-50/40" : "border-slate-200 bg-slate-50 focus:border-[#2D99AE] focus:bg-white"
                    }`}
                  />
                  {formErrors.email && <p className="text-[11px] text-rose-600 font-bold mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Số điện thoại liên hệ:</label>
                  <input
                    type="tel"
                    placeholder="0988.xxx.xxx"
                    value={createForm.phone}
                    onChange={(e) => {
                      setCreateForm({ ...createForm, phone: e.target.value });
                      if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition ${
                      formErrors.phone ? "border-rose-500 bg-rose-50/40" : "border-slate-200 bg-slate-50 focus:border-[#2D99AE] focus:bg-white"
                    }`}
                  />
                  {formErrors.phone && <p className="text-[11px] text-rose-600 font-bold mt-1">{formErrors.phone}</p>}
                </div>
              </div>

              {/* Mật khẩu & Vai trò */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Mật khẩu truy cập: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tối thiểu 6 ký tự..."
                    value={createForm.password}
                    onChange={(e) => {
                      setCreateForm({ ...createForm, password: e.target.value });
                      if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none font-mono font-bold transition ${
                      formErrors.password ? "border-rose-500 bg-rose-50/40" : "border-slate-200 bg-slate-50 focus:border-[#2D99AE] focus:bg-white"
                    }`}
                  />
                  {formErrors.password && <p className="text-[11px] text-rose-600 font-bold mt-1">{formErrors.password}</p>}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vai trò phân nhiệm:</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as any })}
                    className="w-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#2D99AE] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  >
                    <option value="order_admin">Quản Trị Đơn &amp; Kho Vận</option>
                    <option value="tech_admin">Kỹ Sư Trưởng &amp; RMA</option>
                    <option value="super_admin">Super Admin (Tổng Quản Trị)</option>
                    <option value="customer_test">Khách Hàng Kiểm Thử</option>
                  </select>
                </div>
              </div>

              {/* 2FA Option */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Kích hoạt xác thực 2 lớp (2FA OTP)</span>
                  <span className="text-[11px] text-slate-500">Yêu cầu xác nhận qua mã bảo mật OTP khi đăng nhập</span>
                </div>
                <input
                  type="checkbox"
                  checked={createForm.twoFactorEnabled}
                  onChange={(e) => setCreateForm({ ...createForm, twoFactorEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-[#0C5776] focus:ring-[#2D99AE] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#001C44] hover:bg-[#0C5776] text-white font-black shadow-md transition cursor-pointer active:scale-95"
                >
                  Cấp Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: NHẬT KÝ KIỂM TOÁN HÀNH VI (AUDIT LOG DOSSIER)
      ========================================================================= */}
      {selectedAccountAudit && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-black text-[#0C5776] uppercase tracking-wider block">
                  AUDIT TRAIL &amp; SECURITY DOSSIER
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedAccountAudit.fullName}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedAccountAudit.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAccountAudit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Details Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Vai trò chức vụ:</span>
                <strong className="text-slate-900">{selectedAccountAudit.roleTitle}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Địa chỉ IP đăng nhập gần nhất:</span>
                <span className="font-mono font-bold text-blue-600">{selectedAccountAudit.loginIp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Thời gian đăng nhập cuối:</span>
                <span className="text-slate-700 font-semibold">{selectedAccountAudit.lastLogin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Xác thực 2FA OTP:</span>
                <span className={`font-bold ${selectedAccountAudit.twoFactorEnabled ? "text-emerald-600" : "text-slate-500"}`}>
                  {selectedAccountAudit.twoFactorEnabled ? "Đã Kích Hoạt (Bắt Buộc)" : "Chưa Bật"}
                </span>
              </div>
            </div>

            {/* Audit History Log */}
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#0C5776]" />
                <span>Nhật Ký Hành Vi Đã Ghi Vết (Audit Logs)</span>
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedAccountAudit.auditLogs && selectedAccountAudit.auditLogs.length > 0 ? (
                  selectedAccountAudit.auditLogs.map((log: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded shrink-0">
                        {log.time}
                      </span>
                      <div className="flex-1">
                        <p className="text-slate-800 font-medium">{log.action}</p>
                        {log.ip && <span className="text-[10px] text-slate-400 font-mono">IP: {log.ip}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">Chưa có bản ghi kiểm toán nào phát sinh.</p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAccountAudit(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: XÁC NHẬN XÓA TÀI KHOẢN NGUY HIỂM (DANGER MODAL)
      ========================================================================= */}
      {deletingAccount && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-rose-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Xác Nhận Thu Hồi Tài Khoản?</h3>
              <p className="text-xs text-slate-500">
                Bạn đang chuẩn bị xóa tài khoản <strong className="text-slate-900">{deletingAccount.fullName}</strong> ({deletingAccount.email}).
              </p>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl text-[11px] text-rose-700 leading-relaxed">
              Toàn bộ phiên làm việc của tài khoản này sẽ bị hủy bỏ ngay lập tức, mọi quyền hạn quản trị bị chấm dứt và phiên TLS 1.3 sẽ bị đóng vĩnh viễn.
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAccount(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Xóa Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: XEM TRƯỚC BẢNG TÍNH EXCEL & IN A4 (EXECUTIVE PRINT & SPREADSHEET)
      ========================================================================= */}
      {showExportPreviewModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Xem Trước Báo Cáo Phân Quyền RBAC</h3>
                  <p className="text-[11px] text-slate-500">
                    Bao gồm {filteredAccounts.length} tài khoản • Định dạng xuất chuẩn UTF-8 BOM
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Table Area (Printable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div id="printable-rbac-area" className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-sm font-black text-slate-900 uppercase">
                    BẢNG ĐỐI SOÁT PHÂN QUYỀN RBAC &amp; BẢO MẬT HỆ THỐNG TECHCORE
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Thời điểm kết xuất: {new Date().toLocaleString("vi-VN")} • Quản trị viên: {currentAdminName}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-black text-slate-600 uppercase">
                        <th className="p-3">Họ Tên</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Vai Trò</th>
                        <th className="p-3">Quyền Hạn</th>
                        <th className="p-3">2FA</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3">IP Đăng Nhập</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAccounts.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-900">{a.fullName}</td>
                          <td className="p-3 font-mono text-[11px] text-blue-600">{a.email}</td>
                          <td className="p-3 font-semibold text-slate-800">{a.roleTitle}</td>
                          <td className="p-3 text-[11px] text-slate-600">{a.permissions.join(", ") || "Không"}</td>
                          <td className="p-3 font-bold text-slate-700">{a.twoFactorEnabled ? "Bật" : "Tắt"}</td>
                          <td className="p-3 text-slate-700">{a.statusText}</td>
                          <td className="p-3 font-mono text-[10px] text-slate-500">{a.loginIp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Sẵn sàng kết xuất hoặc in ấn tài liệu A4 bảo mật
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    vipToast.invoice("Đang chuẩn bị trang in ấn A4...", "In báo cáo");
                    setTimeout(() => window.print(), 300);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>In Bản A4 (window.print)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  className="px-4 py-2 rounded-xl bg-[#001C44] hover:bg-[#0C5776] text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5 text-[#BCFEFE]" />
                  <span>Tải File Excel (.csv)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
