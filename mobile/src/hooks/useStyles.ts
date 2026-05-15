import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useThemeColors, type ThemeColors } from '@/constants/theme';

/**
 * Helper pour créer un StyleSheet réactif au thème (light/dark).
 *
 * Usage :
 *   const styles = useStyles((c) => ({
 *     screen: { backgroundColor: c.bg },
 *     title: { color: c.fg },
 *   }));
 */
export function useStyles<T extends Record<string, any>>(
  factory: (c: ThemeColors) => T,
): { styles: ReturnType<typeof StyleSheet.create<T>>; c: ThemeColors } {
  const c = useThemeColors();
  const styles = useMemo(() => StyleSheet.create(factory(c)), [c]);
  return { styles, c };
}
