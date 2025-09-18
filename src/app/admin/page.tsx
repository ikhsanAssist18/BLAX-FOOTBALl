"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { adminService } from "@/utils/admin";
import LoadingScreen from "@/components/atoms/LoadingScreen";
import Navbar from "@/components/organisms/Navbar";
import AdminDashboard from "@/components/organisms/AdminDashboard";
import { useNotifications } from "@/components/organisms/NotificationContainer";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showError } = useNotifications();

  const [isAdmin, setIsAdmin] = useState(false);
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    // console.log("userr=>>", user);
    // if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    try {
      const adminStatus = await adminService.checkAdminStatus();

      if (!adminStatus.isAdmin) {
        showError("Access Denied", "You don't have admin privileges");
        router.push("/dashboard");
        return;
      }

      setIsAdmin(true);
      setAccessLevel(adminStatus.accessLevel || "");
    } catch (error) {
      console.error("Error checking admin access:", error);
      showError("Error", "Failed to verify admin access");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Verifying admin access..." />;
  }

  if (!user || !isAdmin) {
    return <LoadingScreen message="Redirecting..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navbar />

      <div className="pt-24 pb-8 px-4">
        <AdminDashboard user={user} accessLevel={accessLevel} />
      </div>
    </div>
  );
}
