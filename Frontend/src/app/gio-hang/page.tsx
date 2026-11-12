"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, ArrowLeft, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatVND } from "../../lib/utils";
import { api } from "../../lib/api";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, totalAmount, itemCount } = useCart();

  // State xác nhận xóa sản phẩm khỏi giỏ hàng
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
    variantName?: string;
    price?: number;
    image?: string;
  } | null>(null);

  // Toast thông báo sau khi xóa
  const [deleteToast, setDeleteToast] = useState<string | null>(null);

  const promptDeleteItem = (item: any) => {
    setItemToDelete({
      id: item.id,
      name: item.variant?.product?.name || "Sản phẩm",
      variantName: item.variant?.name,
      price: item.variant?.price,
      image:
        item.variant?.product?.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
    });
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const removedName = itemToDelete.name;
    removeItem(itemToDelete.id);
    setItemToDelete(null);
    setDeleteToast(`Đã xóa "${removedName}" khỏi giỏ hàng.`);
    setTimeout(() => {
      setDeleteToast(null);
    }, 4000);
  };

  // Trạng thái Voucher & Khuyến mãi (hỗ trợ nhiều mã không trùng lặp)
  interface AppliedVoucherItem {
    code: string;
    name: string;
    type: string;
    discount: number;
    isFreeship: boolean;
  }

  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVouchers, setAppliedVouchers] = useState<AppliedVoucherItem[]>([]);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);

  // Tự động khôi phục danh sách voucher đã áp dụng trước đó trong phiên
  useEffect(() => {
    if (typeof window !== "undefined" && totalAmount > 0) {
      try {
        let codesToRestore: string[] = [];
        const multiStored = sessionStorage.getItem("tech_applied_vouchers");
        if (multiStored) {
          const parsed = JSON.parse(multiStored);
          if (Array.isArray(parsed)) {
            codesToRestore = parsed.map((item: any) => (typeof item === "string" ? item : item.code)).filter(Boolean);
          }
        } else {
          // Khôi phục từ phiên cũ (single voucher) nếu có
          const singleStored = sessionStorage.getItem("tech_applied_voucher");
          if (singleStored) {
            const parsed = JSON.parse(singleStored);
            if (parsed && parsed.code) codesToRestore = [parsed.code];
          }
        }

        if (codesToRestore.length > 0) {
          // Re-validate từng mã với tổng tiền hiện tại
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

    const targetCode = (customCode || voucherCode).trim().toUpperCase();
    if (!targetCode) {
      setVoucherError("Vui lòng nhập mã voucher / giảm giá.");
      return;
    }

    // Kiểm tra trùng lặp mã (không được trùng mã)
    if (appliedVouchers.some((v) => v.code.toUpperCase() === targetCode)) {
      setVoucherError(`Mã "${targetCode}" đã được áp dụng rồi, không thể áp trùng mã!`);
      return;
    }

    const res = await api.validateVoucher(targetCode, totalAmount);
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
      setVoucherCode("");
      setVoucherSuccess(
        isFreeship
          ? `Áp dụng thành công mã miễn phí giao hàng "${res.voucher.code}"!`
          : `Áp dụng thành công mã "${res.voucher.code}"! Giảm ngay ${formatVND(newItem.discount)}.`
      );

      if (typeof window !== "undefined") {
        sessionStorage.setItem("tech_applied_vouchers", JSON.stringify(updatedList));
      }
    } else {
      setVoucherError(res.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn.");
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

  // Phí vận chuyển: CHỈ miễn phí khi áp mã FREESHIP hợp lệ, ngược lại là 30.000₫ (không tự động miễn phí dù đơn giá trị cao)
  const hasFreeship = appliedVouchers.some((v) => v.isFreeship || v.code.toUpperCase() === "FREESHIP");
  const shippingFee = hasFreeship ? 0 : 30000;
  const totalDiscount = appliedVouchers.reduce((sum, v) => sum + v.discount, 0);
  const grandTotal = Math.max(0, totalAmount - totalDiscount + shippingFee);

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
                          type="button"
                          onClick={() => {
                            if (item.quantity <= 1) {
                              promptDeleteItem(item);
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="px-2.5 py-1 hover:bg-slate-200 font-bold text-slate-600 cursor-pointer transition active:scale-95"
                          title="Giảm số lượng"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-bold bg-white text-slate-800">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-slate-200 font-bold text-slate-600 cursor-pointer transition active:scale-95"
                          title="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => promptDeleteItem(item)}
                        className="text-slate-400 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50 cursor-pointer active:scale-95"
                        title="Xóa sản phẩm khỏi giỏ hàng"
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
            <form onSubmit={handleApplyVoucher} className="space-y-2.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Nhập mã voucher (VD: TECHNEW100K, FREESHIP)..."
                    value={voucherCode}
                    onChange={(e) => {
                      setVoucherCode(e.target.value);
                      if (voucherError) setVoucherError(null);
                    }}
                    className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer active:scale-95"
                >
                  Áp dụng
                </button>
              </div>

              {/* Gợi ý mã nhanh */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Gợi ý mã:</span>
                {[
                  { code: "FREESHIP", label: "FREESHIP (0₫ Ship)" },
                  { code: "TECHNEW100K", label: "TECHNEW100K (-100K)" },
                  { code: "GAMING2026", label: "GAMING2026 (-5%)" },
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
                <div className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl flex items-start gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{voucherError}</span>
                </div>
              )}

              {voucherSuccess && (
                <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-start gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{voucherSuccess}</span>
                </div>
              )}
            </form>

            {/* Danh sách các mã đã áp dụng (hỗ trợ nhiều mã không trùng) */}
            {appliedVouchers.length > 0 && (
              <div className="space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Đã áp dụng ({appliedVouchers.length} mã)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedVouchers([]);
                      sessionStorage.removeItem("tech_applied_vouchers");
                      sessionStorage.removeItem("tech_applied_voucher");
                      setVoucherSuccess("Đã gỡ toàn bộ mã giảm giá.");
                    }}
                    className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  >
                    Gỡ tất cả
                  </button>
                </div>

                <div className="space-y-1.5">
                  {appliedVouchers.map((v) => (
                    <div
                      key={v.code}
                      className="text-xs font-semibold text-emerald-800 bg-white border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-600 text-white text-[10px] font-mono font-black px-2 py-0.5 rounded-md">
                          {v.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {v.isFreeship ? "Miễn phí vận chuyển" : `Giảm -${formatVND(v.discount)}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVoucher(v.code)}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition cursor-pointer"
                        title={`Gỡ mã ${v.code}`}
                      >
                        ✕ Gỡ
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2.5 text-xs text-slate-600 border-t pt-4">
              <div className="flex justify-between">
                <span>Tạm tính ({itemCount} sản phẩm):</span>
                <span className="font-bold text-slate-900">{formatVND(totalAmount)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
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

            <div className="border-t pt-4 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900">Tổng cộng:</span>
              <span className="text-2xl font-black text-red-600">{formatVND(grandTotal)}</span>
            </div>

            <Link
              href={
                appliedVouchers.length > 0
                  ? `/thanh-toan?vouchers=${encodeURIComponent(appliedVouchers.map((v) => v.code).join(","))}`
                  : "/thanh-toan"
              }
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

      {/* Modal Xác Nhận Xóa Sản Phẩm Khỏi Giỏ Hàng */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Trash2 className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Xác Nhận Xóa Sản Phẩm?</h3>
                <p className="text-xs text-slate-500">Thao tác này sẽ bỏ sản phẩm ra khỏi giỏ hàng của bạn.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
              <img
                src={itemToDelete.image}
                alt={itemToDelete.name}
                className="w-14 h-14 object-contain rounded-xl bg-white border p-1 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{itemToDelete.name}</h4>
                {itemToDelete.variantName && (
                  <p className="text-[11px] text-slate-500">{itemToDelete.variantName}</p>
                )}
                {itemToDelete.price && (
                  <p className="text-xs font-black text-red-600 mt-0.5">{formatVND(itemToDelete.price)}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer active:scale-95"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/25 transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
                <span>Xác Nhận Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast thông báo sau khi xóa thành công */}
      {deleteToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom duration-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">{deleteToast}</span>
        </div>
      )}
    </div>
  );
}

