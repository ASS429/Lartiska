/**
 * Tokens design Lartiska — light + dark.
 * Utiliser useTheme() (hook) pour récupérer la palette active.
 */
import { Platform, useColorScheme } from 'react-native';
import { useThemeStore } from '@/src/store/theme';

const palette = {
  gold: '#D4AF37',
  goldSoft: '#E8C547',
  goldDeep: '#B8941F',
  goldReadableLight: '#7A5408',
  cream: '#F5EDD6',
  ivory: '#FFFCF2',
  sand: '#C4A882',
  rust: '#B84A2A',
  ink: '#06040A',
  inkSoft: '#1A130A',
  whatsapp: '#25D366',
  emerald: '#34D399',
};

const dark = {
  ...palette,
  bg: '#07060A',
  ink: '#0A0806',
  inkSoft: '#14100B',
  surface: 'rgba(20, 16, 11, 0.7)',
  surfaceSolid: '#14100B',

  fg: '#F4ECD8',
  // Plus contrastés pour la lisibilité (avant : 0.78 / 0.55)
  fgMuted: 'rgba(244, 236, 216, 0.86)',
  fgDim: 'rgba(244, 236, 216, 0.68)',

  line: 'rgba(212, 175, 55, 0.26)',
  lineSoft: 'rgba(212, 175, 55, 0.14)',

  // Gold readable on dark surfaces
  goldText: palette.gold,

  pending: palette.sand,
  processing: palette.gold,
  sent: palette.goldSoft,
  accepted: palette.emerald,
  rejected: palette.rust,
};

const light = {
  ...palette,
  bg: '#FBF5E5',
  ink: '#FFFCF2',
  inkSoft: '#F5EDD6',
  surface: 'rgba(255, 252, 241, 0.92)',
  surfaceSolid: '#FFFCF2',

  fg: palette.ink,
  // Plus contrastés pour la lisibilité sur fond crème
  fgMuted: 'rgba(6, 4, 10, 0.85)',
  fgDim: 'rgba(6, 4, 10, 0.68)',

  line: 'rgba(122, 84, 8, 0.38)',
  lineSoft: 'rgba(122, 84, 8, 0.22)',

  // Le gold pur D4AF37 est illisible sur fond crème — on utilise un brun doré profond
  goldText: palette.goldReadableLight,

  pending: '#9A7B3A',
  processing: palette.goldReadableLight,
  sent: '#7C6620',
  accepted: '#10884F',
  rejected: '#8A2D17',
};

export type ThemeColors = typeof dark;

/**
 * Hook qui retourne la palette active :
 * - 'light' / 'dark' : forcé par l'utilisateur
 * - 'system' : suit useColorScheme() de l'OS
 */
export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);
  const resolved = mode === 'system' ? (scheme === 'light' ? 'light' : 'dark') : mode;
  return resolved === 'light' ? light : dark;
}

/** Pour le label dans le toggle. */
export function useResolvedThemeMode(): 'light' | 'dark' {
  const scheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);
  return mode === 'system' ? (scheme === 'light' ? 'light' : 'dark') : mode;
}

/** Accès statique pour les fichiers qui ne peuvent pas appeler le hook. */
export const colors = dark; // legacy — préférer useThemeColors()

export const lightColors = light;
export const darkColors = dark;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  caption: 12,
  small: 14,
  body: 16,
  lg: 19,
  xl: 23,
  xxl: 30,
  hero: 40,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
};

export const fonts = Platform.select({
  ios: { sans: 'System', serif: 'Georgia', mono: 'Menlo' },
  default: { sans: 'normal', serif: 'serif', mono: 'monospace' },
})!;

// Compat expo-router
export const Colors = {
  light: { text: light.fg, background: light.bg, tint: light.goldText, icon: light.fgMuted, tabIconDefault: light.fgDim, tabIconSelected: light.goldText },
  dark: { text: dark.fg, background: dark.bg, tint: dark.goldText, icon: dark.fgMuted, tabIconDefault: dark.fgDim, tabIconSelected: dark.goldText },
};

export const Fonts = fonts;
