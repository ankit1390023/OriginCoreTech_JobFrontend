import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
// API service functions for skill uploads
export const skillApi = {
    // Upload skill certificates
    uploadSkills: async (user_id, skills, certificateFiles, token) => {
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

            const response = await axios.post(`${BASE_URL}/upload-skill`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
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
    getUserSkills: async (userId, token) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/user-skills/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user skills:', error);
            throw error;
        }
    },

    // Get certificate file URL
    getCertificateUrl: (certificatePath) => {
        if (!certificatePath) return null;
        return `${BASE_URL}${certificatePath}`;
    }
}; 