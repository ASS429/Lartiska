import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { fetchAdminQuotes } from '@/api/admin';
import { apiClient } from '@/api/client';

const STATUSES = [
  { value: '', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours' },
  { value: 'sent', label: 'Envoyés' },
  { value: 'accepted', label: 'Acceptés' },
  { value: 'rejected', label: 'Refusés' },
];

const STATUS_COLORS = {
  pending: 'bg-sand/15 text-sand border-sand/30',
  processing: 'bg-gold/15 text-gold border-gold/30',
  sent: 'bg-cream/10 text-cream border-cream/25',
  accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30',
  rejected: 'bg-rust/15 text-rust border-rust/30',
  expired: 'bg-fg/10 text-fg/55 border-line',
};

export default function AdminQuotes() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-quotes', { status, search, page }],
    queryFn: () => fetchAdminQuotes({ status, search, page }),
    keepPreviousData: true,
  });

  const quotes = data?.data || [];
  const meta = data?.meta;

  const exportCsv = async (params) => {
    const response = await apiClient.get('/admin/quotes/export', {
      params,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `devis-lartiska-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Devis</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light">Toutes les demandes</h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="search"
            placeholder="Rechercher (référence, nom, email…)"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="lartiska-input sm:max-w-xs"
          />
          <button
            type="button"
            onClick={() => exportCsv({ status, search })}
            className="btn-ghost !py-2.5 !px-4 text-xs whitespace-nowrap shrink-0"
            title="Télécharger un CSV des devis filtrés"
          >
            ⤓ Export CSV
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => { setStatus(s.value); setPage(1); }}
            className={clsx(
              'px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-all',
              status === s.value ? 'border-gold bg-gold/10 text-gold' : 'border-line text-fg/65 hover:text-gold',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="surface-card overflow-hidden">
        {isLoading ? (
          <p className="p-10 text-center text-fg/55">Chargement…</p>
        ) : quotes.length === 0 ? (
          <p className="p-10 text-center text-fg/55">Aucun devis ne correspond.</p>
        ) : (
          <>
            {/* Desktop : tableau classique */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-ink/40 border-b border-line">
                  <tr className="text-left text-xs uppercase tracking-widest text-fg/55">
                    <th className="px-5 py-4">Référence</th>
                    <th className="px-5 py-4">Client</th>
                    <th className="px-5 py-4 hidden md:table-cell">Service</th>
                    <th className="px-5 py-4 hidden lg:table-cell">Reçu</th>
                    <th className="px-5 py-4">Statut</th>
                    <th className="px-5 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-ink-soft/40 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-gold">{q.reference}</td>
                      <td className="px-5 py-4">
                        <p className="font-medium">{q.client_name}</p>
                        <p className="text-xs text-fg/55 break-all">{q.client_email}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-fg/75">{q.service?.title || '—'}</td>
                      <td className="px-5 py-4 hidden lg:table-cell text-fg/55 whitespace-nowrap">
                        {q.created_at ? new Date(q.created_at).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={clsx('inline-block text-xs px-2.5 py-1 rounded-full border whitespace-nowrap', STATUS_COLORS[q.status])}>
                          {STATUSES.find((s) => s.value === q.status)?.label || q.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link to={`/admin/quotes/${q.id}`} className="text-xs uppercase tracking-widest text-gold hover:underline whitespace-nowrap">
                          Détail →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile : liste de cartes */}
            <ul className="sm:hidden divide-y divide-line">
              {quotes.map((q) => (
                <li key={q.id}>
                  <Link
                    to={`/admin/quotes/${q.id}`}
                    className="block p-4 hover:bg-ink-soft/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-mono text-xs text-gold">{q.reference}</p>
                      <span className={clsx('text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0', STATUS_COLORS[q.status])}>
                        {STATUSES.find((s) => s.value === q.status)?.label || q.status}
                      </span>
                    </div>
                    <p className="font-medium text-sm">{q.client_name}</p>
                    <p className="text-xs text-fg/55 break-all">{q.client_email}</p>
                    <p className="text-xs text-fg/70 mt-1">{q.service?.title || '—'}</p>
                    <p className="text-[11px] text-fg/45 mt-1">
                      {q.created_at ? new Date(q.created_at).toLocaleDateString('fr-FR') : ''}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-fg/55">
            Page {meta.current_page} sur {meta.last_page} · {meta.total} demande{meta.total > 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page === 1}
              className="btn-ghost !py-2 !px-4 text-xs disabled:opacity-40 disabled:pointer-events-none"
            >
              ← Précédent
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={meta.current_page === meta.last_page}
              className="btn-ghost !py-2 !px-4 text-xs disabled:opacity-40 disabled:pointer-events-none"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
