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
  status: "pending" | "approved" | "shipped" | "delivered" | "cancelled";
  totalItems: number;
  totalValue: number;
}

interface PurchaseOrderTableProps {
  purchaseOrders?: PurchaseOrder[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdateStatus?: (id: string, status: PurchaseOrder["status"]) => void;
}

const getStatusBadge = (status: PurchaseOrder["status"]) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "approved":
      return <Badge variant="default">Approved</Badge>;
    case "shipped":
      return <Badge variant="secondary">Shipped</Badge>;
    case "delivered":
      return (
        <Badge variant="default" className="bg-green-500">
          Delivered
        </Badge>
      );
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const PurchaseOrderTable = ({
  purchaseOrders = [
    {
      id: "1",
      poNumber: "PO-2023-001",
      supplier: "ABC Construction Supplies",
      orderDate: "2023-05-15",
      deliveryDate: "2023-05-22",
      status: "delivered",
      totalItems: 15,
      totalValue: 2500.0,
    },
    {
      id: "2",
      poNumber: "PO-2023-002",
      supplier: "Steel Works Inc.",
      orderDate: "2023-05-18",
      deliveryDate: null,
      status: "pending",
      totalItems: 8,
      totalValue: 4200.0,
    },
    {
      id: "3",
      poNumber: "PO-2023-003",
      supplier: "Concrete Solutions",
      orderDate: "2023-05-20",
      deliveryDate: null,
      status: "approved",
      totalItems: 12,
      totalValue: 1800.0,
    },
    {
      id: "4",
      poNumber: "PO-2023-004",
      supplier: "Hardware Depot",
      orderDate: "2023-05-22",
      deliveryDate: "2023-05-30",
      status: "shipped",
      totalItems: 25,
      totalValue: 3200.0,
    },
    {
      id: "5",
      poNumber: "PO-2023-005",
      supplier: "Lumber Yard Co.",
      orderDate: "2023-05-10",
      deliveryDate: null,
      status: "cancelled",
      totalItems: 10,
      totalValue: 1500.0,
    },
  ],
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onUpdateStatus = () => {},
}: PurchaseOrderTableProps) => {
  const [sortColumn, setSortColumn] =
    useState<keyof PurchaseOrder>("orderDate");
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
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue === null) return 1;
    if (bValue === null) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-md shadow-sm w-full">
      <Table>
        <TableCaption>List of purchase orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("poNumber")}
            >
              PO Number{" "}
              {sortColumn === "poNumber" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("supplier")}
            >
              Supplier{" "}
              {sortColumn === "supplier" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("orderDate")}
            >
              Order Date{" "}
              {sortColumn === "orderDate" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("deliveryDate")}
            >
              Delivery Date{" "}
              {sortColumn === "deliveryDate" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status{" "}
              {sortColumn === "status" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => handleSort("totalItems")}
            >
              Items{" "}
              {sortColumn === "totalItems" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-right"
              onClick={() => handleSort("totalValue")}
            >
              Value{" "}
              {sortColumn === "totalValue" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.poNumber}</TableCell>
              <TableCell>{order.supplier}</TableCell>
              <TableCell>{formatDate(order.orderDate)}</TableCell>
              <TableCell>{formatDate(order.deliveryDate)}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-right">{order.totalItems}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(order.totalValue)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(order.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(order.id)}>
                      <FileEdit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                    {order.status !== "approved" && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order.id, "approved")}
                      >
                        <FileCheck className="mr-2 h-4 w-4" />
                        Mark as Approved
                      </DropdownMenuItem>
                    )}
                    {order.status !== "shipped" &&
                      order.status === "approved" && (
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(order.id, "shipped")}
                        >
                          <TruckIcon className="mr-2 h-4 w-4" />
                          Mark as Shipped
                        </DropdownMenuItem>
                      )}
                    {order.status !== "delivered" &&
                      order.status === "shipped" && (
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(order.id, "delivered")}
                        >
                          <FileCheck className="mr-2 h-4 w-4" />
                          Mark as Delivered
                        </DropdownMenuItem>
                      )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(order.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PurchaseOrderTable;
