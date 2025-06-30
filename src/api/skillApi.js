import axios from 'axios';
const SKILL_BASE_URL = 'http://212.95.51.83:3000';

// API service functions for skill uploads
export const skillApi = {
    // Upload skill certificates
    uploadSkills: async (user_id, skills, certificateFiles) => {
        try {
            const formData = new FormData();

            // Add user_id
            formData.append('user_id', user_id);

            // Add skills array as JSON string
            formData.append('skills', JSON.stringify(skills));

            // Add certificate files
            certificateFiles.forEach((file, index) => {
                if (file) {
                    formData.append(`certificate_image_${index}`, file);
                }
            });

            const response = await axios.post(`${SKILL_BASE_URL}/upload-skill`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading skills:', error);
            throw error;
        }
    },

    // Get skills for a user
    getUserSkills: async (userId) => {
        try {
            const response = await axios.get(`${SKILL_BASE_URL}/user-skills/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user skills:', error);
            throw error;
        }
    }
}; 