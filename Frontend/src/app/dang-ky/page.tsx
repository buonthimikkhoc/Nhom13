"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Zap,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!agreeTerms) {
      setError("Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dang-nhap");
        }, 1500);
      } else {
        setError(res.error?.message || "Đăng ký không thành công.");
      }
    } catch (e: any) {
      setError("Đã xảy ra lỗi khi tạo tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#060b18]">
      {/* ===================== CỘT TRÁI (DARK TECH ECOSYSTEM SHOWCASE) ===================== */}
      <div className="relative w-full lg:w-[50%] xl:w-[52%] min-h-[450px] lg:min-h-screen p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#060c1d] via-[#091530] to-[#040817] text-white">
        {/* Vệt sáng phát quang Ambient Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/25 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-cyan-500/15 blur-[110px] rounded-full pointer-events-none" />

        {/* --- Top Row: Brand Logo & Security Badge --- */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-white tracking-wider flex items-center gap-0.5">
                TECHCORE
              </div>
              <div className="text-[10px] font-bold text-blue-400/90 tracking-[0.22em] uppercase">
                FUTURE TECH ECOSYSTEM
              </div>
            </div>
          </Link>

          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <span className="text-xs font-medium text-slate-300">
              Hệ thống bảo mật TLS 1.3 & AI Guard
            </span>
          </div>
        </div>

        {/* --- Middle Hero --- */}
        <div className="relative z-10 my-auto py-8 lg:py-14 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-xs font-semibold text-blue-300 mb-6 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <span className="tracking-wide">ĐẶC QUYỀN THÀNH VIÊN TECHCORE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.18] mb-5">
            Tham gia cộng đồng <br />
            công nghệ đỉnh cao
          </h1>

          <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed mb-9">
            Tạo tài khoản ngay hôm nay để nhận voucher giảm 5% cho đơn hàng đầu tiên, tích điểm VIP
            đổi quà và theo dõi tiến độ bảo hành điện tử chính hãng.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Bảo Hành Điện Tử</div>
                <div className="text-xs text-slate-400">Tra cứu Serial/IMEI 24/7</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Voucher Chào Mừng</div>
                <div className="text-xs text-slate-400">Tặng mã giảm đến 500.000đ</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom Row --- */}
        <div className="relative z-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#091530]">
                TC
              </div>
              <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#091530]">
                AI
              </div>
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#091530]">
                NV
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 ring-2 ring-[#091530]">
                +50k
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <span className="font-bold text-white">4.9/5</span>
              <span className="text-slate-400 hidden md:inline">
                Được tin dùng bởi hơn 50.000 tín đồ công nghệ
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono">v3.4.0 CoreEngine</div>
        </div>
      </div>

      {/* ===================== CỘT PHẢI (REGISTER FORM) ===================== */}
      <div className="w-full lg:w-[50%] xl:w-[48%] min-h-screen bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
          </Link>

          <div>
            Cần hỗ trợ?{" "}
            <a href="tel:19008888" className="font-bold text-blue-600 hover:underline">
              1900 8888
            </a>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto my-auto py-6">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Đăng Ký Tài Khoản
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Tạo tài khoản khách hàng để nhận bảo hành và ưu đãi thành viên TechCore.
            </p>
          </div>

          {success ? (
            <div className="text-center py-10 space-y-3 bg-emerald-50 rounded-3xl border border-emerald-200 p-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Đăng Ký Thành Công!</h3>
              <p className="text-xs text-slate-600">
                Tài khoản của bạn đã được khởi tạo. Đang tự động chuyển hướng đến trang đăng nhập...
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Họ và tên */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-xs sm:text-sm font-semibold pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
                  />
                </div>
              </div>

              {/* Email & Điện thoại */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs sm:text-sm font-semibold pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="0987654321"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs sm:text-sm font-semibold pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Tối thiểu 6 ký tự"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full text-xs sm:text-sm font-semibold pl-11 pr-10 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nhập lại mật khẩu *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Khớp với mật khẩu"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="w-full text-xs sm:text-sm font-semibold pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Đồng ý điều khoản */}
              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
                  />
                  <span>
                    Tôi đồng ý với{" "}
                    <Link href="#" className="font-bold text-blue-600 hover:underline">
                      Điều khoản dịch vụ
                    </Link>{" "}
                    &amp;{" "}
                    <Link href="#" className="font-bold text-blue-600 hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </span>
                </label>
              </div>

              {/* Nút Đăng ký */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm py-3.5 rounded-2xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 active:scale-[0.99]"
              >
                {loading ? "Đang xử lý..." : "Đăng Ký Tài Khoản"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-6 text-center text-xs text-slate-500">
            Đã có tài khoản?{" "}
            <Link href="/dang-nhap" className="font-bold text-blue-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 text-[11px] text-slate-400 border-t border-slate-100">
          <div>© 2025 TechCore Inc. Bảo lưu mọi quyền.</div>
          <div className="flex items-center gap-2">
            <Link href="#" className="hover:text-slate-600 transition">
              Điều khoản dịch vụ
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-600 transition">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
