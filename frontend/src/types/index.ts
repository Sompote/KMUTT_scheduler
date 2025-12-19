// Shared types with backend

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

export interface BusySlot {
  day: string;
  slot: number;
}

export interface Instructor {
  id: string;
  prefix?: string;
  first_name: string;
  last_name?: string;
  telephone?: string;
  email?: string;
  field?: string;
  busy?: BusySlot[];
  availability?: {
    [day: string]: {
      [slot: number]: boolean;
    };
  };
  created_at?: string;
  updated_at?: string;
}

export interface InstructorAssignment {
  id: string;
  ratio: number;
}

export interface Subject {
  id: string;
  code: string;
  section: string;
  name: string;
  credit: number;
  workload: number;
  split_pattern?: string;
  splitPattern?: number[];
  is_fixed: number;
  fixed_day?: string;
  fixed_start?: number;
  fixed_room?: string;
  year?: string[];
  instructors?: InstructorAssignment[];
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id: string;
  subject_id: string;
  day: string;
  start_slot: number;
  duration: number;
  room_id?: string;
  subject?: Subject;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentConstraint {
  id?: number;
  day: string;
  slot?: number;
  constraint_type?: 'hard' | 'soft';
  hard_blocked?: number[];
  soft_blocked?: number[];
  created_at?: string;
}

export interface Settings {
  id: 1;
  work_start: number;
  work_end: number;
  max_continuous_hours: number;
  check_room_constraints: number;
  check_dept_constraints?: number;
  check_instructor_constraints?: number;
  updated_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
export type Day = typeof DAYS[number];

export const SLOTS = Array.from({ length: 14 }, (_, i) => {
  const startMin = 30 + i * 60;
  const h = 8 + Math.floor(startMin / 60);
  const m = startMin % 60;
  return { id: i, label: `${h}:${m.toString().padStart(2, '0')}` };
});
