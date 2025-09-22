import { apiClient } from "./api";
import { GalleryPhoto, GalleryCategory } from "@/types/gallery";

class GalleryService {
  async getPublicPhotos(
    category?: string,
    venue?: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: GalleryPhoto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();
    if (category) queryParams.append("category", category);
    if (venue) queryParams.append("venue", venue);
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE}/api/v1/gallery/public-photos?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch photos");
    }

    return result;
  }

  async getCategories(): Promise<GalleryCategory[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE}/api/v1/gallery/categories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch categories");
    }

    return result.data;
  }

  // Admin functions
  async getAllPhotos(
    search?: string,
    category?: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: GalleryPhoto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (category) queryParams.append("category", category);
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    const response = await apiClient.get(
      `/api/v1/gallery/photos?${queryParams}`
    );
    return response;
  }

  async uploadPhoto(data: FormData): Promise<GalleryPhoto> {
    const response = await apiClient.post("/api/v1/gallery/upload", data);
    return response.data;
  }

  async updatePhoto(
    id: string,
    data: Partial<GalleryPhoto>
  ): Promise<GalleryPhoto> {
    const response = await apiClient.put(`/api/v1/gallery/photos/${id}`, data);
    return response.data;
  }

  async deletePhoto(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/gallery/photos/${id}`);
  }
}

export const galleryService = new GalleryService();