// Database Models

export interface Year {
  id: string;
  name: string;
  count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  created_at?: string;
  updated_at?: string;
}

export interface Instructor {
  id: string;
  prefix?: string;
  first_name: string;
  last_name?: string;
  telephone?: string;
  email?: string;
  field?: string;
  busy?: BusySlot[]; // For API responses
  created_at?: string;
  updated_at?: string;
}

export interface BusySlot {
  day: string;
  slot: number;
}

export interface InstructorAvailability {
  id?: number;
  instructor_id: string;
  day: string; // MON, TUE, WED, THU, FRI, SAT, SUN
  slot: number; // 0-13
  is_busy: number; // 0 or 1
  created_at?: string;
}

export interface Subject {
  id: string;
  code: string;
  section: string;
  name: string;
  credit: number;
  workload: number;
  split_pattern: string; // JSON string like "[3]" or "[2,1]"
  splitPattern?: number[]; // Parsed for API responses
  is_fixed: number; // 0 or 1
  fixed_day?: string;
  fixed_start?: number;
  fixed_room?: string;
  year?: string[]; // For API responses
  instructors?: InstructorAssignment[]; // For API responses
  created_at?: string;
  updated_at?: string;
}

export interface InstructorAssignment {
  id: string;
  ratio: number;
}

export interface SubjectYear {
  id?: number;
  subject_id: string;
  year_id: string;
  created_at?: string;
}

export interface SubjectInstructor {
  id?: number;
  subject_id: string;
  instructor_id: string;
  ratio: number;
  created_at?: string;
}

export interface Session {
  id: string;
  subject_id: string;
  day: string;
  start_slot: number;
  duration: number;
  room_id?: string;
  subject?: Subject; // For API responses with joins
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentConstraint {
  id?: number;
  day: string;
  slot: number;
  constraint_type: 'hard' | 'soft'; // hard = forbidden, soft = avoid
  created_at?: string;
}

export interface Settings {
  id: 1;
  work_start: number;
  work_end: number;
  max_continuous_hours: number;
  check_room_constraints: number; // 0 or 1
  updated_at?: string;
}

export interface Config {
  key: string;
  value: string;
  updated_at?: string;
}

// API Request/Response Types

export interface CreateYearRequest {
  id: string;
  name: string;
  count: number;
}

export interface UpdateYearRequest extends Partial<CreateYearRequest> {}

export interface CreateRoomRequest {
  id: string;
  name: string;
  capacity: number;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {}

export interface CreateInstructorRequest {
  id: string;
  prefix?: string;
  first_name: string;
  last_name?: string;
  telephone?: string;
  email?: string;
  field?: string;
  busy?: BusySlot[];
}

export interface UpdateInstructorRequest extends Partial<CreateInstructorRequest> {}

export interface CreateSubjectRequest {
  id: string;
  code: string;
  section: string;
  name: string;
  credit: number;
  workload: number;
  splitPattern: number[];
  is_fixed: number;
  fixed_day?: string;
  fixed_start?: number;
  fixed_room?: string;
  year: string[];
  instructors: InstructorAssignment[];
}

export interface UpdateSubjectRequest extends Partial<CreateSubjectRequest> {}

export interface CreateSessionRequest {
  id: string;
  subject_id: string;
  day: string;
  start_slot: number;
  duration: number;
  room_id?: string;
}

export interface UpdateSessionRequest extends Partial<Omit<CreateSessionRequest, 'id'>> {}

export interface UpdateSettingsRequest extends Partial<Omit<Settings, 'id' | 'updated_at'>> {}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Constants
export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
export type Day = typeof DAYS[number];

export const SLOTS = Array.from({ length: 14 }, (_, i) => {
  const startMin = 30 + i * 60;
  const h = 8 + Math.floor(startMin / 60);
  const m = startMin % 60;
  return { id: i, label: `${h}:${m.toString().padStart(2, '0')}` };
});
