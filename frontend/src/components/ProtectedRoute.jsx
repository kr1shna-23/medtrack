import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

const ProtectedRoute = () => {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Checking your session...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
