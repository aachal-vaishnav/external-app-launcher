import axios from 'axios';

// ✅ Axios instance with correct backend base URL
const API = axios.create({
  baseURL: 'http://localhost:5000', // Fixed: removed extra /api
});

// ✅ Helper to attach JWT token to all requests
export function setToken(token) {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
}

export default API;
