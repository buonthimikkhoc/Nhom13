"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrdersManagement } from "@/components/admin/OrdersManagement";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Tự động chuyển hướng URL về đúng định danh /admin/don-hang
    router.replace("/admin/don-hang");
  }, [router]);

  return <OrdersManagement />;
}
