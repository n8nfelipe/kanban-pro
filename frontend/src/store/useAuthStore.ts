import { create } from 'zustand';
import api from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: true,

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, loading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, loading: false });
  },

  fetchUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const res = await api.get('/api/auth/me');
      set({ user: res.data, token, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },
}));
