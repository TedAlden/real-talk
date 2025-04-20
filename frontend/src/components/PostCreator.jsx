import { useState } from "react";
import { createPost } from "../api/postService.js";
import useAuth from "../hooks/useAuth.js";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import DOMPurify from "dompurify";

const MAX_POST_LENGTH = 5000;

const formats = ["bold", "italic", "underline", "list", "bullet", "link"];

function PostCreator({ onPostCreated }) {
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
      setErrorMessage("");
    } else {
      setErrorMessage(
        `Post exceeds maximum length of ${MAX_POST_LENGTH} characters`,
      );
    }
  };

  const handleSubmit = async () => {
    try {
      // Don't submit if empty or already submitting
      if (!postContent.trim() || isSubmitting) return;

      setIsSubmitting(true);
      const user = await auth.getUser();
      const sanitizedContent = DOMPurify.sanitize(postContent);

      const post = {
        user_id: user._id,
        content: sanitizedContent,
        tags: ["test"],
      };

      const response = await createPost(post);
      if (response.success !== false) {
        setPostContent("");
        onPostCreated();
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          {errorMessage && (
            <div className="mt-1 text-sm text-red-500">{errorMessage}</div>
          )}
        </div>

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
      </div>
    </>
  );
}

export default PostCreator;
