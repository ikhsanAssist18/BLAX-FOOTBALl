import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Crown,
  Award,
  Ban,
  Loader2,
} from "lucide-react";
import { UserManagement } from "@/types/admin";
import { adminService } from "@/utils/admin";
import { useNotifications } from "./NotificationContainer";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import SearchBar from "../molecules/SearchBar";
import ConfirmationModal from "../molecules/ConfirmationModal";

interface UserManagementInterfaceProps {
  accessLevel: string;
}

export default function UserManagementInterface({
  accessLevel,
}: UserManagementInterfaceProps) {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "promote" | "demote" | "ban";
    userId: string;
    userName: string;
    accessLevel?: "admin" | "moderator";
  } | null>(null);
  const [banReason, setBanReason] = useState("");
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAllUsers(50, 0, searchTerm);
      setUsers(result.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      showError("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (
    userId: string,
    accessLevel: "admin" | "moderator"
  ) => {
    if (!confirmAction) return;

    try {
      setActionLoading(confirmAction.userId);
      const result = await adminService.promoteUser(
        confirmAction.userId,
        confirmAction.accessLevel!
      );

      if (result.success) {
        showSuccess(
          "User Promoted",
          `User has been promoted to ${confirmAction.accessLevel}`
        );
        fetchUsers();
        setConfirmAction(null);
      } else {
        showError("Promotion Failed", result.error || "Failed to promote user");
      }
    } catch (error) {
      console.error("Error promoting user:", error);
      showError("Error", "An unexpected error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemoteUser = async (userId: string) => {
    if (!confirmAction) return;

    try {
      setActionLoading(confirmAction.userId);
      const result = await adminService.demoteUser(confirmAction.userId);

      if (result.success) {
        showSuccess("User Demoted", "User has been demoted to regular user");
        fetchUsers();
        setConfirmAction(null);
      } else {
        showError("Demotion Failed", result.error || "Failed to demote user");
      }
    } catch (error) {
      console.error("Error demoting user:", error);
      showError("Error", "An unexpected error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBanUser = async (userId: string) => {
    const reason = prompt("Please provide a reason for banning this user:");
    if (!reason) return;
    if (!confirmAction || !banReason.trim()) {
      showError(
        "Ban Reason Required",
        "Please provide a reason for banning this user"
      );
      return;
    }

    try {
      setActionLoading(confirmAction.userId);
      const result = await adminService.banUser(
        confirmAction.userId,
        banReason
      );

      if (result.success) {
        showSuccess("User Banned", "User has been banned from the platform");
        fetchUsers();
        setConfirmAction(null);
        setBanReason("");
      } else {
        showError("Ban Failed", result.error || "Failed to ban user");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      showError("Error", "An unexpected error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePromoteClick = (
    user: UserManagement,
    accessLevel: "admin" | "moderator"
  ) => {
    setConfirmAction({
      type: "promote",
      userId: user.id,
      userName: user.user_profiles?.name || user.email,
      accessLevel,
    });
  };

  const handleDemoteClick = (user: UserManagement) => {
    setConfirmAction({
      type: "demote",
      userId: user.id,
      userName: user.user_profiles?.name || user.email,
    });
  };

  const handleBanClick = (user: UserManagement) => {
    setConfirmAction({
      type: "ban",
      userId: user.id,
      userName: user.user_profiles?.name || user.email,
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            <Crown className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "moderator":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <Shield className="h-3 w-3 mr-1" />
            Moderator
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="bg-gray-100 text-gray-800">
            <Users className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <Badge variant="default" className="bg-blue-100 text-blue-800 w-fit">
          {users.length} Total Users
        </Badge>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search users by name or email..."
        />
      </div>

      {/* Users List */}
      <div className="grid gap-6">
        {users.map((user) => {
          return (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {(user.user_profiles?.name || user.email)
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {user.user_profiles?.name || "Unknown User"}
                      </h3>
                      {getRoleBadge(accessLevel)}
                    </div>

                    <p className="text-gray-600 truncate">{user.email}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span>
                        Joined{" "}
                        {new Date(
                          user.admin_users?.granted_at || ""
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      {user.last_sign_in_at && (
                        <span>
                          Last active{" "}
                          {new Date(user.last_sign_in_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:ml-6">
                  {accessLevel === "superadmin" && (
                    <>
                      <Button
                        onClick={() => handlePromoteClick(user, "admin")}
                        disabled={actionLoading === user.id}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {actionLoading === user.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Crown className="h-4 w-4 mr-2" />
                        )}
                        Promote to Admin
                      </Button>

                      <button
                        onClick={() => handleDemoteClick(user)}
                        disabled={actionLoading === user.id}
                        className="font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center bg-red-500 hover:bg-red-600 text-white border-2 border-white/20 hover:border-white/40 backdrop-blur-sm py-2 px-4 text-sm"
                      >
                        {actionLoading === user.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <UserX className="h-4 w-4 mr-2" />
                        )}
                        Demote
                      </button>
                    </>
                  )}

                  {accessLevel === "admin" && (
                    <button
                      onClick={() => handleDemoteClick(user)}
                      disabled={actionLoading === user.id}
                      className="font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center bg-red-500 hover:bg-red-600 text-white border-2 border-white/20 hover:border-white/40 backdrop-blur-sm py-2 px-4 text-sm"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <UserX className="h-4 w-4 mr-2" />
                      )}
                      Demote
                    </button>
                  )}

                  {(accessLevel === "admin" ||
                    accessLevel === "superadmin") && (
                    <button
                      onClick={() => handleBanClick(user)}
                      disabled={actionLoading === user.id}
                      className="font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center bg-red-500 hover:bg-red-600 text-white border-2 border-white/20 hover:border-white/40 backdrop-blur-sm py-2 px-4 text-sm"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Ban className="h-4 w-4 mr-2" />
                      )}
                      Ban User
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmAction}
        onClose={() => {
          setConfirmAction(null);
          setBanReason("");
        }}
        onConfirm={() => {
          if (confirmAction?.type === "promote") {
            handlePromoteUser(confirmAction.userId, confirmAction.accessLevel!);
          } else if (confirmAction?.type === "demote") {
            handleDemoteUser(confirmAction.userId);
          } else if (confirmAction?.type === "ban") {
            handleBanUser(confirmAction.userId);
          }
        }}
        title={
          confirmAction?.type === "promote"
            ? "Promote User"
            : confirmAction?.type === "demote"
            ? "Demote User"
            : "Ban User"
        }
        message={
          confirmAction?.type === "promote"
            ? `Are you sure you want to promote "${confirmAction?.userName}" to ${confirmAction?.accessLevel}? This will grant them additional privileges.`
            : confirmAction?.type === "demote"
            ? `Are you sure you want to demote "${confirmAction?.userName}" to regular user? This will remove their admin privileges.`
            : `Are you sure you want to ban "${confirmAction?.userName}" from the platform? This action will prevent them from accessing the system.`
        }
        type={confirmAction?.type === "ban" ? "danger" : "warning"}
        confirmText={
          confirmAction?.type === "promote"
            ? "Promote"
            : confirmAction?.type === "demote"
            ? "Demote"
            : "Ban User"
        }
        isLoading={!!actionLoading}
      />

      {/* Ban Reason Modal */}
      {confirmAction?.type === "ban" && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setConfirmAction(null);
              setBanReason("");
            }}
          />

          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ban Reason Required
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please provide a reason for banning this user:
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter the reason for banning this user..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => {
                  setConfirmAction(null);
                  setBanReason("");
                }}
                variant="outline"
              >
                Cancel
              </Button>

              <Button
                onClick={() => handleBanUser(confirmAction.userId)}
                disabled={!banReason.trim() || !!actionLoading}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Banning...
                  </>
                ) : (
                  "Ban User"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {users.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Users Found
          </h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
