"use client";

import React from "react";
import Sidebar from "../layout/Sidebar";
import InventoryOverview from "./InventoryOverview";
import LowStockAlerts from "./LowStockAlerts";
import InventoryStatus from "./InventoryStatus";

interface DashboardProps {
  userName?: string;
  userRole?: string;
  data?: any;
}

const Dashboard = ({
  userName = "John Contractor",
  userRole = "Admin",
  data = null,
}: DashboardProps) => {
  // Get user info from localStorage if available
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
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
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.full_name || userName}. Here's your
                inventory overview.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-right">
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
                <p className="text-muted-foreground">
                  {user?.role || userRole}
                </p>
              </div>
            </div>
          </header>

          <InventoryOverview
            totalItems={data?.totalItems || 247}
            totalCategories={data?.totalCategories || 12}
            inventoryValue={data?.inventoryValue || 125750}
            lowStockCount={data?.lowStockCount || 8}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LowStockAlerts
              items={
                data?.lowStockItems || [
                  {
                    id: "1",
                    name: "Cement",
                    category: "Building Materials",
                    currentStock: 5,
                    minimumStock: 20,
                    unit: "bags",
                    status: "critical",
                  },
                  {
                    id: "2",
                    name: "Steel Rebar",
                    category: "Structural",
                    currentStock: 15,
                    minimumStock: 30,
                    unit: "pieces",
                    status: "low",
                  },
                  {
                    id: "3",
                    name: "Bricks",
                    category: "Building Materials",
                    currentStock: 200,
                    minimumStock: 500,
                    unit: "pieces",
                    status: "low",
                  },
                  {
                    id: "4",
                    name: "Safety Helmets",
                    category: "Safety Equipment",
                    currentStock: 3,
                    minimumStock: 10,
                    unit: "pieces",
                    status: "critical",
                  },
                  {
                    id: "5",
                    name: "Paint - White",
                    category: "Finishing",
                    currentStock: 8,
                    minimumStock: 15,
                    unit: "gallons",
                    status: "low",
                  },
                ]
              }
              onOrderClick={(id) => console.log(`Order item ${id}`)}
              onViewClick={(id) => console.log(`View item ${id}`)}
            />

            <InventoryStatus
              categories={
                data?.categories || [
                  { name: "Tools", value: 120, color: "#FF6384" },
                  { name: "Materials", value: 85, color: "#36A2EB" },
                  { name: "Equipment", value: 65, color: "#FFCE56" },
                  { name: "Safety Gear", value: 45, color: "#4BC0C0" },
                  { name: "Electrical", value: 30, color: "#9966FF" },
                ]
              }
              totalItems={data?.totalItems || 345}
              totalValue={data?.inventoryValue || 125000}
              stockHealth={data?.stockHealth || 78}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
