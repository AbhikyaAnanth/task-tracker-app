import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/tasks`,
});

// CRUD API functions
export const getTasks = () => api.get('/');
export const getTaskById = (id) => api.get(`/${id}`);
export const createTask = (data) => api.post('/', data);
export const updateTask = (id, data) => api.put(`/${id}`, data);
export const deleteTask = (id) => api.delete(`/${id}`);
