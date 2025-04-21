import { useCachedUser } from "../hooks/useUserCache";
import getTimeAgo from "../util/getTimeAgo";
import DropdownMenu from "./DropdownMenu";

const defaultUser = {
  _id: "",
  username: "Loading...",
  profile_picture:
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
};

export default function Comment({ comment }) {
  const commentor = useCachedUser(comment.user_id) || defaultUser;

  const handleReportComment = (comment) => {
    console.log("Report comment:", comment._id);
  };

  const handleDeleteComment = (comment) => {
    console.log("Delete comment:", comment._id);
  };

  const handleEditComment = (comment) => {
    console.log("Edit comment:", comment._id);
  };

  const getCommentOptions = (comment) => {
    const options = [
      {
        label: "Edit Comment",
        action: () => handleEditComment(comment),
      },
      {
        label: "Delete Comment",
        action: () => handleDeleteComment(comment),
      },
      {
        label: "Report Comment",
        action: () => handleReportComment(comment),
      },
    ];

    return options;
  };

  return (
    <li key={comment._id} className="flex items-center space-x-4 p-4">
      <a href={`/profile/${comment.user_id}`} className="shrink-0">
        <img
          className="h-auto w-10 rounded-full object-cover shadow-lg"
          src={commentor.profile_picture}
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
              @{commentor.username}
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
  );
}
