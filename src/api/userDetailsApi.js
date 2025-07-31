import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://212.95.51.83:5000/api';

// API service functions for user details
export const userDetailsApi = {
    // Create user details
    createUserDetails: async (userData, token) => {
        try {
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
    updateUserDetails: async (userId, userData, token) => {
        try {
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

    // Unified method to fetch public user profile data
    getUserPublicProfile: async (userId, token = null, dataType = 'all') => {
        if (!userId) {
            return { success: false, error: 'User ID is required.' };
        }
        
        try {
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const response = await axios.get(`${BASE_URL}/user-details/public-profile/${userId}`, { headers });
            
            if (!response.data) {
                return { success: true, data: null };
            }
            
            // Return specific data type if requested
            switch (dataType) {
                case 'experiences':
                    return { 
                        success: true, 
                        data: response.data.experiences || [] 
                    };
                case 'education':
                    return { 
                        success: true, 
                        data: response.data.educations || [] 
                    };
                case 'skills':
                    return { 
                        success: true, 
                        data: response.data.skills || [] 
                    };
                case 'all':
                default:
                    return { 
                        success: true, 
                        data: response.data 
                    };
            }
        } catch (error) {
            console.error('Error fetching user public profile:', error);
            return {
                success: false,
                error: error?.response?.data?.message || error.message || 'Unknown error occurred'
            };
        }
    },

}; 