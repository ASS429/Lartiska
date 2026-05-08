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

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchAdminDashboard,
  });

  if (isLoading) return <p className="text-fg/55">Chargement…</p>;
  if (!data) return null;

  return (
    <div className="space-y-10">
      <header>
        <p className="eyebrow mb-2">Dashboard</p>
        <h1 className="font-serif text-3xl md:text-4xl font-light">Vue d'ensemble</h1>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Devis ce mois" value={data.quotes.this_month} accent />
        <KpiCard label="En attente" value={data.quotes.pending} />
        <KpiCard label="Messages non lus" value={data.messages.unread} />
        <KpiCard label="Projets publiés" value={data.projects.published} />
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
            <h2 className="font-serif text-xl">Derniers messages</h2>
            <Link to="/admin/messages" className="text-xs uppercase tracking-widest text-gold hover:underline">
              Boîte de réception →
            </Link>
          </header>

          {data.recent_messages.length === 0 ? (
            <p className="text-fg/55 text-sm">Aucun message reçu.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.recent_messages.map((m) => (
                <li key={m.id} className="py-3">
                  <Link to={`/admin/messages?id=${m.id}`} className="flex items-center justify-between gap-3 hover:text-gold transition-colors">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{m.name} {!m.is_read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-gold align-middle" />}</p>
                      <p className="text-xs text-fg/55 truncate">{m.subject || '—'}</p>
                    </div>
                    <span className="shrink-0 text-xs uppercase tracking-widest text-fg/55">{m.source}</span>
                  </Link>
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
