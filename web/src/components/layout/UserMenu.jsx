import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export function UserMenu() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/', { replace: true });
  };

  if (!user) return null;

  const initials = user.name
    ?.split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '·';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-line hover:border-gold transition-colors"
      >
        <span className="w-8 h-8 grid place-items-center rounded-full bg-gold/15 text-gold text-xs font-semibold">
          {initials}
        </span>
        <span className="hidden sm:inline text-xs uppercase tracking-widest text-fg/75">
          {user.role === 'admin' ? 'Admin' : 'Compte'}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 surface-card overflow-hidden text-sm">
          <div className="px-4 py-3 border-b border-line">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-xs text-fg/55 truncate">{user.email}</p>
          </div>
          <Link
            to={user.role === 'admin' ? '/admin' : '/account'}
            onClick={() => setOpen(false)}
            className="block px-4 py-3 hover:bg-ink-soft/60 transition-colors"
          >
            {user.role === 'admin' ? 'Tableau de bord' : 'Mon espace'}
          </Link>
          {user.role === 'admin' && (
            <>
              <Link to="/admin/quotes" onClick={() => setOpen(false)} className="block px-4 py-3 hover:bg-ink-soft/60 transition-colors">
                Devis
              </Link>
              <Link to="/admin/messages" onClick={() => setOpen(false)} className="block px-4 py-3 hover:bg-ink-soft/60 transition-colors">
                Messages
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 border-t border-line text-rust hover:bg-rust/10 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
