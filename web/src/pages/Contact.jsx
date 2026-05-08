import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSettings } from '@/hooks/useApi';
import { submitContact } from '@/api/endpoints';
import { whatsappLink } from '@/utils/format';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', body: '' });
  const { data: settings } = useSettings();

  const mutation = useMutation({
    mutationFn: () => submitContact(form),
    onSuccess: () => setForm({ name: '', email: '', phone: '', subject: '', body: '' }),
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const phone = settings?.['contact.phone'] || '+221785446363';
  const email = settings?.['contact.email'] || 'contact@lartiska.com';
  const whatsapp = settings?.['contact.whatsapp'] || '221785446363';

  return (
    <div className="container-art py-16 md:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20">
      <div>
        <p className="eyebrow mb-4">— Contact</p>
        <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight">
          Parlons de votre <em className="text-gold">projet</em>.
        </h1>
        <p className="mt-6 text-fg/75 leading-relaxed">
          Une question, un chantier en vue, ou simplement envie d'échanger sur les possibles ? Nous répondons sous 24h en semaine.
        </p>

        <ul className="mt-10 space-y-5">
          <li>
            <p className="text-xs uppercase tracking-widest text-gold mb-1">Téléphone</p>
            <a href={`tel:${phone}`} className="font-serif text-2xl hover:text-gold transition-colors">{phone}</a>
          </li>
          <li>
            <p className="text-xs uppercase tracking-widest text-gold mb-1">WhatsApp</p>
            <a href={whatsappLink(whatsapp, 'Bonjour Lartiska,')} target="_blank" rel="noreferrer" className="font-serif text-2xl hover:text-gold transition-colors">
              Discuter en direct →
            </a>
          </li>
          <li>
            <p className="text-xs uppercase tracking-widest text-gold mb-1">Email</p>
            <a href={`mailto:${email}`} className="font-serif text-2xl hover:text-gold transition-colors">{email}</a>
          </li>
          <li>
            <p className="text-xs uppercase tracking-widest text-gold mb-1">Atelier</p>
            <p className="font-serif text-2xl">{settings?.['contact.address'] || 'Dakar, Sénégal'}</p>
          </li>
        </ul>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
        className="surface-card p-7 md:p-10 space-y-5"
      >
        <h2 className="font-serif text-2xl mb-2">Écrivez-nous</h2>

        {mutation.isSuccess && (
          <p className="text-gold text-sm border border-gold/40 bg-gold/10 px-4 py-3 rounded-xl">
            Merci, votre message est bien arrivé. À très vite ✦
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
