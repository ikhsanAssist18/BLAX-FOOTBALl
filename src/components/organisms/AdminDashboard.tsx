import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  FileText,
  Flag,
  CheckCircle,
  AlertTriangle,
  Settings,
  BarChart3,
  Clock,
  UserCheck,
} from "lucide-react";
import { User } from "@/types/auth";
import { AdminStats } from "@/types/admin";
import { adminService } from "@/utils/admin";
import { useNotifications } from "./NotificationContainer";
import StatCard from "../molecules/StatCard";
import VerificationDashboard from "./VerificationDashboard";
import PolicyEditingInterface from "./PolicyEditingInterface";
import UserManagementInterface from "./UserManagementInterface";
import ContentModerationInterface from "./ContentModerationInterface";
import LoadingScreen from "../atoms/LoadingScreen";

interface AdminDashboardProps {
  user: User;
  accessLevel: string;
  className?: string;
}

export default function AdminDashboard({
  user,
  accessLevel,
  className = "",
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "verification" | "policies" | "users" | "moderation"
  >("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotifications();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const adminStats = await adminService.getAdminStats();
      setStats(adminStats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      showError("Error", "Failed to load admin statistics");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "verification", label: "Verification", icon: CheckCircle },
    { id: "policies", label: "Policy Editor", icon: FileText },
    { id: "users", label: "User Management", icon: Users },
    { id: "moderation", label: "Content Moderation", icon: Flag },
  ];

  if (loading) {
    return (
      <LoadingScreen message="Loading admin dashboard..." fullScreen={false} />
    );
  }

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl flex-shrink-0">
              <Shield className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user.email}</p>
              <p className="text-sm text-gray-500 capitalize">
                Access Level: {accessLevel}
              </p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xl md:text-2xl font-bold text-purple-600">
              Administrator
            </div>
            <div className="text-sm text-gray-500">System Management</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 md:mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 md:space-x-8 px-4 md:px-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 md:p-8">
          {activeTab === "overview" && (
            <div className="space-y-6 md:space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                <StatCard
                  title="Total Policies"
                  value={stats?.totalPolicies || 0}
                  icon={<FileText className="h-6 w-6" />}
                  color="blue"
                />
                <StatCard
                  title="Pending Review"
                  value={stats?.pendingVerification || 0}
                  icon={<Clock className="h-6 w-6" />}
                  color="yellow"
                />
                <StatCard
                  title="Total Users"
                  value={stats?.totalUsers || 0}
                  icon={<Users className="h-6 w-6" />}
                  color="green"
                />
                <StatCard
                  title="Active Admins"
                  value={stats?.activeAdmins || 0}
                  icon={<UserCheck className="h-6 w-6" />}
                  color="purple"
                />
                <StatCard
                  title="Today's Reviews"
                  value={stats?.verificationsToday || 0}
                  icon={<CheckCircle className="h-6 w-6" />}
                  color="cyan"
                />
                <StatCard
                  title="Flagged Content"
                  value={stats?.flaggedContent || 0}
                  icon={<Flag className="h-6 w-6" />}
                  color="red"
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab("verification")}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <CheckCircle className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">
                      Review Policies
                    </h3>
                    <p className="text-sm text-gray-600">
                      {stats?.pendingVerification || 0} pending
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("users")}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                  >
                    <Users className="h-8 w-8 text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">
                      Manage Users
                    </h3>
                    <p className="text-sm text-gray-600">
                      {stats?.totalUsers || 0} total users
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("moderation")}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors text-left"
                  >
                    <Flag className="h-8 w-8 text-red-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">
                      Moderate Content
                    </h3>
                    <p className="text-sm text-gray-600">
                      {stats?.flaggedContent || 0} flagged items
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab("policies")}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                  >
                    <Settings className="h-8 w-8 text-purple-600 mb-2" />
                    <h3 className="font-semibold text-gray-900">
                      Edit Policies
                    </h3>
                    <p className="text-sm text-gray-600">Manage content</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "verification" && (
            <VerificationDashboard accessLevel={accessLevel} />
          )}

          {activeTab === "policies" && (
            <PolicyEditingInterface accessLevel={accessLevel} />
          )}

          {activeTab === "users" && (
            <UserManagementInterface accessLevel={accessLevel} />
          )}

          {activeTab === "moderation" && (
            <ContentModerationInterface accessLevel={accessLevel} />
          )}
        </div>
      </div>
    </div>
  );
}
