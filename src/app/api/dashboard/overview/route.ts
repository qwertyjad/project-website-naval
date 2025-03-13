import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    // Get total items count
    const totalItemsQuery = "SELECT COUNT(*) as count FROM inventory_items";
    const totalItemsResult = (await executeQuery(totalItemsQuery)) as any[];
    const totalItems = totalItemsResult[0].count;

    // Get total categories count
    const categoriesQuery =
      "SELECT COUNT(DISTINCT category) as count FROM inventory_items";
    const categoriesResult = (await executeQuery(categoriesQuery)) as any[];
    const totalCategories = categoriesResult[0].count;

    // Get inventory value
    const valueQuery =
      "SELECT SUM(quantity * cost) as total FROM inventory_items";
    const valueResult = (await executeQuery(valueQuery)) as any[];
    const inventoryValue = valueResult[0].total || 0;

    // Get low stock count
    const lowStockQuery =
      "SELECT COUNT(*) as count FROM inventory_items WHERE quantity <= min_stock_level";
    const lowStockResult = (await executeQuery(lowStockQuery)) as any[];
    const lowStockCount = lowStockResult[0].count;

    // Get low stock items
    const lowStockItemsQuery = `
      SELECT id, name, category, quantity as currentStock, min_stock_level as minimumStock, unit,
      CASE 
        WHEN quantity = 0 THEN 'critical'
        WHEN quantity <= min_stock_level THEN 'low'
        ELSE 'normal'
      END as status
      FROM inventory_items 
      WHERE quantity <= min_stock_level
      ORDER BY status ASC, quantity ASC
      LIMIT 5
    `;
    const lowStockItems = await executeQuery(lowStockItemsQuery);

    // Get category breakdown for inventory status
    const categoryBreakdownQuery = `
      SELECT category, SUM(quantity) as value
      FROM inventory_items
      GROUP BY category
      ORDER BY value DESC
      LIMIT 5
    `;
    const categoryBreakdown = (await executeQuery(
      categoryBreakdownQuery,
    )) as any[];

    // Calculate stock health percentage
    const healthQuery = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN quantity > min_stock_level THEN 1 ELSE 0 END) as healthy
      FROM inventory_items
    `;
    const healthResult = (await executeQuery(healthQuery)) as any[];
    const total = healthResult[0].total || 0;
    const healthy = healthResult[0].healthy || 0;
    const stockHealth = total > 0 ? Math.round((healthy / total) * 100) : 100;

    // Assign colors to categories
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
    const categories = categoryBreakdown.map((item, index) => ({
      name: item.category,
      value: item.value,
      color: colors[index % colors.length],
    }));

    return NextResponse.json({
      totalItems,
      totalCategories,
      inventoryValue,
      lowStockCount,
      lowStockItems,
      categories,
      stockHealth,
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching dashboard data" },
      { status: 500 },
    );
  }
}
