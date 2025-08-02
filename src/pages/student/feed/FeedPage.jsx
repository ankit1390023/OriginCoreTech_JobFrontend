import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MainLayout from '../../../components/layout/MainLayout.jsx';
import profile from '../../../assets/profile.png';
import addMediaIcon from '../../../assets/add-media.png';
import { BiCommentDetail, BiLike } from "react-icons/bi";
import { FaEllipsisH } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import { LiaShareSolid } from "react-icons/lia";
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import FeedRightProfile from './FeedRightProfile.jsx';
import feedApi from '../../../api/feedApi';
import uploadImageApi from '../../../api/uploadImageApi';
import useFeedApi from '../../../hooks/useFeedApi';

export default function FeedPage() {
    const { token, user } = useSelector((state) => state.auth);

    const [caption, setCaption] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [postingFeed, setPostingFeed] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // comments states 
    const [commentInputs, setCommentInputs] = useState({});
    const [openComments, setOpenComments] = useState({});
    const [openReplies, setOpenReplies] = useState({});
    const [replyInputs, setReplyInputs] = useState({});

    const { posts, loading, error, page, totalPages, fetchFeed, postFeed, setPosts, handleLike, setLoading, setError } = useFeedApi();

    useEffect(() => {
        if (token) {
            fetchFeed(1, true);
        }
    }, [token]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };
    const handleFeedPost = async () => {
        if (!token || !user) {
            alert('User not logged in');
            return;
        }

        setPostingFeed(true);
        let imageUrl = '';

        try {
            if (imageFile) {
                setUploadingImage(true);
                const imageUrlResult = await uploadImageApi.uploadImage(imageFile, 'feedImage', token);
                if (typeof imageUrlResult === 'string' && imageUrlResult.length > 0) {
                    imageUrl = imageUrlResult;
                } else if (imageUrlResult && imageUrlResult.url && imageUrlResult.url.length > 0) {
                    imageUrl = imageUrlResult.url[0];
                }
                setUploadingImage(false);
            }

            const payload = {
                userId: user.id,
                image: imageUrl,
                caption,
            };

            await postFeed(payload);
            setCaption('');
            setImageFile(null);
            setImagePreview(null);
        } catch (err) {
            console.log("Error while posting feed", err);
            alert('Failed to post feed. Please try again.');
        } finally {
            setPostingFeed(false);
            setUploadingImage(false);
        }
    };


    const handlePageChange = (pageNum) => {
        if (pageNum !== page && pageNum >= 1 && pageNum <= totalPages) {
            fetchFeed(pageNum, true);
        }
    };

    const handleComment = async (postId) => {
        if (!token || !user) {
            alert('User not logged in');
            return;
        }
        const commentText = commentInputs[postId]?.trim();
        if (!commentText) return;
        try {
            const response = await feedApi.postComment(postId, {
                userId: Number(user.id),
                comment: commentText,
            }, token);
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === postId
                    ? { ...post, comments: response.comments, commentCount: response.commentCount }
                    : post
            ));
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        } catch (error) {
            alert('Failed to post comment');
            console.error('Error posting comment:', error);
        }
    };

    const toggleComments = (postId) => {
        setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const toggleReplies = (commentId) => {
        setOpenReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    return (
        <MainLayout>
            <div className="flex justify-center bg-gray-100 min-h-screen px-2 sm:px-4 md:px-6 lg:px-8">
                {/* Left spacer - hidden on mobile, visible on large screens */}
                <div className="hidden xl:block flex-grow max-w-[200px]"></div>

                {/* Main content section */}
                <section className="w-full max-w-[750px] p-2 mx-auto">
                    {/* Create post card */}
                    <div className="bg-white rounded-lg flex flex-col gap-3 shadow-sm p-3 sm:p-4 mb-4">
                        <div className="flex items-center gap-2 w-full">
                            <img src={profile} alt="Profile" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0" />
                            <Input
                                type="text"
                                size="large"
                                placeholder="Share something..."
                                className="flex-1 h-12 border border-gray-400 rounded px-3 sm:px-4 w-full sm:min-w-[300px] md:min-w-[400px] lg:min-w-[500px] xl:min-w-[600px]"
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                            />

                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 pl-12 sm:pl-14">
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                                <img src={addMediaIcon} alt="Add media" className="w-4 h-4" />
                                <span className="text-gray-500 text-xs sm:text-sm">Add media</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg ml-2" />
                            )}
                        </div>
                        <Button
                            className="ml-auto px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base transition-colors"
                            size="small"
                            onClick={handleFeedPost}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? 'Posting...' : 'Post'}
                        </Button>
                    </div>

                    {/* Loading and error states */}
                    {loading && <div className="text-center py-8 text-gray-600">Loading...</div>}
                    {error && <div className="text-center text-red-500 py-8 px-4">{error}</div>}
                    {!loading && !error && posts.length === 0 && (
                        <div className="text-center py-8 text-gray-500 px-4">No posts found.</div>
                    )}

                    {/* Posts list */}
                    {!loading && !error && posts.map((post) => (
                        <article key={post.id} className="bg-white rounded-lg border shadow-sm p-3 sm:p-4 mb-4">
                            {/* Post header */}
                            <header className="flex items-center gap-2 sm:gap-3 mb-3">
                                <img src={
                                    post.profilePic
                                        ? (post.profilePic.startsWith('data:') ? post.profilePic : `data:image/jpeg;base64,${post.profilePic}`)
                                        : post.User?.profilePic
                                            ? (post.User.profilePic.startsWith('data:') ? post.User.profilePic : `data:image/jpeg;base64,${post.User.profilePic}`)
                                            : profile
                                } alt={post.User?.firstName || 'User'} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                        <span className="font-semibold text-sm truncate">{post.User?.firstName} {post.User?.lastName}</span>
                                        <span className="text-xs text-gray-400">• {new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">{post.userRole}</div>
                                </div>
                                <span className="text-gray-500 text-xs cursor-pointer p-1 hover:bg-gray-100 rounded"><FaEllipsisH /></span>
                            </header>

                            {/* Post image */}
                            {post.image && (
                                <img src={post.image} alt="Post" className="rounded-lg object-cover w-[80%] h-80 sm:h-64 mb-3" />
                            )}

                            {/* Post caption */}
                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{post.caption}</p>

                            {/* Post actions footer */}
                            <footer className="flex justify-between text-sm text-gray-500 items-center py-2 border-t">
                                <div
                                    className={`flex flex-col items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors ${(post.likedBy && post.likedBy.includes(user?.id)) ? 'text-blue-600' : ''}`}
                                    onClick={() => handleLike(post.id, user?.id)}
                                >
                                    <BiLike className='text-lg sm:text-xl' />
                                    <span className='text-xs sm:text-sm mt-1'>Like ({post.likeCount})</span>
                                </div>
                                <div className="flex flex-col items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => toggleComments(post.id)}>
                                    <BiCommentDetail className='text-lg sm:text-xl' />
                                    <span className='text-xs sm:text-sm mt-1'>Comment ({post.commentCount})</span>
                                </div>
                                <div className="flex flex-col items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <LiaShareSolid className='text-lg sm:text-xl' />
                                    <span className='text-xs sm:text-sm mt-1'>Share</span>
                                </div>
                                <div className="flex flex-col items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <TbSend className='text-lg sm:text-xl' />
                                    <span className='text-xs sm:text-sm mt-1'>Send</span>
                                </div>
                            </footer>

                            {/* Comments section */}
                            {openComments[post.id] && (
                                <div className="mt-3 border-t pt-3">
                                    {/* Comment input */}
                                    <div className="flex gap-2 mb-3">
                                        <Input
                                            type="text"
                                            size="small"
                                            placeholder="Write a comment..."
                                            className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                            value={commentInputs[post.id] || ''}
                                            onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        />
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                                            onClick={() => handleComment(post.id)}
                                        >
                                            Comment
                                        </button>
                                    </div>

                                    {/* Comments list */}
                                    {post.comments && post.comments.length > 0 ? (
                                        <div className="space-y-3">
                                            {post.comments.map(comment => (
                                                <div key={comment.id} className="mb-3">
                                                    <div className="flex items-start gap-2">
                                                        <img src={comment.profilePic ? (comment.profilePic.startsWith('data:') ? comment.profilePic : `data:image/jpeg;base64,${comment.profilePic}`) : profile} alt="" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover flex-shrink-0 mt-1" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1">
                                                                <span className="font-semibold text-xs sm:text-sm">{comment.userName || 'User'}</span>
                                                                <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 mb-2">{comment.comment}</p>
                                                            <button className="text-blue-500 text-xs hover:text-blue-600 transition-colors" onClick={() => toggleReplies(comment.id)}>Reply</button>

                                                            {/* Reply input */}
                                                            {openReplies[comment.id] && (
                                                                <div className="flex gap-2 mt-2">
                                                                    <Input
                                                                        type="text"
                                                                        size="small"
                                                                        placeholder="Write a reply..."
                                                                        className="flex-1 border rounded-lg px-2 py-1 text-sm"
                                                                        value={replyInputs[comment.id] || ''}
                                                                        onChange={e => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                                                    />
                                                                    <button
                                                                        className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded-lg text-xs transition-colors"
                                                                        onClick={e => {
                                                                            e.preventDefault();
                                                                            const replyText = replyInputs[comment.id]?.trim();
                                                                            if (!replyText) return;
                                                                            setPosts(prevPosts => prevPosts.map(p =>
                                                                                p.id === post.id ? {
                                                                                    ...p,
                                                                                    comments: p.comments.map(c =>
                                                                                        c.id === comment.id ? {
                                                                                            ...c,
                                                                                            replies: c.replies ? [...c.replies, { id: Date.now(), userName: 'You', comment: replyText, createdAt: new Date().toISOString() }] : [{ id: Date.now(), userName: 'You', comment: replyText, createdAt: new Date().toISOString() }]
                                                                                        } : c
                                                                                    )
                                                                                } : p
                                                                            ));
                                                                            setReplyInputs(prev => ({ ...prev, [comment.id]: '' }));
                                                                        }}
                                                                    >Reply</button>
                                                                </div>
                                                            )}

                                                            {/* Replies list */}
                                                            {comment.replies && comment.replies.length > 0 && (
                                                                <div className="ml-4 mt-2 space-y-2">
                                                                    {comment.replies.map(reply => (
                                                                        <div key={reply.id} className="flex items-start gap-2">
                                                                            <div className="w-1 h-1 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                                                                            <div className="flex-1">
                                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1">
                                                                                    <span className="font-semibold text-xs">{reply.userName || 'User'}</span>
                                                                                    <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                                                </div>
                                                                                <p className="text-sm text-gray-700">{reply.comment}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-400 text-center py-2">No comments yet.</div>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}

                    {/* Pagination */}
                    {!loading && !error && posts.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center my-6 gap-1">
                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                                <button
                                    key={num}
                                    className={`px-2 sm:px-3 py-1 sm:py-2 rounded border text-xs sm:text-sm mx-0.5 transition-colors ${num === page
                                            ? 'bg-blue-500 text-white border-blue-500'
                                            : 'bg-white text-blue-500 border-blue-300 hover:bg-blue-100'
                                        }`}
                                    onClick={() => handlePageChange(num)}
                                    disabled={num === page}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* Right sidebar - hidden on mobile and tablet, visible on large screens */}
                <aside className="hidden xl:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
                    <FeedRightProfile />
                </aside>

                {/* Right spacer - hidden on mobile, visible on large screens */}
                <div className="hidden xl:block flex-grow max-w-[200px]"></div>
            </div>
        </MainLayout>
    );
}



