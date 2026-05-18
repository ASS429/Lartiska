import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { fetchAdminMessages, fetchAdminMessage, markAdminMessageRead } from '@/api/admin';

export default function AdminMessages() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-messages', { unreadOnly }],
    queryFn: () => fetchAdminMessages({ unread_only: unreadOnly }),
  });

  const { data: detail } = useQuery({
    queryKey: ['admin-message', selectedId],
    queryFn: () => fetchAdminMessage(selectedId),
    enabled: !!selectedId,
  });

  const markRead = useMutation({
    mutationFn: (id) => markAdminMessageRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  const messages = data?.data || [];

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-2">Messages</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light">Boîte de réception</h1>
        </div>
        <label className="flex items-center gap-2 text-sm text-fg/75 cursor-pointer">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="accent-gold"
          />
          Non lus uniquement
        </label>
      </header>

      <div className="grid lg:grid-cols-[2fr_3fr] gap-6">
        {/* Liste — masquée sur mobile quand un message est sélectionné */}
        <div className={clsx(
          'surface-card overflow-hidden divide-y divide-line lg:max-h-[70vh] lg:overflow-y-auto',
          selectedId ? 'hidden lg:block' : '',
        )}>
          {isLoading ? (
            <p className="p-8 text-center text-fg/55">Chargement…</p>
          ) : messages.length === 0 ? (
            <p className="p-8 text-center text-fg/55">Aucun message.</p>
          ) : (
            messages.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedId(m.id);
                  if (!m.is_read) markRead.mutate(m.id);
                }}
                className={clsx(
                  'w-full text-left px-5 py-4 transition-colors flex items-start gap-3',
                  selectedId === m.id ? 'bg-gold/10' : 'hover:bg-ink-soft/50',
                )}
              >
                <span className={clsx(
                  'mt-2 w-2 h-2 rounded-full shrink-0',
                  m.is_read ? 'bg-fg/20' : 'bg-gold',
                )} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={clsx('font-medium truncate', m.is_read ? 'text-fg/75' : 'text-fg')}>
                      {m.name}
                    </p>
                    <span className="text-xs text-fg/45 shrink-0">
                      {m.created_at ? new Date(m.created_at).toLocaleDateString('fr-FR') : ''}
                    </span>
                  </div>
                  <p className="text-xs text-fg/55 truncate mt-0.5">{m.subject || '—'}</p>
                  <p className="text-xs uppercase tracking-widest text-gold/70 mt-1">{m.source}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Détail — masqué sur mobile quand aucun message sélectionné */}
        <div className={clsx(
          'surface-card p-6',
          !selectedId ? 'hidden lg:block' : '',
        )}>
          {!selectedId ? (
            <p className="text-fg/55 text-center py-12">Sélectionnez un message pour le lire.</p>
          ) : !detail ? (
            <p className="text-fg/55">Chargement…</p>
          ) : (
            <article>
              {/* Bouton retour mobile */}
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="lg:hidden text-xs uppercase tracking-widest text-fg/55 hover:text-gold mb-4"
              >
                ← Boîte de réception
              </button>

              <header className="border-b border-line pb-5 mb-5">
                <p className="text-xs uppercase tracking-widest text-gold/80 mb-2">{detail.source}</p>
                <h2 className="font-serif text-2xl mb-1">{detail.subject || '(sans sujet)'}</h2>
                <p className="text-fg/75 break-words">
                  <strong>{detail.name}</strong>
                  {detail.email && <> · <a href={`mailto:${detail.email}`} className="text-gold hover:underline break-all">{detail.email}</a></>}
                  {detail.phone && <> · {detail.phone}</>}
                </p>
                <p className="text-xs text-fg/45 mt-2">
                  Reçu le {new Date(detail.created_at).toLocaleString('fr-FR')}
                </p>
              </header>

              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-fg/85 leading-relaxed">
                {detail.body}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {detail.email && (
                  <a href={`mailto:${detail.email}`} className="btn-gold text-xs !py-2 !px-4">
                    Répondre par email
                  </a>
                )}
                {detail.phone && (
                  <a
                    href={`https://wa.me/${detail.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost text-xs !py-2 !px-4"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
