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
      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-white text-sky-600 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
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
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-black">
                  {`${user?.name} - Administrator`.toUpperCase()}
                </span>
              </div>

              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Booking
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +12% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 15.2M</div>
              <p className="text-xs text-muted-foreground">
                +8% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                +5% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupancy Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                +3% dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger
              value="overview"
              onClick={setSelectedTab}
              isActive={selectedTab === "overview"}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="schedules"
              onClick={setSelectedTab}
              isActive={selectedTab === "schedules"}
            >
              Jadwal
            </TabsTrigger>
            <TabsTrigger
              value="users"
              onClick={setSelectedTab}
              isActive={selectedTab === "users"}
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="news"
              onClick={setSelectedTab}
              isActive={selectedTab === "news"}
            >
              Berita
            </TabsTrigger>
            <TabsTrigger
              value="venues"
              onClick={setSelectedTab}
              isActive={selectedTab === "venues"}
            >
              Venues
            </TabsTrigger>
            <TabsTrigger
              value="rules"
              onClick={setSelectedTab}
              isActive={selectedTab === "rules"}
            >
              Rules
            </TabsTrigger>
            <TabsTrigger
              value="facilities"
              onClick={setSelectedTab}
              isActive={selectedTab === "facilities"}
            >
              Facilities
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              onClick={setSelectedTab}
              isActive={selectedTab === "settings"}
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent
            value="overview"
            activeTab={selectedTab}
            className="space-y-6"
          >
            <OverviewTab />
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent
            value="schedules"
            activeTab={selectedTab}
            className="space-y-6"
          >
            <ScheduleTab showError={showError} showSuccess={showSuccess} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent
            value="users"
            activeTab={selectedTab}
            className="space-y-6"
          >
            <UsersTab />
          </TabsContent>

          {/* News Tab - Placeholder */}
          <TabsContent
            value="news"
            activeTab={selectedTab}
            className="space-y-6"
          >
            <NewsTab />
          </TabsContent>

          {/* Venues Tab */}
          <TabsContent
            value="venues"
            activeTab={selectedTab}
            className="space-y-6"
          >
            <VenueManagement />
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent
            value="rules"
            activeTab={selectedTab}
            className="space-y-6"
          >
            <RuleManagement />
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent
            value="facilities"
            activeTab={selectedTab}
            className="space-y-6"
          >
            <FacilityManagement />
          </TabsContent>

          {/* Settings Tab - Placeholder */}
          <TabsContent
            value="settings"
            activeTab={selectedTab}
            className="space-y-6"
          >
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <p className="text-gray-600">Fitur settings akan segera hadir</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
