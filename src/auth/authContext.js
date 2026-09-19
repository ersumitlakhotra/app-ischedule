// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { loginAuth } from "../hook/apiCall";
import { jwtDecode } from "jwt-decode";
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';
import FetchData from "../hook/fetchData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    {/* const [allow, setAllow] = useState([
        "Appointment.Open", "Appointment.Create", "Appointment.Edit", "Appointment.View", "Appointment.Export",
        "Attendance.Open", "Attendance.Create", "Attendance.Edit", "Attendance.View", "Attendance.Export",
        "Category.Create", 
        "Calender.Open",
        "Customers.Open", "Customers.Create", "Customers.Edit", "Customers.View", "Customers.Export",
        "Dashboard.Open",
        "Discount.Open", "Discount.Create", "Discount.Edit", "Discount.View", "Discount.Export",
        "Employees.Open", "Employees.Create", "Employees.Edit", "Employees.View", "Employees.Export",
        "Inventory.Open", "Inventory.Create", "Inventory.Edit", "Inventory.View", "Inventory.Export",
        "Item.Create",  "Item.Edit", 
        "Payment.Open","Payment.Create", "Payment.Edit", 
        "Setting.Open", "Setting.Edit", 
        "Services.Open", "Services.Create", "Services.Edit", "Services.View", "Services.Export",
    ]);*/}

    // Load user from localStorage on refresh
    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {

        const token = localStorage.getItem("token");
        if (!token)
        {
            logout();
             return { status: false, message: "no token found" };
        }

        try {
            setIsLoading(true)
            const decoded = jwtDecode(token);
            if (decoded.expiresIn * 12000 < Date.now()) {
                return login(decoded.username, decoded.password);      
            }
            else {
                setIsAuthenticated(true);
                setIsAdmin(decoded.isadmin);
                setPermissions(decoded.permissions);
                return { status: true, message: "Token Valid" };
            }
        }
        catch (error) {
            logout();
            return { status: false, message: "no token found" };
        }
        finally {
            setIsLoading(false)
        }
    }

    const login = async (username, password) => {
        setIsLoading(true);

        try {
            const res = await loginAuth(username, password);

            const data = res.data.data;

            if (!Boolean(data.status)) {
                logout();
                return { status: false, message: data.message };
            }

            // Only save token after successful authentication
            localStorage.setItem('token', data.token);

            const decoded = jwtDecode(data.token);

            setIsAdmin(decoded.isadmin);
            setPermissions(decoded.permissions);
            setIsAuthenticated(true);

            return { status: true, message: data.message };

        } catch (err) {
            logout();
            return { status: false, message: String(err.message) };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setPermissions([]);
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    useEffect(() => {

        // Logout when token is removed from another tab
        const handleStorageChange = (event) => {
            if (event.key === "token" && !event.newValue) {
                logout();
            }
        };

        // Logout when API returns 401 in this tab
        const handleUnauthorized = () => {

           // const success = await refreshToken();

           // if (!Boolean(success.status)) {
                logout();
           // }
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("unauthorized", handleUnauthorized);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("unauthorized", handleUnauthorized);
        };

    }, [logout]);



    return (
        <AuthContext.Provider value={{ isAuthenticated, permissions, isAdmin, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
