"use client";

import React, { useState } from "react";
import {
  Search,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import Badge from "../atoms/Badge";
import { useNotifications } from "../organisms/NotificationContainer";
import { paymentService } from "@/utils/payment";
import { PaymentStatus } from "@/types/payment";
import { formatCurrency } from "@/lib/helper";
import { useRouter } from "next/navigation";

export default function PaymentChecker() {
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [error, setError] = useState("");
  const { showSuccess, showError } = useNotifications();
  const router = useRouter();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingId.trim()) {
      setError("Please enter a booking ID");
      return;
    }

    setLoading(true);
    setError("");
    setPaymentStatus(null);

    try {
      const response = await paymentService.checkPaymentStatus(
        bookingId.trim()
      );
      console.log("response", response);

      if (response.data.status) {
        setPaymentStatus(response.data.status);
        showSuccess("Payment status retrieved successfully");

        // Auto-redirect to payment page
        handleViewFullPayment(response.data.status.id);
      } else {
        setError("Booking ID not found");
        showError("Booking ID not found");
      }
    } catch (error: any) {
      // console.error("Error checking payment:", error);
      setError("Failed to check payment status. Please try again.");
      showError("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFullPayment = (paymentId?: string) => {
    const id = paymentId || paymentStatus?.id;
    if (id) {
      router.push(`/payment/${id}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-center justify-center">
          <CreditCard className="w-6 h-6 mr-2" />
          Check Payment Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Form */}
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your Booking ID
            </label>
            <div className="relative">
              <Input
                type="text"
                value={bookingId}
                onChange={(e) => {
                  setBookingId(e.target.value);
                  setError("");
                  setPaymentStatus(null);
                }}
                placeholder="e.g., BK-2025-001"
                className={error ? "border-red-500" : ""}
                icon={<Search className="h-5 w-5 text-gray-400" />}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading || !bookingId.trim()}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Checking...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Check Payment Status
              </>
            )}
          </Button>
        </form>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Don't have a booking ID?{" "}
            <a
              href="/schedule"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create a new booking
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
