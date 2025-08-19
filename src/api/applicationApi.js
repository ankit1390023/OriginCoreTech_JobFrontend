import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const applicationApi = {
    applyForJob: async (jobId, applicationData, token) => {
        try {
            // Validate required fields before making the request
            const requiredFields = ['name', 'email', 'resume'];
            for (const field of requiredFields) {
                if (!applicationData[field]) {
                    return {
                        success: false,
                        message: `Missing required field: ${field}`
                    };
                }
            }

            // Construct request payload
            const requestData = {
                ...applicationData,
                jobId
            };

            const apiUrl = `${BASE_URL}/jobpost/apply/${jobId}`;
            console.log('API URL:', apiUrl);
            console.log('Request data:', requestData);

            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            return response.data;
        } catch (error) {
            console.error('Application error:', error);
            if (error.response?.data) {
                return error.response.data;
            }
            return {
                success: false,
                message: 'Something went wrong. Please try again.'
            };
        }
    }
};
