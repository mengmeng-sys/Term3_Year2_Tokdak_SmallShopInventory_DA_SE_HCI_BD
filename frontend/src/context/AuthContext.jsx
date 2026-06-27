import { createContext, useContext, useState } from 'react';
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

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
