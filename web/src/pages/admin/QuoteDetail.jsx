import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminQuote, updateAdminQuote } from '@/api/admin';
import { formatPriceXOF } from '@/utils/format';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours d\'étude' },
  { value: 'sent', label: 'Devis envoyé' },
  { value: 'accepted', label: 'Accepté' },
  { value: 'rejected', label: 'Refusé' },
  { value: 'expired', label: 'Expiré' },
];

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

  if (isLoading) return <p className="text-fg/55">Chargement…</p>;
  if (!quote) return <p className="text-fg/55">Devis introuvable.</p>;

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <button onClick={() => navigate(-1)} className="text-xs uppercase tracking-widest text-fg/55 hover:text-gold mb-3">
            ← Retour
          </button>
          <p className="font-mono text-sm text-gold">{quote.reference}</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light mt-1">{quote.client_name}</h1>
          <p className="text-fg/65 text-sm mt-2">{quote.client_email} · {quote.client_phone}</p>
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
            <div className="surface-card p-6">
              <h2 className="font-serif text-xl mb-4">Lignes du devis</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-fg/55 border-b border-line">
                    <th className="text-left pb-2">Description</th>
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
                </tbody>
              </table>
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

          {quote.client_phone && (
            <a
              href={`https://wa.me/${quote.client_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${quote.client_name.split(' ')[0]}, à propos de votre demande ${quote.reference} chez Lartiska...`)}`}
              target="_blank"
              rel="noreferrer"
              className="block btn-ghost text-center w-full"
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
