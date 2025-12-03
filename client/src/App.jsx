// src/App.jsx
import React, { useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import WatchList from "./pages/WatchList";
import Alerts from "./pages/Alerts";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import { AuthContext } from "./context/AuthContext";
import Landing from "./pages/Landing";

const App = () => {
  const location = useLocation();
  const { authenticated } = useContext(AuthContext);

  // hide layout for auth pages (full screen) — Login/Signup
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar + Navbar only when not on auth pages and user is authenticated */}
      {!hideLayout && authenticated && <Sidebar />}

      <div className="flex-1 flex flex-col">
        {!hideLayout && authenticated && <Navbar />}

        <Routes>
          {/* Landing page for visitor/user */}
          <Route path="/" element={authenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />

          {/* Auth routes (full-screen) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes — show Login if not authenticated */}
          <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Login />} />
          <Route path="/portfolio" element={authenticated ? <Portfolio /> : <Login />} />
          <Route path="/watchlist" element={authenticated ? <WatchList /> : <Login />} />
          <Route path="/alerts" element={authenticated ? <Alerts /> : <Login />} />
          <Route path="/settings" element={authenticated ? <Settings /> : <Login />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
