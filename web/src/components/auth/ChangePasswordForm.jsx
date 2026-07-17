import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updatePassword } from '@/api/endpoints';

const EMPTY = { current_password: '', password: '', password_confirmation: '' };

/**
 * Formulaire « changer mon mot de passe » — utilisé par l'espace client
 * (Account) et l'espace admin (Réglages). Exige le mot de passe actuel ;
 * le backend révoque toutes les autres sessions après changement.
 */
export function ChangePasswordForm() {
  const [form, setForm] = useState(EMPTY);

  const mutation = useMutation({
    mutationFn: () => updatePassword(form),
    onSuccess: () => setForm(EMPTY),
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const errors = mutation.error?.response?.data?.errors || {};

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
      className="surface-card p-6 md:p-7 space-y-4 max-w-xl"
    >
      <header>
        <h2 className="font-serif text-2xl">Changer mon mot de passe</h2>
        <p className="text-xs text-fg/60 mt-2 leading-relaxed">
          Minimum 10 caractères, avec lettres et chiffres. Vos autres appareils
          connectés seront déconnectés par sécurité.
        </p>
      </header>

      {mutation.isSuccess && (
        <p className="text-gold text-sm border border-gold/40 bg-gold/10 px-4 py-3 rounded-xl">
          ✓ {mutation.data?.message || 'Mot de passe modifié.'}
        </p>
      )}

      <label className="block">
        <span className="text-xs uppercase tracking-widest text-fg/60">Mot de passe actuel</span>
        <input
          type="password"
          value={form.current_password}
          onChange={set('current_password')}
          autoComplete="current-password"
          required
          className="lartiska-input mt-1.5"
        />
        {errors.current_password && <p className="text-rust text-xs mt-1.5">{errors.current_password[0]}</p>}
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-widest text-fg/60">Nouveau mot de passe</span>
        <input
          type="password"
          value={form.password}
          onChange={set('password')}
          autoComplete="new-password"
          required
          minLength={10}
          className="lartiska-input mt-1.5"
        />
        {errors.password && <p className="text-rust text-xs mt-1.5">{errors.password[0]}</p>}
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-widest text-fg/60">Confirmer le nouveau mot de passe</span>
        <input
          type="password"
          value={form.password_confirmation}
          onChange={set('password_confirmation')}
          autoComplete="new-password"
          required
          minLength={10}
          className="lartiska-input mt-1.5"
        />
      </label>

      {mutation.isError && !Object.keys(errors).length && (
        <p className="text-rust text-sm">Une erreur est survenue. Réessayez.</p>
      )}

      <div className="pt-1">
        <button type="submit" className="btn-gold !py-2.5 !px-6 text-xs" disabled={mutation.isPending}>
          {mutation.isPending ? 'Enregistrement…' : 'Mettre à jour'}
        </button>
      </div>
    </form>
  );
}
