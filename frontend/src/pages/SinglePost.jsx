import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Post from "../components/Post";
import useAuth from "../hooks/useAuth";
import { getPostById } from "../api/postService";
import { useCacheUpdater } from "../hooks/useUserCache";

function SinglePost() {
  const paramId = useParams().id;
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
    fetchPostDate();
    setViewer(auth.getUser());
  }, [auth, fetchPostDate]);

  if (!post) {
    return <div>Sorry! This post doesn't exist</div>;
  }

  return (
    <div className="m-4 mx-auto max-w-2xl">
      <Post post={post} viewer={viewer} onDelete={() => fetchPostDate()} />;
    </div>
  );
}

export default SinglePost;
