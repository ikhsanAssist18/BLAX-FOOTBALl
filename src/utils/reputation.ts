import { apiClient } from "./api";

export interface ReputationActivity {
  id: string;
  user_id: string;
  activity_type:
    | "policy_submission"
    | "policy_verification"
    | "policy_approval"
    | "accuracy_bonus";
  points_earned: number;
  policy_id?: string;
  description?: string;
  created_at: string;
  policies?: {
    app_name: string;
    developer?: string;
  };
}

export interface UserReputation {
  id: string;
  user_id: string;
  total_points: number;
  contributions_count: number;
  verified_count: number;
  accuracy_rate: number;
  specialties: string[];
  created_at: string;
  updated_at: string;
  user_badges?: {
    current_badge: string;
    earned_at: string;
  };
}

class ReputationService {
  // Get user reputation activities
  async getReputationActivities(
    userId?: string,
    limit?: number,
    offset?: number
  ): Promise<{
    success: boolean;
    data: ReputationActivity[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
    error?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (userId) queryParams.append("userId", userId);
      if (limit) queryParams.append("limit", limit.toString());
      if (offset) queryParams.append("offset", offset.toString());

      const result = await apiClient.get(
        `/reputation/activities?${queryParams}`
      );
      return result;
    } catch (error) {
      console.error("Error fetching reputation activities:", error);
      return {
        success: false,
        data: [],
        pagination: {
          total: 0,
          limit: limit || 20,
          offset: offset || 0,
          hasMore: false,
        },
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch reputation activities",
      };
    }
  }

  // Add reputation activity (admin only)
  async addReputationActivity(activity: {
    user_id: string;
    activity_type:
      | "policy_submission"
      | "policy_verification"
      | "policy_approval"
      | "accuracy_bonus";
    points_earned: number;
    policy_id?: string;
    description?: string;
  }): Promise<{
    success: boolean;
    data?: ReputationActivity;
    error?: string;
  }> {
    try {
      const result = await apiClient.post("/reputation/activities", activity);
      return result;
    } catch (error) {
      console.error("Error adding reputation activity:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to add reputation activity",
      };
    }
  }

  // Get user reputation data
  async getUserReputation(userId: string): Promise<{
    success: boolean;
    data?: UserReputation;
    error?: string;
  }> {
    try {
      const result = await apiClient.get(`/reputation/user/${userId}`);
      return result;
    } catch (error) {
      console.error("Error fetching user reputation:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user reputation",
      };
    }
  }

  // Update user reputation (admin only)
  async updateUserReputation(userId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const result = await apiClient.put(`/reputation/user/${userId}`, {});
      return result;
    } catch (error) {
      console.error("Error updating user reputation:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user reputation",
      };
    }
  }
}

export const reputationService = new ReputationService();
