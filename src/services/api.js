import axios from 'axios';

const AUTH_KEY = 'careerhub-auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }
  const storedAuth = localStorage.getItem(AUTH_KEY);
  if (storedAuth) {
    try {
      const { token } = JSON.parse(storedAuth);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (!response.data.success) {
        return Promise.reject(new Error(response.data.message || 'The request failed.'));
      }
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem(AUTH_KEY);
      window.dispatchEvent(new Event('careerhub:auth-expired'));
    }
    const message = error.response?.data?.message
      || error.response?.data?.error
      || (error.code === 'ECONNABORTED' ? 'The server is waking up — please wait a moment and try again.' : null)
      || error.message
      || 'Unable to connect to CareerHub. Check that the backend is running.';
    return Promise.reject(new Error(message));
  }
);

export default api;
