import { create } from 'zustand';
import * as auth from '@/api/endpoints';

// Source unique du token : la clé lartiska_token (lue par l'intercepteur axios).
// On ne persiste volontairement PAS le user : il contient des données
// personnelles qui resteraient en localStorage sur machine partagée.
// hydrate() re-fetch /auth/me au chargement — le user vit en mémoire seulement.
const TOKEN_KEY = 'lartiska_token';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem(TOKEN_KEY),
  status: 'idle', // 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'
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
    } catch { /* ignore */ }
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null, status: 'unauthenticated', error: null });
  },

  hydrate: async () => {
    // Migration : purge de l'ancien persist Zustand (token dupliqué + user en clair).
    localStorage.removeItem('lartiska_auth');

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      // Hydrate terminé sans token → état "unauthenticated" (distinct de 'idle'
      // qui est l'état initial avant tentative). RequireAuth peut maintenant
      // rediriger vers /login au lieu de boucler sur "Chargement…".
      set({ status: 'unauthenticated', user: null, token: null });
      return;
    }
    set({ token, status: 'loading' });
    try {
      const user = await auth.fetchMe();
      set({ user, status: 'authenticated' });
    } catch {
      // Token présent mais invalide (expiré, révoqué) → idem
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, token: null, status: 'unauthenticated' });
    }
  },

  isAdmin: () => get().user?.role === 'admin',
}));
