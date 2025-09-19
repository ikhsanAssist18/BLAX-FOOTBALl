"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";

// Mock data for schedules
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
  },
];

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{schedule.venue}</div>
                    <div className="text-sm text-gray-500">
                      {schedule.date} - {schedule.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {schedule.booked}/{schedule.total}
                    </div>
                    <div className="text-sm text-green-600">
                      Rp {schedule.revenue.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart akan ditampilkan di sini</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
