"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  BarChart,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import ReportDisplay from "./ReportDisplay";

interface ReportingSystemProps {
  className?: string;
}

interface ReportFormValues {
  reportType: string;
  dateRange: string;
  category: string;
  format: string;
}

const ReportingSystem = ({ className = "" }: ReportingSystemProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<any>(null);

  const form = useForm<ReportFormValues>({
    defaultValues: {
      reportType: "inventory-usage",
      dateRange: "last-30-days",
      category: "all",
      format: "chart",
    },
  });

  const handleGenerateReport = async (data: ReportFormValues) => {
    setIsGenerating(true);

    // Simulate API call to generate report
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Set mock report data based on report type
    let reportData;

    switch (data.reportType) {
      case "inventory-usage":
        reportData = {
          title: "Inventory Usage Report",
          description: `Usage patterns for the ${data.dateRange === "last-30-days" ? "last 30 days" : "last 90 days"}`,
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
        };
        break;

      case "remaining-stock":
        reportData = {
          title: "Remaining Stock Report",
          description: "Current inventory levels by category",
          type: "pie",
          data: {
            labels: [
              "Building Materials",
              "Tools",
              "Safety Equipment",
              "Electrical",
            ],
            datasets: [
              {
                name: "Stock Levels",
                values: [45, 25, 15, 15],
              },
            ],
          },
        };
        break;

      case "procurement-efficiency":
        reportData = {
          title: "Procurement Efficiency Report",
          description: "Order fulfillment and delivery times",
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr"],
            datasets: [
              {
                name: "Order Processing Time (days)",
                values: [5, 4, 3, 2],
              },
              {
                name: "Delivery Time (days)",
                values: [8, 7, 6, 5],
              },
            ],
          },
        };
        break;

      default:
        reportData = {
          title: "Custom Report",
          description: "Custom report data",
          type: "bar",
          data: {
            labels: ["Category 1", "Category 2", "Category 3", "Category 4"],
            datasets: [
              {
                name: "Dataset 1",
                values: [25, 40, 30, 35],
              },
            ],
          },
        };
    }

    setActiveReport(reportData);
    setIsGenerating(false);
  };

  return (
    <div className={`w-full h-full bg-background p-6 ${className}`}>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reporting System</h1>
            <p className="text-muted-foreground">
              Generate and analyze inventory and procurement reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Reports
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Saved Reports
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Report Parameters</CardTitle>
              <CardDescription>
                Configure and generate your report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleGenerateReport)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="reportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="inventory-usage">
                              <div className="flex items-center">
                                <BarChart className="mr-2 h-4 w-4" />
                                <span>Inventory Usage</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="remaining-stock">
                              <div className="flex items-center">
                                <PieChart className="mr-2 h-4 w-4" />
                                <span>Remaining Stock</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="procurement-efficiency">
                              <div className="flex items-center">
                                <LineChart className="mr-2 h-4 w-4" />
                                <span>Procurement Efficiency</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Range</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select date range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="last-7-days">
                              Last 7 days
                            </SelectItem>
                            <SelectItem value="last-30-days">
                              Last 30 days
                            </SelectItem>
                            <SelectItem value="last-90-days">
                              Last 90 days
                            </SelectItem>
                            <SelectItem value="custom">Custom range</SelectItem>
                          </SelectContent>
                        </Select>
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
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="building-materials">
                              Building Materials
                            </SelectItem>
                            <SelectItem value="tools">Tools</SelectItem>
                            <SelectItem value="safety">
                              Safety Equipment
                            </SelectItem>
                            <SelectItem value="electrical">
                              Electrical
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Output Format</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="chart">Chart</SelectItem>
                            <SelectItem value="table">Table</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Report"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Quick Reports</h4>
              <div className="space-y-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    form.setValue("reportType", "inventory-usage");
                    form.setValue("dateRange", "last-30-days");
                    form.handleSubmit(handleGenerateReport)();
                  }}
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Monthly Usage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    form.setValue("reportType", "remaining-stock");
                    form.setValue("dateRange", "last-7-days");
                    form.handleSubmit(handleGenerateReport)();
                  }}
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Current Stock Levels
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    form.setValue("reportType", "procurement-efficiency");
                    form.setValue("dateRange", "last-90-days");
                    form.handleSubmit(handleGenerateReport)();
                  }}
                >
                  <LineChart className="mr-2 h-4 w-4" />
                  Procurement Trends
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="lg:col-span-3 flex flex-col">
            {activeReport ? (
              <ReportDisplay report={activeReport} isLoading={isGenerating} />
            ) : (
              <Card className="h-full flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="bg-muted/30 rounded-full p-6 inline-block">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium">No Report Generated</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure the report parameters on the left and click
                    "Generate Report" to create a new report.
                  </p>
                  <Button
                    variant="default"
                    onClick={() => form.handleSubmit(handleGenerateReport)()}
                  >
                    Generate Sample Report
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {activeReport && (
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportingSystem;
