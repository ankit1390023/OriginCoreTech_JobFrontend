import axios from "axios";
const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://212.95.51.83:5000/api";

// API service functions for user details
export const userDetailsApi = {
  // Create user details
  createUserDetails: async (userData, token) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user-details/saveUserDetails`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating user details:", error);
      throw error;
    }
  },

  getUserDetails: async (user_id) => {
    if (!user_id) {
      return { success: false, error: "User ID is required." };
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/user-details/detail/${user_id}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching user details:", error);
      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Unknown error occurred",
      };
    }
  },

  // Update user details by user_id
  updateUserDetails: async (user_id, userData, token) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/user-details/detail/${user_id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user details:", error);
      throw error;
    }
  },

  // Unified method to fetch public user profile data
  getUserPublicProfile: async (user_id, token = null, dataType = "all") => {
    if (!user_id) {
      return { success: false, error: "User ID is required." };
    }
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(
        `${BASE_URL}/user-details/public-profile/${user_id}`,
        { headers }
      );

      console.log("data from backend", response);
      if (!response.data) {
        return { success: true, data: null };
      }

      // Log the skills data structure for debugging
      if (response.data.skills) {
        console.log("Skills data structure:", response.data.skills);
        console.log("First skill type:", typeof response.data.skills[0]);
        if (response.data.skills[0]) {
          console.log("First skill content:", response.data.skills[0]);
        }
      }

      // Return specific data type if requested
      switch (dataType) {
        case "experiences":
          return {
            success: true,
            data: response.data.experiences || [],
          };
        case "education":
          return {
            success: true,
            data: response.data.educations || [],
          };
        case "skills":
          return {
            success: true,
            data: response.data.skills || [],
          };
        case "all":
        default:
          return {
            success: true,
            data: response.data,
          };
      }
    } catch (error) {
      console.error("Error fetching user public profile:", error);
      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Unknown error occurred",
      };
    }
  },

  getMiniUserDetails: async (user_id, token) => {
    if (!user_id) {
      return { success: false, error: "User ID is required." };
    }
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(
        `${BASE_URL}/users/getUserData`,
        { headers }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching user details:", error);
      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Unknown error occurred",
      };
    }
  },
};

