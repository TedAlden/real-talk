import "./App.css";
import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1) Create the context so Timer can flip it
export const GrayscaleContext = createContext({
  setGrayscale: (/* value */) => {},
});

const queryClient = new QueryClient();

import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyUser from "./pages/VerifyUser";
import ResetPassword from "./pages/ResetPassword";
import UserSettings from "./pages/UserSettings";
import EnterOTP from "./pages/EnterOTP";
import UserProfile from "./pages/UserProfile";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import Network from "./pages/Network";
import SinglePost from "./pages/SinglePost";
import NotificationsPage from "./pages/Notifications";

function App() {
  const [grayscale, setGrayscale] = useState(0);

  return (
    <GrayscaleContext.Provider value={{ setGrayscale }}>
      <div
        className="rt-app bg-gray-50 dark:bg-gray-900"
        style={{ filter: `grayscale(${grayscale})` }}
      >
        <Router>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <div className="container min-w-full">
                {/* Grayscale dev slider — remove in production */}
                {/*
              <div className="p-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grayscale Level: {grayscale}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={grayscale}
                  onChange={(e) => setGrayscale(e.target.value)}
                  className="w-full"
                />
              </div>
              */}
                <Routes>
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/verify-email" element={<VerifyUser />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Route>
                  <Route element={<PrivateLayout />}>
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/settings" element={<UserSettings />} />
                    <Route path="/enter-otp" element={<EnterOTP />} />
                    <Route path="/profile/:id" element={<UserProfile />} />
                    <Route path="/user/:id/followers" element={<Followers />} />
                    <Route path="/user/:id/following" element={<Following />} />
                    <Route path="/network" element={<Network />} />
                    <Route path="/post/:id" element={<SinglePost />} />
                    <Route
                      path="/notifications"
                      element={<NotificationsPage />}
                    />
                  </Route>
                </Routes>
              </div>
            </QueryClientProvider>
          </AuthProvider>
        </Router>
      </div>
    </GrayscaleContext.Provider>
  );
}

export default App;
