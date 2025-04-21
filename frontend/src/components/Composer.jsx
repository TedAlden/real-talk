import { useState } from "react";
import { createPost, updatePost } from "../api/postService.js";
import useAuth from "../hooks/useAuth.js";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import DOMPurify from "dompurify";

const MAX_POST_LENGTH = 5000;

const formats = ["bold", "italic", "underline", "list", "bullet", "link"];

function Composer({
  onSubmit,
  mode = "create",
  initialContent = "",
  prevID = "",
}) {
  const [postContent, setPostContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const auth = useAuth();
  const modules = {
    toolbar: isFocused
      ? [
          [
            "bold",
            "italic",
            "underline",
            { list: "ordered" },
            { list: "bullet" },
          ],
        ]
      : false,
  };

  const handleContentChange = (content) => {
    if (content.length <= MAX_POST_LENGTH) {
      setPostContent(content);
    }
  };

  const handleCreatePost = async (user, content) => {
    const post = {
      user_id: user._id,
      content: content,
      tags: ["test"],
    };

    setIsSubmitting(true);
    try {
      const response = await createPost(post);
      if (response.success !== false) {
        setPostContent("");
        onSubmit();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPost = async (user, content) => {
    const post = {
      content: content,
    };
    setIsSubmitting(true);
    try {
      const response = await updatePost(prevID, post);

      if (response.success !== false) {
        console.log(content);
        onSubmit(content);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    // Don't submit if empty or already submitting
    if (!postContent.trim() || isSubmitting) return;

    const user = await auth.getUser();
    const sanitizedContent = DOMPurify.sanitize(postContent);

    if (mode === "create") {
      handleCreatePost(user, sanitizedContent);
    } else if (mode === "edit") {
      handleEditPost(user, sanitizedContent);
    }
  };

  return (
    <>
      <style>
        {`
            .ql-container, .ql-toolbar {
              border: none !important;
              padding: 0 !important;
            }

            .ql-toolbar {
              border-bottom: 1px solid #424242 !important;
            }

            .ql-stroke, .ql-fill {
              stroke: #9CA3AF !important; /* gray-400 */
            }

            .ql-toolbar button:hover .ql-stroke, 
            .ql-toolbar button:hover .ql-fill, 
            .ql-toolbar button.ql-active .ql-stroke,
            .ql-toolbar button.ql-active .ql-fill {
              stroke: #3B82F6 !important; /* blue-500 */
            }

          
        `}
      </style>

      <div className="col-span-4 mb-3 rounded-md p-4 shadow dark:border dark:border-gray-700 dark:bg-gray-800">
        <div className="rounded-md p-1 dark:border dark:border-gray-700 dark:bg-gray-800">
          <ReactQuill
            value={postContent}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !postContent.trim()}
            className={`mt-2 w-full rounded-md bg-blue-500 p-2 text-sm font-medium text-white transition ${
              isSubmitting || !postContent.trim()
                ? "cursor-not-allowed opacity-70"
                : "hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
          {mode === "edit" && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !postContent.trim()}
              className={`mt-2 w-full rounded-md bg-red-500 p-2 text-sm font-medium text-white transition hover:bg-red-700`}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Composer;
