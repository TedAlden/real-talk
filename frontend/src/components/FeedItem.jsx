import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCommentDots, FaHeart, FaRegHeart, FaShare } from "react-icons/fa";
import { likePost } from "../api/postService";
import { useCachedUser } from "../hooks/useUserCache";
import Markdown from "react-markdown";
import getTimeAgo from "../util/getTimeAgo";

// Default user to display while loading user data
const defaultUser = {
  _id: "",
  username: "Loading...",
  profile_picture:
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
};

/**
 * FeedItem component - Displays a single post in the feed with like/comment functionality
 * 
 * @param {Object} post - The post data to display
 * @param {Object} viewer - The current logged-in user
 * @param {Function} onDelete - Callback when post is deleted
 * @param {Function} onLike - Callback when post is liked/unliked
 */
function FeedItem({ post, viewer, onDelete, onLike }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState(null);
  
  // Fetch author data from cache
  const author = useCachedUser(post.user_id) || defaultUser;
  
  // Check if the post is liked by the viewer and update comments count
  useEffect(() => {
    setIsLiked(likes.includes(viewer?._id));
    setCommentsCount(post.comments?.length || 0);
  }, [likes, post.comments, viewer]);
  
  // Handle like/unlike action
  const handleLike = async () => {
    if (!viewer) return;
    
    // Prevent multiple clicks
    if (isLikeLoading) return;
    
    setIsLikeLoading(true);
    setLikeError(null);
    
    try {
      const response = await likePost(post._id, viewer._id, !isLiked);
      
      if (response.success === false) {
        throw new Error(response.message || "Failed to like post");
      }
      
      // Update likes state based on action
      const newLikes = isLiked
        ? likes.filter(id => id !== viewer._id)
        : [...likes, viewer._id];
      
      setLikes(newLikes);
      setIsLiked(!isLiked);
      
      // Call parent handler if provided
      if (onLike) {
        onLike(post._id, !isLiked);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setLikeError(error.message || "Failed to like post");
    } finally {
      setIsLikeLoading(false);
    }
  };
  
  return (
    <article className="mb-4 rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-lg dark:border dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-start">
        <Link to={`/profile/${author._id}`} className="mr-3 shrink-0">
          <img
            src={author.profile_picture}
            alt={`${author.username}'s profile`}
            className="h-10 w-10 rounded-full object-cover"
            loading="lazy"
          />
        </Link>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <Link 
              to={`/profile/${author._id}`} 
              className="font-semibold hover:underline"
              aria-label={`View ${author.username}'s profile`}
            >
              @{author.username}
            </Link>
            <time 
              dateTime={post.created_at} 
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {getTimeAgo(post.created_at)}
              {post.updated_at !== post.created_at && ` (edited ${getTimeAgo(post.updated_at)})`}
            </time>
          </div>
          
          <div className="mt-2 prose prose-sm max-w-none dark:prose-invert">
            <Markdown
              components={{
                a: ({ ...props }) => (
                  <a
                    {...props}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            >
              {post.content}
            </Markdown>
          </div>
        </div>
      </div>
      
      {/* Post action buttons */}
      <div className="mt-3 flex items-center justify-between border-t pt-3 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={isLikeLoading}
            className={`flex items-center space-x-1 rounded-md px-2 py-1 ${
              isLiked
                ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isLiked ? "Unlike" : "Like"}
            aria-pressed={isLiked}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
            <span>{likes.length}</span>
          </button>
          
          {/* Comments link */}
          <Link
            to={`/post/${post._id}`}
            className="flex items-center space-x-1 rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label={`${commentsCount} comments. View post`}
          >
            <FaCommentDots />
            <span>{commentsCount}</span>
          </Link>
          
          {/* Share button */}
          <button
            className="flex items-center space-x-1 rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label="Share post"
          >
            <FaShare />
          </button>
        </div>
        
        {/* View post link */}
        <Link
          to={`/post/${post._id}`}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          aria-label={`View full post by ${author.username}`}
        >
          View Post
        </Link>
      </div>
      
      {/* Like error message */}
      {likeError && (
        <div className="mt-2 text-sm text-red-500" role="alert">
          {likeError}
        </div>
      )}
    </article>
  );
}

export default FeedItem; 