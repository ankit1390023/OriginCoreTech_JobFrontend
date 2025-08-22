import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const feedApi = {
  postFeed: async (data, token) => {
    try {
      const response = await axios.post(`${BASE_URL}/feed/feed`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log("error while posting feed", error);
      throw error;
    }
  },

  getFeed: async (page, limit, token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/feed/posts?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Ensure the response has the expected structure
      const {
        totalPosts = 0,
        currentPage = 1,
        totalPages = 1,
        posts = [],
      } = response.data || {};

      return { totalPosts, currentPage, totalPages, posts };
    } catch (error) {
      console.log("error while getting feed", error);
      throw error;
    }
  },

  postComment: async (post_id, data, token) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/feed/posts/${post_id}/comment`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("error while posting comment", error);
      throw error;
    }
  },
  postLike: async (post_id, data, token) => {
    try {
      console.log("data", data);
      const response = await axios.post(
        `${BASE_URL}/feed/posts/${post_id}/like`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      const currentUserId = localStorage.getItem("user_id");

      if (!currentUserId || !targetUserId) {
        throw new Error("Both current user ID and target user ID are required");
      }

      const response = await axios.post(
        `${BASE_URL}/feed/follow`,
        {
          follower_id: currentUserId,
          followingId: targetUserId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("error while following user", error);
      throw error;
    }
  },

  getTermsAndCondition: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-details/getTermsAndCondition`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("error while getting terms and conditions", error);
      throw error;
    }
  },

  updateTermsAndCondition: async (data, token) => {
    try {
      console.log("Sending data to updateTermsAndCondition:", data);

      // Get user ID from localStorage or data
      const user_id = data.user_id || localStorage.getItem("user_id");

      if (!user_id) {
        throw new Error("User ID is required");
      }

      // Prepare the correct data format that server expects
      const requestData = {
        user_id: parseInt(user_id),
        accepted: data.accepted || true,
      };

      console.log("Formatted request data:", requestData);

      const response = await axios.post(
        `${BASE_URL}/user-details/updateTermsAndCondition`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("updateTermsAndCondition response:", response.data);
      return response.data;
    } catch (error) {
      console.log("error while updating terms and conditions", error);
      console.log("Server response data:", error.response?.data);
      console.log("Request data sent:", data);
      throw error;
    }
  },
};

export default feedApi;
