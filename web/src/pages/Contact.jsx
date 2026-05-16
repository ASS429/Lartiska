import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSettings } from '@/hooks/useApi';
import { submitContact } from '@/api/endpoints';
import { Seo } from '@/hooks/useSeo';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', body: '' });
  const { data: settings } = useSettings();

  const mutation = useMutation({
    mutationFn: () => submitContact(form),
    onSuccess: () => setForm({ name: '', email: '', phone: '', subject: '', body: '' }),
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // 3 phones avec WhatsApp associé (depuis settings)
  const phones = Array.isArray(settings?.['contact.phones']) && settings['contact.phones'].length
    ? settings['contact.phones']
    : [
        { label: 'Tounkara — Atelier', phone: '+221 78 544 63 63', whatsapp: '221785446363' },
        { label: 'Devis & projets',    phone: '+221 77 346 86 81', whatsapp: '221773468681' },
        { label: 'Service client',     phone: '+221 77 289 85 37', whatsapp: '221772898537' },
      ];

  const email = settings?.['contact.email'] || 'contact@lartiska.com';
  const gmail = settings?.['social.gmail'] || email;
  const address = settings?.['contact.address'] || 'Dakar, Sénégal';

  const socials = [
    { key: 'facebook',  label: 'Facebook',  url: settings?.['social.facebook'],  handle: settings?.['social_handle.facebook']  || '@lartiska',           icon: <FacebookIcon /> },
    { key: 'instagram', label: 'Instagram', url: settings?.['social.instagram'], handle: settings?.['social_handle.instagram'] || '@lartiska_officiel',  icon: <InstagramIcon /> },
    { key: 'tiktok',    label: 'TikTok',    url: settings?.['social.tiktok'],    handle: settings?.['social_handle.tiktok']    || '@lartiska',           icon: <TikTokIcon /> },
    { key: 'snapchat',  label: 'Snapchat',  url: settings?.['social.snapchat'],  handle: settings?.['social_handle.snapchat']  || 'lartiska',            icon: <SnapchatIcon /> },
    { key: 'gmail',     label: 'Gmail',     url: gmail.startsWith('http') ? gmail : `mailto:${gmail}`, handle: gmail, icon: <GmailIcon /> },
  ].filter((s) => s.url);

  // QR code WhatsApp (premier numéro)
  const primaryWhatsapp = phones[0]?.whatsapp || '221785446363';
  const whatsappUrl = `https://wa.me/${primaryWhatsapp}?text=${encodeURIComponent('Bonjour Lartiska, je souhaite discuter d\'un projet.')}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(whatsappUrl)}`;

  return (
    <div className="container-art py-16 md:py-24">
      <Seo
        title="Contact"
        description="Joignez Lartiska : 3 numéros directs, WhatsApp, email, QR code. Réponse sous 24h ouvrées."
        path="/contact"
      />
      <header className="max-w-3xl mb-14">
        <p className="eyebrow mb-4">— Contact</p>
        <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.04]">
          Parlons de votre <em className="text-gold not-italic">projet</em>.
        </h1>
        <p className="mt-6 text-fg/75 leading-relaxed max-w-xl">
          Trois lignes directes, cinq canaux sociaux et un QR code pour démarrer la conversation en deux secondes. Nous répondons sous 24h ouvrées.
        </p>
      </header>

      {/* ───── PHONES + WhatsApp (3 lignes) ───── */}
      <section className="grid md:grid-cols-3 gap-4 mb-10">
        {phones.map((p, i) => (
          <article key={i} className="surface-card p-6 flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.32em] text-gold">{p.label}</p>
            <a href={`tel:${(p.phone || '').replace(/\s/g, '')}`} className="font-serif text-2xl leading-tight hover:text-gold transition-colors">
              {p.phone}
            </a>
            <div className="mt-auto pt-4 border-t border-line flex items-center gap-3">
              <a
                href={`https://wa.me/${p.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 text-xs uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href={`tel:${(p.phone || '').replace(/\s/g, '')}`}
                className="text-xs uppercase tracking-widest text-fg/65 hover:text-gold transition-colors ml-auto"
              >
                Appeler →
              </a>
            </div>
          </article>
        ))}
      </section>

      {/* ───── QR + Réseaux ───── */}
      <section className="grid md:grid-cols-[280px_1fr] gap-6 mb-14">
        <div className="surface-card p-6 flex flex-col items-center text-center">
          <p className="eyebrow mb-3">QR · WhatsApp direct</p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="block rounded-2xl overflow-hidden border border-line bg-cream/95 p-3 transition-transform hover:scale-[1.03]">
            <img src={qrSrc} alt="QR code menant à WhatsApp Lartiska" width="240" height="240" className="block" />
          </a>
          <p className="mt-4 text-xs text-fg/65 leading-relaxed">
            Scanne avec ton téléphone pour ouvrir directement la conversation WhatsApp Lartiska.
          </p>
        </div>

        <div className="surface-card p-6 md:p-8">
          <p className="eyebrow mb-5">Réseaux sociaux</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl border border-line hover:border-gold hover:bg-gold/5 transition-all duration-300 group"
              >
                <span className="w-10 h-10 rounded-full grid place-items-center bg-gold/10 text-gold group-hover:bg-gold group-hover:text-bg transition-all">
                  {s.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-widest text-gold/75">{s.label}</span>
                  <span className="block text-sm truncate">{s.handle}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Form + Adresse ───── */}
      <section className="grid lg:grid-cols-[1fr_320px] gap-6">
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="surface-card p-7 md:p-10 space-y-5"
        >
          <header>
            <p className="eyebrow mb-2">Formulaire</p>
            <h2 className="font-serif text-2xl">Écrivez-nous</h2>
          </header>

          {mutation.isSuccess && (
            <p className="text-gold text-sm border border-gold/40 bg-gold/10 px-4 py-3 rounded-xl">
              ✦ Merci, votre message est bien arrivé. À très vite.
            </p>
          )}

          <Field label="Votre nom" required>
            <input value={form.name} onChange={set('name')} className="lartiska-input" required />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email">
              <input type="email" value={form.email} onChange={set('email')} className="lartiska-input" />
            </Field>
            <Field label="Téléphone">
              <input type="tel" value={form.phone} onChange={set('phone')} className="lartiska-input" />
            </Field>
          </div>
          <Field label="Sujet">
            <input value={form.subject} onChange={set('subject')} className="lartiska-input" />
          </Field>
          <Field label="Message" required>
            <textarea value={form.body} onChange={set('body')} rows={5} className="lartiska-input" required />
          </Field>

          {mutation.isError && (
            <p className="text-rust text-sm">Erreur lors de l'envoi. Réessayez ou écrivez à {email}.</p>
          )}

          <button type="submit" className="btn-gold w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Envoi…' : 'Envoyer le message'}
          </button>
        </form>

        <aside className="space-y-4">
          <div className="surface-card p-6">
            <p className="eyebrow mb-3">Atelier</p>
            <p className="font-serif text-xl leading-snug">{address}</p>
            <p className="mt-3 text-sm text-fg/70 leading-relaxed">
              Sur rendez-vous uniquement — appelez ou écrivez d'abord pour fixer un créneau.
            </p>
          </div>

          <div className="surface-card p-6">
            <p className="eyebrow mb-3">Email général</p>
            <a href={`mailto:${email}`} className="font-serif text-lg hover:text-gold transition-colors break-all">{email}</a>
          </div>
        </aside>
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

// ─── Icons (inline SVG, sans dépendance) ─────────────────
function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413"/>
    </svg>
  );
}
function FacebookIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-3h2.4V9.5c0-2.4 1.4-3.7 3.6-3.7c1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 3h-2.2v7A10 10 0 0 0 22 12"/></svg>;
}
function InstagramIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>;
}
function TikTokIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74a2.89 2.89 0 0 1 2.31-4.64a2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.71a8.16 8.16 0 0 0 4.77 1.52V6.78a4.85 4.85 0 0 1-1.84-.09Z"/></svg>;
}
function SnapchatIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.166.5C8.66.5 5.617 2.93 5.617 6.85v3.034l-.183.1c-.366.2-1.65 1.05-2.466 1.05c-.633 0-.933-.183-1.083-.25l-.067-.033l-.05.067c-.183.183-.366.516-.366.866c0 .283.083.85 1.7 1.5c.55.2 1.083.366 1.5.483c.566.166.916.266 1.116.466c.05.05.067.067.066.083v.05c0 .25-.566 1.55-2.5 2.166c-.366.117-.616.367-.616.65c0 .35.366.683.95.85c1.566.466 2.766 1.483 3.65 3.083c.466.85.85 1.483 1.566 1.483c.366 0 .733-.067 1.166-.15c.45-.083.917-.183 1.433-.183c.483 0 .933.083 1.383.183c.45.083.85.166 1.183.166c.717 0 1.1-.633 1.566-1.483c.884-1.6 2.084-2.617 3.65-3.083c.584-.167.95-.5.95-.85c0-.283-.25-.533-.616-.65c-1.934-.616-2.5-1.916-2.5-2.166v-.05c-.001-.016.016-.033.066-.083c.2-.2.55-.3 1.116-.466c.417-.117.95-.283 1.5-.483c1.617-.65 1.7-1.217 1.7-1.5c0-.35-.183-.683-.366-.866l-.05-.067l-.067.033c-.15.067-.45.25-1.083.25c-.817 0-2.1-.85-2.466-1.05l-.183-.1V6.85C18.715 2.93 15.673.5 12.166.5z"/></svg>;
}
function GmailIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
}
