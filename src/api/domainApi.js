import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for domain data
export const domainApi = {
    // Fetch all skills (areas of interest) from backend
    getAllDomains: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/domain/all`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.domains || [];
        } catch (error) {
            console.error('Error fetching domains:', error);
            throw error;
        }
    },

    // Fetch skills by domain from backend
    getSkillsByDomain: async (domainName) => {
        console.log(domainName);
        try {
            const response = await axios.get(`${BASE_URL}/skills/by-domain/${domainName}`);
            return response.data.skills || [];
        } catch (error) {
            console.error('Error fetching skills by domain:', error);
            throw error;
        }
    }
}; 