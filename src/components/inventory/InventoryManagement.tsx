"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Package, Plus, Search, Filter, Tag, MapPin } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import InventoryTable from "./InventoryTable";
import ItemForm, { ItemFormValues } from "./ItemForm";
import Sidebar from "../layout/Sidebar";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  location: string;
  supplier: string;
  cost: number;
  description: string;
  lastUpdated: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface InventoryManagementProps {
  defaultTab?: string;
}

const InventoryManagement = ({ defaultTab = "all-items" }: InventoryManagementProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `/api/inventory/items?search=${encodeURIComponent(searchQuery)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch inventory items");
      }
      const data = await response.json();
      const itemsWithStatus: InventoryItem[] = data.map((item: any) => ({
        ...item,
        minStockLevel: item.min_stock_level,
        lastUpdated: item.last_updated,
        status:
          item.quantity === 0
            ? "Out of Stock"
            : item.quantity <= item.min_stock_level
            ? "Low Stock"
            : "In Stock",
      }));
      setItems(itemsWithStatus);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      setError("Failed to load inventory items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(); // Initial fetch
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleCloseForm = () => {
    setShowItemForm(false);
    setEditingItem(null);
  };

  const handleSubmitForm = async (data: ItemFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      const url = editingItem ? `/api/inventory/items/${editingItem.id}` : "/api/inventory/items";
      const method = editingItem ? "PUT" : "POST";

      const formattedData = {
        ...data,
        min_stock_level: data.minStockLevel,
        last_updated: new Date().toISOString(),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingItem ? "update" : "add"} item`);
      }

      await fetchItems();
      handleCloseForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(`Error ${editingItem ? "updating" : "adding"} item. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/inventory/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      await fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Group items by category and count the number of items
  const groupedByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { items: [], itemCount: 0 };
    }
    acc[item.category].items.push(item);
    acc[item.category].itemCount += 1; // Increment count for each item
    return acc;
  }, {} as Record<string, { items: InventoryItem[]; itemCount: number }>);

  // Group items by location and count the number of items
  const groupedByLocation = items.reduce((acc, item) => {
    if (!acc[item.location]) {
      acc[item.location] = { items: [], itemCount: 0 };
    }
    acc[item.location].items.push(item);
    acc[item.location].itemCount += 1; // Increment count for each item
    return acc;
  }, {} as Record<string, { items: InventoryItem[]; itemCount: number }>);

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
                Manage your construction materials, tools, and equipment inventory.
              </p>
            </div>
            <Button onClick={handleAddItem} disabled={isLoading}>
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
                disabled={isLoading}
              />
            </div>
            <Button variant="outline" size="icon" disabled={isLoading}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Card className="border-none">
                  <CardContent className="p-0">
                    <InventoryTable
                      items={items.filter((item) => item.status === "Low Stock" || item.status === "Out of Stock")}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                      onAdd={handleAddItem}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              <Card>
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : Object.keys(groupedByCategory).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(groupedByCategory).map(([category, { itemCount }]) => (
                        <Card key={category} className="bg-gray-800 text-white rounded-lg shadow-md">
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <h3 className="text-sm font-semibold uppercase text-gray-400">
                                {category}
                              </h3>
                              <p className="text-3xl font-bold">{itemCount}</p>
                              <p className="text-sm text-gray-400">Items in Category</p>
                            </div>
                            <div className="bg-gray-700 p-2 rounded-full">
                              <Tag className="h-6 w-6 text-white" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No items found in categories.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations" className="mt-6">
              <Card>
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : Object.keys(groupedByLocation).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(groupedByLocation).map(([location, { itemCount }]) => (
                        <Card key={location} className="bg-gray-800 text-white rounded-lg shadow-md">
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <h3 className="text-sm font-semibold uppercase text-gray-400">
                                {location}
                              </h3>
                              <p className="text-3xl font-bold">{itemCount}</p>
                              <p className="text-sm text-gray-400">Items in Location</p>
                            </div>
                            <div className="bg-gray-700 p-2 rounded-full">
                              <MapPin className="h-6 w-6 text-white" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No items found in locations.</p>
                  )}
                </CardContent>
              </Card>
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