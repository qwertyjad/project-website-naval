import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;
    const query = "SELECT * FROM inventory_items WHERE id = ?";
    const items = (await executeQuery(query, [id])) as any[];

    if (items.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(items[0]);
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the item" },
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
      UPDATE inventory_items SET
        name = ?,
        category = ?,
        quantity = ?,
        unit = ?,
        min_stock_level = ?,
        location = ?,
        supplier = ?,
        cost = ?,
        description = ?,
        last_updated = NOW()
      WHERE id = ?
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
      id,
    ];

    const result = (await executeQuery(query, params)) as any;

    if (result.affectedRows > 0) {
      return NextResponse.json({
        message: "Item updated successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Item not found or no changes made" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the item" },
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
    const query = "DELETE FROM inventory_items WHERE id = ?";
    const result = (await executeQuery(query, [id])) as any;

    if (result.affectedRows > 0) {
      return NextResponse.json({
        message: "Item deleted successfully",
      });
    } else {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the item" },
      { status: 500 },
    );
  }
}
