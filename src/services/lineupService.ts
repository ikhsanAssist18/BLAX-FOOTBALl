import { apiClient } from "@/utils/api";

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
  lineUp: Record<
    string,
    {
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
    }
  >;
}

interface UpdatePlayerTeamRequest {
  id: string;
  team: string;
}

interface UpdatePlayerTeamResponse {
  success: boolean;
  message: string;
}

interface LineupPlayer {
  id: string;
  name: string;
  phone: string;
  position: "GK" | "PLAYER";
  team: string;
  order: number;
  notes?: string;
  type?: string;
}

interface LineupMatch {
  id: string;
  scheduleId?: string;
  scheduleName: string;
  venue: string;
  date: string;
  time: string;
  teams: Record<string, LineupPlayer[]>;
  status: "DRAFT" | "CONFIRMED" | "COMPLETED" | "ACTIVE";
  totalPlayers: number;
  createdAt?: string;
  updatedAt?: string;
  bookedSlots?: number;
  openSlots?: number;
  totalSlots?: number;
}

export class LineupService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BE || "";
  }

  private transformApiResponse(apiResponse: ApiLineupResponse): LineupMatch {
    const allPlayers: LineupPlayer[] = [];

    // Loop semua tim dari key di lineUp (bisa A, B, C, dst)
    Object.entries(apiResponse.lineUp || {}).forEach(([teamKey, teamData]) => {
      if (teamData.GK) {
        allPlayers.push({
          id: `${apiResponse.id}-${teamKey}-GK`,
          name: teamData.GK.name,
          phone: teamData.GK.phone,
          position: "GK",
          team: teamKey,
          order: 1,
        });
      }

      if (teamData.PLAYERS) {
        teamData.PLAYERS.forEach((player, index) => {
          allPlayers.push({
            id: `${apiResponse.id}-${teamKey}-P-${index}`,
            name: player.name,
            phone: player.phone,
            position: "PLAYER",
            team: teamKey,
            order: index + 2, // setelah GK
          });
        });
      }
    });

    // Kelompokkan pemain berdasarkan tim
    const groupedTeams: Record<string, LineupPlayer[]> = {};
    allPlayers.forEach((player) => {
      if (!groupedTeams[player.team]) groupedTeams[player.team] = [];
      groupedTeams[player.team].push(player);
    });

    return {
      id: apiResponse.id,
      scheduleName: apiResponse.scheduleName,
      venue: apiResponse.venue,
      date: apiResponse.date,
      time: apiResponse.time,
      status:
        apiResponse.status === "ACTIVE" ? "CONFIRMED" : apiResponse.status,
      totalPlayers: allPlayers.length,
      teams: groupedTeams, // <-- gunakan dinamis
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookedSlots: apiResponse.bookedSlots,
      openSlots: apiResponse.openSlots,
      totalSlots: apiResponse.totalSlots,
    };
  }

  async fetchLineups(): Promise<LineupMatch[]> {
    const response = await apiClient.get("/api/v1/matches/schedules-lineup");

    const data = Array.isArray(response) ? response : response.data || [];

    return data.map((item: ApiLineupResponse) =>
      this.transformApiResponse(item)
    );
  }

  async updatePlayerTeam(
    playerId: string,
    team: string
  ): Promise<UpdatePlayerTeamResponse> {
    const requestBody: UpdatePlayerTeamRequest = {
      id: playerId,
      team,
    };

    const response = await apiClient.put(
      `/api/v1/lineup/lineup-team`,
      requestBody
    );
    return response.data;
  }
}

export const lineupService = new LineupService();
