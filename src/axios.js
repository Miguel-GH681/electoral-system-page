import axios from 'axios';

const api = axios.create({
    baseURL: 'https://electoral-system.onrender.com/api',
    timeout: 10000
});


// Adjunta token automáticamente si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-token'] = token;
    }

    return config;
});


export default api;