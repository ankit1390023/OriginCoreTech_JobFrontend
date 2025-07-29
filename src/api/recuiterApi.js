import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for company recruiter profile
export const recruiterApi = {
    // Create recruiter profile with file upload support(new )
    createProfileWithFileUpload: async (profileData, token) => {
        try {
            //create formData with multipart upload
            const formData = new FormData();

            // Add text fields
            formData.append('designation', profileData.designation);
            formData.append('companyName', profileData.companyName);
            formData.append('industry', profileData.industry);
            formData.append('location', profileData.location);
            formData.append('about', profileData.about);
            formData.append('hiringPreferences', profileData.hiringPreferences || '');
            formData.append('languagesKnown', profileData.languagesKnown || '');
            formData.append('isEmailVerified', profileData.isEmailVerified);
            formData.append('isPhoneVerified', profileData.isPhoneVerified);
            formData.append('isGstVerified', profileData.isGstVerified);

            console.log("profileData from recruiterApi", profileData.logoPic);
            // Add files if they exist
            if (profileData.logoUrl && profileData?.logoUrl[0]) {
                formData.append("logoUrl", profileData?.logoUrl[0]);
            }
            if (profileData.profilePic && profileData?.profilePic[0]) {
                formData.append("profilePic", profileData?.profilePic[0]);
            }
            console.log("formData", formData)
            const response = await axios.post(`${BASE_URL}/company-recruiter/profile/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("response from createProfileWithFileUpload", response.data);
            return response.data;
        } catch (error) {
            console.log("error while cretaProfileWithFileUpload from recruiterApi")
            throw error;
        }
    },

    // Create a new company recruiter profile
    createProfile: async (profileData, token) => {
        try {
            // Create FormData for multipart upload
            const formData = new FormData();

            // Add text fields
            formData.append('designation', profileData.designation);
            formData.append('companyName', profileData.companyName);
            formData.append('industry', profileData.industry);
            formData.append('location', profileData.location);
            formData.append('about', profileData.about);
            formData.append('hiringPreferences', profileData.hiringPreferences || '');
            formData.append('languagesKnown', profileData.languagesKnown || '');
            formData.append('isEmailVerified', profileData.isEmailVerified);
            formData.append('isPhoneVerified', profileData.isPhoneVerified);
            formData.append('isGstVerified', profileData.isGstVerified);

            // Add files if they exist
            if (profileData.logoUrl && profileData.logoUrl instanceof File) {
                formData.append('logoUrl', profileData.logoUrl);
            }
            if (profileData.profilePic && profileData.profilePic instanceof File) {
                formData.append('profilePic', profileData.profilePic);
            }

            const response = await axios.post(`${BASE_URL}/company-recruiter/profile`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Don't set Content-Type - let browser set it with boundary for multipart
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get company recruiter profile
    getProfile: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/company-recruiter/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("response.data from getProfile", response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update company recruiter profile
    updateProfile: async (profileData, token) => {
        try {
            // Create FormData for multipart upload
            const formData = new FormData();

            // Add text fields
            formData.append('designation', profileData.designation);
            formData.append('companyName', profileData.companyName);
            formData.append('industry', profileData.industry);
            formData.append('location', profileData.location);
            formData.append('about', profileData.about);
            formData.append('hiringPreferences', profileData.hiringPreferences || '');
            formData.append('languagesKnown', profileData.languagesKnown || '');
            formData.append('isEmailVerified', profileData.isEmailVerified);
            formData.append('isPhoneVerified', profileData.isPhoneVerified);
            formData.append('isGstVerified', profileData.isGstVerified);

            // Add files if they exist
            if (profileData.logo && profileData.logo instanceof File) {
                formData.append('logo', profileData.logo);
            }
            if (profileData.profilePic && profileData.profilePic instanceof File) {
                formData.append('profilePic', profileData.profilePic);
            }

            const response = await axios.put(`${BASE_URL}/company-recruiter/profile`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Don't set Content-Type - let browser set it with boundary for multipart
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get job posts by recruiter
    getJobPostsByRecruiter: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/company-recruiter/jobpost/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 