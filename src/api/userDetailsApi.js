import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// API service functions for user details
export const userDetailsApi = {
    // Create user details
    createUserDetails: async (userData) => {
        try {
            const token = getToken();
            const response = await axios.post(`${BASE_URL}/user-details/detail`, userData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
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

    // Update user details by userId
    updateUserDetails: async (userId, userData) => {
        try {
            const token = getToken();
            const response = await axios.put(`${BASE_URL}/user-details/detail/${userId}`, userData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating user details:', error);
            throw error;
        }
    },

    // Check if user details exist
    checkUserDetailsExist: async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/user-details/detail/${userId}`);
            return { exists: true, data: response.data };
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return { exists: false, data: null };
            }
            throw error;
        }
    },

}; 