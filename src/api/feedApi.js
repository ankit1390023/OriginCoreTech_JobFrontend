
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const feedApi = {

    postFeed: async (data, token) => {
        try {
            const response = await axios.post(`${BASE_URL}/feed/feed`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("error while posting feed", error);
            throw error;
        }
    },
    getFeed: async (page, limit, token) => {
        try {
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
    postComment: async (postId, data, token) => {
        try {
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
    postLike: async (postId, data, token) => {
        try {
            console.log("data", data);
            const response = await axios.post(`${BASE_URL}/feed/posts/${postId}/like`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("response.data from post like", response.data);
            return response.data;
        } catch (error) {
            console.log("error while posting like", error);
            throw error;
        }
    },
    postFollowUnFollow: async (data, token) => {
        try {
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
    },
    getFollowers: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/feed/6/followers`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            // Ensure the response has the expected structure
            const { count = 0, followers = [] } = response.data || {};
            return { count, followers };
        } catch (error) {
            console.log("error while getting followers", error);
            throw error;
        }
    },
    getFollowing: async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/feed/6/following`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            // Ensure the response has the expected structure
            const { count = 0, followers = [] } = response.data || {};
            return { count, followers };
        } catch (error) {
            console.log("error while getting following", error);
            throw error;
        }
    },
    // Follow a specific user
    followUnfollowUser: async (targetUserId, token) => {
        try {
            const currentUserId = localStorage.getItem('userId');
            
            if (!currentUserId || !targetUserId) {
                throw new Error('Both current user ID and target user ID are required');
            }

            const response = await axios.post(`${BASE_URL}/feed/follow`, {
                followerId: currentUserId,
                followingId: targetUserId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data;
        } catch (error) {
            console.log("error while following user", error);
            throw error;
        }
    },
    // Check if current user is following a specific user
    checkFollowStatus: async (targetUserId, token) => {
        try {
            const currentUserId = localStorage.getItem('userId');
            
            if (!currentUserId || !targetUserId) {
                throw new Error('Both current user ID and target user ID are required');
            }

            const response = await axios.get(`${BASE_URL}/feed/follow-status/${currentUserId}/${targetUserId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            return response.data;
        } catch (error) {
            console.log("error while checking follow status", error);
            throw error;
        }
    },

}

export default feedApi;