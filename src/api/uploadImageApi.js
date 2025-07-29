import axios from 'axios';
 
const BASE_URL = import.meta.env.VITE_BASE_URL;
 
const uploadImageApi = {
   
    uploadImage: async (file, fieldName = 'certificateImage') => {
        try {
            const formData = new FormData();
            formData.append(fieldName, file);
            const response = await axios.post(`${BASE_URL}/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log("response",response);
            // The backend returns { url: [ ... ] }
            if (response.data && response.data.url && response.data.url.length > 0) {
                return response.data.url[0];
            }
            return null;
        } catch (error) {
            console.log('Error uploading image:', error);
            throw error;
        }
    }
};
 
export default uploadImageApi;