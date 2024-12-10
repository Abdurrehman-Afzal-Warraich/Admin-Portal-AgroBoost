import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute; 