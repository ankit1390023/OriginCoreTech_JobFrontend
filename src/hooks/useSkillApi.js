import { useState, useCallback } from 'react';
import { skillApi } from '../api/skillApi';

export const useSkillApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Upload skills
    const uploadSkills = useCallback(async (user_id, skills, certificateFiles) => {
        try {
            setLoading(true);
            setError(null);
            const response = await skillApi.uploadSkills(user_id, skills, certificateFiles);
            return response;
        } catch (err) {
            console.error('Error uploading skills:', err);
            setError('Failed to upload skills. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get user skills
    const getUserSkills = useCallback(async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await skillApi.getUserSkills(userId);
            return response;
        } catch (err) {
            console.error('Error fetching user skills:', err);
            setError('Failed to fetch user skills. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        uploadSkills,
        getUserSkills,
        setError
    };
}; 