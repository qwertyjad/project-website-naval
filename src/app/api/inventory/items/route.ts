import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = "SELECT * FROM inventory_items WHERE 1=1";
    const params: any[] = [];

    if (category && category !== "all") {
      query += " AND category = ?";
      params.push(category);
    }

    if (location && location !== "all") {
      query += " AND location = ?";
      params.push(location);
    }

    if (status && status !== "all") {
      if (status === "low") {
        query += " AND quantity <= min_stock_level AND quantity > 0";
      } else if (status === "out") {
        query += " AND quantity = 0";
      } else if (status === "in") {
        query += " AND quantity > min_stock_level";
      }
    }

    if (search) {
      query += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    const items = await executeQuery(query, params);
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching inventory items" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const item = await request.json();

    // Validate required fields
    if (
      !item.name ||
      !item.category ||
      item.quantity === undefined ||
      !item.unit
    ) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 },
      );
    }

    const query = `
      INSERT INTO inventory_items (
        name, category, quantity, unit, min_stock_level, location, supplier, cost, description, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const params = [
      item.name,
      item.category,
      item.quantity,
      item.unit,
      item.minStockLevel || 5,
      item.location || "Main Warehouse",
      item.supplier || "Default Supplier",
      item.cost || 0,
      item.description || "",
    ];

    const result = (await executeQuery(query, params)) as any;

    if (result.affectedRows > 0) {
      return NextResponse.json({
        message: "Item added successfully",
        id: result.insertId,
      });
    } else {
      throw new Error("Failed to add item");
    }
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the item" },
      { status: 500 },
    );
  }
}
