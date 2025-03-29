import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

// Define the type for our low stock item
interface LowStockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  status: "critical" | "low";
}

export async function GET() {
  try {
    const lowStockItemsQuery = `
      SELECT 
        id,
        name,
        category,
        quantity as currentStock,
        min_stock_level as minimumStock,
        unit,
        CASE 
          WHEN quantity = 0 THEN 'critical'
          WHEN quantity <= min_stock_level THEN 'low'
          ELSE 'normal'
        END as status
      FROM inventory_items 
      WHERE quantity <= min_stock_level
      ORDER BY status ASC, quantity ASC
    `;
    
    // Explicitly type the query result
    const lowStockItems = await executeQuery(lowStockItemsQuery) as LowStockItem[];

    // Type assertion to ensure we have an array
    const itemsArray = Array.isArray(lowStockItems) ? lowStockItems : [];

    return NextResponse.json({
      items: itemsArray,
      totalCritical: itemsArray.filter(item => item.status === 'critical').length,
      totalLow: itemsArray.filter(item => item.status === 'low').length
    });
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching low stock data" },
      { status: 500 }
    );
  }
}