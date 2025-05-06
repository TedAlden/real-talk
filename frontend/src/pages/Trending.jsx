import TrendingTags from "../components/TrendingTags";
import Unauthorised from "../components/Unauthorised";
import useAuth from "../hooks/useAuth";

export default function Trending() {
  const auth = useAuth();

  if (!auth.loggedIn) return <Unauthorised />;

  return (
    <div className="mx-auto flex w-full justify-center">
      <TrendingTags className="w-full" />
    </div>
  );
}
