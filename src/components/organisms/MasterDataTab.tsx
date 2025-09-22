"use client";

import React, { useState } from "react";
import { MapPin, FileText, Gift, Settings } from "lucide-react";
import VenueManagement from "./VenueManagement";
import RuleManagement from "./RuleManagement";
import VoucherManagement from "./VoucherManagement";
import FacilityManagement from "./FacilityManagement";

// Sub-tabs for Master Data
function SubTabs({ value, onValueChange, className, children }: any) {
  return <div className={className}>{children}</div>;
}

function SubTabsList({ className, children }: any) {
  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 mb-6 ${className}`}>
      {children}
    </div>
  );
}

function SubTabsTrigger({ value, children, onClick, isActive }: any) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex-1 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-white text-blue-600 shadow-sm transform scale-[1.02]"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function SubTabsContent({ value, activeTab, children, className }: any) {
  if (value !== activeTab) return null;
  return (
    <div 
      className={`transition-all duration-300 ease-in-out ${className}`}
      style={{
        animation: 'fadeIn 0.3s ease-in-out'
      }}
    >
      {children}
    </div>
  );
}

export default function MasterDataTab() {
  const [selectedSubTab, setSelectedSubTab] = useState("venues");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Master Data Management
        </h2>
        <p className="text-gray-600">
          Kelola data master venue, aturan, voucher, dan fasilitas
        </p>
      </div>

      {/* Sub-tabs */}
      <SubTabs
        value={selectedSubTab}
        onValueChange={setSelectedSubTab}
        className="space-y-6"
      >
        <SubTabsList className="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-1">
          <SubTabsTrigger
            value="venues"
            onClick={setSelectedSubTab}
            isActive={selectedSubTab === "venues"}
          >
            <MapPin className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Venue</span>
          </SubTabsTrigger>
          <SubTabsTrigger
            value="rules"
            onClick={setSelectedSubTab}
            isActive={selectedSubTab === "rules"}
          >
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Rules</span>
          </SubTabsTrigger>
          <SubTabsTrigger
            value="vouchers"
            onClick={setSelectedSubTab}
            isActive={selectedSubTab === "vouchers"}
          >
            <Gift className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Vouchers</span>
          </SubTabsTrigger>
          <SubTabsTrigger
            value="facilities"
            onClick={setSelectedSubTab}
            isActive={selectedSubTab === "facilities"}
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Facilities</span>
          </SubTabsTrigger>
        </SubTabsList>

        {/* Venues Tab */}
        <SubTabsContent
          value="venues"
          activeTab={selectedSubTab}
          className="space-y-6"
        >
          <VenueManagement />
        </SubTabsContent>

        {/* Rules Tab */}
        <SubTabsContent
          value="rules"
          activeTab={selectedSubTab}
          className="space-y-6"
        >
          <RuleManagement />
        </SubTabsContent>

        {/* Vouchers Tab */}
        <SubTabsContent
          value="vouchers"
          activeTab={selectedSubTab}
          className="space-y-6"
        >
          <VoucherManagement />
        </SubTabsContent>

        {/* Facilities Tab */}
        <SubTabsContent
          value="facilities"
          activeTab={selectedSubTab}
          className="space-y-6"
        >
          <FacilityManagement />
        </SubTabsContent>
      </SubTabs>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}