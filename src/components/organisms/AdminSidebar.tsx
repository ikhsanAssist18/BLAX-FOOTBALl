"use client";

import React from "react";
import {
  BarChart3,
  Calendar,
  Users,
  Newspaper,
  Database,
  History,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/helper";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortLabel?: string;
}

interface AdminSidebarProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

const navItems: NavItem[] = [
  { id: "reports", label: "Laporan", icon: BarChart3 },
  { id: "schedules", label: "Jadwal", icon: Calendar },
  { id: "lineup", label: "Lineup", icon: Shield },
  { id: "users", label: "Pengguna", icon: Users },
  { id: "news", label: "Berita", icon: Newspaper },
  { id: "master-data", label: "Master Data", icon: Database, shortLabel: "Master" },
  { id: "booking-history", label: "Booking History", icon: History, shortLabel: "History" },
];

export default function AdminSidebar({
  selectedTab,
  onTabChange,
  isMobileOpen,
  onMobileToggle,
}: AdminSidebarProps) {
  return (
    <>
      <button
        onClick={onMobileToggle}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:w-64"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    if (window.innerWidth < 1024) {
                      onMobileToggle();
                    }
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                    isActive
                      ? "bg-sky-50 text-sky-700 font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-sky-600" : "text-gray-500")} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30 transition-opacity duration-300"
          onClick={onMobileToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
}
