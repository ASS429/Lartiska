import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminSettings, updateAdminSettings } from '@/api/admin';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';

const SOCIAL_KEYS = [
  { key: 'social.facebook',  label: 'Facebook',  placeholder: 'https://www.facebook.com/share/1U5e5Kr13D/' },
  { key: 'social.instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/lartiska_officiel' },
  { key: 'social.tiktok',    label: 'TikTok',    placeholder: 'https://www.tiktok.com/@lartiska' },
  { key: 'social.youtube',   label: 'YouTube',   placeholder: 'https://www.youtube.com/@lartiska6323' },
  { key: 'social.snapchat',  label: 'Snapchat',  placeholder: 'https://www.snapchat.com/add/lartiska' },
  { key: 'social.gmail',     label: 'Gmail',     placeholder: 'lartiska.officiel@gmail.com' },
];

const SOCIAL_HANDLE_KEYS = [
  { key: 'social_handle.facebook',  label: 'Identifiant Facebook' },
  { key: 'social_handle.instagram', label: 'Identifiant Instagram' },
  { key: 'social_handle.tiktok',    label: 'Identifiant TikTok' },
  { key: 'social_handle.youtube',   label: 'Identifiant YouTube' },
  { key: 'social_handle.snapchat',  label: 'Identifiant Snapchat' },
];

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: fetchAdminSettings,
  });

  // form: dictionnaire plat key -> value
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!data) return;
    const flat = {};
    Object.values(data).forEach((group) => {
      Object.entries(group).forEach(([k, v]) => { flat[k] = v; });
    });
    setForm(flat);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => updateAdminSettings(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] }); // also refresh public
    },
  });

  const setKey = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const phones = Array.isArray(form['contact.phones']) ? form['contact.phones'] : [];

  const updatePhone = (index, field, value) => {
    const next = phones.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    setForm((f) => ({ ...f, 'contact.phones': next }));
  };

  const addPhone = () => {
    setForm((f) => ({
      ...f,
      'contact.phones': [...phones, { label: '', phone: '', whatsapp: '' }],
    }));
  };

  const removePhone = (index) => {
    setForm((f) => ({
      ...f,
      'contact.phones': phones.filter((_, i) => i !== index),
    }));
  };

  const cities = Array.isArray(form['cities.served']) ? form['cities.served'] : [];

  const updateCity = (index, value) => {
    const next = cities.map((c, i) => (i === index ? value : c));
    setForm((f) => ({ ...f, 'cities.served': next }));
  };

  const addCity = () => setForm((f) => ({ ...f, 'cities.served': [...cities, ''] }));
  const removeCity = (index) => setForm((f) => ({ ...f, 'cities.served': cities.filter((_, i) => i !== index) }));

  if (isLoading) return <p className="text-fg/55">Chargement…</p>;

  return (
    <>
    <form
      onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
      className="space-y-8 max-w-4xl"
    >
      <header>
        <p className="eyebrow mb-2">Réglages</p>
        <h1 className="font-serif text-3xl md:text-4xl font-light">Configuration du site</h1>
      </header>

      <section className="surface-card p-6 space-y-5">
        <h2 className="font-serif text-xl">Société</h2>
        <Field label="Nom"><input value={form['company.name'] || ''} onChange={setKey('company.name')} className="lartiska-input" /></Field>
        <Field label="Tagline"><input value={form['company.tagline'] || ''} onChange={setKey('company.tagline')} className="lartiska-input" /></Field>
        <Field label="Essence (sous-titre)" hint='Ex: "émeraude · or · pièce signature"'>
          <input value={form['company.essence'] || ''} onChange={setKey('company.essence')} className="lartiska-input" />
        </Field>
      </section>

      <section className="surface-card p-6 space-y-5">
        <header className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Numéros de téléphone & WhatsApp</h2>
          <button type="button" onClick={addPhone} className="text-xs uppercase tracking-widest text-gold hover:underline">+ Ajouter</button>
        </header>

        {phones.length === 0 ? (
          <p className="text-fg/55 text-sm">Aucun numéro configuré.</p>
        ) : (
          <ul className="space-y-3">
            {phones.map((p, i) => (
              <li key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-start">
                <Field label="Libellé">
                  <input value={p.label || ''} onChange={(e) => updatePhone(i, 'label', e.target.value)} className="lartiska-input" placeholder="Atelier, Devis…" />
                </Field>
                <Field label="Téléphone (avec +)">
                  <input value={p.phone || ''} onChange={(e) => updatePhone(i, 'phone', e.target.value)} className="lartiska-input" placeholder="+221785446363" />
                </Field>
                <Field label="WhatsApp (sans +)">
                  <input value={p.whatsapp || ''} onChange={(e) => updatePhone(i, 'whatsapp', e.target.value)} className="lartiska-input" placeholder="221785446363" />
                </Field>
                <button type="button" onClick={() => removePhone(i)} className="self-end mb-1 px-3 py-2.5 rounded-full border border-line text-fg/55 hover:text-rust hover:border-rust transition-all text-xs">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <Field label="Email principal">
          <input type="email" value={form['contact.email'] || ''} onChange={setKey('contact.email')} className="lartiska-input" />
        </Field>
        <Field label="Adresse / atelier">
          <input value={form['contact.address'] || ''} onChange={setKey('contact.address')} className="lartiska-input" />
        </Field>
      </section>

      <section className="surface-card p-6 space-y-5">
        <h2 className="font-serif text-xl">Réseaux sociaux</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {SOCIAL_KEYS.map((s) => (
            <Field key={s.key} label={s.label}>
              <input value={form[s.key] || ''} onChange={setKey(s.key)} className="lartiska-input" placeholder={s.placeholder} />
            </Field>
          ))}
        </div>
        <details className="border-t border-line pt-4">
          <summary className="cursor-pointer text-xs uppercase tracking-widest text-fg/65 hover:text-gold">Identifiants courts (affichage)</summary>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {SOCIAL_HANDLE_KEYS.map((s) => (
              <Field key={s.key} label={s.label}>
                <input value={form[s.key] || ''} onChange={setKey(s.key)} className="lartiska-input" />
              </Field>
            ))}
          </div>
        </details>
      </section>

      <section className="surface-card p-6 space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Villes desservies</h2>
          <button type="button" onClick={addCity} className="text-xs uppercase tracking-widest text-gold hover:underline">+ Ajouter</button>
        </header>
        <div className="flex flex-wrap gap-2">
          {cities.map((c, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-line">
              <input
                value={c || ''}
                onChange={(e) => updateCity(i, e.target.value)}
                className="bg-transparent text-sm focus:outline-none"
                style={{ width: `${Math.max(60, (c?.length || 0) * 9 + 20)}px` }}
              />
              <button type="button" onClick={() => removeCity(i)} className="text-fg/45 hover:text-rust text-xs">✕</button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-end gap-3 sticky bottom-4 surface-card p-4">
        {mutation.isSuccess && <p className="text-gold text-xs mr-auto">✓ Réglages mis à jour.</p>}
        {mutation.isError && <p className="text-rust text-xs mr-auto">Erreur lors de la sauvegarde.</p>}
        <button type="submit" className="btn-gold !py-2.5 !px-6 text-xs" disabled={mutation.isPending}>
          {mutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>

    {/* Hors du <form> réglages : formulaire indépendant */}
    <div className="mt-10 max-w-4xl">
      <ChangePasswordForm />
    </div>
    </>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-fg/60">{label}</span>
      {hint && <span className="text-xs text-fg/45 ml-2">— {hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
