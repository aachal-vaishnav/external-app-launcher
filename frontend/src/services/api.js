import axios from 'axios';

// Use Vite env var or fallback to localhost
const API = axios.create({
  //baseURL: import.meta.env.VITE_BACKEND_ROOT || 'http://localhost:5000'
  baseURL: 'http://localhost:5000'
});

export function setToken(token) {
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default API;
