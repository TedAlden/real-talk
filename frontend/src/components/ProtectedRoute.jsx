import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();

  if (auth.loggedIn === false) {
    return <Navigate to="/login" replace />;
  }
  // Optionally, you can show a loading spinner if auth.loggedIn is undefined/null
  return children;
} 