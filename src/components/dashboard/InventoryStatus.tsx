"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Activity, Package, DollarSign } from "lucide-react";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface InventoryStatusProps {
  categories: CategoryData[];
  totalItems: number;
  totalValue: number;
  stockHealth: number;
}

const InventoryStatus = ({
  categories,
  totalItems,
  totalValue,
  stockHealth,
}: InventoryStatusProps) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", { 
      style: "currency", 
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value);

  const maxValue = Math.max(...categories.map((c) => c.value));
  
  return (
    <Card className="w-full h-full border-none dark:bg-black">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Inventory Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              icon: Package,
              title: "Total Items",
              value: totalItems.toLocaleString('en-PH'),
              subtext: `Across ${categories.length} categories`,
              color: "text-blue-600",
            },
            {
              icon: Activity,
              title: "Stock Health",
              value: `${stockHealth}%`,
              subtext: "Optimal levels",
              color: "text-green-600",
              progress: stockHealth,
            },
            {
              icon: DollarSign,
              title: "Total Value",
              value: formatCurrency(totalValue),
              subtext: "Current valuation",
              color: "text-yellow-600",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                  {item.title}
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </p>
              {item.progress && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2 mb-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.subtext}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-black mb-6">
          <h3 className="font-semibold text-lg mb-6 text-gray-700 dark:text-gray-200">Inventory Distribution</h3>
          <div className="relative h-[300px] w-full">
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-6 h-full">
              {categories.map((category) => {
                const height = (category.value / maxValue) * 200;
                return (
                  <div
                    key={category.name}
                    className="flex-1 max-w-[80px] flex flex-col items-center gap-3 transition-all duration-300"
                  >
                    <div
                      className="w-full rounded-t-lg shadow-md relative overflow-hidden"
                      style={{
                        height: `${height}px`,
                        background: `linear-gradient(180deg, ${category.color}20, ${category.color}80)`,
                        boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1)`,
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `linear-gradient(45deg, rgba(255, 255, 255, 0.2), transparent)`,
                        }}
                      />
                      <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{
                          background: `linear-gradient(to right, ${category.color}, ${category.color}80)`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
                      {category.name}
                    </span>
                    <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {category.value}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">Category Breakdown</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-200">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{category.value.toLocaleString('en-PH')} items</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
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