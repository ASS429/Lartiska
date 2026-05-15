import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { TOKEN_KEY } from '../api/client';
import { fetchMe, login as apiLogin, logout as apiLogout, register as apiRegister, type User } from '../api/endpoints';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

type AuthState = {
  user: User | null;
  status: AuthStatus;
  error: string | null;

  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) => Promise<{ user: User; claimed: number }>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: 'idle',
  error: null,

  hydrate: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ status: 'idle', user: null });
      return;
    }
    set({ status: 'loading' });
    try {
      const user = await fetchMe();
      set({ user, status: 'authenticated' });
    } catch {
      await AsyncStorage.removeItem(TOKEN_KEY);
      set({ user: null, status: 'idle' });
    }
  },

  login: async (email, password) => {
    set({ status: 'loading', error: null });
    try {
      const { data, token } = await apiLogin(email, password);
      await AsyncStorage.setItem(TOKEN_KEY, token);
      set({ user: data, status: 'authenticated', error: null });
      return data;
    } catch (e: any) {
      const msg = e?.response?.data?.message
        || e?.response?.data?.errors?.email?.[0]
        || 'Connexion impossible.';
      set({ status: 'error', error: msg });
      throw e;
    }
  },

  register: async (payload) => {
    set({ status: 'loading', error: null });
    try {
      const { data, token, claimed_quotes } = await apiRegister(payload);
      await AsyncStorage.setItem(TOKEN_KEY, token);
      set({ user: data, status: 'authenticated', error: null });
      return { user: data, claimed: claimed_quotes ?? 0 };
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Inscription impossible.';
      set({ status: 'error', error: msg });
      throw e;
    }
  },

  logout: async () => {
    try { if (get().user) await apiLogout(); } catch { /* ignore */ }
    await AsyncStorage.removeItem(TOKEN_KEY);
    set({ user: null, status: 'idle', error: null });
  },
}));
