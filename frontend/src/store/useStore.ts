import { create } from 'zustand';
import type { Year, Room, Instructor, Subject, Session, Settings, DepartmentConstraint } from '../types';

interface AppState {
  // Data
  years: Year[];
  rooms: Room[];
  instructors: Instructor[];
  subjects: Subject[];
  sessions: Session[];
  settings: Settings;
  deptConstraints: DepartmentConstraint[];
  acadYear: string;

  // UI State
  activeTab: 'setup' | 'scheduler' | 'report' | 'roomreport';
  viewFilter: string;

  // Actions
  setYears: (years: Year[]) => void;
  setRooms: (rooms: Room[]) => void;
  setInstructors: (instructors: Instructor[]) => void;
  setSubjects: (subjects: Subject[]) => void;
  setSessions: (sessions: Session[]) => void;
  setSettings: (settings: Settings) => void;
  setDeptConstraints: (constraints: DepartmentConstraint[]) => void;
  setAcadYear: (year: string) => void;
  setActiveTab: (tab: 'setup' | 'scheduler' | 'report' | 'roomreport') => void;
  setViewFilter: (filter: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  years: [],
  rooms: [],
  instructors: [],
  subjects: [],
  sessions: [],
  settings: {
    id: 1,
    work_start: 0,
    work_end: 13,
    max_continuous_hours: 4,
    check_room_constraints: 1,
  },
  deptConstraints: [],
  acadYear: '2/2568',
  activeTab: 'setup',
  viewFilter: 'ALL',

  // Actions
  setYears: (years) => set({ years }),
  setRooms: (rooms) => set({ rooms }),
  setInstructors: (instructors) => set({ instructors }),
  setSubjects: (subjects) => set({ subjects }),
  setSessions: (sessions) => set({ sessions }),
  setSettings: (settings) => set({ settings }),
  setDeptConstraints: (deptConstraints) => set({ deptConstraints }),
  setAcadYear: (acadYear) => set({ acadYear }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setViewFilter: (viewFilter) => set({ viewFilter }),
}));
