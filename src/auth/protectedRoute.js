// src/components/ProtectedRoute.js
import {  Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";
import { LoaderCircle } from "lucide-react";

const ProtectedRoute = ({ permission }) => {
    const { isAuthenticated, permissions,isAdmin, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading ) {
        return <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999, // Ensure it's on top
            }}
        >
              <LoaderCircle className="h-12 w-12 animate-spin " />
        </div>
    }
     
     if (!isAuthenticated) {
        return <Navigate to="login" replace />;
    }

    if (!isAdmin && permission && !permissions.includes(permission)) {
       return <Navigate to="/404" replace />;
    }

    return <Outlet/> ;
};

export default ProtectedRoute;
