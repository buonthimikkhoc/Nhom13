"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatVND } from "../../lib/utils";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, totalAmount, itemCount } = useCart();
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    const code = voucherCode.trim().toUpperCase();
    if (code === "TECHNEW100K") {
      if (totalAmount >= 1000000) {
        setDiscount(100000);
        setAppliedVoucher(code);
      } else {
        alert("Mã TECHNEW100K chỉ áp dụng cho đơn hàng từ 1.000.000đ");
      }
    } else if (code === "GAMING2026") {
      if (totalAmount >= 15000000) {
        const disc = Math.min(1500000, Math.round(totalAmount * 0.05));
        setDiscount(disc);
        setAppliedVoucher(code);
      } else {
        alert("Mã GAMING2026 chỉ áp dụng cho đơn hàng từ 15.000.000đ");
      }
    } else if (code === "FREESHIP") {
      setDiscount(30000);
      setAppliedVoucher(code);
    } else {
      alert("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  const shippingFee = totalAmount > 2000000 || appliedVoucher === "FREESHIP" ? 0 : 30000;
  const grandTotal = Math.max(0, totalAmount - discount + (appliedVoucher === "FREESHIP" ? 0 : shippingFee));

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
          Hãy khám phá hàng trăm thiết bị công nghệ chính hãng và ưu đãi hấp dẫn tại TechCore.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-full transition shadow-lg shadow-blue-500/20"
        >
          <ArrowLeft className="w-4 h-4" /> Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Giỏ Hàng Công Nghệ</h1>
          <p className="text-xs text-slate-500 mt-1">Bạn đang có {itemCount} sản phẩm trong giỏ</p>
        </div>
        <Link href="/" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Tiếp tục chọn thêm
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Tracker */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-xs">
            {totalAmount >= 2000000 ? (
              <span className="font-bold text-blue-800 flex items-center gap-1.5">
                🎉 Tuyệt vời! Đơn hàng của bạn đã đủ điều kiện <strong>Miễn phí giao hàng</strong> toàn quốc.
              </span>
            ) : (
              <span className="text-slate-700">
                Mua thêm <strong>{formatVND(2000000 - totalAmount)}</strong> để được <strong>Miễn phí vận chuyển</strong>!
              </span>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {cart.items.map((item) => {
              const thumbnail =
                item.variant?.product?.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200";

              return (
                <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                  <img
                    src={thumbnail}
                    alt={item.variant?.product?.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-contain rounded-2xl bg-slate-50 border p-2 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/san-pham/${item.variant?.product?.slug}`}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 transition truncate block"
                    >
                      {item.variant?.product?.name}
                    </Link>
                    <span className="text-xs text-slate-500 block mt-0.5">{item.variant?.name}</span>
                    <span className="text-xs font-black text-red-600 block sm:hidden mt-1">
                      {formatVND(item.variant?.price)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-slate-200 font-bold text-slate-600"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold bg-white text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-slate-200 font-bold text-slate-600"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-600 transition p-1"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-black text-red-600">
                      {formatVND(item.variant?.price * item.quantity)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[11px] text-slate-400">{formatVND(item.variant?.price)} / món</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-slate-900 border-b pb-3">Tóm Tắt Đơn Hàng</h3>

            {/* Voucher input */}
            <form onSubmit={handleApplyVoucher} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá..."
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                Áp dụng
              </button>
            </form>

            {appliedVoucher && (
              <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl flex items-center justify-between">
                <span>Đã áp dụng: <strong>{appliedVoucher}</strong></span>
                <button onClick={() => { setDiscount(0); setAppliedVoucher(null); }} className="text-slate-400 hover:text-red-500">
                  Gỡ
                </button>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2.5 text-xs text-slate-600 border-t pt-4">
              <div className="flex justify-between">
                <span>Tạm tính ({itemCount} sản phẩm):</span>
                <span className="font-bold text-slate-900">{formatVND(totalAmount)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Giảm giá khuyến mãi:</span>
                  <span>-{formatVND(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600">Miễn phí</strong> : formatVND(shippingFee)}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900">Tổng cộng:</span>
              <span className="text-2xl font-black text-red-600">{formatVND(grandTotal)}</span>
            </div>

            <Link
              href="/thanh-toan"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm py-4 rounded-2xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              Tiến hành đặt hàng <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Thanh toán an toàn & bảo mật 100%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

