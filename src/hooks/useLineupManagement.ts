import { useState, useEffect, useCallback } from "react";
import { LineupMatch, LineupPlayer } from "@/utils/lineup";
import { lineupService } from "@/services/lineupService";

interface UseLineupManagementOptions {
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

interface UseLineupManagementReturn {
  lineups: LineupMatch[];
  selectedLineup: LineupMatch | null;
  loading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  setSelectedLineup: (lineup: LineupMatch | null) => void;
  fetchLineups: () => Promise<void>;
  updatePlayerTeam: (playerId: string, team: "A" | "B") => Promise<void>;
}

export function useLineupManagement(
  options: UseLineupManagementOptions = {}
): UseLineupManagementReturn {
  const [lineups, setLineups] = useState<LineupMatch[]>([]);
  const [selectedLineup, setSelectedLineup] = useState<LineupMatch | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { onError, onSuccess } = options;

  const fetchLineups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedLineups = await lineupService.fetchLineups();
      setLineups(fetchedLineups);

      if (fetchedLineups.length > 0 && !selectedLineup) {
        setSelectedLineup(fetchedLineups[0]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch lineups";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedLineup, onError]);

  const updatePlayerTeam = useCallback(
    async (playerId: string, team: "A" | "B") => {
      try {
        setError(null);

        await lineupService.updatePlayerTeam(playerId, team);

        setHasUnsavedChanges(false);
        onSuccess?.(`Player moved to Team ${team}`);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update player team";
        setError(errorMessage);
        onError?.(errorMessage);
        throw err;
      }
    },
    [onError, onSuccess]
  );

  useEffect(() => {
    fetchLineups();
  }, []);

  return {
    lineups,
    selectedLineup,
    loading,
    error,
    hasUnsavedChanges,
    setSelectedLineup,
    fetchLineups,
    updatePlayerTeam,
  };
}
