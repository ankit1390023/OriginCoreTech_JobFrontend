import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
// API service functions for skill uploads
export const skillApi = {
    // Upload skill certificates (two-step approach)
    uploadSkills: async (user_id, skills) => {
        try {
            // Send user_id and skills as JSON
            const payload = {
                user_id,
                skills
            };
            const response = await axios.post(`${BASE_URL}/upload-skill`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log("response.data from uploadSkills", response.data);
            return response.data;
        } catch (error) {
            console.error('Error uploading skills:', error);
            throw error;
        }
    },

    // Get skills for a user
    getUserSkills: async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/user-skills/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user skills:', error);
            throw error;
        }
    },
}; 