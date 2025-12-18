"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogIn,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/ui/shadcn/card";
import { Button } from "@/app/ui/shadcn/button";
import { verifyVnPayCallback } from "@/actions/payment.action";
// import { usePaymentService } from "@/services/paymentService";

export default function PaymentReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  // const paymentService = usePaymentService();
  const hasProcessed = useRef(false);

  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | "error"
  >("error");
  const [message, setMessage] = useState("");
  const [transactionDetails, setTransactionDetails] = useState<{
    amount?: number;
    convertedAmount?: number;
    exchangeRate?: number;
    description?: string;
  }>({});

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processPaymentReturn = async () => {
      try {
        // Get VNPay parameters
        const vnpResponseCode = searchParams.get("vnp_ResponseCode");
        const vnpTransactionStatus = searchParams.get("vnp_TransactionStatus");

        // Check response code and verify with backend
        // 00: Success
        // 24: Customer cancelled transaction
        // Other codes: Failed
        if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
          // Call backend to verify and process payment
          try {
            // Convert searchParams to query string
            const params = new URLSearchParams();
            searchParams.forEach((value, key) => {
              params.append(key, value);
            });
            const queryString = params.toString();

            const result = await verifyVnPayCallback(queryString);
            const data = result.data;
            // Store transaction details from backend response
            setTransactionDetails({
              amount: data?.amount,
              convertedAmount: data?.convertedAmount,
              exchangeRate: data?.exchangeRate,
              description: data?.description,
            });

            if (data?.status === "SUCCESS") {
              setPaymentStatus("success");
              setMessage("Payment successful! Your balance has been updated.");
              toast.success("Payment completed successfully!");
            } else {
              setPaymentStatus("failed");
              setMessage(
                data?.description ||
                  "Payment verification failed. Please contact support."
              );
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            setPaymentStatus("error");
            setMessage(
              error instanceof Error
                ? error.message
                : "Error verifying payment. Please contact support."
            );
            toast.error("Payment verification error");
          }
        } else if (vnpResponseCode === "24") {
          setPaymentStatus("failed");
          setMessage("Transaction was cancelled by user.");
          toast.error("Payment cancelled");
        } else {
          setPaymentStatus("failed");
          setMessage(`Payment failed. Error code: ${vnpResponseCode}`);
          toast.error("Payment failed. Please try again.");
        }
      } catch (error) {
        console.error("Error processing payment return:", error);
        setPaymentStatus("error");
        setMessage("An error occurred while processing your payment.");
        toast.error("Failed to process payment return");
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentReturn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReturnToDeposit = () => {
    router.push("/deposit");
  };

  const handleGoToWallet = () => {
    router.push("/my/wallet/overview");
  };

  // Loading state while checking session
  if (status === "loading") {
    return (
      <div className="w-full min-h-[60vh] sm:min-h-screen flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-10 sm:py-12">
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-primary mb-4" />
            <p className="text-base sm:text-lg font-medium">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!session?.user) {
    return (
      <div className="w-full min-h-[60vh] sm:min-h-screen flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center p-4 sm:p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-500/10 rounded-full">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl">
              Authentication Required
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2">
              You need to log in to view payment status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
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

  if (isProcessing) {
    return (
      <div className="w-full min-h-[60vh] sm:min-h-screen flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-10 sm:py-12">
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-primary mb-4" />
            <p className="text-base sm:text-lg font-medium">
              Processing payment...
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
              Please wait while we verify your transaction
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[60vh] sm:min-h-screen flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center p-4 sm:p-6">
          <div className="flex justify-center mb-4">
            {paymentStatus === "success" ? (
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
              </div>
            ) : paymentStatus === "failed" ? (
              <div className="p-3 bg-amber-500/10 rounded-full">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500" />
              </div>
            ) : (
              <div className="p-3 bg-destructive/10 rounded-full">
                <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-destructive" />
              </div>
            )}
          </div>
          <CardTitle className="text-xl sm:text-2xl">
            {paymentStatus === "success"
              ? "Payment Successful"
              : paymentStatus === "failed"
                ? "Payment Cancelled"
                : "Payment Failed"}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base mt-2">
            {message}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* Transaction Details */}
          {(transactionDetails.amount ||
            transactionDetails.convertedAmount) && (
            <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-xs sm:text-sm">
                Transaction Details
              </h3>
              {transactionDetails.amount && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    {transactionDetails.amount.toLocaleString()} VND
                  </span>
                </div>
              )}
              {transactionDetails.convertedAmount && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">
                    Converted Amount:
                  </span>
                  <span className="font-medium">
                    ${transactionDetails.convertedAmount.toFixed(2)}
                  </span>
                </div>
              )}
              {transactionDetails.exchangeRate && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <span className="font-medium">
                    {transactionDetails.exchangeRate.toLocaleString()} VND/USD
                  </span>
                </div>
              )}
              {transactionDetails.description && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Description:</span>
                  <span className="font-medium text-right max-w-[60%]">
                    {transactionDetails.description}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3">
            {paymentStatus === "success" ? (
              <>
                <Button
                  onClick={handleGoToWallet}
                  className="w-full h-10 sm:h-11"
                  size="lg"
                >
                  Go to Wallet
                </Button>
                <Button
                  onClick={handleReturnToDeposit}
                  variant="outline"
                  className="w-full h-10 sm:h-11"
                  size="lg"
                >
                  Make Another Deposit
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleReturnToDeposit}
                  className="w-full h-10 sm:h-11"
                  size="lg"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleGoToWallet}
                  variant="outline"
                  className="w-full h-10 sm:h-11"
                  size="lg"
                >
                  Back to Wallet
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
