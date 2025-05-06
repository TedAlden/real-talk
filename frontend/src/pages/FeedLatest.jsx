import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";

import useAuth from "../hooks/useAuth.js";
import useScrollingFeed from "../hooks/useScrollingFeed.js";

import Post from "../components/Post.jsx";
import Composer from "../components/Composer.jsx";
import SuggestedUsers from "../components/SuggestedUsers.jsx";
import Trending from "../components/Trending.jsx";

import { getLatestFeed } from "../api/feeds.js";

/**
 * Displays most recent posts in an infinite scrolling feed
 * Includes post composer and trending/suggested user sidebars
 */
function Feed() {
  const auth = useAuth();
  const [viewer, setViewer] = useState(null);

  // Initialize infinite scrolling feed with latest posts
  const { posts, feedLoading, hasMore, onPostDeleted, onPostCreated } =
    useScrollingFeed({
      viewer: viewer,
      postsPerPage: 5,
      fetchFeedFunction: getLatestFeed,
    });

  // Load viewer data on mount
  useEffect(() => {
    if (auth.loggedIn) {
      auth.getUser().then((user) => {
        setViewer(user);
      });
    }
  }, [auth]);

  return (
    <div className="container mx-auto">
      <div className="mx-4 mt-4 grid w-full grid-cols-7 gap-6">
        {/* Left sidebar - Trending topics */}
        <Trending className="col-span-2" />

        {/* Main content - Posts feed */}
        <div className="col-span-3">
          {/* Post composer */}
          <div
            data-testid="profile-post-composer"
            className="mb-4 rounded-md bg-white p-4 shadow dark:border dark:border-gray-700 dark:bg-gray-800"
          >
            <Composer onSubmit={onPostCreated} mode="createPost" />
          </div>

          {/* Posts list */}
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              viewer={viewer}
              onDelete={onPostDeleted}
            />
          ))}

          {/* Loading state */}
          {feedLoading && (
            <div className="p-4 text-center">
              <Spinner aria-label="Loading more posts" size="xl" />
            </div>
          )}

          {/* End of feed indicator */}
          {!hasMore && !feedLoading && (
            <div className="p-4 text-center text-gray-500">
              No more posts to load.
            </div>
          )}
        </div>

        {/* Right sidebar - Suggested users */}
        <div className="col-span-2">
          <SuggestedUsers viewer={viewer} />
        </div>
      </div>
    </div>
  );
}

export default Feed;
