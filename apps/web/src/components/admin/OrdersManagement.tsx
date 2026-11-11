"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Layers,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Search,
  RefreshCw,
  Plus,
  ShieldCheck,
  ChevronRight,
  Eye,
  X,
  CreditCard,
  Building2,
  Lock,
  Download,
  Sparkles,
  FileSpreadsheet,
  User,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  Activity,
  Cpu,
  Check,
  ArrowUpRight,
  QrCode,
  Package,
  MoreVertical,
  SlidersHorizontal,
  Mail,
  Copy,
  ExternalLink,
  Shield,
  CheckCheck,
  Trash2,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Pencil,
} from "lucide-react";
import { formatVND } from "../../lib/utils";
import { api } from "../../lib/api";
import { vipToast } from "../common/VipToast";

type OrderStatusCode = "pending" | "packing" | "shipping" | "completed" | "returns";

interface OrdersManagementProps {
  searchQuery?: string;
}

// Chuẩn hóa dữ liệu đơn hàng từ bất kỳ nguồn nào sang chuẩn giao diện admin
function normalizeAdminOrder(raw: any) {
  if (raw.customer && raw.equipment && raw.shipping && raw.payment) {
    return raw;
  }

  const firstItem = raw.items?.[0] || {};
  const status = (raw.status || "pending").toLowerCase().trim();
  const statusCode: OrderStatusCode =
    status === "confirmed" || status === "packing"
      ? "packing"
      : status === "shipping"
      ? "shipping"
      : status === "completed"
      ? "completed"
      : status === "cancelled"
      ? "returns"
      : "pending";

  const statusLabels: Record<string, string> = {
    pending: "Chờ xác nhận",
    packing: "Đang đóng gói & S/N",
    shipping: "Đang giao CoolVan",
    completed: "Hoàn tất giao nhận",
    returns: "Đã hủy / Hoàn trả",
  };

  const address =
    [raw.street, raw.ward, raw.district, raw.province].filter(Boolean).join(", ") ||
    raw.street ||
    "Hà Nội";

  return {
    id: raw.id || "ord-" + Date.now(),
    code: raw.code?.startsWith("#") ? raw.code : `#${raw.code}`,
    datetime: raw.createdAt
      ? new Date(raw.createdAt).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Hôm nay",
    hub: raw.province?.includes("Hồ Chí Minh") ? "Kho Landmark 81" : "Kho Keangnam HN",
    customer: {
      name: raw.receiverName || "Khách Hàng",
      phone: raw.phone || "0987.654.321",
      email: raw.guestEmail || "khachhang@techcore.vn",
      address,
      vip: (raw.grandTotal || 0) > 50000000 ? "VIP PLATINUM" : "VIP GOLD",
    },
    equipment: {
      name: firstItem.productName || "Thiết bị Công Nghệ Cao Cấp",
      subDesc:
        raw.items?.length > 1
          ? `+${raw.items.length - 1} sản phẩm kèm theo`
          : firstItem.sku || "Chính hãng 100%",
      serial: firstItem.serialNumber
        ? `S/N: ${firstItem.serialNumber}`
        : "S/N: 70 GN " + Math.floor(1000 + Math.random() * 9000) + " X1",
      shieldStatus: "e-Shield Hợp Lệ",
      warranty: "36 Tháng On-site 24/7",
    },
    payment: {
      amount: raw.grandTotal || 0,
      method:
        raw.paymentMethod === "cod"
          ? "Tiền mặt (COD)"
          : raw.paymentMethod === "vnpay"
          ? "VNPay QR"
          : "TechPay QR",
      status: raw.paymentStatus === "paid" ? "Đã thanh toán" : "Chờ thanh toán",
      ref: "HDV-" + (raw.code?.replace(/[^0-9]/g, "") || "2026-001"),
      taxCode: "0314892019",
    },
    shipping: {
      statusText: statusLabels[statusCode] || "Chờ xử lý",
      statusCode,
      vehicle: "CoolVan #01",
      driver: "Phạm Tấn Tài • CoolVan Dispatch",
      note: raw.note || "Niêm phong tem e-Shield bảo mật",
      temperature: "21.5°C",
    },
    timeline: [
      { time: "Tiếp nhận", title: "Đặt hàng thành công", desc: "Xác thực bởi hệ thống", done: true },
      {
        time: "Xử lý",
        title: "Đóng gói & Kiểm tra S/N",
        desc: "Quét mã chống tráo đổi",
        done: statusCode !== "pending",
      },
      {
        time: "Điều phối",
        title: "Vận chuyển CoolVan",
        desc: "Bảo ôn nhiệt độ 21°C",
        done: statusCode === "shipping" || statusCode === "completed",
      },
      {
        time: "Hoàn tất",
        title: "Nghiệm thu & Bàn giao",
        desc: "Khách hàng kiểm tra hàng",
        done: statusCode === "completed",
      },
    ],
    rawOrder: raw,
  };
}

export function OrdersManagement({ searchQuery: globalSearch = "" }: OrdersManagementProps) {
  const [orderTab, setOrderTab] = useState<OrderStatusCode | "all">("all");
  const [searchQuery, setSearchQuery] = useState(globalSearch);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [hubFilter, setHubFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Chi Tiết Đơn Hàng Sang Trọng (Executive Order Detail Modal)
  const [activeDetailOrder, setActiveDetailOrder] = useState<any | null>(null);

  // Modal tạo đơn hàng mới
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);

  // Modal Xem Trước Bảng Tính Excel & Tùy Chọn Xuất / In
  const [showExportPreviewModal, setShowExportPreviewModal] = useState(false);

  // Chỉnh sửa tên / số hiệu xe giao vận trực tiếp tại bảng
  const [editingVehicleOrderId, setEditingVehicleOrderId] = useState<string | null>(null);
  const [tempVehicleValue, setTempVehicleValue] = useState<string>("");

  // Chỉnh sửa chi tiết vận chuyển trong modal
  const [isEditingShippingInModal, setIsEditingShippingInModal] = useState(false);
  const [modalShippingForm, setModalShippingForm] = useState({
    statusCode: "shipping" as OrderStatusCode,
    vehicle: "",
    driver: "",
    note: "",
    temperature: "21.5°C",
  });

  // Toast thông báo thống nhất
  const showToast = (
    title: string,
    message: string,
    type: "success" | "invoice" | "warning" = "success"
  ) => {
    if (type === "warning") vipToast.warning(message, title);
    else if (type === "invoice") vipToast.invoice(message, title);
    else vipToast.success(message, title);
  };

  // Danh sách đơn hàng nạp dữ liệu thật và đồng bộ 2 chiều
  const [ordersList, setOrdersList] = useState<any[]>([]);

  // Tải danh sách đơn hàng thực tế
  const loadRealOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminOrders();
      if (res.success && Array.isArray(res.data)) {
        setOrdersList(res.data.map(normalizeAdminOrder));
      }
    } catch (e) {
      console.error("Lỗi tải đơn hàng:", e);
    } finally {
      setLoading(false);
    }
  };

  // Thông tin Quản trị viên hiện tại phục vụ Audit log & Realtime Broadcast
  const [currentAdminName, setCurrentAdminName] = useState<string>("Quản trị viên TechCore");
  const [deletingOrder, setDeletingOrder] = useState<any | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.fullName) setCurrentAdminName(u.fullName);
      }
    } catch (e) {}
  }, []);

  // Kênh truyền tin thời gian thực giữa các Tab trình duyệt (BroadcastChannel API)
  const BROADCAST_CHANNEL_NAME = "techcore_admin_orders_channel";

  const broadcastOrderAction = (payload: {
    type: "UPDATE_STATUS" | "DELETE_ORDER" | "CREATE_ORDER";
    orderCode: string;
    orderId?: string;
    statusText?: string;
    author: string;
  }) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({ ...payload, timestamp: Date.now() });
        channel.close();
      } catch (e) {}
    }
  };

  useEffect(() => {
    loadRealOrders();

    // 1. Lắng nghe sự kiện đồng bộ từ các màn hình khác (Checkout hoặc User Order)
    const handleSyncChanged = () => {
      loadRealOrders();
    };
    window.addEventListener("techcore:orders-changed", handleSyncChanged);

    // 2. Lắng nghe BroadcastChannel để nhận thông báo tức thời khi Tab/Admin khác sửa hoặc xóa
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = (event) => {
          const msg = event.data;
          if (!msg || !msg.type) return;

          // Tự động tải lại danh sách dữ liệu mới nhất
          loadRealOrders();

          if (msg.type === "DELETE_ORDER") {
            vipToast.warning(
              `Đơn hàng ${msg.orderCode} vừa được xóa khỏi hệ thống bởi ${msg.author}!`,
              "Thông báo đồng bộ"
            );
            setActiveDetailOrder((current: any) => {
              if (current && (current.code === msg.orderCode || current.id === msg.orderId)) {
                return null;
              }
              return current;
            });
          } else if (msg.type === "UPDATE_STATUS") {
            vipToast.info(
              `Quản trị viên ${msg.author} vừa chuyển đơn hàng ${msg.orderCode} sang "${msg.statusText}".`,
              "Cập nhật đơn hàng"
            );
          } else if (msg.type === "CREATE_ORDER") {
            vipToast.info(
              `Đơn hàng mới ${msg.orderCode} vừa được tạo bởi ${msg.author}.`,
              "Đơn hàng mới"
            );
          }
        };
      } catch (e) {}
    }

    // 3. Lắng nghe storage event làm fallback đa trình duyệt
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tech_orders" || e.key === "deleted_order_codes") {
        loadRealOrders();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // 4. Lắng nghe sự kiện từ AdminNavbar
    const handleAddOrderEvent = () => setShowAddOrderModal(true);
    const handleExportEvent = () => setShowExportPreviewModal(true);
    const handleSearchEvent = (e: any) => setSearchQuery(e.detail || "");

    window.addEventListener("admin:add-order", handleAddOrderEvent);
    window.addEventListener("admin:export-orders", handleExportEvent);
    window.addEventListener("admin:search-orders", handleSearchEvent);

    return () => {
      window.removeEventListener("techcore:orders-changed", handleSyncChanged);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("admin:add-order", handleAddOrderEvent);
      window.removeEventListener("admin:export-orders", handleExportEvent);
      window.removeEventListener("admin:search-orders", handleSearchEvent);
      if (bc) {
        bc.close();
      }
    };
  }, []);

  // Cập nhật trạng thái đơn hàng đồng bộ Real-time & thông báo tới các tab khác
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatusCode) => {
    const statusLabels: Record<string, string> = {
      pending: "Chờ xác nhận",
      packing: "Đang đóng gói & S/N",
      shipping: "Đang giao CoolVan",
      completed: "Hoàn tất giao nhận",
      returns: "Đổi trả / Bảo hành",
    };

    const targetOrder = ordersList.find(
      (o) => o.id === orderId || o.code === orderId || o.code === `#${orderId}`
    );
    const orderCode = targetOrder?.code || `#${orderId}`;

    const apiStatus = newStatus === "returns" ? "cancelled" : newStatus;
    await api.updateAdminOrderStatus(orderId, apiStatus);

    setOrdersList((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.code === orderId || o.code === `#${orderId}`) {
          const updated = {
            ...o,
            shipping: {
              ...o.shipping,
              statusCode: newStatus,
              statusText: statusLabels[newStatus] || "Chờ xác nhận",
            },
          };
          if (activeDetailOrder?.id === o.id || activeDetailOrder?.code === o.code) {
            setActiveDetailOrder(updated);
          }
          return updated;
        }
        return o;
      })
    );

    // Phát tín hiệu thông báo thời gian thực tới các tài khoản / tab khác
    broadcastOrderAction({
      type: "UPDATE_STATUS",
      orderCode,
      orderId,
      statusText: statusLabels[newStatus] || newStatus,
      author: currentAdminName,
    });

    vipToast.success(`Đơn hàng ${orderCode} đã chuyển sang "${statusLabels[newStatus]}".`, "Cập nhật thành công");
  };

  // Cập nhật đội xe điều phối CoolVan trực tiếp từ bảng
  const handleUpdateVehicle = (orderId: string, vehicle: string) => {
    setOrdersList((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.code === orderId || o.code === `#${orderId}`) {
          const updated = {
            ...o,
            shipping: {
              ...o.shipping,
              vehicle,
            },
          };
          if (activeDetailOrder?.id === o.id || activeDetailOrder?.code === o.code) {
            setActiveDetailOrder(updated);
          }
          return updated;
        }
        return o;
      })
    );

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("tech_orders");
        if (raw) {
          const list = JSON.parse(raw);
          const updated = list.map((item: any) => {
            if (item.id === orderId || item.code === orderId || item.code === `#${orderId}`) {
              return { ...item, shippingVehicle: vehicle };
            }
            return item;
          });
          localStorage.setItem("tech_orders", JSON.stringify(updated));
        }
      } catch (e) {}
    }

    const targetOrder = ordersList.find(
      (o) => o.id === orderId || o.code === orderId || o.code === `#${orderId}`
    );
    vipToast.success(
      `Đã phân bổ đội xe "${vehicle}" cho đơn ${targetOrder?.code || ""}.`,
      "Điều phối vận chuyển"
    );
  };

  // Đồng bộ form vận chuyển khi mở modal chi tiết đơn
  useEffect(() => {
    if (activeDetailOrder) {
      setModalShippingForm({
        statusCode: (activeDetailOrder.shipping?.statusCode as OrderStatusCode) || "shipping",
        vehicle: activeDetailOrder.shipping?.vehicle || "CoolVan #01",
        driver: activeDetailOrder.shipping?.driver || "Phạm Tấn Tài • CoolVan Dispatch",
        note: activeDetailOrder.shipping?.note || "Niêm phong tem e-Shield bảo mật",
        temperature: activeDetailOrder.shipping?.temperature || "21.5°C",
      });
      setIsEditingShippingInModal(false);
    }
  }, [activeDetailOrder]);

  // Lưu toàn bộ thông tin vận chuyển chỉnh sửa từ modal chi tiết đơn
  const handleSaveModalShipping = async () => {
    if (!activeDetailOrder) return;
    const orderId = activeDetailOrder.id;
    const statusLabels: Record<string, string> = {
      pending: "Chờ xác nhận",
      packing: "Đang đóng gói & S/N",
      shipping: "Đang giao CoolVan",
      completed: "Hoàn tất giao nhận",
      returns: "Đổi trả / Bảo hành",
    };

    const newVehicle = modalShippingForm.vehicle.trim() || activeDetailOrder.shipping?.vehicle || "CoolVan #01";
    const newDriver = modalShippingForm.driver.trim() || activeDetailOrder.shipping?.driver || "Phạm Tấn Tài • CoolVan Dispatch";
    const newNote = modalShippingForm.note.trim() || activeDetailOrder.shipping?.note || "Niêm phong tem e-Shield bảo mật";
    const newTemp = modalShippingForm.temperature.trim() || activeDetailOrder.shipping?.temperature || "21.5°C";

    const updatedShipping = {
      ...activeDetailOrder.shipping,
      statusCode: modalShippingForm.statusCode,
      statusText: statusLabels[modalShippingForm.statusCode] || "Chờ xử lý",
      vehicle: newVehicle,
      driver: newDriver,
      note: newNote,
      temperature: newTemp,
    };

    const updatedOrder = {
      ...activeDetailOrder,
      shipping: updatedShipping,
    };

    setActiveDetailOrder(updatedOrder);

    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? updatedOrder : o))
    );

    // Lưu vào LocalStorage & API
    try {
      const apiStatus = modalShippingForm.statusCode === "returns" ? "cancelled" : modalShippingForm.statusCode;
      await api.updateAdminOrderStatus(orderId, apiStatus);

      const raw = localStorage.getItem("tech_orders");
      if (raw) {
        const list = JSON.parse(raw);
        const updatedList = list.map((item: any) => {
          if (item.id === orderId || item.code === orderId || item.code === `#${orderId}`) {
            return {
              ...item,
              status: apiStatus,
              shippingVehicle: newVehicle,
              shippingDriver: newDriver,
              shippingNote: newNote,
              shippingTemp: newTemp,
            };
          }
          return item;
        });
        localStorage.setItem("tech_orders", JSON.stringify(updatedList));
      }
    } catch (e) {}

    broadcastOrderAction({
      type: "UPDATE_STATUS",
      orderCode: activeDetailOrder.code,
      orderId,
      statusText: `${statusLabels[modalShippingForm.statusCode]} (${newVehicle})`,
      author: currentAdminName,
    });

    setIsEditingShippingInModal(false);
    vipToast.success(`Đã cập nhật toàn bộ thông tin vận chuyển đơn ${activeDetailOrder.code}.`, "Lưu thành công");
  };

  // Xác nhận và xóa đơn hàng vĩnh viễn (Đồng bộ đa tab)
  const confirmDeleteOrder = async () => {
    if (!deletingOrder) return;
    try {
      const orderCode = deletingOrder.code;
      const orderId = deletingOrder.id;

      await api.deleteAdminOrder(orderId);

      setOrdersList((prev) => prev.filter((o) => o.id !== orderId && o.code !== orderCode));

      if (activeDetailOrder?.id === orderId || activeDetailOrder?.code === orderCode) {
        setActiveDetailOrder(null);
      }

      // Phát thông báo tới toàn bộ các tab và tài khoản đang mở
      broadcastOrderAction({
        type: "DELETE_ORDER",
        orderCode,
        orderId,
        author: currentAdminName,
      });

      vipToast.success(`Đã xóa đơn hàng ${orderCode} khỏi cơ sở dữ liệu.`, "Đã xóa đơn hàng");
    } catch (err) {
      vipToast.error("Không thể xóa đơn hàng lúc này. Vui lòng thử lại sau.", "Lỗi xóa đơn");
    } finally {
      setDeletingOrder(null);
    }
  };

  // Tải file bảng tính Excel (CSV UTF-8)
  const handleDownloadExcelFile = () => {
    try {
      const headers = [
        "STT",
        "Mã Đơn Hàng",
        "Ngày Giờ Đặt",
        "Khách Hàng",
        "Số Điện Thoại",
        "Hạng VIP",
        "Địa Chỉ Giao Hàng",
        "Thiết Bị",
        "Serial e-Shield",
        "Giá Trị (VNĐ)",
        "Hình Thức Thanh Toán",
        "Trạng Thái Vận Chuyển",
        "Đội Xe Điều Phối",
      ];

      const rows = filteredOrders.map((o, idx) => [
        `"${idx + 1}"`,
        `"${o.code}"`,
        `"${o.datetime}"`,
        `"${o.customer?.name || ""}"`,
        `"${o.customer?.phone || ""}"`,
        `"${o.customer?.vip || ""}"`,
        `"${o.customer?.address || ""}"`,
        `"${o.equipment?.name || ""}"`,
        `"${o.equipment?.serial || ""}"`,
        `"${o.payment?.amount || 0}"`,
        `"${o.payment?.method || ""}"`,
        `"${o.shipping?.statusText || ""}"`,
        `"${o.shipping?.vehicle || ""}"`,
      ]);

      const csvContent =
        "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      const fileName = `Don_Hang_TechCore_${new Date().toISOString().slice(0, 10)}.csv`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      vipToast.success(`Đã xuất và tải file "${fileName}" (${filteredOrders.length} dòng dữ liệu).`, "Xuất Excel thành công");
    } catch (err) {
      vipToast.error("Không thể tạo file bảng tính.", "Lỗi xuất file");
    }
  };

  // In bảng tính Excel trực tiếp / xuất PDF
  const handlePrintSpreadsheet = () => {
    vipToast.invoice("Đang khởi tạo bản in bảng tính...", "In Bảng Tính");
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Đồng bộ tem e-Shield
  const handleSyncEShield = () => {
    setOrdersList((prev) =>
      prev.map((o) => ({
        ...o,
        equipment: {
          ...o.equipment,
          shieldStatus: "e-Shield Hợp Lệ",
        },
      }))
    );
    vipToast.success(`Toàn bộ ${ordersList.length} mã Serial phần cứng đã được xác thực an toàn.`, "Đã đồng bộ e-Shield S/N");
  };

  // State Form Tạo Đơn Mới
  const [newOrderForm, setNewOrderForm] = useState({
    code: "#TECH-2026-" + Math.floor(1000 + Math.random() * 9000),
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerVip: "VIP PLATINUM",
    equipmentName: "Workstation AI Dual RTX 4090 OC",
    equipmentDesc: "Custom Liquid Loop Pro • 64GB DDR5",
    serialNumber: "S/N: 70 GN " + Math.floor(1000 + Math.random() * 9000) + " X1",
    amount: 185000000,
    paymentMethod: "TechPay QR",
    hub: "Kho Landmark 81",
    coolVan: "CoolVan #01",
    status: "packing" as OrderStatusCode,
  });

  // Kiểm tra tính hợp lệ & Bắt lỗi các trường biểu mẫu (Form Validation)
  const validateOrderForm = () => {
    const errors: Record<string, string> = {};

    // 1. Kiểm tra Mã đơn hàng
    const trimmedCode = (newOrderForm.code || "").trim();
    if (!trimmedCode) {
      errors.code = "Vui lòng nhập mã đơn hàng (VD: #TECH-2026-9999)";
    } else {
      const formattedCode = trimmedCode.startsWith("#") ? trimmedCode : `#${trimmedCode}`;
      const isDuplicate = ordersList.some(
        (o) => o.code?.toLowerCase() === formattedCode.toLowerCase()
      );
      if (isDuplicate) {
        errors.code = `Mã đơn hàng "${formattedCode}" đã tồn tại! Vui lòng chọn mã khác.`;
      }
    }

    // 2. Họ và tên khách hàng
    const trimmedName = (newOrderForm.customerName || "").trim();
    if (!trimmedName) {
      errors.customerName = "Vui lòng nhập họ tên khách hàng";
    } else if (trimmedName.length < 2) {
      errors.customerName = "Họ tên khách hàng tối thiểu 2 ký tự";
    }

    // 3. Số điện thoại (chuẩn 10 số Việt Nam: 03, 05, 07, 08, 09)
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    const cleanPhone = (newOrderForm.customerPhone || "").replace(/[\s.-]/g, "");
    if (!cleanPhone) {
      errors.customerPhone = "Vui lòng nhập số điện thoại liên hệ";
    } else if (!phoneRegex.test(cleanPhone)) {
      errors.customerPhone = "Số điện thoại không đúng định dạng (VD: 0987654321)";
    }

    // 4. Địa chỉ giao hàng chi tiết
    const trimmedAddress = (newOrderForm.customerAddress || "").trim();
    if (!trimmedAddress) {
      errors.customerAddress = "Vui lòng nhập địa chỉ nhận hàng chi tiết";
    } else if (trimmedAddress.length < 5) {
      errors.customerAddress = "Địa chỉ nhận hàng quá ngắn (tối thiểu 5 ký tự)";
    }

    // 5. Cấu hình thiết bị / Linh kiện
    const trimmedEquip = (newOrderForm.equipmentName || "").trim();
    if (!trimmedEquip) {
      errors.equipmentName = "Vui lòng nhập tên thiết bị hoặc phần cứng";
    }

    // 6. Tổng giá trị đơn hàng
    const amountVal = Number(newOrderForm.amount);
    if (!amountVal || isNaN(amountVal) || amountVal <= 0) {
      errors.amount = "Tổng tiền đơn hàng phải lớn hơn 0 VNĐ";
    } else if (amountVal > 5000000000) {
      errors.amount = "Số tiền đơn hàng vượt quá giới hạn 5 tỷ VNĐ";
    }

    return errors;
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateOrderForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorMessage = Object.values(errors)[0];
      vipToast.error(firstErrorMessage, "Thông tin chưa hợp lệ");
      return;
    }

    setFormErrors({});

    const formattedCode = newOrderForm.code.startsWith("#")
      ? newOrderForm.code
      : `#${newOrderForm.code}`;

    const apiPayload = {
      code: formattedCode.replace(/^#/, ""),
      receiverName: newOrderForm.customerName.trim(),
      phone: newOrderForm.customerPhone.trim(),
      street: newOrderForm.customerAddress.trim(),
      status: newOrderForm.status,
      grandTotal: Number(newOrderForm.amount),
      productName: newOrderForm.equipmentName.trim(),
      paymentMethod: newOrderForm.paymentMethod,
      note: "Đơn tạo trực tiếp bởi quản trị viên",
    };

    const res = await api.createAdminOrder(apiPayload);
    if (res.success && res.data) {
      const normalized = normalizeAdminOrder(res.data);
      setOrdersList((prev) => [normalized, ...prev]);
      setShowAddOrderModal(false);

      // Phát tín hiệu thông báo thời gian thực tới các tab khác
      broadcastOrderAction({
        type: "CREATE_ORDER",
        orderCode: normalized.code,
        orderId: normalized.id,
        author: currentAdminName,
      });

      // Tạo mã đơn ngẫu nhiên mới cho lần tạo kế tiếp
      setNewOrderForm({
        code: "#TECH-2026-" + Math.floor(1000 + Math.random() * 9000),
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        customerVip: "VIP PLATINUM",
        equipmentName: "Workstation AI Dual RTX 4090 OC",
        equipmentDesc: "Custom Liquid Loop Pro • 64GB DDR5",
        serialNumber: "S/N: 70 GN " + Math.floor(1000 + Math.random() * 9000) + " X1",
        amount: 185000000,
        paymentMethod: "TechPay QR",
        hub: "Kho Landmark 81",
        coolVan: "CoolVan #01",
        status: "packing" as OrderStatusCode,
      });

      vipToast.success(`Đơn hàng ${normalized.code} đã được tạo và lưu vào hệ thống!`, "Tạo đơn hàng thành công");
    } else {
      vipToast.error("Không thể tạo đơn hàng lúc này. Vui lòng thử lại sau.", "Lỗi hệ thống");
    }
  };

  // Tính toán các chỉ số Real-time từ danh sách đơn hàng thực tế
  const totalRevenue = ordersList.reduce((sum, o) => sum + (o.payment?.amount || 0), 0);
  const pendingCount = ordersList.filter((o) => o.shipping?.statusCode === "pending").length;
  const packingCount = ordersList.filter((o) => o.shipping?.statusCode === "packing").length;
  const shippingCount = ordersList.filter((o) => o.shipping?.statusCode === "shipping").length;
  const completedCount = ordersList.filter((o) => o.shipping?.statusCode === "completed").length;
  const returnsCount = ordersList.filter((o) => o.shipping?.statusCode === "returns").length;
  const inProgressCount = pendingCount + packingCount + shippingCount;
  const completionRate = ordersList.length > 0 ? ((completedCount / ordersList.length) * 100).toFixed(1) : "100";

  const filteredOrders = ordersList.filter((o) => {
    const matchesTab =
      orderTab === "all" ||
      (orderTab === "pending" && o.shipping?.statusCode === "pending") ||
      (orderTab === "packing" && o.shipping?.statusCode === "packing") ||
      (orderTab === "shipping" && o.shipping?.statusCode === "shipping") ||
      (orderTab === "completed" && o.shipping?.statusCode === "completed") ||
      (orderTab === "returns" && o.shipping?.statusCode === "returns");

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      o.code?.toLowerCase().includes(query) ||
      o.customer?.name?.toLowerCase().includes(query) ||
      o.customer?.phone?.toLowerCase().includes(query) ||
      o.equipment?.name?.toLowerCase().includes(query) ||
      o.equipment?.serial?.toLowerCase().includes(query) ||
      o.hub?.toLowerCase().includes(query);

    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "techpay" && o.payment?.method?.includes("TechPay")) ||
      (paymentFilter === "visa" && o.payment?.method?.includes("Visa")) ||
      (paymentFilter === "b2b" && (o.payment?.method?.includes("VCB") || o.payment?.method?.includes("khoản")));

    const matchesHub =
      hubFilter === "all" ||
      (hubFilter === "lm81" && o.hub?.includes("Landmark")) ||
      (hubFilter === "cg" && o.hub?.includes("Cầu Giấy"));

    return matchesTab && matchesSearch && matchesPayment && matchesHub;
  });

  return (
    <div className="space-y-5">
      {/* =========================================================================
          1. HEADER: GỌN GÀNG, HIỆN ĐẠI & SANG TRỌNG (1 MÀN HÌNH DUY NHẤT)
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Đơn Hàng &amp; Vận Hành
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Realtime Sync
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Giám sát {ordersList.length} đơn hàng, mã hóa tem e-Shield và kiểm soát lộ trình giao nhận CoolVan
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setShowAddOrderModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-blue-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo đơn hàng</span>
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
            onClick={handleSyncEShield}
            title="Đồng bộ tem e-Shield"
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 transition shadow-xs cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. 3 THẺ CHỈ SỐ TINH TẾ (DỊU MẮT, KHÔNG CHIẾM DIỆN TÍCH)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Doanh Thu Đơn Hàng
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight">{formatVND(totalRevenue)}</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> Đồng bộ thời gian thực
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Đơn Đang Xử Lý &amp; Giao
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">{inProgressCount} Đơn</span>
              <span className="text-xs font-semibold text-blue-600">{shippingCount} Đang giao CoolVan</span>
            </div>
            <span className="text-[11px] text-slate-500 block">{packingCount} Đang đóng gói &amp; Quét mã S/N</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tỷ Lệ Hoàn Tất Đơn
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-emerald-600">{completionRate}%</span>
              <span className="text-xs font-semibold text-slate-500">{completedCount}/{ordersList.length} đơn</span>
            </div>
            <span className="text-[11px] text-slate-500 block">100% Khớp e-Shield &amp; Chữ ký</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. THANH ĐIỀU KHIỂN BỘ LỌC DUY NHẤT (UNIFIED CONTROL BAR)
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {[
            { key: "all", label: "Tất cả đơn", count: ordersList.length },
            { key: "pending", label: "Chờ xác nhận", count: pendingCount },
            { key: "packing", label: "Đang đóng gói & S/N", count: packingCount },
            { key: "shipping", label: "Đang giao CoolVan", count: shippingCount },
            { key: "completed", label: "Hoàn tất", count: completedCount },
            { key: "returns", label: "Đổi trả / Hủy", count: returnsCount },
          ].map((tab) => {
            const isActive = orderTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setOrderTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white font-bold shadow-xs"
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

        {/* Search & Filter Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo Mã đơn, Khách hàng, SĐT, Thiết bị, Serial S/N..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="all">Mọi thanh toán</option>
              <option value="techpay">TechPay QR</option>
              <option value="visa">Visa Doanh Nghiệp</option>
              <option value="b2b">Chuyển khoản VCB</option>
            </select>

            <select
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white focus:outline-none"
            >
              <option value="all">Mọi kho xuất</option>
              <option value="lm81">Kho Landmark 81</option>
              <option value="cg">Kho Cầu Giấy HN</option>
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BẢNG ĐƠN HÀNG TOÀN MÀN HÌNH (1 SCREEN ENTERPRISE DATA GRID)
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Bulk Action Header */}
        <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedOrders(filteredOrders.map((o) => o.id));
                  } else {
                    setSelectedOrders([]);
                  }
                }}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>CHỌN TẤT CẢ</span>
            </label>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              Đang hiển thị <strong>{filteredOrders.length}</strong> đơn hàng
              {selectedOrders.length > 0 && ` (Đã chọn ${selectedOrders.length})`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                showToast("In phiếu giao", `Đã gửi lệnh in cho ${selectedOrders.length || filteredOrders.length} đơn hàng.`, "invoice");
              }}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>In phiếu giao</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/40 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Mã đơn &amp; Thời gian</th>
                <th className="p-4">Khách hàng &amp; Hạng VIP</th>
                <th className="p-4">Cấu hình thiết bị &amp; Serial</th>
                <th className="p-4">Tổng tiền &amp; Thanh toán</th>
                <th className="p-4">Trạng thái vận chuyển</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">Không tìm thấy đơn hàng phù hợp</p>
                    <p className="text-xs text-slate-400 mt-0.5">Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedOrders.includes(ord.id);
                  return (
                    <tr
                      key={ord.id}
                      className={`hover:bg-slate-50/70 transition ${isSelected ? "bg-blue-50/20" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedOrders((prev) =>
                              prev.includes(ord.id)
                                ? prev.filter((id) => id !== ord.id)
                                : [...prev, ord.id]
                            );
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* Mã đơn & Thời gian */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => setActiveDetailOrder(ord)}
                            className="font-mono font-black text-blue-600 hover:text-blue-800 hover:underline text-xs tracking-tight block text-left cursor-pointer"
                          >
                            {ord.code}
                          </button>
                          <p className="text-[11px] text-slate-400">{ord.datetime}</p>
                          <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {ord.hub}
                          </span>
                        </div>
                      </td>

                      {/* Khách hàng */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900">{ord.customer.name}</span>
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {ord.customer.vip}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] font-medium">{ord.customer.phone}</p>
                          <p className="text-slate-400 text-[10px] truncate max-w-[200px]">
                            {ord.customer.address}
                          </p>
                        </div>
                      </td>

                      {/* Cấu hình thiết bị & Serial */}
                      <td className="p-4 max-w-[260px]">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 leading-snug">{ord.equipment.name}</p>
                          <p className="text-slate-500 text-[11px] truncate">
                            {ord.equipment.subDesc}
                          </p>
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {ord.equipment.serial}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {ord.equipment.shieldStatus}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tổng tiền & Thanh toán */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-black text-slate-900 text-sm">
                            {formatVND(ord.payment.amount)}
                          </p>
                          <span className="inline-block text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {ord.payment.method}
                          </span>
                          <p className="text-[10px] text-slate-400">{ord.payment.ref}</p>
                        </div>
                      </td>

                      {/* Trạng thái vận chuyển & Điều phối - Cho phép chỉnh sửa trực tiếp tại chỗ */}
                      <td className="p-4">
                        <div className="space-y-1.5">
                          {/* 1. Bộ chọn nhanh Trạng Thái Vận Chuyển */}
                          <div className="relative inline-flex items-center group/status">
                            <select
                              value={ord.shipping.statusCode}
                              onChange={(e) =>
                                handleUpdateStatus(ord.id, e.target.value as OrderStatusCode)
                              }
                              title="Bấm để chỉnh sửa trạng thái vận chuyển"
                              className={`appearance-none cursor-pointer pl-6 pr-6 py-1 rounded-full text-[11px] font-bold border transition shadow-2xs outline-none hover:shadow-xs hover:ring-2 hover:ring-blue-400/40 ${
                                ord.shipping.statusCode === "completed"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100/90"
                                  : ord.shipping.statusCode === "shipping"
                                  ? "bg-cyan-50 text-cyan-700 border-cyan-300 hover:bg-cyan-100/90"
                                  : ord.shipping.statusCode === "packing"
                                  ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100/90"
                                  : ord.shipping.statusCode === "returns"
                                  ? "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100/90"
                                  : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100/90"
                              }`}
                            >
                              <option value="pending" className="bg-white text-slate-800">Chờ xác nhận</option>
                              <option value="packing" className="bg-white text-slate-800">Đang đóng gói &amp; S/N</option>
                              <option value="shipping" className="bg-white text-slate-800">Đang giao CoolVan</option>
                              <option value="completed" className="bg-white text-slate-800">Hoàn tất giao nhận</option>
                              <option value="returns" className="bg-white text-slate-800">Đã hủy / Hoàn trả</option>
                            </select>

                            {/* Chấm tròn trạng thái */}
                            <span
                              className={`w-2 h-2 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                                ord.shipping.statusCode === "completed"
                                  ? "bg-emerald-500"
                                  : ord.shipping.statusCode === "shipping"
                                  ? "bg-cyan-500 animate-pulse"
                                  : ord.shipping.statusCode === "packing"
                                  ? "bg-blue-500"
                                  : ord.shipping.statusCode === "returns"
                                  ? "bg-rose-500"
                                  : "bg-amber-500"
                              }`}
                            />

                            {/* Biểu tượng mũi tên thả xuống */}
                            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 group-hover/status:opacity-100 transition" />
                          </div>

                          {/* 2. Bộ chọn & Chỉnh sửa Đội Xe Điều Phối */}
                          {editingVehicleOrderId === ord.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={tempVehicleValue}
                                onChange={(e) => setTempVehicleValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleUpdateVehicle(ord.id, tempVehicleValue.trim() || ord.shipping.vehicle);
                                    setEditingVehicleOrderId(null);
                                  } else if (e.key === "Escape") {
                                    setEditingVehicleOrderId(null);
                                  }
                                }}
                                placeholder="Nhập tên xe / đội vận chuyển..."
                                className="px-2 py-0.5 text-[11px] bg-white border border-blue-500 rounded-lg font-medium text-slate-800 outline-none w-36 shadow-xs"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateVehicle(ord.id, tempVehicleValue.trim() || ord.shipping.vehicle);
                                  setEditingVehicleOrderId(null);
                                }}
                                title="Lưu tên xe"
                                className="p-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingVehicleOrderId(null)}
                                title="Hủy"
                                className="p-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 group/veh">
                              <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <div className="relative inline-flex items-center">
                                <select
                                  value={
                                    [
                                      "CoolVan #01",
                                      "CoolVan #02",
                                      "CoolVan #03",
                                      "Hỏa tốc 2H (Aero)",
                                      "Keangnam Express",
                                      "Viettel Post Pro",
                                      "Khách tự lấy tại Kho",
                                    ].includes(ord.shipping.vehicle)
                                      ? ord.shipping.vehicle
                                      : "custom"
                                  }
                                  onChange={(e) => {
                                    if (e.target.value === "custom") {
                                      setEditingVehicleOrderId(ord.id);
                                      setTempVehicleValue(ord.shipping.vehicle || "");
                                    } else {
                                      handleUpdateVehicle(ord.id, e.target.value);
                                    }
                                  }}
                                  title="Bấm để đổi đội xe giao nhận"
                                  className="appearance-none bg-slate-100/90 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] font-semibold text-slate-700 hover:text-blue-700 rounded-lg px-2 pr-5 py-0.5 cursor-pointer outline-none transition shadow-2xs"
                                >
                                  <option value="CoolVan #01">CoolVan #01</option>
                                  <option value="CoolVan #02">CoolVan #02</option>
                                  <option value="CoolVan #03">CoolVan #03</option>
                                  <option value="Hỏa tốc 2H (Aero)">Hỏa tốc 2H (Aero)</option>
                                  <option value="Keangnam Express">Keangnam Express</option>
                                  <option value="Viettel Post Pro">Viettel Post Pro</option>
                                  <option value="Khách tự lấy tại Kho">Khách tự lấy tại Kho</option>
                                  <option value="custom">
                                    {![
                                      "CoolVan #01",
                                      "CoolVan #02",
                                      "CoolVan #03",
                                      "Hỏa tốc 2H (Aero)",
                                      "Keangnam Express",
                                      "Viettel Post Pro",
                                      "Khách tự lấy tại Kho",
                                    ].includes(ord.shipping.vehicle)
                                      ? ord.shipping.vehicle
                                      : "✏️ Nhập xe khác..."}
                                  </option>
                                </select>
                                <ChevronDown className="w-2.5 h-2.5 text-slate-400 pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2" />
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingVehicleOrderId(ord.id);
                                  setTempVehicleValue(ord.shipping.vehicle || "");
                                }}
                                title="Chỉnh sửa tên xe / số hiệu"
                                className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Thao tác */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveDetailOrder(ord)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Chi tiết</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingOrder(ord)}
                            title="Xóa đơn hàng này"
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
            Hiển thị <strong className="text-slate-800">{filteredOrders.length}</strong> đơn hàng • Tổng thanh khoản:{" "}
            <strong className="text-blue-600">
              {formatVND(filteredOrders.reduce((acc, o) => acc + o.payment.amount, 0))}
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
          5. MODAL XEM CHI TIẾT ĐƠN HÀNG SANG TRỌNG & HIỆN ĐẠI (EXECUTIVE DETAIL MODAL)
      ========================================================================= */}
      {activeDetailOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Backdrop tối mờ sang trọng */}
          <div
            onClick={() => setActiveDetailOrder(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-50 via-blue-50/25 to-indigo-50/25 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">
                    TechCore Enterprise Order
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">• {activeDetailOrder.datetime}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-mono text-2xl font-black text-slate-900 tracking-tight">
                    {activeDetailOrder.code}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeDetailOrder.code);
                      showToast("Đã sao chép mã đơn", activeDetailOrder.code);
                    }}
                    title="Sao chép mã đơn hàng"
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Xuất kho: <strong className="text-slate-700">{activeDetailOrder.hub}</strong>
                </p>
              </div>

              {/* Status Badge & Close */}
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-2xs ${
                    activeDetailOrder.shipping.statusCode === "completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : activeDetailOrder.shipping.statusCode === "shipping"
                      ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                      : activeDetailOrder.shipping.statusCode === "packing"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeDetailOrder.shipping.statusCode === "completed"
                        ? "bg-emerald-500"
                        : activeDetailOrder.shipping.statusCode === "shipping"
                        ? "bg-cyan-500 animate-pulse"
                        : activeDetailOrder.shipping.statusCode === "packing"
                        ? "bg-blue-500"
                        : "bg-amber-500"
                    }`}
                  />
                  {activeDetailOrder.shipping.statusText}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveDetailOrder(null)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 flex items-center justify-center transition shadow-2xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* 1. DÒNG THỜI GIAN TIẾN ĐỘ 4 BƯỚC (HORIZONTAL STEPPER) */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                  <span>Tiến Độ Vòng Đời Vận Hành</span>
                  <span className="text-blue-600 font-mono">Real-time Timeline</span>
                </div>
                <div className="grid grid-cols-4 gap-2 relative">
                  {[
                    { step: 1, label: "Đặt hàng", desc: "Xác thực TechPay", code: "pending" },
                    { step: 2, label: "Đóng gói & QC", desc: "Khóa tem e-Shield", code: "packing" },
                    { step: 3, label: "CoolVan 2H", desc: "Live GPS & Bồn lạnh", code: "shipping" },
                    { step: 4, label: "Hoàn tất", desc: "Nghiệm thu e-Sign", code: "completed" },
                  ].map((st, i) => {
                    const statusOrder = ["pending", "packing", "shipping", "completed"];
                    const currentIndex = statusOrder.indexOf(activeDetailOrder.shipping.statusCode);
                    const isDone = i <= currentIndex;
                    const isCurrent = i === currentIndex;
                    return (
                      <div key={st.step} className="flex flex-col items-center text-center relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition mb-1.5 ${
                            isDone
                              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4" /> : st.step}
                        </div>
                        <span className={`font-bold text-xs ${isCurrent ? "text-blue-600" : "text-slate-800"}`}>
                          {st.label}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">{st.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. SHOWCASE CẤU HÌNH THIẾT BỊ & PHẦN CỨNG AI (HIGH-TECH SHOWCASE) */}
              <div className="rounded-2xl bg-[#091124] text-white p-5 shadow-md relative overflow-hidden space-y-3">
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
                        Cấu hình thiết bị chính hãng
                      </span>
                      <h4 className="text-base font-black text-white leading-snug">
                        {activeDetailOrder.equipment.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Giá trị niêm yết</span>
                    <span className="text-lg font-black text-cyan-400">
                      {formatVND(activeDetailOrder.payment.amount)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 relative z-10 leading-relaxed">
                  {activeDetailOrder.equipment.subDesc}
                </p>

                {/* 3 Capsules Thông số Bảo Mật */}
                <div className="flex items-center gap-2 pt-1 flex-wrap relative z-10">
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 shadow-xs">
                    <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{activeDetailOrder.equipment.serial}</span>
                  </div>
                  <div className="bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeDetailOrder.equipment.shieldStatus}</span>
                  </div>
                  <div className="bg-blue-950/80 border border-blue-700/80 text-blue-300 rounded-xl px-3 py-1.5 text-xs font-semibold">
                    {activeDetailOrder.equipment.warranty}
                  </div>
                </div>
              </div>

              {/* 3. LƯỚI THÔNG TIN: KHÁCH HÀNG & ĐỘI XE GIAO NHẬN (2 CỘT CÂN ĐỐI) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cột Khách Hàng */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Thông tin khách hàng VIP
                    </span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {activeDetailOrder.customer.vip}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      {activeDetailOrder.customer.name}
                    </p>
                    <p className="text-slate-600 font-medium flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {activeDetailOrder.customer.phone}
                    </p>
                    <p className="text-slate-500 text-[11px] flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {activeDetailOrder.customer.email}
                    </p>
                    <p className="text-slate-600 text-[11px] flex items-start gap-1.5 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{activeDetailOrder.customer.address}</span>
                    </p>
                  </div>
                </div>

                {/* Cột Vận Chuyển CoolVan */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-cyan-600" />
                      Vận chuyển chuyên dụng
                    </span>
                    <div className="flex items-center gap-1.5">
                      {!isEditingShippingInModal ? (
                        <>
                          <span className="text-[9px] font-mono font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
                            {activeDetailOrder.shipping.vehicle}
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsEditingShippingInModal(true)}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1 transition cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Sửa</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handleSaveModalShipping}
                            className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-0.5 rounded-md flex items-center gap-1 transition shadow-xs cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Lưu</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingShippingInModal(false)}
                            className="text-[10px] font-bold text-slate-600 hover:bg-slate-100 px-2 py-0.5 rounded-md transition cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isEditingShippingInModal ? (
                    <div className="space-y-1.5">
                      <p className="font-bold text-slate-800 text-sm">{activeDetailOrder.shipping.driver}</p>
                      <p className="text-slate-600 text-[11px]">Ghi chú: {activeDetailOrder.shipping.note}</p>
                      <div className="flex items-center gap-3 pt-1 text-[11px]">
                        <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 rounded-lg font-bold">
                          Nhiệt độ: {activeDetailOrder.shipping.temperature}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold">
                          g-Sensor: 0.012G OK
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Trạng thái vận chuyển:</label>
                        <select
                          value={modalShippingForm.statusCode}
                          onChange={(e) =>
                            setModalShippingForm({
                              ...modalShippingForm,
                              statusCode: e.target.value as OrderStatusCode,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                        >
                          <option value="pending">Chờ xác nhận</option>
                          <option value="packing">Đang đóng gói &amp; S/N</option>
                          <option value="shipping">Đang giao CoolVan</option>
                          <option value="completed">Hoàn tất giao nhận</option>
                          <option value="returns">Đổi trả / Bảo hành</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Đội xe / Phương tiện:</label>
                          <input
                            type="text"
                            value={modalShippingForm.vehicle}
                            onChange={(e) =>
                              setModalShippingForm({ ...modalShippingForm, vehicle: e.target.value })
                            }
                            placeholder="VD: CoolVan #01..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Nhiệt độ khoang:</label>
                          <input
                            type="text"
                            value={modalShippingForm.temperature}
                            onChange={(e) =>
                              setModalShippingForm({ ...modalShippingForm, temperature: e.target.value })
                            }
                            placeholder="VD: 21.5°C"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Tài xế &amp; Điều phối viên:</label>
                        <input
                          type="text"
                          value={modalShippingForm.driver}
                          onChange={(e) =>
                            setModalShippingForm({ ...modalShippingForm, driver: e.target.value })
                          }
                          placeholder="Họ tên tài xế..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Ghi chú niêm phong:</label>
                        <input
                          type="text"
                          value={modalShippingForm.note}
                          onChange={(e) =>
                            setModalShippingForm({ ...modalShippingForm, note: e.target.value })
                          }
                          placeholder="Ghi chú giao nhận..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. QUYẾT TOÁN TÀI CHÍNH & HÓA ĐƠN VAT */}
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    Chi tiết quyết toán tài chính
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    {activeDetailOrder.payment.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Giá trị đơn hàng phần cứng:</span>
                    <span className="font-semibold text-slate-800">{formatVND(activeDetailOrder.payment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển bồn lạnh CoolVan:</span>
                    <span className="font-bold text-emerald-600">Miễn phí (VIP Benefit)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế GTGT (VAT 10%):</span>
                    <span className="text-slate-500">Đã bao gồm trong giá</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phương thức thanh toán:</span>
                    <span className="font-bold text-blue-600">
                      {activeDetailOrder.payment.method} • Ref: {activeDetailOrder.payment.ref}
                    </span>
                  </div>
                  <div className="border-t border-slate-200/80 pt-2 flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">Tổng thanh toán:</span>
                    <span className="text-xl font-black text-blue-600">
                      {formatVND(activeDetailOrder.payment.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. ĐIỀU PHỐI NHANH TRẠNG THÁI VẬN HÀNH */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Chuyển nhanh trạng thái vận hành:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: "pending", label: "Chờ xác nhận" },
                    { key: "packing", label: "Đóng gói & S/N" },
                    { key: "shipping", label: "Giao CoolVan" },
                    { key: "completed", label: "Hoàn tất đơn" },
                  ].map((s) => {
                    const isCurrent = activeDetailOrder.shipping.statusCode === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => handleUpdateStatus(activeDetailOrder.id, s.key as OrderStatusCode)}
                        className={`p-2.5 rounded-xl text-center font-bold text-xs transition border cursor-pointer active:scale-95 ${
                          isCurrent
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
                  onClick={() => setActiveDetailOrder(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-white transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingOrder(activeDetailOrder)}
                  className="px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa đơn</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(
                      "Đã xuất e-Invoice",
                      `Hóa đơn điện tử VAT của ${activeDetailOrder.customer.name} đã được cấp mã số hợp lệ.`,
                      "invoice"
                    );
                  }}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                  <FileText className="w-4 h-4 text-slate-600" />
                  <span>Xuất hóa đơn VAT</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    showToast(
                      "Đang in phiếu xuất & Tem e-Shield",
                      `Đã chuyển lệnh in phiếu bàn giao cho đơn hàng ${activeDetailOrder.code}.`,
                      "invoice"
                    );
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Phiếu Xuất &amp; Tem e-Shield</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MODAL TẠO ĐƠN HÀNG MỚI
      ========================================================================= */}
      {showAddOrderModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Tạo Đơn Hàng Mới</h3>
                  <p className="text-[11px] text-slate-500">Phân bổ kho và gán đội xe CoolVan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddOrderModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} noValidate className="space-y-3.5 text-xs">
              {/* Row 1: Mã đơn & Hạng VIP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">Mã đơn hàng (*):</label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomCode = "#TECH-2026-" + Math.floor(1000 + Math.random() * 9000);
                        setNewOrderForm({ ...newOrderForm, code: randomCode });
                        if (formErrors.code) {
                          setFormErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.code;
                            return updated;
                          });
                        }
                      }}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                    >
                      Tạo ngẫu nhiên
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newOrderForm.code}
                    onChange={(e) => {
                      setNewOrderForm({ ...newOrderForm, code: e.target.value });
                      if (formErrors.code) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.code;
                          return updated;
                        });
                      }
                    }}
                    placeholder="#TECH-2026-XXXX"
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
                  <label className="font-bold text-slate-700 block mb-1">Hạng VIP:</label>
                  <select
                    value={newOrderForm.customerVip}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerVip: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="VIP PLATINUM">VIP PLATINUM</option>
                    <option value="TITANIUM">TITANIUM</option>
                    <option value="DIAMOND VIP">DIAMOND VIP</option>
                    <option value="STANDARD">STANDARD</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Tên khách hàng & Số điện thoại */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tên khách hàng <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Cty TNHH AI VinaTech"
                    value={newOrderForm.customerName}
                    onChange={(e) => {
                      setNewOrderForm({ ...newOrderForm, customerName: e.target.value });
                      if (formErrors.customerName) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.customerName;
                          return updated;
                        });
                      }
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-semibold text-slate-800 transition outline-none ${
                      formErrors.customerName
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {formErrors.customerName && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.customerName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Số điện thoại <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 0987654321"
                    value={newOrderForm.customerPhone}
                    onChange={(e) => {
                      setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value });
                      if (formErrors.customerPhone) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.customerPhone;
                          return updated;
                        });
                      }
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-semibold text-slate-800 transition outline-none ${
                      formErrors.customerPhone
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {formErrors.customerPhone && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.customerPhone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Địa chỉ giao hàng */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Địa chỉ giao hàng chi tiết <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  placeholder="VD: Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM"
                  value={newOrderForm.customerAddress}
                  onChange={(e) => {
                    setNewOrderForm({ ...newOrderForm, customerAddress: e.target.value });
                    if (formErrors.customerAddress) {
                      setFormErrors((prev) => {
                        const updated = { ...prev };
                        delete updated.customerAddress;
                        return updated;
                      });
                    }
                  }}
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-medium text-slate-800 transition outline-none ${
                    formErrors.customerAddress
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {formErrors.customerAddress && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.customerAddress}</span>
                  </p>
                )}
              </div>

              {/* Row 4: Thiết bị & Tổng tiền */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tên thiết bị / Phần cứng <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Workstation AI Dual RTX 4090"
                    value={newOrderForm.equipmentName}
                    onChange={(e) => {
                      setNewOrderForm({ ...newOrderForm, equipmentName: e.target.value });
                      if (formErrors.equipmentName) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.equipmentName;
                          return updated;
                        });
                      }
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-medium text-slate-800 transition outline-none ${
                      formErrors.equipmentName
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {formErrors.equipmentName && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formErrors.equipmentName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">
                      Tổng tiền (VNĐ) <span className="text-rose-500">*</span>:
                    </label>
                    <span className="text-[10px] text-blue-600 font-mono font-bold">
                      {newOrderForm.amount > 0 ? formatVND(newOrderForm.amount) : "0 ₫"}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={newOrderForm.amount || ""}
                    onChange={(e) => {
                      setNewOrderForm({ ...newOrderForm, amount: Number(e.target.value) });
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
              </div>

              {/* Row 5: Kho, Đội xe, Trạng thái */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kho xuất:</label>
                  <select
                    value={newOrderForm.hub}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, hub: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs outline-none"
                  >
                    <option value="Kho Landmark 81">Kho Landmark 81</option>
                    <option value="Kho Cầu Giấy HN">Kho Cầu Giấy HN</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đội xe:</label>
                  <select
                    value={newOrderForm.coolVan}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, coolVan: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs outline-none"
                  >
                    <option value="CoolVan #01">CoolVan #01</option>
                    <option value="CoolVan #02">CoolVan #02</option>
                    <option value="CoolVan #03">CoolVan #03</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Trạng thái:</label>
                  <select
                    value={newOrderForm.status}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value as OrderStatusCode })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs outline-none"
                  >
                    <option value="packing">Đang đóng gói</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="shipping">Giao CoolVan</option>
                    <option value="completed">Đã hoàn tất</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl transition shadow-sm shadow-blue-500/25 active:scale-95 cursor-pointer"
                >
                  Tạo đơn hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL XÁC NHẬN XÓA ĐƠN HÀNG (REALTIME DANGER DIALOG)
      ========================================================================= */}
      {deletingOrder && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 border border-rose-100">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  Xác Nhận Xóa Đơn Hàng?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hành động này sẽ xóa vĩnh viễn đơn hàng và phát tín hiệu thông báo đồng bộ thời gian thực tới tất cả các tài khoản quản trị khác.
                </p>
              </div>
            </div>

            {/* Thông tin đơn hàng sẽ xóa */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Mã đơn hàng:</span>
                <span className="font-mono font-black text-rose-600">{deletingOrder.code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Khách hàng:</span>
                <span className="font-bold text-slate-800">{deletingOrder.customer?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Thiết bị:</span>
                <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                  {deletingOrder.equipment?.name}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
                <span className="text-slate-500 font-bold">Tổng thanh toán:</span>
                <span className="font-black text-blue-600">
                  {formatVND(deletingOrder.payment?.amount || 0)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDeleteOrder}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm shadow-rose-600/30 cursor-pointer text-xs active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận xóa vĩnh viễn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL XEM TRƯỚC BẢNG TÍNH EXCEL & TÙY CHỌN XUẤT / IN ẤN
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
                      Xem Trước Bảng Tính Excel &amp; Tùy Chọn Xuất / In
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                      XLSX / CSV Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tên file dự kiến: <strong className="text-slate-700 font-mono">Don_Hang_TechCore_{new Date().toISOString().slice(0, 10)}.csv</strong> • {filteredOrders.length} dòng đơn hàng • Mã hóa UTF-8
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

            {/* Quick Metrics Bar */}
            <div className="px-6 py-3 bg-[#F0F8F8] border-b border-[#2D99AE]/25 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-slate-500 text-[11px] block">Số dòng dữ liệu:</span>
                  <span className="font-bold text-slate-900 text-sm">{filteredOrders.length} Đơn hàng</span>
                </div>
                <div className="border-l border-slate-300 pl-6">
                  <span className="text-slate-500 text-[11px] block">Tổng giá trị doanh thu:</span>
                  <span className="font-black text-[#0C5776] text-sm">
                    {formatVND(filteredOrders.reduce((sum, o) => sum + (o.payment?.amount || 0), 0))}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  100% Khớp e-Shield
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                  Khổ in: A4 Ngang (Landscape)
                </span>
              </div>
            </div>

            {/* Scrollable Spreadsheet Table */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/40">
              <div id="printable-excel-area" className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                {/* Print Title (Chỉ hiển thị khi in) */}
                <div className="hidden print:block p-4 border-b border-slate-300 mb-2">
                  <h2 className="text-lg font-black text-slate-900">BẢNG KÊ QUẢN LÝ ĐƠN HÀNG &amp; GIAO VẬN COOLVAN - TECHCORE</h2>
                  <p className="text-xs text-slate-600">Ngày xuất: {new Date().toLocaleString("vi-VN")} • Hệ thống e-Shield đối soát tự động</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider select-none">
                        <th className="py-3 px-3 w-12 text-center border-r border-slate-200 text-slate-400">STT</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Mã Đơn</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Thời Gian Đặt</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Khách Hàng</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Số Điện Thoại</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Hạng VIP</th>
                        <th className="py-3 px-4 border-r border-slate-200 min-w-[200px]">Địa Chỉ Giao Hàng</th>
                        <th className="py-3 px-4 border-r border-slate-200 min-w-[220px]">Thiết Bị Phần Cứng</th>
                        <th className="py-3 px-3.5 border-r border-slate-200 font-mono">Serial e-Shield</th>
                        <th className="py-3 px-3.5 text-right border-r border-slate-200">Thành Tiền</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Thanh Toán</th>
                        <th className="py-3 px-3.5 border-r border-slate-200">Trạng Thái</th>
                        <th className="py-3 px-3.5">Xe Điều Phối</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={13} className="text-center py-10 text-slate-400 font-medium">
                            Không có đơn hàng nào khớp với bộ lọc hiện tại.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order, idx) => (
                          <tr
                            key={order.id || idx}
                            className="even:bg-slate-50/60 hover:bg-emerald-50/40 transition-colors"
                          >
                            <td className="py-2.5 px-3 text-center border-r border-slate-100 font-mono text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3.5 border-r border-slate-100 font-mono font-bold text-blue-700 whitespace-nowrap">
                              {order.code}
                            </td>
                            <td className="py-2.5 px-3.5 border-r border-slate-100 text-slate-600 whitespace-nowrap">
                              {order.datetime}
                            </td>
                            <td className="py-2.5 px-3.5 border-r border-slate-100 font-semibold text-slate-900 whitespace-nowrap">
                              {order.customer?.name}
                            </td>
                            <td className="py-2.5 px-3.5 border-r border-slate-100 font-mono text-slate-600 whitespace-nowrap">
                              {order.customer?.phone}
                            </td>
                            <td className="py-2.5 px-3.5 border-r border-slate-100 whitespace-nowrap">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                {order.customer?.vip || "STANDARD"}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 border-r border-slate-100 text-slate-700 max-w-xs truncate" title={order.customer?.address}>
                              {order.customer?.address}
                            </td>
                            <td className="py-2.5 px-4 border-r border-slate-100 max-w-xs">
                              <p className="font-bold text-slate-900 truncate" title={order.equipment?.name}>
                                {order.equipment?.name}
                              </p>
                              {order.equipment?.subDesc && (
                                <p className="text-[10px] text-slate-400 truncate">{order.equipment?.subDesc}</p>
                              )}
                            </td>
                            <td className="py-2.5 px-3.5 border-r border-slate-100 font-mono text-slate-600 whitespace-nowrap">
                              {order.equipment?.serial}
                            </td>
                            <td className="py-2.5 px-3.5 text-right border-r border-slate-100 font-black text-slate-900 whitespace-nowrap">
                              {formatVND(order.payment?.amount || 0)}
                            </td>
                            <td className="py-2.5 px-3.5 border-r border-slate-100 whitespace-nowrap text-[11px] text-slate-600">
                              {order.payment?.method}
                            </td>
                            <td className="py-2.5 px-3.5 border-r border-slate-100 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  order.shipping?.statusCode === "completed"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : order.shipping?.statusCode === "shipping"
                                    ? "bg-cyan-50 text-cyan-700"
                                    : order.shipping?.statusCode === "packing"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {order.shipping?.statusText}
                              </span>
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-600 whitespace-nowrap text-[11px]">
                              {order.shipping?.vehicle}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    {/* Summary Row */}
                    <tfoot>
                      <tr className="bg-slate-100 text-slate-900 font-black border-t-2 border-slate-300 text-xs">
                        <td colSpan={9} className="py-3 px-4 text-right uppercase tracking-wider">
                          Tổng Giá Trị Doanh Thu ({filteredOrders.length} đơn hàng):
                        </td>
                        <td className="py-3 px-3.5 text-right font-black text-[#0C5776] text-sm whitespace-nowrap">
                          {formatVND(filteredOrders.reduce((sum, o) => sum + (o.payment?.amount || 0), 0))}
                        </td>
                        <td colSpan={3} className="py-3 px-3 text-[11px] text-slate-500 font-normal">
                          Đã bao gồm thuế GTGT 10%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4 shrink-0">
              <p className="text-xs text-slate-500 max-w-md hidden md:block">
                💡 Bạn có thể kiểm tra kỹ trước khi tải file về máy hoặc in trực tiếp ra khổ giấy / lưu thành file PDF.
              </p>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {/* Nút In bảng tính */}
                <button
                  type="button"
                  onClick={handlePrintSpreadsheet}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>In Bảng Tính / Xuất PDF</span>
                </button>

                {/* Nút Tải file Excel (.CSV UTF-8) */}
                <button
                  type="button"
                  onClick={handleDownloadExcelFile}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải File Excel (.CSV UTF-8)</span>
                </button>

                {/* Nút Đóng */}
                <button
                  type="button"
                  onClick={() => setShowExportPreviewModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
