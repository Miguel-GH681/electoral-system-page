import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AppNavbar from './AppNavbar';

const ProtectedRoute = ({ children, allowedRole = null } : any) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole !== null && user.role_id !== allowedRole) {
        return <Navigate to="/home" replace />;
    }

    return <>
        <AppNavbar></AppNavbar>
        {
            children
        }
    </>;
};


export default ProtectedRoute;