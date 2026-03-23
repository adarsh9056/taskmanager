import axios from 'axios';

import {
  clearSessionTokens,
  getAccessToken,
  getRefreshToken,
  setSessionTokens
} from '../utils/session';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let refreshRequest = null;

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isExpiredAccessToken =
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes('/auth/refresh');

    if (!isExpiredAccessToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshRequest) {
        const refreshToken = getRefreshToken();

        refreshRequest = axios
          .post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
          .then(({ data }) => {
            setSessionTokens(data.data.accessToken, data.data.refreshToken);
            return data.data.accessToken;
          })
          .finally(() => {
            refreshRequest = null;
          });
      }

      const accessToken = await refreshRequest;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearSessionTokens();

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
