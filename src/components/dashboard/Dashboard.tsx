"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import InventoryOverview from "./InventoryOverview";
import LowStockAlerts from "./LowStockAlerts";
import InventoryStatus from "./InventoryStatus";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface DashboardProps {
  userName?: string;
  userRole?: string;
  data: {
    totalItems: number;
    totalCategories: number;
    inventoryValue: number;
    lowStockCount: number;
    categories: CategoryData[];
    stockHealth: number;
  } | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  userName = "John Contractor",
  userRole = "Admin",
  data = null,
}) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleViewItem = (itemId: string) => {
    console.log(`Viewing item with ID: ${itemId}`);
  };

  const handleOrderItem = (itemId: string) => {
    console.log(`Ordering item with ID: ${itemId}`);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <header className="flex justify-between items-center rounded-lg">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.full_name || userName}. Here's your inventory overview.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-right">
                <p className="font-medium text-gray-700 dark:text-gray-200">{new Date().toLocaleDateString("en-PH")}</p>
                <p className="text-muted-foreground">{user?.role || userRole}</p>
              </div>
            </div>
          </header>

          <InventoryOverview
            totalItems={data?.totalItems || 0}
            totalCategories={data?.totalCategories || 0}
            inventoryValue={data?.inventoryValue || 0}
            lowStockCount={data?.lowStockCount || 0}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LowStockAlerts />
            <InventoryStatus
              categories={data?.categories || []}
              totalItems={data?.totalItems || 0}
              totalValue={data?.inventoryValue || 0}
              stockHealth={data?.stockHealth || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;