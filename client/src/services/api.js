import axios from 'axios';

const getAPIBaseURL = () => {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  if (envURL) return envURL;
  
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3001';
  } else {
    return 'https://task-tracker-app-backend.onrender.com';
  }
};

const API_BASE_URL = getAPIBaseURL();

const TOKEN_KEY = 'auth_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL: `${API_BASE_URL}/tasks`,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken(); 
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
  if (response.data.token) {
    setToken(response.data.token);
  }
  return response;
};

export const register = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
  if (response.data.token) {
    setToken(response.data.token); 
  }
  return response;
};

export const logout = () => {
  removeToken(); 
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