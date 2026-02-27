import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

const ProtectedRoute = () => {
  const { session, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
