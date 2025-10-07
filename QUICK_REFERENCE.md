# Lineup Management API - Quick Reference

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Add to .env
NEXT_PUBLIC_BE=https://api.yourbackend.com
```

### 2. Use in Component
```tsx
import LineupManagement from '@/components/organisms/LineupManagement';

export default function Page() {
  return <LineupManagement />;
}
```

## 📦 Main Exports

### Service
```typescript
import { lineupService } from '@/services/lineupService';
```

### Hook
```typescript
import { useLineupManagement } from '@/hooks/useLineupManagement';
```

### Types
```typescript
import { LineupMatch, LineupPlayer } from '@/utils/lineup';
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/lineups` | Fetch all lineups |
| GET | `/api/v1/lineups/:id` | Fetch specific lineup |
| PUT | `/api/v1/lineups/player/:id/team` | Update player team |

## 💻 Code Snippets

### Fetch Lineups
```typescript
const lineups = await lineupService.fetchLineups();
```

### Update Player Team
```typescript
await lineupService.updatePlayerTeam('player-id', 'A');
```

### Use Hook
```typescript
const { lineups, loading, updatePlayerTeam } = useLineupManagement({
  onSuccess: (msg) => toast.success(msg),
  onError: (msg) => toast.error(msg)
});
```

## 📋 Data Format

### API Response
```json
{
  "id": "uuid",
  "scheduleName": "Match Name",
  "venue": "Stadium",
  "date": "2025-10-16",
  "time": "07:00",
  "status": "ACTIVE",
  "lineUp": {
    "A": {
      "GK": { "name": "John", "phone": "08123" },
      "PLAYERS": [{ "name": "Jane", "phone": "08987" }]
    },
    "B": { /* same structure */ }
  }
}
```

### Component Format
```typescript
{
  id: "uuid",
  teamAPlayers: [
    { id: "uuid-A-GK", name: "John", position: "GK", team: "A" }
  ],
  teamBPlayers: [
    { id: "uuid-B-GK", name: "Jane", position: "GK", team: "B" }
  ]
}
```

## 🎯 Key Features

- ✅ Real-time drag & drop
- ✅ Optimistic UI updates
- ✅ Automatic API sync
- ✅ Error handling with fallback
- ✅ Loading states
- ✅ Full TypeScript support

## 🛠️ Service Methods

```typescript
// Fetch all lineups
lineupService.fetchLineups(): Promise<LineupMatch[]>

// Fetch by ID
lineupService.fetchLineupById(id: string): Promise<LineupMatch>

// Update player team
lineupService.updatePlayerTeam(playerId: string, team: string): Promise<void>

// Search lineups
lineupService.searchLineups(term: string, status: string): Promise<LineupMatch[]>
```

## 🪝 Hook API

```typescript
const {
  lineups,              // LineupMatch[]
  selectedLineup,       // LineupMatch | null
  loading,              // boolean
  error,                // string | null
  hasUnsavedChanges,    // boolean
  setSelectedLineup,    // (lineup) => void
  fetchLineups,         // () => Promise<void>
  updatePlayerTeam,     // (id, team) => Promise<void>
  refreshLineup         // (id) => Promise<void>
} = useLineupManagement(options);
```

## 🔧 Common Patterns

### Error Handling
```typescript
try {
  await lineupService.fetchLineups();
} catch (error) {
  showError('Failed to fetch lineups');
  // Fallback to cached data
}
```

### Loading State
```typescript
if (loading) return <LoadingSpinner />;
```

### Optimistic Update
```typescript
// UI updates immediately
setLocalState(newValue);

// API call in background
try {
  await lineupService.updatePlayerTeam(id, team);
  showSuccess('Updated');
} catch (error) {
  showError('Failed to update');
  // State already updated for better UX
}
```

## 📚 Documentation Files

- `LINEUP_API_INTEGRATION.md` - Full API documentation
- `LINEUP_USAGE_EXAMPLES.md` - Usage examples
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `IMPLEMENTATION_CHECKLIST.md` - Feature checklist
- `QUICK_REFERENCE.md` - This file

## 🐛 Debugging

### Enable Logging
```typescript
// Service logs errors to console automatically
console.log('Fetching lineups...');
const lineups = await lineupService.fetchLineups();
console.log('Received:', lineups);
```

### Check Network
```bash
# In browser DevTools Network tab
# Look for: /api/v1/lineups
```

### Verify Environment
```typescript
console.log('API Base URL:', process.env.NEXT_PUBLIC_BE);
```

## ⚡ Performance Tips

1. Use optimistic updates
2. Cache lineup data
3. Debounce search queries
4. Memoize transformations
5. Lazy load details

## 🔒 Security

- Auth headers: Automatic via `AuthService`
- Input validation: Built-in
- CORS: Configure on backend
- No secrets in code: Use env variables

## 📞 Support

Need help? Check:
1. TypeScript errors
2. Console logs
3. Network tab
4. Environment variables
5. Documentation files

## ✨ Quick Wins

```typescript
// 1. Fetch and display lineups
const lineups = await lineupService.fetchLineups();
setLineups(lineups);

// 2. Handle drag & drop
await lineupService.updatePlayerTeam(playerId, newTeam);

// 3. Show loading
if (loading) return <Skeleton />;

// 4. Handle errors
catch (error) { showError(error.message); }
```

---

**Status**: ✅ Production Ready | **Version**: 1.0 | **Last Updated**: 2025-10-07
