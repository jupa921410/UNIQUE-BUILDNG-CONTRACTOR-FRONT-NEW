import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePortalAuth } from '../../context/PortalAuthContext';
import PortalLayout from './PortalLayout';

/**
 * Wraps every authenticated /portal/* route: redirects to login (preserving
 * the intended destination) while unauthenticated, shows a loading state
 * while the token is being verified, and renders the portal chrome otherwise.
 */
export default function PortalRoute() {
  const { isAuthenticated, loading } = usePortalAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="portal-boot-loader" role="status" aria-live="polite">
        <span className="portal-boot-spinner" />
        <p>Loading your portal…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <PortalLayout>
      <Outlet />
    </PortalLayout>
  );
}
