import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AlertTriangle, ArrowUpDown, Package, Eye, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface LowStockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  status: "critical" | "low";
}

const LowStockAlerts = () => {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/low-stock');
        if (!response.ok) {
          throw new Error('Failed to fetch low stock items');
        }
        const data = await response.json();
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  const handleOrderClick = async (itemId: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity: 10 }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      // Refresh the low stock items after successful order
      const refreshResponse = await fetch('/api/dashboard/low-stock');
      const refreshedData = await refreshResponse.json();
      setItems(Array.isArray(refreshedData.items) ? refreshedData.items : []);

      alert(`Order placed for item ${itemId}`);
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to place order');
    }
  };

  const handleViewClick = (itemId: string) => {
    router.push(`/inventory/${itemId}`);
  };

  if (loading) {
    return <div>Loading low stock alerts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full h-full rounded-lg bg-white shadow-lg dark:bg-black p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Low Stock Alerts</h3>
          <Badge variant="destructive" className="ml-2">
            {items.filter(item => item.status === "critical").length} Critical
          </Badge>
          <Badge variant="secondary" className="ml-1">
            {items.filter(item => item.status === "low").length} Low
          </Badge>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          <ArrowUpDown className="h-3.5 w-3.5 mr-1" /> Sort
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
              <TableRow key={item.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <span className={item.status === "critical" ? "text-red-500 font-medium" : "text-amber-500"}>
                    {item.currentStock} {item.unit}
                  </span>
                </TableCell>
                <TableCell>{item.minimumStock} {item.unit}</TableCell>
                <TableCell>
                  {item.status === "critical" ? <Badge variant="destructive">Critical</Badge> : <Badge variant="secondary">Low</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewClick(item.id)}
                      title="View Item Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOrderClick(item.id)}
                      title="Place Order"
                    >
                      <ShoppingCart className="h-4 w-4" />
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
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">No Low Stock Items</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">All inventory items are above minimum stock levels.</p>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;