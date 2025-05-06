import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { HiSearch, HiHashtag, HiNewspaper, HiUserCircle } from "react-icons/hi";
import { Tabs, TabItem, Spinner, TextInput } from "flowbite-react";

import Markdown from "react-markdown";

import Unauthorised from "../components/Unauthorised";
import UserInteractionButtons from "../components/UserInteractionButtons";
import { getSearchResults } from "../api/searchService";
import useAuth from "../hooks/useAuth";

const style = {
  card: "p-4 bg-white rounded-md shadow dark:border dark:border-gray-700 dark:bg-gray-800",
};

function Search() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewer, setViewer] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const tabsRef = useRef(null);

  /**
   * Get search results based on the query from the API.
   */
  const showSearchResults = useCallback(async (query) => {
    query = query.replace("#", "");
    setLoading(true);
    try {
      const results = await getSearchResults(query, {
        limit: 10,
        offset: 0,
      });
      if (results) {
        setSearchResults(results.data);
      } else {
        console.error("Error fetching search results");
      }
    } catch (error) {
      console.error("Error in showSearchResults:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle the search form submission.
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    const query = e.target[0].value;
    setSearchParams({ q: query });
    showSearchResults(query);
  };

  /**
   * Handle the follow/unfollow action for a user in the search results.
   */
  const onFollowChange = async (userId, isFollowing) => {
    const updatedSuggestions = searchResults.users.map((user) =>
      user._id === userId ? { ...user, isFollowing } : user,
    );
    setSearchResults(updatedSuggestions);
  };

  /**
   * Set the viewer state when the component mounts.
   */
  useEffect(() => {
    const fetchUser = async () => {
      const user = await auth.getUser();
      setViewer(user);
    };
    fetchUser();
  }, [auth]);

  /**
   * Get the query from the URL parameters when the component mounts, and use
   * this to do an initial search.
   */
  useEffect(() => {
    let query = searchParams.get("q");
    if (query) {
      if (query.startsWith("#")) {
        tabsRef.current?.setActiveTab(2);
        query = query.replace("#", "");
      }
      showSearchResults(query);
      document.getElementById("real-talk-search").value = query;
    }
  }, [showSearchResults, searchParams]);

  /**
   * Create a user profile preview for the search results.
   */
  const createUserProfilePreview = (user) => (
    <li key={user._id} className="py-3 sm:py-4">
      <div className="flex items-center space-x-4">
        <Link to={`/profile/${user._id}`} className="shrink-0">
          <img
            className="h-auto w-16 rounded-full object-cover shadow-lg"
            src={user?.profile_picture}
            alt="Profile"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={`/profile/${user._id}`}
            className="text-lg font-semibold hover:underline"
          >
            @{user.username}
          </Link>
          <p className="text-md text-gray-500 dark:text-gray-400">
            {user.mutualCount > 1
              ? `${user.mutualCount} mutual follows`
              : `${user.mutualCount} mutual follow`}
          </p>
        </div>
        {viewer && (
          <UserInteractionButtons
            viewerId={viewer._id}
            targetId={user._id}
            onFollowChange={onFollowChange}
            isFollowing={user.isFollowing}
            mode="follow"
          />
        )}
      </div>
    </li>
  );

  /**
   * Create a post preview for the search results.
   */
  const createPostPreview = (post) => (
    <li key={post._id} className="py-3 sm:py-4">
      <div className="flex items-center space-x-4">
        <Link to={`/profile/${post.userId}`} className="shrink-0">
          <img
            className="h-auto w-16 rounded-full object-cover shadow-lg"
            src={post?.poster?.profile_picture}
            alt="Profile"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={`/profile/${post.user_id}`}
            className="text-lg font-semibold hover:underline"
          >
            @{post.poster.username}
          </Link>
          <div className="text-md text-gray-500 dark:text-gray-400">
            <Markdown
              components={{
                a: ({ ...props }) => (
                  <Link
                    to={props.href}
                    {...props}
                    className="bg-blue-400 bg-opacity-50 px-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-100"
                  />
                ),
              }}
            >
              {post.content}
            </Markdown>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="w-full rounded-md bg-blue-500 px-3 py-1.5 transition hover:bg-blue-600"
            onClick={() => {
              navigate(`/post/${post._id}`);
            }}
          >
            View
          </button>
        </div>
      </div>
    </li>
  );

  if (!auth.loggedIn) return <Unauthorised />;

  return (
    <div className="mx-auto mb-4 flex max-w-3xl flex-col gap-5">
      <form onSubmit={handleSearch}>
        <TextInput
          id="real-talk-search"
          type="text"
          rightIcon={HiSearch}
          placeholder="Search"
          sizing="lg"
          onSubmit={handleSearch}
        />
      </form>

      <Tabs
        aria-label="Search result tabs"
        variant="pills"
        className="rounded"
        ref={tabsRef}
      >
        <TabItem active title="Users" icon={HiUserCircle}>
          <div className={`${style.card} mb-5 text-gray-900 dark:text-white`}>
            <h1 className="mb-3 text-xl font-bold">Search results</h1>
            <div className="flow-root p-4">
              {!loading ? (
                searchResults?.users?.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {searchResults.users.map((user) =>
                      createUserProfilePreview(user),
                    )}
                  </ul>
                ) : (
                  <p>No results.</p>
                )
              ) : (
                <div className="text-center">
                  <Spinner aria-label="Loading notifications data" size="xl" />
                </div>
              )}
            </div>
          </div>
        </TabItem>
        <TabItem title="Posts" icon={HiNewspaper}>
          <div className={`${style.card} mb-5 text-gray-900 dark:text-white`}>
            <h1 className="mb-3 text-xl font-bold">Search results</h1>
            <div className="flow-root p-4">
              {!loading ? (
                searchResults?.posts?.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {searchResults.posts.map((post) => createPostPreview(post))}
                  </ul>
                ) : (
                  <p>No results.</p>
                )
              ) : (
                <div className="text-center">
                  <Spinner aria-label="Loading notifications data" size="xl" />
                </div>
              )}
            </div>
          </div>
        </TabItem>
        <TabItem title="Tags" icon={HiHashtag}>
          <div className={`${style.card} mb-5 text-gray-900 dark:text-white`}>
            <h1 className="mb-3 text-xl font-bold">Search results</h1>
            <div className="flow-root p-4">
              {!loading ? (
                searchResults?.taggedPosts?.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {searchResults.taggedPosts.map((post) =>
                      createPostPreview(post),
                    )}
                  </ul>
                ) : (
                  <p>No results.</p>
                )
              ) : (
                <div className="text-center">
                  <Spinner aria-label="Loading notifications data" size="xl" />
                </div>
              )}
            </div>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
}

export default Search;
