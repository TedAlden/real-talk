import { useEffect, useState } from "react";

import { Spinner } from "flowbite-react";

import Post from "../components/Post";

import useAuth from "../hooks/useAuth";
import Composer from "../components/Composer";
import SuggestedUsers from "../components/SuggestedUsers";
import { getLatestFeed } from "../api/feeds.js";

function Feed() {
  const auth = useAuth();
  const [posts, setPosts] = useState([]);
  const [viewer, setViewer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.loggedIn) {
      auth.getUser().then(async (user) => {
        setViewer(user);
      });
    }
  }, [auth]);

  useEffect(() => {
    getLatestFeed().then((response) => {
      setPosts(response.data);
      setLoading(false);
    });
  }, []);

  const onPostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const onPostCreated = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  return (
    <div className="container mx-auto">
      <div className="mx-4 mt-4 grid w-full grid-cols-7 gap-6">
        <div className="col-span-2"></div>
        <div className="col-span-3">
          <div
            data-testid="profile-post-composer"
            className="mb-4 rounded-md bg-white p-4 shadow dark:border dark:border-gray-700 dark:bg-gray-800"
          >
            <Composer onSubmit={onPostCreated} mode="createPost" />
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <Spinner aria-label="Feed loading spinner" size="xl" />
            </div>
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
        <div className="col-span-2">
          <SuggestedUsers />
        </div>
      </div>
    </div>
  );
}

export default Feed;
