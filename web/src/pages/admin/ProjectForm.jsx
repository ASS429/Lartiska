import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminProject,
  fetchAdminCategories,
  createAdminProject,
  updateAdminProject,
  uploadProjectImages,
  setProjectCover,
  deleteProjectImage,
  setImageBeforeAfter,
} from '@/api/admin';

const EMPTY = {
  title: '',
  description: '',
  category_id: '',
  city: '',
  client_name: '',
  materials: '',
  duration: '',
  completed_at: '',
  status: 'draft',
  featured: false,
  order: 0,
};

export default function AdminProjectForm() {
  const { id } = useParams();
  const isNew = id === 'new' || !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileRef = useRef(null);

  const [form, setForm] = useState(EMPTY);
  const [uploadError, setUploadError] = useState(null);

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchAdminCategories,
  });

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ['admin-project', id],
    queryFn: () => fetchAdminProject(id),
    enabled: !isNew,
  });

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || '',
        description: project.description || '',
        category_id: project.category?.id || project.category_id || '',
        city: project.city || '',
        client_name: project.client_name || '',
        materials: project.materials || '',
        duration: project.duration || '',
        completed_at: project.completed_at || '',
        status: project.status || 'draft',
        featured: !!project.featured,
        order: project.order ?? 0,
      });
    }
  }, [project]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        order: Number(form.order),
        completed_at: form.completed_at || null,
      };
      return isNew ? createAdminProject(payload) : updateAdminProject(id, payload);
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-project'] });
      if (isNew && data?.id) {
        navigate(`/admin/projects/${data.id}`, { replace: true });
      }
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (files) => uploadProjectImages(id, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-project', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setUploadError(null);
      if (fileRef.current) fileRef.current.value = '';
    },
    onError: (e) => {
      setUploadError(e?.response?.data?.message || 'Erreur lors de l\'upload.');
    },
  });

  const setCoverMutation = useMutation({
    mutationFn: (imageId) => setProjectCover(id, imageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-project', id] }),
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId) => deleteProjectImage(id, imageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-project', id] }),
  });

  const beforeAfterMutation = useMutation({
    mutationFn: ({ imageId, value }) => setImageBeforeAfter(id, imageId, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-project', id] }),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Pré-contrôle client : 12 Mo image / 100 Mo vidéo (le serveur revérifie).
    const tooBig = files.find((f) => {
      const isVideo = f.type.startsWith('video/');
      return f.size > (isVideo ? 100 : 12) * 1024 * 1024;
    });
    if (tooBig) {
      alert(`${tooBig.name} est trop lourd (max ${tooBig.type.startsWith('video/') ? '100 Mo pour une vidéo' : '12 Mo pour une image'}).`);
      e.target.value = '';
      return;
    }

    uploadMutation.mutate(files);
  };

  const errors = saveMutation.error?.response?.data?.errors || {};

  if (loadingProject && !isNew) return <p className="text-fg/55">Chargement…</p>;

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <Link to="/admin/projects" className="text-xs uppercase tracking-widest text-fg/55 hover:text-gold">
          ← Retour au portfolio
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-light mt-3">
          {isNew ? 'Nouvelle réalisation' : project?.title || 'Édition'}
        </h1>
      </header>

      <div className="grid lg:grid-cols-[3fr_2fr] gap-6">
        <form onSubmit={onSubmit} className="surface-card p-6 space-y-5">
          <Field label="Titre" required error={errors.title?.[0]}>
            <input value={form.title} onChange={set('title')} className="lartiska-input" required />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Catégorie" required error={errors.category_id?.[0]}>
              <select value={form.category_id} onChange={set('category_id')} className="lartiska-input" required>
                <option value="">— Sélectionner —</option>
                {(categories || []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Statut">
              <select value={form.status} onChange={set('status')} className="lartiska-input">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea value={form.description} onChange={set('description')} rows={5} className="lartiska-input" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Ville">
              <input value={form.city} onChange={set('city')} className="lartiska-input" placeholder="Dakar" />
            </Field>
            <Field label="Nom du client (optionnel)">
              <input value={form.client_name} onChange={set('client_name')} className="lartiska-input" placeholder="Mme Diop" />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="Matériaux">
              <input value={form.materials} onChange={set('materials')} className="lartiska-input" placeholder="Acrylique, or 22ct" />
            </Field>
            <Field label="Durée">
              <input value={form.duration} onChange={set('duration')} className="lartiska-input" placeholder="3 semaines" />
            </Field>
            <Field label="Livré le">
              <input type="date" value={form.completed_at} onChange={set('completed_at')} className="lartiska-input" />
            </Field>
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <input type="checkbox" checked={form.featured} onChange={set('featured')} className="accent-gold w-4 h-4" />
            <span className="text-sm text-fg/85">Mettre en vedette (page d'accueil)</span>
          </label>

          {saveMutation.isError && !errors && (
            <p className="text-rust text-sm">Erreur lors de l'enregistrement.</p>
          )}
          {saveMutation.isSuccess && (
            <p className="text-gold text-sm">✓ Enregistré.</p>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-line">
            <Link to="/admin/projects" className="btn-ghost !py-2.5 !px-5 text-xs">Annuler</Link>
            <button type="submit" className="btn-gold !py-2.5 !px-5 text-xs" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Enregistrement…' : (isNew ? 'Créer' : 'Enregistrer')}
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          {isNew ? (
            <div className="surface-card p-6 text-center">
              <p className="text-fg/65 text-sm">
                Enregistrez d'abord les informations du projet.<br />Vous pourrez ensuite uploader les images et vidéos.
              </p>
            </div>
          ) : (
            <>
              <div className="surface-card p-5">
                <h2 className="font-serif text-xl mb-4">Médias ({project?.images?.length || 0})</h2>

                <label className="block">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                    multiple
                    onChange={onFiles}
                    className="block w-full text-xs text-fg/70 file:mr-3 file:px-4 file:py-2.5 file:rounded-full file:border-0 file:bg-gold/15 file:text-gold file:cursor-pointer file:uppercase file:tracking-widest hover:file:bg-gold/25 cursor-pointer"
                  />
                </label>

                {uploadMutation.isPending && (
                  <p className="text-xs text-gold mt-3">Upload en cours…</p>
                )}
                {uploadError && (
                  <p className="text-xs text-rust mt-3">{uploadError}</p>
                )}

                {project?.images?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-5">
                    {project.images.map((img) => (
                      <div key={img.id} className="relative group rounded-lg overflow-hidden bg-ink aspect-square">
                        {img.type === 'video' ? (
                          <>
                            <video src={img.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                            <span className="absolute inset-0 grid place-items-center pointer-events-none">
                              <span className="w-8 h-8 rounded-full bg-bg/70 grid place-items-center text-gold text-sm">▶</span>
                            </span>
                          </>
                        ) : (
                          <img src={img.thumbnail || img.url} alt="" className="w-full h-full object-cover" />
                        )}
                        {img.is_cover && (
                          <span className="absolute top-1 left-1 text-[10px] uppercase tracking-widest bg-gold/90 text-bg px-1.5 py-0.5 rounded-full">★</span>
                        )}
                        {img.before_after === 'before' && (
                          <span className="absolute bottom-1 left-1 text-[9px] uppercase tracking-widest bg-bg/85 text-fg border border-line px-1.5 py-0.5 rounded">Avant</span>
                        )}
                        {img.before_after === 'after' && (
                          <span className="absolute bottom-1 right-1 text-[9px] uppercase tracking-widest bg-gold/85 text-bg px-1.5 py-0.5 rounded">Après</span>
                        )}
                        <div className="absolute inset-0 bg-bg/85 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 text-xs p-2">
                          <div className="flex gap-1.5">
                            {!img.is_cover && img.type !== 'video' && (
                              <button
                                type="button"
                                onClick={() => setCoverMutation.mutate(img.id)}
                                className="px-2 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-[10px] uppercase tracking-widest"
                              >
                                Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Supprimer cette image ?')) deleteImageMutation.mutate(img.id);
                              }}
                              className="px-2 py-1 rounded-full bg-rust/15 text-rust border border-rust/30"
                            >
                              ✕
                            </button>
                          </div>
                          {img.type !== 'video' && (
                            <select
                              value={img.before_after || 'none'}
                              onChange={(e) => beforeAfterMutation.mutate({ imageId: img.id, value: e.target.value })}
                              className="w-full text-[10px] uppercase tracking-widest bg-ink border border-line rounded px-1.5 py-1 text-fg"
                              title="Marquer comme Avant / Après"
                            >
                              <option value="none">Normale</option>
                              <option value="before">Avant</option>
                              <option value="after">Après</option>
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-fg/45 leading-relaxed">
                Images : JPG, PNG ou WebP, max 12 Mo. Vidéos : MP4, MOV ou WebM, max 100 Mo. La première image uploadée devient la cover automatiquement (les vidéos ne peuvent pas servir de cover).
                <br />
                <strong className="text-fg/65">Avant / Après</strong> : marquer 2 images consécutives par leur ordre
                (avant, puis après) — elles s'affichent en slider comparatif côté public.
              </p>
            </>
          )}
        </aside>
      </div>
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
