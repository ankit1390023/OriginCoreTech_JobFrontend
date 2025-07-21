
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem('token');

const feedApi = {
    postFeed: async (data) => {
        try {
            const token = getToken();
            const response = await axios.post(`${BASE_URL}/feed/feed`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            return response.data;
        } catch (error) {
            console.log("error while posting feed", error);
            throw error;
        }
    },
    getFeed: async (page, limit) => {
        try {
            const token = getToken();
            const response = await axios.get(`${BASE_URL}/feed/posts?page=${page}&limit=${limit}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            // Ensure the response has the expected structure
            const { totalPosts = 0, currentPage = 1, totalPages = 1, posts = [] } = response.data || {};
            return { totalPosts, currentPage, totalPages, posts };
        } catch (error) {
            console.log("error while getting feed", error);
            throw error;
        }
    },
    postComment: async (postId, data) => {
        try {
            const token = getToken();
            const response = await axios.post(`${BASE_URL}/feed/posts/${postId}/comment`, data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            )
            return response.data;
        } catch (error) {
            console.log("error while posting comment", error);
            throw error;
        }
    },
    postLike: async () => {
        try {
            const token = getToken();
            const response = await axios.post(`${BASE_URL}/feed/posts/${postId}/like`, data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            return response.data;
        } catch (error) {
            console.log("error while posting like", error);
            throw error;
        }
    },
    postFollowUnFollow: async (data) => {
        try {
            const token = getToken();
            const response = await axios.post(`${BASE_URL}/feed/follow`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.log("error while following/unfollowing", error);
            throw error;
        }
    }

}

export default feedApi;