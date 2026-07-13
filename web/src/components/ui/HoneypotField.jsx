/**
 * Champ honeypot anti-bot : invisible et inaccessible pour un humain
 * (hors écran, tabindex -1, autocomplete off, aria-hidden), mais rempli
 * par les bots qui complètent tous les champs. Le backend rejette
 * silencieusement toute soumission où "website" est non vide.
 */
export function HoneypotField({ value, onChange }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
    >
      <label>
        Ne pas remplir ce champ
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={onChange}
        />
      </label>
    </div>
  );
}
