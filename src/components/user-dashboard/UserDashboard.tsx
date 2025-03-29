// src/components/dashboard/UserDashboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Search, ShoppingCart, History, Plus, Minus } from "lucide-react";
import UserSidebar from "../layout/UserSidebar";
import { useToast } from "../ui/use-toast";

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

interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  createdAt: string;
  status: "Pending" | "Completed" | "Cancelled";
}

const UserDashboard = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInventoryItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/inventory/items?search=${encodeURIComponent(searchQuery)}`);
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
      setInventoryItems(itemsWithStatus);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      setError("Failed to load inventory items. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load inventory items.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load orders.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
    fetchOrders();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInventoryItems();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const addToCart = (item: InventoryItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.itemId === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.itemId === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { itemId: item.id, name: item.name, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.itemId === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.itemId === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter((cartItem) => cartItem.itemId !== itemId);
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      setError("Cart is empty. Add items to place an order.");
      toast({
        title: "Error",
        description: "Cart is empty. Add items to place an order.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          createdAt: new Date().toISOString(),
          status: "Pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      setCart([]);
      await fetchOrders();
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully.",
      });
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order. Please try again.");
      toast({
        title: "Error",
        description: "Failed to place order.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <UserSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">User Dashboard</h1>
              <p className="text-muted-foreground">
                Place orders and manage your inventory requests.
              </p>
            </div>
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
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Available Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : inventoryItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addToCart(item)}
                              disabled={item.status === "Out of Stock"}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No inventory items found.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cart</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {cart.map((cartItem) => (
                        <div
                          key={cartItem.itemId}
                          className="flex justify-between items-center p-2 border rounded-md"
                        >
                          <span>
                            {cartItem.name} (x{cartItem.quantity})
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => addToCart(
                                inventoryItems.find((item) => item.id === cartItem.itemId)!
                              )}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeFromCart(cartItem.itemId)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={placeOrder}
                      disabled={isLoading}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Place Order
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground">Your cart is empty.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>
                          {order.items.map((item) => (
                            <div key={item.itemId}>
                              {item.name} (x{item.quantity})
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{order.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No orders found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;