import React, { createContext, useState, useEffect } from 'react';
import api from '../axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';


interface AuthContextType {
    user: any;
    loading: boolean;
    login: (membershipNumber: string, dpi: string, birthdate: string, password: string) => Promise<{ ok: boolean, msg: any }>;
    logout: () => void;
    isAuthenticated: () => boolean;
    register: (membership_number: string, full_name: string, email: string, dpi: string, birthdate: string, password: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children } : any) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    const register = async (membership_number : string, full_name : string, email : string, dpi : string, birthdate : string, password : string) =>{        
        const resp = await api.post('/users', {membership_number, full_name, email, dpi, birthdate: formatDateForBackend(birthdate), password, role_id: 2});
        if(resp.data && resp.data.ok){            
            return true
        } else{
            return false
        }
    }

    const login = async (membershipNumber : string, dpi : string, birthdate : string, password : string) => {
        
        const resp = await api.post('/users/login', { membership_number: membershipNumber, dpi, birthdate: formatDateForBackend(birthdate), password });        
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

    function formatDateForBackend(inputDate: any) {
        dayjs.extend(customParseFormat);
        const date = dayjs(inputDate, ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'], true);

        if (!date.isValid()) {
            throw new Error('Fecha inválida');
        }

        return date.format('YYYY-MM-DD');
    }


    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, register }}>
            {children}
        </AuthContext.Provider>
    );
};