"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/components/organisms/NotificationContainer";
import { AuthService } from "@/utils/auth";
import Button from "@/components/atoms/Button";
import { Calendar, DollarSign, LogOut, TrendingUp, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import OverviewTab from "@/components/organisms/OverviewTabComponent";
import ScheduleTab from "@/components/organisms/ScheduleTabComponent";
import UsersTab from "@/components/organisms/UserTabComponent";
import NewsTab from "@/components/organisms/NewsTabComponent";
import VenueManagement from "@/components/organisms/VenueManagement";
import RuleManagement from "@/components/organisms/RuleManagement";
import FacilityManagement from "@/components/organisms/FacilityManagement";
import VenuesAndRulesTab from "@/components/organisms/VenuesAndRulesTab";
import ReportsTab from "@/components/organisms/ReportsTab";
import SettingsTab from "@/components/organisms/SettingsTab";
import BookingHistoryTab from "@/components/organisms/BookingHistoryTab";

// Tabs Components
function Tabs({ value, onValueChange, className, children }: any) {
  return <div className={className}>{children}</div>;
}

function TabsList({ className, children }: any) {
  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      {children}
    </div>
  );
}

function TabsTrigger({ value, children, onClick, isActive }: any) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex-1 px-2 md:px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform ${
        isActive
          ? "bg-white text-sky-600 shadow-sm scale-[1.02]"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, activeTab, children, className }: any) {
  if (value !== activeTab) return null;
  return <div className={className}>{children}</div>;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { showError, showSuccess } = useNotifications();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      const adminStatus = await AuthService.getSession();

      if (!adminStatus.isAdmin) {
        showError("Access Denied", "You don't have admin privileges");
        router.push("/b/auth/login");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin access:", error);
      showError("Error", "Failed to verify admin access");
      router.push("/b/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    AuthService.clearSession();
    showSuccess("You have been successfully logged out");
    router.push("/b/auth/login");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                <span className="hidden md:inline">Dashboard Admin</span>
                <span className="md:hidden">Admin</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-xs md:text-sm text-black">
                  {`${user?.name} - Administrator`.toUpperCase()}
                </span>
              </div>

              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Keluar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">
                Total Booking
              </CardTitle>
              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-lg md:text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground hidden md:block">
                +12% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">Pendapatan</CardTitle>
              <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-lg md:text-2xl font-bold">Rp 15.2M</div>
              <p className="text-xs text-muted-foreground hidden md:block">
                +8% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">
                Pengguna Aktif
              </CardTitle>
              <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-lg md:text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground hidden md:block">
                +5% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium">
                Tingkat Hunian
              </CardTitle>
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="text-lg md:text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground hidden md:block">
                +3% dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6 transition-all duration-300"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1 p-1">
            <TabsTrigger
              value="overview"
              onClick={setSelectedTab}
              isActive={selectedTab === "overview"}
              className="text-xs md:text-sm"
            >
              <span className="hidden md:inline">Overview</span>
              <span className="md:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger
              value="schedules"
              onClick={setSelectedTab}
              isActive={selectedTab === "schedules"}
              className="text-xs md:text-sm"
            >
              Jadwal
            </TabsTrigger>
            <TabsTrigger
              value="users"
              onClick={setSelectedTab}
              isActive={selectedTab === "users"}
              className="text-xs md:text-sm"
            >
              Pengguna
            </TabsTrigger>
            <TabsTrigger
              value="news"
              onClick={setSelectedTab}
              isActive={selectedTab === "news"}
              className="text-xs md:text-sm"
            >
              Berita
            </TabsTrigger>
            <TabsTrigger
              value="venues-rules"
              onClick={setSelectedTab}
              isActive={selectedTab === "venues-rules"}
              className="text-xs md:text-sm"
            >
              <span className="hidden lg:inline">Venue & Aturan</span>
              <span className="lg:hidden">V&A</span>
            </TabsTrigger>
            <TabsTrigger
              value="facilities"
              onClick={setSelectedTab}
              isActive={selectedTab === "facilities"}
              className="text-xs md:text-sm"
            >
              <span className="hidden md:inline">Fasilitas</span>
              <span className="md:hidden">Fas</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              onClick={setSelectedTab}
              isActive={selectedTab === "reports"}
              className="text-xs md:text-sm"
            >
              <span className="hidden md:inline">Laporan</span>
              <span className="md:hidden">Rep</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              onClick={setSelectedTab}
              isActive={selectedTab === "settings"}
              className="text-xs md:text-sm"
            >
              <span className="hidden md:inline">Pengaturan</span>
              <span className="md:hidden">Set</span>
            </TabsTrigger>
            <TabsTrigger
              value="booking-history"
              onClick={setSelectedTab}
              isActive={selectedTab === "booking-history"}
              className="text-xs md:text-sm"
            >
              <span className="hidden md:inline">Booking History</span>
              <span className="md:hidden">History</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent
            value="overview"
            activeTab={selectedTab}
            className="space-y-6 transition-all duration-300 ease-in-out"
          >
            <OverviewTab />
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent
            value="schedules"
            activeTab={selectedTab}
            className="space-y-6 transition-all duration-300 ease-in-out"
          >
            <ScheduleTab showError={showError} showSuccess={showSuccess} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent
            value="users"
            activeTab={selectedTab}
            className="space-y-6 transition-all duration-300 ease-in-out"
          >
            <UsersTab />
          </TabsContent>

          {/* News Tab - Placeholder */}
          <TabsContent
            value="news"
            activeTab={selectedTab}
            className="space-y-6 transition-all duration-300 ease-in-out"
          >
            <NewsTab />
          </TabsContent>

          <TabsContent
            value="booking-history"
            activeTab={selectedTab}
            className="space-y-6 transition-all duration-300 ease-in-out"
          >
            <BookingHistoryTab />
          </TabsContent>

          {/* Venues and Rules Tab */}
          <TabsContent
            value="venues-rules"
            activeTab={selectedTab}
            className="space-y-6 transition-all duration-300 ease-in-out"
          >
            <VenuesAndRulesTab />
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent
            value="facilities"
            activeTab={selectedTab}
            className="space-y-6 transition-all duration-300 ease-in-out"
          >
            <FacilityManagement />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent
            value="reports"
            activeTab={selectedTab}
            className="space-y-6 transition-all duration-300 ease-in-out"
          >
            <ReportsTab />
          </TabsContent>

          {/* Settings Tab - Placeholder */}
          <TabsContent
            value="settings"
            activeTab={selectedTab}
            className="space-y-6 transition-all duration-300 ease-in-out"
          >
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
