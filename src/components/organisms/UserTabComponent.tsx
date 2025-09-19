"use client";

import React, { useEffect, useState } from "react";
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
import { UserManagement } from "@/types/admin";
import { adminService } from "@/utils/admin";
import { useNotifications } from "@/components/organisms/NotificationContainer";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/helper";

interface UsersTabProps {
  showSuccess?: (message: string) => void;
  showError?: (title: string, message: string) => void;
}

export default function UsersTab() {
  const [users, setUsers] = useState<UserManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
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

  const handleViewUser = (phone: string) => {
    const user = users.find((u) => u.phone === phone);
    if (user && showSuccess) {
      showSuccess(`Viewing details for ${user.name}`);
    }
    console.log("Viewing user:", phone);
  };

  const handleEditUser = (phone: string) => {
    const user = users.find((u) => u.phone === phone);
    if (user && showSuccess) {
      showSuccess(`Editing user ${user.name}`);
    }
    console.log("Editing user:", phone);
  };

  const handleExportUsers = () => {
    // Here you would typically call an API to export users data
    console.log("Exporting users data...");
    if (showSuccess) {
      showSuccess("Users data exported successfully!");
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Management Users</h2>
        <div className="flex space-x-2">
          <Button variant="black" size="sm" onClick={handleExportUsers}>
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Games Played</TableHead>
                <TableHead>Last Play</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.phone}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{user.gamesPlayed ? user.gamesPlayed : "-"}</span>
                      {user.gamesPlayed >= 10 && (
                        <Badge variant="outline" className="text-xs">
                          Eligible for voucher
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastPlayed ? formatDate(user.lastPlayed) : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUser(user.phone)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="black"
                        onClick={() => handleEditUser(user.phone)}
                      >
                        Edit
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
