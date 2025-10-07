# Lineup Management - Usage Examples

## Quick Start

### 1. Basic Component Usage

The `LineupManagement` component is already integrated with API calls:

```tsx
import LineupManagement from '@/components/organisms/LineupManagement';

export default function LineupPage() {
  return <LineupManagement />;
}
```

### 2. Using the Service Directly

```tsx
import { lineupService } from '@/services/lineupService';

async function fetchData() {
  try {
    // Fetch all lineups
    const lineups = await lineupService.fetchLineups();
    console.log('Lineups:', lineups);

    // Fetch specific lineup
    const lineup = await lineupService.fetchLineupById('lineup-id');
    console.log('Lineup:', lineup);

    // Update player team
    await lineupService.updatePlayerTeam('player-id', 'A');

    // Search lineups
    const results = await lineupService.searchLineups('term', 'ACTIVE');
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 3. Using the Custom Hook

```tsx
import { useLineupManagement } from '@/hooks/useLineupManagement';
import { useNotifications } from '@/components/organisms/NotificationContainer';

export default function CustomLineupComponent() {
  const { showError, showSuccess } = useNotifications();

  const {
    lineups,
    selectedLineup,
    loading,
    error,
    hasUnsavedChanges,
    setSelectedLineup,
    fetchLineups,
    updatePlayerTeam,
    refreshLineup
  } = useLineupManagement({
    onError: (message) => showError('Error', message),
    onSuccess: (message) => showSuccess(message)
  });

  const handleSelectLineup = (lineup) => {
    setSelectedLineup(lineup);
  };

  const handleMovePlayer = async (playerId, team) => {
    try {
      await updatePlayerTeam(playerId, team);
    } catch (error) {
      // Error already handled by hook
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Lineups</h1>
      {lineups.map(lineup => (
        <div key={lineup.id} onClick={() => handleSelectLineup(lineup)}>
          {lineup.scheduleName}
        </div>
      ))}
    </div>
  );
}
```

## API Response Format

Your backend API should return data in this format:

### GET /api/v1/lineups

```json
[
  {
    "id": "3ed1a6e8-0fdd-4898-ac0f-238973c273a7",
    "scheduleName": "Blax PASMING",
    "venue": "Pasar Minggu Mini Soccer",
    "date": "2025-10-16",
    "time": "07:00",
    "status": "ACTIVE",
    "bookedSlots": 7,
    "openSlots": 21,
    "totalSlots": 28,
    "lineUp": {
      "A": {
        "GK": {
          "name": "sans",
          "phone": "082288559699",
          "type": "TEAM"
        },
        "PLAYERS": [
          {
            "name": "sans",
            "phone": "082288559699",
            "type": "TEAM"
          }
        ]
      },
      "B": {
        "GK": {
          "name": "john",
          "phone": "08123456789",
          "type": "TEAM"
        },
        "PLAYERS": [
          {
            "name": "jane",
            "phone": "08987654321",
            "type": "TEAM"
          }
        ]
      }
    }
  }
]
```

### PUT /api/v1/lineups/player/:playerId/team

**Request:**
```json
{
  "id": "player-123",
  "team": "A"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Player team updated successfully"
}
```

## Drag & Drop Flow

1. **User drags player** from Team A to Team B
2. **Component updates local state** immediately (optimistic update)
3. **API call sent** in background: `PUT /api/v1/lineups/player/{id}/team`
4. **On success**: Show success notification
5. **On error**: Show error notification, keep local changes

## Error Handling Examples

### Network Error
```typescript
// Service automatically catches and throws errors
try {
  await lineupService.fetchLineups();
} catch (error) {
  // Display: "Failed to fetch lineups: Network error"
  showError('Error', error.message);
}
```

### Update Error
```typescript
try {
  await lineupService.updatePlayerTeam('player-id', 'A');
} catch (error) {
  // Local state preserved, user notified
  showError('Error', 'Failed to update player team. Changes saved locally.');
}
```

## Loading States

### Initial Load
```tsx
if (loading) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="h-[600px] bg-gray-200 rounded-2xl animate-pulse"></div>
    </div>
  );
}
```

### During Update
```tsx
const [updating, setUpdating] = useState(false);

const handleUpdate = async () => {
  setUpdating(true);
  try {
    await lineupService.updatePlayerTeam(playerId, team);
  } finally {
    setUpdating(false);
  }
};
```

## Advanced Usage

### Custom Transformation
```typescript
import { LineupService } from '@/services/lineupService';

class CustomLineupService extends LineupService {
  async fetchLineupsWithStats() {
    const lineups = await this.fetchLineups();

    return lineups.map(lineup => ({
      ...lineup,
      teamAStats: this.calculateTeamStats(lineup.teamAPlayers),
      teamBStats: this.calculateTeamStats(lineup.teamBPlayers)
    }));
  }

  private calculateTeamStats(players) {
    return {
      totalPlayers: players.length,
      goalkeepers: players.filter(p => p.position === 'GK').length,
      fieldPlayers: players.filter(p => p.position === 'PLAYER').length
    };
  }
}

const customService = new CustomLineupService();
```

### Polling for Updates
```tsx
import { useEffect } from 'react';

function useLineupPolling(lineupId, interval = 30000) {
  const { refreshLineup } = useLineupManagement();

  useEffect(() => {
    const timer = setInterval(() => {
      refreshLineup(lineupId);
    }, interval);

    return () => clearInterval(timer);
  }, [lineupId, interval]);
}
```

### Offline Support
```typescript
import { lineupService } from '@/services/lineupService';

async function syncLineups() {
  const cachedLineups = localStorage.getItem('lineups');

  try {
    const freshLineups = await lineupService.fetchLineups();
    localStorage.setItem('lineups', JSON.stringify(freshLineups));
    return freshLineups;
  } catch (error) {
    // Use cached data if offline
    return cachedLineups ? JSON.parse(cachedLineups) : [];
  }
}
```

## Testing

### Mock Service for Tests
```typescript
export const mockLineupService = {
  fetchLineups: jest.fn().mockResolvedValue([
    {
      id: '1',
      scheduleName: 'Test Match',
      teamAPlayers: [],
      teamBPlayers: []
    }
  ]),
  updatePlayerTeam: jest.fn().mockResolvedValue({
    success: true,
    message: 'Updated'
  })
};

// In tests
jest.mock('@/services/lineupService', () => ({
  lineupService: mockLineupService
}));
```

## Configuration

### Environment Variables
```env
# Required
NEXT_PUBLIC_BE=https://api.yourbackend.com

# Optional (for development)
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
```

### TypeScript Configuration
Make sure your `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Performance Tips

1. **Memoize transformations** for large datasets
2. **Debounce search queries** to reduce API calls
3. **Use optimistic updates** for better UX
4. **Cache lineup data** in memory for quick access
5. **Lazy load** lineup details when selected

## Security Considerations

- All API calls use authentication headers from `AuthService`
- No sensitive data stored in localStorage
- Input validation on player IDs and team assignments
- CORS properly configured on backend
- Rate limiting handled by service
