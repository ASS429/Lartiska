import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { fetchMyQuote, respondToQuote } from '@/api/account';
import { apiClient } from '@/api/client';
import { formatPriceXOF } from '@/utils/format';

const STATUS_LABELS = {
  pending: { label: 'En attente d\'étude', color: 'bg-sand/15 text-sand border-sand/30' },
  processing: { label: 'En cours d\'étude', color: 'bg-gold/15 text-gold border-gold/30' },
  sent: { label: 'Devis prêt à valider', color: 'bg-cream/10 text-cream border-cream/25' },
  accepted: { label: 'Accepté', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' },
  rejected: { label: 'Refusé', color: 'bg-rust/15 text-rust border-rust/30' },
  expired: { label: 'Expiré', color: 'bg-fg/10 text-fg/55 border-line' },
};

export default function AccountQuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [comment, setComment] = useState('');

  const { data: quote, isLoading } = useQuery({
    queryKey: ['my-quote', id],
    queryFn: () => fetchMyQuote(id),
  });

  const respondMutation = useMutation({
    mutationFn: (payload) => respondToQuote(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-quote', id] });
      queryClient.invalidateQueries({ queryKey: ['account-quotes'] });
      setShowChangeRequest(false);
      setComment('');
    },
  });

  const downloadPdf = async () => {
    const response = await apiClient.get(`/quotes/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quote.reference}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="container-art py-20 text-fg/55">Chargement…</div>;
  if (!quote) return <div className="container-art py-20 text-fg/55">Devis introuvable.</div>;

  const status = STATUS_LABELS[quote.status] || { label: quote.status, color: 'border-line text-fg/55' };
  const canRespond = quote.status === 'sent';

  return (
    <div className="container-art py-12 md:py-16 max-w-4xl">
      <button
        type="button"
        onClick={() => navigate('/account')}
        className="text-xs uppercase tracking-widest text-fg/55 hover:text-gold mb-6"
      >
        ← Mes demandes
      </button>

      <header className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-sm text-gold">{quote.reference}</p>
          <h1 className="font-serif text-3xl md:text-5xl font-light mt-2 leading-tight">
            {quote.service?.title || 'Demande de devis'}
          </h1>
          <p className="text-fg/55 text-sm mt-2">
            Créé le {new Date(quote.created_at).toLocaleDateString('fr-FR')}
            {quote.sent_at && <> · envoyé le {new Date(quote.sent_at).toLocaleDateString('fr-FR')}</>}
          </p>
        </div>
        <span className={clsx('text-xs px-3 py-1.5 rounded-full border', status.color)}>
          {status.label}
        </span>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <section className="space-y-5">
          <article className="surface-card p-6 space-y-4">
            <h2 className="font-serif text-xl">Votre demande</h2>
            <Row label="Description" value={quote.description || '—'} />
            <Row label="Surface estimée" value={quote.surface_m2 ? `${quote.surface_m2} m²` : '—'} />
            <Row label="Budget annoncé" value={formatPriceXOF(quote.estimated_budget)} />
            <Row label="Ville" value={quote.client_city || '—'} />
            <Row label="Adresse chantier" value={quote.site_address || '—'} last />
          </article>

          {quote.items?.length > 0 && (
            <article className="surface-card p-6">
              <h2 className="font-serif text-xl mb-4">Détail tarifaire</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-fg/55 border-b border-line">
                    <th className="text-left pb-2">Prestation</th>
                    <th className="text-right pb-2">Qté</th>
                    <th className="text-right pb-2">PU</th>
                    <th className="text-right pb-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {quote.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3">{item.description}</td>
                      <td className="py-3 text-right">{item.quantity} {item.unit}</td>
                      <td className="py-3 text-right">{formatPriceXOF(item.unit_price)}</td>
                      <td className="py-3 text-right font-medium">{formatPriceXOF(item.total)}</td>
                    </tr>
                  ))}
                  {quote.total_amount && (
                    <tr className="font-serif text-lg text-gold">
                      <td colSpan="3" className="pt-4 text-right">Total estimé</td>
                      <td className="pt-4 text-right">{formatPriceXOF(quote.total_amount)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </article>
          )}
        </section>

        <aside className="space-y-4">
          {quote.has_pdf && (
            <div className="surface-card p-6 text-center">
              <p className="eyebrow mb-3">PDF officiel</p>
              <p className="text-sm text-fg/70 mb-4">
                Votre devis détaillé est prêt à être téléchargé.
              </p>
              <button onClick={downloadPdf} className="btn-gold w-full !py-2.5 text-xs">
                ⤓ Télécharger le PDF
              </button>
            </div>
          )}

          {canRespond && (
            <div className="surface-card p-6 space-y-3">
              <p className="eyebrow mb-2">Votre décision</p>
              <p className="text-sm text-fg/70">
                Acceptez le devis pour démarrer le chantier, ou demandez une modification si besoin.
              </p>

              {respondMutation.isError && (
                <p className="text-rust text-sm">
                  {respondMutation.error?.response?.data?.message || 'Erreur.'}
                </p>
              )}

              {!showChangeRequest ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Confirmer l'acceptation du devis ${quote.reference} ?`)) {
                        respondMutation.mutate({ action: 'accept' });
                      }
                    }}
                    disabled={respondMutation.isPending}
                    className="btn-gold w-full !py-2.5 text-xs"
                  >
                    ✓ Accepter le devis
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangeRequest(true)}
                    disabled={respondMutation.isPending}
                    className="btn-ghost w-full !py-2.5 text-xs"
                  >
                    ↺ Demander une modification
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Confirmer le refus de ce devis ? Cette action est définitive.')) {
                        respondMutation.mutate({ action: 'reject' });
                      }
                    }}
                    disabled={respondMutation.isPending}
                    className="text-xs uppercase tracking-widest text-fg/55 hover:text-rust transition-colors w-full pt-2"
                  >
                    Refuser
                  </button>
                </>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    respondMutation.mutate({ action: 'request_changes', comment });
                  }}
                  className="space-y-3"
                >
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="lartiska-input"
                    placeholder="Décrivez ce que vous souhaitez ajuster (montant, périmètre, planning…)"
                    required
                    minLength={5}
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowChangeRequest(false)} className="btn-ghost flex-1 !py-2 text-xs">
                      Annuler
                    </button>
                    <button type="submit" className="btn-gold flex-1 !py-2 text-xs" disabled={respondMutation.isPending}>
                      Envoyer
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {quote.status === 'accepted' && (
            <div className="surface-card p-6 border-emerald-400/30">
              <p className="font-serif text-lg text-emerald-300">✓ Devis accepté</p>
              <p className="text-sm text-fg/70 mt-2">
                Tounkara va vous contacter pour planifier le démarrage du chantier.
              </p>
            </div>
          )}

          {quote.status === 'rejected' && (
            <div className="surface-card p-6 border-rust/30">
              <p className="font-serif text-lg text-rust">Devis refusé</p>
              <p className="text-sm text-fg/70 mt-2">
                Vous pouvez relancer une nouvelle demande à tout moment.
              </p>
              <Link to="/devis" className="btn-ghost w-full mt-4 !py-2 text-xs">
                Nouvelle demande →
              </Link>
            </div>
          )}

          <a
            href="https://wa.me/221773468681"
            target="_blank"
            rel="noreferrer"
            className="block text-center text-xs uppercase tracking-widest text-fg/55 hover:text-gold pt-3"
          >
            Discuter sur WhatsApp →
          </a>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 ${last ? '' : 'border-b border-line pb-3'}`}>
      <span className="text-xs uppercase tracking-widest text-gold/80 sm:w-32 shrink-0">{label}</span>
      <span className="text-fg/85 break-words">{value}</span>
    </div>
  );
}
