"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Search,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  Phone,
  MapPin,
  RefreshCw,
  RotateCcw,
  Receipt,
  Eye,
  X,
  AlertTriangle,
  Trash2,
  Printer,
  Sparkles,
  Calendar,
  Check,
  Copy,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";
import { api } from "../../lib/api";
import { formatVND } from "../../lib/utils";
import { useCart } from "../../context/CartContext";
import { vipToast } from "../../components/common/VipToast";

interface OrderItem {
  id: string;
  variantId?: string;
  productName: string;
  sku?: string;
  quantity: number;
  lineTotal: number;
  serialNumber?: string;
}

interface Order {
  id: string;
  code: string;
  receiverName: string;
  phone: string;
  guestEmail?: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  note?: string;
  paymentMethod: string;
  paymentStatus: string;
  status: "pending" | "confirmed" | "packing" | "shipping" | "completed" | "cancelled" | string;
  grandTotal: number;
  createdAt: string;
  items: OrderItem[];
  cancelReason?: string;
}

export default function DonHangPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightCode = searchParams.get("code") || "";
  const { addToCart } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(highlightCode);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // States for Cancel & Delete & Re-order
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("Thay đổi ý định mua hàng");
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getMyOrders();
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
        if (highlightCode) {
          const match = res.data.find(
            (o: Order) => o.code?.toUpperCase() === highlightCode.trim().toUpperCase()
          );
          if (match) setSelectedOrder(match);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // Lắng nghe sự kiện đồng bộ đơn hàng theo thời gian thực (từ Admin hoặc Checkout)
    const handleOrdersSync = () => {
      loadOrders();
    };

    window.addEventListener("techcore:orders-changed", handleOrdersSync);
    return () => {
      window.removeEventListener("techcore:orders-changed", handleOrdersSync);
    };
  }, [highlightCode]);

  // Chuẩn hóa trạng thái đơn hàng
  const normalizeStatus = (status?: string): string => {
    const s = (status || "").toLowerCase().trim();
    if (s === "confirmed" || s === "packing") return "packing";
    if (s === "shipping") return "shipping";
    if (s === "completed") return "completed";
    if (s === "cancelled") return "cancelled";
    return "pending";
  };

  // Tính số lượng cho từng tab
  const tabCounts = {
    all: orders.length,
    pending: orders.filter((o) => normalizeStatus(o.status) === "pending").length,
    packing: orders.filter((o) => normalizeStatus(o.status) === "packing").length,
    shipping: orders.filter((o) => normalizeStatus(o.status) === "shipping").length,
    completed: orders.filter((o) => normalizeStatus(o.status) === "completed").length,
    cancelled: orders.filter((o) => normalizeStatus(o.status) === "cancelled").length,
  };

  // Bộ lọc đơn hàng
  const filteredOrders = orders.filter((o) => {
    const norm = normalizeStatus(o.status);
    let matchesStatus = selectedStatus === "all" ? true : norm === selectedStatus;
    if (selectedStatus === "confirmed" || selectedStatus === "packing") {
      matchesStatus = norm === "packing";
    }

    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      o.code.toLowerCase().includes(query) ||
      o.phone.toLowerCase().includes(query) ||
      o.receiverName.toLowerCase().includes(query) ||
      o.items?.some((it) => it.productName.toLowerCase().includes(query));
    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: string) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Chờ xác nhận
          </span>
        );
      case "packing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
            <Package className="w-3.5 h-3.5 text-blue-600" />
            Đang đóng gói &amp; S/N
          </span>
        );
      case "shipping":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-cyan-600 animate-bounce" />
            Đang giao hàng
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Giao hàng thành công
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Đã hủy đơn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  // 1. Xử lý Hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!cancellingOrderId) return;
    try {
      const res = await api.cancelOrder(cancellingOrderId, cancelReason);
      if (res.success) {
        vipToast.success("Đã hủy đơn hàng thành công.", "Hủy đơn hàng");
        setCancellingOrderId(null);
        await loadOrders();
      }
    } catch (e: any) {
      vipToast.error("Lỗi hủy đơn: " + e.message, "Thông báo");
    }
  };

  // 2. Xử lý Xóa đơn hàng khỏi lịch sử
  const handleDeleteOrder = async () => {
    if (!deletingOrderId) return;
    try {
      const res = await api.deleteOrderFromHistory(deletingOrderId);
      if (res.success) {
        vipToast.success("Đã xóa đơn hàng khỏi lịch sử hiển thị.", "Xóa đơn hàng");
        setDeletingOrderId(null);
        if (selectedOrder && (selectedOrder.id === deletingOrderId || selectedOrder.code === deletingOrderId)) {
          setSelectedOrder(null);
        }
        await loadOrders();
      }
    } catch (e: any) {
      vipToast.error("Lỗi xóa đơn: " + e.message, "Thông báo");
    }
  };

  // 3. Xử lý Mua lại đơn hàng (Re-order)
  const handleReorder = async (order: Order) => {
    try {
      setReordering(true);
      for (const item of order.items) {
        await addToCart(item.variantId || "var-1", item.quantity || 1);
      }
      vipToast.success(
        `Đã thêm ${order.items.length} sản phẩm vào giỏ hàng! Đang chuyển đến giỏ hàng...`,
        "Mua lại đơn hàng"
      );
      setTimeout(() => {
        router.push("/gio-hang");
      }, 500);
    } catch (e: any) {
      vipToast.error("Lỗi khi mua lại đơn: " + e.message, "Thông báo");
    } finally {
      setReordering(false);
    }
  };

  // In hóa đơn
  const handlePrintOrder = (order: Order) => {
    vipToast.invoice(`Đang tải hóa đơn điện tử e-Invoice cho đơn ${order.code}...`, "In Hóa Đơn");
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:text-blue-600 transition">Trang chủ</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Lịch sử đơn hàng</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
              <Package className="w-7 h-7 text-blue-600" />
              Lịch Sử Đơn Hàng Của Tôi
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Theo dõi tình trạng đơn hàng, lộ trình vận chuyển, mua lại nhanh và xóa lịch sử đơn đã hủy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition shadow-xs text-xs font-bold flex items-center gap-1.5"
              title="Làm mới danh sách"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Cập nhật</span>
            </button>
            <Link
              href="/"
              className="p-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tiếp tục mua hàng</span>
            </Link>
          </div>
        </div>

        {/* Filter bar & Search */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo Mã đơn (TECH-2026-XXXX), Số điện thoại hoặc tên sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {[
              { id: "all", label: `Tất cả (${tabCounts.all})` },
              { id: "pending", label: `Chờ xác nhận (${tabCounts.pending})` },
              { id: "packing", label: `Đang xử lý (${tabCounts.packing})` },
              { id: "shipping", label: `Đang giao (${tabCounts.shipping})` },
              { id: "completed", label: `Hoàn thành (${tabCounts.completed})` },
              { id: "cancelled", label: `Đã hủy (${tabCounts.cancelled})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedStatus === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Đang tải lịch sử đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Không có đơn hàng nào trong mục này</h3>
              <p className="text-xs text-slate-500 mt-1">
                {searchQuery
                  ? "Không có đơn hàng nào khớp với từ khóa tìm kiếm của bạn."
                  : "Danh sách đơn hàng của bạn đang trống."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const norm = normalizeStatus(order.status);
              return (
                <div
                  key={order.id || order.code}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Mã đơn: <strong className="text-blue-600">{order.code}</strong>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Gần đây"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6 divide-y divide-slate-100">
                    {order.items?.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex-1 space-y-1">
                          <p className="font-bold text-slate-900 text-sm leading-snug">
                            {item.productName}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                            {item.sku && (
                              <span>SKU: <strong className="font-mono text-slate-700">{item.sku}</strong></span>
                            )}
                            {item.serialNumber && (
                              <span className="flex items-center gap-1 bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-100">
                                <ShieldCheck className="w-3 h-3 text-blue-600" />
                                Serial/IMEI: {item.serialNumber}
                              </span>
                            )}
                            <span>Số lượng: <strong className="text-slate-800">x{item.quantity}</strong></span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                          <span className="text-xs text-slate-400 sm:hidden">Thành tiền:</span>
                          <span className="text-sm font-black text-slate-900">
                            {formatVND(item.lineTotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="p-4 sm:p-5 bg-slate-50/40 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-md">
                          Giao đến: <strong className="text-slate-800">{order.receiverName}</strong> - {[order.street, order.ward, order.district, order.province].filter(Boolean).join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>
                          Thanh toán: <strong className="text-slate-800 uppercase">{order.paymentMethod === "cod" ? "Tiền mặt khi nhận hàng (COD)" : order.paymentMethod}</strong>
                          {" "}({order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"})
                        </span>
                      </div>
                      {order.cancelReason && (
                        <p className="text-[11px] text-rose-600 font-medium">
                          Lý do hủy: {order.cancelReason}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-400 block font-semibold">Tổng thanh toán:</span>
                        <span className="text-lg font-black text-red-600">
                          {formatVND(order.grandTotal)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Chi tiết */}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>Chi tiết</span>
                        </button>

                        {/* MUA LẠI: Cho phép đặt lại nhanh các sản phẩm trong đơn */}
                        <button
                          onClick={() => handleReorder(order)}
                          disabled={reordering}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                          title="Thêm lại các sản phẩm này vào giỏ hàng để mua lại"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Mua lại</span>
                        </button>

                        {/* HỦY ĐƠN: Khả dụng khi đơn chưa vận chuyển xong */}
                        {norm !== "shipping" && norm !== "completed" && norm !== "cancelled" && (
                          <button
                            onClick={() => setCancellingOrderId(order.id || order.code)}
                            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition border border-rose-200 cursor-pointer"
                          >
                            Hủy đơn
                          </button>
                        )}

                        {/* BẢO HÀNH */}
                        {norm === "completed" && (
                          <Link
                            href={`/tra-cuu-bao-hanh?serial=${order.items?.[0]?.serialNumber || ""}`}
                            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition border border-emerald-200 flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Bảo hành</span>
                          </Link>
                        )}

                        {/* XÓA ĐƠN KHỎI LỊCH SỬ: LUÔN KHẢ DỤNG CHO MỌI ĐƠN HÀNG */}
                        <button
                          onClick={() => setDeletingOrderId(order.id || order.code)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-slate-200 hover:border-rose-200 cursor-pointer"
                          title="Xóa đơn hàng này khỏi danh sách lịch sử"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL CHI TIẾT ĐƠN HÀNG SANG TRỌNG & ĐẲNG CẤP (EXECUTIVE CYBER MODAL)
      ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-800/20">
            {/* Modal Header: Executive High-Tech Dark Style */}
            <div className="bg-[#001C44] text-white p-5 sm:p-6 relative overflow-hidden shrink-0 border-b border-[#0C5776]/40">
              {/* Subtle ambient light */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#2D99AE]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#BCFEFE]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-[#BCFEFE] bg-[#2D99AE]/20 border border-[#2D99AE]/40 px-3 py-1 rounded-xl text-sm tracking-wider">
                      {selectedOrder.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-xl">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Gần đây"}
                    </span>
                    <span className="text-[11px] font-bold text-[#BCFEFE] bg-[#0C5776]/50 border border-[#2D99AE]/40 px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#BCFEFE]" />
                      e-Shield SHA-256
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white tracking-tight">
                    Chi Tiết Hồ Sơ Đơn Hàng &amp; Vận Hành Giao Nhận
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mã hóa chuỗi khối e-Shield • Vận chuyển an toàn • Đối soát thời gian thực
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* High-Tech Stepper 4 bước với Line chuyển màu */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                {(() => {
                  const norm = normalizeStatus(selectedOrder.status);
                  const stepIndex =
                    norm === "completed" ? 4 :
                    norm === "shipping" ? 3 :
                    norm === "packing" ? 2 : 1;

                  const steps = [
                    { num: 1, title: "Tiếp Nhận", desc: "Xác thực đơn", active: stepIndex >= 1 },
                    { num: 2, title: "Đóng Gói", desc: "Khử tĩnh điện & S/N", active: stepIndex >= 2 },
                    { num: 3, title: "Giao Hàng", desc: "Đang vận chuyển", active: stepIndex >= 3 },
                    { num: 4, title: "Nghiệm Thu", desc: "Bàn giao e-Shield", active: stepIndex >= 4 },
                  ];

                  return (
                    <div className="grid grid-cols-4 gap-2 relative">
                      {steps.map((st) => (
                        <div key={st.num} className="flex flex-col items-center text-center space-y-1.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition shadow-md ${
                              st.active
                                ? "bg-gradient-to-tr from-[#0C5776] to-[#2D99AE] text-white ring-2 ring-[#BCFEFE]/50 shadow-md shadow-[#0C5776]/30"
                                : "bg-slate-800 text-slate-500 border border-slate-700/60"
                            }`}
                          >
                            {st.active ? <Check className="w-4 h-4 stroke-[3]" /> : st.num}
                          </div>
                          <div>
                            <span
                              className={`text-[11px] font-bold block ${
                                st.active ? "text-white" : "text-slate-500"
                              }`}
                            >
                              {st.title}
                            </span>
                            <span className="text-[10px] text-slate-400 hidden sm:block">
                              {st.desc}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal Body: Thẻ thông tin khách hàng & Phần cứng */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(92vh-220px)] bg-slate-50/50">
              {/* 2 Thẻ song song: Khách Hàng & Vận Chuyển */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Khách hàng */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    THÔNG TIN KHÁCH HÀNG &amp; NHẬN HÀNG
                  </span>
                  <div className="space-y-1 text-xs">
                    <p className="text-sm font-black text-slate-900">{selectedOrder.receiverName}</p>
                    <p className="text-slate-600 flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      {selectedOrder.phone}
                    </p>
                    {selectedOrder.guestEmail && (
                      <p className="text-slate-500 text-[11px] truncate">{selectedOrder.guestEmail}</p>
                    )}
                  </div>
                </div>

                {/* Vận chuyển */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    ĐỊA CHỈ &amp; ĐIỀU PHỐI GIAO HÀNG
                  </span>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-800 font-semibold leading-relaxed flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        {[selectedOrder.street, selectedOrder.ward, selectedOrder.district, selectedOrder.province]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </p>
                    {selectedOrder.note && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 font-medium">
                        Ghi chú: {selectedOrder.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Danh sách thiết bị công nghệ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    DANH SÁCH THIẾT BỊ PHẦN CỨNG ({selectedOrder.items?.length || 0})
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                    Chính Hãng 100%
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1.5 flex-1">
                        <p className="font-black text-slate-900 text-sm leading-snug">
                          {item.productName}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          {item.sku && (
                            <span className="font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              SKU: {item.sku}
                            </span>
                          )}
                          {item.serialNumber && (
                            <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              S/N: {item.serialNumber}
                            </span>
                          )}
                          <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                            Số lượng: x{item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="text-right sm:pl-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Thành tiền</span>
                        <span className="text-base font-black text-slate-900">
                          {formatVND(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thông tin thanh toán & Tổng cộng */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>Phương thức thanh toán:</span>
                  <span className="font-bold text-slate-800 uppercase">
                    {selectedOrder.paymentMethod === "cod" ? "Tiền mặt khi nhận hàng (COD)" : selectedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>Trạng thái giao dịch:</span>
                  <span className={`font-bold ${selectedOrder.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                    {selectedOrder.paymentStatus === "paid" ? "Đã thanh toán hợp lệ" : "Chưa thanh toán (Thu hộ khi giao)"}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block">Tổng tiền quyết toán:</span>
                    <span className="text-[10px] text-slate-400">Đã bao gồm thuế GTGT &amp; phí vận chuyển</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600">
                    {formatVND(selectedOrder.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintOrder(selectedOrder)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>In hóa đơn e-Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const id = selectedOrder.id || selectedOrder.code;
                    setSelectedOrder(null);
                    setDeletingOrderId(id);
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa khỏi lịch sử</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const ord = selectedOrder;
                    setSelectedOrder(null);
                    handleReorder(ord);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Mua lại đơn này</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL XÁC NHẬN HỦY ĐƠN HÀNG
      ========================================================================= */}
      {cancellingOrderId && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Xác Nhận Hủy Đơn Hàng?</h3>
              <p className="text-xs text-slate-500">
                Bạn có chắc chắn muốn hủy đơn hàng này không? Sau khi hủy, bạn vẫn có thể bấm &quot;Mua lại&quot; bất cứ lúc nào hoặc xóa đơn khỏi danh sách.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">Lý do hủy đơn:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="Thay đổi ý định mua hàng">Thay đổi ý định mua hàng</option>
                <option value="Muốn đổi sang sản phẩm khác">Muốn đổi sang sản phẩm khác</option>
                <option value="Tìm thấy giá tốt hơn ở nơi khác">Tìm thấy giá tốt hơn ở nơi khác</option>
                <option value="Nhập sai thông tin giao hàng">Nhập sai thông tin giao hàng</option>
                <option value="Khác">Lý do khác</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingOrderId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Giữ đơn hàng
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL XÁC NHẬN XÓA ĐƠN KHỎI LỊCH SỬ
      ========================================================================= */}
      {deletingOrderId && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Xóa Đơn Hàng Khỏi Lịch Sử?</h3>
              <p className="text-xs text-slate-500">
                Đơn hàng <strong className="text-slate-800 font-mono">{deletingOrderId}</strong> sẽ được xóa vĩnh viễn khỏi danh sách lịch sử hiển thị của bạn.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingOrderId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Không xóa
              </button>
              <button
                type="button"
                onClick={handleDeleteOrder}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
