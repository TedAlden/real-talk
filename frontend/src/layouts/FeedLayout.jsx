import TrendingTags from "../components/TrendingTags";
import SuggestedUsers from "../components/SuggestedUsers";

function FeedLayout({ children, viewer }) {
  return (
    <div className="container mx-auto">
      <div className="grid w-full gap-6 lg:grid-cols-5 2xl:grid-cols-7">
        <div className="col-span-5 hidden lg:col-span-2 lg:flex">
          <TrendingTags />
        </div>
        <div className="col-span-3 text-lg text-gray-900 dark:text-white">
          {children}
        </div>
        <div className="col-span-5 hidden w-full self-start 2xl:col-span-2 2xl:flex">
          <SuggestedUsers viewer={viewer} />
        </div>
      </div>
    </div>
  );
}
export default FeedLayout;
