import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Calendar, Truck } from "lucide-react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface PurchaseOrderFormProps {
  open: boolean;
  onSubmit: (data: PurchaseOrderFormData) => void;
  onCancel: () => void;
  initialData?: PurchaseOrderFormData;
}

interface PurchaseOrderFormData {
  poNumber: string;
  supplier: string;
  deliveryDate: string;
  deliveryAddress: string;
  notes: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

const PurchaseOrderForm = ({
  open,
  onSubmit,
  onCancel,
  initialData,
}: PurchaseOrderFormProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [items, setItems] = useState<OrderItem[]>(initialData?.items || []);

  const form = useForm<PurchaseOrderFormData>({
    defaultValues: initialData || {
      poNumber: `PO-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      supplier: "",
      deliveryDate: "",
      deliveryAddress: "",
      notes: "",
      items: [],
    },
  });

  const handleSubmit = (data: PurchaseOrderFormData) => {
    onSubmit({ ...data, items });
  };

  const addItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unit: "Pieces",
      price: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-4xl bg-background">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Purchase Order" : "Create Purchase Order"}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="items">Order Items</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="poNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>PO Number</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="supplier" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Truck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                  <Button type="button" onClick={() => setActiveTab("items")}>Next: Add Items</Button>
                </div>
              </TabsContent>
              <TabsContent value="items" className="space-y-4 mt-4">
                <Card>
                  <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-4">
                            <FormLabel className="text-xs">Item Name</FormLabel>
                            <Input value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} />
                          </div>
                          <div className="col-span-2">
                            <FormLabel className="text-xs">Quantity</FormLabel>
                            <Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} min="1" />
                          </div>
                          <div className="col-span-2">
                            <FormLabel className="text-xs">Unit</FormLabel>
                            <Select value={item.unit} onValueChange={(value) => updateItem(item.id, "unit", value)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pieces">Pieces</SelectItem>
                                <SelectItem value="Bags">Bags</SelectItem>
                                <SelectItem value="Tons">Tons</SelectItem>
                                <SelectItem value="Meters">Meters</SelectItem>
                                <SelectItem value="Liters">Liters</SelectItem>
                                <SelectItem value="Sacks">Sack</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <FormLabel className="text-xs">Unit Price</FormLabel>
                            <Input type="number" value={item.price} onChange={(e) => updateItem(item.id, "price", Number(e.target.value))} min="0" step="0.01" />
                          </div>
                          <div className="col-span-1 flex items-end">
                            <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="col-span-1 flex items-end justify-end">
                            <p className="text-sm font-medium">{formatCurrency(item.quantity * item.price)}</p>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addItem}>
                        <Plus className="mr-2 h-4 w-4" /> Add Item
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-4">
                    <p className="text-sm text-muted-foreground">Total Items: {items.length}</p>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Subtotal</p>
                      <p className="text-2xl font-bold">{formatCurrency(Number(calculateTotal()))}</p>
                    </div>
                  </CardFooter>
                </Card>
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>Back to Details</Button>
                  <div className="space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">{initialData ? "Update" : "Create"} Purchase Order</Button>
                  </div>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderForm;