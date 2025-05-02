import useAuth from "../hooks/useAuth";
import HomeBG from "../assets/home.webp";

function Home() {
  const auth = useAuth();
  console.log(auth)
  return (
    // Print
    // Print welcome message
    
    <div>
      {auth?.user?.username ? (
        <h1 className="my-5 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {auth.user.username}
        </h1>
      ) : (
        <h1 className="my-5 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome!
        </h1>
      )}

      {/* Display home image */}
      <div>
        <img src={HomeBG} alt="home" className="h-auto w-full" />
        <div className="inset-0 flex items-center justify-center text-4xl text-white"></div>
      </div>
      <p className="text-4xl text-gray-900 dark:text-white"></p>
    </div>
  );
}

export default Home;
