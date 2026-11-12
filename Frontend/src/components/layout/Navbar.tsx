"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Cpu,
  User as UserIcon,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  X,
  FileText,
  ChevronDown,
  ChevronRight,
  Package,
  Sparkles,
  CreditCard,
  UserCheck,
  Tag,
  KeyRound,
  Shield,
  Layers,
  Boxes,
  TrendingUp,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api";
import { formatVND } from "../../lib/utils";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [user, setUser] = useState<{ email: string; fullName: string; role: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setShowUserMenu(false);
  }, [pathname]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        const res = await api.searchSuggest(searchQuery);
        if (res.success) {
          setSuggestions(res.data);
          setShowSuggestions(true);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setShowSearchModal(false);
      router.push(`/danh-muc/tat-ca?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setUser(null);
    setShowUserMenu(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Linh Kiện", href: "/danh-muc/linh-kien-pc" },
    { name: "AI Workstation", href: "/#workstations" },
    { name: "Laptop & Phone", href: "/danh-muc/laptop" },
    { name: "Phụ Kiện Gear", href: "/danh-muc/phu-kien-gaming" },
    { name: "TechCare+", href: "/#techcare" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* --- Left: Logo TechCore (Bấm vào logo về Trang Chủ) --- */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#0C5776] via-[#2D99AE] to-[#BCFEFE] flex items-center justify-center text-white shadow-md shadow-[#0C5776]/30 group-hover:scale-105 transition-transform">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-[#001C44] tracking-tight leading-none flex items-center">
              Tech<span className="text-[#2D99AE]">Core</span>
            </div>
            <div className="text-[9px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">
              Future Tech
            </div>
          </div>
        </Link>

        {/* --- Center: Nav Menu Items (Gọn gàng dạng Pill, không bao giờ rớt dòng) --- */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
          {navLinks.map((link) => {
            const isActive = link.href.startsWith("/#")
              ? false
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-2.5 py-1.5 xl:px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* --- Right: Search, Tra Cứu, Cart, Account Dropdown --- */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Input (Desktop) */}
          <div ref={searchRef} className="relative hidden md:block w-36 lg:w-44 xl:w-56">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Tìm RTX 4090, M3 Max..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                className="w-full pl-8 pr-3 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-transparent focus:border-blue-500 transition-all outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
                  Gợi ý ({suggestions.length})
                </div>
                <div className="divide-y divide-slate-100">
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/san-pham/${item.slug}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-2.5 p-2.5 hover:bg-blue-50/50 transition text-xs"
                    >
                      <img
                        src={item.images?.[0]?.url || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200"}
                        alt={item.name}
                        className="w-8 h-8 object-cover rounded-lg border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                        {item.variants?.[0]?.price && (
                          <p className="text-[11px] font-bold text-blue-600">{formatVND(item.variants[0].price)}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Button (Mobile) */}
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Đơn hàng của tôi */}
          <Link
            href="/don-hang"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition px-2.5 py-1.5 rounded-xl hover:bg-slate-100"
            title="Lịch sử đơn hàng của tôi"
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span className="hidden xl:inline">Đơn hàng</span>
          </Link>

          {/* Tra cứu BH / Đơn hàng */}
          <Link
            href="/tra-cuu-bao-hanh"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition px-2.5 py-1.5 rounded-xl hover:bg-slate-100"
            title="Tra cứu bảo hành & Đơn hàng"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="hidden xl:inline">Tra cứu BH</span>
          </Link>

          {/* Cart Icon with badge */}
          <Link
            href="/gio-hang"
            className="relative p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
            title="Giỏ hàng"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {/* =========================================================================
              THANH CÔNG CỤ HỒ SƠ NGƯỜI DÙNG & MENU QUẢN TRỊ ADMIN (GỌN GÀNG & ĐẸP MẮT)
          ========================================================================= */}
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 py-1 px-1.5 sm:px-2 rounded-2xl border transition shadow-xs ${
                showUserMenu
                  ? "bg-blue-50 border-blue-300 ring-2 ring-blue-500/20"
                  : "bg-white hover:bg-slate-50 border-slate-200"
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-black text-xs flex items-center justify-center text-white shadow-xs transition-transform ${
                  user
                    ? user.role === "admin"
                      ? "bg-gradient-to-tr from-rose-600 to-indigo-600"
                      : "bg-gradient-to-tr from-blue-600 to-indigo-600"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {user ? (
                  user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              <div className="hidden sm:flex items-center gap-1 text-left text-xs">
                <span className="font-extrabold text-slate-800 truncate max-w-[110px]">
                  {user ? (user.fullName.split(" ").slice(-1)[0] || user.fullName) : "Tài Khoản"}
                </span>
                {!user && (
                  <span className="text-[10px] text-slate-400 font-semibold">Đăng nhập</span>
                )}
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  showUserMenu ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            {/* --- POPOVER TOOLBAR / DROPDOWN MENU --- */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2.5 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 space-y-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* 1. Header Profile Card */}
                {user ? (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 text-white space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-black text-base shadow-md">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-sm text-white truncate leading-tight">
                          {user.fullName}
                        </p>
                        <p className="text-[11px] text-slate-300 font-mono truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/80 text-[10px]">
                      {user.role === "admin" ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-black border border-red-500/30 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-red-400" />
                          QUẢN TRỊ VIÊN ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 font-bold border border-blue-500/30 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          HỘI VIÊN VIP TECHCORE
                        </span>
                      )}
                      <span className="text-slate-400">12.500 TechPoints</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 text-center space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-xs">Chào mừng bạn đến với TechCore!</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Đăng nhập để nhận ưu đãi VIP &amp; quản lý đơn hàng
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href="/dang-nhap"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2 rounded-xl transition text-center shadow-xs"
                      >
                        Đăng Nhập
                      </Link>
                      <Link
                        href="/dang-ky"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs py-2 rounded-xl transition text-center"
                      >
                        Đăng Ký
                      </Link>
                    </div>
                  </div>
                )}

                {/* 2. Admin Workspace Banner (Nổi bật cho Admin) */}
                {user && user.role === "admin" && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">
                      TRUNG TÂM ĐIỀU HÀNH
                    </span>
                    <Link
                      href="/admin/don-hang"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutDashboard className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="block font-black text-xs">Vào Trang Quản Trị (Admin)</span>
                          <span className="text-[10px] opacity-80 font-normal">Quản lý Đơn hàng, Kho &amp; Doanh thu</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                )}

                {/* 3. General Services Links */}
                <div className="space-y-1 pt-1 border-t border-slate-100 text-xs">
                  <Link
                    href="/don-hang"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center justify-between p-2 rounded-xl text-slate-700 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-slate-800">Đơn Hàng Của Tôi</span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">Lịch sử</span>
                  </Link>

                  <Link
                    href="/tra-cuu-bao-hanh"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center justify-between p-2 rounded-xl text-slate-700 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium">Tra Cứu Bảo Hành e-Shield</span>
                    </div>
                    <span className="text-[10px] text-slate-400">1-Đổi-1 30D</span>
                  </Link>

                  <Link
                    href="/gio-hang"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center justify-between p-2 rounded-xl text-slate-700 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Giỏ Hàng Mua Sắm</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-600">{itemCount} món</span>
                  </Link>
                </div>

                {/* 4. Footer Logout */}
                {user && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng Xuất Tài Khoản</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Mobile Search Modal --- */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm p-4 flex items-start justify-center pt-20">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tìm kiếm sản phẩm</span>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Nhập tên sản phẩm (RTX 4090, M3 Max...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 text-xs rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
