"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import TwoFactorForm from "./TwoFactorForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface AuthContainerProps {
  defaultTab?: "login" | "register";
  onAuthenticated?: () => void;
}

const AuthContainer = ({
  defaultTab = "login",
  onAuthenticated = () => {},
}: AuthContainerProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loginData, setLoginData] = useState<any>(null);

  const handleLoginSubmit = (data: any) => {
    // Store login data for reference
    setLoginData(data);
    // In a real app, this would verify credentials with the server
    // and redirect to dashboard
    onAuthenticated();
  };

  const handleRegisterSubmit = (data: any) => {
    // After successful registration, show 2FA setup
    setShowTwoFactor(true);
    // Store login data for 2FA verification
    setLoginData(data);
  };

  const handleTwoFactorVerify = async (code: string) => {
    // In a real app, this would verify the 2FA code with the server
    console.log("Verifying 2FA code:", code);
    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Simulate successful verification
    onAuthenticated();
    return true;
  };

  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card">
      {showTwoFactor ? (
        <TwoFactorForm
          onVerify={handleTwoFactorVerify}
          onCancel={handleTwoFactorCancel}
        />
      ) : (
        <>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Construction Inventory System
            </CardTitle>
            <CardDescription className="text-center">
              Secure access to your inventory management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "login" | "register")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm
                  onLogin={handleLoginSubmit}
                  onShowRegister={() => setActiveTab("register")}
                  onShowTwoFactor={() => setShowTwoFactor(true)}
                />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm
                  onSubmit={handleRegisterSubmit}
                  onLoginClick={() => setActiveTab("login")}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default AuthContainer;
