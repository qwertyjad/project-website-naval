import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    // Get order details
    const orderQuery = "SELECT * FROM purchase_orders WHERE id = ?";
    const orders = (await executeQuery(orderQuery, [id])) as any[];

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "Purchase order not found" },
        { status: 404 },
      );
    }

    // Get order items
    const itemsQuery = "SELECT * FROM purchase_order_items WHERE order_id = ?";
    const items = await executeQuery(itemsQuery, [id]);

    return NextResponse.json({
      ...orders[0],
      items,
    });
  } catch (error) {
    console.error("Error fetching purchase order:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the purchase order" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const { status } = await request.json();

    // Validate status
    const validStatuses = [
      "pending",
      "approved",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    const query = "UPDATE purchase_orders SET status = ? WHERE id = ?";
    const result = (await executeQuery(query, [status, id])) as any;

    if (result.affectedRows > 0) {
      // If status is 'delivered', update inventory quantities
      if (status === "delivered") {
        await updateInventoryOnDelivery(id);
      }

      return NextResponse.json({
        message: "Purchase order status updated successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Purchase order not found" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Error updating purchase order status:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the purchase order status" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    // Start a transaction
    const pool = await getConnection();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Delete order items first
      await connection.execute(
        "DELETE FROM purchase_order_items WHERE order_id = ?",
        [id],
      );

      // Then delete the order
      const result = (await connection.execute(
        "DELETE FROM purchase_orders WHERE id = ?",
        [id],
      )) as any;

      await connection.commit();

      if (result[0].affectedRows > 0) {
        return NextResponse.json({
          message: "Purchase order deleted successfully",
        });
      } else {
        return NextResponse.json(
          { error: "Purchase order not found" },
          { status: 404 },
        );
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the purchase order" },
      { status: 500 },
    );
  }
}

// Helper function to update inventory when a purchase order is delivered
async function updateInventoryOnDelivery(orderId: string) {
  // Get order items
  const items = (await executeQuery(
    "SELECT * FROM purchase_order_items WHERE order_id = ?",
    [orderId],
  )) as any[];

  for (const item of items) {
    // Check if item exists in inventory
    const inventoryItems = (await executeQuery(
      "SELECT * FROM inventory_items WHERE name = ? LIMIT 1",
      [item.item_name],
    )) as any[];

    if (inventoryItems.length > 0) {
      // Update existing inventory item
      const inventoryItem = inventoryItems[0];
      const newQuantity = inventoryItem.quantity + item.quantity;

      await executeQuery(
        "UPDATE inventory_items SET quantity = ?, last_updated = NOW() WHERE id = ?",
        [newQuantity, inventoryItem.id],
      );
    } else {
      // Add new inventory item
      await executeQuery(
        `INSERT INTO inventory_items (
          name, category, quantity, unit, min_stock_level, location, supplier, cost, last_updated
        ) VALUES (?, 'New Items', ?, ?, 5, 'Main Warehouse', ?, ?, NOW())`,
        [
          item.item_name,
          item.quantity,
          item.unit,
          item.supplier || "Unknown",
          item.price || 0,
        ],
      );
    }
  }
}

// Helper function to get a connection from the pool
async function getConnection() {
  const mysql = require("mysql2/promise");
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "construction_inventory",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  return pool;
}
