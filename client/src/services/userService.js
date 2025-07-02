import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5001/api/users';

const getAuthHeaders = () => {
    const user = authService.getCurrentUser();
    return {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    };
};

const userService = {
    getAll: async () => {
        const res = await axios.get(API_URL, getAuthHeaders());
        return res.data.data;
    },
    create: async (data) => {
        const res = await axios.post(API_URL, data, getAuthHeaders());
        return res.data.data;
    },
    update: async (id, data) => {
        const res = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
        return res.data.data;
    },
    remove: async (id) => {
        const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return res.data.data;
    },
    get: async (id) => {
        const res = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return res.data.data;
    }
};

export default userService; 