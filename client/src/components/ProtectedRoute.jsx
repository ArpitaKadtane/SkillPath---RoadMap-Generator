import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-slate-600 shadow-sm">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
