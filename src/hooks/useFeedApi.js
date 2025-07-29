import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import feedApi from '../api/feedApi';

const useFeedApi = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useSelector((state) => state.auth);

    const fetchFeed = useCallback(async (page = 1, limit = 10) => {
        if (!token) return;
        
        setLoading(true);
        setError(null);
        try {
            const data = await feedApi.getFeed(page, limit, token);
            setPosts(data.posts);
        } catch (err) {
            setError('Failed to load feed');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const postFeed = useCallback(async (payload) => {
        if (!token) return;
        
        setLoading(true);
        setError(null);
        try {
            const res = await feedApi.postFeed(payload, token);
            await fetchFeed(); // Optionally refresh feed after posting
            return res;
        } catch (err) {
            setError('Failed to post feed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchFeed, token]);

    const handleLike = useCallback(async (postId, isCurrentlyLiked, userId) => {
        if (!token) return;
        
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        isLiked: !isCurrentlyLiked,
                        likeCount: post.likeCount + (isCurrentlyLiked ? -1 : 1),
                    }
                    : post
            )
        );
        try {
            const action = isCurrentlyLiked ? 'unlike' : 'like';
            await feedApi.postLike(postId, { userId, action }, token);
        } catch (error) {
            // Rollback on error
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            isLiked: isCurrentlyLiked,
                            likeCount: post.likeCount + (isCurrentlyLiked ? 1 : -1),
                        }
                        : post
                )
            );
            setError('Failed to update like');
        }
    }, [token]);

    return {
        posts,
        loading,
        error,
        fetchFeed,
        postFeed,
        setPosts, // if you want to update posts manually
        handleLike, // expose like handler
    };
};

export default useFeedApi;