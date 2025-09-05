import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { jobGetApi } from "../api/jobGetApi";

export const useGetJobApi = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAllJobs = async () => {
      if (!token) return;

      const response = await jobGetApi.getAllJobs(token);
      console.log("response.data from fetchAllJobs", response);
      setAllJobs(response.data || response);
    };
    fetchAllJobs();
  }, [token]);

  // const refetch = async () => {
  //   if (!token) return;

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await jobGetApi.getAllJobs(token);
  //     setAllJobs(response.data || response);
  //   } catch (error) {
  //     setError("Failed to reload jobs. Please try again later.");
  //     console.log("Failed to reload jobs", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    allJobs,
    loading,
    error,
    // refetch,
  };
};

export const useGetJobById = (job_id) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchJobById = async () => {
      if (!job_id || !token) return;

      try {
        setLoading(true);
        setError(null);
        const response = await jobGetApi.getJobById(job_id, token);
        setJob(response);
      } catch (error) {
        setError(
          `Failed to load job details: ${
            error.response?.data?.message || error.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchJobById();
  }, [job_id, token]);

  const refetch = async () => {
    if (!job_id || !token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await jobGetApi.getJobById(job_id, token);
      setJob(response.data || response);
    } catch (error) {
      setError("Failed to reload job details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return {
    job,
    loading,
    error,
    refetch,
  };
};
