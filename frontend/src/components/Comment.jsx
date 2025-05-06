import { useCachedUser } from "../hooks/useUserCache";
import getTimeAgo from "../util/getTimeAgo";
import DropdownMenu from "./DropdownMenu";
import { useState, useEffect } from "react";
import { deleteComment } from "../api/postService";
import _ from "lodash";
import Composer from "./Composer";
import Markdown from "react-markdown";
import ReportWindow from "./ReportWindow";
import { banTarget } from "../api/adminService";
import { Link } from "react-router-dom";

// Default user object for loading states
const defaultUser = {
  _id: "",
  username: "Loading...",
  profile_picture:
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
};

/**
 * A comment component that displays user comments with a dropdown menu
 * @param {string} postId - ID of the parent post
 * @param {Object} comment - Comment data including content and metadata
 * @param {Function} onDelete - Callback when comment is deleted
 * @param {Object} viewer - Current user viewing the comment
 */
export default function Comment({ postId, comment, onDelete, viewer }) {
  // State for handling comment display mode and data
  const [mode, setMode] = useState("view");
  const [commentData, setCommentData] = useState(comment);
  const [isReporting, setIsReporting] = useState(false);

  // Get user data for comment author
  const commentor = useCachedUser(comment.user_id) || defaultUser;

  // Combine comment data with post ID for reporting
  const commentWithPost = {
    ...commentData,
    post_id: postId,
  };

  // Update comment data when prop changes
  useEffect(() => {
    setCommentData(comment);
  }, [comment]);

  // Handler functions for comment actions
  const handleReportComment = () => {
    setIsReporting(true);
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

  const handleBanComment = async () => {
    try {
      if (!viewer?.is_admin) return;
      const response = await banTarget({
        targetType: "comment",
        targetId: commentData.comment_id,
        is_banned: !commentData.is_banned,
      });

      if (response.success !== false) {
        setCommentData((prev) => ({
          ...prev,
          is_banned: !prev.is_banned,
        }));
      }
    } catch (error) {
      console.error("Error banning post:", error);
    }
  };

  const handleEditSubmit = (updatedContent) => {
    setCommentData((prev) => ({
      ...prev,
      content: updatedContent,
      updated_at: new Date().toISOString(),
    }));
    setMode("view");
  };

  // Define options for dropdown menu based on viewer's role
  const commentOptions =
    viewer?._id === comment.user_id
      ? [
          // If the viewer is the author of the comment
          {
            label: "Edit comment",
            action: handleEditComment,
          },
          {
            label: "Delete comment",
            action: handleDeleteComment,
          },
        ]
      : [
          // If the viewer is not the author of the comment
          {
            label: "Report comment",
            action: handleReportComment,
          },
          ...(viewer?.is_admin
            ? [
                {
                  label: "Remove Comment",
                  action: handleBanComment,
                },
              ]
            : []),
        ];

  // Render banned comment message
  if (commentData.is_banned)
    return (
      <div
        data-testid="post"
        className="flex items-center justify-between bg-white p-4 text-lg text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      >
        <p>Comment has been removed.</p>
        {viewer?.is_admin && (
          <button
            className="rounded-md p-1 text-blue-600 hover:text-blue-400 dark:text-blue-500 dark:hover:text-blue-600"
            onClick={handleBanComment}
          >
            Undo
          </button>
        )}
      </div>
    );

  // Render comment component
  return (
    <>
      <div
        data-testid="comment"
        className="flex items-start space-x-4 rounded-lg bg-gray-500 bg-opacity-10 p-2 pb-0"
      >
        <Link to={`/profile/${comment.user_id}`} className="shrink-0">
          <img
            className="mt-1 h-auto w-10 rounded-full object-cover shadow-lg"
            src={commentor.profile_picture}
            alt="Profile"
          />
        </Link>
        <div className="flex flex-1 flex-col">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                to={`/profile/${comment.user_id}`}
                className="text-md font-semibold hover:underline"
              >
                @{commentor.username}
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {getTimeAgo(comment.created_at)}
                {comment.updated_at !== comment.created_at &&
                  ` (edited ${getTimeAgo(comment.updated_at)})`}
              </span>
            </div>

            <div className="ml-auto">
              <DropdownMenu items={commentOptions} />
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
      <ReportWindow
        visible={isReporting}
        targetType="comment"
        target={commentWithPost}
        onClose={() => {
          setIsReporting(false);
        }}
        reporter={viewer}
      />
    </>
  );
}
