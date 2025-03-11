import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyUser from "./pages/VerifyUser";
import ResetPassword from "./pages/ResetPassword";
import UserSettings from "./pages/UserSettings";
import EnterOTP from "./pages/EnterOTP";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <div className="rt-app bg-gray-50 dark:bg-gray-900">
      <Router>
        <AuthProvider>
          <Navbar />
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyUser />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/settings" element={<UserSettings />} />
              <Route path="/enter-otp" element={<EnterOTP />} />
              <Route path="/profile/:id" element={<UserProfile />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
