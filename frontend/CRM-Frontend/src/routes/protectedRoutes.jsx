import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/context/authContext'; 

const ProtectedRoute = ({ allowedRoles }) => {
  // Use your custom hook safely here!
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500 animate-pulse">Verifying credentials...</p>
      </div>
    );
  }

  const activeUser = user || JSON.parse(localStorage.getItem('user'));
  const activeRole = activeUser?.role?.toLowerCase() || localStorage.getItem('role');

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(activeRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;