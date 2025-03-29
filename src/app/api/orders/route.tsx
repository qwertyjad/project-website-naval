// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json();
    
    // Update inventory (this is a simple example - adjust based on your needs)
    const updateQuery = `
      UPDATE inventory_items 
      SET quantity = quantity + ?
      WHERE id = ?
    `;
    
    await executeQuery(updateQuery, [quantity, itemId]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}