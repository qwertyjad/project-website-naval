"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Plus, Save, X } from "lucide-react";

export interface ItemFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (data: ItemFormValues) => void;
  editItem?: ItemFormValues | null;
}

export interface ItemFormValues {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  location: string;
  supplier: string;
  cost: number;
  description: string;
}

const defaultValues: ItemFormValues = {
  name: "",
  category: "materials",
  quantity: 0,
  unit: "pieces",
  minStockLevel: 5,
  location: "Main Warehouse",
  supplier: "Default Supplier",
  cost: 0,
  description: "",
};

const ItemForm = ({
  isOpen = true,
  onClose = () => {},
  onSubmit = () => {},
  editItem = null,
}: ItemFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ItemFormValues>({
    defaultValues: editItem || defaultValues,
    mode: "onChange", // Ensures real-time validation
  });

  // Reset form when editItem changes, preserving existing values during edit
  useEffect(() => {
    form.reset(editItem || defaultValues);
  }, [editItem, form]);

  const handleSubmit = async (data: ItemFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data); // Pass data to parent component (e.g., to save to database)
      if (!editItem) {
        form.reset(defaultValues); // Reset only for new items, not edits
      }
      onClose(); // Close form after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 bg-background"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Item name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter item name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="materials">Materials</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="safety">Safety Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            rules={{ required: "Quantity is required", min: 0 }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="sack">Sack</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minStockLevel"
            rules={{ required: "Minimum stock level is required", min: 0 }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Stock Level</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="5"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Items below this level will trigger low stock alerts
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage Location</FormLabel>
                <FormControl>
                  <Input placeholder="Main Warehouse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  <Input placeholder="Supplier name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            rules={{ required: "Cost is required", min: 0 }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost per Unit (₱)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter item description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : editItem ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Item
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  return isOpen ? (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit Inventory Item" : "Add New Inventory Item"}
          </DialogTitle>
          <DialogDescription>
            {editItem
              ? "Update the details of an existing inventory item"
              : "Add a new item to your inventory with details and minimum stock levels"}
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  ) : (
    <Card className="w-full max-w-4xl mx-auto bg-background">
      <CardHeader>
        <CardTitle>
          {editItem ? "Edit Inventory Item" : "Add New Inventory Item"}
        </CardTitle>
        <CardDescription>
          {editItem
            ? "Update the details of an existing inventory item"
            : "Add a new item to your inventory with details and minimum stock levels"}
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
};

export default ItemForm;