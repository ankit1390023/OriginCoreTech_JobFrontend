const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://212.95.51.83:5000/api';
import axios from 'axios';

export const userProfileApi = {  
    getUserDetailById: async (userId, token) => {
        try {
            const response = await axios.get(`${BASE_URL}/user-details/detail/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while fetching getUserDetailById", error);
            throw error;
        }
    },
    getUserDetailByEmail: async (data, token) => {
        try {
            const response = await axios.post(`${BASE_URL}/users/getUserData`, data,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while fetching getUserDetailByEmail", error);
            throw error;
        }
    },
    updateUserDetailById: async (userId, userData, token) => {
        try {
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
    getTermsAndConditions: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/user-details/getTermsAndCondition`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while fetching getTermsAndConditions", error);
            throw error;
        }
    },
    updateTermsAndConditions: async (data, token) => {
        try {
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
    updateAadharDetails: async (data, token) => {
        try {
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
    getAadharVerificationStatus: async (token) => {
        try {
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
    changeEmail: async (data, token) => {
        try {
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
    changePassword: async (data, token) => {
        try {
            const response = await axios.post(`${BASE_URL}/users/changePassword`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            console.log("Error while fetching changePassword", error);
            throw error;
        }
    },

    SoftDeleteAccount: async (data, token) => {
        try {
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
    
    IncrementViewCountOfJobPost: async (data, token) => {
        try {
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
    },
   
}