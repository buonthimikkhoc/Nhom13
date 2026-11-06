"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Zap,
  Star,
  Eye,
  EyeOff,
  AtSign,
} from "lucide-react";
import { api } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.login({ email: email.trim(), password });
      if (res.success) {
        const userRole = res.data?.user?.role;
        if (userRole === "admin") {
          // Tài khoản Admin chuyển hướng vào Trang Quản Trị
          router.push("/admin");
        } else {
          // Tài khoản User chuyển hướng về Trang Chủ
          router.push("/");
        }
      } else {
        setError(res.error?.message || "Email hoặc mật khẩu không chính xác.");
      }
    } catch (e: any) {
      setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#060b18]">
      {/* ===================== CỘT TRÁI (DARK TECH ECOSYSTEM SHOWCASE) ===================== */}
      <div className="relative w-full lg:w-[56%] xl:w-[58%] min-h-[500px] lg:min-h-screen p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#060c1d] via-[#091530] to-[#040817] text-white">
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

          {/* Badge Bảo Mật TLS 1.3 & AI Guard */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
            <span className="text-xs font-medium text-slate-300">
              Hệ thống bảo mật TLS 1.3 & AI Guard
            </span>
          </div>
        </div>

        {/* --- Middle Hero: Headline, Description & Highlight Cards --- */}
        <div className="relative z-10 my-auto py-10 lg:py-16 max-w-xl">
          {/* Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-xs font-semibold text-blue-300 mb-6 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <span className="tracking-wide">SIÊU THỊ CÔNG NGHỆ CHÍNH HÃNG HÀNG ĐẦU</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.18] mb-5">
            Nâng tầm trải nghiệm <br />
            công nghệ tương lai
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed mb-9">
            Truy cập trung tâm mua sắm thiết bị AI, linh kiện tối tân, smartphone &amp; laptop cao
            cấp với đặc quyền bảo hành siêu tốc 1–đổi–1 trong 30 ngày.
          </p>

          {/* Feature Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: 100% Chính Hãng */}
            <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">100% Chính Hãng</div>
                <div className="text-xs text-slate-400">Nhập khẩu chính ngạch &amp; VAT đầy đủ</div>
              </div>
            </div>

            {/* Card 2: Giao Hỏa Tốc 2H */}
            <div className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Giao Hỏa Tốc 2H</div>
                <div className="text-xs text-slate-400">Miễn phí giao hàng nội thành</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom Row: Social Proof & CoreEngine Version --- */}
        <div className="relative z-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            {/* Overlapping Avatars */}
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

            {/* Stars & Rating */}
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

      {/* ===================== CỘT PHẢI (LOGIN FORM SANG TRỌNG) ===================== */}
      <div className="w-full lg:w-[44%] xl:w-[42%] min-h-screen bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16">
        {/* --- Top Nav: Back to Home & Help Contact --- */}
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

        {/* --- Center: Main Login Form Card --- */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-7">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Đăng Nhập Tài Khoản
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Chào mừng bạn quay trở lại! Vui lòng nhập thông tin để truy cập hệ thống TechCore.
            </p>
          </div>

          {/* Social Login Buttons (Google, Apple, Facebook) */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Google */}
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 rounded-2xl border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
              title="Đăng nhập với Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.57 0 2.98.54 4.09 1.6l3.07-3.07C17.3 1.74 14.84 1 12 1 7.42 1 3.51 3.6 1.66 7.42l3.78 2.93C6.34 7.44 8.92 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.28c0-.8-.07-1.56-.2-2.28H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.72 2.89c2.18-2.01 3.7-4.97 3.7-8.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.44 14.65c-.24-.71-.38-1.47-.38-2.25s.14-1.54.38-2.25L1.66 7.22C.6 9.33 0 11.7 0 14.2s.6 4.87 1.66 6.98l3.78-2.93z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.4c3.24 0 5.95-1.08 7.93-2.91l-3.72-2.89c-1.07.72-2.45 1.15-4.21 1.15-3.08 0-5.66-2.44-6.56-5.35L1.66 16.33C3.51 20.15 7.42 22.75 12 23.4z"
                />
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 rounded-2xl border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
              title="Đăng nhập với Apple ID"
            >
              <svg className="w-5 h-5 fill-slate-900" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.79-11.74-14.24-6.3-9.79-11.28-20.73-14.93-32.81-3.65-12.08-5.48-23.36-5.48-33.84 0-14.45 3.59-26.6 10.77-36.46 7.18-9.86 16.3-14.91 27.35-15.15 4.58 0 9.8 1.2 15.66 3.59 5.86 2.39 9.69 3.59 11.49 3.59 1.48 0 5.48-1.25 12-3.75 6.52-2.5 11.83-3.64 15.93-3.44 12.3.65 22.09 5.25 29.37 13.8-10.75 6.53-16.03 15.54-15.83 27.05.2 9.02 3.65 16.58 10.36 22.68 6.71 6.1 14.52 9.63 23.42 10.59-2.22 6.96-5.07 14.07-8.55 21.33zm-32.99-106.63c0-7.07 2.58-13.68 7.74-19.83 5.16-6.15 11.45-10.09 18.88-11.83.69 3.15 1.03 5.88 1.03 8.19 0 7.39-2.73 14.28-8.19 20.67-5.46 6.39-12.01 10.45-19.65 12.18-.07-2.9-.11-5.05-.11-6.44z" />
              </svg>
            </button>

            {/* Facebook */}
            <button
              type="button"
              className="flex items-center justify-center py-3 px-4 rounded-2xl border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
              title="Đăng nhập với Facebook"
            >
              <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>

          {/* Divider HOẶC VỚI EMAIL */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase whitespace-nowrap">
              HOẶC VỚI EMAIL
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Input 1: Email / Username */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Địa chỉ Email hoặc Tên tài khoản
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold pl-11 pr-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>
            </div>

            {/* Input 2: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
                <Link
                  href="/quen-mat-khau"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold pl-11 pr-11 py-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox: Ghi nhớ đăng nhập trong 30 ngày */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
                />
                <span>Ghi nhớ đăng nhập trong 30 ngày</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm py-3.5 rounded-2xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 active:scale-[0.99]"
            >
              {loading ? (
                "Đang đăng nhập..."
              ) : (
                <>
                  <span>Đăng Nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Chưa có tài khoản TechCore? Đăng ký ngay */}
          <div className="pt-6 text-center text-xs text-slate-500">
            Chưa có tài khoản TechCore?{" "}
            <Link href="/dang-ky" className="font-bold text-blue-600 hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>

        {/* --- Bottom Footer: Copyright & Legal Policies --- */}
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
