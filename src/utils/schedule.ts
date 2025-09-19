import { Schedule, ScheduleDetail } from "@/types/schedule";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BE}/api/v1/matches`;

class ScheduleService {
  async getSchedules(
    startDate?: Date,
    endDate?: Date,
    venue?: string
  ): Promise<Schedule[] | null> {
    try {
      const queryParams = new URLSearchParams();

      if (startDate) queryParams.append("startDate", startDate.toString());
      if (endDate) queryParams.append("endDate", endDate.toString());
      if (venue) queryParams.append("venue", venue.toString());

      const response = await fetch(`${API_BASE_URL}/schedules?${queryParams}`, {
        method: "GET",
        headers: {},
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong!");
      }

      return result.data;
    } catch (error) {
      return null;
    }
  }

  async scheduleDetail(id: string): Promise<ScheduleDetail | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule-detail?id=${id}`, {
        method: "GET",
        headers: {},
      });
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

export const scheduleService = new ScheduleService();
