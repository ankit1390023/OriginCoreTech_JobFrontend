import { useState } from "react";
import { useSelector } from "react-redux";
import { applicationApi } from "../api/applicationApi";

export const useApplyToJob = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const applyToJob = async (job_id, applicationData) => {
    if (!token) {
      setError("You must be logged in to apply for jobs");
      return {
        success: false,
        message: "You must be logged in to apply for jobs",
      };
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Ensure we have a valid job_id
      if (!job_id) {
        setError("Invalid job ID");
        return { success: false, message: "Invalid job ID" };
      }

      // Prepare minimal application data if none provided
      const data = applicationData || { job_id };

      console.log("Applying for job with data:", { job_id, data });
      console.log("Token available:", !!token);
      console.log(
        "Token value:",
        token ? token.substring(0, 10) + "..." : "No token"
      );

      const response = await applicationApi.applyForJob(job_id, data, token);
      console.log("Application response:", response);

      if (response.success) {
        setSuccess(true);
        return {
          success: true,
          message: response.message || "Application submitted successfully!",
        };
      } else {
        const errorMsg = response.message || "Failed to submit application";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error("Error in applyToJob hook:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    applyToJob,
    loading,
    error,
    success,
    resetState,
  };
};

export default useApplyToJob;
