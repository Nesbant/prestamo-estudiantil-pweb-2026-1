import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

export default function ProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to='/auth' replace />;
  }

  return <Outlet />;
}
