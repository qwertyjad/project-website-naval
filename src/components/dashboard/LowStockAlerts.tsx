import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  AlertTriangle,
  ArrowUpDown,
  Package,
  ShoppingCart,
} from "lucide-react";

interface LowStockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  status: "critical" | "low";
}

interface LowStockAlertsProps {
  items?: LowStockItem[];
  onOrderClick?: (itemId: string) => void;
  onViewClick?: (itemId: string) => void;
}

const LowStockAlerts = ({
  items = [
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
  ],
  onOrderClick = () => {},
  onViewClick = () => {},
}: LowStockAlertsProps) => {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-950 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-medium">Low Stock Alerts</h3>
          <Badge variant="destructive" className="ml-2">
            {items.filter((item) => item.status === "critical").length} Critical
          </Badge>
          <Badge variant="secondary" className="ml-1">
            {items.filter((item) => item.status === "low").length} Low
          </Badge>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
          Sort
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Min. Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <span
                    className={
                      item.status === "critical"
                        ? "text-red-500 font-medium"
                        : "text-amber-500"
                    }
                  >
                    {item.currentStock} {item.unit}
                  </span>
                </TableCell>
                <TableCell>
                  {item.minimumStock} {item.unit}
                </TableCell>
                <TableCell>
                  {item.status === "critical" ? (
                    <Badge variant="destructive">Critical</Badge>
                  ) : (
                    <Badge variant="secondary">Low</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewClick(item.id)}
                    >
                      <Package className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onOrderClick(item.id)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                      Order
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Package className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium mb-1">No Low Stock Items</h3>
          <p className="text-sm text-gray-500">
            All inventory items are above minimum stock levels.
          </p>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;
