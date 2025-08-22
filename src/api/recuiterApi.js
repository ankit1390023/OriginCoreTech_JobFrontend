import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for company recruiter profile
export const recruiterApi = {
  // Create recruiter profile with file upload support (main method)
  createProfileWithFileUpload: async (profileData, token) => {
    try {
      if (!token) {
        console.error(
          " createProfileWithFileUpload - Request setup error: Token is missing in createProfileWithFileUpload"
        );
        throw new Error("Token is missing in createProfileWithFileUpload");
      }
      // Create formData with multipart upload
      const formData = new FormData();

      // Add text fields
      formData.append("designation", profileData.designation);
      formData.append("company_name", profileData.company_name);
      formData.append("industry", profileData.industry);
      formData.append("location", profileData.location);
      formData.append("about", profileData.about);
      formData.append(
        "hiring_preferences",
        profileData.hiring_preferences || ""
      );
      formData.append("languages_known", profileData.languages_known || "");
      formData.append("is_email_verified", profileData.is_email_verified);
      formData.append("is_phone_verified", profileData.is_phone_verified);
      formData.append("is_gst_verified", profileData.is_gst_verified);

      // Add files if they exist
      if (profileData.logo_url && profileData?.logo_url[0]) {
        formData.append("logo_url", profileData?.logo_url[0]);
      }
      if (profileData.profile_pic && profileData?.profile_pic[0]) {
        formData.append("profile_pic", profileData?.profile_pic[0]);
      }

      const response = await axios.post(
        `${BASE_URL}/company-recruiter/profile/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let browser set it with boundary for multipart
          },
        }
      );
      console.log("response from createProfileWithFileUpload", response.data);
      return response.data;
    } catch (error) {
      console.log(
        "error while createProfileWithFileUpload from recruiterApi",
        error
      );
      throw error;
    }
  },

  // Create a new company recruiter profile
  createProfile: async (profileData, token) => {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Add text fields
      formData.append("designation", profileData.designation);
      formData.append("company_name", profileData.company_name);
      formData.append("industry", profileData.industry);
      formData.append("location", profileData.location);
      formData.append("about", profileData.about);
      formData.append(
        "hiring_preferences",
        profileData.hiring_preferences || ""
      );
      formData.append("languages_known", profileData.languages_known || "");
      formData.append("is_email_verified", profileData.is_email_verified);
      formData.append("is_phone_verified", profileData.is_phone_verified);
      formData.append("is_gst_verified", profileData.is_gst_verified);

      // Add files if they exist
      if (profileData.logo_url && profileData.logo_url instanceof File) {
        formData.append("logo_url", profileData.logo_url);
      }
      if (profileData.profile_pic && profileData.profile_pic instanceof File) {
        formData.append("profile_pic", profileData.profile_pic);
      }

      const response = await axios.post(
        `${BASE_URL}/company-recruiter/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let browser set it with boundary for multipart
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("error creating new company recruiter profile ", error);
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
      console.log("error fetching company recuiter profile ", error);

      throw error;
    }
  },

  // Update company recruiter profile
  updateProfile: async (profileData, token) => {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Add text fields
      formData.append("designation", profileData.designation);
      formData.append("company_name", profileData.company_name);
      formData.append("industry", profileData.industry);
      formData.append("location", profileData.location);
      formData.append("about", profileData.about);
      formData.append(
        "hiring_preferences",
        profileData.hiring_preferences || ""
      );
      formData.append("languages_known", profileData.languages_known || "");
      formData.append("is_email_verified", profileData.is_email_verified);
      formData.append("is_phone_verified", profileData.is_phone_verified);
      formData.append("is_gst_verified", profileData.is_gst_verified);

      // Add files if they exist
      if (profileData.logo_url && profileData.logo_url instanceof File) {
        formData.append("logo_url", profileData.logo_url);
      }
      if (profileData.profile_pic && profileData.profile_pic instanceof File) {
        formData.append("profile_pic", profileData.profile_pic);
      }

      const response = await axios.put(
        `${BASE_URL}/company-recruiter/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let browser set it with boundary for multipart
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("error updating company recruiter profile ", error);

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
      console.log("error fetching job posts by recuiter ", error);
      throw error;
    }
  },
};
