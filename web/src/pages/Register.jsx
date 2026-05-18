import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/auth';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, status, hydrate } = useAuthStore();

  // URL params : ?email=X&ref=LRTSK-2026-0002&redirect=/account/quotes/2
  const prefilledEmail = searchParams.get('email') || '';
  const quoteRef = searchParams.get('ref');
  const redirectParam = searchParams.get('redirect');

  const [form, setForm] = useState({
    name: '',
    email: prefilledEmail,
    phone: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    if (status === 'authenticated' && user) {
      const target = redirectParam || (user.role === 'admin' ? '/admin' : '/account');
      navigate(target, { replace: true });
    }
  }, [user, status, navigate, redirectParam]);

  const mutation = useMutation({
    mutationFn: (payload) => apiClient.post('/auth/register', payload).then((r) => r.data),
    onSuccess: ({ token, claimed_quotes }) => {
      localStorage.setItem('lartiska_token', token);
      hydrate();
      if (claimed_quotes > 0) {
        sessionStorage.setItem('lartiska_claim_message',
          `${claimed_quotes} demande${claimed_quotes > 1 ? 's' : ''} récupérée${claimed_quotes > 1 ? 's' : ''} sous votre compte.`);
      }
      navigate(redirectParam || '/account', { replace: true });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    mutation.mutate({ ...form, device_name: 'web' });
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const errors = mutation.error?.response?.data?.errors || {};

  const loginHref = `/login?${searchParams.toString()}`;

  return (
    <div className="container-art py-16 md:py-24 max-w-md">
      <header className="mb-10 text-center">
        <p className="eyebrow mb-4">— Créer un compte</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">
          Rejoignez <em className="gold-em">Lartiska</em>.
        </h1>
        {quoteRef ? (
          <p className="mt-4 text-fg/85 text-sm leading-relaxed">
            Créez votre compte pour consulter votre devis{' '}
            <span className="font-mono text-gold font-semibold">{quoteRef}</span>.
            {prefilledEmail && (
              <span className="block mt-2 text-fg/70 text-xs">
                Utilisez l'email <span className="font-mono">{prefilledEmail}</span> — votre devis sera rattaché automatiquement.
              </span>
            )}
          </p>
        ) : (
          <p className="mt-3 text-fg/65 text-sm">
            Suivez vos demandes et recevez vos devis directement dans votre espace.
          </p>
        )}
      </header>

      <form onSubmit={submit} className="surface-card p-7 md:p-9 space-y-4">
        <Field label="Nom complet" required error={errors.name?.[0]}>
          <input value={form.name} onChange={set('name')} className="lartiska-input" required />
        </Field>
        <Field label="Email" required error={errors.email?.[0]}>
          <input type="email" value={form.email} onChange={set('email')} className="lartiska-input" required />
        </Field>
        <Field label="Téléphone" error={errors.phone?.[0]}>
          <input type="tel" value={form.phone} onChange={set('phone')} className="lartiska-input" />
        </Field>
        <Field label="Mot de passe (min. 8)" required error={errors.password?.[0]}>
          <input type="password" value={form.password} onChange={set('password')} className="lartiska-input" required minLength={8} />
        </Field>
        <Field label="Confirmer le mot de passe" required>
          <input type="password" value={form.password_confirmation} onChange={set('password_confirmation')} className="lartiska-input" required />
        </Field>

        <button type="submit" className="btn-gold w-full mt-2" disabled={mutation.isPending}>
          {mutation.isPending ? 'Création…' : 'Créer mon compte'}
        </button>

        <p className="text-center text-xs text-fg/65">
          Déjà un compte ? <Link to={loginHref} className="text-gold hover:underline font-semibold">Se connecter</Link>
        </p>
      </form>
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
