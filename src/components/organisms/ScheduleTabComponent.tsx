"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Eye,
  MoreHorizontal,
  Download,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
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
import { masterDataService, Rule } from "@/utils/masterData";
import { formatDate } from "@/lib/helper";
import ConfirmationModal from "../molecules/ConfirmationModal";
import Pagination from "../atoms/Pagination";
import { TableLoadingSkeleton } from "./LoadingSkeleton";
import ImageUpload from "../atoms/ImageUpload";

interface ScheduleTabProps {
  showError: (title: string, message: string) => void;
  showSuccess: (message: string) => void;
}

// Type definitions for venue and facility
interface Venue {
  id: string;
  name: string;
  address?: string;
  // Add other venue properties as needed
}

interface Facility {
  id: string;
  name: string;
  description?: string;
  // Add other facility properties as needed
}

export default function ScheduleTab({
  showError,
  showSuccess,
}: ScheduleTabProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleOverview[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<
    ScheduleOverview[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<ScheduleOverview | null>(null);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [venueFilter, setVenueFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] =
    useState<ScheduleOverview | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // New states for venues and facilities
  const [venues, setVenues] = useState<Venue[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(false);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(false);
  const [isLoadingRules, setIsLoadingRules] = useState(false);

  // Form states for new/edit schedule - removed imageUrl
  const [scheduleForm, setScheduleForm] = useState({
    name: "",
    date: "",
    time: "",
    venueId: "",
    totalTeams: "4",
    totalSlots: "16",
    feePlayer: "",
    feeGk: "",
    typeEvent: "",
    typeMatch: "",
    image: null as File | null,
    facilityIds: [] as string[],
    ruleIds: [] as string[],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchScheduleOverview();
    fetchVenues();
    fetchFacilities();
    fetchRules();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [schedules, searchTerm, statusFilter, venueFilter]);

  const fetchScheduleOverview = async () => {
    try {
      setIsLoading(true);
      const result = await adminService.scheduleOverview();
      setSchedules(result);
    } catch (error) {
      console.error("Error fetching schedule overview:", error);
      showError("Error", "Failed to load schedule overview");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      setIsLoadingVenues(true);
      const response = await masterDataService.getVenues("");
      setVenues(response);
    } catch (error) {
      console.error("Error fetching venues:", error);
      showError("Error", "Failed to load venues");
    } finally {
      setIsLoadingVenues(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      setIsLoadingFacilities(true);
      const response = await masterDataService.getFacilities("", 1, 100);
      setFacilities(response.data);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      showError("Error", "Failed to load facilities");
    } finally {
      setIsLoadingFacilities(false);
    }
  };

  const fetchRules = async () => {
    try {
      setIsLoadingRules(true);
      const response = await masterDataService.getRules(
        searchTerm,
        currentPage,
        10
      );
      setRules(response);
    } catch (error) {
      console.error("Error fetching rules:", error);
      showError("Error", "Failed to load rules");
    } finally {
      setIsLoadingRules(false);
    }
  };

  const filterSchedules = () => {
    let filtered = schedules;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (schedule) =>
          schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (schedule) => schedule.status === statusFilter
      );
    }

    // Venue filter
    if (venueFilter !== "all") {
      filtered = filtered.filter((schedule) => schedule.venue === venueFilter);
    }

    setFilteredSchedules(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // All fields are now required
    if (!scheduleForm.name.trim()) errors.name = "Schedule name is required";
    if (!scheduleForm.date) errors.date = "Date is required";
    if (!scheduleForm.time) errors.time = "Time is required";
    if (!scheduleForm.venueId) errors.venueId = "Venue is required";
    if (!scheduleForm.totalSlots) errors.totalSlots = "Total slots is required";
    if (!scheduleForm.feePlayer) errors.feePlayer = "Player fee is required";
    if (!scheduleForm.feeGk) errors.feeGk = "Goalkeeper fee is required";
    if (!scheduleForm.typeEvent) errors.typeEvent = "Event type is required";
    if (!scheduleForm.typeMatch) errors.typeMatch = "Match type is required";
    if (!scheduleForm.image) errors.image = "Match image is required";
    if (scheduleForm.facilityIds.length === 0)
      errors.facilityIds = "At least one facility must be selected";
    if (scheduleForm.ruleIds.length === 0)
      errors.ruleIds = "At least one rule must be selected";

    // Validate numeric fields
    if (scheduleForm.feePlayer && isNaN(Number(scheduleForm.feePlayer))) {
      errors.feePlayer = "Player fee must be a number";
    }
    if (scheduleForm.feeGk && isNaN(Number(scheduleForm.feeGk))) {
      errors.feeGk = "Goalkeeper fee must be a number";
    }
    if (scheduleForm.totalSlots && isNaN(Number(scheduleForm.totalSlots))) {
      errors.totalSlots = "Total slots must be a number";
    }

    // Additional validation rules
    if (
      scheduleForm.totalSlots &&
      (Number(scheduleForm.totalSlots) < 8 ||
        Number(scheduleForm.totalSlots) > 22)
    ) {
      errors.totalSlots = "Total slots must be between 8 and 22";
    }
    if (scheduleForm.feePlayer && Number(scheduleForm.feePlayer) < 0) {
      errors.feePlayer = "Player fee must be a positive number";
    }
    if (scheduleForm.feeGk && Number(scheduleForm.feeGk) < 0) {
      errors.feeGk = "Goalkeeper fee must be a positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleScheduleInputChange = (field: string, value: string) => {
    setScheduleForm((prev) => {
      const updatedForm = {
        ...prev,
        [field]: value,
      };

      // Auto-calculate total slots when match type or total teams changes
      if (field === "typeMatch" || field === "totalTeams") {
        const slotsPerTeam = getSlotsPerTeam(
          field === "typeMatch" ? value : prev.typeMatch
        );
        const teams = Number(field === "totalTeams" ? value : prev.totalTeams);

        if (slotsPerTeam && teams) {
          updatedForm.totalSlots = (slotsPerTeam * teams).toString();
        }
      }

      return updatedForm;
    });

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Helper function to get slots per team based on match type
  const getSlotsPerTeam = (matchType: string): number => {
    switch (matchType) {
      case "Futsal":
        return 5;
      case "Mini Soccer":
        return 7;
      case "Football":
        return 11;
      default:
        return 0;
    }
  };

  const handleFacilityChange = (facilityId: string, checked: boolean) => {
    setScheduleForm((prev) => ({
      ...prev,
      facilityIds: checked
        ? [...prev.facilityIds, facilityId]
        : prev.facilityIds.filter((id) => id !== facilityId),
    }));

    // Clear facility error when user selects/deselects
    if (formErrors.facilityIds) {
      setFormErrors((prev) => ({ ...prev, facilityIds: "" }));
    }
  };

  const handleRuleChange = (ruleId: string, checked: boolean) => {
    setScheduleForm((prev) => ({
      ...prev,
      ruleIds: checked
        ? [...prev.ruleIds, ruleId]
        : prev.ruleIds.filter((id) => id !== ruleId),
    }));

    // Clear rule error when user selects/deselects
    if (formErrors.ruleIds) {
      setFormErrors((prev) => ({ ...prev, ruleIds: "" }));
    }
  };

  const handleSaveSchedule = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields
      formData.append("name", scheduleForm.name);
      formData.append("date", scheduleForm.date);
      formData.append("time", scheduleForm.time);
      formData.append("venueId", scheduleForm.venueId);
      formData.append("totalTeams", scheduleForm.totalTeams);
      formData.append("totalSlots", scheduleForm.totalSlots);
      formData.append("feePlayer", scheduleForm.feePlayer);
      formData.append("feeGk", scheduleForm.feeGk);
      formData.append("typeEvent", scheduleForm.typeEvent);
      formData.append("typeMatch", scheduleForm.typeMatch);

      // Add image file
      if (scheduleForm.image) {
        formData.append("image", scheduleForm.image);
      }

      // Add facility and rule IDs
      scheduleForm.facilityIds.forEach((id) =>
        formData.append("facilityIds[]", id)
      );
      scheduleForm.ruleIds.forEach((id) => formData.append("ruleIds[]", id));

      // Simulate API call with FormData
      await adminService.createSchedule(formData);

      if (editingSchedule) {
        showSuccess("Schedule updated successfully!");
      } else {
        showSuccess("Schedule created successfully!");
      }

      setShowScheduleDialog(false);
      resetForm();
      fetchScheduleOverview();
    } catch (error) {
      showError("Error", "Failed to save schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setScheduleForm({
      name: "",
      date: "",
      time: "",
      venueId: "",
      totalTeams: "4",
      totalSlots: "16",
      feePlayer: "",
      feeGk: "",
      typeEvent: "",
      typeMatch: "",
      image: null,
      facilityIds: [],
      ruleIds: [],
    });
    setFormErrors({});
    setEditingSchedule(null);
  };

  const handleEditSchedule = (schedule: ScheduleOverview) => {
    setEditingSchedule(schedule);

    // Find venue ID by name (you might want to include venueId in ScheduleOverview type)
    const venue = venues.find((v) => v.name === schedule.venue);

    setScheduleForm({
      name: schedule.name,
      date: schedule.date,
      time: schedule.time,
      venueId: venue?.id || "",
      totalTeams: String(schedule.team),
      totalSlots: schedule.totalSlots.toString(),
      feePlayer: schedule.feePlayer.toString(),
      feeGk: schedule.feeGk.toString(),
      typeEvent: schedule.typeEvent,
      typeMatch: schedule.typeMatch,
      image: null,
      facilityIds: schedule.facilities
        ? schedule.facilities.map((f: any) =>
            typeof f === "string" ? f : f.id
          )
        : [],
      ruleIds: schedule.rules
        ? schedule.rules.map((r: any) => (typeof r === "string" ? r : r.id))
        : [],
    });
    setShowScheduleDialog(true);
  };

  console.log("schedule form", scheduleForm);

  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 500));
      await adminService.deleteSchedule(scheduleToDelete.id);
      showSuccess("Schedule deleted successfully!");
      setShowDeleteConfirm(false);
      setScheduleToDelete(null);
      fetchScheduleOverview();
    } catch (error) {
      showError("Error", "Failed to delete schedule");
    }
  };

  // Get unique venues for filter
  const uniqueVenues = [...new Set(schedules.map((s) => s.venue))];

  // Pagination
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchedules = filteredSchedules.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Stats calculation
  const stats = {
    total: schedules.length,
    active: schedules.filter((s) => s.status === "active").length,
    completed: schedules.filter((s) => s.status === "completed").length,
    totalRevenue: schedules.reduce((sum, s) => sum + s.revenue, 0),
  };

  if (isLoading) {
    return <TableLoadingSkeleton />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Manajemen Jadwal
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Kelola jadwal pertandingan sepak bola dan booking
          </p>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          {selectedSchedules.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="flex items-center"
            >
              <Trash2 className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">
                Hapus ({selectedSchedules.length})
              </span>
              <span className="md:hidden">({selectedSchedules.length})</span>
            </Button>
          )}

          <Button
            variant="black"
            size="sm"
            onClick={() => setShowScheduleDialog(true)}
            className="flex items-center"
          >
            <Plus className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
            <span className="hidden md:inline">Tambah Jadwal</span>
            <span className="md:hidden">Tambah</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Schedules
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
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
            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Schedules
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.completed}
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
            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  Rp {(stats.totalRevenue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="pt-4 flex-1 relative">
              <Search className="absolute left-3 top-9 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={venueFilter}
                onChange={(e) => setVenueFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Venues</option>
                {uniqueVenues.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || statusFilter !== "all" || venueFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mr-2">Active filters:</p>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {venueFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Venue: {venueFilter}
                  <button
                    onClick={() => setVenueFilter("all")}
                    className="ml-1 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredSchedules.length)} of{" "}
          {filteredSchedules.length} schedules
        </p>
      </div>

      {/* Schedules Table */}
      <Card>
        <CardContent className="p-0">
          {filteredSchedules.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No schedules found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all" || venueFilter !== "all"
                  ? "Try adjusting your search criteria"
                  : "Get started by creating your first schedule"}
              </p>
              {!searchTerm &&
                statusFilter === "all" &&
                venueFilter === "all" && (
                  <Button
                    variant="primary"
                    onClick={() => setShowScheduleDialog(true)}
                    className="flex items-center mx-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Schedule
                  </Button>
                )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSchedules.map((schedule) => (
                  <TableRow key={schedule.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {schedule.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(schedule.date)} • {schedule.time} WIB
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm">{schedule.venue}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm">
                          {Math.ceil(schedule.totalSlots / 5)} teams
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({schedule.totalSlots} slots)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium">
                          {schedule.bookedSlots}/{schedule.totalSlots}
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (schedule.bookedSlots / schedule.totalSlots) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round(
                            (schedule.bookedSlots / schedule.totalSlots) * 100
                          )}
                          %
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-green-600">
                        Rp {schedule.revenue.toLocaleString("id-ID")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          schedule.status === "active" ? "default" : "secondary"
                        }
                        className={
                          schedule.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {schedule.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditSchedule(schedule)}
                          className="hover:bg-yellow-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setScheduleToDelete(schedule);
                            setShowDeleteConfirm(true);
                          }}
                          className="hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Edit Jadwal" : "Tambah Jadwal Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Jadwal <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={scheduleForm.name}
                  onChange={(e) =>
                    handleScheduleInputChange("name", e.target.value)
                  }
                  placeholder="Enter schedule name"
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) =>
                    handleScheduleInputChange("date", e.target.value)
                  }
                  className={formErrors.date ? "border-red-500" : ""}
                />
                {formErrors.date && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Jam <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) =>
                    handleScheduleInputChange("time", e.target.value)
                  }
                  className={formErrors.time ? "border-red-500" : ""}
                />
                {formErrors.time && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>
                )}
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Venue <span className="text-red-500">*</span>
              </label>
              <select
                value={scheduleForm.venueId}
                onChange={(e) =>
                  handleScheduleInputChange("venueId", e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.venueId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoadingVenues}
              >
                <option value="">
                  {isLoadingVenues ? "Loading venues..." : "Select venue"}
                </option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
              {formErrors.venueId && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.venueId}
                </p>
              )}
            </div>

            {/* Teams and Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Total Teams <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={scheduleForm.totalTeams}
                  onChange={(e) =>
                    handleScheduleInputChange("totalTeams", e.target.value)
                  }
                  min="2"
                  max="10"
                  className={formErrors.totalTeams ? "border-red-500" : ""}
                />
                {formErrors.totalTeams && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.totalTeams}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Total Slots
                </label>
                <Input
                  type="number"
                  value={scheduleForm.totalSlots}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-calculated based on match type and total teams
                  {scheduleForm.typeMatch && (
                    <span className="block">
                      ({getSlotsPerTeam(scheduleForm.typeMatch)} slots per team
                      × {scheduleForm.totalTeams} teams ={" "}
                      {scheduleForm.totalSlots} slots)
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Fees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Player Fee (Rp) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="75000"
                  value={scheduleForm.feePlayer}
                  onChange={(e) =>
                    handleScheduleInputChange("feePlayer", e.target.value)
                  }
                  className={formErrors.feePlayer ? "border-red-500" : ""}
                />
                {formErrors.feePlayer && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.feePlayer}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Goalkeeper Fee (Rp) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={scheduleForm.feeGk}
                  onChange={(e) =>
                    handleScheduleInputChange("feeGk", e.target.value)
                  }
                  className={formErrors.feeGk ? "border-red-500" : ""}
                />
                {formErrors.feeGk && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.feeGk}
                  </p>
                )}
              </div>
            </div>

            {/* Event and Match Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={scheduleForm.typeEvent}
                  onChange={(e) =>
                    handleScheduleInputChange("typeEvent", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.typeEvent ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select event type</option>
                  <option value="Open">Open</option>
                  <option value="Mix">Mix</option>
                  <option value="Championship">Championship</option>
                  <option value="Tournament">Tournament</option>
                </select>
                {formErrors.typeEvent && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.typeEvent}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Match Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={scheduleForm.typeMatch}
                  onChange={(e) =>
                    handleScheduleInputChange("typeMatch", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.typeMatch ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select match type</option>
                  <option value="Futsal">Futsal</option>
                  <option value="Mini Soccer">Mini Soccer</option>
                  <option value="Football">Football</option>
                </select>
                {formErrors.typeMatch && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.typeMatch}
                  </p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Match Image <span className="text-red-500">*</span>
              </label>
              <ImageUpload
                value={scheduleForm.image ?? undefined}
                onChange={(file) => {
                  setScheduleForm((prev) => ({
                    ...prev,
                    image: file,
                  }));
                  // Clear image error when user uploads file
                  if (formErrors.image) {
                    setFormErrors((prev) => ({ ...prev, image: "" }));
                  }
                }}
                error={formErrors.image}
                disabled={isSubmitting}
                maxSize={5}
                acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
              />
              {formErrors.image && (
                <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
              )}
            </div>

            {/* Facilities */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Fasilitas <span className="text-red-500">*</span>
              </label>
              {isLoadingFacilities ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="p-3 border rounded-lg animate-pulse"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {facilities.map((facility) => (
                    <label
                      key={facility.id}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={scheduleForm.facilityIds.includes(facility.id)}
                        onChange={(e) =>
                          handleFacilityChange(facility.id, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium">
                        {facility.name}
                      </span>
                      {facility.description && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({facility.description})
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
              {formErrors.facilityIds && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.facilityIds}
                </p>
              )}
              {facilities.length === 0 && !isLoadingFacilities && (
                <p className="text-gray-500 text-sm">
                  No facilities available. Please add facilities in Master Data
                  first.
                </p>
              )}
            </div>

            {/* Rules */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Rules <span className="text-red-500">*</span>
              </label>
              {isLoadingRules ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="p-3 border rounded-lg animate-pulse"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {rules.map((rule) => (
                    <label
                      key={rule.id}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={scheduleForm.ruleIds.includes(rule.id)}
                        onChange={(e) =>
                          handleRuleChange(rule.id, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium">
                        {rule.description}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {formErrors.ruleIds && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.ruleIds}
                </p>
              )}
              {rules.length === 0 && !isLoadingRules && (
                <p className="text-gray-500 text-sm">
                  No rules available. Please add rules in Master Data first.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowScheduleDialog(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="black"
                size="sm"
                onClick={handleSaveSchedule}
                disabled={
                  isSubmitting || isLoadingVenues || isLoadingFacilities
                }
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingSchedule ? "Updating..." : "Creating..."}
                  </>
                ) : editingSchedule ? (
                  "Update Schedule"
                ) : (
                  "Create Schedule"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setScheduleToDelete(null);
        }}
        onConfirm={handleDeleteSchedule}
        title="Delete Schedule"
        message={`Are you sure you want to delete "${scheduleToDelete?.name}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
