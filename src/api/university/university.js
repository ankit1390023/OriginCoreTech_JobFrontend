import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createUniversityProfile = async (data, token) => {
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
}
    

