"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = Boolean(pathname?.startsWith("/admin"));
  const isAuthRoute = Boolean(
    pathname?.startsWith("/dang-nhap") ||
    pathname?.startsWith("/dang-ky") ||
    pathname?.startsWith("/quen-mat-khau")
  );

  if (isAdminRoute) {
    return <main className="min-h-screen w-full bg-[#f8fafc] text-slate-900">{children}</main>;
  }

  if (isAuthRoute) {
    return <main className="min-h-screen w-full bg-slate-950">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

