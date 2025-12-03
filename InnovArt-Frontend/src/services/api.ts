import axios from 'axios';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Configura axios globalmente con baseURL y Authorization si hay token
axios.defaults.baseURL = API_URL;
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

axios.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('token');
    if (t) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${t}`;
    }
  }
  return config;
});
