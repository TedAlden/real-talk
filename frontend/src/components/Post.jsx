import { useEffect, useState } from "react";
import getTimeAgo from "../util/getTimeAgo";
import { FaCommentDots, FaHeart, FaShare } from "react-icons/fa6";
import {
  likePost,
  createPostComment,
  getPostComments,
} from "../api/postService";
import { Textarea } from "flowbite-react";

function Post({ post, viewer, userCache, updateUserCache }) {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentsShown, setCommentsShown] = useState(false);

  useEffect(() => {
    if (!userCache[post.user_id]) {
      updateUserCache([post.user_id]);
    }
  }, [post, userCache, updateUserCache]);

  useEffect(() => {
    setLikes(post.likes);
    setComments(post.comments);
  }, [post.likes, post.comments]);

  const handleLike = async (postId, isLiked) => {
    try {
      const response = await likePost(postId, viewer._id, isLiked);
      const prevLikes = likes;
      setLikes(
        isLiked
          ? [...prevLikes, viewer._id]
          : prevLikes.filter((id) => id !== viewer._id),
      );

      if (response.success == false) {
        setLikes(prevLikes);
      }
    } catch (error) {
      console.error("Error (un)liking post:", error);
    }
  };

  const getUserData = (userId) => {
    return (
      userCache[userId] || {
        username: "Loading...",
        profile_picture: "/default-avatar.png",
      }
    );
  };

  const fetchComments = async () => {
    try {
      const response = await getPostComments(post._id);
      if (response.success !== false) {
        const commentorIds = response.data.map((c) => c.user_id);
        setComments(response.data);
        updateUserCache(commentorIds);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleShowComments = () => {
    const newVisibility = !commentsShown;
    setCommentsShown(newVisibility);
    if (newVisibility) {
      fetchComments();
    }
  };

  const handleCreateComment = async () => {
    try {
      const newComment = {
        userId: viewer._id,
        content: commentContent,
      };
      const response = await createPostComment(post._id, newComment);
      if (response.success !== false) {
        fetchComments();
        setCommentContent("");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleShare = async (postId) => {
    console.log("Shared post:", postId);
  };

  return (
    <div className="col-span-4 mb-3 rounded-md bg-white px-4 pb-1 pt-4 shadow dark:border dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <a href={`/profile/${post.user_id}`} className="shrink-0">
          <img
            className="h-auto w-12 rounded-full object-cover shadow-lg"
            src={userCache[post.user_id]?.profile_picture}
            alt="Profile"
          />
        </a>
        <div className="min-w-0 flex-1">
          <a
            href={`/profile/${post.user_id}`}
            className="text-lg font-semibold hover:underline"
          >
            @{userCache[post.user_id]?.username}
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Posted {getTimeAgo(post.created_at)}
          </p>
        </div>
      </div>
      <div className="text-md mt-4 leading-relaxed text-gray-900 dark:text-gray-100">
        {post.content}
      </div>

      <div className="mt-2 flex items-center justify-around space-x-4 text-sm text-gray-500 dark:text-gray-400">
        <button
          className="m-0 flex flex-row items-center justify-items-center space-x-2 p-2"
          onClick={() => handleLike(post._id, !likes.includes(viewer._id))}
        >
          <FaHeart
            className={`h-5 w-5 ${likes.includes(viewer._id) ? "text-red-500 hover:text-red-800" : "text-gray-500 hover:text-red-500"}`}
          />
          <span>{likes.length}</span>
        </button>

        <button
          className="m-0 flex flex-row items-center justify-items-center space-x-2 p-2"
          onClick={() => handleShowComments()}
        >
          <FaCommentDots className="h-5 w-5 text-gray-500 hover:text-blue-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {comments.length}
          </p>
        </button>

        <button
          className="m-0 flex flex-row items-center justify-items-center space-x-2 p-2"
          onClick={() => handleShare(post._id)}
        >
          <FaShare className="h-5 w-5 text-gray-500 hover:text-green-500" />
        </button>
      </div>
      <div>
        {commentsShown && (
          <div className="mt-4 flex flex-col space-y-2">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {comments.map((comment, index) => (
                <li key={index} className="flex items-center space-x-4 p-4">
                  <a href={`/profile/${comment.user_id}`} className="shrink-0">
                    <img
                      className="h-auto w-10 rounded-full object-cover shadow-lg"
                      src={getUserData(comment.user_id)?.profile_picture}
                      alt="Profile"
                    />
                  </a>
                  <div className="flex flex-col items-start">
                    <div className="flex min-w-0 flex-row items-center space-x-2">
                      <a
                        href={`/profile/${comment.user_id}`}
                        className="text-sm font-semibold hover:underline"
                      >
                        @{getUserData(comment.user_id)?.username}
                      </a>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(comment.created_at)}
                      </div>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Textarea
              className="mt-2 w-full resize-none rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
              placeholder="Add a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button
              className="mt-2 rounded-md bg-blue-500 px-4 py-1 text-sm font-medium text-white hover:bg-blue-600"
              onClick={() => handleCreateComment()}
            >
              Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
