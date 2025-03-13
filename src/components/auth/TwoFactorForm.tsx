import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { CheckCircle, XCircle, Loader } from "lucide-react";

interface TwoFactorFormProps {
  onVerify?: (code: string) => Promise<boolean>;
  onCancel?: () => void;
  isOpen?: boolean;
}

const TwoFactorForm = ({
  onVerify = async () => true,
  onCancel = () => {},
  isOpen = true,
}: TwoFactorFormProps) => {
  const [code, setCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const { toast } = useToast();

  // Handle code input change
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    // Reset verification status when user starts typing again
    if (verificationStatus !== "idle") {
      setVerificationStatus("idle");
    }
  };

  // Handle verification submission
  const handleVerify = async () => {
    if (code.length < 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Get email from localStorage (set during login or registration)
      const email = localStorage.getItem("tempEmail");

      if (!email) {
        throw new Error("Email not found. Please try logging in again.");
      }

      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Verification failed");
      }

      // Store auth token
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.removeItem("tempEmail");

      // Redirect to dashboard after successful verification
      window.location.href = "/dashboard";

      setVerificationStatus("success");
      toast({
        title: "Verification Successful",
        description: "You have been successfully authenticated.",
      });

      // Call the onVerify callback (which will redirect to dashboard)
      const success = await onVerify(code);
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      toast({
        title: "Verification Error",
        description: "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-md mx-auto bg-card">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          Two-Factor Authentication
        </CardTitle>
        <CardDescription className="text-center">
          Enter the 6-digit code from your authenticator app to verify your
          identity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={code}
                onChange={handleCodeChange}
                className="text-center text-lg tracking-widest"
                disabled={isVerifying || verificationStatus === "success"}
              />
              {verificationStatus === "success" && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
              )}
              {verificationStatus === "error" && (
                <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
              )}
            </div>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            The code expires in 5 minutes. If you don't have access to your
            authenticator app, please contact support.
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isVerifying}>
          Cancel
        </Button>
        <Button
          onClick={handleVerify}
          disabled={
            code.length < 6 || isVerifying || verificationStatus === "success"
          }
        >
          {isVerifying ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Verifying
            </>
          ) : verificationStatus === "success" ? (
            "Verified"
          ) : (
            "Verify"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TwoFactorForm;
