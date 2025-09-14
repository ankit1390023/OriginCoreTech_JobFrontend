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

  getDashboardStats: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/company-recruiter/dashboardStats`,
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // { jobsPosted, pendingTasks, upcomingInterviews }
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

  //To manage applications
  getPipelineCandidates: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/company-recruiter/candidates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data; // returns { message, total, pipeline }
    } catch (error) {
      console.error("Error fetching pipeline candidates:", error);
      throw error;
    }
  },

  // Get AllUpcomingInterviews for the recruiter
  getAllUpcomingInterviews: async (token) => {
    if (!token) {
      throw new Error("No auth token provided");
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/interview-invitations/upcoming/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching all upcoming interviews:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};