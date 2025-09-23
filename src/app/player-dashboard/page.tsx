"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Gift,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Trophy,
  User,
  Eye,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { useNotifications } from "@/components/organisms/NotificationContainer";
import { voucherService } from "@/utils/voucher";
import { formatCurrency, formatDate } from "@/lib/helper";
import LoadingScreen from "@/components/atoms/LoadingScreen";
import Navbar from "@/components/organisms/Navbar";
import { UserVoucher } from "@/types/voucher";

// Mock booking history data
const mockBookingHistory = [
  {
    id: "1",
    bookingId: "BK-2025-001",
    scheduleName: "Fun Game Weekday",
    venue: "Lapangan Futsal Central",
    date: "2025-01-20",
    time: "19:00",
    amount: 150000,
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2025-01-15T10:30:00Z",
    paymentId: "PAY-2025-001",
  },
  {
    id: "2",
    bookingId: "BK-2025-002",
    scheduleName: "Weekend Tournament",
    venue: "GOR Senayan Mini Soccer",
    date: "2025-01-21",
    time: "20:00",
    amount: 825000,
    paymentStatus: "PENDING",
    bookingStatus: "PENDING",
    createdAt: "2025-01-16T14:20:00Z",
    paymentId: "PAY-2025-002",
  },
  {
    id: "3",
    bookingId: "BK-2025-003",
    scheduleName: "Mix Game Friday",
    venue: "Lapangan Futsal Central",
    date: "2025-01-22",
    time: "18:30",
    amount: 50000,
    paymentStatus: "FAILED",
    bookingStatus: "CANCELLED",
    createdAt: "2025-01-17T09:15:00Z",
    paymentId: "PAY-2025-003",
  },
];

export default function PlayerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userVouchers, setUserVouchers] = useState<UserVoucher[]>([]);
  const [bookingHistory, setBookingHistory] = useState(mockBookingHistory);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    checkAccess();
  }, [user]);

  const checkAccess = async () => {
    if (!user) {
      router.push("/");
      return;
    }

    // Check if user has player role
    if (user.role !== "Player" && user.role !== "Admin") {
      showError("Access Denied", "This dashboard is only for players");
      router.push("/");
      return;
    }

    await fetchDashboardData();
    setLoading(false);
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch user vouchers
      const vouchersResult = await voucherService.getUserVouchers();
      setUserVouchers(vouchersResult);

      // In real implementation, fetch booking history from API
      // const bookingsResult = await bookingService.getUserBookings();
      // setBookingHistory(bookingsResult);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showError("Error", "Failed to load dashboard data");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    showSuccess("Dashboard refreshed successfully");
  };

  const handleViewPaymentDetails = (paymentId: string) => {
    const safeId = decodeURIComponent(paymentId as string);
    router.push(`/payment/${safeId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "FAILED":
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FAILED":
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getVoucherStatus = (voucher: UserVoucher) => {
    if (voucher.usedAt)
      return { status: "used", color: "bg-gray-100 text-gray-800" };

    const now = new Date();
    const validUntil = new Date(voucher.voucher.validUntil);

    if (validUntil < now)
      return { status: "expired", color: "bg-red-100 text-red-800" };
    return { status: "available", color: "bg-green-100 text-green-800" };
  };

  // Recent bookings (last 3)
  const recentBookings = bookingHistory.slice(0, 3);

  // Stats
  const stats = {
    totalBookings: bookingHistory.length,
    availableVouchers: userVouchers.filter(
      (v) => !v.usedAt && new Date(v.voucher.validUntil) > new Date()
    ).length,
    completedGames: bookingHistory.filter(
      (b) => b.bookingStatus === "CONFIRMED"
    ).length,
    totalSpent: bookingHistory
      .filter((b) => b.paymentStatus === "PAID")
      .reduce((sum, b) => sum + b.amount, 0),
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading player dashboard..." />;
  }

  if (!user) {
    return <LoadingScreen message="Redirecting..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navbar />

      <div className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Player Dashboard
                  </h1>
                  <p className="text-gray-600">Welcome back, {user.name}!</p>
                  <Badge className="bg-blue-100 text-blue-800 mt-1">
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-3">
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
                  variant="primary"
                  size="sm"
                  onClick={() => router.push("/schedule")}
                  className="flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  New Booking
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm border border-blue-100 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Bookings
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalBookings}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border border-green-100 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Available Vouchers
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.availableVouchers}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Gift className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border border-purple-100 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Completed Games
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.completedGames}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border border-orange-100 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Spent
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats.totalSpent)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Available Vouchers */}
            <div className="lg:col-span-1">
              <Card className="bg-white/95 backdrop-blur-sm border border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <Gift className="w-5 h-5 mr-2" />
                    Available Vouchers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userVouchers.length === 0 ? (
                    <div className="text-center py-8">
                      <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No vouchers available</p>
                      <p className="text-sm text-gray-400">
                        Check back later for new offers!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userVouchers.slice(0, 3).map((userVoucher) => {
                        const status = getVoucherStatus(userVoucher);
                        const voucher = userVoucher.voucher;

                        return (
                          <div
                            key={userVoucher.id}
                            className="p-4 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-green-800">
                                {voucher.name}
                              </h4>
                              <Badge className={status.color}>
                                {status.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-green-700 mb-2">
                              {voucher.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-lg font-bold text-green-800">
                                  {voucher.discountType === "PERCENTAGE"
                                    ? `${voucher.discountValue}%`
                                    : formatCurrency(voucher.discountValue)}
                                </p>
                                <p className="text-xs text-green-600">
                                  Min: {formatCurrency(voucher.minPurchase)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-green-600">Code</p>
                                <p className="font-mono text-sm font-bold text-green-800">
                                  {voucher.code}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-green-600 mt-2">
                              Valid until:{" "}
                              {new Date(voucher.validUntil).toLocaleDateString(
                                "id-ID"
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {userVouchers.length > 3 && (
                        <div className="text-center pt-2">
                          <p className="text-sm text-green-600">
                            +{userVouchers.length - 3} more vouchers available
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings & Complete History */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Bookings */}
              <Card className="bg-white/95 backdrop-blur-sm border border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-blue-800">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Recent Bookings
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Scroll to complete history section
                        document
                          .getElementById("complete-history")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recent bookings</p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push("/schedule")}
                        className="mt-4"
                      >
                        Book Your First Game
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-blue-800">
                              {booking.scheduleName}
                            </h4>
                            <div className="flex space-x-2">
                              <Badge
                                className={`flex items-center space-x-1 ${getStatusColor(
                                  booking.paymentStatus
                                )}`}
                              >
                                {getStatusIcon(booking.paymentStatus)}
                                <span>{booking.paymentStatus}</span>
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700 mb-3">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {booking.venue}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(booking.date)} • {booking.time}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold text-blue-800">
                                {formatCurrency(booking.amount)}
                              </p>
                              <p className="text-xs text-blue-600">
                                Booking ID: {booking.bookingId}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewPaymentDetails(booking.paymentId)
                              }
                              className="border-blue-300 text-blue-700 hover:bg-blue-100"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Payment Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Complete Booking History */}
              <Card className="bg-white/95 backdrop-blur-sm border border-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-purple-800">
                    <div className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2" />
                      Complete Booking History
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-300 text-purple-700 hover:bg-purple-100"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No booking history</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookingHistory.map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-purple-800">
                                {booking.scheduleName}
                              </h4>
                              <p className="text-sm text-purple-600">
                                ID: {booking.bookingId}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Badge
                                className={`flex items-center space-x-1 ${getStatusColor(
                                  booking.paymentStatus
                                )}`}
                              >
                                {getStatusIcon(booking.paymentStatus)}
                                <span>{booking.paymentStatus}</span>
                              </Badge>
                              <Badge
                                className={`flex items-center space-x-1 ${getStatusColor(
                                  booking.bookingStatus
                                )}`}
                              >
                                {getStatusIcon(booking.bookingStatus)}
                                <span>{booking.bookingStatus}</span>
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-700 mb-3">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {booking.venue}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(booking.date)} • {booking.time}
                            </div>
                            <div className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-1" />
                              {formatCurrency(booking.amount)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-purple-200">
                            <div className="text-xs text-purple-600">
                              Booked:{" "}
                              {new Date(booking.createdAt).toLocaleDateString(
                                "id-ID"
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewPaymentDetails(booking.paymentId)
                              }
                              className="border-purple-300 text-purple-700 hover:bg-purple-100"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Payment Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 mt-8">
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="primary"
                  onClick={() => router.push("/schedule")}
                  className="flex items-center justify-center py-4"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book New Game
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/gallery")}
                  className="flex items-center justify-center py-4"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  View Gallery
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/news")}
                  className="flex items-center justify-center py-4"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Latest News
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
