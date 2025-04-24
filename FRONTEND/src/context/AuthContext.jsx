import { createContext, useState, useContext } from 'react';
import { setAadhaarHeader } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [aadhaar, setAadhaar] = useState(localStorage.getItem('aadhaar'));

    const login = (aadhaarNumber) => {
        setAadhaar(aadhaarNumber);
        setAadhaarHeader(aadhaarNumber);
        localStorage.setItem('aadhaar', aadhaarNumber);
    };

    const logout = () => {
        setAadhaar(null);
        setAadhaarHeader(null);
        localStorage.removeItem('aadhaar');
    };

    return (
        <AuthContext.Provider value={{ aadhaar, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);