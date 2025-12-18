"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Wallet,
  RefreshCcw,
  Loader2,
  Info,
  AlertCircle,
  LogIn,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/ui/shadcn/card";
import { Input } from "@/app/ui/shadcn/input";
import { Label } from "@/app/ui/shadcn/label";
import { Button } from "@/app/ui/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/shadcn/select";
import { initiateDeposit } from "@/actions/payment.action";
import { PaymentService } from "@/backend/payment/payment.services";
// import { usePaymentService } from "@/services/paymentService";

// Interface for Exchange Rate API Response
interface ExchangeRateResponse {
  rates: {
    VND: number;
  };
}

export default function DepositPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  // const paymentService = usePaymentService();

  // State
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<"VND" | "USD">("VND");
  const [exchangeRate, setExchangeRate] = useState<number>(25000); // Fallback rate
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check for payment return status
  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");

    if (status === "error") {
      toast.error(message || "Payment failed. Please try again.");
      // Clean up URL parameters
      router.replace("/my/deposit");
    } else if (status === "success") {
      toast.success(
        message || "Payment successful! Your balance has been updated."
      );
      router.replace("/my/deposit");
    }
  }, [searchParams, router]);

  // Fetch Real-time Exchange Rate on Mount
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data: ExchangeRateResponse = await res.json();
        if (data && data.rates && data.rates.VND) {
          setExchangeRate(data.rates.VND);
        }
      } catch (err) {
        console.error("Failed to fetch rates, using fallback.", err);
      } finally {
        setIsLoadingRate(false);
      }
    };
    fetchRate();
  }, []);

  // Calculation Logic
  const numericAmount = parseFloat(amount) || 0;

  const conversionResult = useMemo(() => {
    if (numericAmount <= 0) return null;
    if (currency === "VND") {
      return {
        from: "VND",
        to: "USD",
        value: (numericAmount / exchangeRate).toFixed(2),
        rate: exchangeRate,
      };
    } else {
      return {
        from: "USD",
        to: "VND",
        value: (numericAmount * exchangeRate).toFixed(0), // VND is usually integer
        rate: exchangeRate,
      };
    }
  }, [numericAmount, currency, exchangeRate]);

  // Handle Deposit Submission
  const handleDeposit = async () => {
    if (!session?.user) {
      setError("Please sign in to deposit funds.");
      return;
    }

    if (numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    // VNPay strictly requires VND amount (Integer)
    // If user inputs USD, we must send the converted VND value
    const finalAmountVND =
      currency === "VND"
        ? Math.floor(numericAmount)
        : Math.floor(numericAmount * exchangeRate);

    if (finalAmountVND < 10000) {
      setError("Minimum deposit amount is 10,000 VND.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await initiateDeposit(finalAmountVND);

      if (result.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initiate payment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while checking session
  if (status === "loading") {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-base font-medium">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!session?.user) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-500/10 rounded-full">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl">
              Authentication Required
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2">
              You need to log in to deposit funds to your wallet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full h-11 sm:h-12 text-base font-bold">
              <Link href="/login">
                <LogIn className="w-5 h-5 mr-2" />
                Log in to Continue
              </Link>
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 md:px-20">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="border-b p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl">
                Deposit Funds
              </CardTitle>
              <CardDescription className="mt-1 text-xs sm:text-sm">
                Add funds to your secure wallet instantly via VNPay.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div
            className="flex items-center justify-between px-3 py-2
              bg-secondary/50 rounded-lg text-xs font-medium border"
          >
            <div className="flex items-center gap-2">
              <RefreshCcw
                className={`w-3 h-3 ${isLoadingRate ? "animate-spin" : ""}`}
              />
              <span>Current Rate:</span>
            </div>
            <span className="font-mono">
              1 USD ≈ {exchangeRate.toLocaleString("vi-VN")} VND
            </span>
          </div>

          <div className="space-y-3">
            <Label>Enter Amount</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                placeholder={currency === "VND" ? "Min 10,000" : "Min 1.00"}
                className="h-11 sm:h-12 text-base sm:text-lg font-semibold"
              />
              <Select
                value={currency}
                onValueChange={(value) => setCurrency(value as "VND" | "USD")}
              >
                <SelectTrigger className="w-20 sm:w-24 h-11 sm:h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 sm:p-4 border">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              You will receive approximately:
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
                {conversionResult
                  ? currency === "VND"
                    ? `$${parseFloat(conversionResult.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    : `${parseFloat(conversionResult.value).toLocaleString("vi-VN")} VND`
                  : "---"}
              </span>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {currency === "VND" ? "(USD)" : "(Paying in VND)"}
              </span>
            </div>
            {currency === "USD" && (
              <p
                className="text-xs text-amber-600 dark:text-amber-500 mt-2 flex
                  items-center gap-1"
              >
                <Info className="w-3 h-3" />
                Note: VNPay will charge you in VND.
              </p>
            )}
          </div>

          {error && (
            <div
              className="p-3 rounded-md bg-destructive/10 border
                border-destructive/20 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-destructive font-medium">
                {error}
              </p>
            </div>
          )}

          <Button
            onClick={handleDeposit}
            disabled={isSubmitting || isLoadingRate}
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-bold"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Payment
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </>
            )}
          </Button>
        </CardContent>

        <CardFooter className="bg-secondary/20 border-t justify-center p-4 sm:p-6">
          <p className="text-xs text-muted-foreground text-center">
            Secured by VNPay. Your balance will be updated automatically.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
