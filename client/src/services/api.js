import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create axios instance with session support
const api = axios.create({
  baseURL: `${API_BASE_URL}/tasks`,
  withCredentials: true, // Include cookies in requests
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, the user session has expired
    if (error.response?.status === 401) {
      // Clear any cached user data and redirect to login
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = (data) => axios.post(`${API_BASE_URL}/auth/login`, data, { withCredentials: true });
export const register = (data) => axios.post(`${API_BASE_URL}/auth/register`, data, { withCredentials: true });
export const logout = () => axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
export const checkAuth = () => axios.get(`${API_BASE_URL}/auth/me`, { withCredentials: true });

// CRUD API functions
export const getTasks = () => api.get('/');
export const createTask = (data) => api.post('/', data);
export const updateTask = (id, data) => api.put(`/${id}`, data);
export const deleteTask = (id) => api.delete(`/${id}`);