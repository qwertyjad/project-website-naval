"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface LoginFormProps {
  onLogin?: (data: LoginFormValues) => void;
  onShowRegister?: () => void;
  onShowTwoFactor?: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = ({
  onLogin = () => {},
  onShowRegister = () => {},
  onShowTwoFactor = () => {},
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      // Store email for 2FA if needed
      localStorage.setItem("tempEmail", data.email);

      // Store auth info and proceed directly to dashboard on login
      localStorage.setItem("authToken", "logged-in");
      localStorage.setItem("user", JSON.stringify(result.user));
      // After successful login, call the onLogin callback
      onLogin(data);
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Login failed: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        className="pl-10"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button variant="link" className="px-0" type="button">
                Forgot password?
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative flex items-center w-full">
          <div className="flex-grow border-t border-muted"></div>
          <span className="mx-4 text-sm text-muted-foreground">or</span>
          <div className="flex-grow border-t border-muted"></div>
        </div>
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={onShowRegister}
        >
          Create an account
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
