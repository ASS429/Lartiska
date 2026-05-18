import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import { fetchMyQuotes } from '@/api/account';
import { useAuthStore } from '@/store/auth';
import { formatPriceXOF } from '@/utils/format';

const STATUS_LABELS = {
  pending: { label: 'En attente', color: 'bg-sand/15 text-sand border-sand/30' },
  processing: { label: 'En cours d\'étude', color: 'bg-gold/15 text-gold border-gold/30' },
  sent: { label: 'Devis envoyé', color: 'bg-cream/10 text-cream border-cream/25' },
  accepted: { label: 'Accepté', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30' },
  rejected: { label: 'Refusé', color: 'bg-rust/15 text-rust border-rust/30' },
  expired: { label: 'Expiré', color: 'bg-fg/10 text-fg/55 border-line' },
};

export default function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [page, setPage] = useState(1);
  const [claimMessage, setClaimMessage] = useState(() => sessionStorage.getItem('lartiska_claim_message'));

  useEffect(() => {
    if (claimMessage) {
      sessionStorage.removeItem('lartiska_claim_message');
      const t = setTimeout(() => setClaimMessage(null), 6000);
      return () => clearTimeout(t);
    }
  }, [claimMessage]);

  const { data, isLoading } = useQuery({
    queryKey: ['account-quotes', page],
    queryFn: () => fetchMyQuotes({ page }),
  });

  const quotes = data?.data || [];
  const meta = data?.meta;

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="container-art py-16 md:py-20 max-w-5xl">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <p className="eyebrow mb-2">— Mon espace</p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light">Bonjour {user?.name?.split(' ')[0]}</h1>
          <p className="text-fg/65 text-sm mt-2 break-all">{user?.email}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link to="/devis" className="btn-gold !py-2.5 !px-5 text-xs">Nouvelle demande</Link>
          <button onClick={handleLogout} className="btn-ghost !py-2.5 !px-5 text-xs">Déconnexion</button>
        </div>
      </header>

      {claimMessage && (
        <div className="surface-card border-gold/40 bg-gold/5 p-4 mb-6 flex items-center gap-3">
          <span className="text-gold text-xl">✦</span>
          <p className="text-sm">{claimMessage}</p>
          <button onClick={() => setClaimMessage(null)} className="ml-auto text-fg/45 hover:text-fg text-sm">✕</button>
        </div>
      )}

      <section>
        <h2 className="font-serif text-2xl mb-5">Mes demandes de devis</h2>

        {isLoading ? (
          <p className="text-fg/55">Chargement…</p>
        ) : quotes.length === 0 ? (
          <div className="surface-card p-10 text-center">
            <p className="font-serif text-xl mb-3">Aucune demande pour l'instant</p>
            <p className="text-fg/65 text-sm mb-6">Lancez votre premier projet en quelques étapes.</p>
            <Link to="/devis" className="btn-gold">Demander un devis</Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {quotes.map((q) => {
              const status = STATUS_LABELS[q.status] || { label: q.status, color: 'border-line text-fg/55' };
              return (
                <li key={q.id}>
                  <Link
                    to={`/account/quotes/${q.id}`}
                    className="surface-card p-5 flex flex-wrap items-center gap-4 justify-between hover:border-gold/40 transition-colors block"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-gold">{q.reference}</p>
                      <p className="font-serif text-lg mt-1">{q.service?.title || 'Demande générale'}</p>
                      <p className="text-xs text-fg/55 mt-1">
                        Créé le {new Date(q.created_at).toLocaleDateString('fr-FR')}
                        {q.surface_m2 && <> · {q.surface_m2} m²</>}
                        {q.total_amount && <> · {formatPriceXOF(q.total_amount)}</>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={clsx('text-xs px-3 py-1.5 rounded-full border', status.color)}>
                        {status.label}
                      </span>
                      {q.has_pdf && <span className="text-xs text-gold">PDF</span>}
                      <span className="text-fg/40">→</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between gap-4 mt-6">
            <p className="text-xs text-fg/55">Page {meta.current_page} sur {meta.last_page}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.current_page === 1} className="btn-ghost !py-2 !px-4 text-xs disabled:opacity-40">← Précédent</button>
              <button onClick={() => setPage((p) => p + 1)} disabled={meta.current_page === meta.last_page} className="btn-ghost !py-2 !px-4 text-xs disabled:opacity-40">Suivant →</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
