import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

// Helper function to get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// API service functions for company recruiter profile
export const recruiterApi = {
    // Create a new company recruiter profile
    createProfile: async (profileData) => {
        try {
            const token = getToken();
            const response = await axios.post(`${BASE_URL}/company-recruiter/profile`, profileData, {
                headers: {  
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get company recruiter profile
    getProfile: async () => {
        try {
            const token = getToken();
            const response = await axios.get(`${BASE_URL}/company-recruiter/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update company recruiter profile
    updateProfile: async (profileData) => {
        try {
            const token = getToken();
            const response = await axios.put(`${BASE_URL}/company-recruiter/profile`, profileData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get job posts by recruiter
    getJobPostsByRecruiter: async () => {
        try {
            const token = getToken();
            const response = await axios.get(`${BASE_URL}/company-recruiter/jobpost/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 