import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const applicationApi = {
  applyForJob: async (job_id, applicationData, token) => {
    try {
      // Validate required fields before making the request
      const requiredFields = ["name", "email", "resume"];
      for (const field of requiredFields) {
        if (!applicationData[field]) {
          return {
            success: false,
            message: `Missing required field: ${field}`,
          };
        }
      }

      // Construct request payload
      const requestData = {
        ...applicationData,
        job_id,
      };

      const apiUrl = `${BASE_URL}/jobpost/apply/${job_id}`;
      console.log("API URL:", apiUrl);
      console.log("Request data:", requestData);

      const response = await axios.post(apiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return response.data;
    } catch (error) {
      console.error("Application error:", error);
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Something went wrong. Please try again.",
      };
    }
  },

  getAllApplicantsByJob: async (job_id, token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/jobpost/${job_id}/allapplicant`,
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

  getApplicationById: async (job_id,application_id, token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/jobpost/${job_id}/applicant/${application_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response Status:", response.status);
      console.log("API Response Data:", JSON.stringify(response.data, null, 2));
      if (response.data && response.data.applicationDetails) {
        console.log("Application Details found in response:", response.data.applicationDetails);
      } else {
        console.warn("No applicationDetails found in response");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  scheduleInterview: async (application_id, interviewData, token) => {
    if (!token) {
      throw new Error("No auth token provided");
    }

    console.log("received token in scheduleInterview", token);
    console.log("application_id in scheduleInterview", application_id);
    console.log("form interview data in scheduleInterview", interviewData);

    // Build payload exactly as backend requires
    const payload = {
      message: interviewData.message || "Interview is scheduled for you",
      interview_type: interviewData.interview_type,
      interview_date: interviewData.interview_date,
      start_time: interviewData.start_time,
      end_time: interviewData.end_time,
      video_link:
        interviewData.interview_type?.toLowerCase() === "videocall"
          ? interviewData.video_link || "https://meet.google.com/"
          : interviewData.video_link || "https://dummy-link.com",
    };

    const response = await axios.post(
      `${BASE_URL}/interview-invitations/${application_id}`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("response from scheduleInterview", response.data);
    return response.data;
  }
  ,
  updateApplicationStatus: async (application_id, job_post_id, user_id, status, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/application/status`,
      {
        application_id,  // applicant’s application id
        job_post_id,     // job post id
        user_id,         // ✅ recruiter id (from Redux auth.user.id)
        status,          // new status
      },
      {
        headers: {
          Authorization:` Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error.response?.data || { message: "Unknown error" };
  }
},

};
