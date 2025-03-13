"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PieChart, BarChart, LineChart, Activity, Package } from "lucide-react";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface InventoryStatusProps {
  categories?: CategoryData[];
  totalItems?: number;
  totalValue?: number;
  stockHealth?: number;
}

const InventoryStatus = ({
  categories = [
    { name: "Tools", value: 120, color: "#FF6384" },
    { name: "Materials", value: 85, color: "#36A2EB" },
    { name: "Equipment", value: 65, color: "#FFCE56" },
    { name: "Safety Gear", value: 45, color: "#4BC0C0" },
    { name: "Electrical", value: 30, color: "#9966FF" },
  ],
  totalItems = 345,
  totalValue = 125000,
  stockHealth = 78,
}: InventoryStatusProps) => {
  return (
    <Card className="w-full h-full bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Inventory Status</CardTitle>
          <Tabs defaultValue="pie" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pie" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Pie</span>
              </TabsTrigger>
              <TabsTrigger value="bar" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Bar</span>
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Trend</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="pie" className="w-full">
              <TabsContent value="pie" className="mt-0">
                <div className="h-[250px] flex items-center justify-center">
                  {/* Placeholder for Pie Chart */}
                  <div className="relative w-[200px] h-[200px] rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {/* Simulated pie chart segments */}
                    {categories.map((category, index) => {
                      const rotation = index * (360 / categories.length);
                      return (
                        <div
                          key={category.name}
                          className="absolute w-full h-full"
                          style={{
                            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((rotation + 72) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((rotation + 72) * Math.PI) / 180)}%)`,
                            backgroundColor: category.color,
                            transform: `rotate(${rotation}deg)`,
                          }}
                        />
                      );
                    })}
                    <div className="z-10 bg-white dark:bg-gray-800 rounded-full w-[120px] h-[120px] flex items-center justify-center">
                      <span className="text-lg font-bold">{totalItems}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="bar" className="mt-0">
                <div className="h-[250px] flex items-center justify-center">
                  {/* Placeholder for Bar Chart */}
                  <div className="w-full h-[200px] flex items-end justify-between gap-4 px-4">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-12 rounded-t-md"
                          style={{
                            height: `${(category.value / Math.max(...categories.map((c) => c.value))) * 150}px`,
                            backgroundColor: category.color,
                          }}
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {category.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="line" className="mt-0">
                <div className="h-[250px] flex items-center justify-center">
                  {/* Placeholder for Line Chart */}
                  <div className="w-full h-[200px] relative border-b border-l border-gray-200 dark:border-gray-700 p-4">
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 dark:bg-gray-700" />
                    <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gray-200 dark:bg-gray-700" />

                    {/* Simulated line chart */}
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 300 150"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,150 L60,100 L120,120 L180,80 L240,60 L300,30"
                        fill="none"
                        stroke="#36A2EB"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* X-axis labels */}
                    <div className="absolute bottom-[-20px] left-0 w-full flex justify-between px-4">
                      <span className="text-xs text-gray-500">Jan</span>
                      <span className="text-xs text-gray-500">Feb</span>
                      <span className="text-xs text-gray-500">Mar</span>
                      <span className="text-xs text-gray-500">Apr</span>
                      <span className="text-xs text-gray-500">May</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Package className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Total Items</h3>
              </div>
              <p className="text-2xl font-bold">{totalItems}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Across {categories.length} categories
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Stock Health</h3>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${stockHealth}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stockHealth}% of items at optimal levels
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-yellow-500 font-bold">$</span>
                <h3 className="font-medium">Total Value</h3>
              </div>
              <p className="text-2xl font-bold">
                ${totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current inventory valuation
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-3">Category Breakdown</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {category.value} items
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round((category.value / totalItems) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryStatus;
