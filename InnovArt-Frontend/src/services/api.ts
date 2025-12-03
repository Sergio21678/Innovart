import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = API_URL;

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

axios.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('token');
    if (t) {
        // Usamos (config.headers as any) para saltar la validación estricta de Axios
        if (!config.headers) {
            (config.headers as any) = {};
        }
        (config.headers as any)['Authorization'] = `Bearer ${t}`;
    }
  }
  return config;
});
