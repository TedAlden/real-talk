import { use, useEffect, useState } from "react";
import getTimeAgo from "../util/getTimeAgo";
import { FaCommentDots, FaHeart, FaShare } from "react-icons/fa6";
import {
  likePost,
  createPostComment,
  getPostComments,
  deletePostById,
} from "../api/postService";
import { Textarea } from "flowbite-react";
import DropdownMenu from "./DropdownMenu";
import PostCreater from "./PostCreator";
import { useCacheUpdater, useCachedUser } from "../hooks/useUserCache";

const defaultUser = {
  _id: "",
  username: "Loading...",
  profile_picture:
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
};

function Post({ post, viewer, onDelete }) {
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentsShown, setCommentsShown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useCacheUpdater([post.user_id]);
  const author = useCachedUser(post.user_id) || defaultUser;

  useEffect(() => {
    setLikes(post.likes);
    setComments(post.comments);
    setPostContent(post.content);
  }, [post.user_id, post.likes, post.comments, post.content]);

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
    setIsEditing(true);
  };

  const handleEditSubmit = async (content) => {
    setPostContent(content);
    setIsEditing(false);
  };

  const handleReportPost = () => {
    console.log("Report post:", post._id);
  };
  const handleReportComment = (comment) => {
    console.log("Report comment:", comment._id);
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

  return (
    <div className="col-span-4 mb-3 rounded-md bg-white px-4 pb-1 pt-4 shadow dark:border dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
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
            </p>
          </div>
        </div>
        <DropdownMenu items={getPostOptions()} />
      </div>
      {isEditing ? (
        <PostCreater
          initialContent={post.content}
          mode="edit"
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
          prevID={post._id}
        />
      ) : (
        <PostCreater
          initialContent={postContent}
          mode="read"
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditing(false);
          }}
          prevID={post._id}
          className="mt-2"
        />
      )}

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
          <div className="mt-4 flex flex-col space-y-2 p-2">
            <ul className="divide-y divide-gray-200 border border-0 border-t border-t-gray-200 dark:divide-gray-700 dark:border-t-gray-700">
              {comments.map((comment, index) => (
                <li key={index} className="flex items-center space-x-4 p-4">
                  <a href={`/profile/${comment.user_id}`} className="shrink-0">
                    <img
                      className="h-auto w-10 rounded-full object-cover shadow-lg"
                      src={getUserData(comment.user_id)?.profile_picture}
                      alt="Profile"
                    />
                  </a>
                  <div className="flex flex-1 flex-col">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`/profile/${comment.user_id}`}
                          className="text-sm font-semibold hover:underline"
                        >
                          @{getUserData(comment.user_id)?.username}
                        </a>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getTimeAgo(comment.created_at)}
                        </span>
                      </div>

                      <div className="ml-auto">
                        <DropdownMenu items={getCommentOptions(comment)} />
                      </div>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Textarea
              className="w-full resize-none rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
              placeholder="Add a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button
              className="rounded-md bg-blue-500 px-4 py-1 text-sm font-medium text-white hover:bg-blue-600"
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
