"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // Add this for routing
import { Eye, EyeOff, Mail, User, Lock, Building } from "lucide-react";
import { Button } from "../ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";
import TwoFactorForm from "./TwoFactorForm";

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormValues) => void;
  onLoginClick?: () => void;
  loading?: boolean;
}

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  agreeToTerms: boolean;
}

const RegisterForm = ({
  onSubmit = () => {},
  onLoginClick = () => {},
  loading = false,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); // For redirecting

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      companyName: "",
      agreeToTerms: false,
    },
    mode: "onSubmit",
  });

  const handleSubmit = async (data: RegisterFormValues) => {
    try {
      if (step === 1) {
        const step1Valid = await form.trigger(["fullName", "email", "password"]);
        if (!step1Valid) return;
        setStep(2);
      } else if (step === 2) {
        const step2Valid = await form.trigger(["companyName", "agreeToTerms"]);
        if (!step2Valid) return;
        if (!data.agreeToTerms) {
          form.setError("agreeToTerms", {
            type: "manual",
            message: "You must agree to the terms of service",
          });
          return;
        }

        console.log("Sending registration request:", data);
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("Registration response:", result);

        if (!response.ok) throw new Error(result.error || "Failed to register");

        localStorage.setItem("tempEmail", data.email);
        setShowOtpForm(true);
        toast({
          title: "OTP Sent",
          description: "Please check your email for the OTP.",
        });
      }
    } catch (error) {
      console.error("Error in step", step, ":", error);
      form.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleOtpVerify = async (otp: string) => {
    console.log("OTP verification succeeded with:", otp);
    // Call onSubmit with form data and redirect
    onSubmit(form.getValues());
    router.push("/dashboard"); // Redirect to dashboard or logged-in page
    return true;
  };

  const handleOtpCancel = () => {
    setShowOtpForm(false);
  };

  if (showOtpForm) {
    return (
      <TwoFactorForm
        onVerify={handleOtpVerify}
        onCancel={handleOtpCancel}
        isOpen={showOtpForm}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {step === 1 ? "Create an Account" : "Company Information"}
        </CardTitle>
        <CardDescription className="text-center">
          {step === 1
            ? "Enter your details to register"
            : "Tell us about your construction business"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="fullName"
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="John Doe" {...field} className="pl-10" />
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                            className="pl-10"
                          />
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="pl-10"
                          />
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-9 w-9"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>Password must be at least 8 characters long</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="companyName"
                  rules={{ required: "Company name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Your Construction Company"
                            {...field}
                            className="pl-10"
                          />
                          <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  rules={{ required: "You must agree to the terms" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to the terms of service and privacy policy</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {form.formState.errors.root && (
              <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
            )}
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Processing..." : step === 1 ? "Continue" : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="text-center text-sm">
          {step === 1 ? (
            <p>
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={onLoginClick}
                className="p-0 h-auto font-semibold"
              >
                Sign in
              </Button>
            </p>
          ) : (
            <Button variant="outline" onClick={() => setStep(1)} className="w-full">
              Back
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;