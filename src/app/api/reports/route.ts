import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get("type") || "inventory-usage";
    const dateRange = searchParams.get("range") || "last-30-days";
    const category = searchParams.get("category") || "all";

    let startDate;
    const endDate = new Date();

    // Calculate start date based on range
    switch (dateRange) {
      case "last-7-days":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "last-90-days":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "last-30-days":
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
    }

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    let reportData;
    switch (reportType) {
      case "inventory-usage":
        reportData = await getInventoryUsageReport(
          formattedStartDate,
          formattedEndDate,
          category,
        );
        break;
      case "remaining-stock":
        reportData = await getRemainingStockReport(category);
        break;
      case "procurement-efficiency":
        reportData = await getProcurementEfficiencyReport(
          formattedStartDate,
          formattedEndDate,
        );
        break;
      default:
        reportData = await getInventoryUsageReport(
          formattedStartDate,
          formattedEndDate,
          category,
        );
    }

    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the report" },
      { status: 500 },
    );
  }
}

async function getInventoryUsageReport(
  startDate: string,
  endDate: string,
  category: string,
) {
  // In a real app, this would query actual usage data
  // For this example, we'll return mock data

  // Get weeks between start and end date
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.ceil(diffDays / 7);

  const labels = [];
  for (let i = 1; i <= weeks; i++) {
    labels.push(`Week ${i}`);
  }

  // Get top materials from inventory
  let query = "SELECT name, category FROM inventory_items";
  const params = [];

  if (category && category !== "all") {
    query += " WHERE category = ?";
    params.push(category);
  }

  query += " ORDER BY quantity DESC LIMIT 3";

  const items = (await executeQuery(query, params)) as any[];

  const datasets = items.map((item) => {
    const values = [];
    for (let i = 0; i < weeks; i++) {
      // Generate random usage between 30 and 100
      values.push(Math.floor(Math.random() * 70) + 30);
    }
    return {
      name: item.name,
      values,
    };
  });

  return {
    title: "Inventory Usage Report",
    description: `Usage patterns from ${startDate} to ${endDate}`,
    type: "bar",
    data: {
      labels,
      datasets,
    },
  };
}

async function getRemainingStockReport(category: string) {
  let query = "SELECT category, SUM(quantity) as total FROM inventory_items";
  const params = [];

  if (category && category !== "all") {
    query += " WHERE category = ?";
    params.push(category);
  }

  query += " GROUP BY category ORDER BY total DESC";

  const results = (await executeQuery(query, params)) as any[];

  const labels = results.map((item) => item.category);
  const values = results.map((item) => item.total);

  return {
    title: "Remaining Stock Report",
    description: "Current inventory levels by category",
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          name: "Stock Levels",
          values,
        },
      ],
    },
  };
}

async function getProcurementEfficiencyReport(
  startDate: string,
  endDate: string,
) {
  // In a real app, this would calculate actual procurement metrics
  // For this example, we'll return mock data

  // Get months between start and end date
  const start = new Date(startDate);
  const end = new Date(endDate);

  const months = [];
  const currentDate = new Date(start);
  while (currentDate <= end) {
    months.push(
      new Date(currentDate).toLocaleString("default", { month: "short" }),
    );
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Generate random efficiency data
  const processingTimes = [];
  const deliveryTimes = [];

  for (let i = 0; i < months.length; i++) {
    // Random processing time between 1 and 5 days
    processingTimes.push(Math.floor(Math.random() * 5) + 1);
    // Random delivery time between 3 and 10 days
    deliveryTimes.push(Math.floor(Math.random() * 8) + 3);
  }

  return {
    title: "Procurement Efficiency Report",
    description: "Order processing and delivery times",
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          name: "Order Processing Time (days)",
          values: processingTimes,
        },
        {
          name: "Delivery Time (days)",
          values: deliveryTimes,
        },
      ],
    },
  };
}
