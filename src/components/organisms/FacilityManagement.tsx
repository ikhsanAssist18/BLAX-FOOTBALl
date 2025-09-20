"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Settings, Search } from "lucide-react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { Card, CardContent } from "../atoms/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../atoms/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../atoms/Table";
import ConfirmationModal from "../molecules/ConfirmationModal";
import { useNotifications } from "./NotificationContainer";
import {
  masterDataService,
  Facility,
  FacilityPayload,
} from "@/utils/masterData";

export default function FacilityManagement() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    facility: Facility | null;
  }>({ isOpen: false, facility: null });

  const [formData, setFormData] = useState<FacilityPayload>({
    name: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<FacilityPayload>>({});

  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchFacilities();
  }, [searchTerm, currentPage]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await masterDataService.getFacilities(
        searchTerm,
        currentPage,
        10
      );
      setFacilities(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (error) {
      console.error("Error fetching facilities:", error);
      showError("Error", "Failed to load facilities");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<FacilityPayload> = {};

    if (!formData.name.trim()) {
      errors.name = "Facility name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Facility name must be at least 2 characters long";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      if (editingFacility) {
        await masterDataService.updateFacility(editingFacility.id, formData);
        showSuccess("Success", "Facility updated successfully");
      } else {
        await masterDataService.createFacility(formData);
        showSuccess("Success", "Facility created successfully");
      }

      handleCloseDialog();
      fetchFacilities();
    } catch (error) {
      console.error("Error saving facility:", error);
      showError(
        "Error",
        editingFacility
          ? "Failed to update facility"
          : "Failed to create facility"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
    });
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.facility) return;

    try {
      await masterDataService.deleteFacility(deleteConfirmation.facility.id);
      showSuccess("Success", "Facility deleted successfully");
      setDeleteConfirmation({ isOpen: false, facility: null });
      fetchFacilities();
    } catch (error) {
      console.error("Error deleting facility:", error);
      showError("Error", "Failed to delete facility");
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingFacility(null);
    setFormData({ name: "" });
    setFormErrors({});
  };

  const handleInputChange = (field: keyof FacilityPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">
          Facility Management
        </h2>
        <Button
          variant="black"
          size="sm"
          onClick={() => setShowDialog(true)}
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Facility
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          [...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : facilities.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No facilities found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Get started by adding your first facility"}
                </p>
                {!searchTerm && (
                  <Button
                    variant="black"
                    size="sm"
                    onClick={() => setShowDialog(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Facility
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          facilities.map((facility) => (
            <Card
              key={facility.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {facility.createdAt
                        ? `Added ${new Date(
                            facility.createdAt
                          ).toLocaleDateString()}`
                        : "Recently added"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(facility)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      setDeleteConfirmation({
                        isOpen: true,
                        facility: facility,
                      })
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFacility ? "Edit Facility" : "Add New Facility"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facility Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter facility name"
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Examples: Air Mineral, Rompi, Bola, Shower, Wasit
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCloseDialog}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="black"
                size="sm"
                disabled={submitting}
              >
                {submitting
                  ? editingFacility
                    ? "Updating..."
                    : "Creating..."
                  : editingFacility
                  ? "Update Facility"
                  : "Create Facility"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, facility: null })}
        onConfirm={handleDelete}
        title="Delete Facility"
        message={`Are you sure you want to delete "${deleteConfirmation.facility?.name}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
