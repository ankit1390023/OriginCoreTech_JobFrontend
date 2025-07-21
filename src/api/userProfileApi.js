const BASE_URL = import.meta.env.VITE_API_URL;
import axios from 'axios';

const getToken = () => localStorage.getItem('token');

const userProfileApi = {
    getUserDetailById: async (userId) => {
        try {
            const token = getToken();
            const response = await axios.get(`${BASE_URL}/user-details/detail/${userId}`)
            return response.data;
        } catch (error) {
            console.log("Error while fetching getUserDetailById", error);
            throw error;
        }
    },
    updateUserDetailById: async (userId, userData) => {
        try {
            const token = getToken();
            const response = await axios.put(`${BASE_URL}/user-details/detail/${userId}`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while fetching updateUserDetailById", error);
            throw error;
        }
    },
    getTermsAndConditions: async () => {
        try {
            const token = getToken();
            const response = await axios.get(`${BASE_URL}/user-details/getTermsAndCondition`)
            return response.data;
        } catch (error) {
            console.log("Error while fetching getTermsAndConditions", error);
            throw error;
        }
    },
    updateTermsAndConditions: async (data) => {
        try {
            const token = getToken();
            const response = await axios.post(`${BASE_URL}/user-details/updateTermsAndCondition`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while fetching updateTermsAndConditons", error);
            throw error;
        }
    },
    updateAadharDetails: async (data) => {
        try {
            const token = getToken();
            const response = await axios.put(`${BASE_URL}/user-details/updateAadhaarDetails`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error while fetching updateAadharDetails", error);
            throw error;
        }
    },
    getAadharVerificationStatus: async () => {
        try {
            const token = getToken();
            const response = await axios.get(`${BASE_URL}/user-details/aadhaarVerificationStatus`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while fetching getAadharVerificationStatus", error);
            throw error;
        }
    },
    changeEmail: async (data) => {
        try {
            const token = getToken();
            const response = await axios.post(`${BASE_URL}/users/changeEmail`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while fetching changeEmail", error);
            throw error;
        }
    },
    SoftDeleteAccount: async (data) => {
        try {
            const token = getToken();
            const response = await axios.post(`${BASE_URL}/users/softDeleteAccount`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while  SoftDeleteAccount", error);
            throw error;
        }
    },
    IncrementViewCountOfJobPost: async (data) => {
        try {
            const token = getToken();
            const response = await axios.post(`${BASE_URL}/company-recruiter/jobpost/1/increment-view`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while fetching IncrementViewCountOfJobPost", error);
            throw error;
        }
    }
}