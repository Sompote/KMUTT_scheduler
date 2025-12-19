# KMUTT CE Scheduler - Backend API

Backend API server for the KMUTT Civil Engineering Department Scheduler application.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite3 (better-sqlite3)
- **Development**: tsx for TypeScript execution

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
```bash
npm run db:init
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:init` - Initialize database schema

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Years
- `GET /api/years` - Get all years
- `GET /api/years/:id` - Get year by ID
- `POST /api/years` - Create new year
- `PUT /api/years/:id` - Update year
- `DELETE /api/years/:id` - Delete year

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Instructors
- `GET /api/instructors` - Get all instructors (with busy slots)
- `GET /api/instructors/:id` - Get instructor by ID
- `POST /api/instructors` - Create new instructor
- `PUT /api/instructors/:id` - Update instructor
- `DELETE /api/instructors/:id` - Delete instructor

### Subjects
- `GET /api/subjects` - Get all subjects (with years and instructors)
- `GET /api/subjects/:id` - Get subject by ID
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `DELETE /api/sessions` - Delete all sessions (reset schedule)

### Configuration
- `GET /api/config/acad-year` - Get academic year
- `PUT /api/config/acad-year` - Update academic year
- `GET /api/config/settings` - Get settings
- `PUT /api/config/settings` - Update settings
- `GET /api/config/dept-constraints` - Get department constraints
- `PUT /api/config/dept-constraints` - Update department constraints

## Database Schema

The database consists of the following tables:

- `years` - Student year groups
- `rooms` - Classrooms with capacity
- `instructors` - Teaching staff
- `instructor_availability` - Instructor busy times
- `subjects` - Courses/subjects
- `subject_years` - Subject-year relationships
- `subject_instructors` - Subject-instructor assignments with ratios
- `sessions` - Scheduled classes on the calendar
- `department_constraints` - Department-wide time constraints
- `settings` - Application settings
- `config` - Key-value configuration

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/scheduler.db
```

## Project Structure

```
backend/
├── src/
│   ├── database/
│   │   ├── connection.ts    # Database connection
│   │   ├── init.ts          # Database initialization
│   │   └── schema.sql       # Database schema
│   ├── routes/
│   │   ├── years.ts         # Years CRUD endpoints
│   │   ├── rooms.ts         # Rooms CRUD endpoints
│   │   ├── instructors.ts   # Instructors CRUD endpoints
│   │   ├── subjects.ts      # Subjects CRUD endpoints
│   │   ├── sessions.ts      # Sessions CRUD endpoints
│   │   └── config.ts        # Configuration endpoints
│   ├── types/
│   │   └── index.ts         # TypeScript types/interfaces
│   └── server.ts            # Main server file
├── data/
│   └── scheduler.db         # SQLite database (generated)
├── dist/                    # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── .env
```
