import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../../../components/layout/MainLayout.jsx";
import profile from "../../../assets/profile.png";
import addMediaIcon from "../../../assets/add-media.png";
import { BiCommentDetail, BiLike } from "react-icons/bi";
import { FaEllipsisH } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import { LiaShareSolid } from "react-icons/lia";
import dummyProfile3 from "../../../assets/dummyProfile3.jpg";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import FeedRightProfile from "./FeedRightProfile.jsx";
import feedApi from "../../../api/feedApi";
import uploadImageApi from "../../../api/uploadImageApi";
import useFeedApi from "../../../hooks/useFeedApi";
import { useNavigate } from "react-router-dom";

export default function FeedPage() {
  const { token, user } = useSelector((state) => state.auth);
  const {profile}= useSelector((state) => state.profile);

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

  const {
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
  } = useFeedApi();

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
      alert("User not logged in");
      return;
    }

    setPostingFeed(true);
    let imageUrl = "";

    try {
      if (imageFile) {
        setUploadingImage(true);
        const imageUrlResult = await uploadImageApi.uploadImage(
          imageFile,
          "feedImage",
          token
        );
        if (typeof imageUrlResult === "string" && imageUrlResult.length > 0) {
          imageUrl = imageUrlResult;
        } else if (
          imageUrlResult &&
          imageUrlResult.url &&
          imageUrlResult.url.length > 0
        ) {
          imageUrl = imageUrlResult.url[0];
        }
        setUploadingImage(false);
      }

      const payload = {
        user_id: user.id,
        image: imageUrl,
        caption,
      };

      await postFeed(payload);
      setCaption("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.log("Error while posting feed", err);
      alert("Failed to post feed. Please try again.");
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
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === post_id
            ? {
                ...post,
                comments: response.comments,
                comment_count: response.comment_count,
              }
            : post
        )
      );
      setCommentInputs((prev) => ({ ...prev, [post_id]: "" }));
    } catch (error) {
      alert("Failed to post comment");
      console.error("Error posting comment:", error);
    }
  };

  const toggleComments = (post_id) => {
    setOpenComments((prev) => ({ ...prev, [post_id]: !prev[post_id] }));
  };

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleShare = async (post) => {
    try {
      const encodedId = btoa(post.id.toString());
      const postUrl = `${window.location.origin}/feed/${encodedId}`;

      const shareData = {
        title: post.title || "Check out this post!",
        text: `${post.description?.slice(0, 120)}...`, // preview text
        url: postUrl,
      };

      if (navigator.share) {
        // Native share sheet (WhatsApp, FB, LinkedIn, etc.)
        await navigator.share(shareData);
      } else {
        // ✅ Fallback: copy text + URL
        await navigator.clipboard.writeText(
          `${post.title}\n${post.description}\n${postUrl}`
        );
        alert("Post details copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };
  const navigate = useNavigate();

  const handleOpenPost = (postId) => {
    const SECRET = process.env.REACT_APP_POST_SALT_SECRET; // same as backend
    const encodedId = btoa(`${postId}:${SECRET}`);
    navigate(`/feed/${encodedId}`);
  };

  return (
    <MainLayout>
      <div className="flex justify-center min-h-screen px-2 bg-gray-100 sm:px-4 md:px-6 lg:px-8">
        {/* Left spacer - hidden on mobile, visible on large screens */}
        <div className="hidden xl:block flex-grow max-w-[200px]"></div>

        {/* Main content section */}
        <section className="w-full max-w-[750px] p-2 mx-auto">
          {/* Create post card */}
          <div className="flex flex-col gap-3 p-3 mb-4 bg-white rounded-lg shadow-sm sm:p-4">
            <div className="flex items-center w-full gap-2">
              <img
                src={profile.user_profile_pic}
                alt="Profile"
                className="flex-shrink-0 w-10 h-10 rounded-full sm:w-12 sm:h-12"
              />
              <Input
                type="text"
                size="large"
                placeholder="Share something..."
                className="flex-1 h-12 border border-gray-400 rounded px-3 sm:px-4 w-full sm:min-w-[300px] md:min-w-[400px] lg:min-w-[500px] xl:min-w-[600px]"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 pl-12 sm:gap-3 sm:pl-14">
              <label className="flex items-center gap-2 p-1 transition-colors rounded cursor-pointer hover:bg-gray-50">
                <img src={addMediaIcon} alt="Add media" className="w-4 h-4" />
                <span className="text-xs text-gray-500 sm:text-sm">
                  Add media
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-12 h-12 ml-2 rounded-lg sm:w-16 sm:h-16"
                />
              )}
            </div>
            <Button
              className="px-3 py-2 ml-auto text-sm text-white transition-colors bg-blue-600 rounded-lg sm:px-4 hover:bg-blue-700 sm:text-base"
              size="small"
              onClick={handleFeedPost}
              disabled={uploadingImage}
            >
              {uploadingImage ? "Posting..." : "Post"}
            </Button>
          </div>

          {/* Loading and error states */}
          {loading && (
            <div className="py-8 text-center text-gray-600">Loading...</div>
          )}
          {error && (
            <div className="px-4 py-8 text-center text-red-500">{error}</div>
          )}
          {!loading && !error && posts.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              No posts found.
            </div>
          )}

          {/* Posts list */}
          {!loading &&
            !error &&
            posts.map((post) => (
              <article
                key={post.id}
                className="p-3 mb-4 bg-white border rounded-lg shadow-sm sm:p-4"
              >
                <header className="flex items-center gap-2 mb-3 sm:gap-3">
                  {/* Profile Picture */}
                  <img
                    src={
                      post.User?.profile_pic ? post.User.profile_pic : profile // fallback image
                    }
                    alt={post.User?.first_name || "User"}
                    className="flex-shrink-0 object-cover w-8 h-8 rounded-full sm:w-10 sm:h-10"
                  />

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <span className="text-sm font-semibold truncate">
                        {post.User?.first_name} {post.User?.last_name}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {post.user_role}
                    </div>
                  </div>

                  {/* Options Button */}
                  <span className="p-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-100">
                    <FaEllipsisH />
                  </span>
                </header>

                {/* Post image */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="rounded-lg object-cover w-[80%] h-80 sm:h-64 mb-3"
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
                    onClick={() => toggleComments(post.id)}
                  >
                    <BiCommentDetail className="text-lg sm:text-xl" />
                    <span className="mt-1 text-xs sm:text-sm">
                      Comment ({post.comment_count})
                    </span>
                  </div>
                  <div
                    className="flex flex-col items-center p-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => handleShare(post)}
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
                {openComments[post.id] && (
                  <div className="pt-3 mt-3 border-t">
                    {/* Comment input */}
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

                    {/* Comments list */}
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-3">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="mb-3">
                            <div className="flex items-start gap-2">
                              <img
                                src={
                                  comment.profile_pic
                                    ? comment.profile_pic.startsWith("data:")
                                      ? comment.profile_pic
                                      : `data:image/jpeg;base64,${comment.profile_pic}`
                                    : profile
                                }
                                alt=""
                                className="flex-shrink-0 object-cover w-6 h-6 mt-1 rounded-full sm:w-7 sm:h-7"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col gap-1 mb-1 sm:flex-row sm:items-center">
                                  <span className="text-xs font-semibold sm:text-sm">
                                    {comment.userName || "User"}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {new Date(
                                      comment.created_at
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="mb-2 text-sm text-gray-700">
                                  {comment.comment}
                                </p>
                                <button
                                  className="px-3 py-1 text-xs text-blue-500 transition-colors bg-white border rounded-lg hover:text-blue-600"
                                  onClick={() => toggleReplies(comment.id)}
                                >
                                  Reply
                                </button>

                                {/* Reply input */}
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
                                        setPosts((prevPosts) =>
                                          prevPosts.map((p) =>
                                            p.id === post.id
                                              ? {
                                                  ...p,
                                                  comments: p.comments.map(
                                                    (c) =>
                                                      c.id === comment.id
                                                        ? {
                                                            ...c,
                                                            replies: c.replies
                                                              ? [
                                                                  ...c.replies,
                                                                  {
                                                                    id: Date.now(),
                                                                    userName:
                                                                      "You",
                                                                    comment:
                                                                      replyText,
                                                                    created_at:
                                                                      new Date().toISOString(),
                                                                  },
                                                                ]
                                                              : [
                                                                  {
                                                                    id: Date.now(),
                                                                    userName:
                                                                      "You",
                                                                    comment:
                                                                      replyText,
                                                                    created_at:
                                                                      new Date().toISOString(),
                                                                  },
                                                                ],
                                                          }
                                                        : c
                                                  ),
                                                }
                                              : p
                                          )
                                        );
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

                                {/* Replies list */}
                                {comment.replies &&
                                  comment.replies.length > 0 && (
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
            ))}

          {/* Pagination */}
          {!loading && !error && posts.length > 0 && totalPages > 1 && (
            <div className="flex justify-center gap-1 my-6">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (num) => (
                  <button
                    key={num}
                    className={`px-2 sm:px-3 py-1 sm:py-2 rounded border text-xs sm:text-sm mx-0.5 transition-colors ${
                      num === page
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-blue-500 border-blue-300 hover:bg-blue-100"
                    }`}
                    onClick={() => handlePageChange(num)}
                    disabled={num === page}
                  >
                    {num}
                  </button>
                )
              )}
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
