"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Plus,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minLevel: number;
  unit: string;
  location: string;
  lastUpdated: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface InventoryTableProps {
  items?: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

const InventoryTable = ({
  items = defaultItems,
  onEdit = () => {},
  onDelete = () => {},
  onAdd = () => {},
}: InventoryTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full bg-background rounded-md border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Items</DropdownMenuItem>
              <DropdownMenuItem>Low Stock</DropdownMenuItem>
              <DropdownMenuItem>Out of Stock</DropdownMenuItem>
              <DropdownMenuItem>By Category</DropdownMenuItem>
              <DropdownMenuItem>By Location</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Inventory Items List</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "In Stock"
                          ? "default"
                          : item.status === "Low Stock"
                            ? "secondary"
                            : "destructive"
                      }
                      className="flex w-fit items-center gap-1"
                    >
                      {item.status === "Low Stock" ||
                        (item.status === "Out of Stock" && (
                          <AlertTriangle className="h-3 w-3" />
                        ))}
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(item.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-muted-foreground"
                >
                  No inventory items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Default mock data
const defaultItems: InventoryItem[] = [
  {
    id: "1",
    name: "Cement",
    category: "Building Materials",
    quantity: 150,
    minLevel: 50,
    unit: "Bags",
    location: "Warehouse A",
    lastUpdated: "2023-10-15",
    status: "In Stock",
  },
  {
    id: "2",
    name: "Steel Rebar",
    category: "Structural Materials",
    quantity: 30,
    minLevel: 40,
    unit: "Tons",
    location: "Warehouse B",
    lastUpdated: "2023-10-12",
    status: "Low Stock",
  },
  {
    id: "3",
    name: "Bricks",
    category: "Building Materials",
    quantity: 2500,
    minLevel: 1000,
    unit: "Pieces",
    location: "Warehouse A",
    lastUpdated: "2023-10-10",
    status: "In Stock",
  },
  {
    id: "4",
    name: "Paint - White",
    category: "Finishing Materials",
    quantity: 0,
    minLevel: 20,
    unit: "Gallons",
    location: "Warehouse C",
    lastUpdated: "2023-10-08",
    status: "Out of Stock",
  },
  {
    id: "5",
    name: "Plywood",
    category: "Wood Materials",
    quantity: 75,
    minLevel: 30,
    unit: "Sheets",
    location: "Warehouse B",
    lastUpdated: "2023-10-14",
    status: "In Stock",
  },
  {
    id: "6",
    name: "Concrete Mixer",
    category: "Equipment",
    quantity: 3,
    minLevel: 2,
    unit: "Units",
    location: "Equipment Yard",
    lastUpdated: "2023-10-05",
    status: "In Stock",
  },
  {
    id: "7",
    name: "Safety Helmets",
    category: "Safety Equipment",
    quantity: 15,
    minLevel: 20,
    unit: "Pieces",
    location: "Storage Room",
    lastUpdated: "2023-10-11",
    status: "Low Stock",
  },
  {
    id: "8",
    name: "Electrical Wires",
    category: "Electrical Materials",
    quantity: 500,
    minLevel: 200,
    unit: "Meters",
    location: "Warehouse C",
    lastUpdated: "2023-10-09",
    status: "In Stock",
  },
  {
    id: "9",
    name: "PVC Pipes",
    category: "Plumbing Materials",
    quantity: 120,
    minLevel: 50,
    unit: "Pieces",
    location: "Warehouse A",
    lastUpdated: "2023-10-13",
    status: "In Stock",
  },
  {
    id: "10",
    name: "Excavator",
    category: "Heavy Equipment",
    quantity: 0,
    minLevel: 1,
    unit: "Units",
    location: "Equipment Yard",
    lastUpdated: "2023-10-07",
    status: "Out of Stock",
  },
  {
    id: "11",
    name: "Window Frames",
    category: "Finishing Materials",
    quantity: 35,
    minLevel: 20,
    unit: "Pieces",
    location: "Warehouse B",
    lastUpdated: "2023-10-06",
    status: "In Stock",
  },
  {
    id: "12",
    name: "Door Hinges",
    category: "Hardware",
    quantity: 200,
    minLevel: 100,
    unit: "Pieces",
    location: "Storage Room",
    lastUpdated: "2023-10-04",
    status: "In Stock",
  },
];

export default InventoryTable;
