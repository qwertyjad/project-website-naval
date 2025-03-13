"use client";

import React, { useState } from "react";
import { Plus, ShoppingCart, Filter, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PurchaseOrderTable from "./PurchaseOrderTable";
import PurchaseOrderForm from "./PurchaseOrderForm";

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
  const handleDeleteOrder = (id: string) => {
    // In a real implementation, this would show a confirmation dialog and then delete
    console.log(`Delete order with ID: ${id}`);
  };

  // Handle updating order status
  const handleUpdateStatus = (id: string, status: string) => {
    console.log(`Update order ${id} status to: ${status}`);
  };

  // Handle creating a new purchase order
  const handleCreateOrder = () => {
    setShowCreateForm(true);
  };

  // Handle form submission
  const handleFormSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
    setShowCreateForm(false);
    setActiveTab("orders"); // Switch back to orders tab after creation
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="w-full h-full bg-background p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Procurement System</h1>
        <Button onClick={handleCreateOrder}>
          <Plus className="mr-2 h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "orders" | "create")}
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
              <PurchaseOrderTable
                onView={handleViewOrder}
                onEdit={handleEditOrder}
                onDelete={handleDeleteOrder}
                onUpdateStatus={handleUpdateStatus}
              />
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
  );
};

export default ProcurementSystem;
