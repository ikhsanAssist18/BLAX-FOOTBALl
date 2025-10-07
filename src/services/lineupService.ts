import { LineupMatch, LineupPlayer } from "@/utils/lineup";

interface ApiLineupResponse {
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

interface UpdatePlayerTeamRequest {
  id: string;
  team: string;
}

interface UpdatePlayerTeamResponse {
  success: boolean;
  message: string;
}

export class LineupService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BE || "";
  }

  private async getHeaders(): Promise<HeadersInit> {
    return {
      "Content-Type": "application/json",
    };
  }

  private transformApiResponse(apiResponse: ApiLineupResponse): LineupMatch {
    const teamAPlayers: LineupPlayer[] = [];
    const teamBPlayers: LineupPlayer[] = [];

    if (apiResponse.lineUp?.A) {
      if (apiResponse.lineUp.A.GK) {
        teamAPlayers.push({
          id: `${apiResponse.id}-A-GK`,
          name: apiResponse.lineUp.A.GK.name,
          phone: apiResponse.lineUp.A.GK.phone,
          position: "GK",
          team: "A",
          order: 1,
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
          });
        });
      }
    }

    if (apiResponse.lineUp?.B) {
      if (apiResponse.lineUp.B.GK) {
        teamBPlayers.push({
          id: `${apiResponse.id}-B-GK`,
          name: apiResponse.lineUp.B.GK.name,
          phone: apiResponse.lineUp.B.GK.phone,
          position: "GK",
          team: "B",
          order: 1,
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
      status:
        apiResponse.status === "ACTIVE" ? "CONFIRMED" : apiResponse.status,
      totalPlayers: teamAPlayers.length + teamBPlayers.length,
      teamAPlayers,
      teamBPlayers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookedSlots: apiResponse.bookedSlots,
      openSlots: apiResponse.openSlots,
      totalSlots: apiResponse.totalSlots,
    };
  }

  async fetchLineups(): Promise<LineupMatch[]> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/api/v1/lineups`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch lineups: ${response.statusText}`);
      }

      const data: ApiLineupResponse[] = await response.json();
      return data.map((item) => this.transformApiResponse(item));
    } catch (error) {
      console.error("Error fetching lineups:", error);
      throw error;
    }
  }

  async fetchLineupById(id: string): Promise<LineupMatch> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}/api/v1/lineups/${id}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch lineup: ${response.statusText}`);
      }

      const data: ApiLineupResponse = await response.json();
      return this.transformApiResponse(data);
    } catch (error) {
      console.error("Error fetching lineup:", error);
      throw error;
    }
  }

  async updatePlayerTeam(
    playerId: string,
    team: string
  ): Promise<UpdatePlayerTeamResponse> {
    try {
      const headers = await this.getHeaders();
      const requestBody: UpdatePlayerTeamRequest = {
        id: playerId,
        team: team,
      };

      const response = await fetch(
        `${this.baseUrl}/api/v1/lineups/player/${playerId}/team`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update player team: ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || "Player team updated successfully",
      };
    } catch (error) {
      console.error("Error updating player team:", error);
      throw error;
    }
  }

  async searchLineups(
    searchTerm: string,
    statusFilter: string = "all"
  ): Promise<LineupMatch[]> {
    try {
      const headers = await this.getHeaders();
      const queryParams = new URLSearchParams();

      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }
      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }

      const url = `${this.baseUrl}/api/v1/lineups?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to search lineups: ${response.statusText}`);
      }

      const data: ApiLineupResponse[] = await response.json();
      return data.map((item) => this.transformApiResponse(item));
    } catch (error) {
      console.error("Error searching lineups:", error);
      throw error;
    }
  }
}

export const lineupService = new LineupService();
