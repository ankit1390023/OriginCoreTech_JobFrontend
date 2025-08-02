import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { skillApi } from '../api/skillApi';

export const useSkillApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.auth);

    // Upload skills
    const uploadSkills = useCallback(async (user_id, skills, certificateFiles = []) => {
        if (!token) {
            setError('Authentication token not found. Please log in again.');
            return;
        }
        
        if (!user_id) {
            setError('User ID is required.');
            return;
        }
        
        try {
            setLoading(true);
            setError(null);

            const response = await skillApi.uploadSkills(user_id, skills, certificateFiles, token);
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
    }, [token]);

    // Get user skills
    const getUserSkills = useCallback(async (userId) => {
        if (!token) return;
        try {
            setLoading(true);
            setError(null);
            const response = await skillApi.getUserSkills(userId, token);
            return response;
        } catch (err) {
            console.error('Error fetching user skills:', err);
            setError('Failed to fetch user skills. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    return {
        loading,
        error,
        uploadSkills,
        getUserSkills,
        setError
    };
}; 