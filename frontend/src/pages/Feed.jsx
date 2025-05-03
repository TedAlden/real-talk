import { useEffect, useState, useCallback, useRef } from "react";
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
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const POSTS_PER_PAGE = 5;

  const firstLoad = useRef(true);

  useEffect(() => {
    if (auth.loggedIn) {
      auth.getUser().then((user) => {
        setViewer(user);
      });
    }
  }, [auth]);

  const fetchPosts = useCallback(
    async (pageNumber) => {
      if (loading) return;
      setLoading(true);
      try {
        const response = await getLatestFeed({
          limit: POSTS_PER_PAGE,
          offset: POSTS_PER_PAGE * pageNumber,
        });

        if (response.success !== false) {
          setPage(pageNumber + 1);
          setPosts((prevPosts) => [...prevPosts, ...response.data]);
          setHasMore(response.data.length === POSTS_PER_PAGE);
          // Assuming there are more posts if the page is full. Could improve this
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  useEffect(() => {
    if (firstLoad.current) {
      fetchPosts(page);
      firstLoad.current = false;
    }
  }, [fetchPosts, page]);

  const handleScroll = useCallback(() => {
    const mainContent = document.getElementById("main-content-scrollable");
    if (
      mainContent.scrollTop + mainContent.clientHeight >=
      mainContent.scrollHeight - 100
    ) {
      console.log("Loading more posts...");
      // Load more posts
      if (!loading && hasMore) {
        setLoading(true);
        fetchPosts(page).finally(() => {
          setLoading(false);
        });
      }
    }
  }, [fetchPosts, page, hasMore, loading]);

  useEffect(() => {
    const mainContent = document.getElementById("main-content-scrollable");
    mainContent.addEventListener("scroll", handleScroll);
    return () => mainContent.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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

          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              viewer={viewer}
              onDelete={onPostDeleted}
            />
          ))}

          {loading && (
            <div className="p-4 text-center">
              <Spinner aria-label="Loading more posts" size="xl" />
            </div>
          )}

          {!hasMore && !loading && (
            <div className="p-4 text-center text-gray-500">
              No more posts to load.
            </div>
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
