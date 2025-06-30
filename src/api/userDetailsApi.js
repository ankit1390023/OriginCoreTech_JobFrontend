import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

// API service functions for user details
export const userDetailsApi = {
    // Create user details
    createUserDetails: async (userData) => {
        try {
            const response = await axios.post(`${BASE_URL}/user-details/detail`, userData);
            return response.data;
        } catch (error) {
            console.error('Error creating user details:', error);
            throw error;
        }
    },

    // Get user details by userId
    getUserDetails: async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/user-details/detail/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    },

}; 