"use client";

import React, { useState, useEffect } from "react";
import { Plus, ShoppingCart, Filter, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PurchaseOrderTable from "./PurchaseOrderTable";
import PurchaseOrderForm from "./PurchaseOrderForm";
import Sidebar from "../layout/Sidebar";

interface ProcurementSystemProps {
  initialTab?: "orders" | "create";
}

const ProcurementSystem = ({
  initialTab = "orders",
}: ProcurementSystemProps) => {
  const [activeTab, setActiveTab] = useState<"orders" | "create">(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch purchase orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/procurement/orders?search=${searchTerm}`,
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders when search term changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle viewing order details
  const handleViewOrder = (id: string) => {
    setSelectedOrderId(id);
    // In a real implementation, this would fetch order details and show them in a modal/dialog
    console.log(`View order details for ID: ${id}`);
  };

  // Handle editing an order
  const handleEditOrder = (id: string) => {
    setSelectedOrderId(id);
    // In a real implementation, this would fetch order details and populate the form
    console.log(`Edit order with ID: ${id}`);
  };

  // Handle deleting an order
  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this purchase order?")) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/procurement/orders/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the orders list
        fetchOrders();
      } else {
        throw new Error("Failed to delete purchase order");
      }
    } catch (error) {
      console.error("Error deleting purchase order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating order status
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/procurement/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh the orders list
        fetchOrders();
      } else {
        throw new Error("Failed to update purchase order status");
      }
    } catch (error) {
      console.error("Error updating purchase order status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle creating a new purchase order
  const handleCreateOrder = () => {
    setShowCreateForm(true);
  };

  // Handle form submission
  const handleFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/procurement/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Refresh the orders list
        fetchOrders();
        setShowCreateForm(false);
        setActiveTab("orders"); // Switch back to orders tab after creation
      } else {
        throw new Error("Failed to create purchase order");
      }
    } catch (error) {
      console.error("Error creating purchase order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Procurement System</h1>
              <p className="text-muted-foreground">
                Create and manage purchase orders for materials and equipment
              </p>
            </div>
            <Button onClick={handleCreateOrder}>
              <Plus className="mr-2 h-4 w-4" />
              Create Purchase Order
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "orders" | "create")
            }
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="orders" className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Purchase Orders
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Purchase Orders</CardTitle>
                    <div className="flex items-center gap-2 w-1/3">
                      <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search orders..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <PurchaseOrderTable
                      purchaseOrders={orders}
                      onView={handleViewOrder}
                      onEdit={handleEditOrder}
                      onDelete={handleDeleteOrder}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Purchase Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Fill out the form below to create a new purchase order for
                    materials and equipment.
                  </p>
                  <Button onClick={handleCreateOrder}>
                    Start New Purchase Order
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Purchase Order Form Dialog */}
          {showCreateForm && (
            <PurchaseOrderForm
              open={showCreateForm}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcurementSystem;
