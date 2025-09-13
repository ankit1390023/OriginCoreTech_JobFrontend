import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const universityApi={
    createUniversityProfile: async (data, token) => {
        try {
            const response = await axios.post(`${BASE_URL}/universitydetail`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating university profile:', error);
            throw error;
        }
    },
    getUniversityDetailsById: async (univeristy_id, token) => {
        try {
            const response = await axios.get(`${BASE_URL}/universitydetail/${univeristy_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while fetching getUniversityDetailsById", error);
            throw error;
        }
    },
    updateUniversityDetails: async (data, token) => {
        try {
            const response = await axios.put(`${BASE_URL}/universitydetail`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error while fetching updateUniversityDetailsById", error);
            throw error;
        }
    },
    getUniversityPublicProfileById: async (user_id, token) => {
        try {
            const response = await axios.get(`${BASE_URL}/university/${user_id}`, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization':`Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error while fetching getUniversityPublicProfileById", error);
            throw error;
        }
    }
}

