"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
  User,
  DollarSign,
  Hash,
  FileText,
} from "lucide-react";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../atoms/Dialog";
import { useNotifications } from "./NotificationContainer";
import { formatCurrency, formatDate } from "@/lib/helper";
import LoadingSpinner from "../atoms/LoadingSpinner";

interface BookingDetail {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  scheduleId: string;
  scheduleName: string;
  venue: string;
  address: string;
  date: string;
  time: string;
  typeEvent: string;
  typeMatch: string;
  bookingType: "INDIVIDUAL" | "TEAM";
  playerCount: number;
  isPlayer: boolean;
  isGk: boolean;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  bookingStatus: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "PENDING";
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  paymentId?: string;
  notes?: string;
  facilities: Array<{ name: string }>;
  rules: Array<{ description: string }>;
}

interface BookingHistoryDetailProps {
  bookingId: string;
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

// Mock data for demonstration
const mockBookingDetail: BookingDetail = {
  id: "booking_123",
  bookingId: "BK-2025-001",
  customerName: "John Doe",
  customerPhone: "08123456789",
  customerEmail: "john.doe@email.com",
  scheduleId: "schedule_456",
  scheduleName: "Fun Game Weekday",
  venue: "Lapangan Futsal Central",
  address: "Jl. Sudirman No. 123, Jakarta Pusat",
  date: "2025-01-20",
  time: "19:00",
  typeEvent: "Open",
  typeMatch: "Futsal",
  bookingType: "INDIVIDUAL",
  playerCount: 2,
  isPlayer: true,
  isGk: false,
  totalAmount: 150000,
  paymentStatus: "PAID",
  bookingStatus: "CONFIRMED",
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2025-01-15T10:35:00Z",
  paymentMethod: "QRIS",
  paymentId: "PAY-2025-001",
  notes: "Booking untuk 2 pemain reguler",
  facilities: [
    { name: "Air Mineral" },
    { name: "Rompi" },
    { name: "Bola" },
    { name: "Shower" },
  ],
  rules: [
    { description: "Datang 15 menit sebelum pertandingan dimulai" },
    { description: "Wajib menggunakan sepatu futsal" },
    { description: "Dilarang merokok di area lapangan" },
  ],
};

export default function BookingHistoryDetail({
  bookingId,
  open,
  onClose,
  onRefresh,
}: BookingHistoryDetailProps) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    if (open) {
      fetchBookingDetail();
    }
  }, [bookingId, open]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, fetch from API
      // const response = await bookingService.getBookingDetail(bookingId);
      setBooking(mockBookingDetail);
    } catch (error) {
      console.error("Error fetching booking detail:", error);
      showError("Error", "Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookingDetail();
    setRefreshing(false);
    showSuccess("Data refreshed successfully");
    onRefresh?.();
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download functionality
    showSuccess("Receipt downloaded successfully");
  };

  const getStatusColor = (status: string, type: "payment" | "booking") => {
    if (type === "payment") {
      switch (status) {
        case "PAID":
          return "bg-green-100 text-green-800 border-green-200";
        case "PENDING":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "FAILED":
          return "bg-red-100 text-red-800 border-red-200";
        case "EXPIRED":
          return "bg-gray-100 text-gray-800 border-gray-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    } else {
      switch (status) {
        case "CONFIRMED":
          return "bg-green-100 text-green-800 border-green-200";
        case "PENDING":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "CANCELLED":
          return "bg-red-100 text-red-800 border-red-200";
        case "COMPLETED":
          return "bg-blue-100 text-blue-800 border-blue-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
  };

  const getStatusIcon = (status: string, type: "payment" | "booking") => {
    if (type === "payment") {
      switch (status) {
        case "PAID":
          return <CheckCircle className="w-4 h-4" />;
        case "PENDING":
          return <Clock className="w-4 h-4" />;
        case "FAILED":
        case "EXPIRED":
          return <XCircle className="w-4 h-4" />;
        default:
          return <AlertCircle className="w-4 h-4" />;
      }
    } else {
      switch (status) {
        case "CONFIRMED":
        case "COMPLETED":
          return <CheckCircle className="w-4 h-4" />;
        case "PENDING":
          return <Clock className="w-4 h-4" />;
        case "CANCELLED":
          return <XCircle className="w-4 h-4" />;
        default:
          return <AlertCircle className="w-4 h-4" />;
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-4xl p-0 max-h-[90vh] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Loading booking details..." />
          </div>
        ) : !booking ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Booking Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              The booking details could not be loaded.
            </p>
            <Button onClick={onClose} variant="primary">
              Close
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <DialogHeader className="flex items-center justify-between border-b border-gray-200 mb-0">
              <div className="flex items-center space-x-4">
                <Button size="sm" variant="outline" onClick={onClose}>
                  Close
                </Button>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">
                    Booking Details
                  </DialogTitle>
                  <p className="text-sm text-gray-600">
                    Booking ID: {booking.bookingId}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      refreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
                <Button
                  variant="black"
                  size="sm"
                  onClick={handleDownloadReceipt}
                  className="flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Receipt
                </Button>
              </div>
            </DialogHeader>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <Card className="border-blue-200 bg-blue-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-900">
                      <User className="w-5 h-5 mr-2" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {booking.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.customerName}
                        </p>
                        <p className="text-sm text-gray-600">Customer</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">
                          {booking.customerPhone}
                        </span>
                      </div>
                      {booking.customerEmail && (
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700">
                            {booking.customerEmail}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Information */}
                <Card className="border-green-200 bg-green-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-900">
                      <Calendar className="w-5 h-5 mr-2" />
                      Booking Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Booking Type</p>
                        <p className="font-semibold text-gray-900">
                          {booking.bookingType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Player Count</p>
                        <p className="font-semibold text-gray-900">
                          {booking.playerCount}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Player Type</p>
                        <div className="flex space-x-2">
                          {booking.isPlayer && (
                            <Badge className="bg-blue-100 text-blue-800">
                              Player
                            </Badge>
                          )}
                          {booking.isGk && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              GK
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-bold text-green-600 text-lg">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <Badge
                          className={`flex items-center space-x-1 ${getStatusColor(
                            booking.paymentStatus,
                            "payment"
                          )}`}
                        >
                          {getStatusIcon(booking.paymentStatus, "payment")}
                          <span>{booking.paymentStatus}</span>
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Booking Status</p>
                        <Badge
                          className={`flex items-center space-x-1 ${getStatusColor(
                            booking.bookingStatus,
                            "booking"
                          )}`}
                        >
                          {getStatusIcon(booking.bookingStatus, "booking")}
                          <span>{booking.bookingStatus}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule Information */}
                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-900">
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {booking.scheduleName}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {booking.venue}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-700">
                            {formatDate(booking.date)} • {booking.time} WIB
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Event Type</p>
                        <Badge className="bg-purple-100 text-purple-800">
                          {booking.typeEvent}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Match Type</p>
                        <Badge className="bg-indigo-100 text-indigo-800">
                          {booking.typeMatch}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card className="border-orange-200 bg-orange-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-900">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Payment ID</p>
                        <p className="font-mono text-sm text-gray-900">
                          {booking.paymentId || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-semibold text-gray-900">
                          {booking.paymentMethod || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Amount Breakdown
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-orange-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            {booking.playerCount}{" "}
                            {booking.isGk ? "GK" : "Player"}(s)
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(booking.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Facilities & Rules */}
                <Card className="lg:col-span-2 border-teal-200 bg-teal-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-teal-900">
                      <FileText className="w-5 h-5 mr-2" />
                      Facilities & Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Facilities */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Available Facilities
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {booking.facilities.map((facility, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-teal-200"
                            >
                              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                              <span className="text-sm font-medium text-teal-800">
                                {facility.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rules */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Match Rules
                        </h4>
                        <div className="space-y-2">
                          {booking.rules.map((rule, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <div className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                                {index + 1}
                              </div>
                              <p className="text-sm text-gray-700 flex-1">
                                {rule.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="lg:col-span-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Clock className="w-5 h-5 mr-2" />
                      Booking Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Booking Created
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.createdAt).toLocaleString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                      </div>

                      {booking.paymentStatus === "PAID" && (
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Payment Completed
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.updatedAt).toLocaleString(
                                "id-ID"
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {booking.bookingStatus === "CONFIRMED" && (
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              Booking Confirmed
                            </p>
                            <p className="text-sm text-gray-600">
                              Ready for match day
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Notes */}
                {booking.notes && (
                  <Card className="lg:col-span-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-gray-900">
                        <FileText className="w-5 h-5 mr-2" />
                        Additional Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {booking.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
