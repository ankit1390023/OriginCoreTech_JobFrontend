import axios from 'axios';


const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

//Api service function for job get

export const jobGetApi = {
    //Get all jobs
    getAllJobs: async () => {
        try {
            const token = getToken();
            const response = await axios.get(`${BASE_URL}/opportunities`,
                {
                    headers: {
                    'Authorization':`Bearer ${token}`
                }
                });
            console.log("response.data from getAllJobs", response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    //Get By By ID
    getJobById: async () => {
        try {
            const token = getToken();
            const response = await axios.get(`${BASE_URL}/jobdetails/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log("response.data from getJobById", response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
