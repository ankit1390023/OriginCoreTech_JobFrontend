import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for company recruiter profile
export const recruiterApi = {

  // Create a new company recruiter profile
  createProfile: async (profileData, token) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/company-recruiter/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get company recruiter profile
  getProfile: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/company-recruiter/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data from getProfile", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update company recruiter profile
  updateProfile: async (profileData, token) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/company-recruiter/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get job posts by recruiter
  getJobPostsByRecruiter: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/company-recruiter/jobpost/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};