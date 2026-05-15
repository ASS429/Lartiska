import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/src/store/auth';
import { colors } from '@/constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 60_000 },
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

const LartiskaTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.gold,
    background: colors.bg,
    card: colors.ink,
    text: colors.fg,
    border: colors.line,
    notification: colors.gold,
  },
};

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={LartiskaTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth/login" options={{ presentation: 'modal', headerShown: true, title: 'Connexion' }} />
          <Stack.Screen name="auth/register" options={{ presentation: 'modal', headerShown: true, title: 'Créer un compte' }} />
          <Stack.Screen name="project/[slug]" options={{ headerShown: true, title: '', headerBackTitle: 'Portfolio' }} />
          <Stack.Screen name="quote/[id]" options={{ headerShown: true, title: 'Mon devis' }} />
          <Stack.Screen name="admin/quotes/index" options={{ headerShown: true, title: 'Devis (admin)' }} />
          <Stack.Screen name="admin/quotes/[id]" options={{ headerShown: true, title: '', headerBackTitle: 'Devis' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
