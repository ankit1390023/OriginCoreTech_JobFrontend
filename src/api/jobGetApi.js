import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

//Api service function for job get

export const jobGetApi = {
  //Get all jobs
  getAllJobs: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/opportunities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("response.data from getAllJobs", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching Get All jobs:", error);

      throw error;
    }
  },

  //Get Job By ID
  getJobById: async (job_id, token) => {
    try {
      const response = await axios.get(`${BASE_URL}/jobdetails/${job_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response.data from getJobById", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching Job by ID:", error);
      throw error;
    }
  },
};
