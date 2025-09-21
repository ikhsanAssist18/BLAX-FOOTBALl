"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Button from "../atoms/Button";
import { Card, CardContent } from "../atoms/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../atoms/Table";
import Badge from "../atoms/Badge";
import { useNotifications } from "./NotificationContainer";
import { formatCurrency, formatDate } from "@/lib/helper";
import BackendPagination from "../atoms/BackendPagination";
import BookingHistoryDetail from "./BookingHistoryDetail";
import { TableLoadingSkeleton } from "./LoadingSkeleton";

interface BookingHistory {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  scheduleName: string;
  venue: string;
  date: string;
  time: string;
  bookingType: "INDIVIDUAL" | "TEAM";
  playerCount: number;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  bookingStatus: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "PENDING";
  createdAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Mock data for demonstration
const mockBookingHistory: BookingHistory[] = [
  {
    id: "1",
    bookingId: "BK-2025-001",
    customerName: "John Doe",
    customerPhone: "08123456789",
    scheduleName: "Fun Game Weekday",
    venue: "Lapangan Futsal Central",
    date: "2025-01-20",
    time: "19:00",
    bookingType: "INDIVIDUAL",
    playerCount: 2,
    totalAmount: 150000,
    paymentStatus: "PAID",
    bookingStatus: "CONFIRMED",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "2",
    bookingId: "BK-2025-002",
    customerName: "Jane Smith",
    customerPhone: "08987654321",
    scheduleName: "Weekend Tournament",
    venue: "GOR Senayan Mini Soccer",
    date: "2025-01-21",
    time: "20:00",
    bookingType: "TEAM",
    playerCount: 11,
    totalAmount: 825000,
    paymentStatus: "PENDING",
    bookingStatus: "PENDING",
    createdAt: "2025-01-16T14:20:00Z",
  },
  {
    id: "3",
    bookingId: "BK-2025-003",
    customerName: "Mike Johnson",
    customerPhone: "08555666777",
    scheduleName: "Mix Game Friday",
    venue: "Lapangan Futsal Central",
    date: "2025-01-22",
    time: "18:30",
    bookingType: "INDIVIDUAL",
    playerCount: 1,
    totalAmount: 50000,
    paymentStatus: "FAILED",
    bookingStatus: "CANCELLED",
    createdAt: "2025-01-17T09:15:00Z",
  },
];

export default function BookingHistoryTab() {
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingHistory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Pagination state
  const [paginationData, setPaginationData] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchBookingHistory();
  }, [
    paginationData.currentPage,
    searchTerm,
    statusFilter,
    paymentFilter,
    dateFilter,
  ]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, paymentFilter, dateFilter]);

  const fetchBookingHistory = async () => {
    try {
      setLoading(true);

      // Simulate API call with pagination
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, this would be an API call
      // const response = await bookingService.getBookingHistory({
      //   page: paginationData.currentPage,
      //   limit: paginationData.itemsPerPage,
      //   search: searchTerm,
      //   status: statusFilter,
      //   paymentStatus: paymentFilter,
      //   dateRange: dateFilter
      // });

      // Mock response with pagination
      const totalItems = mockBookingHistory.length;
      const totalPages = Math.ceil(totalItems / paginationData.itemsPerPage);

      setBookings(mockBookingHistory);
      setPaginationData((prev) => ({
        ...prev,
        totalItems,
        totalPages,
        hasNextPage: prev.currentPage < totalPages,
        hasPreviousPage: prev.currentPage > 1,
      }));
    } catch (error) {
      console.error("Error fetching booking history:", error);
      showError("Error", "Failed to load booking history");
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.customerPhone.includes(searchTerm) ||
          booking.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.bookingStatus === statusFilter
      );
    }

    // Payment filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.paymentStatus === paymentFilter
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(
            (booking) => new Date(booking.createdAt) >= filterDate
          );
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(
            (booking) => new Date(booking.createdAt) >= filterDate
          );
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(
            (booking) => new Date(booking.createdAt) >= filterDate
          );
          break;
      }
    }

    setFilteredBookings(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookingHistory();
    setRefreshing(false);
    showSuccess("Booking history refreshed successfully");
  };

  const handlePageChange = (page: number) => {
    setPaginationData((prev) => ({ ...prev, currentPage: page }));
  };

  const handleViewDetail = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedBookingId(null);
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
          return <CheckCircle className="w-3 h-3" />;
        case "PENDING":
          return <Clock className="w-3 h-3" />;
        case "FAILED":
        case "EXPIRED":
          return <XCircle className="w-3 h-3" />;
        default:
          return <AlertCircle className="w-3 h-3" />;
      }
    } else {
      switch (status) {
        case "CONFIRMED":
        case "COMPLETED":
          return <CheckCircle className="w-3 h-3" />;
        case "PENDING":
          return <Clock className="w-3 h-3" />;
        case "CANCELLED":
          return <XCircle className="w-3 h-3" />;
        default:
          return <AlertCircle className="w-3 h-3" />;
      }
    }
  };

  // Calculate stats
  const stats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter((b) => b.bookingStatus === "CONFIRMED")
      .length,
    pending: filteredBookings.filter((b) => b.bookingStatus === "PENDING")
      .length,
    totalRevenue: filteredBookings
      .filter((b) => b.paymentStatus === "PAID")
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  if (loading) {
    return <TableLoadingSkeleton />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Booking History
            </h2>
            <p className="text-gray-600 mt-1">
              Comprehensive view of all booking transactions
            </p>
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
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="black" size="sm" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Confirmed
                  </p>
                  <p className="text-3xl font-bold text-green-900">
                    {stats.confirmed}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardContent className="p-6">
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-900">
                    {stats.pending}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-6">
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">
                    Revenue
                  </p>
                  <p className="text-3xl font-bold text-emerald-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="pt-4 flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by customer name, booking ID, phone, or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Payments</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                  <option value="EXPIRED">Expired</option>
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm ||
              statusFilter !== "all" ||
              paymentFilter !== "all" ||
              dateFilter !== "all") && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mr-2">Active filters:</p>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Search: {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Status: {statusFilter}
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="ml-1 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {paymentFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Payment: {paymentFilter}
                    <button
                      onClick={() => setPaymentFilter("all")}
                      className="ml-1 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {dateFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Date: {dateFilter}
                    <button
                      onClick={() => setDateFilter("all")}
                      className="ml-1 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking History Table */}
        <Card className="border-gray-200">
          <CardContent className="p-0">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-600">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  paymentFilter !== "all" ||
                  dateFilter !== "all"
                    ? "Try adjusting your search criteria"
                    : "No booking history available"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">
                        Booking ID
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Customer
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Schedule
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Type
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Amount
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Payment
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Date
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow
                        key={booking.id}
                        className="hover:bg-gray-50/50"
                      >
                        <TableCell>
                          <div className="font-mono text-sm font-medium text-blue-600">
                            {booking.bookingId}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.customerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.customerPhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.scheduleName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.venue}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(booking.date)} • {booking.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge
                              variant="outline"
                              className={
                                booking.bookingType === "INDIVIDUAL"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                              }
                            >
                              {booking.bookingType}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {booking.playerCount} player(s)
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(booking.totalAmount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`flex items-center space-x-1 ${getStatusColor(
                              booking.paymentStatus,
                              "payment"
                            )}`}
                          >
                            {getStatusIcon(booking.paymentStatus, "payment")}
                            <span>{booking.paymentStatus}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`flex items-center space-x-1 ${getStatusColor(
                              booking.bookingStatus,
                              "booking"
                            )}`}
                          >
                            {getStatusIcon(booking.bookingStatus, "booking")}
                            <span>{booking.bookingStatus}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {new Date(booking.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetail(booking.id)}
                            className="hover:bg-blue-50 text-blue-600"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Backend-driven Pagination */}
        <BackendPagination
          paginationData={paginationData}
          onPageChange={handlePageChange}
          loading={loading}
          className="mt-6"
        />
      </div>

      {/* Booking Detail Modal */}
      {showDetailModal && selectedBookingId && (
        <BookingHistoryDetail
          bookingId={selectedBookingId}
          onClose={handleCloseDetail}
          onRefresh={handleRefresh}
        />
      )}
    </>
  );
}
