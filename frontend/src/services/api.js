import axios from 'axios';

// Smart Base URL detection
const getBaseUrl = () => {
    // 1. If explicit env var is set, use it
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

    // 2. If valid window object (browser) and localhost, use local backend
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:5000/api';
    }

    // 3. Fallback for Replit/Production (Relative path works automatically)
    return '/api';
};

// Create an axios instance
const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include userId or token if needed in future
// For now, we manually handle passing userId in requests where needed.

// API Helper Methods (matching the previous mock interface where possible)
export default {
    get: async (url) => {
        // Special handling for orders/myorders to match backend route /orders/:userId
        if (url === '/orders/myorders') {
            const user = JSON.parse(localStorage.getItem('pizza-user'));
            if (!user || !user._id) throw new Error('User not found');
            return api.get(`/orders/${user._id}`);
        }
        return api.get(url);
    },
    post: async (url, data) => {
        // Special handling for orders to inject userId
        if (url === '/orders') {
            const user = JSON.parse(localStorage.getItem('pizza-user'));
            if (!user || !user._id) throw new Error('User not found');
            return api.post(url, { ...data, userId: user._id });
        }
        return api.post(url, data);
    },
    put: (url, data) => api.put(url, data),
    delete: (url) => api.delete(url)
};
