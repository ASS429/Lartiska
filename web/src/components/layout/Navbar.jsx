import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth';
import { UserMenu } from './UserMenu';
import clsx from 'clsx';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, status, hydrate } = useAuthStore();

  useEffect(() => {
    if (status === 'idle') hydrate();
  }, [status, hydrate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-cinema',
        scrolled
          ? 'bg-bg/72 dark:bg-bg/72 backdrop-blur-xl border-b border-line'
          : 'bg-transparent',
      )}
    >
      <nav className="container-art flex items-center justify-between py-5">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Lartiska — accueil">
          <span className="logo-mark inline-block w-10 h-10 rounded-full overflow-hidden bg-white shrink-0">
            <img src="/lartiska-logo.jpg" alt="Lartiska" className="w-full h-full object-cover" />
          </span>
          <span className="font-serif text-2xl md:text-3xl tracking-tight">
            <span className="text-fg dark:text-fg">Lartis</span>
            <span className="text-gold italic">Ka</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-9 text-sm font-medium">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'transition-colors duration-300 hover:text-gold',
                    isActive ? 'text-gold' : 'text-fg/85',
                  )
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label="Basculer le thème"
            className="w-10 h-10 grid place-items-center rounded-full border border-line text-fg hover:text-gold hover:border-gold transition-all duration-300"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" /><path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" /><path d="M20 12h2" />
                <path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {user ? (
            <div className="hidden md:block"><UserMenu /></div>
          ) : (
            <>
              <Link to="/login" className="hidden md:inline-flex text-xs uppercase tracking-widest text-fg/75 hover:text-gold transition-colors px-2">
                Connexion
              </Link>
              <Link to="/devis" className="hidden md:inline-flex btn-gold !py-2.5 !px-5 text-xs">
                Devis
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            className="md:hidden w-10 h-10 grid place-items-center rounded-full border border-line text-fg"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-bg/95 backdrop-blur-xl border-t border-line">
          <ul className="container-art py-6 flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'block py-2 text-lg font-serif',
                      isActive ? 'text-gold' : 'text-fg',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/devis" onClick={() => setOpen(false)} className="btn-gold mt-3">
                Demander un devis
              </Link>
            </li>
            <li className="border-t border-line pt-4 mt-2">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/account'}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm uppercase tracking-widest text-gold"
                >
                  {user.role === 'admin' ? 'Tableau de bord admin' : 'Mon espace'}
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm uppercase tracking-widest text-fg/75 hover:text-gold"
                >
                  Connexion
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
