import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext, useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role-based access if roles are specified
    if (roles && roles.length > 0) {
        if (!roles.includes(user?.role)) {
            // Redirect to unauthorized page or dashboard
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

export default PrivateRoute;