import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { fetchAdminProjects, fetchAdminCategories, deleteAdminProject, updateAdminProject } from '@/api/admin';

export default function AdminProjects() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects', { status, search, page }],
    queryFn: () => fetchAdminProjects({ status, search, page }),
    keepPreviousData: true,
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchAdminCategories,
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, status }) => updateAdminProject(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }) => updateAdminProject(id, { featured }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  const remove = useMutation({
    mutationFn: (id) => deleteAdminProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  const projects = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Portfolio</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light">Réalisations</h1>
          <p className="text-fg/55 text-sm mt-2">{meta?.total ?? '…'} projets · {categories?.length ?? '…'} catégories</p>
        </div>
        <Link to="/admin/projects/new" className="btn-gold !py-2.5 !px-5 text-xs">
          + Nouvelle réalisation
        </Link>
      </header>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex flex-wrap gap-2">
          <FilterPill active={status === ''} onClick={() => { setStatus(''); setPage(1); }}>Tous</FilterPill>
          <FilterPill active={status === 'published'} onClick={() => { setStatus('published'); setPage(1); }}>Publiés</FilterPill>
          <FilterPill active={status === 'draft'} onClick={() => { setStatus('draft'); setPage(1); }}>Brouillons</FilterPill>
        </div>
        <input
          type="search"
          placeholder="Rechercher (titre, ville, client…)"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="lartiska-input max-w-xs ml-auto"
        />
      </div>

      {isLoading ? (
        <p className="text-fg/55">Chargement…</p>
      ) : projects.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <p className="font-serif text-2xl mb-3">Aucune réalisation</p>
          <Link to="/admin/projects/new" className="btn-gold mt-4">Créer la première</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <article key={p.id} className="surface-card overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3] bg-ink overflow-hidden">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-fg/40">Pas d'image</div>
                )}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <span className={clsx(
                    'text-[10px] uppercase tracking-widest px-2 py-1 rounded-full backdrop-blur-md border',
                    p.status === 'published' ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300' : 'border-line bg-ink/60 text-fg/70',
                  )}>
                    {p.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                  {p.featured && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full backdrop-blur-md border border-gold/40 bg-gold/15 text-gold">
                      ★ Vedette
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs uppercase tracking-widest text-gold/80">{p.category?.name}</p>
                <h2 className="font-serif text-lg mt-1 leading-snug">{p.title}</h2>
                <p className="text-xs text-fg/55 mt-1">
                  {p.city || '—'} · {p.images_count ?? 0} {(p.images_count === 1) ? 'image' : 'images'}
                </p>

                <div className="mt-4 pt-4 border-t border-line flex flex-wrap items-center gap-2">
                  <Link to={`/admin/projects/${p.id}`} className="text-xs uppercase tracking-widest text-gold hover:underline">
                    Éditer →
                  </Link>
                  <button
                    type="button"
                    onClick={() => togglePublish.mutate({ id: p.id, status: p.status === 'published' ? 'draft' : 'published' })}
                    className="ml-auto text-xs px-2.5 py-1 rounded-full border border-line text-fg/65 hover:text-gold hover:border-gold transition-all"
                  >
                    {p.status === 'published' ? 'Dépublier' : 'Publier'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFeatured.mutate({ id: p.id, featured: !p.featured })}
                    className={clsx(
                      'text-xs px-2.5 py-1 rounded-full border transition-all',
                      p.featured ? 'border-gold bg-gold/10 text-gold' : 'border-line text-fg/65 hover:text-gold hover:border-gold',
                    )}
                  >
                    ★
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Supprimer définitivement « ${p.title} » ?`)) remove.mutate(p.id);
                    }}
                    className="text-xs px-2.5 py-1 rounded-full border border-line text-fg/55 hover:text-rust hover:border-rust transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between gap-4 mt-2">
          <p className="text-xs text-fg/55">Page {meta.current_page} / {meta.last_page}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={meta.current_page === 1} className="btn-ghost !py-2 !px-4 text-xs disabled:opacity-40">← Précédent</button>
            <button onClick={() => setPage((p) => p + 1)} disabled={meta.current_page === meta.last_page} className="btn-ghost !py-2 !px-4 text-xs disabled:opacity-40">Suivant →</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-all',
        active ? 'border-gold bg-gold/10 text-gold' : 'border-line text-fg/65 hover:text-gold',
      )}
    >
      {children}
    </button>
  );
}
