import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5001/api/ventas';

const getAuthHeaders = () => {
    const user = authService.getCurrentUser();
    return {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    };
};

const ventaService = {
    getAll: async () => {
        const res = await axios.get(API_URL, getAuthHeaders());
        return res.data.data;
    },
    get: async (id) => {
        const res = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
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
    getResumen: async () => {
        const res = await axios.get(`${API_URL}/resumen`, getAuthHeaders());
        return res.data.data;
    },
    getVentasPorMes: async () => {
        const res = await axios.get(`${API_URL}/por-mes`, getAuthHeaders());
        return res.data.data || res.data;
    },
    getVentasPorCategoria: async () => {
        const res = await axios.get(`${API_URL}/por-categoria`, getAuthHeaders());
        return res.data.data || res.data;
    }
};

export default ventaService; 