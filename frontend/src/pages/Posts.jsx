import { useState, useEffect, useCallback } from "react";
import { getPostByQuery } from "../api/postService.js";
import { Spinner } from "flowbite-react";
import PostCreator from "../components/PostCreator.jsx";

function Posts({ userId, isCurrentUser }) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(false);

  const fetchPostData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPostByQuery("user_id", userId);
      if (response.success !== false) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const parseDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMin = (now - postDate) / (1000 * 60);
    const diffInHours = diffInMin / 60;
    const diffInDays = diffInHours / 24;

    if (diffInMin < 2) {
      return "Just now";
    } else if (diffInHours < 1) {
      const minutes = Math.floor(diffInMin);
      return `${minutes} minutes ago`;
    } else if (diffInDays < 1) {
      const hours = Math.floor(diffInHours);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 30) {
      const days = Math.floor(diffInDays);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const finalDate = postDate.toLocaleDateString(undefined, options);
      return `on ${finalDate}`;
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  return loading ? (
    <div className="p-16 text-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
    </div>
  ) : (
    <div>
      {isCurrentUser && <PostCreator onPostCreated={fetchPostData} />}
      {posts &&
        posts.map((post, index) => (
          <div
            key={index}
            className="col-span-4 mb-3 rounded-md bg-white p-4 shadow dark:border dark:border-gray-700 dark:bg-gray-800"
          >
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Posted {parseDate(post.created_at)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-900 dark:text-gray-100">
              {post.content}
            </p>
          </div>
        ))}
    </div>
  );
}

export default Posts;
