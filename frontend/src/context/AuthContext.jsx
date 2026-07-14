import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tokdak_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('tokdak_token') || null;
  });

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data.data;

    localStorage.setItem('tokdak_token', token);
    localStorage.setItem('tokdak_user', JSON.stringify(user));

    setToken(token);
    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem('tokdak_token');
    localStorage.removeItem('tokdak_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('tokdak_user', JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (!token || !user?.user_id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/auth/me');
        const data = res.data?.data || res.data || {};
        if (!cancelled && data.avatar_url) {
          updateUser({ avatar_url: data.avatar_url });
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [token, user?.user_id]);

  const getAvatarUrl = () => {
    if (!user?.avatar_url) return null;
    const base = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
    return `${base}${user.avatar_url}`;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, getAvatarUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
