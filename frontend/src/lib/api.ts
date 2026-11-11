import axios from 'axios';
import { authStorage } from './auth-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach JWT Bearer Token if available in authStorage
api.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401 unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isAuthRoute = window.location.pathname.startsWith('/admin/login');
      if (!isAuthRoute && window.location.pathname.startsWith('/admin')) {
        authStorage.clear();
        const loginUrl = '/admin/login?expired=1';
        window.location.replace(loginUrl);
      }
    }
    return Promise.reject(error);
  }
);
