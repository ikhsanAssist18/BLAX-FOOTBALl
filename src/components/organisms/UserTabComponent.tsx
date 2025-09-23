"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Trophy,
  Star,
} from "lucide-react";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/Table";
import Badge from "@/components/atoms/Badge";
import { UserManagement, Roles } from "@/types/admin";
import { adminService } from "@/utils/admin";
import { useNotifications } from "@/components/organisms/NotificationContainer";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/helper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/Dialog";
import Input from "@/components/atoms/Input";
import ConfirmationModal from "../molecules/ConfirmationModal";
import Pagination from "../atoms/Pagination";
import { TableLoadingSkeleton } from "./LoadingSkeleton";

interface UsersTabProps {
  showSuccess?: (message: string) => void;
  showError?: (title: string, message: string) => void;
}

// Skeleton Components
const UserCardSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/5"></div>
    </div>
    <div className="space-y-2">
      <div className="w-16 h-6 bg-gray-200 rounded"></div>
      <div className="w-20 h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="flex space-x-2">
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardContent className="p-6">
          <div className="pt-4 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function UsersTab() {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [roles, setRoles] = useState<Roles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserManagement | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserManagement | null>(null);

  const { showSuccess, showError } = useNotifications();

  // Form state for add/edit user
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAllUsers(100, 0, searchTerm);
      setUsers(result.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      showError("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const rolesData = await adminService.getRoles();
      setRoles(rolesData);

      // Set default role if no roles exist yet and roles are loaded
      if (rolesData.length > 0 && !userForm.role && !editingUser) {
        setUserForm((prev) => ({ ...prev, role: rolesData[0].id }));
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      showError("Error", "Failed to load roles");
    } finally {
      setRolesLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter (based on recent activity)
    if (statusFilter === "active") {
      filtered = filtered.filter(
        (user) =>
          user.lastPlayed &&
          new Date(user.lastPlayed) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(
        (user) =>
          !user.lastPlayed ||
          new Date(user.lastPlayed) <=
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!userForm.name.trim()) errors.name = "Name is required";
    if (!userForm.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userForm.email))
      errors.email = "Email is invalid";
    if (!userForm.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\d{10,15}$/.test(userForm.phone.replace(/\D/g, ""))) {
      errors.phone = "Phone number must be 10-15 digits";
    }
    if (!userForm.role.trim()) errors.role = "Role is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUserInputChange = (field: string, value: string) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSaveUser = async () => {
    if (!validateForm()) return;

    try {
      setActionLoading("save");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingUser) {
        showSuccess("User updated successfully!");
      } else {
        showSuccess("User created successfully!");
      }

      setShowUserDialog(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      showError("Error", "Failed to save user");
    } finally {
      setActionLoading(null);
    }
  };

  const resetForm = () => {
    setUserForm({
      name: "",
      email: "",
      phone: "",
      role: roles.length > 0 ? roles[0].id : "",
    });
    setFormErrors({});
    setEditingUser(null);
  };

  const handleViewUser = (phone: string) => {
    const user = users.find((u) => u.phone === phone);
    if (user) {
      showSuccess(`Viewing details for ${user.name}`);
    }
  };

  const handleEditUser = (user: UserManagement) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setShowUserDialog(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setActionLoading("delete");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      showSuccess("User deleted successfully!");
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      showError("Error", "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((u) => u.phone));
    }
  };

  const handleOpenUserDialog = () => {
    setShowUserDialog(true);
    if (roles.length === 0) {
      fetchRoles();
    }
  };

  // Helper function to get role name by ID
  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : roleId;
  };

  // Get unique roles for filter
  const uniqueRoles = [...new Set(users.map((u) => u.role))];

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Stats calculation
  const stats = {
    total: users.length,
    active: users.filter(
      (u) =>
        u.lastPlayed &&
        new Date(u.lastPlayed) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    newThisMonth: users.filter(
      (u) => new Date() > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    totalGames: users.reduce((sum, u) => sum + (u.gamesPlayed || 0), 0),
  };

  if (loading) {
    return <TableLoadingSkeleton />;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            User Management
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Kelola user account dan izin akses
          </p>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3">
          <Button
            variant="black"
            size="sm"
            onClick={handleOpenUserDialog}
            className="flex items-center"
          >
            <UserPlus className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
            <span className="hidden md:inline">Tambah User</span>
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
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  New This Month
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.newThisMonth}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Games</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalGames}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
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
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {getRoleName(role)}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
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
              {roleFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Role: {getRoleName(roleFilter)}
                  <button
                    onClick={() => setRoleFilter("all")}
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
        </p>
      </div>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first user"}
              </p>
              {!searchTerm &&
                roleFilter === "all" &&
                statusFilter === "all" && (
                  <Button
                    variant="primary"
                    onClick={handleOpenUserDialog}
                    className="flex items-center mx-auto"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add First User
                  </Button>
                )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Games Played</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="truncate max-w-[200px]">
                            {user.email || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800 border-purple-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {getRoleName(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">
                          {user.gamesPlayed || 0}
                        </span>
                        {(user.gamesPlayed || 0) >= 10 && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                          >
                            VIP
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.lastPlayed ? (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                            {formatDate(user.lastPlayed)}
                          </div>
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.lastPlayed &&
                          new Date(user.lastPlayed) >
                            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {user.lastPlayed &&
                        new Date(user.lastPlayed) >
                          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditUser(user)}
                          className="hover:bg-yellow-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setUserToDelete(user);
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

      {/* Add/Edit User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={userForm.name}
                  onChange={(e) =>
                    handleUserInputChange("name", e.target.value)
                  }
                  placeholder="Enter full name"
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    handleUserInputChange("email", e.target.value)
                  }
                  placeholder="Enter email address"
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) =>
                    handleUserInputChange("phone", e.target.value)
                  }
                  placeholder="Enter phone number"
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role *</label>
                <div className="relative">
                  <select
                    value={userForm.role}
                    onChange={(e) =>
                      handleUserInputChange("role", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.role ? "border-red-500" : "border-gray-300"
                    } ${rolesLoading ? "bg-gray-50" : ""}`}
                    disabled={rolesLoading}
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {rolesLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                {formErrors.role && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                )}
                {rolesLoading && (
                  <p className="text-gray-500 text-sm mt-1">Loading roles...</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowUserDialog(false);
                  resetForm();
                }}
                disabled={actionLoading === "save"}
              >
                Cancel
              </Button>
              <Button
                variant="black"
                size="sm"
                onClick={handleSaveUser}
                disabled={actionLoading === "save" || rolesLoading}
                className="flex items-center"
              >
                {actionLoading === "save" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingUser ? "Updating..." : "Creating..."}
                  </>
                ) : editingUser ? (
                  "Update User"
                ) : (
                  "Create User"
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
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={actionLoading === "delete"}
      />
    </div>
  );
}
