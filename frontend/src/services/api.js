import axios from 'axios';
const API = axios.create({ baseURL: process.env.BACKEND_ROOT || 'http://localhost:5000' });
export function setToken(token){ API.defaults.headers.common['Authorization'] = 'Bearer '+token; }
export default API;
