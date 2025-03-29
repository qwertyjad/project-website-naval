import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card"; // Added CardFooter
import { Package, Boxes, DollarSign, AlertTriangle } from "lucide-react";

interface InventoryOverviewProps {
  totalItems: number;
  totalCategories: number;
  inventoryValue: number;
  lowStockCount: number;
}

const InventoryOverview = ({
  totalItems,
  totalCategories,
  inventoryValue,
  lowStockCount,
}: InventoryOverviewProps) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value);

  return (
    <div className="w-full p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Inventory Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
                <p className="text-xs text-muted-foreground mt-1">Items in inventory</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCategories}</p>
                <p className="text-xs text-muted-foreground mt-1">Different item categories</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Boxes className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(inventoryValue)}</p>
                <p className="text-xs text-muted-foreground mt-1">Total value of inventory</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-none shadow-md hover:shadow-lg transition-shadow ${lowStockCount > 5 ? "bg-red-50 dark:bg-red-900/30" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${lowStockCount > 5 ? "text-red-600" : "text-muted-foreground"}`}>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-3xl font-bold ${lowStockCount > 5 ? "text-red-600" : "text-gray-900 dark:text-white"}`}>{lowStockCount}</p>
                <p className={`text-xs ${lowStockCount > 5 ? "text-red-500" : "text-muted-foreground"} mt-1`}>Items below minimum level</p>
              </div>
              <div className={`h-12 w-12 rounded-full ${lowStockCount > 5 ? "bg-red-100" : "bg-amber-100"} flex items-center justify-center`}>
                <AlertTriangle className={`h-6 w-6 ${lowStockCount > 5 ? "text-red-600" : "text-amber-600"}`} />
              </div>
            </div>
          </CardContent>
          {lowStockCount > 5 && (
            <CardFooter className="pt-0">
              <p className="text-xs text-red-600 font-medium">Action required: Review low stock items</p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InventoryOverview;