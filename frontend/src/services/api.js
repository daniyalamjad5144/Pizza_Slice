import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
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
