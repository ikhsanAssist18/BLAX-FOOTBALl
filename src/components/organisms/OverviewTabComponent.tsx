"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Eye
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { useNotifications } from "./NotificationContainer";
import { adminService } from "@/utils/admin";

// Skeleton Components
const StatCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-32"></div>
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-gray-200 rounded-lg"></div>
    </CardContent>
  </Card>
);

const RecentActivitySkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-40"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Mock data for demonstration
const mockSchedules = [
  {
    id: 1,
    date: "2025-01-20",
    time: "19:00",
    venue: "Lapangan Futsal Central",
    booked: 14,
    total: 16,
    revenue: 1050000,
    status: "active",
    type: "Futsal",
    organizer: "Admin"
  },
  {
    id: 2,
    date: "2025-01-21",
    time: "20:00",
    venue: "GOR Senayan Mini Soccer",
    booked: 10,
    total: 16,
    revenue: 750000,
    status: "active",
    type: "Mini Soccer",
    organizer: "Admin"
  },
  {
    id: 3,
    date: "2025-01-22",
    time: "19:30",
    venue: "Lapangan Futsal Central",
    booked: 16,
    total: 16,
    revenue: 1200000,
    status: "completed",
    type: "Futsal",
    organizer: "Admin"
  },
];

const mockStats = {
  totalBookings: 156,
  totalRevenue: 45600000,
  activeUsers: 1247,
  completedMatches: 89,
  pendingBookings: 23,
  averageOccupancy: 87
};

const mockRecentActivity = [
  {
    id: 1,
    type: "booking",
    user: "John Doe",
    action: "Booked a match",
    venue: "Futsal Central",
    time: "2 minutes ago",
    status: "success"
  },
  {
    id: 2,
    type: "payment",
    user: "Jane Smith",
    action: "Payment completed",
    amount: "Rp 75,000",
    time: "5 minutes ago",
    status: "success"
  },
  {
    id: 3,
    type: "cancellation",
    user: "Mike Johnson",
    action: "Cancelled booking",
    venue: "GOR Senayan",
    time: "10 minutes ago",
    status: "warning"
  },
  {
    id: 4,
    type: "registration",
    user: "Sarah Wilson",
    action: "New user registered",
    time: "15 minutes ago",
    status: "info"
  },
  {
    id: 5,
    type: "match",
    user: "System",
    action: "Match completed",
    venue: "Futsal Central",
    time: "1 hour ago",
    status: "success"
  }
];

export default function OverviewTab() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(mockStats);
  const [schedules, setSchedules] = useState(mockSchedules);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);
  const [dateRange, setDateRange] = useState("7d");
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchOverviewData();
  }, [dateRange]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, fetch from API
      // const data = await adminService.getOverviewData(dateRange);
      
      setStats(mockStats);
      setSchedules(mockSchedules);
      setRecentActivity(mockRecentActivity);
    } catch (error) {
      console.error("Error fetching overview data:", error);
      showError("Error", "Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOverviewData();
    setRefreshing(false);
    showSuccess("Data refreshed successfully");
  };

  const handleExportData = () => {
    // Implement export functionality
    showSuccess("Export started", "Data will be downloaded shortly");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600 bg-green-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "info": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking": return Calendar;
      case "payment": return DollarSign;
      case "cancellation": return Activity;
      case "registration": return Users;
      case "match": return Trophy;
      default: return Activity;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Charts and Activity Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <RecentActivitySkeleton />
        </div>

        {/* Recent Bookings Skeleton */}
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-40"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">Monitor your football booking platform performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportData}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  Rp {(stats.totalRevenue / 1000000).toFixed(1)}M
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
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% from last period
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
                <p className="text-sm font-medium text-gray-600">Completed Matches</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedMatches}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% from last period
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
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  Needs attention
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageOccupancy}%</p>
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
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Trends</span>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Interactive Chart</p>
                <p className="text-sm text-gray-400">Booking trends over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {recentActivity.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {activity.action}
                        {activity.venue && ` at ${activity.venue}`}
                        {activity.amount && ` - ${activity.amount}`}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {activity.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Bookings</span>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{schedule.venue}</div>
                    <div className="text-sm text-gray-500">
                      {schedule.date} - {schedule.time} | {schedule.type}
                    </div>
                    <div className="text-xs text-gray-400">
                      Organized by {schedule.organizer}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {schedule.booked}/{schedule.total} slots
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Rp {schedule.revenue.toLocaleString("id-ID")}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      schedule.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}