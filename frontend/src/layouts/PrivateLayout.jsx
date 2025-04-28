import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaEnvelope, FaHeart, FaHashtag, FaUsers, FaUser, FaCog } from "react-icons/fa";
import { HiDotsVertical, HiLocationMarker, HiPaperClip, HiShare } from "react-icons/hi";
import axios from "axios";
import useAuth from "../hooks/useAuth";

// Sidebar navigation item component
const SidebarNavItem = ({ icon, to, isActive }) => (
  <Link to={to} className="relative flex items-center justify-center py-3">
    {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-pink-500"></div>}
    <div className="text-2xl text-gray-700">{icon}</div>
  </Link>
);

// User avatar component
const Avatar = ({ src, size = "md", username }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };
  
  // Get first letter of username for fallback
  const firstLetter = username ? username.charAt(0).toUpperCase() : "U";
  
  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200`}>
      {src ? (
        <img 
          src={src} 
          alt={`${username || 'User'}'s avatar`} 
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "";
            e.target.parentNode.classList.add("bg-pink-100");
            // Add the letter after image fails
            const letterSpan = document.createElement("span");
            letterSpan.className = "text-sm font-bold text-pink-500";
            letterSpan.innerText = firstLetter;
            e.target.parentNode.appendChild(letterSpan);
            e.target.parentNode.classList.add("flex", "items-center", "justify-center");
            e.target.remove();
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-pink-100 text-pink-500">
          <span className="text-sm font-bold">{firstLetter}</span>
        </div>
      )}
    </div>
  );
};

// Post component
const Post = ({ id, author, verified, timestamp, location, pinned, content, image, likes, replies }) => {
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const auth = useAuth();

  const handlePostClick = () => {
    navigate(`/post/${id}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent post click
    try {
      if (isLiked) {
        await axios.delete(`/api/posts/${id}/like`);
      } else {
        await axios.post(`/api/posts/${id}/like`);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    try {
      await axios.post(`/api/posts/${id}/reply`, { content: replyText });
      setReplyText("");
      // Ideally would refresh the post data here
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  // Format the date nicely
  const formattedDate = new Date(timestamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow">
      {/* Post header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${author.id}`}>
            <Avatar src={author.avatar} username={author.username} size="sm" />
          </Link>
          <div>
            <div className="flex items-center gap-1">
              <Link to={`/profile/${author.id}`} className="font-bold text-black hover:underline">
                {author.username}
              </Link>
              {verified && (
                <span className="text-yellow-500" title="Verified user">🏅</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Posted {formattedDate} 
              {location && <HiLocationMarker className="ml-1 inline text-red-500" title="Location shared" />}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pinned && (
            <div className="flex items-center gap-1 text-sm">
              <HiPaperClip className="text-gray-700" />
              <span>Pinned Post</span>
            </div>
          )}
          <button className="text-gray-700">
            <HiDotsVertical />
          </button>
        </div>
      </div>
      
      {/* Post content */}
      <div className="mb-3 cursor-pointer" onClick={handlePostClick}>
        <p className="text-gray-800">{content}</p>
        {image && (
          <div className="mt-3 rounded overflow-hidden">
            <img src={image} alt="Post attachment" className="w-full" />
          </div>
        )}
      </div>
      
      {/* Post actions */}
      <div className="flex justify-end items-center gap-3">
        <button className="text-gray-700" title="Share post">
          <HiShare />
        </button>
        <button 
          className="text-gray-700" 
          onClick={handleLike}
          title={isLiked ? "Unlike post" : "Like post"}
        >
          <FaHeart className={`text-2xl ${isLiked ? 'text-pink-500' : 'text-pink-100 hover:text-pink-500'}`} />
        </button>
        <div className="flex -space-x-2">
          {likes?.length > 0 && likes.map((user, i) => (
            <Link to={`/profile/${user.id}`} key={i} title={user.username}>
              <Avatar src={user.avatar} username={user.username} size="sm" />
            </Link>
          ))}
        </div>
      </div>
      
      {/* Replies section */}
      {replies?.length > 0 && showReplies && (
        <>
          <button 
            className="mt-2 text-xs text-gray-500 hover:underline"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? `Hide ${replies.length} replies` : `Show ${replies.length} replies`}
          </button>
          {replies.map((reply, i) => (
            <div key={i} className="mt-3 border-t pt-2">
              <div className="flex gap-2">
                <Link to={`/profile/${reply.author.id}`}>
                  <Avatar src={reply.author.avatar} username={reply.author.username} size="sm" />
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <Link to={`/profile/${reply.author.id}`} className="text-xs font-bold hover:underline">
                      {reply.author.username}
                    </Link>
                    {reply.author.verified && <span className="text-xs text-yellow-500">🏅</span>}
                  </div>
                  <p className="text-sm text-gray-800">{reply.content}</p>
                  <div className="text-xs text-gray-500">
                    {new Date(reply.timestamp).toLocaleString('en-GB', {
                      day: '2-digit', 
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {reply.location && <HiLocationMarker className="ml-1 inline text-red-500" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      
      {/* Reply input */}
      {auth.user && (
        <form onSubmit={handleReply} className="mt-3 flex items-center gap-2">
          <Avatar src={auth.user.avatar} username={auth.user.username} size="sm" />
          <div className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm">
            <input 
              type="text" 
              placeholder="Type a reply..." 
              className="w-full bg-transparent outline-none"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium hover:bg-gray-300"
            disabled={!replyText.trim()}
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};

// Section box component with dynamic content
const SectionBox = ({ title, children, hasIndicator = false, loading = false, error = null }) => (
  <div className="relative mb-4 rounded-lg bg-gray-200 p-4 shadow">
    {hasIndicator && <div className="absolute left-0 top-0 h-6 w-1 bg-pink-500"></div>}
    {title && <h3 className="mb-2 font-bold text-black">{title}</h3>}
    {loading ? (
      <div className="py-4 text-center text-sm text-gray-500">Loading...</div>
    ) : error ? (
      <div className="py-4 text-center text-sm text-red-500">{error}</div>
    ) : (
      children
    )}
  </div>
);

// Trending topic component with link
const TrendingTopic = ({ title, link = "#" }) => (
  <div className="py-2">
    <Link to={link} className="text-black hover:underline">{title}</Link>
  </div>
);

export default function PrivateLayout() {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState({
    user: true,
    posts: true,
    trending: true
  });
  const [error, setError] = useState({
    user: null,
    posts: null,
    trending: null
  });
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    mutuals: 0
  });
  const [catOfDay, setCatOfDay] = useState(null);
  const auth = useAuth();
  
  // Timer countdown effect
  useEffect(() => {
    // Just an example timer - this would be replaced with your actual timer logic
    const startMinutes = 3;
    const startSeconds = 47;
    let totalSeconds = (startMinutes * 60) + startSeconds;
    
    const intervalId = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(intervalId);
        return;
      }
      
      totalSeconds -= 1;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setTimeRemaining(`${minutes}:${seconds < 10 ? '0' : ''}${seconds} remaining`);
    }, 1000);
    
    // Initial state
    setTimeRemaining(`${startMinutes}:${startSeconds} remaining`);
    
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        if (auth.user?.id) {
          const response = await axios.get(`/api/users/${auth.user.id}`);
          setUser(response.data);
          
          // Also fetch user badges in the same request or separately as needed
          const badgesResponse = await axios.get(`/api/users/${auth.user.id}/badges`);
          setBadges(badgesResponse.data);
          
          // Fetch user stats
          const statsResponse = await axios.get(`/api/users/${auth.user.id}/stats`);
          setStats(statsResponse.data);
        } else {
          setError(e => ({...e, user: "User not logged in."}));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(e => ({...e, user: "Failed to load user data."}));
      } finally {
        setLoading(l => ({...l, user: false}));
      }
    };

    // Fetch posts for the feed
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(e => ({...e, posts: "Failed to load posts."}));
      } finally {
        setLoading(l => ({...l, posts: false}));
      }
    };

    // Fetch trending topics
    const fetchTrendingTopics = async () => {
      try {
        const response = await axios.get('/api/trending');
        setTrendingTopics(response.data);
      } catch (err) {
        console.error("Error fetching trending topics:", err);
        setError(e => ({...e, trending: "Failed to load trending topics."}));
      } finally {
        setLoading(l => ({...l, trending: false}));
      }
    };
    
    // Fetch cat of the day
    const fetchCatOfDay = async () => {
      try {
        const response = await axios.get('/api/cat-of-day');
        setCatOfDay(response.data);
      } catch (err) {
        console.error("Error fetching cat of the day:", err);
      }
    };

    fetchUserData();
    fetchPosts();
    fetchTrendingTopics();
    fetchCatOfDay();
  }, [auth.user]);
  
  // Handle complete loading state
  if (loading.user && loading.posts && loading.trending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading RealTalk...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-3xl font-bold text-white">RealTalk</h1>
        </div>
      </header>
      
      {/* Timer bar */}
      <div className="relative h-2 w-full bg-gray-300">
        <div className="absolute h-full w-11/12 bg-pink-500"></div>
        <div className="absolute right-4 -top-1 text-xs font-medium">
          {timeRemaining}
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto flex">
        {/* Left sidebar */}
        <div className="w-16 border-r border-gray-300 bg-gray-100">
          <div className="flex flex-col items-center py-4">
            <SectionBox loading={loading.user} error={error.user}>
              {user && (
                <>
                  <Link to={`/profile/${auth.user?.id}`}>
                    <Avatar src={user?.avatar} username={user?.username} />
                  </Link>
                  <p className="mt-1 text-xs font-bold">{user?.username}</p>
                  {user?.verified && <span className="text-yellow-500" title="Verified user">🏅</span>}
                  <Link to={`/profile/${auth.user?.id}/about`} className="text-xs text-gray-500 hover:underline">About</Link>
                </>
              )}
            </SectionBox>
          </div>
          
          <nav className="mt-4 flex flex-col">
            <SidebarNavItem icon={<FaHome />} to="/" isActive={window.location.pathname === '/'} />
            <SidebarNavItem icon={<FaEnvelope />} to="/messages" isActive={window.location.pathname.includes('/messages')} />
            <SidebarNavItem icon={<FaHeart />} to="/liked" isActive={window.location.pathname.includes('/liked')} />
            <SidebarNavItem icon={<FaHashtag />} to="/explore" isActive={window.location.pathname.includes('/explore')} />
            <SidebarNavItem icon={<FaUsers />} to="/connections" isActive={window.location.pathname.includes('/connections')} />
            <SidebarNavItem icon={<FaUser />} to={`/profile/${auth.user?.id}`} isActive={window.location.pathname.includes('/profile')} />
          </nav>
          
          <div className="mt-auto pb-4">
            <SidebarNavItem icon={<FaCog />} to="/settings" isActive={window.location.pathname.includes('/settings')} />
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex flex-1">
          {/* Profile widgets */}
          <div className="w-64 p-4">
            <SectionBox>
              <form className="relative rounded-full bg-gray-300 px-4 py-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full bg-transparent outline-none"
                />
              </form>
            </SectionBox>
            
            <SectionBox 
              title="Followers/ Following/ Mutual Followers" 
              hasIndicator={true}
              loading={loading.user}
              error={error.user}
            >
              {user && (
                <div className="flex flex-col space-y-2">
                  <Link to={`/user/${auth.user?.id}/followers`} className="text-sm hover:underline">
                    Followers: {stats.followers || 0}
                  </Link>
                  <Link to={`/user/${auth.user?.id}/following`} className="text-sm hover:underline">
                    Following: {stats.following || 0}
                  </Link>
                  <Link to={`/user/${auth.user?.id}/mutuals`} className="text-sm hover:underline">
                    Mutual Followers: {stats.mutuals || 0}
                  </Link>
                </div>
              )}
            </SectionBox>
            
            <SectionBox 
              title="Badges" 
              loading={loading.user}
              error={error.user}
            >
              {user && (
                <div className="flex justify-center space-x-2">
                  {badges.length > 0 ? (
                    badges.map((badge, i) => (
                      <span key={i} className="text-2xl" title={badge.title}>{badge.emoji}</span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No badges</span>
                  )}
                </div>
              )}
            </SectionBox>
            
            <SectionBox 
              title="Connections" 
              hasIndicator={true}
              loading={loading.user}
              error={error.user}
            >
              {user && (
                <Link to="/connections" className="text-sm text-center block hover:underline">
                  View all connections
                </Link>
              )}
            </SectionBox>
          </div>
          
          {/* Feed */}
          <div className="flex-1 max-w-3xl px-4 py-4">
            <SectionBox loading={loading.posts} error={error.posts}>
              {posts.length > 0 ? (
                posts.map(post => (
                  <Post key={post.id} {...post} />
                ))
              ) : !loading.posts && !error.posts ? (
                <div className="rounded-lg bg-white p-8 text-center shadow">
                  <p className="text-gray-500">No posts to show yet. Follow some users to see their posts here!</p>
                  <Link to="/explore" className="mt-4 inline-block rounded-md bg-pink-500 px-4 py-2 text-white">
                    Explore Users
                  </Link>
                </div>
              ) : null}
              <Outlet />
            </SectionBox>
          </div>
          
          {/* Right sidebar */}
          <div className="w-80 bg-gray-200 p-4">
            {/* Trending section */}
            <SectionBox title="Trending" loading={loading.trending} error={error.trending}>
              {trendingTopics.length > 0 ? (
                trendingTopics.map((topic, i) => (
                  <TrendingTopic 
                    key={i} 
                    title={topic.title || topic} 
                    link={topic.link || `/explore/${encodeURIComponent(topic.title || topic)}`} 
                  />
                ))
              ) : !loading.trending && !error.trending ? (
                <p className="text-center text-sm text-gray-500">No trending topics available</p>
              ) : null}
            </SectionBox>
            
            {/* Cat of the day */}
            <SectionBox title="Cat of the Day">
              {catOfDay ? (
                <>
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={catOfDay.image || "/images/cat.jpg"} 
                      alt={catOfDay.name || "Cat of the day"} 
                      className="w-full"
                    />
                  </div>
                  {catOfDay.name && (
                    <p className="mt-2 text-center text-sm font-medium">{catOfDay.name}</p>
                  )}
                </>
              ) : (
                <div className="rounded-lg overflow-hidden">
                  <div className="h-48 w-full animate-pulse bg-gray-300"></div>
                </div>
              )}
            </SectionBox>
          </div>
        </div>
      </div>
    </div>
  );
}
