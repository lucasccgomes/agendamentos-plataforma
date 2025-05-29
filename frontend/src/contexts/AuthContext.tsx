'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../services/api';
import type { User } from '@/types/types';

interface AuthContextData {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storagedUser = localStorage.getItem('@App:user');
    const storagedToken = localStorage.getItem('@App:token');

    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
      setToken(storagedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
  
      setUser(user);
      setToken(access_token);
  
      localStorage.setItem('@App:user', JSON.stringify(user));
      localStorage.setItem('@App:token', access_token);
  
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
      router.push('/dashboard');
    } catch {
      throw new Error('Falha ao fazer login. Verifique as credenciais.');
    }
  };  

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('@App:user');
    localStorage.removeItem('@App:token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
