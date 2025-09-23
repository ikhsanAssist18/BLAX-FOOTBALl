"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  QrCode,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  CreditCard,
  Calendar,
  MapPin,
  User,
  Phone,
  Pointer,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { useNotifications } from "@/components/organisms/NotificationContainer";
import { bookingService } from "@/utils/booking";
import { formatCurrency } from "@/lib/helper";
import LoadingScreen from "@/components/atoms/LoadingScreen";
import Navbar from "@/components/organisms/Navbar";

interface PaymentData {
  name: string;
  phone: string;
  bookId: string;
  total: number;
  imageBase64: string;
  status: "pending" | "settlement" | "expire";
  scheduleName?: string;
  venue?: string;
  date?: string;
  time?: string;
  bookingType?: string;
  feeGk?: number;
  feePlayer?: number;
  error?: string;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    if (params.id) {
      fetchPaymentData();
    }
  }, [params.id]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const result = await bookingService.previewPayment(params.id as string);
      setPaymentData(result);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      showError("Payment Error", "Failed to fetch payment data");
      setPaymentData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentData();
    setRefreshing(false);
    showSuccess("Data refreshed successfully");
  };

  const copyBookId = () => {
    if (paymentData?.bookId) {
      navigator.clipboard.writeText(paymentData.bookId);
      showSuccess("Copied", "Book ID copied to clipboard");
    }
  };

  const getStatusDisplay = () => {
    if (!paymentData) return null;

    switch (paymentData.status) {
      case "pending":
        return {
          icon: <Clock className="w-6 h-6 text-yellow-500" />,
          title: "Payment Pending",
          description: "Please complete your payment using the QR code below",
          color: "border-yellow-200 bg-yellow-50",
          textColor: "text-yellow-800",
        };
      case "settlement":
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          title: "Payment Successful",
          description: "Your payment has been confirmed successfully",
          color: "border-green-200 bg-green-50",
          textColor: "text-green-800",
        };
      case "expire":
        return {
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          title: "Payment Expired",
          description:
            "This payment link has expired. Please create a new booking.",
          color: "border-red-200 bg-red-50",
          textColor: "text-red-800",
        };
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-gray-500" />,
          title: "Unknown Status",
          description: "Unable to determine payment status",
          color: "border-gray-200 bg-gray-50",
          textColor: "text-gray-800",
        };
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingScreen message="Loading payment information..." />
      </>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Navbar />
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Payment Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The payment information could not be loaded. Please check your
              payment ID and try again.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Go Back
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push("/")}
                className="flex-1"
              >
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If payment status is expired, show only the expired card
  if (paymentData.status === "expire") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payment Information
              </h1>
              <p className="text-gray-600">
                Complete your booking payment securely
              </p>
            </div>
          </div>

          {/* Expired Card */}
          <div className="flex items-center justify-center">
            <Card className="border-red-200 bg-red-50 max-w-md w-full">
              <CardContent className="p-8 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Payment Expired
                </h3>
                <p className="text-red-700 mb-6">
                  This payment link has expired. Please create a new booking to
                  continue.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/schedule")}
                    className="flex-1 border-red-300 text-red-700 hover:bg-red-100"
                  >
                    New Booking
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => router.push("/")}
                    className="flex-1"
                  >
                    Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/80 backdrop-blur-sm text-slate-700 border border-blue-100 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Information
            </h1>
            <p className="text-gray-600">
              Complete your booking payment securely
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card className={`mb-8 ${statusDisplay?.color}`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              {statusDisplay?.icon}
              <div>
                <h3
                  className={`text-lg font-semibold ${statusDisplay?.textColor}`}
                >
                  {statusDisplay?.title}
                </h3>
                <p className={`text-sm ${statusDisplay?.textColor}`}>
                  {statusDisplay?.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Details */}
          <div className="space-y-6">
            {/* Booking ID Card */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-800">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white p-3 rounded border border-yellow-300">
                    <div>
                      <p className="text-sm text-yellow-700 font-medium">
                        Booking ID
                      </p>
                      <span className="text-lg font-mono font-bold text-gray-800">
                        {paymentData.bookId}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyBookId}
                      className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="text-sm text-yellow-700 leading-relaxed">
                    <strong>📝 Important:</strong> Save your booking ID as proof
                    of payment or provide it to admin if payment fails.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <User className="w-5 h-5 mr-2" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{paymentData.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Pointer className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{paymentData.venue}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{paymentData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">
                      Amount:{" "}
                      <strong>{formatCurrency(paymentData.total)}</strong>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Details (if available) */}
            {paymentData.scheduleName && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {paymentData.scheduleName}
                      </p>
                    </div>
                    {paymentData.venue && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-700">
                          {paymentData.venue}
                        </span>
                      </div>
                    )}
                    {paymentData.date && paymentData.time && (
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-700">
                          {new Date(paymentData.date).toLocaleDateString(
                            "id-ID"
                          )}{" "}
                          • {paymentData.time} WIB
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* QR Code Section */}
          <div className="space-y-6">
            {paymentData.status === "pending" && paymentData.imageBase64 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <QrCode className="w-5 h-5 mr-2" />
                    Payment QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 inline-block mb-4">
                    <img
                      src={paymentData.imageBase64}
                      alt="QRIS Code"
                      className="w-64 h-64 mx-auto"
                      onError={(e) => {
                        console.error("Failed to load QRIS image");
                        showError("Image Error", "Failed to load QRIS code");
                      }}
                    />
                  </div>
                  <p className="text-green-700 mb-4">
                    Scan this QR code with your mobile banking or e-wallet app
                  </p>
                  <div className="text-sm text-green-600 space-y-1">
                    <p>• Open your banking/e-wallet app</p>
                    <p>• Select QR payment or scan feature</p>
                    <p>• Point camera at the QR code above</p>
                    <p>• Confirm payment amount and complete transaction</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentData.status === "settlement" && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-green-700 mb-6">
                    Your payment has been confirmed. Please contact admin and
                    check lineup regularly.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => router.push("/dashboard")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="w-full"
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing..." : "Refresh Status"}
              </Button>

              <Button
                onClick={() => router.push("/")}
                variant="primary"
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-8 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Payment Issues
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• QR code not working? Try refreshing the page</li>
                  <li>• Payment failed? Contact our support team</li>
                  <li>• Keep your booking ID for reference</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Contact Support
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📞 Phone: +62 21 1234 5678</p>
                  <p>📧 Email: support@blaxfootball.com</p>
                  <p>💬 WhatsApp: +62 812 3456 7890</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
