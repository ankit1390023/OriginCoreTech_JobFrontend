import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for job posting
export const jobPostApi = {
    // Create a new job post
    createJobPost: async (jobPostData, token) => {
        try {
            const response = await axios.post(`${BASE_URL}/jobpost/create`, jobPostData, {
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

    // Get all domains (for skills suggestions)
    getAllDomains: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/domain/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get job posts by recruiter
    getJobPostsByRecruiter: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/company-recruiter-profile/jobpost/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get total job posts count by recruiter
    getTotalJobPostsCount: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/jobpost/totalcount`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}; 