'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  profile: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const checkUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const data = await api.get<{ user: User; profile: User }>('/auth/me');
      setState({
        user: data.user,
        profile: data.profile,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Auth check error:', error);
      localStorage.removeItem('auth_token');
      setState({
        user: null,
        profile: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const data = await api.post<{ session: { access_token: string }; user: User; profile: User }>(
        '/auth/login',
        { email, password }
      );
      localStorage.setItem('auth_token', data.session.access_token);
      setState({
        user: data.user,
        profile: data.profile,
        loading: false,
        error: null,
      });
      return data;
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const data = await api.post<{
        session: { access_token: string };
        user: User;
        profile: User;
      }>('/auth/register', {
        email,
        password,
        full_name: fullName,
        phone,
      });
      localStorage.setItem('auth_token', data.session.access_token);
      setState({
        user: data.user,
        profile: data.profile,
        loading: false,
        error: null,
      });
      return data;
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore error
    } finally {
      localStorage.removeItem('auth_token');
      setState({
        user: null,
        profile: null,
        loading: false,
        error: null,
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updated = await api.put<User>('/users/profile', data);
      setState(prev => ({
        ...prev,
        profile: { ...prev.profile!, ...updated },
      }));
      return updated;
    } catch (error: any) {
      throw error;
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser: checkUser,
    isAuthenticated: !!state.user,
  };
}
