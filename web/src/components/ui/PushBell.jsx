import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';

/**
 * Abonnement aux notifications push (PWA) : « Être alerté des nouvelles
 * réalisations ». Invisible si le navigateur ne supporte pas le push ou
 * si les clés VAPID ne sont pas configurées côté serveur.
 */
function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function PushBell() {
  const [state, setState] = useState('checking'); // checking | unsupported | off | on | busy | denied

  useEffect(() => {
    (async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
        setState('unsupported');
        return;
      }
      if (Notification.permission === 'denied') {
        setState('denied');
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setState(sub ? 'on' : 'off');
      } catch {
        setState('unsupported');
      }
    })();
  }, []);

  const toggle = async () => {
    setState('busy');
    try {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();

      if (existing) {
        await apiClient.post('/push/unsubscribe', { endpoint: existing.endpoint }).catch(() => {});
        await existing.unsubscribe();
        setState('off');
        return;
      }

      const { data } = await apiClient.get('/push/key').then((r) => r.data);
      if (!data?.key) { setState('unsupported'); return; }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { setState('denied'); return; }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.key),
      });
      const json = sub.toJSON();
      await apiClient.post('/push/subscribe', {
        endpoint: sub.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      });
      setState('on');
    } catch {
      setState('off');
    }
  };

  if (state === 'checking' || state === 'unsupported') return null;

  return (
    <button
      type="button"
      onClick={state === 'denied' ? undefined : toggle}
      disabled={state === 'busy' || state === 'denied'}
      title={state === 'denied' ? 'Notifications bloquées dans les réglages du navigateur' : undefined}
      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border border-line rounded-full px-4 py-2 text-fg/80 hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
    >
      <span aria-hidden="true">{state === 'on' ? '🔔' : '🔕'}</span>
      {state === 'on' && 'Alertes activées'}
      {state === 'off' && 'Être alerté des nouveautés'}
      {state === 'busy' && 'Un instant…'}
      {state === 'denied' && 'Notifications bloquées'}
    </button>
  );
}
