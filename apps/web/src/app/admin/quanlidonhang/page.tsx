"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuanLiDonHangRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/don-hang");
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-slate-500 font-bold">
      Đang chuyển hướng đến phân hệ Quản lý Đơn hàng chuẩn...
    </div>
  );
}
