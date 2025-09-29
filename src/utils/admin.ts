import { ScheduleOverview } from "@/types/schedule";
import { apiClient } from "./api";
import {
  BookingHistory,
  ReportBooking,
  Roles,
  UserManagement,
} from "@/types/admin";
import { News } from "@/types/news";
import { AuthService } from "./auth";

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

  async createNews(newsData: FormData): Promise<News | null> {
    try {
      // For FormData, we need to use fetch directly with proper headers
      const session = await AuthService.getSession();
      const headers: HeadersInit = {};

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE}/api/v1/news/add-news`,
        {
          method: "POST",
          headers,
          body: newsData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!");
      }

      return result.data;
    } catch (error) {
      return null;
    }
  }

  async updateNews(id: string, newsData: FormData): Promise<News | null> {
    try {
      const session = await AuthService.getSession();
      const headers: HeadersInit = {};

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE}/api/v1/news/update-news/${id}`,
        {
          method: "PUT",
          headers,
          body: newsData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!");
      }

      return result.data;
    } catch (error) {
      return null;
    }
  }

  async createSchedule(scheduleData: FormData): Promise<any> {
    try {
      const session = await AuthService.getSession();
      const headers: HeadersInit = {};

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE}/api/v1/matches/add-schedule`,
        {
          method: "POST",
          headers,
          body: scheduleData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!");
      }

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async updateSchedule(id: string, scheduleData: FormData): Promise<any> {
    try {
      const session = await AuthService.getSession();
      const headers: HeadersInit = {};

      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE}/api/v1/matches/update-schedule/${id}`,
        {
          method: "PUT",
          headers,
          body: scheduleData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!");
      }

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async getRoles(): Promise<Roles[]> {
    try {
      const response = await apiClient.get(`/api/v1/roles/getRoles`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }

  async reportBooking(
    startDate?: string,
    endDate?: string
  ): Promise<ReportBooking> {
    try {
      const queryParams = new URLSearchParams();
      console.log("startDate", startDate);
      console.log("endDate", endDate);
      if (startDate) queryParams.append("startDate", startDate.toString());
      if (endDate) queryParams.append("endDate", endDate.toString());
      const response = await apiClient.get(
        "/api/v1/reports/booking-reports?" + queryParams
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async historyRecentBooking(
    startDate?: string,
    endDate?: string,
    status?: string,
    search?: string
  ): Promise<BookingHistory[]> {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate.toString());
      if (endDate) queryParams.append("endDate", endDate.toString());
      if (status) queryParams.append("status", status.toString());
      if (search) queryParams.append("keyword", search.toString());

      const response = await apiClient.get(
        "/api/v1/booking/recent-booking?" + queryParams
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const adminService = new AdminService();
