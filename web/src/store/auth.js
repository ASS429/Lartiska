import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as auth from '@/api/endpoints';

const TOKEN_KEY = 'lartiska_token';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: 'idle', // 'idle' | 'loading' | 'authenticated' | 'error'
      error: null,

      login: async ({ email, password }) => {
        set({ status: 'loading', error: null });
        try {
          const response = await auth.login({ email, password, device_name: 'web' });
          const { data: user, token } = response;
          localStorage.setItem(TOKEN_KEY, token);
          set({ user, token, status: 'authenticated', error: null });
          return user;
        } catch (e) {
          const message = e?.response?.data?.message
            || e?.response?.data?.errors?.email?.[0]
            || 'Connexion impossible.';
          set({ status: 'error', error: message });
          throw e;
        }
      },

      logout: async () => {
        try {
          if (get().token) {
            await auth.logout();
          }
        } catch (_e) { /* ignore */ }
        localStorage.removeItem(TOKEN_KEY);
        set({ user: null, token: null, status: 'idle', error: null });
      },

      hydrate: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
          set({ status: 'idle', user: null, token: null });
          return;
        }
        set({ token, status: 'loading' });
        try {
          const user = await auth.fetchMe();
          set({ user, status: 'authenticated' });
        } catch (_e) {
          localStorage.removeItem(TOKEN_KEY);
          set({ user: null, token: null, status: 'idle' });
        }
      },

      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'lartiska_auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
