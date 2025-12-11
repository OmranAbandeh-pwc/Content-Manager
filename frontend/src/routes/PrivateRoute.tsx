

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '..//hooks/useAuth';

interface PrivateRouteProps {
  roles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and save attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};