import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for education data
export const educationApi = {
    //Fetch job role from backend
    getJobRoles: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/job-roles`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching job roles:', error);
            throw error;
        }
    },
    // Fetch locations from backend
    getLocations: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/master/location`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("response", response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    },

    // Fetch courses from backend
    getCourses: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/master/courses`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("response", response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    // Fetch specializations from backend
    getSpecializations: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/master/specialization`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('specializations response', response.data);
            // Return the data array from the response
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching specializations:', error);
            throw error;
        }
    },

    // Fetch colleges from backend
    getColleges: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/master/school-college`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("colleges response", response.data);
            // Return the data array from the response
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching colleges:', error);
            throw error;
        }
    },

    // Fetch all education data at once
    getAllEducationData: async (token) => {
        try {
            const [jobRoles, locations, courses, specializations, colleges] = await Promise.all([
                educationApi.getJobRoles(token),
                educationApi.getLocations(token),
                educationApi.getCourses(token),
                educationApi.getSpecializations(token),
                educationApi.getColleges(token)
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