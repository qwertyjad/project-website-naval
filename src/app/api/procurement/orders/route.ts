import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const supplier = searchParams.get("supplier");
    const search = searchParams.get("search");

    let query = "SELECT * FROM purchase_orders WHERE 1=1";
    const params: any[] = [];

    if (status && status !== "all") {
      query += " AND status = ?";
      params.push(status);
    }

    if (supplier && supplier !== "all") {
      query += " AND supplier = ?";
      params.push(supplier);
    }

    if (search) {
      query += " AND (po_number LIKE ? OR supplier LIKE ? OR notes LIKE ?)";
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    query += " ORDER BY order_date DESC";

    const orders = await executeQuery(query, params);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching purchase orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { poNumber, supplier, deliveryDate, deliveryAddress, notes, items } =
      await request.json();

    // Validate required fields
    if (!poNumber || !supplier || !items || !items.length) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 },
      );
    }

    // Start a transaction
    const pool = await getConnection();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Calculate total items and value
      const totalItems = items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0,
      );
      const totalValue = items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.price,
        0,
      );

      // Insert purchase order
      const orderQuery = `
        INSERT INTO purchase_orders (
          po_number, supplier, order_date, delivery_date, delivery_address, 
          status, total_items, total_value, notes, created_at
        ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, NOW())
      `;

      const orderParams = [
        poNumber,
        supplier,
        deliveryDate || null,
        deliveryAddress || "",
        "pending", // Initial status
        totalItems,
        totalValue,
        notes || "",
      ];

      const orderResult = (await connection.execute(
        orderQuery,
        orderParams,
      )) as any;
      const orderId = orderResult[0].insertId;

      // Insert order items
      const itemQuery = `
        INSERT INTO purchase_order_items (
          order_id, item_name, quantity, unit, price
        ) VALUES (?, ?, ?, ?, ?)
      `;

      for (const item of items) {
        await connection.execute(itemQuery, [
          orderId,
          item.name,
          item.quantity,
          item.unit,
          item.price,
        ]);
      }

      await connection.commit();

      return NextResponse.json({
        message: "Purchase order created successfully",
        orderId,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the purchase order" },
      { status: 500 },
    );
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
