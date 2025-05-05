import "./App.css";
import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const GrayscaleContext = createContext({
  setGrayscale: (/* value */) => {},
});

const queryClient = new QueryClient();

import Layout from "./layouts/Layout";

import Home from "./pages/Home";
import FeedLatest from "./pages/FeedLatest";
import FeedFollowing from "./pages/FeedFollowing";
import Search from "./pages/Search";
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
import Admin from "./pages/Admin";
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
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/verify-email" element={<VerifyUser />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/feed" element={<FeedLatest />} />
                    <Route path="/feed/latest" element={<FeedLatest />} />
                    <Route path="/feed/following" element={<FeedFollowing />} />
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
                    <Route path="/admin" element={<Admin />} />
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
