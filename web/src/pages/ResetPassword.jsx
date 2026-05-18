import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Seo } from '@/hooks/useSeo';

/**
 * Page atterrissage du lien de reset envoyé par email.
 * URL : /reset-password?token=XXX&email=YYY
 *
 * Endpoint : POST /api/auth/password/reset { token, email, password, password_confirmation }
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const redirectAfter = searchParams.get('redirect') || '/account';

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      apiClient.post('/auth/password/reset', {
        token,
        email,
        password,
        password_confirmation: passwordConfirm,
      }).then((r) => r.data),
    onSuccess: () => {
      // Après reset, on redirige vers login en gardant email + redirect
      setTimeout(() => {
        const params = new URLSearchParams({ email, redirect: redirectAfter });
        navigate(`/login?${params.toString()}`, { replace: true });
      }, 2000);
    },
  });

  // Cas où le lien est incomplet
  if (!token || !email) {
    return (
      <div className="container-art py-16 md:py-24 max-w-md text-center">
        <Seo title="Lien invalide" path="/reset-password" />
        <p className="eyebrow mb-4">— Lien invalide</p>
        <h1 className="font-serif text-3xl md:text-4xl font-light mb-4">
          Ce lien est <em className="gold-em">incomplet</em>.
        </h1>
        <p className="text-fg/75 text-sm mb-6">
          Le lien de réinitialisation est invalide ou incomplet. Demandez-en un nouveau.
        </p>
        <Link to="/forgot-password" className="btn-gold">Demander un nouveau lien</Link>
      </div>
    );
  }

  return (
    <div className="container-art py-16 md:py-24 max-w-md">
      <Seo title="Réinitialiser le mot de passe" path="/reset-password" />

      <header className="mb-10 text-center">
        <p className="eyebrow mb-4">— Nouveau mot de passe</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">
          Choisissez un <em className="gold-em">nouveau</em> mot de passe.
        </h1>
        <p className="mt-4 text-fg/75 text-sm">
          Pour le compte : <span className="font-mono text-gold">{email}</span>
        </p>
      </header>

      {mutation.isSuccess ? (
        <div className="surface-card p-8 text-center space-y-4">
          <p className="text-4xl">✨</p>
          <h2 className="font-serif text-2xl">Mot de passe mis à jour</h2>
          <p className="text-fg/80 text-sm leading-relaxed">
            Redirection vers la connexion…
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="surface-card p-7 md:p-9 space-y-5"
        >
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-fg/60">Nouveau mot de passe (min. 8)</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="lartiska-input mt-2"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-fg/60">Confirmer</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="lartiska-input mt-2"
            />
          </label>

          {mutation.isError && (
            <p className="text-rust text-sm border border-rust/40 bg-rust/10 px-4 py-3 rounded-xl">
              {mutation.error?.response?.data?.message
                || mutation.error?.response?.data?.errors?.email?.[0]
                || 'Le lien est invalide ou expiré. Demandez-en un nouveau.'}
            </p>
          )}

          <button type="submit" className="btn-gold w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Mise à jour…' : 'Définir le mot de passe'}
          </button>

          <p className="text-center text-xs text-fg/65">
            <Link to="/login" className="text-gold hover:underline font-semibold">
              ← Retour à la connexion
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
