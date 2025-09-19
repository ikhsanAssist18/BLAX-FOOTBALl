"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
import Input from "@/components/atoms/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/Table";
import Badge from "@/components/atoms/Badge";
import { ScheduleOverview } from "@/types/schedule";
import { useNotifications } from "./NotificationContainer";
import { scheduleService } from "@/utils/schedule";
import { adminService } from "@/utils/admin";
import { formatDate } from "@/lib/helper";

interface ScheduleTabProps {
  showError: (title: string, message: string) => void;
  showSuccess: (message: string) => void;
}

export default function ScheduleTab({
  showError,
  showSuccess,
}: ScheduleTabProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states for new schedule
  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
    venue: "",
    slots: "16",
    fee: "",
    type: "",
    facilities: {
      "Air Mineral": true,
      Rompi: true,
      Bola: true,
      Shower: false,
      Wasit: false,
    },
  });

  useEffect(() => {
    fetchScheduleOverview();
  }, []);

  const fetchScheduleOverview = async () => {
    try {
      setIsLoading(true);
      const result = await adminService.scheduleOverview();
      setSchedules(result);
    } catch (error) {
      console.error("Error fetching schedule overview:", error);
      showError("Error", "Failed to load schedule overview");
    }
  };

  const handleScheduleInputChange = (field: string, value: string) => {
    setScheduleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFacilityChange = (facility: string, checked: boolean) => {
    setScheduleForm((prev) => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        [facility]: checked,
      },
    }));
  };

  const handleSaveSchedule = () => {
    // Validation
    if (
      !scheduleForm.date ||
      !scheduleForm.time ||
      !scheduleForm.venue ||
      !scheduleForm.fee ||
      !scheduleForm.type
    ) {
      showError("Error", "Please fill all required fields");
      return;
    }

    // Here you would typically send the data to your API
    console.log("Saving schedule:", scheduleForm);

    showSuccess("Schedule created successfully!");
    setShowScheduleDialog(false);

    // Reset form
    setScheduleForm({
      date: "",
      time: "",
      venue: "",
      slots: "16",
      fee: "",
      type: "",
      facilities: {
        "Air Mineral": true,
        Rompi: true,
        Bola: true,
        Shower: false,
        Wasit: false,
      },
    });
  };

  const handleEditSchedule = (name: string) => {
    // Find the schedule to edit
    const scheduleData = schedules.find((s) => s.name === name);
    if (scheduleData) {
      console.log("Editing schedule:", name);
      showSuccess(`Editing schedule for ${name}`);
      // Here you would open an edit dialog or navigate to edit page
    }
  };

  const handleDeleteSchedule = (name: string) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      console.log("Deleting schedule:", name);
      showSuccess("Schedule deleted successfully!");
      // Here you would typically call an API to delete the schedule
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Management Jadwal</h2>
        <Button
          variant="black"
          size="sm"
          onClick={() => setShowScheduleDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jadwal
        </Button>
      </div>

      {/* Add Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium mb-1"
                >
                  Tanggal
                </label>
                <Input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) =>
                    handleScheduleInputChange("date", e.target.value)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium mb-1"
                >
                  Waktu
                </label>
                <Input
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) =>
                    handleScheduleInputChange("time", e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium mb-1">
                Venue
              </label>
              <select
                id="venue"
                value={scheduleForm.venue}
                onChange={(e) =>
                  handleScheduleInputChange("venue", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih venue</option>
                <option value="central">Lapangan Futsal Central</option>
                <option value="senayan">GOR Senayan Mini Soccer</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="slots"
                  className="block text-sm font-medium mb-1"
                >
                  Total Slot
                </label>
                <Input
                  type="number"
                  value={scheduleForm.slots}
                  onChange={(e) =>
                    handleScheduleInputChange("slots", e.target.value)
                  }
                />
              </div>
              <div>
                <label htmlFor="fee" className="block text-sm font-medium mb-1">
                  Fee per Orang
                </label>
                <Input
                  type="number"
                  placeholder="75000"
                  value={scheduleForm.fee}
                  onChange={(e) =>
                    handleScheduleInputChange("fee", e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Tipe Pertandingan
              </label>
              <select
                id="type"
                value={scheduleForm.type}
                onChange={(e) =>
                  handleScheduleInputChange("type", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih tipe</option>
                <option value="open">Open</option>
                <option value="mix">Mix</option>
                <option value="championship">Championship</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="facilities"
                className="block text-sm font-medium mb-1"
              >
                Fasilitas
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(scheduleForm.facilities).map(
                  ([facility, checked]) => (
                    <label
                      key={facility}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          handleFacilityChange(facility, e.target.checked)
                        }
                      />
                      <span className="text-sm">{facility}</span>
                    </label>
                  )
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowScheduleDialog(false)}
              >
                Batal
              </Button>
              <Button size="sm" variant="black" onClick={handleSaveSchedule}>
                Simpan Jadwal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedules Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal & Waktu</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.name}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {formatDate(schedule.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.time} WIB
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{schedule.venue}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm">
                        {schedule.bookedSlots}/{schedule.totalSlots}
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (schedule.bookedSlots / schedule.totalSlots) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    Rp {schedule.revenue.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        schedule.status === "active" ? "default" : "secondary"
                      }
                    >
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditSchedule(schedule.name)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteSchedule(schedule.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
