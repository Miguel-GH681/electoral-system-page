import axios from 'axios';

const api = axios.create({
    baseURL: 'https://electoral-system-backend.onrender.com/api',
    timeout: 10000
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-token'] = token;
    }

    return config;
});


export default api;