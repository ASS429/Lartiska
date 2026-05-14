import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useServices } from '@/hooks/useApi';
import { submitQuote } from '@/api/endpoints';
import clsx from 'clsx';

const STEPS = ['Service', 'Détails', 'Coordonnées', 'Récapitulatif'];

export default function Devis() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    service_id: '',
    description: '',
    surface_m2: '',
    estimated_budget: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    client_city: '',
    site_address: '',
  });
  const { data: services } = useServices();

  const mutation = useMutation({
    mutationFn: () => submitQuote({
      ...form,
      service_id: form.service_id || null,
      surface_m2: form.surface_m2 ? Number(form.surface_m2) : null,
      estimated_budget: form.estimated_budget ? Number(form.estimated_budget) : null,
    }),
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

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
      <header className="mb-10">
        <p className="eyebrow mb-3">— Demande de devis</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">
          Quelques étapes pour <em className="text-gold">décrire votre projet</em>.
        </h1>
      </header>

      <ol className="flex items-center gap-2 mb-10">
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

      <section className="surface-card p-7 md:p-10">
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
