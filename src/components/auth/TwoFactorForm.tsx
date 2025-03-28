import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Add this for routing
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
  const [isResending, setIsResending] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");
  const { toast } = useToast();
  const router = useRouter(); // For redirecting

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("OTP input:", e.target.value);
    setCode(e.target.value);
    if (verificationStatus !== "idle") setVerificationStatus("idle");
  };

  const handleVerify = async () => {
    console.log("Verify clicked with OTP:", code);
    if (code.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const email = localStorage.getItem("tempEmail");
      console.log("Verifying:", { email, code });

      if (!email) throw new Error("Email not found. Please register again.");

      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.json();
      console.log("API response:", { status: response.status, result });

      if (!response.ok) throw new Error(result.error || "Verification failed");

      localStorage.setItem("authToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.removeItem("tempEmail");

      setVerificationStatus("success");
      toast({
        title: "Verification Successful",
        description: "Your OTP has been verified. Logging you in...",
      });

      await onVerify(code); // Call parent callback
      router.push("/dashboard"); // Redirect to logged-in page
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid or expired OTP",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    console.log("Resend OTP clicked");
    setIsResending(true);
    try {
      const email = localStorage.getItem("tempEmail");
      if (!email) throw new Error("Email not found. Please register again.");

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resend: true }),
      });

      const result = await response.json();
      console.log("Resend response:", result);

      if (!response.ok) throw new Error(result.error || "Failed to resend OTP");

      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
      });
      setVerificationStatus("idle");
      setCode("");
    } catch (error) {
      console.error("Resend error:", error);
      toast({
        title: "Resend Failed",
        description: error instanceof Error ? error.message : "Could not resend OTP",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-md mx-auto bg-card">
      <CardHeader>
        <CardTitle className="text-xl text-center">Verify OTP</CardTitle>
        <CardDescription className="text-center">
          Enter the 6-digit OTP sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={code}
              onChange={handleCodeChange}
              className="text-center text-lg tracking-widest"
              disabled={isVerifying || isResending || verificationStatus === "success"}
            />
            {verificationStatus === "success" && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
            )}
            {verificationStatus === "error" && (
              <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 h-5 w-5" />
            )}
          </div>
          <div className="text-sm text-muted-foreground text-center">
            The OTP expires in 15 minutes. Check your email (including spam/junk).
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isVerifying || isResending}>
          Cancel
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isVerifying || isResending || verificationStatus === "success"}
          >
            {isResending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Resending
              </>
            ) : (
              "Resend OTP"
            )}
          </Button>
          <Button
            onClick={handleVerify}
            disabled={code.length !== 6 || isVerifying || isResending || verificationStatus === "success"}
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default TwoFactorForm;