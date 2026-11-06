"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Search, Calendar, Cpu, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "../../lib/api";

export default function WarrantyLookupPage() {
  const [serial, setSerial] = useState("ROG16-2024-001");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const res = await api.lookupWarranty(serial.trim());
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.error?.message || "Không tìm thấy thông tin bảo hành.");
      }
    } catch (e: any) {
      setError("Đã xảy ra lỗi khi kết nối máy chủ tra cứu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Tra Cứu Bảo Hành Điện Tử
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Nhập số Serial (S/N) hoặc mã IMEI in trên tem sản phẩm hoặc hóa đơn mua hàng để kiểm tra thời hạn và trạng thái bảo hành chính hãng.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-md mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              required
              placeholder="Nhập Serial hoặc IMEI (VD: ROG16-2024-001, IMEI-354892019283741...)"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              className="w-full text-xs font-bold pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 uppercase tracking-wider"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-8 py-3 rounded-2xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? "Đang tra cứu..." : "Kiểm tra ngay"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] text-slate-400">
          <span>Gợi ý mã mẫu thử nghiệm:</span>
          <button
            type="button"
            onClick={() => setSerial("ROG16-2024-001")}
            className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded hover:underline"
          >
            ROG16-2024-001
          </button>
          <button
            type="button"
            onClick={() => setSerial("IMEI-354892019283741")}
            className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded hover:underline"
          >
            IMEI-354892019283741
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Kết quả xác thực chính hãng
              </span>
              <h2 className="text-xl font-black mt-2">Mã Serial: {result.serialNumber}</h2>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-2xl self-start sm:self-auto shadow-md">
              <CheckCircle2 className="w-4 h-4" />
              {result.isExpired ? "Hết hạn bảo hành" : "Đang được bảo hành"}
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border">
              <img
                src={result.image || "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400"}
                alt={result.productName}
                className="w-32 h-32 object-contain mb-3"
              />
              <span className="text-xs font-black text-slate-800 text-center">{result.productName}</span>
              <span className="text-[11px] text-slate-400 mt-1">{result.variantName}</span>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Thương hiệu:</span>
                  <span className="font-extrabold text-slate-800 text-sm">{result.brand}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Thời gian bảo hành:</span>
                  <span className="font-extrabold text-blue-600 text-sm">{result.warrantyMonths} Tháng</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Ngày kích hoạt:</span>
                  <span className="font-extrabold text-slate-800">
                    {result.warrantyStart ? new Date(result.warrantyStart).toLocaleDateString("vi-VN") : "Chưa kích hoạt (Trong kho)"}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Ngày hết hạn:</span>
                  <span className="font-extrabold text-slate-800">
                    {result.warrantyEnd ? new Date(result.warrantyEnd).toLocaleDateString("vi-VN") : "Theo ngày xuất bán"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-blue-900">🛡️ Quyền lợi bảo hành TechCore:</p>
                <p>• Hỗ trợ tiếp nhận bảo hành tại toàn bộ hơn 50 chi nhánh ủy quyền trên toàn quốc.</p>
                <p>• Miễn phí vệ sinh máy và tra keo tản nhiệt định kỳ trọn đời.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl flex items-center gap-3 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

