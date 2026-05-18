import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Seo } from '@/hooks/useSeo';

/**
 * Demande de réinitialisation du mot de passe.
 * Le backend envoie un email avec un lien de reset signé.
 * Endpoint : POST /api/auth/password/forgot { email }
 */
export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const prefilledEmail = searchParams.get('email') || '';
  const redirectParam = searchParams.get('redirect');

  const [email, setEmail] = useState(prefilledEmail);

  const mutation = useMutation({
    mutationFn: () => apiClient.post('/auth/password/forgot', { email }).then((r) => r.data),
  });

  const loginHref = `/login?${searchParams.toString()}`;

  return (
    <div className="container-art py-16 md:py-24 max-w-md">
      <Seo title="Mot de passe oublié" path="/forgot-password" />

      <header className="mb-10 text-center">
        <p className="eyebrow mb-4">— Mot de passe oublié</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light">
          On vous <em className="gold-em">renvoie</em> ça.
        </h1>
        <p className="mt-4 text-fg/75 text-sm leading-relaxed">
          Entrez l'email lié à votre compte Lartiska. Vous recevrez un lien
          sécurisé pour définir un nouveau mot de passe (valable 1 heure).
        </p>
      </header>

      {mutation.isSuccess ? (
        <div className="surface-card p-8 text-center space-y-4">
          <p className="text-4xl">✉️</p>
          <h2 className="font-serif text-2xl">Email envoyé</h2>
          <p className="text-fg/80 text-sm leading-relaxed">
            Si l'adresse <span className="font-mono text-gold">{email}</span> correspond à un compte,
            un lien de réinitialisation vient d'être envoyé. Vérifiez votre boîte (et vos spams).
          </p>
          <Link to={loginHref} className="btn-ghost inline-block mt-2">
            ← Retour à la connexion
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="surface-card p-7 md:p-9 space-y-5"
        >
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-fg/60">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lartiska-input mt-2"
              placeholder="nom@exemple.com"
            />
          </label>

          {mutation.isError && (
            <p className="text-rust text-sm border border-rust/40 bg-rust/10 px-4 py-3 rounded-xl">
              {mutation.error?.response?.data?.message
                || 'Impossible d\'envoyer le lien. Réessayez dans quelques minutes.'}
            </p>
          )}

          <button type="submit" className="btn-gold w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Envoi…' : 'Recevoir le lien'}
          </button>

          <p className="text-center text-xs text-fg/65">
            <Link to={loginHref} className="text-gold hover:underline font-semibold">
              ← Retour à la connexion
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
