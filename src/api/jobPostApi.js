import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for job posting
export const jobPostApi = {
  // Create a new job post
  createJobPost: async (jobPostData, token) => {

    if (!token) {
      throw new Error('No auth token provided');
    }
    const response = await axios.post(`${BASE_URL}/jobpost/create`, jobPostData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;

  },


  // Get job posts by recruiter
  getJobPostsByRecruiter: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/company-recruiter-profile/jobpost/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get total job posts count by recruiter
  getTotalJobPostsCount: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/jobpost/totalcount`, {
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
 

  getPendingTasks: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/pendingtask/grouped`, {
        headers: {
          Authorization: `Bearer ${token}`, // add if required
          "Content-Type": "application/json",
        },
      });

      return response.data; // { resumeReview: { count }, interviewToSchedule: { count }, offerLetterPending: { count } }
    } catch (error) {
      console.error("Error fetching pending tasks:", error);
      throw error;
    }
  },

};