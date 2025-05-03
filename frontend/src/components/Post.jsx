import { useEffect, useState } from "react";
import { FaCommentDots, FaHeart, FaShare, FaLink } from "react-icons/fa6";
import Markdown from "react-markdown";
import { Popover } from "flowbite-react";

import { likePost, getPostComments, deletePostById } from "../api/postService";
import { useCacheUpdater } from "../hooks/useUserCache";
import getTimeAgo from "../util/getTimeAgo";

import DropdownMenu from "./DropdownMenu";
import Composer from "./Composer";
import Comment from "./Comment";
import PostCarousel from "./PostCarousel";

function Post({ post, viewer, onDelete }) {
  const [postData, setPostData] = useState(post);
  const [commentsShown, setCommentsShown] = useState(false);
  const [mode, setMode] = useState("view");

  const updateCache = useCacheUpdater(postData._id);

  useEffect(() => {
    if (postData.comments && commentsShown) {
      const commentorIds = postData.comments.map((comment) => comment.user_id);
      updateCache(commentorIds);
    }
  }, [postData, commentsShown, updateCache]);

  const handleLike = async (postId, isLiked) => {
    if (!viewer) return;

    likePost(postId, viewer._id, isLiked)
      .then((response) => {
        if (response.success !== false) {
          setPostData((prev) => ({
            ...prev,
            likes: isLiked
              ? [...prev.likes, viewer._id]
              : prev.likes.filter((id) => id !== viewer._id),
          }));
        }
      })
      .catch((error) => {
        console.error("Error liking post:", error);
      });
  };

  const fetchComments = async () => {
    getPostComments(postData._id)
      .then((response) => {
        if (response.success !== false) {
          setPostData((prev) => ({
            ...prev,
            comments: response.data,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  const handleShowComments = () => {
    const newVisibility = !commentsShown;
    setCommentsShown(newVisibility);
    if (newVisibility) {
      fetchComments();
    }
  };

  const handleDeletePost = async () => {
    deletePostById(postData._id)
      .then((response) => {
        if (response.success !== false) {
          // Call the parent component's callback to handle UI updates
          if (onDelete) {
            onDelete(postData._id);
          }
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  const handleEditPost = () => {
    setMode("editPost");
  };

  const handleEditSubmit = (updatedContent) => {
    setPostData((prev) => ({
      ...prev,
      content: updatedContent,
      updated_at: new Date().toISOString(),
    }));
    setMode("view");
  };

  const handleReportPost = () => {
    // TODO: Implement this when admin pages exist

    console.log("Report post:", postData._id);
  };

  const handleCopyPostUrl = () => {
    const url = `${window.location.origin}/post/${postData._id}`;
    navigator.clipboard.writeText(url).then(() => {
      const button = document.activeElement;
      button.innerText = "Copied!";
      setTimeout(() => {
        button.innerText = "Copy";
      }, 1500);
    });
  };

  const postOptions =
    viewer?._id === postData.user_id
      ? [
          // If the viewer is the author of the post
          {
            label: "Edit post",
            action: handleEditPost,
          },
          {
            label: "Delete post",
            action: handleDeletePost,
          },
        ]
      : [
          // If the viewer is not the author of the post
          {
            label: "Report post",
            action: handleReportPost,
          },
        ];

  return (
    <div
      data-testid="post"
      className="col-span-4 mb-4 rounded-md bg-white p-4 text-gray-900 shadow dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <a href={`/profile/${postData.poster?._id}`} className="shrink-0">
            <img
              data-testid="post-profile-picture"
              className="h-auto w-16 rounded-full object-cover shadow-lg"
              src={postData.poster?.profile_picture}
              alt="Profile Picture"
            />
          </a>
          <div className="min-w-0 flex-1">
            <a
              href={`/profile/${postData.poster?._id}`}
              className="text-lg font-semibold hover:underline"
              data-testid="post-username"
            >
              @{postData.poster?.username}
            </a>
            <p
              data-testid="post-timestamp"
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              Posted {getTimeAgo(postData.created_at)}
              {postData.updated_at !== postData.created_at &&
                ` (edited ${getTimeAgo(postData.updated_at)})`}
            </p>
          </div>
        </div>
        <DropdownMenu items={postOptions} />
      </div>
      {mode === "view" ? (
        <div data-testid="post-content">
          {postData.media && postData.media.length > 0 && (
            <PostCarousel images={postData.media} />
          )}
          <div data-testid="post-text" className="p-4">
            <Markdown
              components={{
                a: ({ ...props }) => (
                  <a
                    {...props}
                    className="bg-blue-400 bg-opacity-50 px-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            >
              {postData.content}
            </Markdown>
          </div>
        </div>
      ) : (
        <Composer
          data-testid="post-editor"
          target={postData}
          mode={mode}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setMode("view");
          }}
        />
      )}

      <div className="flex items-center justify-around space-x-4 text-sm text-gray-500 dark:text-gray-400">
        <button
          data-testid="post-like-button"
          className="m-0 flex flex-row items-center justify-items-center space-x-2 p-2"
          onClick={() =>
            handleLike(postData._id, !postData.likes.includes(viewer?._id))
          }
        >
          <FaHeart
            className={`h-5 w-5 ${postData.likes.includes(viewer?._id) ? "text-red-500 hover:text-red-800" : "text-gray-500 hover:text-red-500"}`}
          />
          <span>{postData.likes.length}</span>
        </button>

        <button
          className="m-0 flex flex-row items-center justify-items-center space-x-2 p-2"
          onClick={handleShowComments}
          data-testid="post-comment-button"
        >
          <FaCommentDots className="h-5 w-5 text-gray-500 hover:text-blue-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {postData.comments.length}
          </p>
        </button>

        <Popover
          aria-labelledby="default-popover"
          content={
            <div className="flex flex-col p-4 text-lg text-gray-800 dark:text-gray-100">
              <div className="mb-2 flex justify-center text-lg font-semibold">
                Share Post
              </div>
              <div className="-p-1 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <p
                  data-testid="post-share-url"
                  className="bg-gray-700 p-1 px-3 text-gray-300"
                >
                  {`${window.location.origin}/post/${postData._id}`}
                </p>
                <button
                  data-testid="post-share-copy-url-btn"
                  onClick={handleCopyPostUrl}
                  className="bg-gray-500 p-2 px-4 font-semibold hover:bg-gray-100 dark:hover:bg-gray-400"
                >
                  Copy
                </button>
              </div>
            </div>
          }
        >
          <button
            data-testid="post-share-btn"
            className="m-0 flex flex-row items-center justify-center space-x-2 p-2"
          >
            <FaShare className="h-5 w-5 text-gray-500 hover:text-green-500" />
          </button>
        </Popover>
      </div>
      <div>
        {commentsShown && (
          <div className="flex flex-col space-y-2 p-2">
            {postData.comments.map((comment, idx) => (
              <Comment
                key={idx}
                postId={postData._id}
                comment={comment}
                onDelete={fetchComments}
              />
            ))}

            <Composer
              data-testid="post-comment-composer"
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
