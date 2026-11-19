"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Grid,
  Cpu,
  Package,
  ShoppingCart,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    const handleBump = () => {
      setIsBumping(true);
      setTimeout(() => setIsBumping(false), 700);
    };

    window.addEventListener("techcore:cart-bump", handleBump);
    return () => {
      window.removeEventListener("techcore:cart-bump", handleBump);
    };
  }, []);

  const navItems = [
    {
      label: "Trang chủ",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Danh mục",
      href: "/danh-muc/tat-ca",
      icon: Grid,
      isActive: pathname.startsWith("/danh-muc"),
    },
    {
      label: "Đơn hàng",
      href: "/don-hang",
      icon: Package,
      isActive: pathname.startsWith("/don-hang"),
    },
    {
      label: "Bảo hành",
      href: "/tra-cuu-bao-hanh",
      icon: ShieldCheck,
      isActive: pathname.startsWith("/tra-cuu-bao-hanh"),
    },
    {
      label: "Giỏ hàng",
      href: "/gio-hang",
      icon: ShoppingCart,
      isActive: pathname.startsWith("/gio-hang"),
      badge: itemCount,
      isCart: true,
    },
  ];

  return (
    <nav
      aria-label="Thanh điều hướng di động"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 h-15 px-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              id={item.isCart ? "mobile-bottom-cart-btn" : undefined}
              className={`flex flex-col items-center justify-center py-1 relative transition-colors ${
                item.isActive
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              <div
                className={`relative p-1 rounded-xl transition-transform duration-200 ${
                  item.isCart && isBumping ? "scale-125 -rotate-12" : ""
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    item.isActive ? "scale-110 stroke-[2.5]" : ""
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs transition-transform ${
                      item.isCart && isBumping
                        ? "scale-125 bg-emerald-500"
                        : "bg-red-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
