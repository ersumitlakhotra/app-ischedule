import { useEffect } from "react";
import { useAuth } from "../../auth/authContext";

const Logout = () => {
    const { logout } = useAuth();

    useEffect(()=>{
        logout();
    },[])
}
export default Logout