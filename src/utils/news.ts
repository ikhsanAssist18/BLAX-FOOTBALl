import { News } from "@/types/news";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BE}/api/v1/news`;

class NewsService {
  async getNews(
    startDate?: Date,
    endDate?: Date,
    category?: string
  ): Promise<News[] | null> {
    try {
      const queryParams = new URLSearchParams();

      if (startDate) queryParams.append("startDate", startDate.toString());
      if (endDate) queryParams.append("endDate", endDate.toString());
      if (category) queryParams.append("category", category.toString());

      const response = await fetch(`${API_BASE_URL}/news-data?${queryParams}`, {
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

  async newsDetail(id: string): Promise<News | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/news-detail?id=${id}`, {
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

export const newsService = new NewsService();
