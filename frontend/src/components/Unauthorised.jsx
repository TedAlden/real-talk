import { Link } from "react-router-dom";

/**
 * Displays unauthorized access message with login link
 * Used as fallback for protected routes
 */
const Unauthorised = () => {
  return (
    <div>
      <h1 className="my-5 text-2xl font-bold text-gray-900 dark:text-white">
        Unauthorised
      </h1>
      <p className="my-5 text-gray-900 dark:text-white">
        You must{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
        >
          log in
        </Link>{" "}
        before you can view this page.
      </p>
    </div>
  );
};

export default Unauthorised;
