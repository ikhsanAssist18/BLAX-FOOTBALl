"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserDashboard from "@/components/organisms/UserDashboard";
import Navbar from "@/components/organisms/Navbar";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/atoms/LoadingScreen";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [user]);

  const checkAccess = async () => {
    if (!user) {
      router.push("/");
      return;
    } else {
      setLoading(false);
      router.push("/dashboard");
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Verifying dashboard access..." />;
  }

  if (!user) {
    return <LoadingScreen message="Redirecting..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <Navbar />

      {/* Main Content with proper spacing for fixed navbar */}
      <div className="pt-24 pb-8 px-4">
        <UserDashboard user={user} className="overflow-hidden" />
      </div>
    </div>
  );
}
