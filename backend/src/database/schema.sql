-- KMUTT CE Scheduler Database Schema

-- Academic Year Configuration
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Years (Student Groups)
CREATE TABLE IF NOT EXISTS years (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 45,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rooms (Classrooms)
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 40,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Instructors/Professors
CREATE TABLE IF NOT EXISTS instructors (
    id TEXT PRIMARY KEY,
    prefix TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    telephone TEXT,
    email TEXT,
    field TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Instructor Availability (busy times)
CREATE TABLE IF NOT EXISTS instructor_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    instructor_id TEXT NOT NULL,
    day TEXT NOT NULL, -- MON, TUE, WED, THU, FRI, SAT, SUN
    slot INTEGER NOT NULL, -- 0-13 (time slots)
    is_busy INTEGER NOT NULL DEFAULT 1, -- 1 = busy, 0 = available
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
    UNIQUE(instructor_id, day, slot)
);

-- Subjects/Courses
CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    section TEXT NOT NULL,
    name TEXT NOT NULL,
    credit INTEGER NOT NULL DEFAULT 3,
    workload REAL NOT NULL DEFAULT 3,
    split_pattern TEXT NOT NULL, -- JSON array [3] or [2,1]
    is_fixed INTEGER NOT NULL DEFAULT 0, -- 0 = flexible, 1 = fixed schedule
    fixed_day TEXT, -- MON, TUE, etc. (if is_fixed = 1)
    fixed_start INTEGER, -- slot number (if is_fixed = 1)
    fixed_room TEXT, -- room id (if is_fixed = 1)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fixed_room) REFERENCES rooms(id) ON DELETE SET NULL
);

-- Subject Year Assignments (many-to-many)
CREATE TABLE IF NOT EXISTS subject_years (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id TEXT NOT NULL,
    year_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (year_id) REFERENCES years(id) ON DELETE CASCADE,
    UNIQUE(subject_id, year_id)
);

-- Subject Instructor Assignments (many-to-many with ratio)
CREATE TABLE IF NOT EXISTS subject_instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id TEXT NOT NULL,
    instructor_id TEXT NOT NULL,
    ratio REAL NOT NULL DEFAULT 100.0, -- percentage of workload
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE,
    UNIQUE(subject_id, instructor_id)
);

-- Scheduled Sessions (Classes on calendar)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    day TEXT, -- MON, TUE, WED, THU, FRI, SAT, SUN (NULL for unassigned sessions)
    start_slot INTEGER, -- 0-13 (NULL for unassigned sessions)
    duration INTEGER NOT NULL, -- number of slots (hours)
    room_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- Department Constraints (dept-wide busy times)
CREATE TABLE IF NOT EXISTS department_constraints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    slot INTEGER NOT NULL,
    constraint_type TEXT NOT NULL, -- 'hard' (red, forbidden) or 'soft' (orange, avoid)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(day, slot)
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Only one row
    work_start INTEGER NOT NULL DEFAULT 0, -- slot index
    work_end INTEGER NOT NULL DEFAULT 13, -- slot index
    max_continuous_hours INTEGER NOT NULL DEFAULT 4,
    check_room_constraints INTEGER NOT NULL DEFAULT 1, -- 0 = off, 1 = on
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT OR IGNORE INTO settings (id, work_start, work_end, max_continuous_hours, check_room_constraints)
VALUES (1, 0, 13, 4, 1);

-- Insert default academic year
INSERT OR IGNORE INTO config (key, value) VALUES ('acadYear', '2/2568');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subject_years_subject ON subject_years(subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_years_year ON subject_years(year_id);
CREATE INDEX IF NOT EXISTS idx_subject_instructors_subject ON subject_instructors(subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_instructors_instructor ON subject_instructors(instructor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_subject ON sessions(subject_id);
CREATE INDEX IF NOT EXISTS idx_sessions_day_slot ON sessions(day, start_slot);
CREATE INDEX IF NOT EXISTS idx_sessions_room ON sessions(room_id);
CREATE INDEX IF NOT EXISTS idx_instructor_availability_instructor ON instructor_availability(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_availability_day_slot ON instructor_availability(day, slot);
