import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Post from "../components/Post";
import Unauthorised from "../components/Unauthorised";
import useAuth from "../hooks/useAuth";
import { getPostById } from "../api/postService";
import { useCacheUpdater } from "../hooks/useUserCache";
import { getSafeObject } from "../util/defaultObjects";

/**
 * Displays a single post with focused comment highlighting
 * Handles post data fetching and viewer authentication
 */
function SinglePost() {
  // URL params and auth setup
  const paramId = useParams().id;
  const [searchParams] = useSearchParams();
  const focusedCommentId = searchParams.get("comment");
  
  // State management
  const auth = useAuth();
  const [viewer, setViewer] = useState(null);
  const [post, setPost] = useState(null);
  const updateCache = useCacheUpdater();

  useEffect(() => {
    if (post) {
      updateCache([post.user_id]);
    }
  }, [post, updateCache]);

  const fetchPostDate = useCallback(async () => {
    try {
      const response = await getPostById(paramId);
      if (response.success !== false) setPost(response.data);
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  }, [paramId]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await auth.getUser();

      setViewer(getSafeObject(user, "user"));
    };
    fetchUser();
    fetchPostDate();
  }, [auth, fetchPostDate]);

  if (!auth.loggedIn) return <Unauthorised />;

  if (!post) {
    return <div>Sorry! This post doesn't exist</div>;
  }

  return (
    <div className="m-4 mx-auto max-w-2xl">
      <Post
        post={post}
        viewer={viewer}
        onDelete={() => fetchPostDate()}
        focusedComment={focusedCommentId}
      />
      ;
    </div>
  );
}

export default SinglePost;
