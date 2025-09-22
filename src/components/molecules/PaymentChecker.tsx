"use client";

import React, { useState } from "react";
import { Search, CreditCard, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
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
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
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
      const response = await paymentService.checkPaymentStatus(bookingId.trim());
      
      if (response.success && response.data) {
        setPaymentStatus(response.data);
        showSuccess("Payment status retrieved successfully");
      } else {
        setError(response.error || "Booking ID not found");
        showError("Not Found", response.error || "Booking ID not found");
      }
    } catch (error) {
      console.error("Error checking payment:", error);
      setError("Failed to check payment status. Please try again.");
      showError("Error", "Failed to check payment status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "FAILED":
      case "EXPIRED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FAILED":
      case "EXPIRED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleViewFullPayment = () => {
    if (paymentStatus) {
      router.push(`/payment/${paymentStatus.id}`);
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

        {/* Payment Status Result */}
        {paymentStatus && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Details
              </h3>
              <Badge className={`flex items-center space-x-1 ${getStatusColor(paymentStatus.status)}`}>
                {getStatusIcon(paymentStatus.status)}
                <span>{paymentStatus.status}</span>
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium text-gray-900">{paymentStatus.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium text-gray-900">{formatCurrency(paymentStatus.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Schedule</p>
                <p className="font-medium text-gray-900">{paymentStatus.scheduleName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {new Date(paymentStatus.date).toLocaleDateString("id-ID")} • {paymentStatus.time}
                </p>
              </div>
            </div>

            {paymentStatus.paidAt && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Paid At</p>
                <p className="font-medium text-green-600">
                  {new Date(paymentStatus.paidAt).toLocaleString("id-ID")}
                </p>
              </div>
            )}

            {paymentStatus.status === "PENDING" && paymentStatus.expiresAt && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Expires At</p>
                <p className="font-medium text-yellow-600">
                  {new Date(paymentStatus.expiresAt).toLocaleString("id-ID")}
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={handleViewFullPayment}
                className="flex-1"
              >
                View Full Details
              </Button>
              {paymentStatus.status === "PENDING" && (
                <Button
                  variant="primary"
                  onClick={handleViewFullPayment}
                  className="flex-1"
                >
                  Complete Payment
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500">
          <p>Don't have a booking ID? <a href="/schedule" className="text-blue-600 hover:text-blue-700 font-medium">Create a new booking</a></p>
        </div>
      </CardContent>
    </Card>
  );
}