import { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export function RequireAuth({ role, children }) {
  const location = useLocation();
  const { user, status, hydrate } = useAuthStore();

  useEffect(() => {
    if (status === 'idle') {
      hydrate();
    }
  }, [status, hydrate]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="container-art py-32 text-center text-fg/55">
        Chargement…
      </div>
    );
  }

  if (status !== 'authenticated' || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/account'} replace />;
  }

  return children ?? <Outlet />;
}
