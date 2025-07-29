import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                setLoading(true);
                setError(null);

                const educationData = await educationApi.getAllEducationData(token);
                setData(educationData);
            } catch (err) {
                console.error('Error fetching education data:', err);
                setError('Failed to load education data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token]);

    const refetch = async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);

            const educationData = await educationApi.getAllEducationData(token);
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