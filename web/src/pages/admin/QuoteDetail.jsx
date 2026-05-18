import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminQuote, updateAdminQuote, generateQuotePdf, sendQuoteToClient } from '@/api/admin';
import { apiClient } from '@/api/client';
import { formatPriceXOF } from '@/utils/format';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours d\'étude' },
  { value: 'sent', label: 'Devis envoyé' },
  { value: 'accepted', label: 'Accepté' },
  { value: 'rejected', label: 'Refusé' },
  { value: 'expired', label: 'Expiré' },
];

/**
 * Template WhatsApp pré-rempli envoyé au client depuis l'admin.
 * Adapté au statut courant du devis pour que Tounkara ait juste
 * à appuyer Envoyer.
 */
function buildClientWhatsAppText(quote) {
  const firstname = (quote?.client_name || '').split(' ')[0] || 'cher client';
  const ref = quote?.reference || '';
  const total = quote?.total_amount
    ? new Intl.NumberFormat('fr-FR').format(quote.total_amount) + ' FCFA'
    : null;

  // Le lien envoyé au client redirige vers /login avec contexte pré-rempli :
  // - email : reconnu par le backend pour login direct, ou pour rattacher
  //   automatiquement le devis si le client crée un compte
  // - ref : affiché en banner ("Pour voir votre devis LRTSK-2026-0002")
  // - redirect : où aller après login/register/reset → page du devis
  const accountPath = `/account/quotes/${quote?.id || ''}`;
  const loginParams = new URLSearchParams({
    ...(quote?.client_email && { email: quote.client_email }),
    ...(ref && { ref }),
    redirect: accountPath,
  });
  const accountLink = `${window.location.origin}/login?${loginParams.toString()}`;

  switch (quote?.status) {
    case 'pending':
    case 'processing':
      return [
        `Bonjour ${firstname},`,
        '',
        `J'ai bien reçu votre demande de devis Lartiska (référence ${ref}).`,
        'Je l\'étudie et je reviens vers vous sous 48h ouvrées avec un devis détaillé.',
        '',
        'À bientôt,',
        'Tounkara — Lartiska',
      ].join('\n');

    case 'sent':
      return [
        `Bonjour ${firstname},`,
        '',
        '🎨 Votre devis Lartiska est prêt.',
        `✦ Référence : ${ref}`,
        ...(total ? [`✦ Montant : ${total}`] : []),
        '',
        'Le PDF officiel vous a été envoyé par email.',
        `Vous pouvez aussi le consulter et le valider en ligne : ${accountLink}`,
        '',
        'N\'hésitez pas si vous avez des questions ou souhaitez des ajustements.',
        '',
        'Tounkara — Lartiska',
      ].join('\n');

    case 'accepted':
      return [
        `Bonjour ${firstname},`,
        '',
        `✨ Merci pour la validation du devis ${ref}.`,
        'Je planifie maintenant le démarrage du chantier.',
        '',
        'Je reviens vers vous sous 48h pour :',
        '— caler une date de démarrage',
        '— organiser l\'acompte (40 %)',
        '— préciser les matériaux & finitions',
        '',
        'À très vite,',
        'Tounkara — Lartiska',
      ].join('\n');

    case 'rejected':
      return [
        `Bonjour ${firstname},`,
        '',
        `Bien noté pour votre retour sur le devis ${ref}.`,
        'Je reste à votre disposition si vos besoins évoluent, ou pour échanger sur d\'autres projets.',
        '',
        'À bientôt,',
        'Tounkara — Lartiska',
      ].join('\n');

    case 'expired':
      return [
        `Bonjour ${firstname},`,
        '',
        `Le devis ${ref} a dépassé sa date de validité.`,
        'Je peux le réactualiser facilement si le projet vous intéresse toujours.',
        '',
        'Dites-moi,',
        'Tounkara — Lartiska',
      ].join('\n');

    default:
      return `Bonjour ${firstname}, à propos de votre demande ${ref} chez Lartiska…`;
  }
}

export default function AdminQuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: quote, isLoading } = useQuery({
    queryKey: ['admin-quote', id],
    queryFn: () => fetchAdminQuote(id),
  });

  const [form, setForm] = useState({ status: '', admin_notes: '', total_amount: '' });

  useEffect(() => {
    if (quote) {
      setForm({
        status: quote.status || 'pending',
        admin_notes: quote.admin_notes || '',
        total_amount: quote.total_amount || '',
      });
    }
  }, [quote]);

  const mutation = useMutation({
    mutationFn: () => updateAdminQuote(id, {
      status: form.status,
      admin_notes: form.admin_notes || null,
      total_amount: form.total_amount === '' ? null : Number(form.total_amount),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quote', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  const generatePdfMutation = useMutation({
    mutationFn: () => generateQuotePdf(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quote', id] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: () => sendQuoteToClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quote', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  /**
   * Télécharge le PDF en gardant l'auth Bearer (l'URL retournée par l'API est
   * une route protégée, donc on ne peut pas la mettre en href direct).
   */
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

  if (isLoading) return <p className="text-fg/55">Chargement…</p>;
  if (!quote) return <p className="text-fg/55">Devis introuvable.</p>;

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <button onClick={() => navigate(-1)} className="text-xs uppercase tracking-widest text-fg/55 hover:text-gold mb-3">
            ← Retour
          </button>
          <p className="font-mono text-sm text-gold">{quote.reference}</p>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light mt-1 break-words">{quote.client_name}</h1>
          <p className="text-fg/65 text-sm mt-2 break-all">
            <span className="break-all">{quote.client_email}</span>
            {' · '}
            <span className="whitespace-nowrap">{quote.client_phone}</span>
          </p>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card p-6">
            <h2 className="font-serif text-xl mb-4">Demande</h2>
            <DetailRow label="Service" value={quote.service?.title || '—'} />
            <DetailRow label="Description" value={quote.description || '—'} />
            <DetailRow label="Surface" value={quote.surface_m2 ? `${quote.surface_m2} m²` : '—'} />
            <DetailRow label="Budget estimé" value={formatPriceXOF(quote.estimated_budget)} />
            <DetailRow label="Ville" value={quote.client_city || '—'} />
            <DetailRow label="Adresse chantier" value={quote.site_address || '—'} />
            <DetailRow label="Reçu le" value={quote.created_at ? new Date(quote.created_at).toLocaleString('fr-FR') : '—'} last />
          </div>

          {quote.items?.length > 0 && (
            <div className="surface-card p-4 md:p-6">
              <h2 className="font-serif text-xl mb-4">Lignes du devis</h2>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="text-xs uppercase tracking-widest text-fg/55 border-b border-line">
                      <th className="text-left pb-2 px-4 md:px-0">Description</th>
                      <th className="text-right pb-2 px-2 whitespace-nowrap">Qté</th>
                      <th className="text-right pb-2 px-2 whitespace-nowrap">PU</th>
                      <th className="text-right pb-2 px-4 md:px-0 whitespace-nowrap">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {quote.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 px-4 md:px-0">{item.description}</td>
                        <td className="py-3 text-right px-2 whitespace-nowrap">{item.quantity} {item.unit}</td>
                        <td className="py-3 text-right px-2 whitespace-nowrap">{formatPriceXOF(item.unit_price)}</td>
                        <td className="py-3 text-right font-medium px-4 md:px-0 whitespace-nowrap">{formatPriceXOF(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <form
            onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
            className="surface-card p-6 space-y-4"
          >
            <h2 className="font-serif text-xl">Action admin</h2>

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-fg/60">Statut</span>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="lartiska-input mt-2"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-fg/60">Montant total (FCFA)</span>
              <input
                type="number"
                min="0"
                step="100"
                value={form.total_amount}
                onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
                className="lartiska-input mt-2"
                placeholder="Optionnel"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-fg/60">Notes internes</span>
              <textarea
                rows={4}
                value={form.admin_notes}
                onChange={(e) => setForm((f) => ({ ...f, admin_notes: e.target.value }))}
                className="lartiska-input mt-2"
                placeholder="Notes visibles uniquement côté admin"
              />
            </label>

            {mutation.isError && (
              <p className="text-rust text-sm">Erreur lors de la mise à jour.</p>
            )}
            {mutation.isSuccess && (
              <p className="text-gold text-sm">Mise à jour enregistrée.</p>
            )}

            <button type="submit" className="btn-gold w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </form>

          {/* Bloc actions PDF + envoi client */}
          <div className="surface-card p-6 space-y-3">
            <h2 className="font-serif text-xl mb-1">Document & envoi</h2>

            {quote.has_pdf ? (
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gold/30 bg-gold/5">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-gold">PDF prêt</p>
                  <p className="text-sm truncate">{quote.reference}.pdf</p>
                </div>
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="text-xs uppercase tracking-widest text-gold hover:underline"
                >
                  Télécharger →
                </button>
              </div>
            ) : (
              <p className="text-xs text-fg/55">Aucun PDF généré pour ce devis.</p>
            )}

            <button
              type="button"
              onClick={() => generatePdfMutation.mutate()}
              disabled={generatePdfMutation.isPending}
              className="btn-ghost w-full !py-2.5 text-xs disabled:opacity-50"
            >
              {generatePdfMutation.isPending
                ? 'Génération…'
                : quote.has_pdf ? 'Régénérer le PDF' : 'Générer le PDF'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm(`Envoyer le devis ${quote.reference} à ${quote.client_email} ?`)) {
                  sendMutation.mutate();
                }
              }}
              disabled={sendMutation.isPending}
              className="btn-gold w-full !py-2.5 text-xs disabled:opacity-50"
            >
              {sendMutation.isPending ? 'Envoi…' : '✉ Envoyer au client'}
            </button>

            {sendMutation.isSuccess && (
              <p className="text-emerald-300 text-xs text-center">✓ Email envoyé · statut → "envoyé"</p>
            )}
            {sendMutation.isError && (
              <p className="text-rust text-xs">
                {sendMutation.error?.response?.data?.message || 'Erreur d\'envoi du mail.'}
              </p>
            )}

            {quote.sent_at && (
              <p className="text-xs text-fg/55 text-center border-t border-line pt-3">
                Envoyé le {new Date(quote.sent_at).toLocaleString('fr-FR')}
              </p>
            )}

            {quote.attachments_count > 0 && (
              <p className="text-xs text-fg/65 border-t border-line pt-3">
                📎 {quote.attachments_count} pièce{quote.attachments_count > 1 ? 's' : ''} jointe{quote.attachments_count > 1 ? 's' : ''} par le client
              </p>
            )}
          </div>

          {quote.client_phone && (
            <a
              href={`https://wa.me/${quote.client_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(buildClientWhatsAppText(quote))}`}
              target="_blank"
              rel="noreferrer"
              className="block btn-ghost text-center w-full"
              title={`Message contextuel selon le statut "${quote.status}"`}
            >
              Contacter sur WhatsApp
            </a>
          )}
        </aside>
      </section>
    </div>
  );
}

function DetailRow({ label, value, last }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 ${last ? '' : 'border-b border-line'} pb-3 ${last ? '' : 'mb-3'}`}>
      <span className="text-xs uppercase tracking-widest text-gold/80 sm:w-36 shrink-0">{label}</span>
      <span className="text-fg/85 break-words">{value}</span>
    </div>
  );
}
