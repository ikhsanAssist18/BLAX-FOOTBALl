# Lineup Management API Integration

## Overview

Complete API integration for the lineup management component with data fetching, drag & drop team updates, loading states, and comprehensive error handling.

## Features Implemented

### 1. Data Fetching
- Fetches lineup data from `/api/v1/lineups` endpoint
- Transforms API response to component-compatible format
- Handles loading states during data fetch
- Fallback to mock data on error

### 2. TypeScript Interfaces

```typescript
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
      GK?: { name: string; phone: string; type?: string };
      PLAYERS?: Array<{ name: string; phone: string; type?: string }>;
    };
    B?: {
      GK?: { name: string; phone: string; type?: string };
      PLAYERS?: Array<{ name: string; phone: string; type?: string }>;
    };
  };
}

interface LineupPlayer {
  id: string;
  name: string;
  phone: string;
  position: "GK" | "PLAYER";
  team: "A" | "B";
  order: number;
  notes?: string;
  type?: string;
}

interface LineupMatch {
  id: string;
  scheduleName: string;
  venue: string;
  date: string;
  time: string;
  status: "DRAFT" | "CONFIRMED" | "COMPLETED" | "ACTIVE";
  totalPlayers: number;
  teamAPlayers: LineupPlayer[];
  teamBPlayers: LineupPlayer[];
  bookedSlots?: number;
  openSlots?: number;
  totalSlots?: number;
}
```

### 3. API Service Layer

**File**: `src/services/lineupService.ts`

```typescript
class LineupService {
  async fetchLineups(): Promise<LineupMatch[]>
  async fetchLineupById(id: string): Promise<LineupMatch>
  async updatePlayerTeam(playerId: string, team: string): Promise<UpdatePlayerTeamResponse>
  async searchLineups(searchTerm: string, statusFilter: string): Promise<LineupMatch[]>
}
```

### 4. Drag & Drop with API Update

**Implementation Details:**

1. Player is dragged between teams (A ↔ B)
2. Local state updates optimistically for instant UI feedback
3. API call to update player team: `PUT /api/v1/lineups/player/{playerId}/team`
4. Request payload: `{ id: string, team: string }`
5. Success notification shown on successful update
6. Error handling with user feedback on failure

### 5. Custom React Hook

**File**: `src/hooks/useLineupManagement.ts`

```typescript
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
  onError: (message) => console.error(message),
  onSuccess: (message) => console.log(message)
});
```

## API Endpoints

### Fetch All Lineups
```
GET /api/v1/lineups
Response: ApiLineupResponse[]
```

### Fetch Single Lineup
```
GET /api/v1/lineups/:id
Response: ApiLineupResponse
```

### Update Player Team
```
PUT /api/v1/lineups/player/:playerId/team
Body: { id: string, team: string }
Response: { success: boolean, message: string }
```

### Search Lineups
```
GET /api/v1/lineups?search={term}&status={status}
Response: ApiLineupResponse[]
```

## Data Transformation

The service automatically transforms the nested API response structure:

**API Format:**
```json
{
  "id": "123",
  "lineUp": {
    "A": {
      "GK": { "name": "John", "phone": "08123456789" },
      "PLAYERS": [
        { "name": "Jane", "phone": "08987654321" }
      ]
    }
  }
}
```

**Component Format:**
```typescript
{
  id: "123",
  teamAPlayers: [
    { id: "123-A-GK", name: "John", phone: "08123456789", position: "GK", team: "A", order: 1 },
    { id: "123-A-P-0", name: "Jane", phone: "08987654321", position: "PLAYER", team: "A", order: 2 }
  ]
}
```

## Error Handling

### Network Errors
- Displays error notification to user
- Falls back to mock data for development
- Maintains app functionality

### API Errors
- HTTP error status handling
- JSON parsing error handling
- User-friendly error messages

### Update Failures
- Local changes preserved
- Error notification with context
- Option to retry operation

## Loading States

1. **Initial Load**: Full screen skeleton loader
2. **Drag Operation**: Optimistic UI update
3. **API Update**: Background operation with spinner
4. **Refresh**: Maintains current view with subtle indicator

## Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_BE=https://api.yourbackend.com
```

## Usage Example

```tsx
import { lineupService } from '@/services/lineupService';

// Fetch all lineups
const lineups = await lineupService.fetchLineups();

// Update player team on drag
await lineupService.updatePlayerTeam(playerId, 'A');

// Or use the custom hook
const {
  lineups,
  loading,
  updatePlayerTeam
} = useLineupManagement({
  onSuccess: (msg) => toast.success(msg),
  onError: (msg) => toast.error(msg)
});
```

## Files Modified/Created

### Created:
- `src/services/lineupService.ts` - API service layer
- `src/hooks/useLineupManagement.ts` - Custom React hook

### Modified:
- `src/components/organisms/LineupManagement.tsx` - Integrated API calls
- `src/utils/lineup.ts` - Updated types and service methods
- `.env` - Added NEXT_PUBLIC_BE variable

## Testing

The implementation includes fallback mock data for development and testing without a backend connection.

## Performance Optimizations

1. Optimistic UI updates for instant feedback
2. Debounced search queries
3. Memoized transformations
4. Efficient re-renders with proper state management

## Security

- No sensitive data in local storage
- Authentication headers from AuthService
- CORS handling
- Input validation on API requests
