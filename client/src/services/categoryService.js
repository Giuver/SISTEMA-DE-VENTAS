import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5001/api/categories';

const getAuthHeaders = () => {
    const user = authService.getCurrentUser();
    return {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    };
};

const categoryService = {
    getAll: async () => {
        const res = await axios.get(API_URL, getAuthHeaders());
        return res.data.data;
    },
    create: async (nombre) => {
        const res = await axios.post(API_URL, { nombre }, getAuthHeaders());
        return res.data.data;
    },
    remove: async (id) => {
        const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return res.data.data;
    },
    getProducts: async (categoryId) => {
        const res = await axios.get(`${API_URL}/${categoryId}/productos`, getAuthHeaders());
        return res.data.data;
    },
    addProduct: async (categoryId, data) => {
        const res = await axios.post(`${API_URL}/${categoryId}/productos`, data, getAuthHeaders());
        return res.data.data;
    },
    removeProduct: async (categoryId, productId) => {
        const res = await axios.delete(`${API_URL}/${categoryId}/productos/${productId}`, getAuthHeaders());
        return res.data.data;
    }
};

export default categoryService; 