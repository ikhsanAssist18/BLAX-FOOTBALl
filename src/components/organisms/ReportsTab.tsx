"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  RefreshCw,
  FileSpreadsheet,
  Eye,
} from "lucide-react";
import Button from "../atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../atoms/Card";
import { useNotifications } from "./NotificationContainer";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";

// Mock data for reports
const mockReportData = {
  bookings: [
    {
      id: "1",
      date: "2025-01-15",
      venue: "Lapangan Futsal Central",
      players: 16,
      revenue: 1200000,
      status: "Completed",
      type: "Futsal",
    },
    {
      id: "2",
      date: "2025-01-16",
      venue: "GOR Senayan Mini Soccer",
      players: 14,
      revenue: 1050000,
      status: "Completed",
      type: "Mini Soccer",
    },
    {
      id: "3",
      date: "2025-01-17",
      venue: "Lapangan Futsal Central",
      players: 12,
      revenue: 900000,
      status: "Active",
      type: "Futsal",
    },
    {
      id: "4",
      date: "2025-01-18",
      venue: "GOR Senayan Mini Soccer",
      players: 18,
      revenue: 1350000,
      status: "Completed",
      type: "Mini Soccer",
    },
    {
      id: "5",
      date: "2025-01-19",
      venue: "Lapangan Futsal Central",
      players: 16,
      revenue: 1200000,
      status: "Active",
      type: "Futsal",
    },
  ],
  summary: {
    totalBookings: 156,
    totalRevenue: 45600000,
    totalPlayers: 2847,
    averageOccupancy: 87,
    completedMatches: 89,
    activeBookings: 23,
  },
  monthlyData: [
    { month: "Jan", bookings: 45, revenue: 15200000 },
    { month: "Feb", bookings: 52, revenue: 17800000 },
    { month: "Mar", bookings: 48, revenue: 16400000 },
    { month: "Apr", bookings: 59, revenue: 19200000 },
    { month: "May", bookings: 61, revenue: 20100000 },
    { month: "Jun", bookings: 55, revenue: 18300000 },
  ],
};

export default function ReportsTab() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("30d");
  const [reportType, setReportType] = useState("bookings");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(mockReportData);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    // Set default date range
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
  }, []);

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, fetch fresh data from API
      setReportData(mockReportData);
      showSuccess("Data refreshed successfully");
    } catch (error) {
      showError("Error", "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("Blax Football - Laporan Booking", 20, 30);

      // Date range
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Periode: ${startDate} - ${endDate}`, 20, 45);

      // Summary section
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Ringkasan", 20, 65);

      const summaryData = [
        ["Total Booking", reportData.summary.totalBookings.toString()],
        [
          "Total Pendapatan",
          `Rp ${reportData.summary.totalRevenue.toLocaleString("id-ID")}`,
        ],
        ["Total Pemain", reportData.summary.totalPlayers.toString()],
        ["Tingkat Hunian", `${reportData.summary.averageOccupancy}%`],
        [
          "Pertandingan Selesai",
          reportData.summary.completedMatches.toString(),
        ],
        ["Booking Aktif", reportData.summary.activeBookings.toString()],
      ];

      autoTable(doc, {
        startY: 75,
        head: [["Metrik", "Nilai"]],
        body: summaryData,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 20, right: 20 },
      });

      // Booking details
      const lastY = doc.lastAutoTable?.finalY || 75;

      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Detail Booking", 20, lastY + 20);

      const bookingData = reportData.bookings.map((booking) => [
        booking.date,
        booking.venue,
        booking.type,
        booking.players.toString(),
        `Rp ${booking.revenue.toLocaleString("id-ID")}`,
        booking.status,
      ]);

      autoTable(doc, {
        startY: lastY + 30,
        head: [["Tanggal", "Venue", "Tipe", "Pemain", "Pendapatan", "Status"]],
        body: bookingData,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 20, right: 20 },
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Generated on ${new Date().toLocaleDateString(
            "id-ID"
          )} - Page ${i} of ${pageCount}`,
          20,
          doc.internal.pageSize.height - 10
        );
      }

      doc.save(`blax-football-report-${startDate}-to-${endDate}.pdf`);
      showSuccess(
        "PDF Report Generated",
        "Report has been downloaded successfully"
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      showError("Export Error", "Failed to generate PDF report");
    }
  };

  const generateExcelReport = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Summary sheet
      const summaryData = [
        ["Metrik", "Nilai"],
        ["Total Booking", reportData.summary.totalBookings],
        ["Total Pendapatan", reportData.summary.totalRevenue],
        ["Total Pemain", reportData.summary.totalPlayers],
        ["Tingkat Hunian (%)", reportData.summary.averageOccupancy],
        ["Pertandingan Selesai", reportData.summary.completedMatches],
        ["Booking Aktif", reportData.summary.activeBookings],
      ];

      const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWS, "Ringkasan");

      // Bookings sheet
      const bookingHeaders = [
        "ID",
        "Tanggal",
        "Venue",
        "Tipe",
        "Jumlah Pemain",
        "Pendapatan",
        "Status",
      ];

      const bookingData = [
        bookingHeaders,
        ...reportData.bookings.map((booking) => [
          booking.id,
          booking.date,
          booking.venue,
          booking.type,
          booking.players,
          booking.revenue,
          booking.status,
        ]),
      ];

      const bookingWS = XLSX.utils.aoa_to_sheet(bookingData);
      XLSX.utils.book_append_sheet(wb, bookingWS, "Detail Booking");

      // Monthly data sheet
      const monthlyHeaders = ["Bulan", "Total Booking", "Pendapatan"];
      const monthlyData = [
        monthlyHeaders,
        ...reportData.monthlyData.map((data) => [
          data.month,
          data.bookings,
          data.revenue,
        ]),
      ];

      const monthlyWS = XLSX.utils.aoa_to_sheet(monthlyData);
      XLSX.utils.book_append_sheet(wb, monthlyWS, "Data Bulanan");

      // Generate and save file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(data, `blax-football-report-${startDate}-to-${endDate}.xlsx`);
      showSuccess(
        "Excel Report Generated",
        "Report has been downloaded successfully"
      );
    } catch (error) {
      console.error("Error generating Excel:", error);
      showError("Export Error", "Failed to generate Excel report");
    }
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    const today = new Date();
    let startDate: Date;

    switch (range) {
      case "7d":
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    setStartDate(startDate.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laporan</h2>
          <p className="text-gray-600 mt-1">
            Analisis performa dan statistik platform booking
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={loading}
            className="flex items-center"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={generatePDFReport}
            className="flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={generateExcelReport}
            className="flex items-center bg-green-600 hover:bg-green-700"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="bookings">Booking Reports</option>
                <option value="revenue">Revenue Reports</option>
                <option value="users">User Activity</option>
                <option value="venues">Venue Performance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {reportData.summary.totalBookings}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last period
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  Rp {(reportData.summary.totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last period
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Players
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {reportData.summary.totalPlayers}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% from last period
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Occupancy Rate
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {reportData.summary.averageOccupancy}%
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +3% from last period
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {reportData.summary.completedMatches}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% from last period
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Bookings
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {reportData.summary.activeBookings}
                </p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Needs attention
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Monthly Performance</span>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Interactive Chart</p>
                <p className="text-sm text-gray-400">
                  Monthly booking and revenue trends
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Venues */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Performing Venues</span>
              <Eye className="w-5 h-5 text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Lapangan Futsal Central",
                  bookings: 45,
                  revenue: 15200000,
                },
                {
                  name: "GOR Senayan Mini Soccer",
                  bookings: 38,
                  revenue: 12800000,
                },
                {
                  name: "Futsal Arena Jakarta",
                  bookings: 32,
                  revenue: 10400000,
                },
                { name: "Mini Soccer Plaza", bookings: 28, revenue: 9200000 },
                { name: "Football Center BSD", bookings: 24, revenue: 8000000 },
              ].map((venue, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{venue.name}</p>
                      <p className="text-sm text-gray-500">
                        {venue.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      Rp {(venue.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Booking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Booking Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Players
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {new Date(booking.date).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.venue}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {booking.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        {booking.players}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        Rp {booking.revenue.toLocaleString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Export Options
              </h3>
              <p className="text-blue-700 text-sm">
                Generate comprehensive reports in your preferred format
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={generatePDFReport}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF Report
              </Button>
              <Button
                variant="outline"
                onClick={generateExcelReport}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
