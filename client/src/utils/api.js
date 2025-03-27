import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    withCredentials: true
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Authentication APIs
export const loginUser = async(credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const registerUser = async(userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const getUserProfile = async() => {
    const response = await api.get('/auth/profile');
    return response.data;
};

export const updateUserProfile = async(userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
};

export default api;