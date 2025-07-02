import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    isAuthenticated: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user && user.token;
    }
};

export default authService; 