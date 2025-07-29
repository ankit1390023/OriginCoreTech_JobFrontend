import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://212.95.51.83:5000/api';

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
   
    /**
     * Fetches public user details by userId.
     * @param {string} userId - The ID of the user whose details are to be fetched.
     * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
     */
    
    getUserDetails: async (userId) => {
        if (!userId) {
            return { success: false, error: 'User ID is required.' };
        }
        try {
            const response = await axios.get(`${BASE_URL}/user-details/public-profile/${userId}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching user details:', error);
            return {
                success: false,
                error: error?.response?.data?.message || error.message || 'Unknown error occurred'
            };
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