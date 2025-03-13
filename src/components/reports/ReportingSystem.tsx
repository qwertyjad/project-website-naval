"use client";

import React, { useState, useEffect } from "react";
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
import Sidebar from "../layout/Sidebar";

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

    try {
      // Make API call to generate report
      const queryParams = new URLSearchParams({
        type: data.reportType,
        range: data.dateRange,
        category: data.category,
      }).toString();

      const response = await fetch(`/api/reports?${queryParams}`);

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const reportData = await response.json();
      setActiveReport(reportData);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
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
                              <SelectItem value="custom">
                                Custom range
                              </SelectItem>
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
                              <SelectItem value="all">
                                All Categories
                              </SelectItem>
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
    </div>
  );
};

export default ReportingSystem;
