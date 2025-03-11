import useAuth from "../hooks/useAuth";

function Home() {
  const auth = useAuth();

  return (
    <div>
      <h1 className="my-5 text-2xl font-bold text-gray-900 dark:text-white">
        Welcome {auth?.user?.username}
      </h1>
      <p className="text-gray-900 dark:text-white">
        Welcome to the RealTalk homepage. Work in progress!
      </p>
    </div>
  );
}

export default Home;
