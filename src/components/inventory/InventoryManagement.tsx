"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Package, Plus, Search, Filter } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import InventoryTable from "./InventoryTable";
import ItemForm from "./ItemForm";
import Sidebar from "../layout/Sidebar";

interface InventoryManagementProps {
  defaultTab?: string;
}

const InventoryManagement = ({
  defaultTab = "all-items",
}: InventoryManagementProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch inventory items
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/inventory/items?search=${searchQuery}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch inventory items");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch items when search query changes
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Initial fetch
  React.useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleCloseForm = () => {
    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleSubmitForm = async (data: any) => {
    try {
      setIsLoading(true);

      if (editingItem) {
        // Update existing item
        const response = await fetch(`/api/inventory/items/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update item");
        }
      } else {
        // Add new item
        const response = await fetch("/api/inventory/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to add item");
        }
      }

      // Refresh the items list
      fetchItems();
      setShowItemForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/inventory/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Refresh the items list
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Inventory Management
              </h1>
              <p className="text-muted-foreground">
                Manage your construction materials, tools, and equipment
                inventory.
              </p>
            </div>
            <Button onClick={handleAddItem}>
              <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="all-items">All Items</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
            </TabsList>

            <TabsContent value="all-items" className="mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <InventoryTable
                  items={items}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  onAdd={handleAddItem}
                />
              )}
            </TabsContent>

            <TabsContent value="low-stock" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Items</CardTitle>
                  <CardDescription>
                    Items that are below their minimum stock level and require
                    attention.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InventoryTable
                    items={[
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
                    ]}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onAdd={handleAddItem}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Building Materials", count: 45, icon: Package },
                  { name: "Tools", count: 32, icon: Package },
                  { name: "Safety Equipment", count: 18, icon: Package },
                  { name: "Electrical Materials", count: 24, icon: Package },
                  { name: "Plumbing Materials", count: 19, icon: Package },
                  { name: "Heavy Equipment", count: 7, icon: Package },
                ].map((category) => (
                  <Card
                    key={category.name}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-md font-medium">
                        {category.name}
                      </CardTitle>
                      <category.icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{category.count}</p>
                      <p className="text-xs text-muted-foreground">
                        items in inventory
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="locations" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Warehouse A",
                    count: 78,
                    address: "123 Main St, Building A",
                  },
                  {
                    name: "Warehouse B",
                    count: 45,
                    address: "123 Main St, Building B",
                  },
                  {
                    name: "Warehouse C",
                    count: 36,
                    address: "456 Commerce Dr",
                  },
                  {
                    name: "Storage Room",
                    count: 24,
                    address: "789 Site Office",
                  },
                  {
                    name: "Equipment Yard",
                    count: 12,
                    address: "101 Construction Ave",
                  },
                ].map((location) => (
                  <Card
                    key={location.name}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">
                        {location.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {location.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{location.count}</p>
                      <p className="text-xs text-muted-foreground">
                        items stored
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {showItemForm && (
            <ItemForm
              isOpen={showItemForm}
              onClose={handleCloseForm}
              onSubmit={handleSubmitForm}
              editItem={editingItem}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
