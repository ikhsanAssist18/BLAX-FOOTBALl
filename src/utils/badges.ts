import { apiClient } from "./api";

export interface BadgeRequirement {
  id: string;
  badge_level: "bronze" | "silver" | "gold" | "diamond";
  min_contributions: number;
  min_verified: number;
  min_accuracy: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  current_badge: "bronze" | "silver" | "gold" | "diamond";
  earned_at: string;
  created_at: string;
  updated_at: string;
}

export interface BadgeProgress {
  currentBadge: string;
  nextBadge?: string;
  progress: number;
  requirements: BadgeRequirement;
  userStats: {
    total_points: number;
    contributions_count: number;
    verified_count: number;
    accuracy_rate: number;
  };
}

class BadgeService {
  // Get all badge requirements
  async getBadgeRequirements(): Promise<{
    success: boolean;
    data: BadgeRequirement[];
    error?: string;
  }> {
    try {
      const result = await apiClient.get("/badges/requirements");
      return result;
    } catch (error) {
      console.error("Error fetching badge requirements:", error);
      return {
        success: false,
        data: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch badge requirements",
      };
    }
  }

  // Update badge requirements (admin only)
  async updateBadgeRequirements(
    badgeLevel: string,
    requirements: {
      min_contributions: number;
      min_verified: number;
      min_accuracy: number;
    }
  ): Promise<{
    success: boolean;
    data?: BadgeRequirement;
    error?: string;
  }> {
    try {
      const result = await apiClient.post("/badges/requirements", {
        badge_level: badgeLevel,
        ...requirements,
      });
      return result;
    } catch (error) {
      console.error("Error updating badge requirements:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update badge requirements",
      };
    }
  }

  // Get user badge information
  async getUserBadge(userId: string): Promise<{
    success: boolean;
    data?: {
      badge: UserBadge;
      progress: BadgeProgress | null;
      requirements: BadgeRequirement[];
    };
    error?: string;
  }> {
    try {
      const result = await apiClient.get(`/badges/user/${userId}`);
      return result;
    } catch (error) {
      console.error("Error fetching user badge:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch user badge",
      };
    }
  }
}

export const badgeService = new BadgeService();
