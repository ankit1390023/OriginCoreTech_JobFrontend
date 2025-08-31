import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// API service functions for job posting
export const jobPostApi = {
    // Create a new job post
    createJobPost: async (jobPostData, token) => {

        if (!token) {
            throw new Error('No auth token provided');
        }
        console.log("received token in createJobPost", token)
        const response = await axios.post(`${BASE_URL}/jobpost/create`, jobPostData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("response from createJobPost", response.data);
        return response.data;

    },

    // Get all domains (for skills suggestions)
    getAllDomains: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/domain/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
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

    // Get job post getAllUpcomingInterviews
    getAllUpcomingInterviews: async (token) => {
        if (!token) {
            throw new Error('No auth token provided');
        }
        
        try {
            const response = await axios.get(
                `${BASE_URL}/interview-invitations/upcoming/all`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Ensure token is properly formatted
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching all upcoming interviews:", error.response?.data || error.message);
            throw error;
        }
    },  

    getInterviewInvitationById: async (id, token) => {
        try {
          const response = await axios.post(
            `${BASE_URL}/interview-invitations/${id}`,
            {
               headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Ensure token is properly formatted
                    },
            }
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching interview invitation by ID :", error.response?.data || error.message);
          throw error;
        }
      },
getPipelineCandidates: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/company-recruiter/candidates`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // if authentication required
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

   getSendAssignment: async (applicationId, assignmentData, token) => {
  try {
    const formData = new FormData();
    formData.append("message", assignmentData.message);
    formData.append("deadline", assignmentData.deadline);
    if (assignmentData.file) {
      formData.append("file", assignmentData.file); // ✅ backend expects "file"
    }

    const response = await axios.post(
      `${BASE_URL}/assignments/${applicationId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // if required
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // created assignment response
  } catch (error) {
    console.error("Error sending assignment:", error);
    throw error;
  }
    },   

  
  getDashboardStats: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/company-recruiter/dashboardStats`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // { jobsPosted, pendingTasks, upcomingInterviews }
    } catch (error) {
      throw error;
    }
  },
  


};