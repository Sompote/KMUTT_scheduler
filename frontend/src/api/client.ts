import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;

// Generic API functions
export const api = {
  // Years
  years: {
    getAll: () => apiClient.get('/years'),
    getById: (id: string) => apiClient.get(`/years/${id}`),
    create: (data: any) => apiClient.post('/years', data),
    update: (id: string, data: any) => apiClient.put(`/years/${id}`, data),
    delete: (id: string) => apiClient.delete(`/years/${id}`),
  },

  // Rooms
  rooms: {
    getAll: () => apiClient.get('/rooms'),
    getById: (id: string) => apiClient.get(`/rooms/${id}`),
    create: (data: any) => apiClient.post('/rooms', data),
    update: (id: string, data: any) => apiClient.put(`/rooms/${id}`, data),
    delete: (id: string) => apiClient.delete(`/rooms/${id}`),
  },

  // Instructors
  instructors: {
    getAll: () => apiClient.get('/instructors'),
    getById: (id: string) => apiClient.get(`/instructors/${id}`),
    create: (data: any) => apiClient.post('/instructors', data),
    update: (id: string, data: any) => apiClient.put(`/instructors/${id}`, data),
    delete: (id: string) => apiClient.delete(`/instructors/${id}`),
  },

  // Subjects
  subjects: {
    getAll: () => apiClient.get('/subjects'),
    getById: (id: string) => apiClient.get(`/subjects/${id}`),
    create: (data: any) => apiClient.post('/subjects', data),
    update: (id: string, data: any) => apiClient.put(`/subjects/${id}`, data),
    delete: (id: string) => apiClient.delete(`/subjects/${id}`),
  },

  // Sessions
  sessions: {
    getAll: () => apiClient.get('/sessions'),
    getById: (id: string) => apiClient.get(`/sessions/${id}`),
    create: (data: any) => apiClient.post('/sessions', data),
    update: (id: string, data: any) => apiClient.put(`/sessions/${id}`, data),
    delete: (id: string) => apiClient.delete(`/sessions/${id}`),
    deleteAll: () => apiClient.delete('/sessions'),
    sync: () => apiClient.post('/sessions/sync'),
    autoAssign: () => apiClient.post('/sessions/auto-assign'),
  },

  // Config
  config: {
    getAcadYear: () => apiClient.get('/config/acad-year'),
    updateAcadYear: (value: string) => apiClient.put('/config/acad-year', { value }),
    getSettings: () => apiClient.get('/config/settings'),
    updateSettings: (data: any) => apiClient.put('/config/settings', data),
    getDeptConstraints: () => apiClient.get('/config/dept-constraints'),
    updateDeptConstraints: (data: any) => apiClient.put('/config/dept-constraints', data),
  },
};
