// src/api/masterDataApi.js
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const masterDataApi = {
    // Get all master data in one request
    getAllMasterData: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/master/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.data; // Assuming your backend returns { data: {...} }
        } catch (error) {
            console.error('Error fetching master data:', error);
            throw error;
        }
    }
};