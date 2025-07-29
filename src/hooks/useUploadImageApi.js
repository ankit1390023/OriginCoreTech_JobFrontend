import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import uploadImageApi from '../api/uploadImageApi';

const useUploadImageApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.auth);

    const uploadImage = useCallback(async (file, fieldName = 'certificateImage') => {
        if (!token) return null;
        setLoading(true);
        setError(null);
        try {
            const url = await uploadImageApi.uploadImage(file, fieldName, token);
            return url;
        } catch (err) {
            console.log('Error uploading image:', err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Batch upload multiple images
    const batchUploadImages = useCallback(async (files, fieldName = 'certificateImage') => {
        if (!token) return [];
        setLoading(true);
        setError(null);
        try {
            const uploadPromises = files.map(file => uploadImage(file, fieldName));
            const urls = await Promise.all(uploadPromises);
            return urls;
        } catch (err) {
            console.log('Error uploading images:', err);
            setError(err);
            return [];
        } finally {
            setLoading(false);
        }
    }, [uploadImage, token]);

    return { uploadImage, batchUploadImages, loading, error };
};

export default useUploadImageApi;