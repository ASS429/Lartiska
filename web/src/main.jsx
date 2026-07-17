import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import App from './App.jsx';

// PWA : service worker (cache photos/vidéos/API + notifications push).
// autoUpdate : les nouvelles versions du site s'installent toutes seules.
registerSW({ immediate: true });

// Monitoring d'erreurs — actif seulement si VITE_SENTRY_DSN est défini
// (variable posée sur Render ; en local rien n'est envoyé).
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Erreurs uniquement — pas de tracing/replay pour garder le bundle
    // léger et ne pas consommer le quota gratuit.
    sampleRate: 1.0,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);
