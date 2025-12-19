import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Year, Room, Instructor, Subject, Session, Settings, DepartmentConstraint } from '../types';

// Years
export function useYears() {
  return useQuery({
    queryKey: ['years'],
    queryFn: async () => {
      const response = await api.years.getAll();
      return response.data.data as Year[];
    },
  });
}

export function useCreateYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (year: Partial<Year>) => api.years.create(year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['years'] });
    },
  });
}

export function useUpdateYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Year> }) => api.years.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['years'] });
    },
  });
}

export function useDeleteYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.years.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['years'] });
    },
  });
}

// Rooms
export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await api.rooms.getAll();
      return response.data.data as Room[];
    },
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (room: Partial<Room>) => api.rooms.create(room),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Room> }) => api.rooms.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.rooms.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

// Instructors
export function useInstructors() {
  return useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const response = await api.instructors.getAll();
      return response.data.data as Instructor[];
    },
  });
}

export function useCreateInstructor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (instructor: Partial<Instructor>) => api.instructors.create(instructor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    },
  });
}

export function useUpdateInstructor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Instructor> }) =>
      api.instructors.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    },
  });
}

export function useDeleteInstructor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.instructors.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    },
  });
}

// Subjects
export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await api.subjects.getAll();
      return response.data.data as Subject[];
    },
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subject: any) => api.subjects.create(subject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.subjects.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.subjects.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}

// Sessions
export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const response = await api.sessions.getAll();
      return response.data.data as Session[];
    },
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (session: any) => api.sessions.create(session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.sessions.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.sessions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useSyncSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.sessions.sync();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useAutoAssign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.sessions.autoAssign();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

// Settings
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await api.config.getSettings();
      return response.data.data as Settings;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<Settings>) => api.config.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

// Department Constraints
export function useDeptConstraints() {
  return useQuery({
    queryKey: ['deptConstraints'],
    queryFn: async () => {
      const response = await api.config.getDeptConstraints();
      return response.data.data as DepartmentConstraint[];
    },
  });
}

export function useUpdateDeptConstraints() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (constraints: DepartmentConstraint[]) =>
      api.config.updateDeptConstraints(constraints),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deptConstraints'] });
    },
  });
}

// Academic Year
export function useAcadYear() {
  return useQuery({
    queryKey: ['acadYear'],
    queryFn: async () => {
      const response = await api.config.getAcadYear();
      return response.data.data as string;
    },
  });
}

export function useUpdateAcadYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: string) => api.config.updateAcadYear(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acadYear'] });
    },
  });
}
