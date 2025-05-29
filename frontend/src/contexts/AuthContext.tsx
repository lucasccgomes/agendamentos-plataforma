'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../services/api';
import Cookies from 'js-cookie';
import type { User } from '@/types/types';

interface AuthContextData {
  user: User | null;
  token: string | null;
  loadingAuth: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = Cookies.get('app_token');
    const storedUser = Cookies.get('app_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch {
        Cookies.remove('app_token');
        Cookies.remove('app_user');
      }
    }

    setLoadingAuth(false);
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;

      setUser(user);
      setToken(access_token);

      const isProd = process.env.NODE_ENV === 'production';

      const cookieOptions: Cookies.CookieAttributes = {
        expires: remember ? 7 : undefined,
        secure: isProd,
        sameSite: 'Lax',
        path: '/',
      };

      Cookies.set('app_token', access_token, cookieOptions);
      Cookies.set('app_user', JSON.stringify(user), cookieOptions);

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      router.push('/dashboard');
    } catch {
      throw new Error('Falha ao fazer login. Verifique as credenciais.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('app_token');
    Cookies.remove('app_user');
    delete api.defaults.headers.common['Authorization'];
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loadingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
