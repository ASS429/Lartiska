import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  fetchAdminTestimonials,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
  fetchAdminProjects,
} from '@/api/admin';

const EMPTY = {
  client_name: '',
  client_role: '',
  city: '',
  project_id: '',
  content: '',
  rating: 5,
  is_published: true,
  order: 0,
};

export default function AdminTestimonials() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => fetchAdminTestimonials({ per_page: 50 }),
  });

  const { data: projectsData } = useQuery({
    queryKey: ['admin-projects-light'],
    queryFn: () => fetchAdminProjects({ per_page: 100 }),
  });

  const testimonials = data?.data || [];
  const projects = projectsData?.data || [];

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        project_id: form.project_id ? Number(form.project_id) : null,
        rating: form.rating ? Number(form.rating) : null,
        order: Number(form.order),
      };
      return editing === 'new'
        ? createAdminTestimonial(payload)
        : updateAdminTestimonial(editing, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      setEditing(null);
      setForm(EMPTY);
    },
  });

  const remove = useMutation({
    mutationFn: (id) => deleteAdminTestimonial(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  });

  const startEdit = (t) => {
    setEditing(t.id);
    setForm({
      client_name: t.client_name || '',
      client_role: t.client_role || '',
      city: t.city || '',
      project_id: t.project?.id || '',
      content: t.content || '',
      rating: t.rating ?? 5,
      is_published: !!t.is_published,
      order: t.order ?? 0,
    });
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const errors = saveMutation.error?.response?.data?.errors || {};

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Avis clients</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light">Témoignages</h1>
        </div>
        <button onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-gold !py-2.5 !px-5 text-xs">
          + Nouvel avis
        </button>
      </header>

      {editing && (
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="surface-card p-6 space-y-4">
          <header className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl">{editing === 'new' ? 'Nouvel avis' : 'Éditer l\'avis'}</h2>
            <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="text-xs uppercase tracking-widest text-fg/55 hover:text-rust">
              ✕ Fermer
            </button>
          </header>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nom du client" required error={errors.client_name?.[0]}>
              <input value={form.client_name} onChange={set('client_name')} className="lartiska-input" required />
            </Field>
            <Field label="Rôle / fonction">
              <input value={form.client_role} onChange={set('client_role')} className="lartiska-input" placeholder="Maître d'ouvrage, hôtelier…" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Ville">
              <input value={form.city} onChange={set('city')} className="lartiska-input" />
            </Field>
            <Field label="Projet associé (optionnel)">
              <select value={form.project_id} onChange={set('project_id')} className="lartiska-input">
                <option value="">— Aucun —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Témoignage" required error={errors.content?.[0]}>
            <textarea value={form.content} onChange={set('content')} rows={5} className="lartiska-input" required maxLength={2000} />
            <p className="text-xs text-fg/45 mt-1">{form.content.length} / 2000</p>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Note (1-5)">
              <select value={form.rating || ''} onChange={set('rating')} className="lartiska-input">
                <option value="">—</option>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
              </select>
            </Field>
            <Field label="Ordre d'affichage">
              <input type="number" min="0" value={form.order} onChange={set('order')} className="lartiska-input" />
            </Field>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={set('is_published')} className="accent-gold w-4 h-4" />
            <span className="text-sm text-fg/85">Publié (visible sur le site)</span>
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
      ) : testimonials.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <p className="font-serif text-xl mb-3">Aucun avis</p>
          <button onClick={() => { setEditing('new'); setForm(EMPTY); }} className="btn-gold mt-2">Ajouter le premier</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <article key={t.id} className={clsx('surface-card p-5 flex flex-col gap-3', !t.is_published && 'opacity-60')}>
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-serif text-lg">{t.client_name}</p>
                  <p className="text-xs text-fg/55">
                    {[t.client_role, t.city].filter(Boolean).join(' · ') || '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {t.rating && <span className="text-gold text-sm">{'★'.repeat(t.rating)}</span>}
                  {!t.is_published && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border border-line">Caché</span>
                  )}
                </div>
              </header>

              <blockquote className="text-sm text-fg/80 leading-relaxed italic line-clamp-4 border-l-2 border-gold/40 pl-3">
                « {t.content} »
              </blockquote>

              {t.project && (
                <p className="text-xs text-fg/55">Projet : {t.project.title}</p>
              )}

              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-line">
                <button onClick={() => startEdit(t)} className="text-xs uppercase tracking-widest text-gold hover:underline">Éditer</button>
                <button
                  onClick={() => { if (confirm(`Supprimer l'avis de ${t.client_name} ?`)) remove.mutate(t.id); }}
                  className="ml-auto text-xs text-fg/45 hover:text-rust"
                >
                  ✕ Supprimer
                </button>
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
