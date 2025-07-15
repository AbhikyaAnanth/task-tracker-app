import axios from 'axios';

// Determine API base URL with proper fallbacks
const getAPIBaseURL = () => {
  // Check for environment variable first
  const envURL = import.meta.env.VITE_API_BASE_URL;
  if (envURL) return envURL;
  
  // Fallback logic based on current host
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3001';
  } else {
    // Production fallback - use your Render backend
    return 'https://task-tracker-app-backend.onrender.com';
  }
};

const API_BASE_URL = getAPIBaseURL();

// Token management
const TOKEN_KEY = 'auth_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// Create axios instance with JWT support
const api = axios.create({
  baseURL: `${API_BASE_URL}/tasks`,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, the token is invalid or expired
    if (error.response?.status === 401) {
      removeToken(); // Clear invalid token
      window.location.reload(); // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
  if (response.data.token) {
    setToken(response.data.token); // Store JWT token
  }
  return response;
};

export const register = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
  if (response.data.token) {
    setToken(response.data.token); // Store JWT token
  }
  return response;
};

export const logout = () => {
  removeToken(); // Remove JWT token
  return axios.post(`${API_BASE_URL}/auth/logout`);
};

export const checkAuth = () => {
  const token = getToken();
  if (!token) {
    return Promise.reject(new Error('No token found'));
  }
  return axios.get(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// CRUD API functions
export const getTasks = () => api.get('/');
export const createTask = (data) => api.post('/', data);
export const updateTask = (id, data) => api.put(`/${id}`, data);
export const deleteTask = (id) => api.delete(`/${id}`);