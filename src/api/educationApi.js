import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for education data
export const educationApi = {
    //Fetch job role from backend
    getJobRoles: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/job-roles`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job roles:', error);
            throw error;
        }
    },
    // Fetch locations from backend
    getLocations: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/locations`);
            return response.data;
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    },

    // Fetch courses from backend
    getCourses: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/courses`);
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    // Fetch specializations from backend
    getSpecializations: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/specializations`);
            return response.data;
        } catch (error) {
            console.error('Error fetching specializations:', error);
            throw error;
        }
    },

    // Fetch colleges from backend
    getColleges: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/colleges`);
            return response.data;
        } catch (error) {
            console.error('Error fetching colleges:', error);
            throw error;
        }
    },

    // Fetch all education data at once
    getAllEducationData: async () => {
        try {
            const [jobRoles, locations, courses, specializations, colleges] = await Promise.all([
                educationApi.getJobRoles(),
                educationApi.getLocations(),
                educationApi.getCourses(),
                educationApi.getSpecializations(),
                educationApi.getColleges()
            ]);

            return {
                jobRoles,
                locations,
                courses,
                specializations,
                colleges
            };
        } catch (error) {
            console.error('Error fetching education data:', error);
            throw error;
        }
    }
}; 