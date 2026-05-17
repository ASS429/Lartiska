import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/src/store/auth';
import { useThemeColors, useResolvedThemeMode } from '@/constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 60_000 },
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const c = useThemeColors();
  const mode = useResolvedThemeMode();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const navTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: c.gold,
      background: c.bg,
      card: c.surfaceSolid,
      text: c.fg,
      border: c.line,
      notification: c.gold,
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth/login" options={{ presentation: 'modal', headerShown: true, title: 'Connexion' }} />
          <Stack.Screen name="auth/register" options={{ presentation: 'modal', headerShown: true, title: 'Créer un compte' }} />
          <Stack.Screen name="project/[slug]" options={{ headerShown: true, title: '', headerBackTitle: 'Portfolio' }} />
          <Stack.Screen name="quote/[id]" options={{ headerShown: true, title: 'Mon devis' }} />
          <Stack.Screen name="admin/quotes/index" options={{ headerShown: true, title: 'Devis (admin)' }} />
          <Stack.Screen name="admin/quotes/[id]" options={{ headerShown: true, title: '', headerBackTitle: 'Devis' }} />
          <Stack.Screen name="admin/messages/index" options={{ headerShown: true, title: 'Messages' }} />
          <Stack.Screen name="admin/messages/[id]" options={{ headerShown: true, title: '', headerBackTitle: 'Messages' }} />
          <Stack.Screen name="admin/projects/index" options={{ headerShown: true, title: 'Portfolio (admin)' }} />
          <Stack.Screen name="admin/projects/[id]" options={{ headerShown: true, title: '', headerBackTitle: 'Portfolio' }} />
          <Stack.Screen name="admin/services/index" options={{ headerShown: true, title: 'Services' }} />
          <Stack.Screen name="admin/testimonials/index" options={{ headerShown: true, title: 'Avis clients' }} />
          <Stack.Screen name="admin/settings" options={{ headerShown: true, title: 'Réglages' }} />
        </Stack>
        <StatusBar style={mode === 'light' ? 'dark' : 'light'} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
