import { apiClient } from "./api";

export interface ModerationRecord {
  id: string;
  content_type: "policy" | "comment" | "user";
  content_id: string;
  action: "approve" | "reject" | "flag" | "ban";
  reason?: string;
  moderated_by: string;
  created_at: string;
  updated_at: string;
}

class ModerationService {
  // Get flagged content
  async getFlaggedContent(
    limit?: number,
    offset?: number,
    contentType?: string,
    status?: string
  ): Promise<{
    data: ModerationRecord[];
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
      if (limit) queryParams.append("limit", limit.toString());
      if (offset) queryParams.append("offset", offset.toString());
      if (contentType) queryParams.append("contentType", contentType);
      if (status) queryParams.append("status", status);

      const result = await apiClient.get(`/moderation?${queryParams}`);
      return {
        data: result.data || [],
        pagination: result.pagination || {
          total: 0,
          limit: limit || 20,
          offset: offset || 0,
          hasMore: false,
        },
      };
    } catch (error) {
      console.error("Error fetching flagged content:", error);
      return {
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
            : "Failed to fetch flagged content",
      };
    }
  }

  // Create moderation action
  async createModerationAction(moderation: {
    content_type: "policy" | "comment" | "user";
    content_id: string;
    action: "approve" | "reject" | "flag" | "ban";
    reason?: string;
  }): Promise<{
    success: boolean;
    data?: ModerationRecord;
    error?: string;
  }> {
    try {
      const result = await apiClient.post("/moderation", moderation);
      return result;
    } catch (error) {
      console.error("Error creating moderation action:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create moderation action",
      };
    }
  }

  // Update moderation action
  async updateModerationAction(
    contentId: string,
    action: "approve" | "reject" | "flag" | "ban",
    reason?: string
  ): Promise<{
    success: boolean;
    data?: ModerationRecord;
    error?: string;
  }> {
    try {
      const result = await apiClient.post(`/moderation/${contentId}`, {
        action,
        reason,
      });
      return result;
    } catch (error) {
      console.error("Error updating moderation action:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update moderation action",
      };
    }
  }

  // Delete moderation record (admin only)
  async deleteModerationRecord(contentId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const result = await apiClient.delete(`/moderation/${contentId}`);
      return result;
    } catch (error) {
      console.error("Error deleting moderation record:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete moderation record",
      };
    }
  }
}

export const moderationService = new ModerationService();
