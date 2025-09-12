import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../../../components/layout/MainLayout.jsx";
import profile from "../../../assets/profile.png";
import FeedRightProfile from "../feed/FeedRightProfile";
import { BiCommentDetail, BiLike } from "react-icons/bi";
import { FaEllipsisH } from "react-icons/fa";
import { LiaShareSolid } from "react-icons/lia";
import { TbSend } from "react-icons/tb";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import feedApi from "../../../api/feedApi.js";
import { getImageUrl } from "../../../../utils.js";
import { useParams } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
import useFeedApi from "../../../hooks/useFeedApi"; // Add this import

export default function FeedPostDetail() {
  const { slug } = useParams();
  const { token, user } = useSelector((state) => state.auth);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comments states
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState(false);
  const [openReplies, setOpenReplies] = useState({});
  const [replyInputs, setReplyInputs] = useState({});

  // Use the feed API hook for consistent like handling
  const { handleLike: handleFeedLike } = useFeedApi();

  // Fetch post by slug
  useEffect(() => {
    const fetchPost = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await feedApi.getPostBySlug(slug, token);
        console.log("detail page",response);
        setPost(response);
      } catch (err) {
        setError("Post not found or failed to load.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, token]);

  // Like handler - updated to use the feed API hook
  const handleLike = (postId, userId) => {
    if (!token) return;
    
    // Use the same handleLike function from useFeedApi
    handleFeedLike(postId, userId);
    
    // Also update local state for immediate UI feedback
    setPost(prev => {
      if (!prev) return prev;
      
      const isCurrentlyLiked = prev.likedBy && prev.likedBy.includes(userId);
      const newLikeCount = isCurrentlyLiked ? prev.like_count - 1 : prev.like_count + 1;
      
      return {
        ...prev,
        likedBy: isCurrentlyLiked 
          ? prev.likedBy.filter(id => id !== userId)
          : [...(prev.likedBy || []), userId],
        like_count: newLikeCount,
        isLiked: !isCurrentlyLiked
      };
    });
  };

  // Comment handler
  const handleComment = async (post_id) => {
    if (!token || !user) {
      alert("User not logged in");
      return;
    }
    const commentText = commentInputs[post_id]?.trim();
    if (!commentText) return;
    try {
      const response = await feedApi.postComment(
        post_id,
        {
          user_id: Number(user.id),
          comment: commentText,
        },
        token
      );
      setPost((prev) => ({
        ...prev,
        comments: response.comments,
        comment_count: response.comment_count,
      }));
      setCommentInputs((prev) => ({ ...prev, [post_id]: "" }));
    } catch (error) {
      alert("Failed to post comment");
      console.error("Error posting comment:", error);
    }
  };

  // Toggle comments section
  const toggleComments = () => {
    setOpenComments(!openComments);
  };

  // Toggle replies for a comment
  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // Share handler 
  const handleShare = async () => {
    if (!post?.slug) {
      alert("This post cannot be shared.");
      return;
    }

    const postUrl = `${window.location.origin}/feed-post/${post.slug}`;
    const shareText = post.caption?.slice(0, 120) || "Check out this post!";

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check this out!",
          text: shareText,
          url: postUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n\n${postUrl}`);
        alert("Post link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      prompt("Copy to share:", `${shareText}\n\n${postUrl}`);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center min-h-screen p-4 bg-gray-100">
          <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow">
            <div className="py-8 text-center text-gray-600">
              Loading post...
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="flex justify-center min-h-screen p-4 bg-gray-100">
          <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow">
            <div className="px-4 py-8 text-center text-red-500">
              {error || "Post not found."}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen px-2 bg-gray-100 sm:px-4 md:px-6 lg:px-8">
        {/* Left spacer */}
        <div className="hidden xl:block flex-grow max-w-[200px]"></div>

        {/* Main content */}
        <section className="w-full max-w-[750px] p-2 mx-auto">
          <article className="p-3 mb-4 bg-white border rounded-lg shadow-sm sm:p-4">
            {/* Post header */}
            <header className="flex items-center gap-2 mb-3 sm:gap-3">
              <img
                src={
                  post.User?.profile_pic? getImageUrl(post.User.profile_pic): profile
                }
                alt={post.User?.first_name || "User"}
                className="flex-shrink-0 object-cover w-8 h-8 rounded-full sm:w-10 sm:h-10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-sm font-semibold truncate">
                    {post.User?.first_name} {post.User?.last_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    • {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{post.user_role}</div>
              </div>
              <span className="p-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-100">
                <FaEllipsisH />
              </span>
            </header>

            {/* Post image */}
            {post.image && (
              <img
                src={getImageUrl(post.image)}
                alt="Post"
                className="object-cover w-full h-auto mb-3 rounded-lg max-h-96"
              />
            )}

            {/* Post caption */}
            <p className="mb-3 text-sm leading-relaxed text-gray-700">
              {post.caption}
            </p>

            {/* Post actions footer */}
            <footer className="flex items-center justify-between py-2 text-sm text-gray-500 border-t">
              <div
                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                  post.likedBy && post.likedBy.includes(user?.id)
                    ? "text-blue-600"
                    : ""
                }`}
                onClick={() => handleLike(post.id, user?.id)}
              >
                <BiLike className="text-lg sm:text-xl" />
                <span className="mt-1 text-xs sm:text-sm">
                  Like ({post.like_count})
                </span>
              </div>
              <div
                className="flex flex-col items-center p-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={toggleComments}
              >
                <BiCommentDetail className="text-lg sm:text-xl" />
                <span className="mt-1 text-xs sm:text-sm">
                  Comment ({post.comment_count})
                </span>
              </div>
              <div
                className="flex flex-col items-center p-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={handleShare}
              >
                <LiaShareSolid className="text-lg sm:text-xl" />
                <span className="mt-1 text-xs sm:text-sm">Share</span>
              </div>
              <div className="flex flex-col items-center p-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-50">
                <TbSend className="text-lg sm:text-xl" />
                <span className="mt-1 text-xs sm:text-sm">Send</span>
              </div>
            </footer>

            {/* Comments section */}
            {openComments && (
              <div className="pt-3 mt-3 border-t">
                <div className="flex gap-2 mb-3">
                  <Input
                    type="text"
                    size="small"
                    placeholder="Write a comment..."
                    className="flex-1 px-3 py-2 text-sm border rounded-lg"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="px-1 py-2 text-blue-500 bg-white border rounded-lg"
                    onClick={() => handleComment(post.id)}
                  >
                    Comment
                  </button>
                </div>

                {post.comments && post.comments.length > 0 ? (
                  <div className="space-y-3">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="mb-3">
                        <div className="flex items-start gap-2">
                          <img
                            src={
                              comment.profile_pic? getImageUrl(comment.profile_pic) : profile
                            }
                            alt=""
                            className="flex-shrink-0 object-cover w-6 h-6 mt-1 rounded-full sm:w-7 sm:h-7"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-1 mb-1 sm:flex-row sm:items-center">
                              <span className="text-xs font-semibold sm:text-sm">
                                {comment.first_name || "User"}{" "}
                                {comment.last_name}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  comment.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mb-2 text-sm text-gray-700">
                              {comment.text || comment.comment}
                            </p>
                            <button
                              className="px-3 py-1 text-xs text-blue-500 transition-colors bg-white border rounded-lg hover:text-blue-600"
                              onClick={() => toggleReplies(comment.id)}
                            >
                              Reply
                            </button>

                            {openReplies[comment.id] && (
                              <div className="flex gap-2 mt-2">
                                <Input
                                  type="text"
                                  size="small"
                                  placeholder="Write a reply..."
                                  className="flex-1 px-2 py-1 text-sm border rounded-lg"
                                  value={replyInputs[comment.id] || ""}
                                  onChange={(e) =>
                                    setReplyInputs((prev) => ({
                                      ...prev,
                                      [comment.id]: e.target.value,
                                    }))
                                  }
                                />
                                <button
                                  className="px-4 py-1 text-xs text-blue-500 transition-colors bg-white border rounded-lg "
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const replyText =
                                      replyInputs[comment.id]?.trim();
                                    if (!replyText) return;
                                    setPost((prev) => ({
                                      ...prev,
                                      comments: prev.comments.map((c) =>
                                        c.id === comment.id
                                          ? {
                                              ...c,
                                              replies: c.replies
                                                ? [
                                                    ...c.replies,
                                                    {
                                                      id: Date.now(),
                                                      userName: "You",
                                                      comment: replyText,
                                                      created_at:
                                                        new Date().toISOString(),
                                                    },
                                                  ]
                                                : [
                                                    {
                                                      id: Date.now(),
                                                      userName: "You",
                                                      comment: replyText,
                                                      created_at:
                                                        new Date().toISOString(),
                                                    },
                                                  ],
                                            }
                                          : c
                                      ),
                                    }));
                                    setReplyInputs((prev) => ({
                                      ...prev,
                                      [comment.id]: "",
                                    }));
                                  }}
                                >
                                  Reply
                                </button>
                              </div>
                            )}

                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-2 ml-4 space-y-2">
                                {comment.replies.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="flex items-start gap-2"
                                  >
                                    <div className="flex-shrink-0 w-1 h-1 mt-2 bg-gray-300 rounded-full"></div>
                                    <div className="flex-1">
                                      <div className="flex flex-col gap-1 mb-1 sm:flex-row sm:items-center">
                                        <span className="text-xs font-semibold">
                                          {reply.userName || "User"}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          {new Date(
                                            reply.created_at
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700">
                                        {reply.comment}
                                      </p>
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
                  <div className="py-2 text-xs text-center text-gray-400">
                    No comments yet.
                  </div>
                )}
              </div>
            )}
          </article>
        </section>

        {/* Right sidebar */}
        <aside className="hidden xl:block w-full max-w-[350px] p-2 sticky top-4 h-fit">
          <FeedRightProfile></FeedRightProfile>
        </aside>

        {/* Right spacer */}
        <div className="hidden xl:block flex-grow max-w-[200px]"></div>
      </div>
    </MainLayout>
  );
}