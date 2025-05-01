import { useEffect, useState } from "react";

import { Spinner } from "flowbite-react";

import Post from "../components/Post";

import useAuth from "../hooks/useAuth";
import Composer from "../components/Composer";
import { getPostByQuery } from "../api/postService.js";

function Feed() {
  const auth = useAuth();
  const [posts, setPosts] = useState([]);
  const [viewer, setViewer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.loggedIn) {
      auth
        .getUser()
        .then(async (user) => {
          setViewer(user);
          getPostByQuery("userId", user._id).then((postsResponse) => {
            setPosts(postsResponse.data);
            setLoading(false);
          });
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [auth]);

  const onPostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const onPostCreated = () => {
    // Refresh posts after creating a new one
    getPostByQuery("userId", viewer._id).then((postsResponse) => {
      setPosts(postsResponse.data);
    });
  };

  return (
    <div className="container mx-auto">
      <div className="m-4 grid w-full grid-cols-7 gap-6">
        <div className="col-span-2"></div>
        <div className="col-span-3">
          <div
            data-testid="profile-post-composer"
            className="mb-3 rounded-md bg-white p-4 shadow dark:border dark:border-gray-700 dark:bg-gray-800"
          >
            <Composer onSubmit={onPostCreated} mode="createPost" />
          </div>

          {loading ? (
            <Spinner aria-label="Extra large spinner example" size="xl" />
          ) : (
            posts?.map((post) => (
              <Post
                key={post._id}
                post={post}
                viewer={viewer}
                onDelete={onPostDeleted}
              />
            ))
          )}
        </div>
        <div className="col-span-2"></div>
      </div>
    </div>
  );
}

export default Feed;
