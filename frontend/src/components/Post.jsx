import { useEffect, useState } from "react";
import getTimeAgo from "../util/getTimeAgo";
import { FaCommentDots, FaHeart, FaShare, FaLink } from "react-icons/fa6";
import { likePost, getPostComments, deletePostById } from "../api/postService";
import DropdownMenu from "./DropdownMenu";
import Composer from "./Composer";
import { useCacheUpdater, useCachedUser } from "../hooks/useUserCache";
import Comment from "./Comment";
import Markdown from "react-markdown";
import { Popover, Carousel, createTheme } from "flowbite-react";
import { getSafeObject } from "../util/defaultObjects";

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
  const [postData, setPostData] = useState(post);

  const author = useCachedUser(post.user_id) || defaultUser;
  const updateCache = useCacheUpdater();

  useEffect(() => {
    const safePost = getSafeObject(post, "post");
    setLikes(safePost.likes);
    setComments(safePost.comments);
    setPostData(safePost);
  }, [post]);

  useEffect(() => {
    if (comments && commentsShown) {
      const commentorIds = comments.map((c) => c.user_id);
      updateCache(commentorIds);
    }
  }, [comments, commentsShown, updateCache]);

  const handleLike = async (postId, isLiked) => {
    try {
      const response = await likePost(postId, viewer._id, isLiked);

      if (response.success !== false) {
        setLikes(
          isLiked
            ? [...likes, viewer._id]
            : likes.filter((id) => id !== viewer._id),
        );
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

  const handleEditSubmit = (updatedContent) => {
    setPostData((prev) => ({
      ...prev,
      content: updatedContent,
      updated_at: new Date().toISOString(),
    }));
    setMode("view");
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
  const carouselTheme = createTheme({
    indicators: {
      active: {
        off: "bg-white/50 hover:bg-white shadow-lg dark:bg-gray-200/50 dark:hover:bg-gray-200",
        on: "bg-white dark:bg-gray-200 shadow-lg ",
      },
      base: "h-2 w-2 rounded-full",
      wrapper: "absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-3",
    },
    control: {
      base: "inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white sm:h-10 sm:w-10 dark:bg-gray-100/30 dark:group-hover:bg-gray-100/60 dark:group-focus:ring-gray-100/70",
      icon: "h-5 w-5 text-white sm:h-6 sm:w-6 dark:text-gray-900",
    },
  });
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
        <div>
          {postData.media && postData.media.length > 0 && (
            <Carousel
              theme={carouselTheme}
              slide={false}
              className="my-2 h-96 items-start"
            >
              {postData.media.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  className="h-full bg-gray-900 object-contain"
                />
              ))}
            </Carousel>
          )}
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
      ) : (
        <Composer
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

        <Popover
          aria-labelledby="default-popover"
          content={
            <div className="flex flex-col p-4 text-lg text-gray-800 dark:text-gray-100">
              <div className="mb-2 flex justify-center text-lg font-semibold">
                Share Post
              </div>
              <div className="-p-1 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <p className="bg-gray-700 p-1 px-3 text-gray-300">
                  {`${window.location.origin}/post/${post._id}`}
                </p>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/post/${post._id}`;
                    navigator.clipboard.writeText(url).then(() => {
                      const button = document.activeElement;
                      button.innerText = "Copied!";
                      setTimeout(() => {
                        button.innerText = "Copy";
                      }, 1500);
                    });
                  }}
                  className="bg-gray-500 p-2 px-4 font-semibold hover:bg-gray-100 dark:hover:bg-gray-400"
                >
                  Copy
                </button>
              </div>
            </div>
          }
        >
          <button
            className="m-0 flex flex-row items-center justify-center space-x-2 p-2"
            onClick={() => handleShare(post._id)}
          >
            <FaShare className="h-5 w-5 text-gray-500 hover:text-green-500" />
          </button>
        </Popover>
      </div>
      <div>
        {commentsShown && (
          <div className="flex flex-col space-y-2 p-2">
            {comments.map((comment, idx) => (
              <Comment
                key={idx}
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
