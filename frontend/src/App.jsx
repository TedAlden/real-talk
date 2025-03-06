import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyUser from "./pages/VerifyUser";
import ResetPassword from "./pages/ResetPassword";
import UserSettings from "./pages/UserSettings";
import EnterOTP from "./pages/EnterOTP";

function App() {
  return (
    <div className="rt-app bg-gray-50 dark:bg-gray-900">
      <Router>
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
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
