import { useState, useCallback } from 'react';
import uploadImageApi from '../api/uploadImageApi';

const useUploadImageApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    
    const uploadImage = useCallback(async (file, fieldName = 'certificateImage') => {
        setLoading(true);
        setError(null);
        try {
            const url = await uploadImageApi.uploadImage(file, fieldName);
            return url;
        } catch (err) {
            console.log('Error uploading image:', err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Batch upload multiple images
    const batchUploadImages = useCallback(async (files, fieldName = 'certificateImage') => {
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
    }, [uploadImage]);

    return { uploadImage, batchUploadImages, loading, error };
};

export default useUploadImageApi;