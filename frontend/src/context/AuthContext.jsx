import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('pizza-user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [isAdmin, setIsAdmin] = useState(() => {
        const storedUser = localStorage.getItem('pizza-user');
        return storedUser ? JSON.parse(storedUser).isAdmin : false;
    });

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            setIsAdmin(data.isAdmin);
            localStorage.setItem('pizza-user', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/signup', { name, email, password });
            setUser(data);
            setIsAdmin(data.isAdmin);
            localStorage.setItem('pizza-user', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('pizza-user');
    };

    const value = React.useMemo(() => ({
        user,
        isAdmin,
        login,
        signup,
        logout
    }), [user, isAdmin]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
