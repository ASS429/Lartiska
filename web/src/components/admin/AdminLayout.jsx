import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import clsx from 'clsx';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true, icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
  ) },
  { to: '/admin/projects', label: 'Portfolio', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="14" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
  ) },
  { to: '/admin/services', label: 'Services', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  ) },
  { to: '/admin/testimonials', label: 'Avis clients', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  ) },
  { to: '/admin/quotes', label: 'Devis', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6" /><path d="M9 17h6" /></svg>
  ) },
  { to: '/admin/messages', label: 'Messages', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
  ) },
  { to: '/admin/settings', label: 'Réglages', icon: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ) },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-bg text-fg">
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-line bg-ink-soft/40 flex-col">
        <div className="p-6 border-b border-line">
          <Link to="/" className="font-serif text-2xl">
            <span className="text-fg">Lartis</span><span className="text-gold italic">Ka</span>
          </Link>
          <p className="text-xs uppercase tracking-widest text-fg/45 mt-1">Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300',
                  isActive
                    ? 'bg-gold/15 text-gold border border-gold/30'
                    : 'text-fg/75 hover:text-gold hover:bg-ink-soft/60 border border-transparent',
                )
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-line">
          <p className="text-xs text-fg/55 mb-1">Connecté en tant que</p>
          <p className="font-serif text-sm">{user?.name}</p>
          <p className="text-xs text-fg/55 mb-3">{user?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-xs uppercase tracking-widest border border-line py-2.5 rounded-full text-fg/75 hover:text-rust hover:border-rust transition-all duration-300"
          >
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-10 bg-bg/80 backdrop-blur-xl border-b border-line px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl">
            <span>Lartis</span><span className="text-gold italic">Ka</span>
            <span className="ml-2 text-xs uppercase tracking-widest text-fg/45">Admin</span>
          </Link>
          <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-fg/65">
            Déconnexion
          </button>
        </header>

        <nav className="lg:hidden flex gap-2 overflow-x-auto px-4 py-3 border-b border-line">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'shrink-0 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border transition-all',
                  isActive ? 'border-gold text-gold bg-gold/10' : 'border-line text-fg/60',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
