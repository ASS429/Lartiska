import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useServices, useSettings } from '@/hooks/useApi';
import { whatsappLink } from '@/utils/format';
import { submitQuote } from '@/api/endpoints';
import { Seo } from '@/hooks/useSeo';
import { HoneypotField } from '@/components/ui/HoneypotField';
import clsx from 'clsx';

const STEPS = ['Service', 'Détails', 'Coordonnées', 'Récapitulatif'];

const MAX_ATTACHMENTS = 5;
const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

// Brouillon : un utilisateur interrompu (coupure réseau, appel…) ne repart
// pas de zéro — le formulaire est restauré à sa prochaine visite.
const DRAFT_KEY = 'lartiska_devis_draft';

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const EMPTY_FORM = {
  service_id: '',
  description: '',
  surface_m2: '',
  estimated_budget: '',
  client_name: '',
  client_email: '',
  client_phone: '',
  client_city: '',
  site_address: '',
  website: '', // honeypot — jamais rempli par un humain
};

export default function Devis() {
  const [searchParams] = useSearchParams();
  const presetServiceId = searchParams.get('service_id') || '';
  const draft = loadDraft();
  const [step, setStep] = useState(() => {
    if (presetServiceId) return 1; // skip step 0 si préselection
    return draft?.step ?? 0;
  });
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...(draft?.form || {}),
    ...(presetServiceId ? { service_id: presetServiceId } : {}),
    website: '', // le honeypot n'est jamais restauré
  }));

  // Sauvegarde du brouillon à chaque changement (données texte uniquement,
  // pas les fichiers — non sérialisables).
  useEffect(() => {
    try {
      const safe = { ...form };
      delete safe.website; // le honeypot ne va jamais dans le brouillon
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form: safe, step }));
    } catch { /* stockage plein/désactivé : tant pis pour le brouillon */ }
  }, [form, step]);
  const [attachments, setAttachments] = useState([]); // File[]
  const [fileError, setFileError] = useState(null);
  const { data: services } = useServices();
  const { data: settings } = useSettings();

  // Canaux directs — les prix varient selon la zone et le projet :
  // beaucoup de clients préfèrent l'échange direct au formulaire.
  const waNumber = settings?.['contact.whatsapp'] || import.meta.env.VITE_WHATSAPP_NUMBER || '221785446363';
  const waHref = whatsappLink(waNumber, 'Bonjour Lartiska, je souhaite un devis pour mon projet : ');
  const email = settings?.['contact.email'] || 'lartiska.officiel@gmail.com';

  const mutation = useMutation({
    mutationFn: () => submitQuote({
      ...form,
      service_id: form.service_id || null,
      surface_m2: form.surface_m2 ? Number(form.surface_m2) : null,
      estimated_budget: form.estimated_budget ? Number(form.estimated_budget) : null,
      attachments,
    }),
    onSuccess: () => {
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    },
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onFiles = (e) => {
    setFileError(null);
    const incoming = Array.from(e.target.files || []);
    const merged = [...attachments];

    for (const f of incoming) {
      if (merged.length >= MAX_ATTACHMENTS) {
        setFileError(`Maximum ${MAX_ATTACHMENTS} fichiers.`);
        break;
      }
      if (!ACCEPTED_MIMES.includes(f.type)) {
        setFileError(`Format refusé : ${f.name} (autorisé : JPG, PNG, WebP, PDF).`);
        continue;
      }
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setFileError(`${f.name} dépasse ${MAX_FILE_SIZE_MB} Mo.`);
        continue;
      }
      // Pas de doublon
      if (!merged.some((m) => m.name === f.name && m.size === f.size)) {
        merged.push(f);
      }
    }
    setAttachments(merged);
    e.target.value = ''; // reset input pour ré-uploader le même fichier si besoin
  };

  const removeAttachment = (idx) => {
    setAttachments((arr) => arr.filter((_, i) => i !== idx));
  };

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const canNext = () => {
    if (step === 0) return !!form.service_id;
    if (step === 1) return form.description.trim().length >= 10;
    if (step === 2) {
      return form.client_name.trim() && /^\S+@\S+\.\S+$/.test(form.client_email) && form.client_phone.trim().length >= 6;
    }
    return true;
  };

  if (mutation.isSuccess) {
    return (
      <div className="container-art py-24 max-w-2xl text-center">
        <p className="eyebrow mb-4">✦ Demande reçue</p>
        <h1 className="font-serif text-4xl md:text-5xl">Merci, on revient vers vous très vite.</h1>
        <p className="mt-6 text-fg/75 leading-relaxed">
          Référence de votre demande : <strong className="text-gold">{mutation.data?.data?.reference}</strong>. Tounkara étudie votre projet et vous adresse un devis détaillé sous 48h.
        </p>
      </div>
    );
  }

  return (
    <div className="container-art py-16 md:py-24 max-w-3xl">
      <Seo
        title="Devis gratuit · Peinture, fresque, plafonnage, carrelage, epoxy résine Sénégal"
        description="Demandez un devis gratuit Lartiska au Sénégal : peinture artistique, fresque murale, plafonnage décoratif, carrelage zellige, mosaïque, epoxy résine, décoration d'intérieur. 4 étapes, PDF détaillé sous 48h ouvrées. Photos et plans acceptés."
        path="/devis"
      />
      <header className="mb-8">
        <p className="eyebrow mb-3">— Demande de devis</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">
          Quelques étapes pour <em className="text-gold">décrire votre projet</em>.
        </h1>
        <p className="mt-4 text-fg/70 text-sm leading-relaxed max-w-xl">
          Chaque projet est unique : le prix dépend de la zone, de la surface et de la
          complexité. Le devis est <strong className="text-gold">gratuit et personnalisé</strong>.
        </p>
      </header>

      {/* ── Canaux directs — plus simple pour beaucoup de clients ── */}
      <div className="surface-card p-5 md:p-6 mb-10 flex flex-wrap items-center gap-4">
        <p className="text-sm text-fg/80 flex-1 min-w-[220px]">
          <strong>Plus rapide pour vous ?</strong> Envoyez directement photos et description
          par WhatsApp ou par email — réponse sous 48h.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold uppercase tracking-widest hover:brightness-110 transition-all"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.35z"/><path d="M12.05 2a9.9 9.9 0 0 0-8.4 15.12L2.1 22l5-1.5A9.9 9.9 0 1 0 12.05 2zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.96.89.9-2.88-.2-.3a8.2 8.2 0 1 1 6.74 3.61z"/></svg>
            WhatsApp
          </a>
          <a
            href={`mailto:${email}?subject=Demande de devis Lartiska`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-line text-xs font-semibold uppercase tracking-widest text-fg/85 hover:border-gold hover:text-gold transition-colors"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
            Email
          </a>
        </div>
      </div>

      {/* Stepper — mobile : barre fine + label de l'étape courante seulement.
          Desktop (sm+) : tous les labels visibles. */}
      <div className="mb-10">
        <ol className="hidden sm:flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={clsx(
                'flex-1 text-center text-xs uppercase tracking-widest py-2 border-b-2 transition-colors',
                i <= step ? 'border-gold text-gold' : 'border-line text-fg/45',
              )}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>
        <div className="sm:hidden">
          <div className="flex items-center gap-1.5 mb-3">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={clsx(
                  'flex-1 h-1 rounded-full transition-colors',
                  i <= step ? 'bg-gold' : 'bg-line',
                )}
              />
            ))}
          </div>
          <p className="text-xs uppercase tracking-widest text-gold font-semibold">
            Étape {step + 1} / {STEPS.length} · {STEPS[step]}
          </p>
        </div>
      </div>

      <section className="surface-card p-7 md:p-10">
        <HoneypotField value={form.website} onChange={set('website')} />
        {step === 0 && (
          <div>
            <h2 className="font-serif text-2xl mb-6">Quel type de prestation ?</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {(services || []).map((s) => (
                <label
                  key={s.id}
                  className={clsx(
                    'block p-4 rounded-xl border cursor-pointer transition-all duration-300',
                    String(form.service_id) === String(s.id)
                      ? 'border-gold bg-gold/10'
                      : 'border-line hover:border-gold/60',
                  )}
                >
                  <input
                    type="radio"
                    name="service_id"
                    value={s.id}
                    checked={String(form.service_id) === String(s.id)}
                    onChange={set('service_id')}
                    className="sr-only"
                  />
                  <p className="text-xs uppercase tracking-widest text-gold/80">{s.category?.name}</p>
                  <p className="font-serif text-lg mt-1">{s.title}</p>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl">Détails du projet</h2>
            <Field label="Décrivez votre projet" required>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={5}
                placeholder="Ex : fresque murale dans le salon, environ 12 m², ambiance émeraude et or…"
                className="lartiska-input"
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Surface estimée (m²)">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.surface_m2}
                  onChange={set('surface_m2')}
                  className="lartiska-input"
                />
              </Field>
              <Field label="Budget estimé (FCFA)">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={form.estimated_budget}
                  onChange={set('estimated_budget')}
                  className="lartiska-input"
                />
              </Field>
            </div>

            {/* Upload photos & plans */}
            <Field label={`Photos ou plans (optionnel, max ${MAX_ATTACHMENTS})`}>
              <div className="rounded-xl border border-dashed border-line p-5 bg-ink/30">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  multiple
                  onChange={onFiles}
                  disabled={attachments.length >= MAX_ATTACHMENTS}
                  className="block w-full text-xs text-fg/70 file:mr-3 file:px-4 file:py-2.5 file:rounded-full file:border-0 file:bg-gold/15 file:text-gold file:cursor-pointer file:uppercase file:tracking-widest hover:file:bg-gold/25 cursor-pointer disabled:opacity-40"
                />
                <p className="text-[11px] text-fg/55 mt-2">
                  JPG, PNG, WebP ou PDF — max {MAX_FILE_SIZE_MB} Mo par fichier.
                  Ces fichiers restent privés et ne sont visibles que par Tounkara.
                </p>

                {fileError && (
                  <p className="text-rust text-sm mt-2">{fileError}</p>
                )}

                {attachments.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {attachments.map((f, i) => (
                      <li key={`${f.name}-${i}`} className="flex items-center gap-3 p-2.5 rounded-lg bg-ink/40 border border-line">
                        <FilePreview file={f} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm truncate">{f.name}</p>
                          <p className="text-[11px] text-fg/55">{(f.size / 1024 / 1024).toFixed(2)} Mo · {f.type.split('/')[1].toUpperCase()}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="text-fg/45 hover:text-rust text-xs px-2 py-1 rounded-full border border-line hover:border-rust transition-all"
                          aria-label="Retirer"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl">Vos coordonnées</h2>
            <Field label="Nom complet" required>
              <input value={form.client_name} onChange={set('client_name')} className="lartiska-input" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Email" required>
                <input type="email" value={form.client_email} onChange={set('client_email')} className="lartiska-input" />
              </Field>
              <Field label="Téléphone / WhatsApp" required>
                <input type="tel" value={form.client_phone} onChange={set('client_phone')} className="lartiska-input" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Ville">
                <input value={form.client_city} onChange={set('client_city')} className="lartiska-input" />
              </Field>
              <Field label="Adresse du chantier">
                <input value={form.site_address} onChange={set('site_address')} className="lartiska-input" />
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl">Récapitulatif</h2>
            <Recap label="Service" value={services?.find((s) => String(s.id) === String(form.service_id))?.title || '—'} />
            <Recap label="Description" value={form.description || '—'} />
            <Recap label="Surface" value={form.surface_m2 ? `${form.surface_m2} m²` : '—'} />
            <Recap label="Budget" value={form.estimated_budget ? `${Number(form.estimated_budget).toLocaleString('fr-FR')} FCFA` : '—'} />
            <Recap label="Pièces jointes" value={attachments.length > 0 ? `${attachments.length} fichier${attachments.length > 1 ? 's' : ''}` : 'Aucune'} />
            <Recap label="Client" value={`${form.client_name} · ${form.client_email} · ${form.client_phone}`} />
            <Recap label="Adresse" value={[form.client_city, form.site_address].filter(Boolean).join(' — ') || '—'} />

            {mutation.isError && (
              <p className="text-rust text-sm">Une erreur est survenue. Réessayez ou contactez-nous directement.</p>
            )}
          </div>
        )}

        <div className="mt-9 flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="btn-ghost disabled:opacity-40 disabled:pointer-events-none"
          >
            ← Précédent
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canNext()}
              className="btn-gold disabled:opacity-40 disabled:pointer-events-none"
            >
              Suivant →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="btn-gold disabled:opacity-60"
            >
              {mutation.isPending ? 'Envoi…' : 'Envoyer ma demande'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-fg/60">{label}{required && <span className="text-rust ml-1">*</span>}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Recap({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 border-b border-line pb-3">
      <span className="text-xs uppercase tracking-widest text-gold/80 sm:w-32 shrink-0">{label}</span>
      <span className="text-fg/85 break-words">{value}</span>
    </div>
  );
}

function FilePreview({ file }) {
  const isImage = file.type.startsWith('image/');
  const url = isImage ? URL.createObjectURL(file) : null;
  // L'URL est libérée par le navigateur quand le composant disparaît ;
  // suffisant pour notre cas d'usage (5 fichiers max, formulaire court).
  return isImage ? (
    <img src={url} alt={file.name} className="w-10 h-10 rounded-md object-cover shrink-0" />
  ) : (
    <span className="w-10 h-10 rounded-md grid place-items-center bg-rust/15 text-rust text-[10px] uppercase tracking-widest shrink-0">
      PDF
    </span>
  );
}
