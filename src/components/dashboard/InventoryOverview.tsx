import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Package, Boxes, DollarSign, AlertTriangle } from "lucide-react";

interface InventoryOverviewProps {
  totalItems?: number;
  totalCategories?: number;
  inventoryValue?: number;
  lowStockCount?: number;
}

const InventoryOverview = ({
  totalItems = 247,
  totalCategories = 12,
  inventoryValue = 125750,
  lowStockCount = 8,
}: InventoryOverviewProps) => {
  return (
    <div className="w-full bg-background p-4">
      <h2 className="text-2xl font-bold mb-4">Inventory Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Items Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{totalItems}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Items in inventory
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{totalCategories}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Different item categories
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Boxes className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Value Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  ${inventoryValue.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total value of inventory
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert Card */}
        <Card className={lowStockCount > 5 ? "border-red-200 bg-red-50" : ""}>
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-sm font-medium ${lowStockCount > 5 ? "text-red-600" : "text-muted-foreground"}`}
            >
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-3xl font-bold ${lowStockCount > 5 ? "text-red-600" : ""}`}
                >
                  {lowStockCount}
                </p>
                <p
                  className={`text-xs ${lowStockCount > 5 ? "text-red-500" : "text-muted-foreground"} mt-1`}
                >
                  Items below minimum level
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-full ${lowStockCount > 5 ? "bg-red-100" : "bg-amber-100"} flex items-center justify-center`}
              >
                <AlertTriangle
                  className={`h-6 w-6 ${lowStockCount > 5 ? "text-red-600" : "text-amber-600"}`}
                />
              </div>
            </div>
          </CardContent>
          {lowStockCount > 5 && (
            <CardFooter className="pt-0">
              <p className="text-xs text-red-600 font-medium">
                Action required: Review low stock items
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InventoryOverview;
