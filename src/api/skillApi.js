import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
// API service functions for skill uploads
export const skillApi = {
  // Upload skill certificates
  uploadSkills: async (user_id, skills, certificateFiles, token) => {
    try {
      // Validate required parameters
      if (!user_id) {
        throw new Error("User ID is required");
      }
      if (!skills || !Array.isArray(skills)) {
        throw new Error("Skills array is required");
      }
      if (!token) {
        throw new Error("Authentication token is required");
      }

      // Prepare the request payload as JSON
      const payload = {
        user_id: user_id,
        skills: skills,
        certificate_images: [],
      };

      // Add certificate URLs if they are provided
      if (
        certificateFiles &&
        Array.isArray(certificateFiles) &&
        certificateFiles.length > 0
      ) {
        certificateFiles.forEach((file) => {
          if (file && typeof file === "string") {
            // If file is already a URL string, add it directly
            payload.certificate_images.push(file);
          } else if (file) {
            // If file is a File object, we need to handle it differently
            // For now, we'll skip it as the frontend should upload images first
            console.warn(
              "File object detected, should be uploaded separately first"
            );
          }
        });
      }

      const response = await axios.post(`${BASE_URL}/upload-skill`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response.data from uploadSkills", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading skills:", error);
      console.log("error.response.data from uploadSkills", error.response.data);
      console.log(
        "error.response.status from uploadSkills",
        error.response.status
      );
      throw error;
    }
  },

  // Get skills for a user
  getUserSkills: async (user_id, token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/user-skills/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user skills:", error);
      throw error;
    }
  },

  // Get certificate file URL
  getCertificateUrl: (certificatePath) => {
    if (!certificatePath) return null;
    return `${BASE_URL}${certificatePath}`;
  },
};
