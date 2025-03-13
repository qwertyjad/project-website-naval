"use client";

import React, { useEffect } from "react";
import InventoryManagement from "@/components/inventory/InventoryManagement";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return <InventoryManagement />;
}
