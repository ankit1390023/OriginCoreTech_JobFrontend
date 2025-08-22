import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for domain data
export const domainApi = {
  // Fetch all skills (areas of interest) from backend
  getAllDomains: async (token) => {
    try {
      console.log("Making domain API call with token:", !!token);
      const response = await axios.get(`${BASE_URL}/domain/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Domain API response:", response.data);
      return response.data.domains || [];
    } catch (error) {
      console.error("Error fetching domains:", error);
      throw error;
    }
  },

  // Fetch skills by domain from backend
  getSkillsByDomain: async (domain_id, token) => {
    console.log(domain_id);
    try {
      const response = await axios.get(
        `${BASE_URL}/skills/by-domain/${domain_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.skills || [];
    } catch (error) {
      console.error("Error fetching skills by domain:", error);
      throw error;
    }
  },
};
