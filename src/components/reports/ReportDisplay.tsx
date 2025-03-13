import React from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  ArrowDownToLine,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ReportData {
  title: string;
  description: string;
  data: any;
  type: "bar" | "line" | "pie" | "table";
}

interface ReportDisplayProps {
  report?: ReportData;
  isLoading?: boolean;
}

const ReportDisplay = ({
  report = {
    title: "Inventory Usage Report",
    description: "Showing usage patterns over the last 30 days",
    type: "bar",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          name: "Cement",
          values: [65, 72, 86, 68],
        },
        {
          name: "Steel",
          values: [42, 38, 55, 50],
        },
        {
          name: "Lumber",
          values: [95, 80, 75, 87],
        },
      ],
    },
  },
  isLoading = false,
}: ReportDisplayProps) => {
  const [viewMode, setViewMode] = React.useState<"chart" | "table">("chart");

  // Mock data for table view
  const tableData = report?.data?.datasets?.map((dataset: any) => ({
    item: dataset.name,
    week1: dataset.values[0],
    week2: dataset.values[1],
    week3: dataset.values[2],
    week4: dataset.values[3],
    total: dataset.values.reduce((a: number, b: number) => a + b, 0),
  }));

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96 w-full bg-muted/20">
          <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      );
    }

    switch (report?.type) {
      case "bar":
        return (
          <div className="h-96 w-full bg-muted/10 rounded-lg p-4 flex flex-col">
            <div className="flex-1 flex items-end justify-around">
              {report.data.datasets.map(
                (dataset: any, datasetIndex: number) => (
                  <div
                    key={datasetIndex}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="text-sm font-medium">{dataset.name}</div>
                    <div className="flex gap-2">
                      {dataset.values.map((value: number, index: number) => (
                        <div
                          key={index}
                          className="w-12 bg-primary hover:bg-primary/80 transition-all"
                          style={{
                            height: `${value * 2}px`,
                            backgroundColor:
                              datasetIndex === 0
                                ? "#3b82f6"
                                : datasetIndex === 1
                                  ? "#10b981"
                                  : datasetIndex === 2
                                    ? "#f59e0b"
                                    : "#6366f1",
                          }}
                          title={`${report.data.labels[index]}: ${value}`}
                        />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className="flex justify-around mt-4">
              {report.data.labels.map((label: string, index: number) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {label}
                </div>
              ))}
            </div>
          </div>
        );
      case "line":
        return (
          <div className="h-96 w-full bg-muted/10 rounded-lg p-4 flex flex-col">
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="border-t border-l border-muted/30" />
                ))}
              </div>

              {/* Line charts */}
              <svg
                className="w-full h-full"
                viewBox="0 0 400 300"
                preserveAspectRatio="none"
              >
                {report.data.datasets.map(
                  (dataset: any, datasetIndex: number) => {
                    const color =
                      datasetIndex === 0
                        ? "#3b82f6"
                        : datasetIndex === 1
                          ? "#10b981"
                          : datasetIndex === 2
                            ? "#f59e0b"
                            : "#6366f1";

                    const points = dataset.values
                      .map((value: number, index: number) => {
                        const x = (index / (dataset.values.length - 1)) * 400;
                        const y = 300 - (value / 100) * 300;
                        return `${x},${y}`;
                      })
                      .join(" ");

                    return (
                      <g key={datasetIndex}>
                        <polyline
                          points={points}
                          fill="none"
                          stroke={color}
                          strokeWidth="3"
                        />
                        {dataset.values.map((value: number, index: number) => {
                          const x = (index / (dataset.values.length - 1)) * 400;
                          const y = 300 - (value / 100) * 300;
                          return (
                            <circle
                              key={index}
                              cx={x}
                              cy={y}
                              r="5"
                              fill={color}
                            />
                          );
                        })}
                      </g>
                    );
                  },
                )}
              </svg>
            </div>
            <div className="flex justify-between mt-4">
              {report.data.labels.map((label: string, index: number) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {label}
                </div>
              ))}
            </div>
          </div>
        );
      case "pie":
        return (
          <div className="h-96 w-full bg-muted/10 rounded-lg p-4 flex items-center justify-center">
            <div className="relative h-64 w-64">
              <svg viewBox="0 0 100 100">
                {report.data.datasets[0].values.map(
                  (value: number, index: number) => {
                    const total = report.data.datasets[0].values.reduce(
                      (a: number, b: number) => a + b,
                      0,
                    );
                    const startAngle =
                      index === 0
                        ? 0
                        : report.data.datasets[0].values
                            .slice(0, index)
                            .reduce(
                              (sum: number, v: number) =>
                                sum + (v / total) * 360,
                              0,
                            );

                    const endAngle = startAngle + (value / total) * 360;

                    // Convert angles to radians and calculate coordinates
                    const startRad = ((startAngle - 90) * Math.PI) / 180;
                    const endRad = ((endAngle - 90) * Math.PI) / 180;

                    const x1 = 50 + 50 * Math.cos(startRad);
                    const y1 = 50 + 50 * Math.sin(startRad);
                    const x2 = 50 + 50 * Math.cos(endRad);
                    const y2 = 50 + 50 * Math.sin(endRad);

                    // Determine if the arc should be drawn as a large arc
                    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"];

                    return (
                      <path
                        key={index}
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={colors[index % colors.length]}
                      />
                    );
                  },
                )}
              </svg>

              {/* Legend */}
              <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-4">
                {report.data.datasets[0].values.map(
                  (value: number, index: number) => {
                    const total = report.data.datasets[0].values.reduce(
                      (a: number, b: number) => a + b,
                      0,
                    );
                    const percentage = ((value / total) * 100).toFixed(1);
                    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"];

                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: colors[index % colors.length],
                          }}
                        />
                        <span className="text-sm">
                          {report.data.labels[index]} ({percentage}%)
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-96 w-full bg-muted/10 rounded-lg p-4 flex items-center justify-center">
            <p className="text-muted-foreground">No chart type specified</p>
          </div>
        );
    }
  };

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96 w-full bg-muted/20">
          <RefreshCw className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      );
    }

    return (
      <div className="w-full overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/20">
              <th className="p-3 text-left font-medium">Item</th>
              {report?.data?.labels?.map((label: string, index: number) => (
                <th key={index} className="p-3 text-left font-medium">
                  {label}
                </th>
              ))}
              <th className="p-3 text-left font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((row: any, index: number) => (
              <tr key={index} className={index % 2 === 0 ? "bg-muted/5" : ""}>
                <td className="p-3 border-t">{row.item}</td>
                <td className="p-3 border-t">{row.week1}</td>
                <td className="p-3 border-t">{row.week2}</td>
                <td className="p-3 border-t">{row.week3}</td>
                <td className="p-3 border-t">{row.week4}</td>
                <td className="p-3 border-t font-medium">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card className="w-full h-full bg-background">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{report?.title || "Report"}</CardTitle>
            <CardDescription>
              {report?.description || "No description available"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Tabs
              defaultValue="chart"
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "chart" | "table")}
            >
              <TabsList>
                <TabsTrigger value="chart">
                  <BarChart className="h-4 w-4 mr-2" />
                  Chart
                </TabsTrigger>
                <TabsTrigger value="table">
                  <Filter className="h-4 w-4 mr-2" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "chart" ? renderChart() : renderTable()}
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <Button variant="outline" size="sm">
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportDisplay;
