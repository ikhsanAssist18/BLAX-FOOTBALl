import { ScheduleOverview } from "@/types/schedule";
import { apiClient } from "./api";
import { UserManagement } from "@/types/admin";
import { News } from "@/types/news";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BE}/api/v1/auth`;
class AdminService {
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
      totalPages: number;
      currentPages: number;
    };
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append("limit", limit.toString());
      if (offset) queryParams.append("skip", offset.toString());
      if (search) queryParams.append("name", search);

      const result = await apiClient.get(
        `/api/v1/users/allUsers?${queryParams}`
      );
      return {
        users: result.data || [],
        pagination: {
          total: result.totalData,
          limit: result.limit,
          offset: result.skip,
          totalPages: result.totalPages,
          currentPages: result.currentPages,
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
          totalPages: 0,
          currentPages: 0,
        },
      };
    }
  }

  async scheduleOverview(
    startDate?: Date,
    endDate?: Date,
    venue?: string
  ): Promise<ScheduleOverview[]> {
    const queryParams = new URLSearchParams();

    if (startDate) queryParams.append("startDate", startDate.toString());
    if (endDate) queryParams.append("endDate", endDate.toString());
    if (venue) queryParams.append("venue", venue.toString());

    const response = await apiClient.get(
      `/api/v1/matches/schedules-overview?${queryParams}`
    );

    return response.data;
  }

  async createNews(
    news: Omit<News, "id" | "publishAt" | "readTime">
  ): Promise<News | null> {
    try {
      const response = await apiClient.post(`/api/v1/news/add-news`, news);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!");
      }

      return result.data;
    } catch (error) {
      return null;
    }
  }
}

export const adminService = new AdminService();
