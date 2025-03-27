import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

// Export AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in local storage on initial load
        const token = localStorage.getItem('token');
        if (token) {
            validateToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    const validateToken = async (token) => {
        try {
            // Endpoint to validate token and get user details
            const response = await api.get('/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const userData = {
                ...response.data,
                token
            };

            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            // If token is invalid, clear local storage
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            // Store token in local storage
            localStorage.setItem('token', response.data.token);

            // Set user and authentication state
            const userData = {
                _id: response.data._id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role,
                token: response.data.token
            };

            setUser(userData);
            setIsAuthenticated(true);

            return userData;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            // Store token in local storage
            localStorage.setItem('token', response.data.token);

            // Set user and authentication state
            const registeredUser = {
                _id: response.data._id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role,
                token: response.data.token
            };

            setUser(registeredUser);
            setIsAuthenticated(true);

            return registeredUser;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        // Clear token from local storage
        localStorage.removeItem('token');

        // Reset user and authentication state
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/auth/profile', profileData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            // Update user in state, preserving token
            setUser(prev => ({
                ...prev,
                name: response.data.name,
                email: response.data.email,
                profile: response.data.profile
            }));

            return response.data;
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    };

    // Context value to be provided
    const contextValue = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};