# Implementation Guide - CE KMUTT Scheduler

## What Has Been Built

### ✅ Backend (100% Complete)
- **Database Schema**: All 12 tables with relationships
- **REST API**: Full CRUD for all entities
- **TypeScript Types**: Comprehensive interfaces
- **Endpoints**: Years, Rooms, Instructors, Subjects, Sessions, Config
- **Database**: SQLite with foreign keys and indexes
- **Server**: Express with CORS, helmet, morgan

**Location**: `backend/`
**Status**: ✅ Fully functional and tested

### ✅ Frontend Foundation (60% Complete)
- **React + TypeScript + Vite setup**
- **Tailwind CSS** with KMUTT styling
- **API Client** with Axios
- **Zustand Store** for state management
- **Basic Navigation** between 4 tabs
- **TypeScript Types** matching backend

**Location**: `frontend/`
**Status**: ⚠️ UI components need implementation

## What Needs to Be Implemented

### 1. Data Management Tab Components

#### A. Years List Component
```tsx
// frontend/src/components/data/YearsList.tsx
- Display years in a list
- Add/Edit/Delete functionality
- Modal form with fields: id, name, count
- React Query for API integration
```

#### B. Rooms List Component
```tsx
// frontend/src/components/data/RoomsList.tsx
- Display rooms in a list
- Add/Edit/Delete functionality
- Modal form with fields: id, name, capacity
- React Query for API integration
```

#### C. Instructors List Component
```tsx
// frontend/src/components/data/InstructorsList.tsx
- Display instructors in a list
- Add/Edit/Delete functionality with availability grid
- Modal form with:
  - Personal info (prefix, name, tel, email, field)
  - Availability grid (7 days x 14 slots)
  - Department constraints overlay (red/orange)
- Click slots to toggle busy/available
```

#### D. Subjects Table Component
```tsx
// frontend/src/components/data/SubjectsTable.tsx
- Table view of all subjects
- Click row to edit
- Modal form with:
  - Code, Section, Name
  - Credit, Workload, Split Pattern
  - Multiple year checkboxes
  - Instructor assignment with ratio % (must sum to 100%)
  - Fixed schedule option (lock day/time/room)
```

### 2. Scheduler Tab Components

#### A. Calendar Grid
```tsx
// frontend/src/components/scheduler/CalendarGrid.tsx
- 7 rows (MON-SUN) x 14 columns (time slots)
- Display scheduled sessions as colored blocks
- Show subject code, name, room, instructor
- Color coding by year group
- Conflict highlighting (red border)
- Department constraint overlays
- Drag & drop support (@dnd-kit)
```

#### B. Class Pool Sidebar
```tsx
// frontend/src/components/scheduler/ClassPool.tsx
- List of unscheduled sessions
- Draggable items
- Show subject info and duration
- Counter badge
- Color coding by year
```

#### C. Room Selection Modal
```tsx
// frontend/src/components/scheduler/RoomSelector.tsx
- Modal triggered on drop
- Filter available rooms (vacant + capacity check)
- Show room name and capacity
- Click to confirm room assignment
```

#### D. Settings Modal
```tsx
// frontend/src/components/scheduler/SettingsModal.tsx
- Work hours start/end
- Max continuous hours
- Department constraints grid (click to toggle hard/soft/none)
- Room constraint checkbox
```

### 3. Scheduler Logic

#### A. Session Generation
```ts
// frontend/src/utils/sessionManager.ts
export function syncSessions(subjects: Subject[]): Session[] {
  // For each subject, create sessions based on splitPattern
  // Example: splitPattern [3,1] creates 2 sessions: 3hr + 1hr
  // Preserve existing assignments
}
```

#### B. Conflict Detection
```ts
// frontend/src/utils/conflictDetector.ts
export function detectConflict(session: Session, allSessions: Session[]): {
  hasConflict: boolean;
  reason?: string;
} {
  // Check:
  // 1. Room availability (if checkRoom enabled)
  // 2. Year group conflicts (students can't be in 2 places)
  // 3. Instructor conflicts (can't teach 2 classes)
  // 4. Department constraints (hard = forbidden, soft = warning)
  // 5. Instructor busy times
}
```

#### C. Auto-Assign Algorithm
```ts
// frontend/src/utils/autoAssign.ts
export function autoAssignSessions(
  unassignedSessions: Session[],
  subjects: Subject[],
  rooms: Room[],
  years: Year[],
  instructors: Instructor[],
  settings: Settings,
  deptConstraints: DepartmentConstraint[]
): Session[] {
  // Priority: hours (high to low) → students (many to few) → busy instructors
  // Try each: Day → Time → Room
  // Skip if:
  //   - Department hard constraint
  //   - Instructor busy
  //   - Conflict with existing
  //   - No room available
}
```

### 4. Reports Tab

#### A. Workload Report
```tsx
// frontend/src/components/reports/WorkloadReport.tsx
- Filter: All / By Field / By Instructor
- For each instructor:
  - List of subjects with ratio and net load
  - Total workload calculation
  - Optional: Weekly schedule grid (if single instructor selected)
```

#### B. Room Report
```tsx
// frontend/src/components/reports/RoomReport.tsx
- For each room:
  - Weekly schedule grid
  - Show which classes use the room
  - Utilization summary
```

## Implementation Priority

### Phase 1: Basic Data Management (2-3 hours)
1. Create Years list component with CRUD
2. Create Rooms list component with CRUD
3. Integrate with backend API using React Query
4. Add toast notifications for success/error

### Phase 2: Instructor & Subject Management (3-4 hours)
1. Create Instructors list with availability grid
2. Create Subjects table with complex form
3. Implement multi-year and multi-instructor support
4. Add validation (ratio must sum to 100%)

### Phase 3: Scheduler Interface (4-6 hours)
1. Create calendar grid layout
2. Implement session rendering
3. Add Class Pool sidebar
4. Integrate @dnd-kit for drag & drop
5. Create Room Selection modal
6. Implement conflict detection
7. Add visual conflict indicators

### Phase 4: Auto-Assign & Polish (2-3 hours)
1. Implement auto-assign algorithm
2. Add Settings modal
3. Create Reports components
4. Polish UI/UX
5. Add loading states
6. Error handling

## Quick Start Development

### 1. Start Backend
```bash
cd backend
npm run dev  # Runs on port 3000
```

### 2. Start Frontend
```bash
cd frontend
npm install  # If not done yet
npm run dev  # Runs on port 5173
```

### 3. Create Your First Component

Example: Years List Component

```tsx
// frontend/src/components/data/YearsList.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { Year } from '../../types';

export function YearsList() {
  const queryClient = useQueryClient();

  const { data: years, isLoading } = useQuery({
    queryKey: ['years'],
    queryFn: async () => {
      const response = await api.years.getAll();
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (year: Year) => api.years.create(year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['years'] });
    },
  });

  // ... render UI
}
```

## Key Differences from Original

### Original (Scheduler.html)
- Vanilla JavaScript
- localStorage for persistence
- Inline event handlers
- Global `db` object
- Direct DOM manipulation

### New Version (React/TypeScript)
- React components
- SQLite database (persistent)
- React event handlers
- Zustand store + React Query
- Virtual DOM

## Testing the Backend API

Use curl or Postman to test endpoints:

```bash
# Get all years
curl http://localhost:3000/api/years

# Create a year
curl -X POST http://localhost:3000/api/years \
  -H "Content-Type: application/json" \
  -d '{"id":"Y1","name":"Year 1","count":45}'

# Get settings
curl http://localhost:3000/api/config/settings
```

## Resources

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [dnd-kit Docs](https://docs.dndkit.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Architecture Decisions

### Why Zustand?
- Lightweight (1KB)
- No boilerplate
- TypeScript support
- Perfect for this app size

### Why React Query?
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states

### Why SQLite?
- No separate database server
- File-based (portable)
- Full SQL support
- Perfect for single-user app

### Why Separate Frontend/Backend?
- API can be consumed by other clients (mobile app, etc.)
- Database operations separated from UI
- Can deploy frontend/backend independently
- Better testing

## Next Steps

1. **Read the original `Scheduler.html`** to understand the UI/UX
2. **Start with Phase 1** (Years and Rooms CRUD)
3. **Test each component** with the backend before moving on
4. **Commit frequently** to track progress
5. **Refer to this guide** when implementing features

---

**Note**: The original HTML file has 1300+ lines of carefully crafted logic. Take time to understand each feature before implementing. The backend is ready - focus on building the UI components step by step.
