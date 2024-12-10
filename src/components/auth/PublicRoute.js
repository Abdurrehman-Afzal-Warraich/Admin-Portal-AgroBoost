import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function PublicRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (user && isAdmin) {
    // If user is logged in and is admin, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute; 