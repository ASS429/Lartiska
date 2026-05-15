/**
 * Tokens design Lartiska — mêmes valeurs que web/tailwind.config.js
 */
import { Platform } from 'react-native';

export const colors = {
  // Palette signature
  gold: '#D4AF37',
  goldSoft: '#E8C547',
  goldDeep: '#B8941F',

  // Surfaces (dark only — mobile en dark mode par défaut)
  bg: '#07060A',
  ink: '#0A0806',
  inkSoft: '#14100B',
  surface: 'rgba(20, 16, 11, 0.7)',

  // Texte
  fg: '#F4ECD8',
  fgMuted: 'rgba(244, 236, 216, 0.65)',
  fgDim: 'rgba(244, 236, 216, 0.45)',

  cream: '#F5EDD6',
  sand: '#C4A882',
  rust: '#B84A2A',

  // Lines / borders
  line: 'rgba(212, 175, 55, 0.18)',
  lineSoft: 'rgba(212, 175, 55, 0.10)',

  // Statuts devis
  pending: '#C4A882',
  processing: '#D4AF37',
  sent: '#E8C547',
  accepted: '#34D399',
  rejected: '#B84A2A',

  // WhatsApp
  whatsapp: '#25D366',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  caption: 11,
  small: 13,
  body: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 38,
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

// Compat avec le template Expo par défaut (utilisé par expo-router)
export const Colors = {
  light: {
    text: colors.fg,
    background: colors.bg,
    tint: colors.gold,
    icon: colors.fgMuted,
    tabIconDefault: colors.fgDim,
    tabIconSelected: colors.gold,
  },
  dark: {
    text: colors.fg,
    background: colors.bg,
    tint: colors.gold,
    icon: colors.fgMuted,
    tabIconDefault: colors.fgDim,
    tabIconSelected: colors.gold,
  },
};

export const Fonts = fonts;
