import React, { createContext, useState, useEffect } from 'react';
import api from '../axios';

export const AuthContext = createContext(); //Investigar

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Al montar, intenta cargar sesión desde localStorage
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const parsed = JSON.parse(userStr);
                setUser(parsed);
            } catch (e) {
                console.error('Invalid user in localStorage', e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (membershipNumber, dpi, birthdate, password) => {
        
        const resp = await api.post('/login', { membership_number: membershipNumber, dpi, birthdate, password });        
        if (resp.data && resp.data.ok) {
            const token = resp.data.token;
            const userData = resp.data.msg;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { ok: true, msg: userData };
        }
        return { ok: false, msg: resp.data?.msg || 'Login failed' };
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const isAuthenticated = () => !!user;

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};