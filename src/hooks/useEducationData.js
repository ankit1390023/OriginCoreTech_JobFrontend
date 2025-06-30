import { useState, useEffect } from 'react';
import { educationApi } from '../api/educationApi';

export const useEducationData = () => {
    const [data, setData] = useState({
        jobRoles: [],
        locations: [],
        courses: [],
        specializations: [],
        colleges: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const educationData = await educationApi.getAllEducationData();
                setData(educationData);
            } catch (err) {
                console.error('Error fetching education data:', err);
                setError('Failed to load education data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);

            const educationData = await educationApi.getAllEducationData();
            setData(educationData);
        } catch (err) {
            console.error('Error refetching education data:', err);
            setError('Failed to reload education data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        refetch
    };
}; 