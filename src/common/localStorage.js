
import { jwtDecode } from "jwt-decode";

export const getStorage = async () => {
    const token = localStorage.getItem("token");
    if (!token)
        return { cid: null, uid: null, isAdmin: false, role: '' }

    const decoded = jwtDecode(token);
    return {
        cid: decoded.cid,
        uid: decoded.uid,
        isAdmin: Boolean(decoded.isadmin),
        role: decoded.role,
    }

};