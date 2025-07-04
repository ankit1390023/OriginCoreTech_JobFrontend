import { useState, useEffect } from 'react';
import { jobGetApi } from '../api/jobGetApi';

export const useGetJobApi = () => {
    const [allJobs, setAllJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await jobGetApi.getAllJobs();
                setAllJobs(response.data || response);
            } catch (error) {
                console.log("error in fetchAllJobs", error);
                setError("Failed to load jobs. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchAllJobs();
    }, []);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await jobGetApi.getAllJobs();
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
        refetch
    };
};