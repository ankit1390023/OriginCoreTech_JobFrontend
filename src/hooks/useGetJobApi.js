import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { jobGetApi } from '../api/jobGetApi';

export const useGetJobApi = () => {
    const [allJobs, setAllJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchAllJobs = async () => {
            if (!token) return;
            
            try {
                setLoading(true);
                setError(null);
                const response = await jobGetApi.getAllJobs(token);
                setAllJobs(response.data || response);
            } catch (error) {
                console.log("error in fetchAllJobs", error);
                setError("Failed to load jobs. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchAllJobs();
    }, [token]);

    const refetch = async () => {
        if (!token) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await jobGetApi.getAllJobs(token);
            setAllJobs(response.data || response);
        } catch (error) {
            setError("Failed to reload jobs. Please try again later.");
            console.log("Failed to reload jobs", error);
        } finally {
            setLoading(false);
        }
    }

    return {
        allJobs,
        loading,
        error,
        refetch,
    };
};

export const useGetJobById = (jobId) => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchJobById = async () => {
            if (!jobId || !token) return;

            try {
                setLoading(true);
                setError(null);
                const response = await jobGetApi.getJobById(jobId, token);
                setJob(response);
            } catch (error) {
                setError(`Failed to load job details: ${error.response?.data?.message || error.message}`);
            } finally {
                setLoading(false);
            }
        }
        fetchJobById();
    }, [jobId, token]);

    const refetch = async () => {
        if (!jobId || !token) return;

        try {
            setLoading(true);
            setError(null);
            const response = await jobGetApi.getJobById(jobId, token);
            setJob(response.data || response);
        } catch (error) {
            setError("Failed to reload job details. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return {
        job,
        loading,
        error,
        refetch,
    };
};