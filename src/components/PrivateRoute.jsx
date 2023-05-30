import React, { useContext } from 'react';
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const { user } = useContext(AuthContext);
    return user ? (
        <>
            <Outlet />
        </>
    ) : (
        <Navigate to="/asistencias-admin/login" />
    );
}

export default PrivateRoute;