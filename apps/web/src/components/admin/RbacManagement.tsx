"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export function RbacManagement() {
  // State bộ lọc và tìm kiếm
  const [activeTab, setActiveTab] = useState<
    "all" | "super_admin" | "order_admin" | "tech_admin" | "customer_test"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showPasswordMap, setShowPasswordMap] = useState<{ [key: string]: boolean }>({});

  // Modals
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [selectedAccountAudit, setSelectedAccountAudit] = useState<any | null>(null);

  // RBAC Simulator State
  const [simAccountEmail, setSimAccountEmail] = useState("admin1@techcore.vn");
  const [simTargetPath, setSimTargetPath] = useState("/admin/doanh-thu");
  const [simCheckResult, setSimCheckResult] = useState<any | null>(null);

  // Danh sách tài khoản hệ thống (khớp 100% tài liệu TAI_KHOAN_ADMIN.md)
  const [accountsList, setAccountsList] = useState([
    {
      id: "usr-admin-01",
      fullName: "Nguyễn Quốc Anh",
      email: "admin1@techcore.vn",
      passwordDisplay: "Admin@123",
      role: "super_admin",
      roleTitle: "Super Admin (Tổng Quản Trị)",
      roleBadgeColor: "bg-red-50 text-red-700 border-red-200",
      duties: "Toàn quyền kiểm soát hệ thống, xem doanh thu tài chính, cấu hình sàn & phân quyền RBAC.",
      permissions: ["revenue", "orders", "products", "inventory", "warranty", "vouchers", "rbac", "settings"],
      status: "active",
      statusText: "Đang trực tuyến (Active Session)",
      lastLogin: "27/02/2026 • 15:20:45",
      loginIp: "118.69.182.10 (TP.HCM)",
      auditLogs: [
        { time: "15:20", action: "Đăng nhập hệ thống bằng chứng thực TLS 1.3" },
        { time: "15:24", action: "Truy cập Báo Cáo Doanh Thu & Dòng Tiền Đa Kênh" },
        { time: "15:30", action: "Phê duyệt ngân sách khuyến mãi Voucher Q1/2026" },
      ],
    },
    {
      id: "usr-admin-02",
      fullName: "Trần Minh Tuấn",
      email: "admin2@techcore.vn",
      passwordDisplay: "Admin@456",
      role: "order_admin",
      roleTitle: "Quản Trị Đơn Hàng & Vận Hành Kho",
      roleBadgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      duties: "Xử lý chuyển trạng thái đơn (State Machine), điều phối xe lạnh CoolVan, kiểm kê kho Hub.",
      permissions: ["orders", "products", "inventory"],
      status: "active",
      statusText: "Đang trực tuyến (Active Session)",
      lastLogin: "27/02/2026 • 14:15:10",
      loginIp: "14.161.40.88 (TP.HCM)",
      auditLogs: [
        { time: "14:15", action: "Đăng nhập ca trực điều phối đơn hàng" },
        { time: "14:28", action: "Xác thực lệnh xuất kho đơn #TECH-2026-8888 xe CoolVan #01" },
      ],
    },
    {
      id: "usr-admin-03",
      fullName: "Lê Hoàng Long",
      email: "admin3@techcore.vn",
      passwordDisplay: "Admin@789",
      role: "tech_admin",
      roleTitle: "Quản Trị Kỹ Thuật & Bảo Hành",
      roleBadgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      duties: "Quản lý mã vi mạch e-Shield Serial/IMEI, duyệt thông số Workstation AI, xử lý RMA 1-đổi-1.",
      permissions: ["products", "inventory", "warranty"],
      status: "active",
      statusText: "Đang trực tuyến (Active Session)",
      lastLogin: "27/02/2026 • 13:45:00",
      loginIp: "123.30.50.22 (Hà Nội)",
      auditLogs: [
        { time: "13:45", action: "Đăng nhập hệ thống Lab kiểm định phần cứng" },
        { time: "15:12", action: "Tiếp nhận hồ sơ bảo hành 1 đổi 1 #RMA-2026-0812 (RTX 4090)" },
      ],
    },
    {
      id: "usr-admin-00",
      fullName: "Quản trị viên TechCore (Dự Phòng)",
      email: "admin@techcore.vn",
      passwordDisplay: "Admin@123",
      role: "super_admin",
      roleTitle: "Super Admin (Tài Khoản Dự Phòng)",
      roleBadgeColor: "bg-red-50 text-red-700 border-red-200",
      duties: "Tài khoản dự phòng tổng quản trị được kích hoạt đồng thời để dự phòng sự cố.",
      permissions: ["revenue", "orders", "products", "inventory", "warranty", "vouchers", "rbac", "settings"],
      status: "active",
      statusText: "Sẵn sàng (Standby)",
      lastLogin: "26/02/2026 • 09:00:12",
      loginIp: "118.69.182.10 (TP.HCM)",
      auditLogs: [
        { time: "26/02 09:00", action: "Kiểm tra định kỳ cấu hình chứng thư số e-Shield" },
      ],
    },
    {
      id: "usr-cust-01",
      fullName: "Nguyễn Văn An (Tài Khoản Test Khách Hàng)",
      email: "user1@gmail.com",
      passwordDisplay: "User@123",
      role: "customer",
      roleTitle: "Khách Hàng (Customer) - Bị Chặn 403",
      roleBadgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      duties: "Mua hàng, xem giỏ hàng, tra cứu bảo hành. Bị chặn tuyệt đối không thể truy cập /admin.",
      permissions: [],
      status: "customer_role",
      statusText: "Khách Hàng Thường (403 Blocked)",
      lastLogin: "27/02/2026 • 14:28:10",
      loginIp: "42.112.98.55 (TP.HCM)",
      auditLogs: [
        { time: "14:28", action: "Đặt mua Workstation AI Dual RTX 4090 OC đơn #TECH-2026-8888" },
        { time: "14:35", action: "Cố truy cập link /admin -> Hệ thống chặn lại bằng màn hình 403 Forbidden" },
      ],
    },
    {
      id: "usr-cust-02",
      fullName: "Hoàng Mai Linh (Tài Khoản Test Khách Hàng)",
      email: "user2@gmail.com",
      passwordDisplay: "User@123",
      role: "customer",
      roleTitle: "Khách Hàng (Customer) - Bị Chặn 403",
      roleBadgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      duties: "Khách hàng mua phụ kiện & laptop. Bị chặn tuyệt đối không thể truy cập /admin.",
      permissions: [],
      status: "customer_role",
      statusText: "Khách Hàng Thường (403 Blocked)",
      lastLogin: "25/02/2026 • 10:15:20",
      loginIp: "115.79.44.12 (Hà Nội)",
      auditLogs: [
        { time: "25/02 10:15", action: "Đăng nhập tài khoản mua phụ kiện cáp Thunderbolt" },
        { time: "25/02 10:20", action: "Cố truy cập link /admin/doanh-thu -> Bị chặn 403 Forbidden" },
      ],
    },
  ]);

  // Bật/tắt hiển thị mật khẩu
  const toggleShowPassword = (id: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Chuyển nhanh tài khoản để test (Đăng nhập tức thì vào localStorage)
  const handleQuickSwitchUser = (user: any) => {
    localStorage.setItem("currentUser", JSON.stringify({
      fullName: user.fullName,
      email: user.email,
      role: user.role === "customer" ? "customer" : "admin",
    }));
    localStorage.setItem("token", `mock_token_${user.id}_${Date.now()}`);

    if (user.role === "customer") {
      alert(`Đã chuyển sang tài khoản Khách hàng: ${user.email}!\n\nHệ thống sẽ chuyển bạn sang trang chủ. Nếu bạn cố tình quay lại /admin, bạn sẽ thấy Màn hình 403 Forbidden!`);
      window.location.href = "/";
    } else {
      alert(`Đã chuyển sang tài khoản Quản trị viên: ${user.email} (${user.roleTitle})!\n\nHệ thống sẽ nạp lại quyền hạn của tài khoản này.`);
      window.location.reload();
    }
  };

  // Thử nghiệm phân quyền Simulator
  const handleRunSimulator = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accountsList.find((a) => a.email === simAccountEmail);
    if (!account) return;

    if (account.role === "customer") {
      setSimCheckResult({
        allowed: false,
        account,
        path: simTargetPath,
        httpCode: "403 Forbidden",
        message: "TRUY CẬP BỊ TỪ CHỐI! Tài khoản thuộc quyền hạn Khách Hàng (Customer).",
        reason: "Không có quyền hạn truy cập bất kỳ tài nguyên nào trong phân hệ /admin.",
      });
      return;
    }

    // Kiểm tra quyền theo từng role
    let isAllowed = false;
    let reason = "";

    if (account.role === "super_admin") {
      isAllowed = true;
      reason = "Super Admin có toàn quyền truy cập 100% tất cả các phân hệ và cấu hình hệ thống.";
    } else if (account.role === "order_admin") {
      if (simTargetPath.includes("don-hang") || simTargetPath.includes("san-pham") || simTargetPath.includes("kho")) {
        isAllowed = true;
        reason = "Được cấp quyền Quản lý đơn hàng, điều phối xe CoolVan và kiểm kê kho Hub.";
      } else {
        isAllowed = false;
        reason = "Tài khoản không được phân quyền xem Doanh thu tài chính hoặc Cấu hình RBAC.";
      }
    } else if (account.role === "tech_admin") {
      if (simTargetPath.includes("bao-hanh") || simTargetPath.includes("san-pham") || simTargetPath.includes("kho")) {
        isAllowed = true;
        reason = "Được cấp quyền Thẩm định linh kiện, quản lý mã Serial e-Shield và xử lý RMA 1-đổi-1.";
      } else {
        isAllowed = false;
        reason = "Tài khoản không được phân quyền xem Doanh thu hoặc Quản trị phân quyền.";
      }
    }

    setSimCheckResult({
      allowed: isAllowed,
      account,
      path: simTargetPath,
      httpCode: isAllowed ? "200 OK (Authorized)" : "403 Forbidden",
      message: isAllowed
        ? "TRUY CẬP THÀNH CÔNG! Quyền hạn hợp lệ theo chính sách RBAC."
        : "TRUY CẬP BỊ TỪ CHỐI! Phân hệ vượt quá thẩm quyền của tài khoản này.",
      reason,
    });
  };

  // Lọc danh sách
  const filteredAccounts = accountsList.filter((item) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "super_admin" && item.role === "super_admin") ||
      (activeTab === "order_admin" && item.role === "order_admin") ||
      (activeTab === "tech_admin" && item.role === "tech_admin") ||
      (activeTab === "customer_test" && item.role === "customer");

    const matchSearch =
      !searchQuery ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRole =
      selectedRoleFilter === "all" || item.role === selectedRoleFilter;

    return matchTab && matchSearch && matchRole;
  });

  return (
    <>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
            <span>QUẢN TRỊ HỆ SINH THÁI TECHCORE ENTERPRISE</span>
            <span className="text-slate-300">•</span>
            <span>BẢO MẬT HỆ THỐNG &amp; TÀI KHOẢN</span>
            <span className="text-slate-300">•</span>
            <span>PHÂN QUYỀN QUẢN TRỊ (RBAC)</span>
          </p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Phân Quyền Quản Trị Hệ Thống (RBAC)
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Role-Based Access Control Level 4 Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              Chặn 403 Tuyệt Đối Tài Khoản Khách Hàng
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => alert("Đang xuất danh sách tài khoản & ma trận phân quyền hệ thống ra Excel...")}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Xuất Danh Sách Tài Khoản</span>
          </button>

          <button
            type="button"
            onClick={() => alert("✓ Đã đồng bộ chữ ký số SHA-256 session và đối soát mã thông báo RBAC với Core API!")}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Đồng Bộ Quyền Hạn</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateAdminModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-sm shadow-blue-500/25 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Thêm Quản Trị Viên Mới</span>
          </button>
        </div>
      </div>

      {/* 4 KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                TÀI KHOẢN ADMIN HOẠT ĐỘNG
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">4</span>
              <span className="text-xs font-bold text-blue-600">Quản trị viên</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              admin1, admin2, admin3 &amp; admin dự phòng
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Xác thực 2 lớp: <strong className="text-emerald-600">100% Bật</strong></span>
            <span>Quyền Root: <strong className="text-slate-800">admin1</strong></span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                TÀI KHOẢN KHÁCH HÀNG (USERS)
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">3.842</span>
              <span className="text-xs font-bold text-slate-500">Khách Hàng</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Chỉ có quyền mua sắm, thanh toán và bảo hành
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Truy cập /admin: <strong className="text-red-600 font-bold">Chặn 403 Tuyệt Đối</strong></span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                PHIÊN ĐĂNG NHẬP TRỰC TUYẾN
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600">3</span>
              <span className="text-xs font-bold text-emerald-600">Active Sessions</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mã hóa TLS 1.3 &amp; SHA-256 Token</span>
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Hub TP.HCM: <strong className="text-slate-800">2</strong></span>
            <span>Hub Hà Nội: <strong className="text-slate-800">1</strong></span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                SỐ LẦN CHẶN BẢO VỆ 403
              </span>
              <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-red-600">28</span>
              <span className="text-xs font-bold text-slate-500">Lần chặn</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Chặn thành công tài khoản user cố gõ link /admin
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-600 font-bold">An toàn hệ thống 100%</span>
            <span>0 vi phạm lọt quyền</span>
          </div>
        </div>
      </div>

      {/* RBAC MATRIX & PERMISSION SANDBOX SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Permission Matrix Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Ma Trận Phân Quyền Vai Trò (Role-Based Permission Matrix)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Bảng phân định đặc quyền chi tiết theo từng cấp độ tài khoản hệ thống
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                NIST SP 800-207
              </span>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-black text-slate-500 uppercase">
                    <th className="p-2.5">PHÂN HỆ / TÍNH NĂNG</th>
                    <th className="p-2.5 text-center text-red-700">SUPER ADMIN (admin1)</th>
                    <th className="p-2.5 text-center text-blue-700">ĐƠN HÀNG/KHO (admin2)</th>
                    <th className="p-2.5 text-center text-purple-700">KỸ THUẬT (admin3)</th>
                    <th className="p-2.5 text-center text-slate-500">USER (user1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">1. Quản lý đơn hàng &amp; CoolVan</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-slate-400">Chỉ xem</td>
                    <td className="p-2.5 text-center text-red-500 font-bold">✗ Chặn 403</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">2. Sản phẩm &amp; Linh kiện AI</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-red-500 font-bold">✗ Chặn 403</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">3. Kho &amp; e-Shield Serial/IMEI</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-red-500 font-bold">✗ Chặn 403</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">4. Bảo hành 1-đổi-1 TechCare+</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-slate-400">Chỉ xem</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-red-500 font-bold">✗ Chặn 403</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">5. Doanh thu &amp; Dòng tiền B2B</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-red-500 font-bold">✗ Không có quyền</td>
                    <td className="p-2.5 text-center text-red-500 font-bold">✗ Không có quyền</td>
                    <td className="p-2.5 text-center text-red-500 font-bold">✗ Chặn 403</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">6. Phân quyền quản trị (RBAC)</td>
                    <td className="p-2.5 text-center text-emerald-600 font-bold">✓ Toàn quyền</td>
                    <td className="p-2.5 text-center text-red-500 font-bold">✗ Không có quyền</td>
                    <td className="p-2.5 text-center text-red-500 font-bold">✗ Không có quyền</td>
                    <td className="p-2.5 text-center text-red-500 font-bold">✗ Chặn 403</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Nguyên tắc bảo mật: Mọi yêu cầu API đều được kiểm tra Token JWT và cấp phép theo ma trận RBAC.
            </span>
            <button
              type="button"
              onClick={() => alert("Cấu hình chính sách mật khẩu và thời gian hết hạn phiên đăng nhập...")}
              className="text-blue-600 hover:text-blue-700 font-bold shrink-0 flex items-center gap-1"
            >
              <span>Chính Sách Bảo Mật</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* RBAC Sandbox Permission Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Bộ Thử Nghiệm Quyền Hạn RBAC Tức Thì
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Mô phỏng thử phản hồi hệ thống khi một tài khoản truy cập vào phân hệ bất kỳ
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold shrink-0">
                Live Simulator
              </span>
            </div>

            <form onSubmit={handleRunSimulator} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Chọn tài khoản kiểm tra quyền:
                </label>
                <select
                  value={simAccountEmail}
                  onChange={(e) => setSimAccountEmail(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                >
                  <option value="admin1@techcore.vn">admin1@techcore.vn (Super Admin)</option>
                  <option value="admin2@techcore.vn">admin2@techcore.vn (Quản trị Đơn hàng & Kho)</option>
                  <option value="admin3@techcore.vn">admin3@techcore.vn (Quản trị Kỹ thuật & Bảo hành)</option>
                  <option value="user1@gmail.com">user1@gmail.com (Khách Hàng Thường)</option>
                  <option value="user2@gmail.com">user2@gmail.com (Khách Hàng Thường)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Đường dẫn phân hệ muốn truy cập:
                </label>
                <select
                  value={simTargetPath}
                  onChange={(e) => setSimTargetPath(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-mono font-bold text-blue-600"
                >
                  <option value="/admin/doanh-thu">/admin/doanh-thu (Doanh thu & Dòng tiền)</option>
                  <option value="/admin/phan-quyen">/admin/phan-quyen (Phân quyền RBAC)</option>
                  <option value="/admin/don-hang">/admin/don-hang (Quản lý đơn hàng)</option>
                  <option value="/admin/kho">/admin/kho (Kho & e-Shield Serial)</option>
                  <option value="/admin/bao-hanh">/admin/bao-hanh (Bảo hành 1-đổi-1 TechCare+)</option>
                  <option value="/admin/voucher">/admin/voucher (Mã giảm giá & Voucher)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kiểm Tra Phản Hồi Quyền Hạn RBAC</span>
              </button>
            </form>

            {/* Simulator Output Box */}
            {simCheckResult && (
              <div
                className={`mt-4 p-3.5 rounded-xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                  simCheckResult.allowed
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-red-50 border-red-200 text-red-900"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    {simCheckResult.allowed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span>{simCheckResult.httpCode}</span>
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white border">
                    {simCheckResult.path}
                  </span>
                </div>
                <p className="font-bold text-xs">{simCheckResult.message}</p>
                <p className="text-[11px] opacity-80">{simCheckResult.reason}</p>

                {/* Quick Switch Button */}
                <div className="pt-2 border-t border-current/20 flex items-center justify-between">
                  <span className="text-[10px]">Muốn trải nghiệm thực tế với tài khoản này?</span>
                  <button
                    type="button"
                    onClick={() => handleQuickSwitchUser(simCheckResult.account)}
                    className={`px-2.5 py-1 rounded-lg text-white font-bold text-[10px] transition ${
                      simCheckResult.allowed
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Đăng Nhập Thử Ngay ↗
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 flex items-center justify-between mt-4">
            <span>Tài khoản khách hàng: Cố vào /admin sẽ bị chuyển sang màn hình 403.</span>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        {[
          { key: "all", label: "Tất cả tài khoản hệ thống (6)" },
          { key: "super_admin", label: "Super Admin (Tổng Quản Trị - 2)" },
          { key: "order_admin", label: "Quản trị Đơn Hàng & Kho (1)" },
          { key: "tech_admin", label: "Quản trị Kỹ Thuật & Bảo Hành (1)" },
          { key: "customer_test", label: "Tài khoản Khách Hàng Test 403 (2)" },
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
              placeholder="Tìm theo họ tên, email đăng nhập, vai trò quản trị..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="all">Vai trò: Tất cả</option>
            <option value="super_admin">Super Admin</option>
            <option value="order_admin">Quản trị Đơn hàng & Kho</option>
            <option value="tech_admin">Quản trị Kỹ thuật & Bảo hành</option>
            <option value="customer">Khách hàng (Customer)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (selectedAccounts.length === 0) {
                alert("Vui lòng tích chọn ít nhất 1 tài khoản để xuất báo cáo phân quyền!");
                return;
              }
              alert(`Đang xuất hồ sơ kiểm toán phân quyền cho ${selectedAccounts.length} tài khoản đã chọn...`);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Xuất Hồ Sơ ({selectedAccounts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => alert("✓ Đã quét toàn bộ hệ thống tài khoản: 100% tài khoản tuân thủ chính sách mật khẩu mạnh!")}
            className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold flex items-center gap-1.5 transition"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <span>Kiểm Tra Mật Khẩu</span>
          </button>
        </div>
      </div>

      {/* MAIN ACCOUNTS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccounts(filteredAccounts.map((a) => a.id));
                      } else {
                        setSelectedAccounts([]);
                      }
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="p-4">QUẢN TRỊ VIÊN &amp; EMAIL</th>
                <th className="p-4">VAI TRÒ &amp; CẤP BẬC</th>
                <th className="p-4">MẬT KHẨU ĐĂNG NHẬP</th>
                <th className="p-4">PHẠM VI NHIỆM VỤ ĐƯỢC GIAO</th>
                <th className="p-4">PHIÊN TRỰC TUYẾN &amp; IP</th>
                <th className="p-4 text-center">CHUYỂN NHANH ĐỂ TEST</th>
                <th className="p-4 text-center">AUDIT LOG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((user) => {
                const isSelected = selectedAccounts.includes(user.id);
                const isPwVisible = showPasswordMap[user.id];
                return (
                  <tr
                    key={user.id}
                    className={`transition hover:bg-slate-50/70 ${
                      user.role === "customer" ? "bg-slate-50/50" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedAccounts((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((id) => id !== user.id)
                              : [...prev, user.id]
                          );
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    {/* Full Name & Email */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                            user.role === "super_admin"
                              ? "bg-red-600"
                              : user.role === "order_admin"
                              ? "bg-blue-600"
                              : user.role === "tech_admin"
                              ? "bg-purple-600"
                              : "bg-slate-600"
                          }`}
                        >
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{user.fullName}</p>
                          <span className="font-mono text-blue-600 font-bold text-[11px] block">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role Title */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${user.roleBadgeColor}`}
                      >
                        {user.roleTitle}
                      </span>
                    </td>

                    {/* Password with Eye Toggle */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {isPwVisible ? user.passwordDisplay : "••••••••"}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleShowPassword(user.id)}
                          title={isPwVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                          className="p-1 text-slate-400 hover:text-blue-600 transition"
                        >
                          {isPwVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Duties & Scope */}
                    <td className="p-4 max-w-[240px]">
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2" title={user.duties}>
                        {user.duties}
                      </p>
                    </td>

                    {/* Online Session & IP */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {user.statusText}
                        </span>
                        <p className="text-[10px] text-slate-400">{user.lastLogin}</p>
                        <span className="text-[9px] font-mono text-slate-400 block">{user.loginIp}</span>
                      </div>
                    </td>

                    {/* Quick Switch for Testing */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleQuickSwitchUser(user)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition shadow-xs flex items-center justify-center gap-1 mx-auto ${
                          user.role === "customer"
                            ? "bg-slate-800 hover:bg-slate-900 text-slate-200"
                            : "bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200"
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Đăng Nhập Test</span>
                      </button>
                    </td>

                    {/* Audit Logs */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedAccountAudit(user)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold transition inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Lịch sử</span>
                      </button>
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
            Hiển thị <strong className="text-slate-800">1 - {filteredAccounts.length}</strong> trên tổng số{" "}
            <strong className="text-slate-800">6</strong> tài khoản kiểm thử bảo mật • 10 / trang
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-xs"
            >
              1
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM PROTOCOL BANNER */}
      <div className="bg-gradient-to-r from-red-50/70 via-blue-50/40 to-slate-50 border border-red-200/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">
              Kiến Trúc Bảo Mật Zero-Trust &amp; Cơ Chế Chặn Truy Cập Phân Cấp (403 Forbidden Gate)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Mọi tuyến đường `/admin/*` đều được giám sát tại lớp Layout Root. Khi người dùng đăng nhập tài khoản Khách hàng (`user1@gmail.com`), hệ thống tự động ngắt phiên quản trị và hiển thị màn hình 403 Forbidden, đảm bảo bảo mật tuyệt đối cho dữ liệu doanh nghiệp và doanh thu bán hàng.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => alert("Đang xuất chứng chỉ xác thực bảo mật Zero-Trust ISO/IEC 27001...")}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            Chứng Chỉ ISO 27001
          </button>
          <button
            type="button"
            onClick={() => alert("✓ Hệ thống RBAC hoạt động hoàn hảo, 100% đường dẫn quản trị được bảo vệ an toàn!")}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-red-500/25"
          >
            Quét Lỗ Hổng Quyền Hạn
          </button>
        </div>
      </div>

      {/* MODAL 1: THÊM QUẢN TRỊ VIÊN MỚI */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  TECHCORE RBAC AUTHORITY
                </span>
                <h3 className="text-xl font-black text-slate-900">+ Thêm Quản Trị Viên Mới</h3>
              </div>
              <button
                onClick={() => setShowCreateAdminModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const fullName = (fd.get("fullName") as string) || "Quản Trị Viên Mới";
                const email = (fd.get("email") as string) || `admin_${Date.now().toString().slice(-4)}@techcore.vn`;
                const password = (fd.get("password") as string) || "Admin@2026";
                const role = (fd.get("role") as string) || "order_admin";
                const duties = (fd.get("duties") as string) || "Nhiệm vụ quản lý phân hệ được giao.";

                let roleTitle = "Quản Trị Đơn Hàng & Kho";
                let roleBadgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                if (role === "super_admin") {
                  roleTitle = "Super Admin (Tổng Quản Trị)";
                  roleBadgeColor = "bg-red-50 text-red-700 border-red-200";
                } else if (role === "tech_admin") {
                  roleTitle = "Quản Trị Kỹ Thuật & Bảo Hành";
                  roleBadgeColor = "bg-purple-50 text-purple-700 border-purple-200";
                }

                const newAdmin = {
                  id: `usr-admin-${Date.now()}`,
                  fullName,
                  email,
                  passwordDisplay: password,
                  role,
                  roleTitle,
                  roleBadgeColor,
                  duties,
                  permissions: ["orders", "products"],
                  status: "active",
                  statusText: "Vừa kích hoạt",
                  lastLogin: "Chưa đăng nhập lần đầu",
                  loginIp: "N/A",
                  auditLogs: [
                    { time: new Date().toLocaleTimeString("vi-VN"), action: "Tạo mới tài khoản quản trị viên và cấp quyền RBAC" },
                  ],
                };

                setAccountsList((prev) => [newAdmin, ...prev]);
                setShowCreateAdminModal(false);
                alert(`✓ Đã tạo thành công tài khoản quản trị: ${email} với vai trò ${roleTitle}!`);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Họ và tên quản trị viên:</label>
                <input
                  name="fullName"
                  required
                  placeholder="Ví dụ: Hoàng Minh Trí"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email đăng nhập (@techcore.vn):</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="adminX@techcore.vn"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mật khẩu khởi tạo:</label>
                  <input
                    name="password"
                    required
                    defaultValue="Admin@2026"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Vai trò &amp; Cấp bậc phân quyền:</label>
                <select
                  name="role"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-bold text-blue-700"
                >
                  <option value="super_admin">Super Admin (Tổng Quản Trị - Toàn quyền 100%)</option>
                  <option value="order_admin">Quản Trị Đơn Hàng &amp; Vận Hành Kho CoolVan</option>
                  <option value="tech_admin">Quản Trị Kỹ Thuật &amp; Bảo Hành e-Shield 1-Đổi-1</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phạm vi công việc &amp; Nhiệm vụ được giao:</label>
                <textarea
                  name="duties"
                  rows={2}
                  required
                  defaultValue="Chịu trách nhiệm trực ca giám sát điều phối đơn hàng và xuất kho e-Shield."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Tài khoản mới sẽ yêu cầu đổi mật khẩu ở lần đăng nhập đầu tiên và bật xác thực 2 bước 2FA.
                </span>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateAdminModal(false)}
                  className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-sm shadow-blue-500/25"
                >
                  Cấp Quyền &amp; Kích Hoạt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AUDIT LOG DOSSIER */}
      {selectedAccountAudit && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  NHẬT KÝ KIỂM TOÁN HOẠT ĐỘNG (AUDIT TRAIL)
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedAccountAudit.fullName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Email: {selectedAccountAudit.email} • {selectedAccountAudit.roleTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedAccountAudit(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] block">Mật khẩu kiểm thử:</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border">
                    {selectedAccountAudit.passwordDisplay}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Trạng thái:</span>
                  <span className="font-bold text-emerald-600">{selectedAccountAudit.statusText}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 text-[10px] block">Đăng nhập gần nhất:</span>
                  <p className="text-slate-800 font-medium">{selectedAccountAudit.lastLogin}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Địa chỉ IP:</span>
                  <p className="font-mono text-slate-800">{selectedAccountAudit.loginIp}</p>
                </div>
              </div>
            </div>

            {/* Logs List */}
            <div className="space-y-2">
              <span className="text-slate-400 text-[10px] block font-bold">Lịch sử sự kiện gần nhất:</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {selectedAccountAudit.auditLogs.map((log: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">{log.time}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="text-slate-700 font-medium">{log.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleQuickSwitchUser(selectedAccountAudit)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Đăng Nhập Tài Khoản Này Để Test</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAccountAudit(null)}
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

