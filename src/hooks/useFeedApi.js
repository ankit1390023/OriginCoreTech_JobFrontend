import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import feedApi from '../api/feedApi';

const useFeedApi = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { token } = useSelector((state) => state.auth);
    
    const fetchFeed = useCallback(async (pageNum = 1, replace = false) => {
        if (!token) return;
        if (pageNum > totalPages && !replace) return;
        setLoading(true);
        setError(null);
        try {
            const data = await feedApi.getFeed(pageNum, 10, token);
            if (replace || pageNum === 1) {
                setPosts(data.posts);
            } else {
                setPosts(prevPosts => [...prevPosts, ...data.posts]);
            }
            setTotalPages(data.totalPages || 1);
            setPage(data.currentPage || pageNum);
        } catch (err) {
            setError('Failed to load feed');
        } finally {
            setLoading(false);
        }
    }, [token, totalPages]);

    const postFeed = useCallback(async (payload) => {
        if (!token) return;
        
        setLoading(true);
        setError(null);
        try {
            const res = await feedApi.postFeed(payload, token);
            await fetchFeed(1, true); // Refresh feed after posting
            return res;
        } catch (err) {
            setError('Failed to post feed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchFeed, token]);

    const handleLike = useCallback(async (postId, userId) => {
        if (!token) return;
        
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        likedBy: post.likedBy?.includes(userId) 
                            ? post.likedBy.filter(id => id !== userId)
                            : [...(post.likedBy || []), userId],
                        likeCount: post.likedBy?.includes(userId) 
                            ? post.likeCount - 1 
                            : post.likeCount + 1,
                    }
                    : post
            )
        );
        
        try {
            const currentPost = posts.find(p => p.id === postId);
            const isCurrentlyLiked = currentPost?.likedBy?.includes(userId);
            const action = isCurrentlyLiked ? 'unlike' : 'like';
            await feedApi.postLike(postId, { userId, action }, token);
        } catch (error) {
            // Rollback on error
            const originalPost = posts.find(p => p.id === postId);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            likedBy: originalPost?.likedBy || [],
                            likeCount: originalPost?.likeCount || 0,
                        }
                        : post
                )
            );
            setError('Failed to update like');
        }
    }, [token, posts]);

    return {
        posts,
        loading,
        error,
        page,
        totalPages,
        fetchFeed,
        postFeed,
        setPosts,
        handleLike,
        setLoading,
        setError,
    };
};

export default useFeedApi;