import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create axios instance with auth header
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API service functions for job posting
export const jobPostApi = {
    // Create a new job post
    createJobPost: async (jobPostData) => {
        try {
            const response = await apiClient.post('/jobpost/create', jobPostData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get all domains (for skills suggestions)
    getAllDomains: async () => {
        try {
            const response = await apiClient.get('/domain/all');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get job posts by recruiter
    getJobPostsByRecruiter: async () => {
        try {
            const response = await apiClient.get('/company-recruiter-profile/jobpost/list');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get total job posts count by recruiter
    getTotalJobPostsCount: async () => {
        try {
            const response = await apiClient.get('/jobpost/totalcount');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}; 