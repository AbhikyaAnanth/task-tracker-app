// Import axios library - this helps us make HTTP requests to our backend
import axios from 'axios';

// FUNCTION: Figure out what URL our backend is running on
// This is smart - it works in development AND production
const getAPIBaseURL = () => {
  // First, check if there's an environment variable set
  const envURL = import.meta.env.VITE_API_BASE_URL;
  if (envURL) return envURL; // If found, use it
  
  // If no environment variable, decide based on where we're running
  if (window.location.hostname === 'localhost') {
    // If we're on localhost (development), use local backend
    return 'http://localhost:3001';
  } else {
    // If we're on the internet (production), use deployed backend
    return 'https://task-tracker-app-backend.onrender.com';
  }
};

// Get the backend URL and store it
const API_BASE_URL = getAPIBaseURL();

// TOKEN MANAGEMENT SECTION
// This handles storing and retrieving the JWT token in the browser

// The key name we use to store the token in browser's localStorage
const TOKEN_KEY = 'auth_token';

// FUNCTION: Get the stored token from browser storage
export const getToken = () => localStorage.getItem(TOKEN_KEY);

// FUNCTION: Save a token to browser storage
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

// FUNCTION: Delete the token from browser storage (for logout)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// AXIOS SETUP SECTION
// Create a special axios instance for making requests to our task endpoints

// Create axios instance that will always go to /tasks endpoint
const api = axios.create({
  baseURL: `${API_BASE_URL}/tasks`, // All requests will start with this URL
});

// REQUEST INTERCEPTOR: This runs BEFORE every request
// Think of it like a helper that automatically adds our ID card to every request
api.interceptors.request.use(
  (config) => {
    // Get the current token
    const token = getToken();
    if (token) {
      // If we have a token, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Continue with the request
  },
  (error) => Promise.reject(error) // If something goes wrong, pass the error along
);

// RESPONSE INTERCEPTOR: This runs AFTER every response
// Think of it like a security guard checking responses
api.interceptors.response.use(
  (response) => response, // If response is good, just pass it through
  (error) => {
    // If we get a 401 error (unauthorized), it means our token is invalid
    if (error.response?.status === 401) {
      removeToken();  // Delete the bad token
      window.location.reload(); // Refresh the page to show login form
    }
    return Promise.reject(error); // Pass the error to whoever made the request
  }
);

// AUTHENTICATION FUNCTIONS
// These handle login, register, logout, and checking if user is logged in

// FUNCTION: Log in a user
export const login = async (data) => {
  // Send email and password to backend
  const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
  
  // If login was successful and we got a token back
  if (response.data.token) {
    setToken(response.data.token); // Save the token for future requests
  }
  return response; // Return the response to whoever called this function
};

// FUNCTION: Register a new user
export const register = async (data) => {
  // Send name, email, and password to backend
  const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
  
  // If registration was successful and we got a token back
  if (response.data.token) {
    setToken(response.data.token); // Save the token (auto-login after registration)
  }
  return response; // Return the response
};

// FUNCTION: Log out the user
export const logout = () => {
  removeToken(); // Delete the token from browser storage
  // Also tell the backend about the logout (optional with JWT)
  return axios.post(`${API_BASE_URL}/auth/logout`);
};

// FUNCTION: Check if the current user is still logged in
export const checkAuth = () => {
  const token = getToken(); // Get the stored token
  if (!token) {
    // If no token found, immediately reject (user is not logged in)
    return Promise.reject(new Error('No token found'));
  }
  // If we have a token, ask the backend "who am I?"
  return axios.get(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` } // Include the token
  });
};

// TASK MANAGEMENT FUNCTIONS (CRUD = Create, Read, Update, Delete)
// These use the 'api' instance which automatically includes the token

// FUNCTION: Get all tasks for the current user
export const getTasks = () => api.get('/'); // GET request to /tasks

// FUNCTION: Create a new task
export const createTask = (data) => api.post('/', data); // POST request to /tasks

// FUNCTION: Update an existing task
export const updateTask = (id, data) => api.put(`/${id}`, data); // PUT request to /tasks/:id

// FUNCTION: Delete a task
export const deleteTask = (id) => api.delete(`/${id}`); // DELETE request to /tasks/:id