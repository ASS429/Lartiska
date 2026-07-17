import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSettings } from '@/hooks/useApi';
import { submitContact } from '@/api/endpoints';
import { Seo } from '@/hooks/useSeo';
import { HoneypotField } from '@/components/ui/HoneypotField';

const EMPTY = { name: '', email: '', phone: '', subject: '', body: '', website: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const { data: settings } = useSettings();

  const mutation = useMutation({
    mutationFn: () => submitContact(form),
    onSuccess: () => setForm(EMPTY),
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // 3 phones avec WhatsApp associé (depuis settings)
  const phones = Array.isArray(settings?.['contact.phones']) && settings['contact.phones'].length
    ? settings['contact.phones']
    : [
        { label: 'Malick — Devis & contact', phone: '+221 77 346 86 81', whatsapp: '221773468681' },
        { label: 'Tounkara — Atelier', phone: '+221 78 544 63 63', whatsapp: '221785446363' },
        { label: 'Service client',     phone: '+221 77 289 85 37', whatsapp: '221772898537' },
      ];

  // Pré-remplissage WhatsApp adapté au contexte de chaque ligne.
  // Le client reçoit ce template prêt à compléter dans son app WhatsApp.
  const buildWhatsAppText = (label) => {
    const portfolioLink = `${window.location.origin}/portfolio`;
    if (/atelier|tounkara/i.test(label)) {
      return [
        'Bonjour Tounkara,',
        '',
        "J'ai parcouru le portfolio Lartiska et votre univers m'intéresse. J'aimerais échanger sur un projet créatif :",
        '',
        '✦ Type de prestation : ',
        '✦ Lieu : ',
        '✦ Brief / inspiration : ',
        '',
        `Portfolio consulté : ${portfolioLink}`,
      ].join('\n');
    }
    if (/devis|projet/i.test(label)) {
      return [
        'Bonjour Lartiska,',
        '',
        'Je souhaite obtenir un devis pour un projet :',
        '',
        '✦ Type de prestation : ',
        '✦ Lieu / ville : ',
        '✦ Surface approximative : ',
        '✦ Délais souhaités : ',
        '✦ Budget envisagé : ',
        '',
        `Portfolio : ${portfolioLink}`,
        '',
        'Merci d\'avance.',
      ].join('\n');
    }
    if (/service|client|support/i.test(label)) {
      return [
        'Bonjour Lartiska,',
        '',
        "J'ai une question concernant :",
        '',
        '✦ Sujet : ',
        '✦ Référence devis (si applicable) : ',
        '',
        'Merci pour votre aide.',
      ].join('\n');
    }
    // Fallback générique
    return 'Bonjour Lartiska, je souhaite discuter d\'un projet.';
  };

  const buildWhatsAppUrl = (whatsapp, label) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(buildWhatsAppText(label))}`;

  const email = settings?.['contact.email'] || 'lartiska2@gmail.com';
  const gmail = settings?.['social.gmail'] || email;
  const address = settings?.['contact.address'] || 'Dakar, Sénégal';

  // Couleur de marque pour chaque réseau (utilisée pour le fond du badge icône + accent au hover)
  const socials = [
    { key: 'facebook',  label: 'Facebook',  url: settings?.['social.facebook'],  handle: settings?.['social_handle.facebook']  || '@lartiska',           icon: <FacebookIcon />,  brand: '#1877F2', contrast: '#FFFFFF' },
    { key: 'instagram', label: 'Instagram', url: settings?.['social.instagram'], handle: settings?.['social_handle.instagram'] || '@lartiska_officiel',  icon: <InstagramIcon />, brand: '#E1306C', contrast: '#FFFFFF', gradient: 'linear-gradient(135deg, #FEDA75 0%, #FA7E1E 25%, #D62976 55%, #962FBF 80%, #4F5BD5 100%)' },
    { key: 'tiktok',    label: 'TikTok',    url: settings?.['social.tiktok'],    handle: settings?.['social_handle.tiktok']    || '@lartiska',           icon: <TikTokIcon />,    brand: '#000000', contrast: '#FFFFFF' },
    { key: 'youtube',   label: 'YouTube',   url: settings?.['social.youtube'],   handle: settings?.['social_handle.youtube']   || '@lartiska6323',       icon: <YouTubeIcon />,   brand: '#FF0000', contrast: '#FFFFFF' },
    { key: 'snapchat',  label: 'Snapchat',  url: settings?.['social.snapchat'],  handle: settings?.['social_handle.snapchat']  || 'lartiska',            icon: <SnapchatIcon />,  brand: '#FFFC00', contrast: '#000000' },
    { key: 'gmail',     label: 'Gmail',     url: gmail.startsWith('http') ? gmail : `mailto:${gmail}`, handle: gmail, icon: <GmailIcon />, brand: '#EA4335', contrast: '#FFFFFF' },
  ].filter((s) => s.url);

  // QR code WhatsApp (premier numéro avec son template contextualisé)
  const primaryWhatsapp = phones[0]?.whatsapp || '221773468681';
  const primaryLabel = phones[0]?.label || 'Tounkara — Atelier';
  const whatsappUrl = buildWhatsAppUrl(primaryWhatsapp, primaryLabel);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(whatsappUrl)}`;

  return (
    <div className="container-art py-16 md:py-24">
      <Seo
        title="Contact · Lartiska Mbour Sénégal · WhatsApp +221 78 544 63 63"
        description="Contactez Lartiska à Mbour, Sénégal : 3 numéros directs, WhatsApp, email, QR code. Devis peinture artistique, fresque murale, plafonnage, carrelage, epoxy résine. Réponse sous 24h ouvrées."
        path="/contact"
      />
      <header className="max-w-3xl mb-14">
        <p className="eyebrow mb-4">— Contact</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-light leading-[1.04]">
          Parlons de votre <em className="gold-em">projet</em>.
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
                href={buildWhatsAppUrl(p.whatsapp, p.label)}
                target="_blank"
                rel="noreferrer"
                className="brand-btn-whatsapp inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href={`tel:${(p.phone || '').replace(/\s/g, '')}`}
                className="text-xs uppercase tracking-widest text-fg/65 hover:text-gold transition-colors ml-auto font-semibold"
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
                className="social-tile group flex items-center gap-3 p-3.5 rounded-xl border border-line transition-all duration-300"
                style={{ '--brand': s.brand, '--brand-contrast': s.contrast }}
              >
                <span
                  className="social-tile__icon w-11 h-11 rounded-full grid place-items-center shrink-0 transition-all duration-300"
                  style={{
                    background: s.gradient || s.brand,
                    color: s.contrast,
                    boxShadow: `0 4px 14px -4px ${s.brand}66`,
                  }}
                >
                  {s.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] uppercase tracking-[0.22em] font-bold" style={{ color: s.brand }}>
                    {s.label}
                  </span>
                  <span className="block text-[14px] truncate font-semibold text-fg/95">{s.handle}</span>
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

          <HoneypotField value={form.website} onChange={set('website')} />

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
function YouTubeIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>;
}
