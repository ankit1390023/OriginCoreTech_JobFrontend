import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MainLayout from '../../../components/layout/MainLayout.jsx';
import profile from '../../../assets/profile.png';
import addMediaIcon from '../../../assets/add-media.png';
import { BiCommentDetail, BiLike } from "react-icons/bi";
import { FaEllipsisH } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import { LiaShareSolid } from "react-icons/lia";
import  Button  from '../../../components/ui/Button';
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
        }else{
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
            <div className="flex justify-center bg-gray-100 min-h-screen px-2 lg:px-8">
                <div className="hidden lg:block flex-grow"></div>
                <section className="w-full max-w-[600px] p-2 mx-auto">
                <div className="bg-white rounded flex flex-col gap-2 shadow-sm p-4 mb-4">
                        <div className="flex items-center gap-2 w-full">
                            <img src={profile} alt="Profile" className="w-12 h-12 rounded-full " />
                            <Input
                                type="text"
                                size="large"
                                placeholder="Share something..."
                                className="flex-1 h-12 border border-gray-400 rounded px-4 min-w-[500px]"
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center pl-14 gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <img src={addMediaIcon} alt="Add media" className="w-4 h-4" />
                                <span className="text-gray-500 text-sm">Add media</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded ml-2" />
                            )}
                        </div>
                        <Button
                            className="ml-auto px-4  bg-blue-600 text-white rounded"
                            size="small"
                            onClick={handleFeedPost}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? 'Posting...' : 'Post'}
                        </Button>
                    </div>
 
                    {loading && <div className="text-center py-8">Loading...</div>}
                    {error && <div className="text-center text-red-500 py-8">{error}</div>}
                    {!loading && !error && posts.length === 0 && (
                        <div className="text-center py-8">No posts found.</div>
                    )}
                    {!loading && !error && posts.map((post) => (
                        <article key={post.id} className="bg-white rounded border shadow-sm p-4 mb-4">
                            <header className="flex items-center gap-3 mb-2">
                                <img src={
                                    post.profilePic
                                        ? (post.profilePic.startsWith('data:') ? post.profilePic : `data:image/jpeg;base64,${post.profilePic}`)
                                        : post.User?.profilePic
                                            ? (post.User.profilePic.startsWith('data:') ? post.User.profilePic : `data:image/jpeg;base64,${post.User.profilePic}`)
                                            : profile
                                } alt={post.User?.firstName || 'User'} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1">
                                    <span className="font-semibold text-sm">{post.User?.firstName} {post.User?.lastName}</span>
                                    <span className="text-xs text-gray-400 ml-2">• {new Date(post.createdAt).toLocaleDateString()}</span>
                                    <div className="text-xs text-gray-500">{post.userRole}</div>
                                </div>
                                <span className="text-gray-500 text-xs cursor-pointer"><FaEllipsisH /></span>
                            </header>
                            {post.image && <img src={post.image} alt="Post" className="rounded-lg object-cover w-3/4 h-64 mb-2" />}
                            <p className="text-sm text-gray-700 mb-2">{post.caption}</p>
                            <footer className="flex flex-row justify-between text-sm text-gray-500 items-center py-2">
                                <div
                                    className={`flex flex-col items-center cursor-pointer ${(post.likedBy && post.likedBy.includes(user?.id)) ? 'text-blue-600' : ''}`}
                                    onClick={() => handleLike(post.id, user?.id)}
                                >
                                    <BiLike className='text-xl' />
                                    <span className='text-sm'>Like ({post.likeCount})</span>
                                </div>
                                <div className="flex flex-col items-center cursor-pointer" onClick={() => toggleComments(post.id)}>
                                    <BiCommentDetail className='text-xl' />
                                    <span className='text-sm'>Comment ({post.commentCount})</span>
                                </div>
                                <div className="flex flex-col items-center cursor-pointer">
                                    <LiaShareSolid className='text-xl' />
                                    <span className='text-sm'>Share</span>
                                </div>
                                <div className="flex flex-col items-center cursor-pointer">
                                    <TbSend className='text-xl' />
                                    <span className='text-sm'>Send</span>
                                </div>
                            </footer>
                            {openComments[post.id] && (
                                <div className="mt-2 border-t pt-2">
                                    <div className="flex gap-2 mb-2">
                                        <Input
                                            type="text"
                                            size="small"
                                            placeholder="Write a comment..."
                                            className="flex-1 border rounded px-2 py-1"
                                            value={commentInputs[post.id] || ''}
                                            onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        />
                                        <button
                                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                                            onClick={() => handleComment(post.id)}
                                        >
                                            Comment
                                        </button>
                                    </div>
                                    {post.comments && post.comments.length > 0 ? (
                                        post.comments.map(comment => (
                                            <div key={comment.id} className="mb-2 ml-2">
                                                <div className="flex items-center gap-2">
                                                    <img src={comment.profilePic ? (comment.profilePic.startsWith('data:') ? comment.profilePic : `data:image/jpeg;base64,${comment.profilePic}`) : profile} alt="" className="w-7 h-7 rounded-full object-cover" />
                                                    <span className="font-semibold text-xs">{comment.userName || 'User'}</span>
                                                    <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="ml-9">
                                                    <span className="text-sm">{comment.comment}</span>
                                                    <button className="ml-4 text-blue-500 text-xs" onClick={() => toggleReplies(comment.id)}>Reply</button>
                                                    {openReplies[comment.id] && (
                                                        <div className="flex gap-2 mt-1">
                                                            <Input
                                                                type="text"
                                                                size="small"
                                                                placeholder="Write a reply..."
                                                                className="flex-1 border rounded px-2 py-1"
                                                                value={replyInputs[comment.id] || ''}
                                                                onChange={e => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                                            />
                                                            <button
                                                                className="bg-blue-400 text-white px-2 py-1 rounded text-xs"
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
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <div className="ml-6 mt-1">
                                                            {comment.replies.map(reply => (
                                                                <div key={reply.id} className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold text-xs">{reply.userName || 'User'}</span>
                                                                    <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                                    <span className="text-sm">{reply.comment}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-gray-400 ml-2">No comments yet.</div>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}
                    {!loading && !error && posts.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center my-4 gap-1">
                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                                <button
                                    key={num}
                                    className={`px-3 py-1 rounded border text-sm mx-0.5 ${num === page ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-blue-500 border-blue-300 hover:bg-blue-100'}`}
                                    onClick={() => handlePageChange(num)}
                                    disabled={num === page}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    )}
                </section>
                <aside className="hidden lg:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
                    <FeedRightProfile />
                </aside>
                <div className="hidden lg:block flex-grow"></div>
            </div>
        </MainLayout>
    );
}



