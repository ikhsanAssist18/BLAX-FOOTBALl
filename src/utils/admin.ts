import { apiClient } from "./api";
import {
  AdminUser,
  PolicyVerification,
  UserManagement,
  ContentModeration,
  AdminStats,
} from "@/types/admin";
import { Policy } from "@/types/policy";
import { moderationService } from "./moderation";

class AdminService {
  // Check if user is admin
  async checkAdminStatus(): Promise<{
    isAdmin: boolean;
    accessLevel?: string;
  }> {
    try {
      const result = await apiClient.get("/admin/status");
      return result;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return { isAdmin: false };
    }
  }

  // Get admin dashboard stats
  async getAdminStats(): Promise<AdminStats> {
    try {
      const result = await apiClient.get("/admin/stats");
      return result.data;
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      return {
        totalPolicies: 0,
        pendingVerification: 0,
        totalUsers: 0,
        activeAdmins: 0,
        verificationsToday: 0,
        flaggedContent: 0,
      };
    }
  }

  // Verification Dashboard
  async getPendingPolicies(
    limit?: number,
    offset?: number
  ): Promise<{
    policies: Policy[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append("limit", limit.toString());
      if (offset) queryParams.append("offset", offset.toString());

      const result = await apiClient.get(
        `/admin/policies/pending?${queryParams}`
      );
      return {
        policies: result.data || [],
        pagination: result.pagination || {
          total: 0,
          limit: limit || 20,
          offset: offset || 0,
          hasMore: false,
        },
      };
    } catch (error) {
      console.error("Error fetching pending policies:", error);
      return {
        policies: [],
        pagination: {
          total: 0,
          limit: limit || 20,
          offset: offset || 0,
          hasMore: false,
        },
      };
    }
  }

  async verifyPolicy(
    policyId: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await apiClient.post(
        `/admin/policies/${policyId}/verify`,
        { notes }
      );
      return { success: true };
    } catch (error) {
      console.error("Error verifying policy:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to verify policy",
      };
    }
  }

  async rejectPolicy(
    policyId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await apiClient.post(
        `/admin/policies/${policyId}/reject`,
        { reason }
      );
      return { success: true };
    } catch (error) {
      console.error("Error rejecting policy:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to reject policy",
      };
    }
  }

  // Policy Editing
  async updatePolicy(
    policyId: string,
    updates: Partial<Policy>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await apiClient.put(
        `/admin/policies/${policyId}`,
        updates
      );
      return { success: true };
    } catch (error) {
      console.error("Error updating policy:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update policy",
      };
    }
  }

  async deletePolicy(
    policyId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await apiClient.delete(`/admin/policies/${policyId}`);
      return { success: true };
    } catch (error) {
      console.error("Error deleting policy:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete policy",
      };
    }
  }

  // User Management
  async getAllUsers(
    limit?: number,
    offset?: number,
    search?: string
  ): Promise<{
    users: UserManagement[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append("limit", limit.toString());
      if (offset) queryParams.append("offset", offset.toString());
      if (search) queryParams.append("search", search);

      const result = await apiClient.get(`/admin/users?${queryParams}`);
      return {
        users: result.data || [],
        pagination: result.pagination || {
          total: 0,
          limit: limit || 20,
          offset: offset || 0,
          hasMore: false,
        },
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        users: [],
        pagination: {
          total: 0,
          limit: limit || 20,
          offset: offset || 0,
          hasMore: false,
        },
      };
    }
  }

  async promoteUser(
    userId: string,
    accessLevel: "admin" | "moderator"
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await apiClient.post(`/admin/users/${userId}/promote`, {
        accessLevel,
      });
      return { success: true };
    } catch (error) {
      console.error("Error promoting user:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to promote user",
      };
    }
  }

  async demoteUser(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await apiClient.post(`/admin/users/${userId}/demote`);
      return { success: true };
    } catch (error) {
      console.error("Error demoting user:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to demote user",
      };
    }
  }

  async banUser(
    userId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await apiClient.post(`/admin/users/${userId}/ban`, {
        reason,
      });
      return { success: true };
    } catch (error) {
      console.error("Error banning user:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to ban user",
      };
    }
  }

  // Content Moderation
  async getFlaggedContent(
    limit?: number,
    offset?: number
  ): Promise<{
    content: ContentModeration[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    try {
      const result = await moderationService.getFlaggedContent(limit, offset);
      return {
        content: result.data || [],
        pagination: result.pagination,
      };
    } catch (error) {
      console.error("Error fetching flagged content:", error);
      return {
        content: [],
        pagination: {
          total: 0,
          limit: limit || 20,
          offset: offset || 0,
          hasMore: false,
        },
      };
    }
  }

  async moderateContent(
    contentId: string,
    action: "approve" | "reject" | "flag" | "ban",
    reason?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await moderationService.updateModerationAction(
        contentId,
        action,
        reason
      );
      return result;
    } catch (error) {
      console.error("Error moderating content:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to moderate content",
      };
    }
  }
}

export const adminService = new AdminService();
