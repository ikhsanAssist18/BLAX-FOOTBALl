import { apiClient } from "./api";

// Types for lineup management
export interface LineupPlayer {
  id: string;
  name: string;
  phone: string;
  position: "GK" | "PLAYER";
  team: "A" | "B";
  order: number;
  isConfirmed: boolean;
  notes?: string;
}

export interface LineupMatch {
  id: string;
  scheduleId: string;
  scheduleName: string;
  venue: string;
  date: string;
  time: string;
  status: "DRAFT" | "CONFIRMED" | "COMPLETED";
  totalPlayers: number;
  teamAPlayers: LineupPlayer[];
  teamBPlayers: LineupPlayer[];
  createdAt: string;
  updatedAt: string;
}

export interface LineupPayload {
  scheduleId: string;
  teamAPlayers: Omit<LineupPlayer, "id" | "team">[];
  teamBPlayers: Omit<LineupPlayer, "id" | "team">[];
  status?: "DRAFT" | "CONFIRMED";
}

export interface PlayerPayload {
  name: string;
  phone: string;
  position: "GK" | "PLAYER";
  team: "A" | "B";
  order: number;
  notes?: string;
}

class LineupService {
  // Get all lineups with optional filters
  async getLineups(
    search?: string,
    status?: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: LineupMatch[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (status && status !== "all") queryParams.append("status", status);
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    const response = await apiClient.get(`/api/v1/lineups?${queryParams}`);
    return response;
  }

  // Get specific lineup by ID
  async getLineupById(id: string): Promise<LineupMatch> {
    const response = await apiClient.get(`/api/v1/lineups/${id}`);
    return response.data;
  }

  // Create new lineup
  async createLineup(data: LineupPayload): Promise<LineupMatch> {
    const response = await apiClient.post("/api/v1/lineups", data);
    return response.data;
  }

  // Update existing lineup
  async updateLineup(id: string, data: Partial<LineupPayload>): Promise<LineupMatch> {
    const response = await apiClient.put(`/api/v1/lineups/${id}`, data);
    return response.data;
  }

  // Delete lineup
  async deleteLineup(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/lineups/${id}`);
  }

  // Add player to lineup
  async addPlayer(lineupId: string, playerData: PlayerPayload): Promise<LineupPlayer> {
    const response = await apiClient.post(`/api/v1/lineups/${lineupId}/players`, playerData);
    return response.data;
  }

  // Update player in lineup
  async updatePlayer(
    lineupId: string, 
    playerId: string, 
    playerData: Partial<PlayerPayload>
  ): Promise<LineupPlayer> {
    const response = await apiClient.put(`/api/v1/lineups/${lineupId}/players/${playerId}`, playerData);
    return response.data;
  }

  // Remove player from lineup
  async removePlayer(lineupId: string, playerId: string): Promise<void> {
    await apiClient.delete(`/api/v1/lineups/${lineupId}/players/${playerId}`);
  }

  // Reorder players in a team
  async reorderPlayers(
    lineupId: string,
    team: "A" | "B",
    playerIds: string[]
  ): Promise<LineupMatch> {
    const response = await apiClient.put(`/api/v1/lineups/${lineupId}/reorder`, {
      team,
      playerIds,
    });
    return response.data;
  }

  // Confirm lineup (make it final)
  async confirmLineup(id: string): Promise<LineupMatch> {
    const response = await apiClient.put(`/api/v1/lineups/${id}/confirm`);
    return response.data;
  }

  // Get lineup by schedule ID
  async getLineupByScheduleId(scheduleId: string): Promise<LineupMatch | null> {
    try {
      const response = await apiClient.get(`/api/v1/lineups/schedule/${scheduleId}`);
      return response.data;
    } catch (error) {
      // Return null if no lineup exists for this schedule
      return null;
    }
  }

  // Auto-generate balanced teams
  async autoGenerateTeams(lineupId: string): Promise<LineupMatch> {
    const response = await apiClient.post(`/api/v1/lineups/${lineupId}/auto-generate`);
    return response.data;
  }

  // Export lineup to various formats
  async exportLineup(id: string, format: "pdf" | "excel" | "csv"): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BE}/api/v1/lineups/${id}/export?format=${format}`, {
      method: "GET",
      headers: await this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to export lineup");
    }

    return response.blob();
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const session = await AuthService.getSession();
    const headers: HeadersInit = {};

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    return headers;
  }
}

export const lineupService = new LineupService();