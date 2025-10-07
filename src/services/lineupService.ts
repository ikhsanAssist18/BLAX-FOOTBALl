import { apiClient } from "@/utils/api";
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
  team: number;
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
    const response = await apiClient.get("/api/v1/matches/schedules-lineup");

    return Array.isArray(response)
      ? response.map(this.transformApiResponse)
      : response.data?.map(this.transformApiResponse) || [];
  }

  async updatePlayerTeam(
    playerId: string,
    team: string
  ): Promise<UpdatePlayerTeamResponse> {
    const requestBody: UpdatePlayerTeamRequest = {
      id: playerId,
      team: team,
    };

    const response = await apiClient.put(
      `/api/v1/lineup/lineup-team`,
      requestBody
    );
    return response.data;
  }
}

export const lineupService = new LineupService();
