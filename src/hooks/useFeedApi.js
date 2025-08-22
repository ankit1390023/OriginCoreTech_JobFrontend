import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import feedApi from "../api/feedApi";

const useFeedApi = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const fetchFeed = useCallback(
    async (pageNum = 1, replace = false) => {
      if (!token) return;
      if (pageNum > totalPages && !replace) return;
      setLoading(true);
      setError(null);
      try {
        const data = await feedApi.getFeed(pageNum, 10, token);
        if (replace || pageNum === 1) {
          setPosts(data.posts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        }
        setTotalPages(data.totalPages || 1);
        setPage(data.currentPage || pageNum);
      } catch (err) {
        setError("Failed to load feed");
      } finally {
        setLoading(false);
      }
    },
    [token, totalPages]
  );

  const postFeed = useCallback(
    async (payload) => {
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const res = await feedApi.postFeed(payload, token);
        await fetchFeed(1, true); // Refresh feed after posting
        return res;
      } catch (err) {
        setError("Failed to post feed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFeed, token]
  );

  const handleLike = useCallback(
    async (post_id, user_id) => {
      if (!token) return;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === post_id
            ? {
                ...post,
                likedBy: post.likedBy?.includes(user_id)
                  ? post.likedBy.filter((id) => id !== user_id)
                  : [...(post.likedBy || []), user_id],
                like_count: post.likedBy?.includes(user_id)
                  ? post.like_count - 1
                  : post.like_count + 1,
              }
            : post
        )
      );

      try {
        const currentPost = posts.find((p) => p.id === post_id);
        const isCurrentlyLiked = currentPost?.likedBy?.includes(user_id);
        const action = isCurrentlyLiked ? "unlike" : "like";
        await feedApi.postLike(post_id, { user_id, action }, token);
      } catch (error) {
        // Rollback on error
        const originalPost = posts.find((p) => p.id === post_id);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === post_id
              ? {
                  ...post,
                  likedBy: originalPost?.likedBy || [],
                  like_count: originalPost?.like_count || 0,
                }
              : post
          )
        );
        setError("Failed to update like");
      }
    },
    [token, posts]
  );

  // Fetch followers and following counts
  const fetchFollowersAndFollowing = useCallback(async () => {
    if (!token) return;

    try {
      const { count: followersCount } = await feedApi.getFollowers(token);
      setFollowersCount(followersCount);

      const { count: followingCount } = await feedApi.getFollowing(token);
      setFollowingCount(followingCount);
    } catch (err) {
      console.error("Failed to load followers/following:", err);
      setError("Failed to load followers/following");
    }
  }, [token]);

  // Check follow status for a specific user
  const checkFollowStatus = useCallback(
    async (profileId) => {
      if (!token || !profileId) return;

      try {
        const res = await feedApi.checkFollowStatus(profileId, token);
        setIsFollowing(res.isFollowing);
        return res.isFollowing;
      } catch (err) {
        console.error("Failed to check follow status:", err);
        setIsFollowing(false);
        return false;
      }
    },
    [token]
  );

  // Handle follow/unfollow toggle
  const handleFollowToggle = useCallback(
    async (profileId) => {
      if (!token || !profileId) {
        console.error("Token or profile ID not available");
        return;
      }

      setFollowLoading(true);
      try {
        await feedApi.followUnfollowUser(profileId, token);
        setIsFollowing((prev) => !prev);
        setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
        return !isFollowing; // Return new follow status
      } catch (err) {
        console.error("Error toggling follow status:", err);
        setError("Failed to update follow status");
        throw err;
      } finally {
        setFollowLoading(false);
      }
    },
    [token, isFollowing]
  );

  return {
    posts,
    loading,
    error,
    page,
    totalPages,
    followersCount,
    followingCount,
    isFollowing,
    followLoading,
    fetchFeed,
    postFeed,
    setPosts,
    handleLike,
    fetchFollowersAndFollowing,
    checkFollowStatus,
    handleFollowToggle,
    setLoading,
    setError,
  };
};

export default useFeedApi;
