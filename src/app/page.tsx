"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Package, Shield, Database, Users, CheckCircle } from "lucide-react";
import AuthContainer from "@/components/auth/AuthContainer";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    // In a real app, this would redirect to the dashboard
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ConstructInv</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#benefits"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Benefits
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-12 md:py-0">
        <div className="w-full max-w-md md:w-1/2 md:max-w-xl md:pr-12 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Construction Inventory Management System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            A comprehensive solution for tracking materials, tools, and
            equipment in real-time with secure authentication and detailed
            reporting.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Real-time Inventory Tracking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monitor stock levels and receive low stock alerts instantly
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium">
                  Secure Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Protect your inventory data with advanced security measures
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Comprehensive Reporting</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate detailed reports on usage, stock levels, and
                  procurement
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md md:w-1/2">
          <AuthContainer
            defaultTab="login"
            onAuthenticated={handleAuthenticated}
          />
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Inventory Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track materials, tools, and equipment with detailed
                categorization and location tracking.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                Secure Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Protect your data with user registration, login, and two-factor
                verification.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Procurement System</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create and track purchase orders with supplier information and
                delivery status.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Team Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enable multiple team members to manage inventory with role-based
                permissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Benefits for Your Business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  30%
                </span>
              </div>
              <h3 className="text-xl font-medium mb-2">
                Reduce Material Waste
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Better tracking leads to less overordering and reduced material
                waste on job sites.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  25%
                </span>
              </div>
              <h3 className="text-xl font-medium mb-2">
                Save Time on Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Automated tracking and alerts save hours of manual inventory
                management each week.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  40%
                </span>
              </div>
              <h3 className="text-xl font-medium mb-2">
                Improve Project Planning
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Better visibility into available resources leads to more
                accurate project timelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 bg-primary text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Optimize Your Inventory?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Sign up today and start managing your construction inventory more
            efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#top"
              className="bg-white text-primary font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Create an Account
            </a>
            <a
              href="mailto:contact@constructinv.com"
              className="bg-primary-foreground text-primary-foreground bg-opacity-20 font-medium py-3 px-6 rounded-lg hover:bg-opacity-30 transition-colors border border-white/20"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Package className="h-5 w-5" />
              <span className="font-bold">ConstructInv</span>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} ConstructInv. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
