import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for job applications
export const applicationApi = {
    // Function to apply for a job
    applyForJob: async (jobId, applicationData, token) => {
        try {
            // Ensure jobId is included in the request body as well
            const requestData = {
                ...applicationData,
                jobId: jobId
            };
            
            // Log the complete URL for debugging
            const apiUrl = `${BASE_URL}/jobpost/apply/${jobId}`;
            console.log('API URL:', apiUrl);
            console.log('Request data:', requestData);
            
            const response = await axios.post(
                apiUrl,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Application error:', error);
            // Return error response from server if available
            if (error.response && error.response.data) {
                return error.response.data;
            }
            // Otherwise, return generic error
            return { success: false, message: 'Something went wrong. Please try again.' };
        }
    }
};