import { useState, useCallback } from 'react';
import feedApi from '../api/feedApi';

const useFeedApi = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFeed = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data = await feedApi.getFeed(page, limit);
            setPosts(data.posts);
        } catch (err) {
            setError('Failed to load feed');
        } finally {
            setLoading(false);
        }
    }, []);

    const postFeed = useCallback(async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const res = await feedApi.postFeed(payload);
            await fetchFeed(); // Optionally refresh feed after posting
            return res;
        } catch (err) {
            setError('Failed to post feed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchFeed]);

    const handleLike = useCallback(async (postId, isCurrentlyLiked, userId) => {
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
            await feedApi.postLike(postId, { userId, action });
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
    }, []);

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