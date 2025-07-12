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

            console.log('Uploading skills with data:', {
                user_id,
                skills,
                certificateFiles: certificateFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
            });

            const response = await skillApi.uploadSkills(user_id, skills, certificateFiles);
            console.log('Upload response:', response);
            return response;
        } catch (err) {
            console.error('Error uploading skills:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                statusText: err.response?.statusText
            });

            // Set more specific error message
            let errorMessage = 'Failed to upload skills. Please try again.';
            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
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