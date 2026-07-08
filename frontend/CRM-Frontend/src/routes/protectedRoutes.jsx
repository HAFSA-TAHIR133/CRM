import { Outlet,Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/authContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuthContext();
    console.log("loading:", loading);
    console.log("isAuthenticated:", isAuthenticated);

    if (loading) {
        return <div className="protected-route-loading">Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;