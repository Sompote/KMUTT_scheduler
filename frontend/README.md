# KMUTT CE Scheduler - Frontend

Frontend application for the KMUTT Civil Engineering Department Scheduler.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Drag & Drop**: @dnd-kit

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Features To Be Implemented

### 1. Data Management Tab (ข้อมูลพื้นฐาน)
- CRUD for Years (student groups)
- CRUD for Rooms (classrooms)
- CRUD for Instructors (with availability calendar)
- CRUD for Subjects (with instructor assignments and year assignments)

### 2. Scheduler Tab (จัดตารางสอน)
- Weekly calendar grid (MON-SUN, 14 time slots)
- Drag & drop interface for scheduling classes
- Class pool sidebar (unscheduled classes)
- Room assignment
- Auto-assign algorithm
- Conflict detection
- Filter by year/instructor

### 3. Report Tab (รายงาน)
- Workload report per instructor
- Teaching hour summaries
- Printable format

### 4. Room Report Tab (การใช้ห้อง)
- Room utilization report
- Room schedule view

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.ts          # API client and endpoints
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   ├── data/              # Data management components
│   │   ├── scheduler/         # Scheduler components
│   │   └── reports/           # Report components
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── public/                    # Static assets
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json
```

## API Integration

The frontend communicates with the backend API (default: `http://localhost:3000/api`). The Vite dev server proxies `/api` requests to the backend.

### API Endpoints Used

- `/api/years` - Student year groups
- `/api/rooms` - Classrooms
- `/api/instructors` - Teaching staff
- `/api/subjects` - Courses
- `/api/sessions` - Scheduled classes
- `/api/config/*` - Configuration and settings

## Development Notes

1. **Backend must be running** for the frontend to work properly
2. Start backend first: `cd ../backend && npm run dev`
3. Then start frontend: `npm run dev`
4. The frontend will proxy API requests to `http://localhost:3000`

## Next Steps

1. ✅ Basic React + TypeScript setup with Vite
2. ✅ API client configuration
3. ⏳ Implement Data Management components
4. ⏳ Implement Scheduler with drag & drop
5. ⏳ Implement Reports
6. ⏳ Add state management with Zustand
7. ⏳ Integrate React Query for data fetching
8. ⏳ Polish UI/UX
