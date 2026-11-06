"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Star,
  KeyRound,
  CheckCircle2,
  Headphones,
  Database,
  Eye,
  EyeOff,
  AtSign,
  Smartphone,
  ShieldAlert,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Xử lý gửi mã OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError(
        method === "email"
          ? "Vui lòng nhập địa chỉ email của bạn."
          : "Vui lòng nhập số điện thoại của bạn."
      );
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setStep("verify");
    }, 800);
  };

  // Xử lý xác nhận OTP và đặt mật khẩu mới
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Vui lòng nhập mã OTP 6 chữ số.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có tối thiểu 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dang-nhap");
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#060b18]">
      {/* ===================== CỘT TRÁI (DARK TECH SECURITY ECOSYSTEM) ===================== */}
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

        {/* --- Middle Hero: Title, Paragraph & 3 Security Cards --- */}
        <div className="relative z-10 my-auto py-10 lg:py-16 max-w-xl">
          {/* Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-xs font-semibold text-blue-300 mb-6 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="tracking-wide">KHÔI PHỤC VÀ BẢO VỆ TÀI KHOẢN</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.18] mb-5">
            An tâm tuyệt đối với <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              bảo mật đa tầng
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed mb-9">
            Hệ thống tự động xác thực và cấp mã OTP bảo mật qua Email hoặc SMS để giúp bạn lấy lại
            quyền truy cập chỉ trong 60 giây.
          </p>

          {/* 3 Security Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Card 1: Xác thực 2 lớp */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/40 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-cyan-400 flex items-center justify-center mb-3">
                <Lock className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-white mb-0.5">Xác thực 2 lớp</div>
              <div className="text-xs text-slate-400 leading-snug">Mã OTP mã hóa 1 lần an toàn</div>
            </div>

            {/* Card 2: Hỗ trợ 24/7 */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/40 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-cyan-400 flex items-center justify-center mb-3">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-white mb-0.5">Hỗ trợ 24/7</div>
              <div className="text-xs text-slate-400 leading-snug">Đội ngũ kỹ thuật túc trực tổng đài</div>
            </div>

            {/* Card 3: Bảo toàn dữ liệu */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md hover:border-blue-500/40 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-emerald-400 flex items-center justify-center mb-3">
                <Database className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-white mb-0.5">Bảo toàn dữ liệu</div>
              <div className="text-xs text-slate-400 leading-snug">TechPoints và đơn hàng nguyên vẹn</div>
            </div>
          </div>
        </div>

        {/* --- Bottom Row: Social Proof & CoreEngine Version --- */}
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

      {/* ===================== CỘT PHẢI (PASSWORD RECOVERY FORM) ===================== */}
      <div className="w-full lg:w-[44%] xl:w-[42%] min-h-screen bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16">
        {/* --- Top Nav --- */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link
            href="/dang-nhap"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
          </Link>

          <div>
            Cần hỗ trợ?{" "}
            <a href="tel:19008888" className="font-bold text-blue-600 hover:underline">
              1900 8888
            </a>
          </div>
        </div>

        {/* --- Center Content --- */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          {/* Key Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100/80 shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Quên Mật Khẩu?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Đừng lo lắng! Nhập địa chỉ email hoặc số điện thoại đã đăng ký để nhận mã xác minh
              khôi phục tài khoản của bạn.
            </p>
          </div>

          {success ? (
            /* Trạng thái thành công */
            <div className="text-center py-8 space-y-4 bg-emerald-50 rounded-3xl border border-emerald-200 p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Mật Khẩu Đã Được Cập Nhật!</h3>
              <p className="text-xs text-slate-600">
                Bạn đã đổi mật khẩu thành công. Đang tự động chuyển hướng về trang đăng nhập...
              </p>
              <div className="pt-2">
                <Link
                  href="/dang-nhap"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
                >
                  Đăng nhập ngay <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : step === "request" ? (
            /* BƯỚC 1: Chọn Qua Email hoặc Qua Số điện thoại & Nhập địa chỉ */
            <div>
              {/* Method Switcher Tabs (Qua Email / Qua Số điện thoại) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMethod("email");
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                    method === "email"
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Qua Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMethod("phone");
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                    method === "phone"
                      ? "bg-white text-blue-600 shadow-sm border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Qua Số điện thoại</span>
                </button>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                    {method === "email" ? "ĐỊA CHỈ EMAIL LIÊN KẾT" : "SỐ ĐIỆN THOẠI LIÊN KẾT"}
                  </label>
                  <div className="relative">
                    {method === "email" ? (
                      <AtSign className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    ) : (
                      <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    )}
                    <input
                      type={method === "email" ? "email" : "tel"}
                      required
                      placeholder={method === "email" ? "name@example.com" : "0987 654 321"}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full text-xs sm:text-sm font-semibold pl-11 pr-4 py-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {method === "email"
                      ? "Mã OTP 6 chữ số sẽ được gửi tới hòm thư của bạn. Vui lòng kiểm tra cả thư mục Spam/Rác nếu không nhận được."
                      : "Mã OTP 6 chữ số sẽ được gửi qua tin nhắn SMS tới số điện thoại này trong vòng ít giây."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm py-3.5 rounded-2xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 active:scale-[0.99]"
                >
                  {loading ? (
                    "Đang gửi mã..."
                  ) : (
                    <>
                      <span>Gửi Mã Xác Nhận</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Thông báo an toàn */}
              <div className="mt-5 p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Vì lý do an toàn, mã khôi phục chỉ có hiệu lực trong vòng 15 phút.</span>
              </div>
            </div>
          ) : (
            /* BƯỚC 2: Nhập OTP & Đặt lại mật khẩu mới */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between">
                <span>
                  Đã gửi mã xác thực tới <strong>{identifier}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="text-blue-600 font-bold hover:underline ml-2"
                >
                  Thay đổi
                </button>
              </div>

              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Nhập mã OTP */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                  MÃ XÁC THỰC OTP (6 CHỮ SỐ)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="Nhập 6 số (VD: 888999)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-lg tracking-[0.3em] font-black py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu mới</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
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

              {/* Nhập lại mật khẩu mới */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nhập lại mật khẩu mới
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Khớp với mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm py-3.5 rounded-2xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 active:scale-[0.99]"
              >
                {loading ? "Đang cập nhật..." : "Xác Nhận & Đặt Lại Mật Khẩu"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Nhớ lại mật khẩu rồi? Đăng nhập ngay */}
          <div className="pt-6 text-center text-xs text-slate-500">
            Nhớ lại mật khẩu rồi?{" "}
            <Link href="/dang-nhap" className="font-bold text-blue-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>

        {/* --- Bottom Footer --- */}
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

