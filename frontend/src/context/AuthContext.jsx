import { createContext, startTransition, useContext, useEffect, useState } from 'react';

import api from '../api/axios';
import {
  clearSessionTokens,
  getAccessToken,
  getRefreshToken,
  setSessionTokens
} from '../utils/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      if (!getAccessToken()) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        startTransition(() => {
          setUser(data.data.user);
        });
      } catch (_error) {
        clearSessionTokens();
      } finally {
        setLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setSessionTokens(data.data.accessToken, data.data.refreshToken);
    startTransition(() => {
      setUser(data.data.user);
    });
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    setSessionTokens(data.data.accessToken, data.data.refreshToken);
    startTransition(() => {
      setUser(data.data.user);
    });
    return data.data.user;
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken }).catch(() => null);
    }

    clearSessionTokens();
    startTransition(() => {
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
