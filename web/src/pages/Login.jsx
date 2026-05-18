import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, status, error, user, isAdmin } = useAuthStore();

  // URL params : ?email=X&ref=LRTSK-2026-0002&redirect=/account/quotes/2
  const prefilledEmail = searchParams.get('email') || '';
  const quoteRef = searchParams.get('ref');
  const redirectParam = searchParams.get('redirect');

  const [form, setForm] = useState({ email: prefilledEmail, password: '' });

  useEffect(() => {
    if (status === 'authenticated' && user) {
      const target = redirectParam
        || location.state?.from
        || (isAdmin() ? '/admin' : '/account');
      navigate(target, { replace: true });
    }
  }, [status, user, isAdmin, navigate, location.state, redirectParam]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
    } catch { /* error handled in store */ }
  };

  // Préserver les params dans les liens vers register / forgot
  const registerHref = `/register?${searchParams.toString()}`;
  const forgotHref = `/forgot-password?${new URLSearchParams({
    ...(form.email && { email: form.email }),
    ...(redirectParam && { redirect: redirectParam }),
  }).toString()}`;

  return (
    <div className="container-art py-16 md:py-24 max-w-md">
      <header className="mb-10 text-center">
        <p className="eyebrow mb-4">— Connexion</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">
          Bienvenue sur <em className="gold-em">Lartiska</em>.
        </h1>
        {quoteRef ? (
          <p className="mt-4 text-fg/85 text-sm leading-relaxed">
            Connectez-vous pour consulter votre devis{' '}
            <span className="font-mono text-gold font-semibold">{quoteRef}</span>.
          </p>
        ) : (
          <p className="mt-3 text-fg/65 text-sm">
            Accédez à votre espace pour suivre vos demandes ou administrer la plateforme.
          </p>
        )}
      </header>

      <form onSubmit={submit} className="surface-card p-7 md:p-9 space-y-5">
        <label className="block">
          <span className="text-xs uppercase tracking-widest text-fg/60">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="lartiska-input mt-2"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-widest text-fg/60 flex items-center justify-between">
            <span>Mot de passe</span>
            <Link to={forgotHref} className="text-[10px] text-gold hover:underline normal-case tracking-normal">
              Oublié ?
            </Link>
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="lartiska-input mt-2"
          />
        </label>

        {error && (
          <p className="text-rust text-sm border border-rust/40 bg-rust/10 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}

        <button type="submit" className="btn-gold w-full" disabled={status === 'loading'}>
          {status === 'loading' ? 'Connexion…' : 'Se connecter'}
        </button>

        <p className="text-center text-xs text-fg/65">
          Pas encore de compte ?{' '}
          <Link to={registerHref} className="text-gold hover:underline font-semibold">
            Créer un compte
          </Link>
          {prefilledEmail && (
            <span className="block mt-1 text-fg/55">
              avec <span className="font-mono">{prefilledEmail}</span> — votre devis sera rattaché automatiquement.
            </span>
          )}
        </p>
      </form>
    </div>
  );
}
