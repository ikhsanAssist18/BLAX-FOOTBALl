import { User } from "@/types";
import { apiClient } from "./api";

export interface LeaderboardUser {
  id: string;
  username: string;
  name: string;
  contributions: number;
  verified: number;
  accuracy: number;
  badge: "bronze" | "silver" | "gold" | "diamond";
  joinDate: string;
  avatar: string;
  specialties: string[];
  rank: number;
  points: number;
  user: User;
}

export interface LeaderboardStats {
  total: number;
  diamond: number;
  gold: number;
  silver: number;
  bronze: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardUser[];
  stats: LeaderboardStats;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

class LeaderboardService {
  async getLeaderboard(
    limit?: number,
    offset?: number,
    search?: string,
    badgeFilter?: string,
    sortBy?: string
  ): Promise<LeaderboardResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append("limit", limit.toString());
      if (offset) queryParams.append("offset", offset.toString());
      if (search) queryParams.append("search", search);
      if (badgeFilter && badgeFilter !== "all")
        queryParams.append("badge", badgeFilter);
      if (sortBy) queryParams.append("sortBy", sortBy);

      const result = await apiClient.get(`/leaderboard?${queryParams}`);
      return result;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return {
        success: false,
        data: [],
        stats: { total: 0, diamond: 0, gold: 0, silver: 0, bronze: 0 },
        pagination: {
          total: 0,
          limit: limit || 50,
          offset: offset || 0,
          hasMore: false,
        },
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch leaderboard",
      };
    }
  }

  async getUserRank(
    userId: string
  ): Promise<{ rank: number; total: number } | null> {
    try {
      const result = await apiClient.get(`/leaderboard/rank/${userId}`);
      return result.data;
    } catch (error) {
      console.error("Error fetching user rank:", error);
      return null;
    }
  }

  async getUserBadgeProgress(userId: string): Promise<{
    currentBadge: string;
    nextBadge?: string;
    progress: number;
    requirements: any;
  } | null> {
    try {
      const result = await apiClient.get(
        `/leaderboard/badge-progress/${userId}`
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching badge progress:", error);
      return null;
    }
  }
}

export const leaderboardService = new LeaderboardService();
