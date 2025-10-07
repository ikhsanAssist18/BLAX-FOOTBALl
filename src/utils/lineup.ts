import { apiClient } from "./api";

export interface LineupPlayer {
  id: string;
  name: string;
  phone: string;
  position: "GK" | "PLAYER";
  team: "A" | "B";
  order: number;
  notes?: string;
  type?: string;
}

export interface LineupMatch {
  id: string;
  scheduleId?: string;
  scheduleName: string;
  venue: string;
  date: string;
  time: string;
  status: "DRAFT" | "CONFIRMED" | "COMPLETED" | "ACTIVE";
  totalPlayers: number;
  teamAPlayers: LineupPlayer[];
  teamBPlayers: LineupPlayer[];
  createdAt?: string;
  updatedAt?: string;
  bookedSlots?: number;
  openSlots?: number;
  totalSlots?: number;
}

export interface ApiLineupResponse {
  id: string;
  scheduleName: string;
  venue: string;
  date: string;
  time: string;
  status: "DRAFT" | "CONFIRMED" | "COMPLETED" | "ACTIVE";
  bookedSlots?: number;
  openSlots?: number;
  totalSlots?: number;
  lineUp: {
    A?: {
      GK?: {
        name: string;
        phone: string;
        type?: string;
      };
      PLAYERS?: Array<{
        name: string;
        phone: string;
        type?: string;
      }>;
    };
    B?: {
      GK?: {
        name: string;
        phone: string;
        type?: string;
      };
      PLAYERS?: Array<{
        name: string;
        phone: string;
        type?: string;
      }>;
    };
  };
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

function transformApiResponseToLineup(apiResponse: ApiLineupResponse): LineupMatch {
  const teamAPlayers: LineupPlayer[] = [];
  const teamBPlayers: LineupPlayer[] = [];

  if (apiResponse.lineUp.A) {
    if (apiResponse.lineUp.A.GK) {
      teamAPlayers.push({
        id: `${apiResponse.id}-A-GK`,
        name: apiResponse.lineUp.A.GK.name,
        phone: apiResponse.lineUp.A.GK.phone,
        position: "GK",
        team: "A",
        order: 1,
        type: apiResponse.lineUp.A.GK.type,
      });
    }
    if (apiResponse.lineUp.A.PLAYERS) {
      apiResponse.lineUp.A.PLAYERS.forEach((player, index) => {
        teamAPlayers.push({
          id: `${apiResponse.id}-A-P-${index}`,
          name: player.name,
          phone: player.phone,
          position: "PLAYER",
          team: "A",
          order: teamAPlayers.length + 1,
          type: player.type,
        });
      });
    }
  }

  if (apiResponse.lineUp.B) {
    if (apiResponse.lineUp.B.GK) {
      teamBPlayers.push({
        id: `${apiResponse.id}-B-GK`,
        name: apiResponse.lineUp.B.GK.name,
        phone: apiResponse.lineUp.B.GK.phone,
        position: "GK",
        team: "B",
        order: 1,
        type: apiResponse.lineUp.B.GK.type,
      });
    }
    if (apiResponse.lineUp.B.PLAYERS) {
      apiResponse.lineUp.B.PLAYERS.forEach((player, index) => {
        teamBPlayers.push({
          id: `${apiResponse.id}-B-P-${index}`,
          name: player.name,
          phone: player.phone,
          position: "PLAYER",
          team: "B",
          order: teamBPlayers.length + 1,
          type: player.type,
        });
      });
    }
  }

  return {
    id: apiResponse.id,
    scheduleName: apiResponse.scheduleName,
    venue: apiResponse.venue,
    date: apiResponse.date,
    time: apiResponse.time,
    status: apiResponse.status,
    totalPlayers: teamAPlayers.length + teamBPlayers.length,
    teamAPlayers,
    teamBPlayers,
    bookedSlots: apiResponse.bookedSlots,
    openSlots: apiResponse.openSlots,
    totalSlots: apiResponse.totalSlots,
  };
}

class LineupService {
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

    const transformedData = Array.isArray(response)
      ? response.map(transformApiResponseToLineup)
      : response.data?.map(transformApiResponseToLineup) || [];

    return {
      data: transformedData,
      total: response.total || transformedData.length,
      page: response.page || 1,
      limit: response.limit || transformedData.length,
    };
  }

  async getLineupById(id: string): Promise<LineupMatch> {
    const response: ApiLineupResponse = await apiClient.get(`/api/v1/lineups/${id}`);
    return transformApiResponseToLineup(response);
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

  async updatePlayer(
    lineupId: string,
    playerId: string,
    playerData: Partial<PlayerPayload>
  ): Promise<LineupPlayer> {
    const response = await apiClient.put(`/api/v1/lineups/${lineupId}/players/${playerId}`, playerData);
    return response.data;
  }

  async updatePlayerTeam(id: string, team: string): Promise<void> {
    await apiClient.put(`/api/v1/lineups/player/${id}/team`, { team });
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
    const headers: HeadersInit = {};
    return headers;
  }
}

export const lineupService = new LineupService();