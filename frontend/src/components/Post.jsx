import { useEffect, useState } from "react";
import getTimeAgo from "../util/getTimeAgo";
import { FaCommentDots, FaHeart, FaShare } from "react-icons/fa6";
import { likePost, getPostComments, deletePostById } from "../api/postService";
import DropdownMenu from "./DropdownMenu";
import Composer from "./Composer";
import { useCacheUpdater, useCachedUser } from "../hooks/useUserCache";
import Comment from "./Comment";
import Markdown from "react-markdown";

const defaultUser = {
  _id: "",
  username: "Loading...",
  profile_picture:
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
};

function Post({ post, viewer, onDelete }) {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsShown, setCommentsShown] = useState(false);
  const [mode, setMode] = useState("view");

  const author = useCachedUser(post.user_id) || defaultUser;
  const updateCache = useCacheUpdater();

  console.log("content", post.content);
  useEffect(() => {
    setLikes(post.likes);
    setComments(post.comments);
  }, [post.user_id, post.likes, post.comments]);

  useEffect(() => {
    console.log("Post mode:", mode);
  }, [mode]);

  useEffect(() => {
    if (comments && commentsShown) {
      const commentorIds = comments.map((c) => c.user_id);
      updateCache(commentorIds);
    }
  }, [comments, commentsShown, updateCache]);

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

  const fetchComments = async () => {
    try {
      const response = await getPostComments(post._id);
      if (response.success !== false) {
        setComments(response.data);
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

  const handleShare = async (postId) => {
    console.log("Shared post:", postId);
  };

  const handleDeletePost = async () => {
    try {
      const response = await deletePostById(post._id);
      if (response.success !== false) {
        // Call the parent component's callback to handle UI updates
        if (onDelete) {
          onDelete(post._id);
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPost = () => {
    setMode("editPost");
  };

  const handleReportPost = () => {
    console.log("Report post:", post._id);
  };

  const getPostOptions = () => {
    const items = [];

    if (viewer._id === post.user_id) {
      items.push({
        label: "Delete post",
        action: handleDeletePost,
      });
      items.push({
        label: "Edit post",
        action: handleEditPost,
      });
    }

    items.push({
      label: "Report post",
      action: () => handleReportPost,
    });

    return items;
  };

  const cardStyle =
    "p-4 bg-white rounded-md shadow dark:border dark:border-gray-700 dark:bg-gray-800";

  return (
    <div
      className={`col-span-4 mb-3 ${cardStyle} text-gray-900 dark:text-gray-100`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <a href={`/profile/${author?._id}`} className="shrink-0">
            <img
              className="h-auto w-12 rounded-full object-cover shadow-lg"
              src={author?.profile_picture}
              alt="Profile"
            />
          </a>
          <div className="min-w-0 flex-1">
            <a
              href={`/profile/${author?._id}`}
              className="text-lg font-semibold hover:underline"
            >
              @{author?.username}
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Posted {getTimeAgo(post.created_at)}
              {post.updated_at !== post.created_at &&
                ` (edited ${getTimeAgo(post.updated_at)})`}
            </p>
          </div>
        </div>
        <DropdownMenu items={getPostOptions()} />
      </div>
      {mode === "view" ? (
        <div className="p-3">
          <Markdown
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  className="bg-blue-600 bg-opacity-20 px-1 font-semibold text-blue-500 hover:text-blue-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          >
            {post.content}
          </Markdown>
        </div>
      ) : (
        <Composer
          target={post}
          mode={mode}
          onSubmit={() => {
            setMode("view");
          }}
          onCancel={() => {
            setMode("view");
          }}
        />
      )}

      <div className="flex items-center justify-around space-x-4 text-sm text-gray-500 dark:text-gray-400">
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
          <div className="flex flex-col space-y-2 p-2">
            {comments.map((comment) => (
              <Comment
                postId={post._id}
                comment={comment}
                onDelete={fetchComments}
              />
            ))}

            <Composer
              target={post}
              mode={"createComment"}
              onSubmit={fetchComments}
              className="-p-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
