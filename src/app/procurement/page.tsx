"use client";

import React, { useEffect } from "react";
import ProcurementSystem from "@/components/procurement/ProcurementSystem";
import { useRouter } from "next/navigation";

export default function ProcurementPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/");
      return;
    }
  }, [router]);

  return <ProcurementSystem />;
}
