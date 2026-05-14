import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  fetchAdminServices,
  fetchAdminCategories,
  createAdminService,
  updateAdminService,
  deleteAdminService,
} from '@/api/admin';
import { formatPriceXOF } from '@/utils/format';

const EMPTY = {
  title: '',
  description: '',
  category_id: '',
  price_from: '',
  price_to: '',
  unit: 'forfait',
  icon: '',
  is_active: true,
  order: 0,
};

const UNITS = [
  { value: 'm2', label: 'au m²' },
  { value: 'forfait', label: 'forfait' },
  { value: 'jour', label: 'à la journée' },
  { value: 'piece', label: 'à la pièce' },
];

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null); // null = closed, 'new' = new, id = edit
  const [form, setForm] = useState(EMPTY);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => fetchAdminServices({ per_page: 50 }),
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchAdminCategories,
  });

  const services = data?.data || [];

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        price_from: form.price_from === '' ? null : Number(form.price_from),
        price_to: form.price_to === '' ? null : Number(form.price_to),
        order: Number(form.order),
      };
      return editing === 'new' ? createAdminService(payload) : updateAdminService(editing, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      setEditing(null);
      setForm(EMPTY);
    },
  });

  const remove = useMutation({
    mutationFn: (id) => deleteAdminService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-services'] }),
  });

  const startEdit = (s) => {
    setEditing(s.id);
    setForm({
      title: s.title || '',
      description: s.description || '',
      category_id: s.category?.id || s.category_id || '',
      price_from: s.price_from ?? '',
      price_to: s.price_to ?? '',
      unit: s.unit || 'forfait',
      icon: s.icon || '',
      is_active: !!s.is_active,
      order: s.order ?? 0,
    });
  };

  const startNew = () => {
    setEditing('new');
    setForm(EMPTY);
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const errors = saveMutation.error?.response?.data?.errors || {};

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Services</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light">Catalogue & tarifs</h1>
        </div>
        <button onClick={startNew} className="btn-gold !py-2.5 !px-5 text-xs">+ Nouveau service</button>
      </header>

      {editing && (
        <form
          onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
          className="surface-card p-6 space-y-4"
        >
          <header className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl">{editing === 'new' ? 'Nouveau service' : 'Éditer le service'}</h2>
            <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="text-xs uppercase tracking-widest text-fg/55 hover:text-rust">
              ✕ Fermer
            </button>
          </header>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Titre" required error={errors.title?.[0]}>
              <input value={form.title} onChange={set('title')} className="lartiska-input" required />
            </Field>
            <Field label="Catégorie" required error={errors.category_id?.[0]}>
              <select value={form.category_id} onChange={set('category_id')} className="lartiska-input" required>
                <option value="">— Sélectionner —</option>
                {(categories || []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea value={form.description} onChange={set('description')} rows={3} className="lartiska-input" />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Prix min (FCFA)">
              <input type="number" min="0" step="500" value={form.price_from} onChange={set('price_from')} className="lartiska-input" />
            </Field>
            <Field label="Prix max (FCFA)" error={errors.price_to?.[0]}>
              <input type="number" min="0" step="500" value={form.price_to} onChange={set('price_to')} className="lartiska-input" />
            </Field>
            <Field label="Unité">
              <select value={form.unit} onChange={set('unit')} className="lartiska-input">
                {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={set('is_active')} className="accent-gold w-4 h-4" />
            <span className="text-sm text-fg/85">Service actif (visible publiquement)</span>
          </label>

          <div className="flex justify-end gap-3 pt-2 border-t border-line">
            <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="btn-ghost !py-2 !px-4 text-xs">Annuler</button>
            <button type="submit" className="btn-gold !py-2 !px-4 text-xs" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-fg/55">Chargement…</p>
      ) : services.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="font-serif text-xl mb-3">Aucun service</p>
          <button onClick={startNew} className="btn-gold mt-2">Créer le premier</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {services.map((s) => (
            <article key={s.id} className={clsx(
              'surface-card p-5 flex flex-col gap-3',
              !s.is_active && 'opacity-60',
            )}>
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-gold/80">{s.category?.name}</p>
                  <h2 className="font-serif text-xl mt-1">{s.title}</h2>
                </div>
                {!s.is_active && (
                  <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border border-line text-fg/55">
                    Inactif
                  </span>
                )}
              </header>

              <p className="text-sm text-fg/70 line-clamp-2">{s.description}</p>

              <div className="flex items-center justify-between border-t border-line pt-3 mt-auto">
                <span className="font-serif text-base text-gold">
                  {s.price_from ? formatPriceXOF(s.price_from) : 'Sur devis'}
                  {s.price_to && s.price_from && ` – ${formatPriceXOF(s.price_to)}`}
                  <span className="text-xs text-fg/55 ml-2">{UNITS.find((u) => u.value === s.unit)?.label}</span>
                </span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(s)} className="text-xs uppercase tracking-widest text-gold hover:underline">Éditer</button>
                  <button
                    onClick={() => { if (confirm(`Supprimer le service "${s.title}" ?`)) remove.mutate(s.id); }}
                    className="text-xs text-fg/45 hover:text-rust"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-fg/60">{label}{required && <span className="text-rust ml-1">*</span>}</span>
      <div className="mt-2">{children}</div>
      {error && <p className="text-rust text-xs mt-1">{error}</p>}
    </label>
  );
}
