import { useAuth } from "./authContext.js";

export const ButtonPermission = ({ permission, children }) => {
    const hasPermission = usePermission();
    return hasPermission(permission) ? children : null;
};

export const usePermission = () => {
    const { permissions,isAdmin } = useAuth();

    return (permission) => Boolean(isAdmin) ? true : permissions?.includes(permission) ?? false;
};