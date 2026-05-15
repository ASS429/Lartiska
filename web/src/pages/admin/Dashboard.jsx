import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchAdminDashboard } from '@/api/admin';

const STATUS_LABELS = {
  pending: 'En attente',
  processing: 'En cours',
  sent: 'Envoyé',
  accepted: 'Accepté',
  rejected: 'Refusé',
  expired: 'Expiré',
};

const ACTION_LABELS = {
  'quote.pdf_generated': 'PDF généré',
  'quote.sent_to_client': 'Devis envoyé au client',
  'quote.status_changed': 'Statut changé',
  'quote.client_accept': '✓ Client a accepté',
  'quote.client_reject': '✕ Client a refusé',
  'quote.client_request_changes': '↺ Client demande modif',
  'quotes.claimed_on_register': 'Devis invités récupérés',
};

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchAdminDashboard,
  });

  if (isLoading) return <p className="text-fg/55">Chargement…</p>;
  if (!data) return null;

  const maxMonthly = Math.max(...(data.quotes_monthly?.map((m) => m.count) || [1]), 1);
  const maxTopService = Math.max(...(data.top_services?.map((s) => s.count) || [1]), 1);

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow mb-2">Dashboard</p>
        <h1 className="font-serif text-3xl md:text-4xl font-light">Vue d'ensemble</h1>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Devis ce mois" value={data.quotes.this_month} accent />
        <KpiCard label="En attente" value={data.quotes.pending} />
        <KpiCard label="Taux d'acceptation" value={`${data.quotes.acceptance_rate}%`} />
        <KpiCard label="Messages non lus" value={data.messages.unread} />
      </section>

      {/* Graphes : devis/mois + top services */}
      <section className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="surface-card p-6">
          <header className="mb-5">
            <p className="eyebrow mb-1">Demandes mensuelles</p>
            <h2 className="font-serif text-xl">6 derniers mois</h2>
          </header>
          <div className="h-44 flex items-end gap-2">
            {data.quotes_monthly.map((m) => {
              const totalH = (m.count / maxMonthly) * 100;
              const acceptedH = m.count > 0 ? (m.accepted / m.count) * totalH : 0;
              return (
                <div key={m.year_month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-mono text-fg/60">{m.count}</div>
                  <div className="w-full relative bg-ink/40 rounded-t-md overflow-hidden" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gold/30"
                      style={{ height: `${totalH}%` }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gold"
                      style={{ height: `${acceptedH}%` }}
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-fg/55 capitalize">{m.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-fg/55">
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-gold rounded-sm" />Acceptés</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-gold/30 rounded-sm" />Total</span>
          </div>
        </div>

        <div className="surface-card p-6">
          <header className="mb-5">
            <p className="eyebrow mb-1">Top services</p>
            <h2 className="font-serif text-xl">Les plus demandés</h2>
          </header>
          {data.top_services.length === 0 ? (
            <p className="text-fg/55 text-sm">Pas encore de données.</p>
          ) : (
            <ul className="space-y-3">
              {data.top_services.map((s) => (
                <li key={s.service_id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="truncate pr-2">{s.title}</span>
                    <span className="font-mono text-gold shrink-0">{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-ink/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold transition-all duration-700"
                      style={{ width: `${(s.count / maxTopService) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="surface-card p-6">
          <header className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl">Derniers devis</h2>
            <Link to="/admin/quotes" className="text-xs uppercase tracking-widest text-gold hover:underline">
              Tout voir →
            </Link>
          </header>

          {data.recent_quotes.length === 0 ? (
            <p className="text-fg/55 text-sm">Aucun devis pour le moment.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.recent_quotes.map((q) => (
                <li key={q.id} className="py-3">
                  <Link to={`/admin/quotes/${q.id}`} className="flex items-center justify-between gap-3 hover:text-gold transition-colors">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-gold/80">{q.reference}</p>
                      <p className="font-medium truncate">{q.client_name}</p>
                      <p className="text-xs text-fg/55 truncate">{q.service?.title || '—'}</p>
                    </div>
                    <span className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-line">
                      {STATUS_LABELS[q.status] || q.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface-card p-6">
          <header className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl">Activité récente</h2>
            <span className="text-xs text-fg/55">{data.recent_activity.length} événement{data.recent_activity.length > 1 ? 's' : ''}</span>
          </header>
          {data.recent_activity.length === 0 ? (
            <p className="text-fg/55 text-sm">Aucune activité enregistrée.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.recent_activity.slice(0, 8).map((a) => (
                <li key={a.id} className="py-2.5 flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="text-fg/85">{ACTION_LABELS[a.action] || a.action}</span>
                      {a.properties?.to && (
                        <span className="text-fg/55"> → {STATUS_LABELS[a.properties.to] || a.properties.to}</span>
                      )}
                    </p>
                    <p className="text-xs text-fg/45 mt-0.5">
                      {a.user?.name || 'Système'} · {new Date(a.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <KpiSecondary label="Devis envoyés" value={data.quotes.sent} />
        <KpiSecondary label="Devis acceptés" value={data.quotes.accepted} />
        <KpiSecondary label="Clients enregistrés" value={data.clients.total} />
      </section>
    </div>
  );
}

function KpiCard({ label, value, accent }) {
  return (
    <div className={`surface-card p-5 ${accent ? 'border-gold/40' : ''}`}>
      <p className="text-xs uppercase tracking-widest text-fg/55 mb-2">{label}</p>
      <p className={`font-serif text-4xl ${accent ? 'text-gold' : ''}`}>{value}</p>
    </div>
  );
}

function KpiSecondary({ label, value }) {
  return (
    <div className="border-l-2 border-gold/40 pl-4 py-2">
      <p className="text-xs uppercase tracking-widest text-fg/55">{label}</p>
      <p className="font-serif text-2xl">{value}</p>
    </div>
  );
}
