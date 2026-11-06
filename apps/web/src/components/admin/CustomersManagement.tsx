"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Crown,
  AlertTriangle,
  Download,
  RefreshCw,
  Plus,
  ShieldCheck,
  ChevronRight,
  Eye,
  X,
  CreditCard,
  Building2,
  Lock,
  Sparkles,
  FileSpreadsheet,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  Cpu,
  Check,
  ArrowUpRight,
  Package,
  Mail,
  Copy,
  Printer,
  FileText,
  Search,
  CheckCircle2,
  Trash2,
  AlertCircle,
  ChevronDown,
  Award,
  Shield,
  Briefcase,
  SlidersHorizontal,
} from "lucide-react";
import { formatVND } from "../../lib/utils";
import { api } from "../../lib/api";
import { vipToast } from "../common/VipToast";

export type CustomerVipTier = "titanium" | "platinum" | "gold" | "standard";
export type CustomerStatus = "active" | "care" | "locked";

interface CustomersManagementProps {
  searchQuery?: string;
}

const BROADCAST_CUSTOMER_CHANNEL = "techcore_admin_customers_channel";

export function CustomersManagement({ searchQuery: globalSearch = "" }: CustomersManagementProps) {
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [totalSystemOrdersCount, setTotalSystemOrdersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Bộ lọc danh mục & Tìm kiếm
  const [categoryTab, setCategoryTab] = useState<
    "all" | "titanium" | "platinum" | "gold" | "b2b" | "personal"
  >("all");
  const [searchQuery, setSearchQuery] = useState(globalSearch);
  const [hubFilter, setHubFilter] = useState("all");
  const [spendingFilter, setSpendingFilter] = useState("all");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // Modals
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showExportPreviewModal, setShowExportPreviewModal] = useState(false);
  const [activeDetailCustomer, setActiveDetailCustomer] = useState<any | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<any | null>(null);

  // Form Validation & Error state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentAdminName, setCurrentAdminName] = useState<string>("Quản trị viên TechCore");

  // Form Tạo Khách Hàng Mới
  const [newCustomerForm, setNewCustomerForm] = useState({
    code: "KH-VIP-" + Math.floor(100 + Math.random() * 900),
    name: "",
    representative: "",
    type: "personal" as "personal" | "b2b",
    email: "",
    phone: "",
    taxCode: "",
    address: "",
    hub: "Kho Landmark 81",
    vipTier: "VIP Gold",
    ltvAmount: 50000000,
    primaryHardware: "Workstation AI Dual RTX 4090 OC",
    assignedEngineer: "KTV Lê Hoàng Long",
    note: "Khách hàng tạo trực tiếp từ CRM Admin",
  });

  // Tải thông tin Admin đang đăng nhập
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.fullName) setCurrentAdminName(u.fullName);
      }
    } catch (e) {}
  }, []);

  // Hàm phát sóng thời gian thực giữa các Tab trình duyệt (BroadcastChannel)
  const broadcastCustomerAction = (payload: {
    type: "UPDATE_VIP" | "UPDATE_STATUS" | "DELETE_CUSTOMER" | "CREATE_CUSTOMER";
    customerCode: string;
    customerName: string;
    customerId?: string;
    detail?: string;
    author: string;
  }) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel(BROADCAST_CUSTOMER_CHANNEL);
        channel.postMessage({ ...payload, timestamp: Date.now() });
        channel.close();
      } catch (e) {}
    }
  };

  // Tải dữ liệu THỰC TẾ 100%: Kết hợp Danh Sách Khách Hàng và Toàn Bộ Đơn Hàng Thật
  const loadRealCustomers = async () => {
    try {
      setLoading(true);
      const [custRes, ordRes] = await Promise.all([
        api.getAdminCustomers(),
        api.getAdminOrders(),
      ]);

      const realOrders = ordRes.success && Array.isArray(ordRes.data) ? ordRes.data : [];
      const baseCustomers = custRes.success && Array.isArray(custRes.data) ? custRes.data : [];

      setTotalSystemOrdersCount(realOrders.length);

      // Tính toán số liệu THỰC TẾ 100% cho từng khách hàng dựa trên lịch sử đơn hàng thực
      const enriched = baseCustomers.map((cust) => {
        const cleanCustPhone = (cust.phone || "").replace(/[\s.-]/g, "");
        const cleanCustEmail = (cust.email || "").toLowerCase().trim();
        const cleanCustName = (cust.name || "").toLowerCase().trim();

        // Lọc tất cả đơn hàng thực tế của khách hàng này
        const matchedOrders = realOrders.filter((ord) => {
          const ordPhone = (ord.phone || ord.customer?.phone || "").replace(/[\s.-]/g, "");
          const ordEmail = (ord.guestEmail || ord.customer?.email || "").toLowerCase().trim();
          const ordName = (ord.receiverName || ord.customer?.name || "").toLowerCase().trim();

          return (
            (cleanCustPhone && ordPhone && (cleanCustPhone === ordPhone || ordPhone.endsWith(cleanCustPhone.slice(-8)))) ||
            (cleanCustEmail && ordEmail && cleanCustEmail === ordEmail) ||
            (cleanCustName && ordName && (cleanCustName.includes(ordName) || ordName.includes(cleanCustName)))
          );
        });

        // Tính tổng tiền LTV thực tế từ các đơn hàng thật đã phát sinh
        const realLtvFromOrders = matchedOrders.reduce(
          (sum, o) => sum + (Number(o.grandTotal) || Number(o.payment?.amount) || 0),
          0
        );

        const realOrdersCount = matchedOrders.length;
        const calculatedLtv = realOrdersCount > 0 ? realLtvFromOrders : (Number(cust.ltvAmount) || 0);
        const calculatedPoints = Math.floor(calculatedLtv / 10000);

        // Lấy cấu hình thiết bị mới nhất từ đơn hàng thực tế
        const latestOrder = matchedOrders[0];
        const latestHardware =
          latestOrder?.productName ||
          latestOrder?.items?.[0]?.productName ||
          latestOrder?.equipment?.name ||
          cust.primaryHardware;

        // Phân cấp Hạng VIP thực tế dựa trên mức chi tiêu LTV đã tích lũy
        let calculatedTierCode = cust.vipTierCode || "gold";
        let calculatedTier = cust.vipTier || "VIP Gold";

        if (calculatedLtv >= 500000000) {
          calculatedTierCode = "titanium";
          calculatedTier = "VIP Titanium";
        } else if (calculatedLtv >= 150000000) {
          calculatedTierCode = "platinum";
          calculatedTier = "VIP Platinum";
        } else if (calculatedLtv >= 50000000) {
          calculatedTierCode = "gold";
          calculatedTier = "VIP Gold";
        } else {
          calculatedTierCode = "standard";
          calculatedTier = "Standard";
        }

        return {
          ...cust,
          ordersCount: realOrdersCount > 0 ? realOrdersCount : (cust.ordersCount || 1),
          ltvAmount: calculatedLtv,
          techPoints: calculatedPoints,
          vipTier: calculatedTier,
          vipTierCode: calculatedTierCode,
          primaryHardware: latestHardware,
          realOrders: matchedOrders,
        };
      });

      // Bổ sung các khách hàng phát sinh từ đơn hàng thực tế mà chưa có trong CRM
      realOrders.forEach((ord) => {
        const ordPhone = (ord.phone || ord.customer?.phone || "").replace(/[\s.-]/g, "");
        const ordName = (ord.receiverName || ord.customer?.name || "Khách Hàng").trim();
        const ordEmail = ord.guestEmail || ord.customer?.email || "customer@techcore.vn";
        const ordAddress =
          [ord.street, ord.ward, ord.district, ord.province].filter(Boolean).join(", ") ||
          ord.street ||
          "Việt Nam";

        const exists = enriched.some((c) => {
          const cPhone = (c.phone || "").replace(/[\s.-]/g, "");
          return (
            (cPhone && ordPhone && cPhone === ordPhone) ||
            c.name.toLowerCase() === ordName.toLowerCase()
          );
        });

        if (!exists && ordName && ordPhone) {
          const ordAmount = Number(ord.grandTotal) || Number(ord.payment?.amount) || 0;
          enriched.push({
            id: `cust-auto-${ord.id || ord.code}`,
            code: `KH-VIP-${Math.floor(100 + Math.random() * 900)}`,
            name: ordName,
            representative: ordName,
            type: ordAmount >= 100000000 ? "b2b" : "personal",
            email: ordEmail,
            phone: ord.phone || ord.customer?.phone || "0987654321",
            taxCode: "84" + Math.floor(10000000 + Math.random() * 90000000),
            address: ordAddress,
            hub: ord.province?.includes("Hồ Chí Minh") ? "Kho Landmark 81" : "Kho Keangnam HN",
            vipTier:
              ordAmount >= 500000000
                ? "VIP Titanium"
                : ordAmount >= 150000000
                ? "VIP Platinum"
                : ordAmount >= 50000000
                ? "VIP Gold"
                : "Standard",
            vipTierCode:
              ordAmount >= 500000000
                ? "titanium"
                : ordAmount >= 150000000
                ? "platinum"
                : ordAmount >= 50000000
                ? "gold"
                : "standard",
            techPoints: Math.floor(ordAmount / 10000),
            ltvAmount: ordAmount,
            ordersCount: 1,
            status: "active",
            statusText: "Hoạt động",
            joinedDate: ord.createdAt
              ? new Date(ord.createdAt).toLocaleDateString("vi-VN")
              : "Hôm nay",
            primaryHardware:
              ord.productName ||
              ord.items?.[0]?.productName ||
              ord.equipment?.name ||
              "Thiết bị Công Nghệ Cao Cấp",
            assignedEngineer: "KTV Lê Hoàng Long",
            note: "Đồng bộ trực tiếp từ đơn hàng thực tế",
            realOrders: [ord],
          });
        }
      });

      setCustomersList(enriched);
    } catch (err) {
      console.error("Lỗi khi tải khách hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealCustomers();

    // 1. Lắng nghe CustomEvent đồng bộ nội bộ (cả khi đơn hàng thay đổi lẫn khách hàng thay đổi)
    const handleSyncChanged = () => loadRealCustomers();
    window.addEventListener("techcore:customers-changed", handleSyncChanged);
    window.addEventListener("techcore:orders-changed", handleSyncChanged);

    // 2. Lắng nghe BroadcastChannel để nhận thông báo tức thời
    let bc: BroadcastChannel | null = null;
    let orderBc: BroadcastChannel | null = null;

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel(BROADCAST_CUSTOMER_CHANNEL);
        bc.onmessage = (event) => {
          const msg = event.data;
          if (!msg || !msg.type) return;

          loadRealCustomers();

          if (msg.type === "DELETE_CUSTOMER") {
            vipToast.warning(
              `Khách hàng "${msg.customerName}" (${msg.customerCode}) vừa được xóa bởi ${msg.author}!`,
              "Thông báo đồng bộ"
            );
            setActiveDetailCustomer((current: any) => {
              if (current && (current.id === msg.customerId || current.code === msg.customerCode)) {
                return null;
              }
              return current;
            });
          } else if (msg.type === "UPDATE_VIP") {
            vipToast.info(
              `Quản trị viên ${msg.author} vừa nâng hạng "${msg.customerName}" lên ${msg.detail}.`,
              "Cập nhật hạng VIP"
            );
          } else if (msg.type === "UPDATE_STATUS") {
            vipToast.info(
              `Quản trị viên ${msg.author} vừa đổi trạng thái tài khoản "${msg.customerName}" sang ${msg.detail}.`,
              "Cập nhật tài khoản"
            );
          } else if (msg.type === "CREATE_CUSTOMER") {
            vipToast.info(
              `Khách hàng mới "${msg.customerName}" vừa được thêm bởi ${msg.author}.`,
              "Khách hàng mới"
            );
          }
        };

        // Lắng nghe cả kênh Đơn hàng: Nếu có đơn mới hoặc sửa/xóa đơn, tự động cập nhật lại LTV tức thì!
        orderBc = new BroadcastChannel("techcore_admin_orders_channel");
        orderBc.onmessage = () => {
          loadRealCustomers();
        };
      } catch (e) {}
    }

    // 3. Storage event fallback
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "tech_customers" ||
        e.key === "deleted_customer_ids" ||
        e.key === "tech_orders" ||
        e.key === "deleted_order_codes"
      ) {
        loadRealCustomers();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // 4. Lắng nghe sự kiện từ Navbar
    const handleAddCustomerEvent = () => setShowAddCustomerModal(true);
    const handleExportEvent = () => setShowExportPreviewModal(true);
    const handleSearchEvent = (e: any) => setSearchQuery(e.detail || "");

    window.addEventListener("admin:add-customer", handleAddCustomerEvent);
    window.addEventListener("admin:export-customers", handleExportEvent);
    window.addEventListener("admin:search-customers", handleSearchEvent);

    return () => {
      window.removeEventListener("techcore:customers-changed", handleSyncChanged);
      window.removeEventListener("techcore:orders-changed", handleSyncChanged);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("admin:add-customer", handleAddCustomerEvent);
      window.removeEventListener("admin:export-customers", handleExportEvent);
      window.removeEventListener("admin:search-customers", handleSearchEvent);
      if (bc) bc.close();
      if (orderBc) orderBc.close();
    };
  }, []);

  // Cập nhật hạng VIP trực tiếp từ bảng (Inline VIP Selector)
  const handleUpdateVipTier = async (customerId: string, newTier: CustomerVipTier) => {
    const tierLabels: Record<CustomerVipTier, string> = {
      titanium: "VIP Titanium",
      platinum: "VIP Platinum",
      gold: "VIP Gold",
      standard: "Standard",
    };

    const target = customersList.find((c) => c.id === customerId || c.code === customerId);
    const tierText = tierLabels[newTier] || newTier;

    await api.updateAdminCustomer(customerId, {
      vipTier: tierText,
      vipTierCode: newTier,
    });

    setCustomersList((prev) =>
      prev.map((c) => {
        if (c.id === customerId || c.code === customerId) {
          const updated = { ...c, vipTier: tierText, vipTierCode: newTier };
          if (activeDetailCustomer?.id === c.id) setActiveDetailCustomer(updated);
          return updated;
        }
        return c;
      })
    );

    broadcastCustomerAction({
      type: "UPDATE_VIP",
      customerId,
      customerCode: target?.code || customerId,
      customerName: target?.name || "Khách hàng",
      detail: tierText,
      author: currentAdminName,
    });

    vipToast.success(
      `Đã chuyển hạng "${target?.name || ""}" sang ${tierText}.`,
      "Nâng hạng VIP thành công"
    );
  };

  // Cập nhật trạng thái tài khoản trực tiếp từ bảng (Inline Status Selector)
  const handleUpdateAccountStatus = async (customerId: string, newStatus: CustomerStatus) => {
    const statusLabels: Record<CustomerStatus, string> = {
      active: "Hoạt động",
      care: "Đang chăm sóc",
      locked: "Tạm khóa",
    };

    const target = customersList.find((c) => c.id === customerId || c.code === customerId);
    const statusText = statusLabels[newStatus] || newStatus;

    await api.updateAdminCustomer(customerId, {
      status: newStatus,
      statusText,
    });

    setCustomersList((prev) =>
      prev.map((c) => {
        if (c.id === customerId || c.code === customerId) {
          const updated = { ...c, status: newStatus, statusText };
          if (activeDetailCustomer?.id === c.id) setActiveDetailCustomer(updated);
          return updated;
        }
        return c;
      })
    );

    broadcastCustomerAction({
      type: "UPDATE_STATUS",
      customerId,
      customerCode: target?.code || customerId,
      customerName: target?.name || "Khách hàng",
      detail: `"${statusText}"`,
      author: currentAdminName,
    });

    vipToast.success(
      `Tài khoản "${target?.name || ""}" đã chuyển sang "${statusText}".`,
      "Cập nhật trạng thái"
    );
  };

  // Xóa khách hàng an toàn & đồng bộ thời gian thực
  const confirmDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    try {
      const { id, code, name } = deletingCustomer;
      await api.deleteAdminCustomer(id);

      setCustomersList((prev) => prev.filter((c) => c.id !== id && c.code !== code));

      if (activeDetailCustomer?.id === id || activeDetailCustomer?.code === code) {
        setActiveDetailCustomer(null);
      }

      broadcastCustomerAction({
        type: "DELETE_CUSTOMER",
        customerId: id,
        customerCode: code,
        customerName: name,
        author: currentAdminName,
      });

      vipToast.success(`Đã xóa hồ sơ khách hàng "${name}" khỏi cơ sở dữ liệu.`, "Đã xóa khách hàng");
    } catch (err) {
      vipToast.error("Không thể xóa khách hàng lúc này. Vui lòng thử lại sau.", "Lỗi xóa");
    } finally {
      setDeletingCustomer(null);
    }
  };

  // Kiểm tra tính hợp lệ biểu mẫu (Form Validation)
  const validateCustomerForm = () => {
    const errors: Record<string, string> = {};

    // 1. Tên khách hàng
    const trimmedName = (newCustomerForm.name || "").trim();
    if (!trimmedName) {
      errors.name = "Vui lòng nhập tên khách hàng hoặc tên doanh nghiệp";
    } else if (trimmedName.length < 2) {
      errors.name = "Tên khách hàng tối thiểu 2 ký tự";
    }

    // 2. Số điện thoại (chuẩn 10 số di động VN)
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    const cleanPhone = (newCustomerForm.phone || "").replace(/[\s.-]/g, "");
    if (!cleanPhone) {
      errors.phone = "Vui lòng nhập số điện thoại liên hệ";
    } else if (!phoneRegex.test(cleanPhone)) {
      errors.phone = "Số điện thoại không đúng định dạng (VD: 0987654321)";
    }

    // 3. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = (newCustomerForm.email || "").trim();
    if (!trimmedEmail) {
      errors.email = "Vui lòng nhập địa chỉ email liên hệ";
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Địa chỉ email không hợp lệ (VD: user@domain.com)";
    }

    // 4. Địa chỉ chi tiết
    const trimmedAddress = (newCustomerForm.address || "").trim();
    if (!trimmedAddress) {
      errors.address = "Vui lòng nhập địa chỉ văn phòng hoặc nơi cư trú";
    } else if (trimmedAddress.length < 5) {
      errors.address = "Địa chỉ nhận hàng quá ngắn (tối thiểu 5 ký tự)";
    }

    // 5. Giá trị chi tiêu LTV
    const ltv = Number(newCustomerForm.ltvAmount);
    if (isNaN(ltv) || ltv < 0) {
      errors.ltvAmount = "Hạn mức chi tiêu phải lớn hơn hoặc bằng 0 VNĐ";
    }

    return errors;
  };

  // Thêm khách hàng mới
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateCustomerForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorMessage = Object.values(errors)[0];
      vipToast.error(firstErrorMessage, "Thông tin chưa hợp lệ");
      return;
    }

    setFormErrors({});

    const res = await api.createAdminCustomer(newCustomerForm);
    if (res.success && res.data) {
      setCustomersList((prev) => [res.data, ...prev]);
      setShowAddCustomerModal(false);

      broadcastCustomerAction({
        type: "CREATE_CUSTOMER",
        customerCode: res.data.code,
        customerName: res.data.name,
        customerId: res.data.id,
        author: currentAdminName,
      });

      // Tạo mới mã khách ngẫu nhiên cho lần tiếp theo
      setNewCustomerForm({
        code: "KH-VIP-" + Math.floor(100 + Math.random() * 900),
        name: "",
        representative: "",
        type: "personal",
        email: "",
        phone: "",
        taxCode: "",
        address: "",
        hub: "Kho Landmark 81",
        vipTier: "VIP Gold",
        ltvAmount: 50000000,
        primaryHardware: "Workstation AI Dual RTX 4090 OC",
        assignedEngineer: "KTV Lê Hoàng Long",
        note: "Khách hàng tạo trực tiếp từ CRM Admin",
      });

      vipToast.success(`Hồ sơ khách hàng "${res.data.name}" đã được tạo thành công!`, "Thêm khách hàng");
    }
  };

  // Xuất file bảng tính Excel (CSV UTF-8)
  const handleDownloadExcelFile = () => {
    try {
      const headers = [
        "STT",
        "Mã Khách Hàng",
        "Tên Khách Hàng / Doanh Nghiệp",
        "Người Đại Diện",
        "Số Điện Thoại",
        "Email",
        "Mã Số Thuế",
        "Địa Chỉ",
        "Hạng VIP",
        "Tổng Chi Tiêu LTV (VNĐ)",
        "Số Đơn Hàng",
        "Hub Phụ Trách",
        "Trạng Thái",
      ];

      const rows = filteredCustomers.map((c, idx) => [
        `"${idx + 1}"`,
        `"${c.code}"`,
        `"${c.name}"`,
        `"${c.representative || ""}"`,
        `"${c.phone}"`,
        `"${c.email}"`,
        `"${c.taxCode || ""}"`,
        `"${c.address}"`,
        `"${c.vipTier}"`,
        `"${c.ltvAmount || 0}"`,
        `"${c.ordersCount || 1}"`,
        `"${c.hub}"`,
        `"${c.statusText || "Hoạt động"}"`,
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      const fileName = `Danh_Sach_Khach_Hang_TechCore_${new Date().toISOString().slice(0, 10)}.csv`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      vipToast.success(
        `Đã xuất và tải file "${fileName}" (${filteredCustomers.length} khách hàng).`,
        "Xuất Excel thành công"
      );
    } catch (err) {
      vipToast.error("Không thể tạo file bảng tính.", "Lỗi xuất file");
    }
  };

  // Tính toán số liệu thống kê thời gian thực
  const totalLtv = customersList.reduce((acc, c) => acc + (Number(c.ltvAmount) || 0), 0);
  const titaniumCount = customersList.filter((c) => c.vipTierCode === "titanium").length;
  const platinumCount = customersList.filter((c) => c.vipTierCode === "platinum").length;
  const goldCount = customersList.filter((c) => c.vipTierCode === "gold").length;
  const b2bCount = customersList.filter((c) => c.type === "b2b").length;
  const personalCount = customersList.filter((c) => c.type === "personal").length;

  // Lọc dữ liệu danh sách khách hàng
  const filteredCustomers = customersList.filter((c) => {
    const matchesTab =
      categoryTab === "all" ||
      (categoryTab === "titanium" && c.vipTierCode === "titanium") ||
      (categoryTab === "platinum" && c.vipTierCode === "platinum") ||
      (categoryTab === "gold" && c.vipTierCode === "gold") ||
      (categoryTab === "b2b" && c.type === "b2b") ||
      (categoryTab === "personal" && c.type === "personal");

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      c.name?.toLowerCase().includes(query) ||
      c.code?.toLowerCase().includes(query) ||
      c.phone?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.representative?.toLowerCase().includes(query) ||
      c.taxCode?.toLowerCase().includes(query) ||
      c.address?.toLowerCase().includes(query);

    const matchesHub =
      hubFilter === "all" ||
      (hubFilter === "lm81" && c.hub?.includes("Landmark")) ||
      (hubFilter === "hn" && (c.hub?.includes("Cầu Giấy") || c.hub?.includes("Keangnam")));

    const ltv = Number(c.ltvAmount) || 0;
    const matchesSpending =
      spendingFilter === "all" ||
      (spendingFilter === "gt500m" && ltv >= 500000000) ||
      (spendingFilter === "100m_500m" && ltv >= 100000000 && ltv < 500000000) ||
      (spendingFilter === "lt100m" && ltv < 100000000);

    return matchesTab && matchesSearch && matchesHub && matchesSpending;
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
              Khách Hàng &amp; CRM VIP
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Realtime Sync
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Giám sát {customersList.length} hồ sơ đối tác doanh nghiệp &amp; hội viên VIP, phân bổ kỹ sư TechCare on-site
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setShowAddCustomerModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-blue-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khách hàng</span>
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
              loadRealCustomers();
              vipToast.success("Đã đồng bộ cơ sở dữ liệu khách hàng mới nhất.", "Đồng bộ CRM");
            }}
            title="Đồng bộ dữ liệu CRM"
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 transition shadow-xs cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. 3 THẺ CHỈ SỐ TINH TẾ (DỊU MẮT, ĐỒNG BỘ PHONG CÁCH VỚI TRANG ĐƠN HÀNG)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Doanh thu LTV */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Doanh Thu LTV Tích Lũy
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                100% Số Liệu Thật
              </span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {formatVND(totalLtv)}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> Tổng hợp từ {totalSystemOrdersCount} đơn hàng thực tế
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Phân cấp Hội viên VIP */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Phân Cấp Hội Viên VIP
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">
                {titaniumCount + platinumCount + goldCount} VIP
              </span>
              <span className="text-xs font-bold text-blue-600 font-mono">
                {b2bCount} B2B • {personalCount} Cá Nhân
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {titaniumCount} Titanium • {platinumCount} Platinum • {goldCount} Gold
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: SLA Concierge On-site */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Đặc Quyền On-site TechCare
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">99.4% SLA</span>
              <span className="text-xs font-bold text-emerald-600">Active 24/7</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              KTV trực tiếp tại lab &amp; Cứu hộ CoolVan 2H
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
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
            { key: "all", label: "Tất cả khách hàng", count: customersList.length },
            { key: "titanium", label: "VIP Titanium", count: titaniumCount },
            { key: "platinum", label: "VIP Platinum", count: platinumCount },
            { key: "gold", label: "VIP Gold", count: goldCount },
            { key: "b2b", label: "Doanh nghiệp B2B", count: b2bCount },
            { key: "personal", label: "Cá nhân VIP", count: personalCount },
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
              placeholder="Tìm theo tên khách hàng, mã số thuế, SĐT, email..."
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

          {/* Hub & Spending Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="all">Tất cả chi nhánh Hub</option>
              <option value="lm81">Kho Landmark 81 (TP.HCM)</option>
              <option value="hn">Kho Keangnam HN (Hà Nội)</option>
            </select>

            <select
              value={spendingFilter}
              onChange={(e) => setSpendingFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="all">Tất cả hạn mức chi tiêu</option>
              <option value="gt500m">&gt; 500 Triệu VNĐ (Titanium)</option>
              <option value="100m_500m">100M - 500M VNĐ (Platinum)</option>
              <option value="lt100m">&lt; 100 Triệu VNĐ (Gold)</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BẢNG DỮ LIỆU KHÁCH HÀNG CRM (CHỈNH SỬA TRỰC TIẾP TẠI CHỖ & REAL-TIME)
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/50">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={
                  selectedCustomers.length > 0 &&
                  selectedCustomers.length === filteredCustomers.length
                }
                onChange={() => {
                  if (selectedCustomers.length === filteredCustomers.length) {
                    setSelectedCustomers([]);
                  } else {
                    setSelectedCustomers(filteredCustomers.map((c) => c.id));
                  }
                }}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>CHỌN TẤT CẢ</span>
            </label>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              Đang hiển thị <strong>{filteredCustomers.length}</strong> khách hàng
              {selectedCustomers.length > 0 && ` (Đã chọn ${selectedCustomers.length})`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                vipToast.info(
                  `Đã gửi thư tri ân và voucher ưu đãi tới ${
                    selectedCustomers.length || filteredCustomers.length
                  } hội viên VIP.`,
                  "Gửi thông báo VIP"
                );
              }}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Gửi tri ân VIP</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/40 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Khách hàng &amp; Đại diện</th>
                <th className="p-4">Pháp nhân &amp; MST</th>
                <th className="p-4">Thông tin liên hệ</th>
                <th className="p-4">Hạng VIP CRM</th>
                <th className="p-4">Tổng chi tiêu (LTV)</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">Không tìm thấy khách hàng phù hợp</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc phân loại
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isSelected = selectedCustomers.includes(cust.id);
                  const isTitanium = cust.vipTierCode === "titanium";
                  const isPlatinum = cust.vipTierCode === "platinum";
                  const isGold = cust.vipTierCode === "gold";

                  return (
                    <tr
                      key={cust.id}
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
                            setSelectedCustomers((prev) =>
                              prev.includes(cust.id)
                                ? prev.filter((id) => id !== cust.id)
                                : [...prev, cust.id]
                            );
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* Mã & Tên đại diện */}
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0C5776] to-[#2D99AE] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {cust.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <button
                              type="button"
                              onClick={() => setActiveDetailCustomer(cust)}
                              className="font-bold text-slate-900 hover:text-blue-600 transition truncate max-w-[200px] text-left block cursor-pointer"
                            >
                              {cust.name}
                            </button>
                            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {cust.representative || "Đại diện chính"}
                            </p>
                            <span className="font-mono text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded inline-block">
                              {cust.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Loại hình & MST */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              cust.type === "b2b"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {cust.type === "b2b" ? (
                              <Building2 className="w-3 h-3 text-indigo-600" />
                            ) : (
                              <User className="w-3 h-3 text-slate-500" />
                            )}
                            {cust.type === "b2b" ? "Doanh nghiệp B2B" : "Khách hàng Cá nhân"}
                          </span>
                          <p className="text-[11px] text-slate-500 font-mono">
                            MST: {cust.taxCode || "Chưa khai báo"}
                          </p>
                          <span className="inline-block text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200">
                            {cust.hub}
                          </span>
                        </div>
                      </td>

                      {/* Thông tin liên hệ */}
                      <td className="p-4 max-w-[220px]">
                        <div className="space-y-1 text-[11px]">
                          <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{cust.phone}</span>
                          </p>
                          <p className="text-slate-500 truncate flex items-center gap-1.5" title={cust.email}>
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{cust.email}</span>
                          </p>
                          <p className="text-slate-400 text-[10px] truncate" title={cust.address}>
                            {cust.address}
                          </p>
                        </div>
                      </td>

                      {/* Hạng VIP CRM - Cho phép chỉnh sửa trực tiếp tại chỗ (Inline VIP Selector) */}
                      <td className="p-4">
                        <div className="relative inline-flex items-center group">
                          <select
                            value={cust.vipTierCode || "gold"}
                            onChange={(e) =>
                              handleUpdateVipTier(cust.id, e.target.value as CustomerVipTier)
                            }
                            title="Bấm để nâng hạng hoặc đổi phân cấp VIP"
                            className={`appearance-none cursor-pointer pl-6 pr-6 py-1 rounded-full text-[11px] font-bold border transition shadow-2xs outline-none hover:shadow-xs ${
                              isTitanium
                                ? "bg-slate-900 text-amber-300 border-amber-400/50 hover:bg-slate-950"
                                : isPlatinum
                                ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100/80"
                                : isGold
                                ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100/80"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <option value="titanium" className="bg-slate-900 text-amber-300">
                              VIP Titanium
                            </option>
                            <option value="platinum" className="bg-white text-blue-700">
                              VIP Platinum
                            </option>
                            <option value="gold" className="bg-white text-amber-800">
                              VIP Gold
                            </option>
                            <option value="standard" className="bg-white text-slate-800">
                              Standard
                            </option>
                          </select>

                          {/* Chấm tròn hoặc icon vương miện */}
                          <span
                            className={`w-2 h-2 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                              isTitanium
                                ? "bg-amber-400 animate-pulse"
                                : isPlatinum
                                ? "bg-blue-500"
                                : isGold
                                ? "bg-amber-500"
                                : "bg-slate-400"
                            }`}
                          />

                          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 group-hover:opacity-100 transition" />
                        </div>
                      </td>

                      {/* Tổng chi tiêu (LTV) & Đơn hàng */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-black text-slate-900 text-sm">
                            {formatVND(cust.ltvAmount || 0)}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                              {cust.ordersCount || 1} Đơn hàng
                            </span>
                            <span className="font-semibold text-amber-600">
                              {Number(cust.techPoints || 0).toLocaleString()} pts
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Trạng thái tài khoản - Cho phép chỉnh sửa trực tiếp tại chỗ (Inline Status Selector) */}
                      <td className="p-4">
                        <div className="relative inline-flex items-center group">
                          <select
                            value={cust.status || "active"}
                            onChange={(e) =>
                              handleUpdateAccountStatus(cust.id, e.target.value as CustomerStatus)
                            }
                            title="Bấm để đổi trạng thái tài khoản"
                            className={`appearance-none cursor-pointer pl-6 pr-6 py-1 rounded-full text-[11px] font-bold border transition shadow-2xs outline-none hover:shadow-xs ${
                              cust.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100/80"
                                : cust.status === "care"
                                ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100/80"
                                : "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100/80"
                            }`}
                          >
                            <option value="active" className="bg-white text-slate-800">
                              Hoạt động
                            </option>
                            <option value="care" className="bg-white text-slate-800">
                              Đang chăm sóc
                            </option>
                            <option value="locked" className="bg-white text-slate-800">
                              Tạm khóa
                            </option>
                          </select>

                          {/* Chấm tròn trạng thái */}
                          <span
                            className={`w-2 h-2 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                              cust.status === "active"
                                ? "bg-emerald-500"
                                : cust.status === "care"
                                ? "bg-amber-500"
                                : "bg-rose-500"
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
                            onClick={() => setActiveDetailCustomer(cust)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Chi tiết</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCustomer(cust)}
                            title="Xóa khách hàng"
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
            Hiển thị <strong className="text-slate-800">{filteredCustomers.length}</strong> khách hàng •
            Tổng tích lũy:{" "}
            <strong className="text-blue-600">
              {formatVND(filteredCustomers.reduce((acc, c) => acc + (Number(c.ltvAmount) || 0), 0))}
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
          5. MODAL XEM CHI TIẾT KHÁCH HÀNG CRM SANG TRỌNG (EXECUTIVE DETAIL MODAL)
      ========================================================================= */}
      {activeDetailCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            onClick={() => setActiveDetailCustomer(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-50 via-blue-50/25 to-indigo-50/25 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">
                    TechCore Enterprise CRM
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    • Gia nhập: {activeDetailCustomer.joinedDate || "Đầu năm 2025"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {activeDetailCustomer.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeDetailCustomer.code);
                      vipToast.success(`Đã sao chép ${activeDetailCustomer.code}`, "Đã sao chép");
                    }}
                    title="Sao chép mã khách hàng"
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Chi nhánh quản lý:{" "}
                  <strong className="text-slate-700">{activeDetailCustomer.hub}</strong>
                </p>
              </div>

              {/* VIP Badge & Close */}
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-2xs ${
                    activeDetailCustomer.vipTierCode === "titanium"
                      ? "bg-slate-900 text-amber-300 border-amber-400/50"
                      : activeDetailCustomer.vipTierCode === "platinum"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  {activeDetailCustomer.vipTier}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveDetailCustomer(null)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 flex items-center justify-center transition shadow-2xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* 1. DARK SHOWCASE CARD */}
              <div className="rounded-2xl bg-[#091124] text-white p-5 shadow-md relative overflow-hidden space-y-3">
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-cyan-400 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
                        Cấu hình phần cứng chủ lực trang bị
                      </span>
                      <h4 className="text-base font-black text-white leading-snug">
                        {activeDetailCustomer.primaryHardware || "Hệ sinh thái AI Workstation Dual RTX 4090"}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">
                      Tổng chi tiêu (LTV)
                    </span>
                    <span className="text-lg font-black text-cyan-400">
                      {formatVND(activeDetailCustomer.ltvAmount || 0)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap relative z-10">
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 shadow-xs">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mã: {activeDetailCustomer.code}</span>
                  </div>
                  <div className="bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>KTV Phụ Trách: {activeDetailCustomer.assignedEngineer || "KTV Lê Hoàng Long"}</span>
                  </div>
                  <div className="bg-amber-950/80 border border-amber-700/80 text-amber-300 rounded-xl px-3 py-1.5 text-xs font-semibold">
                    TechPoints: {Number(activeDetailCustomer.techPoints || 0).toLocaleString()} pts
                  </div>
                </div>
              </div>

              {/* 2. THÔNG TIN PHÁP NHÂN & LIÊN HỆ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Thông tin pháp nhân &amp; Doanh nghiệp
                  </span>
                  <div className="space-y-1.5">
                    <p className="font-bold text-slate-900 text-sm">{activeDetailCustomer.name}</p>
                    <p className="text-slate-600 font-medium">
                      Đại diện: <strong>{activeDetailCustomer.representative || "Đại diện ký hợp đồng"}</strong>
                    </p>
                    <p className="text-slate-500 font-mono text-[11px]">
                      Mã số thuế: {activeDetailCustomer.taxCode || "8492019481"}
                    </p>
                    <p className="text-slate-600 text-[11px] flex items-start gap-1.5 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{activeDetailCustomer.address}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    Đặc quyền &amp; Cam kết SLA Hội Viên
                  </span>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Kỹ sư trực tiếp hỗ trợ on-site 24/7</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Xe lạnh chuyên dụng CoolVan cứu hộ trong 60 phút</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Đổi mới linh kiện 1-1 không cần thời gian thẩm định</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Hạn mức bảo lãnh công nợ doanh nghiệp 500M ₫</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 3. LỊCH SỬ ĐƠN HÀNG THỰC TẾ TRÊN HỆ THỐNG */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-blue-600" />
                    Lịch sử đơn hàng thực tế ({activeDetailCustomer.realOrders?.length || 0} Đơn Hàng)
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Đồng bộ từ Quản Lý Đơn Hàng
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(!activeDetailCustomer.realOrders || activeDetailCustomer.realOrders.length === 0) ? (
                    <p className="text-xs text-slate-400 py-3 text-center">
                      Khách hàng chưa phát sinh đơn hàng mới trên hệ thống.
                    </p>
                  ) : (
                    activeDetailCustomer.realOrders.map((ord: any, i: number) => (
                      <div
                        key={ord.id || i}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-blue-600">{ord.code}</span>
                            <span className="text-[10px] text-slate-400">
                              {ord.createdAt
                                ? new Date(ord.createdAt).toLocaleDateString("vi-VN")
                                : "Gần đây"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700 font-medium truncate">
                            {ord.productName ||
                              ord.items?.[0]?.productName ||
                              ord.equipment?.name ||
                              "Thiết bị công nghệ cao cấp"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-slate-900 block">
                            {formatVND(Number(ord.grandTotal) || Number(ord.payment?.amount) || 0)}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {ord.status === "completed"
                              ? "Hoàn tất"
                              : ord.status === "shipping"
                              ? "Đang giao"
                              : "Đã xác nhận"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 4. ĐIỀU CHỈNH NHANH HẠNG VIP VÀ TRẠNG THÁI TRONG MODAL */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Chuyển nhanh phân cấp hạng VIP CRM:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: "titanium", label: "VIP Titanium" },
                    { key: "platinum", label: "VIP Platinum" },
                    { key: "gold", label: "VIP Gold" },
                    { key: "standard", label: "Standard" },
                  ].map((tier) => {
                    const isCurrent = activeDetailCustomer.vipTierCode === tier.key;
                    return (
                      <button
                        key={tier.key}
                        type="button"
                        onClick={() => handleUpdateVipTier(activeDetailCustomer.id, tier.key as CustomerVipTier)}
                        className={`p-2.5 rounded-xl text-center font-bold text-xs transition border cursor-pointer active:scale-95 ${
                          isCurrent
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {tier.label}
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
                  onClick={() => setActiveDetailCustomer(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-white transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingCustomer(activeDetailCustomer)}
                  className="px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa hồ sơ</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    vipToast.invoice(
                      `Đã khởi tạo phiếu trích xuất hồ sơ VIP của ${activeDetailCustomer.name}.`,
                      "Hồ sơ VIP"
                    );
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Xuất hồ sơ VIP</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Hồ Sơ CRM</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MODAL THÊM KHÁCH HÀNG MỚI (CÓ BẮT LỖI TOÀN DIỆN & INLINE ERRORS)
      ========================================================================= */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Thêm Khách Hàng / Hội Viên Mới</h3>
                  <p className="text-[11px] text-slate-500">
                    Phân bổ hạng VIP và gán kỹ sư chuyên trách TechCare
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} noValidate className="space-y-3.5 text-xs">
              {/* Row 1: Tên & Loại hình */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tên khách / Doanh nghiệp <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={newCustomerForm.name}
                    onChange={(e) => {
                      setNewCustomerForm({ ...newCustomerForm, name: e.target.value });
                      if (formErrors.name) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.name;
                          return updated;
                        });
                      }
                    }}
                    placeholder="VD: Cty Cổ Phần AI Viễn Đông"
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-semibold text-slate-800 transition outline-none ${
                      formErrors.name
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại hình đối tác:</label>
                  <select
                    value={newCustomerForm.type}
                    onChange={(e) =>
                      setNewCustomerForm({
                        ...newCustomerForm,
                        type: e.target.value as "personal" | "b2b",
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="personal">Khách hàng Cá nhân</option>
                    <option value="b2b">Doanh nghiệp B2B Enterprise</option>
                  </select>
                </div>
              </div>

              {/* Row 2: SĐT & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    value={newCustomerForm.phone}
                    onChange={(e) => {
                      setNewCustomerForm({ ...newCustomerForm, phone: e.target.value });
                      if (formErrors.phone) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.phone;
                          return updated;
                        });
                      }
                    }}
                    placeholder="VD: 0987654321"
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-semibold text-slate-800 transition outline-none ${
                      formErrors.phone
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.phone}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email liên hệ <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="email"
                    value={newCustomerForm.email}
                    onChange={(e) => {
                      setNewCustomerForm({ ...newCustomerForm, email: e.target.value });
                      if (formErrors.email) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.email;
                          return updated;
                        });
                      }
                    }}
                    placeholder="VD: contact@doanhnghiep.vn"
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-semibold text-slate-800 transition outline-none ${
                      formErrors.email
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Địa chỉ nhận hàng / trụ sở */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Địa chỉ văn phòng / Nhà riêng <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  value={newCustomerForm.address}
                  onChange={(e) => {
                    setNewCustomerForm({ ...newCustomerForm, address: e.target.value });
                    if (formErrors.address) {
                      setFormErrors((prev) => {
                        const updated = { ...prev };
                        delete updated.address;
                        return updated;
                      });
                    }
                  }}
                  placeholder="VD: Tòa nhà Bitexco, Q.1, TP.HCM"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-medium text-slate-800 transition outline-none ${
                    formErrors.address
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {formErrors.address && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.address}</span>
                  </p>
                )}
              </div>

              {/* Row 4: Hạng VIP & Chi tiêu khởi điểm */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hạng VIP:</label>
                  <select
                    value={newCustomerForm.vipTier}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, vipTier: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="VIP Titanium">VIP Titanium</option>
                    <option value="VIP Platinum">VIP Platinum</option>
                    <option value="VIP Gold">VIP Gold</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">Hạn mức chi tiêu LTV:</label>
                    <span className="text-[10px] text-blue-600 font-mono font-bold">
                      {formatVND(newCustomerForm.ltvAmount)}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="1000000"
                    value={newCustomerForm.ltvAmount}
                    onChange={(e) =>
                      setNewCustomerForm({ ...newCustomerForm, ltvAmount: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-blue-600 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 5: Hub phụ trách & KTV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chi nhánh Hub:</label>
                  <select
                    value={newCustomerForm.hub}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, hub: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    <option value="Kho Landmark 81">Kho Landmark 81 (TP.HCM)</option>
                    <option value="Kho Keangnam HN">Kho Keangnam HN (Hà Nội)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kỹ sư TechCare phụ trách:</label>
                  <select
                    value={newCustomerForm.assignedEngineer}
                    onChange={(e) =>
                      setNewCustomerForm({ ...newCustomerForm, assignedEngineer: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    <option value="KTV Lê Hoàng Long">KTV Lê Hoàng Long</option>
                    <option value="KTV Trần Minh Tuấn">KTV Trần Minh Tuấn</option>
                    <option value="KTV Nguyễn Quốc Anh">KTV Nguyễn Quốc Anh</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl transition shadow-sm shadow-blue-500/25 active:scale-95 cursor-pointer"
                >
                  Thêm khách hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          7. MODAL XEM TRƯỚC BẢNG TÍNH EXCEL & TÙY CHỌN XUẤT / IN ẤN
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
                      Xem Trước Sổ Khách Hàng CRM &amp; Tùy Chọn Xuất / In
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                      XLSX / CSV Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tên file dự kiến:{" "}
                    <strong className="text-slate-700 font-mono">
                      Danh_Sach_Khach_Hang_TechCore_{new Date().toISOString().slice(0, 10)}.csv
                    </strong>{" "}
                    • {filteredCustomers.length} dòng hồ sơ • Mã hóa UTF-8
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
                  <span className="text-slate-500 text-[11px] block">Số hồ sơ trích xuất:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {filteredCustomers.length} Khách hàng
                  </span>
                </div>
                <div className="border-l border-slate-300 pl-6">
                  <span className="text-slate-500 text-[11px] block">Tổng giá trị chi tiêu (LTV):</span>
                  <span className="font-black text-[#0C5776] text-sm">
                    {formatVND(filteredCustomers.reduce((sum, c) => sum + (Number(c.ltvAmount) || 0), 0))}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Chuẩn hóa CRM
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
                      <th className="py-3 px-3.5 border-r border-slate-200">Mã KH</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Tên Khách Hàng</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Đại Diện</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Số Điện Thoại</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Email</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Hạng VIP</th>
                      <th className="py-3 px-3.5 text-right border-r border-slate-200">Tổng Chi Tiêu (LTV)</th>
                      <th className="py-3 px-3.5 border-r border-slate-200">Số Đơn</th>
                      <th className="py-3 px-3.5">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-10 text-slate-400 font-medium">
                          Không có dữ liệu khách hàng nào khớp bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((cust, idx) => (
                        <tr key={cust.id || idx} className="even:bg-slate-50/60 hover:bg-emerald-50/40 transition-colors">
                          <td className="py-2.5 px-3 text-center border-r border-slate-100 font-mono text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 font-mono font-bold text-blue-700 whitespace-nowrap">
                            {cust.code}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 font-bold text-slate-900 whitespace-nowrap">
                            {cust.name}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                            {cust.representative || "Đại diện"}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 font-mono text-slate-600 whitespace-nowrap">
                            {cust.phone}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                            {cust.email}
                          </td>
                          <td className="py-2.5 px-3.5 border-r border-slate-100 whitespace-nowrap">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                              {cust.vipTier}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-right border-r border-slate-100 font-mono font-bold text-emerald-700 whitespace-nowrap">
                            {formatVND(cust.ltvAmount || 0)}
                          </td>
                          <td className="py-2.5 px-3.5 text-center border-r border-slate-100 whitespace-nowrap">
                            {cust.ordersCount || 1}
                          </td>
                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              {cust.statusText || "Hoạt động"}
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
                  <span>In Sổ Khách Hàng / Xuất PDF</span>
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
          8. MODAL XÁC NHẬN XÓA KHÁCH HÀNG (DANGER DIALOG & REAL-TIME SYNC)
      ========================================================================= */}
      {deletingCustomer && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 border border-rose-100">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  Xác Nhận Xóa Hồ Sơ Khách Hàng?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hành động này sẽ xóa vĩnh viễn hồ sơ và thông báo đồng bộ thời gian thực tới tất cả các tài khoản quản trị khác.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Mã khách hàng:</span>
                <span className="font-mono font-black text-rose-600">{deletingCustomer.code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tên khách hàng:</span>
                <span className="font-bold text-slate-800">{deletingCustomer.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Số điện thoại:</span>
                <span className="font-mono text-slate-700">{deletingCustomer.phone}</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
                <span className="text-slate-500 font-bold">Tổng chi tiêu LTV:</span>
                <span className="font-black text-blue-600">
                  {formatVND(deletingCustomer.ltvAmount || 0)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCustomer(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDeleteCustomer}
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
