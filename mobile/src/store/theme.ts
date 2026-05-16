import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
      toggle: () => {
        const m = get().mode;
        // Rotation : system → light → dark → system
        set({ mode: m === 'system' ? 'light' : m === 'light' ? 'dark' : 'system' });
      },
    }),
    {
      name: 'lartiska_theme',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
