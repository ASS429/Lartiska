import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, status, error, user, isAdmin } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (status === 'authenticated' && user) {
      const target = location.state?.from
        || (isAdmin() ? '/admin' : '/account');
      navigate(target, { replace: true });
    }
  }, [status, user, isAdmin, navigate, location.state]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
    } catch (_err) { /* error handled in store */ }
  };

  return (
    <div className="container-art py-16 md:py-24 max-w-md">
      <header className="mb-10 text-center">
        <p className="eyebrow mb-4">— Connexion</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">
          Bienvenue sur <em className="text-gold">Lartiska</em>.
        </h1>
        <p className="mt-3 text-fg/65 text-sm">
          Accédez à votre espace pour suivre vos demandes ou administrer la plateforme.
        </p>
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
          <span className="text-xs uppercase tracking-widest text-fg/60">Mot de passe</span>
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

        <p className="text-center text-xs text-fg/55">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-gold hover:underline">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
}
