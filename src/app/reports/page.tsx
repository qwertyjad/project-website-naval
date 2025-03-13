"use client";

import React, { useEffect } from "react";
import ReportingSystem from "@/components/reports/ReportingSystem";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/");
      return;
    }
  }, [router]);

  return <ReportingSystem />;
}
