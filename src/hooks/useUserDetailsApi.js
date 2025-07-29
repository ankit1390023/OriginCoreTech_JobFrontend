import { useState, useCallback } from 'react';
import { userDetailsApi } from '../api/userDetailsApi';

export const useUserDetailsApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Create user details
    const createUserDetails = useCallback(async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userDetailsApi.createUserDetails(userData);
            return response;
        } catch (err) {
            console.error('Error creating user details:', err);
            setError('Failed to create user details. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get user details by userId
    const getUserDetails = useCallback(async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userDetailsApi.getUserDetails(userId);
            return response;
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to fetch user details. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Get public user profile by ID
    const getUserPublicProfileById = useCallback(async (userId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userDetailsApi.getUserPublicProfileById(userId);
            return response;
        } catch (err) {
            console.error('Error fetching public user profile:', err);
            setError('Failed to fetch public user profile. Please try again.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createUserDetails,
        getUserDetails,
        getUserPublicProfileById,
        setError
    };
}; 