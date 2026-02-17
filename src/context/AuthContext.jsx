import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedSession = localStorage.getItem('gramai_session');
        if (savedSession) {
            const sessionData = JSON.parse(savedSession);
            const loginTime = new Date(sessionData.lastLogin).getTime();
            const currentTime = new Date().getTime();

            // Auto logout after 1 hour of simulated inactivity
            if (currentTime - loginTime > 3600000) {
                logout();
            } else {
                setUser(sessionData);
            }
        }
        setLoading(false);
    }, []);

    const login = async (role, phone, name) => {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockUser = {
            id: `u_${Math.random().toString(36).substr(2, 5)}`,
            name: name || (role === 'admin' ? 'System Admin' : 'Rajesh Farmer'),
            role: role,
            phone: phone,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Mock JWT
            lastLogin: new Date().toISOString(),
        };

        setUser(mockUser);
        localStorage.setItem('gramai_session', JSON.stringify(mockUser));
        setLoading(false);
        return mockUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gramai_session');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, role: user?.role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
