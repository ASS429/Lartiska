import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

const LINKS = [
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/confidentialite', label: 'Confidentialité' },
  { to: '/cgu', label: 'CGU' },
  { to: '/cookies', label: 'Cookies' },
];

export function LegalLayout() {
  return (
    <div className="container-art py-16 md:py-20">
      <header className="max-w-3xl mb-10">
        <p className="eyebrow mb-3">— Informations légales</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight">
          Mentions, <em className="text-gold not-italic">confidentialité</em>, conditions.
        </h1>
      </header>

      <nav className="flex flex-wrap gap-2 mb-10 border-b border-line pb-6">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              clsx(
                'px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-all',
                isActive ? 'border-gold bg-gold/10 text-gold' : 'border-line text-fg/70 hover:text-gold hover:border-gold/60',
              )
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <article className="max-w-3xl prose-legal">
        <Outlet />
      </article>
    </div>
  );
}
