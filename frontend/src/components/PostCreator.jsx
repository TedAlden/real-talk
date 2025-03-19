import { useState } from "react";
import { createPost } from "../api/postService.js";
import useAuth from "../hooks/useAuth.js";

// Will update with rich text stuff later

function PostCreator({ onPostCreated }) {
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = useAuth();

  const handleSubmit = async () => {
    try {
      // Don't submit if empty or already submitting
      if (!postContent.trim() || isSubmitting) return;

      setIsSubmitting(true);
      const user = await auth.getUser();
      const post = {
        user_id: user._id,
        content: postContent,
        tags: ["test"],
      };

      const response = await createPost(post);
      if (response.success !== false) {
        setPostContent("");
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="col-span-4 mb-3 rounded-md bg-white p-4 shadow dark:border dark:border-gray-700 dark:bg-gray-800">
      <textarea
        className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        placeholder="Write your post here..."
        rows="4"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      ></textarea>
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
  );
}

export default PostCreator;
