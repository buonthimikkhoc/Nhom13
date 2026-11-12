"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Truck,
  ArrowLeft,
  QrCode,
  Banknote,
  Receipt,
  Package,
  Tag,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api";
import { formatVND } from "../../lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalAmount, clearCart, refreshCart } = useCart();

  const [formData, setFormData] = useState({
    receiverName: "Nguyễn Văn An",
    phone: "0987654321",
    guestEmail: "customer@gmail.com",
    province: "Hà Nội",
    district: "Cầu Giấy",
    ward: "Dịch Vọng",
    street: "Số 12 Duy Tân",
    note: "Giao trong giờ hành chính",
    paymentMethod: "cod",
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  // Voucher states (hỗ trợ nhiều mã không trùng lặp)
  interface AppliedVoucherItem {
    code: string;
    name: string;
    type: string;
    discount: number;
    isFreeship: boolean;
  }

  const [voucherCodeInput, setVoucherCodeInput] = useState("");
  const [appliedVouchers, setAppliedVouchers] = useState<AppliedVoucherItem[]>([]);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);

  // Tự động khôi phục danh sách voucher từ giỏ hàng hoặc URL query param
  useEffect(() => {
    if (typeof window !== "undefined" && totalAmount > 0) {
      try {
        const codesToRestore: string[] = [];
        const params = new URLSearchParams(window.location.search);
        const urlVouchers = params.get("vouchers");
        const urlVoucher = params.get("voucher");

        if (urlVouchers) {
          urlVouchers.split(",").forEach((c) => {
            const trimmed = c.trim().toUpperCase();
            if (trimmed && !codesToRestore.includes(trimmed)) codesToRestore.push(trimmed);
          });
        } else if (urlVoucher) {
          const trimmed = urlVoucher.trim().toUpperCase();
          if (trimmed && !codesToRestore.includes(trimmed)) codesToRestore.push(trimmed);
        }

        // Kiểm tra sessionStorage danh sách nhiều mã
        const multiStored = sessionStorage.getItem("tech_applied_vouchers");
        if (multiStored) {
          const parsed = JSON.parse(multiStored);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any) => {
              const code = (typeof item === "string" ? item : item.code || "").trim().toUpperCase();
              if (code && !codesToRestore.includes(code)) codesToRestore.push(code);
            });
          }
        } else {
          // Phiên bản cũ single voucher
          const singleStored = sessionStorage.getItem("tech_applied_voucher");
          if (singleStored) {
            const parsed = JSON.parse(singleStored);
            if (parsed && parsed.code) {
              const code = parsed.code.trim().toUpperCase();
              if (code && !codesToRestore.includes(code)) codesToRestore.push(code);
            }
          }
        }

        if (codesToRestore.length > 0) {
          Promise.all(codesToRestore.map((c) => api.validateVoucher(c, totalAmount))).then((results) => {
            const validItems: AppliedVoucherItem[] = [];
            results.forEach((res) => {
              if (res.success && res.voucher) {
                const isFreeship = res.voucher.type === "freeship" || res.voucher.code.toUpperCase() === "FREESHIP";
                validItems.push({
                  code: res.voucher.code,
                  name: res.voucher.name,
                  type: res.voucher.type,
                  discount: isFreeship ? 0 : res.discount,
                  isFreeship,
                });
              }
            });
            if (validItems.length > 0) {
              setAppliedVouchers(validItems);
            }
          });
        }
      } catch (e) {}
    }
  }, [totalAmount]);

  const handleApplyVoucher = async (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    setVoucherError(null);
    setVoucherSuccess(null);

    const cleanCode = (customCode || voucherCodeInput).trim().toUpperCase();
    if (!cleanCode) {
      setVoucherError("Vui lòng nhập mã voucher.");
      return;
    }

    // Kiểm tra trùng lặp mã (không được trùng mã)
    if (appliedVouchers.some((v) => v.code.toUpperCase() === cleanCode)) {
      setVoucherError(`Mã "${cleanCode}" đã được áp dụng rồi, không thể áp trùng mã!`);
      return;
    }

    const res = await api.validateVoucher(cleanCode, totalAmount);
    if (res.success && res.voucher) {
      const isFreeship = res.voucher.type === "freeship" || res.voucher.code.toUpperCase() === "FREESHIP";
      const newItem: AppliedVoucherItem = {
        code: res.voucher.code,
        name: res.voucher.name,
        type: res.voucher.type,
        discount: isFreeship ? 0 : res.discount,
        isFreeship,
      };

      const updatedList = [...appliedVouchers, newItem];
      setAppliedVouchers(updatedList);
      setVoucherCodeInput("");
      setVoucherSuccess(
        isFreeship
          ? `Áp dụng thành công mã miễn phí giao hàng "${res.voucher.code}"!`
          : `Áp dụng thành công mã "${res.voucher.code}"! Giảm ${formatVND(newItem.discount)}.`
      );

      if (typeof window !== "undefined") {
        sessionStorage.setItem("tech_applied_vouchers", JSON.stringify(updatedList));
      }
    } else {
      setVoucherError(res.message || "Mã không hợp lệ.");
    }
  };

  const handleRemoveVoucher = (codeToRemove: string) => {
    const updated = appliedVouchers.filter((v) => v.code.toUpperCase() !== codeToRemove.toUpperCase());
    setAppliedVouchers(updated);
    setVoucherError(null);
    setVoucherSuccess(`Đã gỡ mã "${codeToRemove}".`);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tech_applied_vouchers", JSON.stringify(updated));
      if (updated.length === 0) {
        sessionStorage.removeItem("tech_applied_voucher");
      }
    }
  };

  // Phí vận chuyển: CHỈ miễn phí khi áp mã FREESHIP hợp lệ, ngược lại tính phí 30.000₫ (không tự động miễn phí dù đơn giá trị cao)
  const hasFreeship = appliedVouchers.some((v) => v.isFreeship || v.code.toUpperCase() === "FREESHIP");
  const shippingFee = hasFreeship ? 0 : 30000;
  const totalDiscount = appliedVouchers.reduce((sum, v) => sum + v.discount, 0);
  const grandTotal = Math.max(0, totalAmount - totalDiscount + shippingFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;

    try {
      setLoading(true);
      const payload = {
        receiverName: formData.receiverName,
        phone: formData.phone,
        guestEmail: formData.guestEmail,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        street: formData.street,
        note: formData.note,
        paymentMethod: formData.paymentMethod,
        voucherCode: appliedVouchers.map((v) => v.code).join(", ") || undefined,
        voucherCodes: appliedVouchers.map((v) => v.code),
        discountTotal: totalDiscount,
        hasFreeShipping: hasFreeship,
        shippingFee,
        grandTotal,
        items: cart.items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await api.placeOrder(payload);
      if (res.success) {
        setOrderSuccess(res.data);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("tech_applied_vouchers");
          sessionStorage.removeItem("tech_applied_voucher");
        }
        await clearCart();
      } else {
        alert(res.error?.message || "Đặt hàng không thành công");
      }
    } catch (e: any) {
      alert("Đã xảy ra lỗi khi tạo đơn hàng: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
          Đặt Hàng Thành Công!
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Cảm ơn bạn đã mua hàng tại TechCore. Đơn hàng của bạn đã được ghi nhận trên hệ thống.
        </p>

        {/* Order Details Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-left mb-8 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mã đơn hàng:</span>
            <span className="text-base font-black text-blue-600">{orderSuccess.code}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Người nhận:</span>
            <span className="font-bold text-slate-800">{orderSuccess.receiverName} ({orderSuccess.phone})</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Địa chỉ giao:</span>
            <span className="font-bold text-slate-800 text-right">
              {orderSuccess.street}, {orderSuccess.ward}, {orderSuccess.district}, {orderSuccess.province}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Phương thức thanh toán:</span>
            <span className="font-bold text-slate-800 uppercase">
              {orderSuccess.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : orderSuccess.paymentMethod}
            </span>
          </div>
          {orderSuccess.voucherCode && (
            <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
              <span>Mã giảm giá ({orderSuccess.voucherCode}):</span>
              <span>-{formatVND(orderSuccess.discountTotal || 0)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline border-t pt-3">
            <span className="text-xs font-bold text-slate-800">Tổng thanh toán:</span>
            <span className="text-xl font-black text-red-600">{formatVND(orderSuccess.grandTotal)}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={`/don-hang?code=${orderSuccess.code}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-6 py-3 rounded-full transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Package className="w-4 h-4" />
            <span>Xem đơn hàng của tôi</span>
          </Link>
          <Link
            href="/"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-6 py-3 rounded-full transition"
          >
            Tiếp tục mua hàng
          </Link>
          <Link
            href={`/tra-cuu-bao-hanh`}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-6 py-3 rounded-full transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Tra cứu bảo hành
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Giỏ hàng của bạn đang trống</h2>
        <Link href="/" className="text-blue-600 text-xs font-bold hover:underline">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/gio-hang" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Thông Tin Thanh Toán</h1>
          <p className="text-xs text-slate-500 mt-0.5">Xác nhận thông tin giao hàng và phương thức thanh toán</p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Information Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
              <Truck className="w-4 h-4 text-blue-600" />
              1. Địa Chỉ Nhận Hàng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên người nhận *</label>
                <input
                  type="text"
                  required
                  value={formData.receiverName}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Email nhận thông báo hóa đơn *</label>
                <input
                  type="email"
                  required
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tỉnh / Thành phố *</label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quận / Huyện *</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phường / Xã *</label>
                <input
                  type="text"
                  required
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Địa chỉ chi tiết (Số nhà, đường) *</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Ghi chú giao hàng (Tùy chọn)</label>
                <textarea
                  rows={2}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Ví dụ: Gọi trước khi giao, giao giờ hành chính..."
                  className="w-full text-xs font-medium px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
              <CreditCard className="w-4 h-4 text-blue-600" />
              2. Phương Thức Thanh Toán
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  formData.paymentMethod === "cod"
                    ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Thanh toán khi nhận hàng (COD)</span>
                    <span className="text-[11px] text-slate-500">Khách hàng được đồng kiểm tra hàng trước khi thanh toán</span>
                  </div>
                </div>
                <Banknote className="w-5 h-5 text-emerald-600" />
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                  formData.paymentMethod === "vnpay"
                    ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={formData.paymentMethod === "vnpay"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Cổng thanh toán VNPay QR</span>
                    <span className="text-[11px] text-slate-500">Hỗ trợ 40+ ngân hàng nội địa và thẻ Visa/Mastercard</span>
                  </div>
                </div>
                <QrCode className="w-5 h-5 text-blue-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Snapshot */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 border-b pb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              Đơn Hàng Của Bạn
            </h3>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-800 line-clamp-1">{item.variant?.product?.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.variant?.name} x {item.quantity}
                    </p>
                  </div>
                  <span className="font-black text-red-600 flex-shrink-0">
                    {formatVND(item.variant?.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Voucher input trực tiếp tại trang thanh toán (hỗ trợ nhiều mã không trùng lặp) */}
            <div className="border-t pt-3 space-y-2.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mã Voucher / Khuyến mãi</span>
                </span>
                {appliedVouchers.length > 0 && (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Đã áp dụng {appliedVouchers.length} mã
                  </span>
                )}
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã voucher (VD: TECHNEW100K, FREESHIP)..."
                  value={voucherCodeInput}
                  onChange={(e) => {
                    setVoucherCodeInput(e.target.value);
                    if (voucherError) setVoucherError(null);
                  }}
                  className="flex-1 text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleApplyVoucher()}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer active:scale-95"
                >
                  Áp dụng
                </button>
              </div>

              {/* Gợi ý mã nhanh */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Gợi ý:</span>
                {[
                  { code: "FREESHIP", label: "FREESHIP" },
                  { code: "TECHNEW100K", label: "TECHNEW100K" },
                  { code: "GAMING2026", label: "GAMING2026" },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleApplyVoucher(undefined, item.code)}
                    disabled={appliedVouchers.some((v) => v.code.toUpperCase() === item.code)}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    +{item.code}
                  </button>
                ))}
              </div>

              {voucherError && (
                <div className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xl flex items-start gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{voucherError}</span>
                </div>
              )}

              {voucherSuccess && (
                <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-xl flex items-start gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{voucherSuccess}</span>
                </div>
              )}

              {/* Danh sách các mã voucher đã áp dụng */}
              {appliedVouchers.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {appliedVouchers.map((v) => (
                    <div
                      key={v.code}
                      className="text-xs font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200 p-2 rounded-xl flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="bg-emerald-600 text-white text-[10px] font-mono font-black px-2 py-0.5 rounded-md">
                          {v.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {v.isFreeship ? "Miễn phí giao hàng" : `Giảm -${formatVND(v.discount)}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVoucher(v.code)}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-0.5 rounded-lg transition cursor-pointer"
                        title={`Gỡ mã ${v.code}`}
                      >
                        ✕ Gỡ
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold text-slate-900">{formatVND(totalAmount)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>
                    Giảm giá voucher ({appliedVouchers.filter((v) => v.discount > 0).map((v) => v.code).join(", ")}):
                  </span>
                  <span>-{formatVND(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Phí vận chuyển:</span>
                <div className="text-right">
                  <span className="font-bold text-slate-900">
                    {shippingFee === 0 ? <strong className="text-emerald-600">Miễn phí giao hàng</strong> : formatVND(shippingFee)}
                  </span>
                  {shippingFee > 0 && (
                    <div className="text-[10px] text-slate-400">Chưa áp mã freeship</div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-3 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900">Tổng thanh toán:</span>
              <span className="text-2xl font-black text-red-600">{formatVND(grandTotal)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm py-4 rounded-2xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Đang xử lý đặt hàng..." : "Xác nhận đặt hàng ngay"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

