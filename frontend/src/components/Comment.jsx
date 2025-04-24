import { useCachedUser } from "../hooks/useUserCache";
import getTimeAgo from "../util/getTimeAgo";
import DropdownMenu from "./DropdownMenu";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { deleteComment } from "../api/postService";
import _ from "lodash";
import Composer from "./Composer";
import Markdown from "react-markdown";
const defaultUser = {
  _id: "",
  username: "Loading...",
  profile_picture:
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
};

export default function Comment({ postId, comment, onDelete }) {
  const auth = useAuth();
  const [viewer, setViewer] = useState(null);
  const [mode, setMode] = useState("view");
  const [commentData, setCommentData] = useState(comment);

  const commentor = useCachedUser(comment.user_id) || defaultUser;
  const commentWithPost = {
    ...commentData,
    post_id: postId,
  };

  useEffect(() => {
    setCommentData(comment);
  }, [comment]);

  useEffect(() => {
    auth.getUser().then((user) => {
      setViewer(user);
    });
  }, [auth]);

  const handleReportComment = (comment) => {
    console.log("Report comment:", comment._id);
  };

  const handleDeleteComment = async () => {
    try {
      const response = await deleteComment(postId, comment.comment_id);
      if (response.success !== false) {
        onDelete();
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleEditComment = () => {
    setMode("editComment");
  };

  const handleEditSubmit = (updatedContent) => {
    setCommentData((prev) => ({
      ...prev,
      content: updatedContent,
      updated_at: new Date().toISOString(),
    }));
    setMode("view");
  };

  const getCommentOptions = () => {
    const items = [];

    if (viewer?._id === commentor._id) {
      items.push({
        label: "Delete comment",
        action: handleDeleteComment,
      });
      items.push({
        label: "Edit comment",
        action: handleEditComment,
      });
    }

    items.push({
      label: "Report comment",
      action: () => handleReportComment,
    });

    return items;
  };

  return (
    <div className="flex items-start space-x-4 rounded-lg bg-gray-500 bg-opacity-10 p-2 pb-0">
      <a href={`/profile/${comment.user_id}`} className="shrink-0">
        <img
          className="mt-1 h-auto w-10 rounded-full object-cover shadow-lg"
          src={commentor.profile_picture}
          alt="Profile"
        />
      </a>
      <div className="flex flex-1 flex-col">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a
              href={`/profile/${comment.user_id}`}
              className="text-md font-semibold hover:underline"
            >
              @{commentor.username}
            </a>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getTimeAgo(comment.created_at)}
              {comment.updated_at !== comment.created_at &&
                ` (edited ${getTimeAgo(comment.updated_at)})`}
            </span>
          </div>

          <div className="ml-auto">
            <DropdownMenu items={getCommentOptions(comment)} />
          </div>
        </div>
        <div className="-mt-4">
          {mode === "view" ? (
            <div className="py-3">
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
                {commentData.content}
              </Markdown>
            </div>
          ) : (
            <Composer
              target={commentWithPost}
              mode={mode}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setMode("view");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
