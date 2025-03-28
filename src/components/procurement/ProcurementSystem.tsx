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

interface PurchaseOrderFormData {
  poNumber: string;
  supplier: string;
  deliveryDate: string;
  deliveryAddress: string;
  notes: string;
  items: FormOrderItem[];
}

interface FormOrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface ProcurementSystemProps {
  initialTab?: "orders" | "create";
}

const ProcurementSystem = ({ initialTab = "orders" }: ProcurementSystemProps) => {
  const [activeTab, setActiveTab] = useState<"orders" | "create">(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editOrder, setEditOrder] = useState<PurchaseOrderFormData | null>(null);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/procurement/orders?search=${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        const mappedOrders = Array.isArray(data)
          ? data.map((order: any) => ({
              id: order.id || "",
              poNumber: order.po_number || "",
              supplier: order.supplier || "",
              orderDate: order.order_date || "",
              deliveryDate: order.delivery_date || null,
              deliveryAddress: order.delivery_address || "",
              status: (order.status || "pending") as PurchaseOrder["status"],
              totalItems: order.total_items ?? order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) ?? 0,
              totalValue: order.total_value ?? order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0) * (item.price || 0), 0) ?? 0,
              notes: order.notes || "",
              createdAt: order.created_at || "",
              updatedAt: order.updated_at || "",
              items: order.items?.map((item: any) => ({
                id: item.id || "",
                orderId: item.order_id || order.id,
                itemName: item.item_name || "",
                quantity: item.quantity ?? 0,
                unit: item.unit || "",
                price: item.price ?? 0,
              })) || [],
            }))
          : [];
        setOrders(mappedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchOrders(), 500);
    return () => clearTimeout(delayDebounceFn); // Fixed syntax error here
  }, [searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = (id: string) => {
    console.log(`View order details for ID: ${id}`);
  };

  const handleEditOrder = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order) {
      const formData: PurchaseOrderFormData = {
        poNumber: order.poNumber,
        supplier: order.supplier,
        deliveryDate: order.deliveryDate || "",
        deliveryAddress: order.deliveryAddress,
        notes: order.notes,
        items: order.items.map((item) => ({
          id: item.id,
          name: item.itemName,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
        })),
      };
      console.log("Editing order:", formData); // Debug log
      setEditOrder(formData);
      setShowForm(true);
    } else {
      console.error(`Order with ID ${id} not found`);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this purchase order?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/procurement/orders/${id}`, { method: "DELETE" });
      if (response.ok) fetchOrders();
      else throw new Error("Failed to delete purchase order");
    } catch (error) {
      console.error("Error deleting purchase order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/procurement/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) fetchOrders();
      else throw new Error("Failed to update purchase order status");
    } catch (error) {
      console.error("Error updating purchase order status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: PurchaseOrderFormData) => {
    setIsLoading(true);
    try {
      const method = editOrder ? "PUT" : "POST";
      const url = editOrder ? `/api/procurement/orders/${editOrder.poNumber}` : "/api/procurement/orders";
      const apiData = {
        po_number: data.poNumber,
        supplier: data.supplier,
        order_date: editOrder ? orders.find(o => o.poNumber === editOrder.poNumber)?.orderDate : new Date().toISOString().split("T")[0],
        delivery_date: data.deliveryDate || null,
        delivery_address: data.deliveryAddress,
        status: editOrder ? orders.find(o => o.poNumber === editOrder.poNumber)?.status || "pending" : "pending",
        notes: data.notes,
        items: data.items.map(item => ({
          item_name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
        })),
      };
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });
      if (response.ok) {
        fetchOrders();
        setShowForm(false);
        setEditOrder(null);
        setActiveTab("orders");
      } else throw new Error(`Failed to ${editOrder ? "update" : "create"} purchase order`);
    } catch (error) {
      console.error(`Error ${editOrder ? "updating" : "creating"} purchase order:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditOrder(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Procurement System</h1>
              <p className="text-muted-foreground">Create and manage purchase orders</p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Purchase Order
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "orders" | "create")} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="orders" className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" /> Purchase Orders
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Create New
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 dark:text-gray-100">Purchase Orders</CardTitle>
                    <div className="flex items-center gap-2 w-1/3">
                      <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
                      </div>
                      <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
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
                <CardHeader><CardTitle className="text-gray-900 dark:text-gray-100">Create New Purchase Order</CardTitle></CardHeader>
                <CardContent>
                  <Button onClick={() => setShowForm(true)}>Start New Purchase Order</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {showForm && (
            <PurchaseOrderForm
              open={showForm}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              initialData={editOrder ?? undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcurementSystem;