import React, { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  FileEdit,
  Trash2,
  FileCheck,
  TruckIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  orderDate: string;
  deliveryDate: string | null;
  deliveryAddress: string;
  status: "pending" | "approved" | "shipped" | "delivered" | "cancelled";
  totalItems: number;
  totalValue: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  orderId: string;
  itemName: string;
  quantity: number;
  unit: string;
  price: number;
}

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: PurchaseOrder["status"]) => void;
}

const getStatusBadge = (status: PurchaseOrder["status"]) => {
  switch (status) {
    case "pending": return <Badge variant="secondary">Pending</Badge>;
    case "approved": return <Badge variant="default">Approved</Badge>;
    case "shipped": return <Badge variant="secondary">Shipped</Badge>;
    case "delivered": return <Badge variant="default" className="bg-green-500">Delivered</Badge>;
    case "cancelled": return <Badge variant="destructive">Cancelled</Badge>;
    default: return <Badge variant="outline">Unknown</Badge>;
  }
};

const PurchaseOrderTable = ({
  purchaseOrders,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
}: PurchaseOrderTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof PurchaseOrder>("orderDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (column: keyof PurchaseOrder) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedOrders = [...purchaseOrders].sort((a, b) => {
    const aValue = a[sortColumn] ?? "";
    const bValue = b[sortColumn] ?? "";

    if (aValue === null || aValue === "") return 1;
    if (bValue === null || bValue === "") return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const formatCurrency = (amount: number | undefined) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount ?? 0);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-PH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  return (
    <div className=" rounded-md shadow-sm w-full text-gray-900 dark:text-gray-100">
      <Table>
        <TableCaption className="text-gray-700 dark:text-gray-300">
          List of purchase orders
        </TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <TableHead
              className="cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => handleSort("poNumber")}
            >
              PO Number {sortColumn === "poNumber" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => handleSort("supplier")}
            >
              Supplier {sortColumn === "supplier" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => handleSort("orderDate")}
            >
              Order Date {sortColumn === "orderDate" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => handleSort("deliveryDate")}
            >
              Delivery Date {sortColumn === "deliveryDate" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => handleSort("status")}
            >
              Status {sortColumn === "status" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-right text-gray-900 dark:text-gray-100"
              onClick={() => handleSort("totalItems")}
            >
              Items {sortColumn === "totalItems" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-right text-gray-900 dark:text-gray-100"
              onClick={() => handleSort("totalValue")}
            >
              Value {sortColumn === "totalValue" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="w-[80px] text-gray-900 dark:text-gray-100">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 dark:text-gray-400">
                No purchase orders found
              </TableCell>
            </TableRow>
          ) : (
            sortedOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell className="font-medium">{order.poNumber || "N/A"}</TableCell>
                <TableCell>{order.supplier || "Unknown"}</TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
                <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right">{order.totalItems}</TableCell>
                <TableCell className="text-right">{formatCurrency(order.totalValue)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(order.id)}>
                        <Eye className="mr-2 h-4 w-4" /> View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(order.id)}>
                        <FileEdit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                      {(order.status === "pending" || order.status === "cancelled") && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "approved")}>
                          <FileCheck className="mr-2 h-4 w-4" /> Mark as Approved
                        </DropdownMenuItem>
                      )}
                      {order.status === "approved" && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "shipped")}>
                          <TruckIcon className="mr-2 h-4 w-4" /> Mark as Shipped
                        </DropdownMenuItem>
                      )}
                      {order.status === "shipped" && (
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "delivered")}>
                          <FileCheck className="mr-2 h-4 w-4" /> Mark as Delivered
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(order.id)} className="text-red-600 dark:text-red-400">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PurchaseOrderTable;