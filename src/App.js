import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Products from "./Components/Products.js";
import Profile from "./Components/Profile.js";
import Home from "./Components/Home.js";
import { CssBaseline } from "@mui/material";
import Layout from "./Layout/layout.js";
import Users from "./Components/Users.js";
import Licenses from "./Components/Licenses.js";
import LicenseActivation from "./Components/LicenseActivation.js";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(
    JSON.parse(localStorage.getItem("role")) || ""
  );

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Layout>
                <Home handleLogout={handleLogout} />
              </Layout>
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/products"
          element={
            token && role === "Admin" ? (
              <Layout>
                <Products />
              </Layout>
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/LicenseActivation"
          element={
            token ? (
              <Layout>
                <LicenseActivation />
              </Layout>
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            token ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/users"
          element={
            token && role === "Admin" ? (
              <Layout>
                <Users />
              </Layout>
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/licenses"
          element={
            token && role === "Admin" ? (
              <Layout>
                <Licenses />
              </Layout>
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/profile"
          element={
            token ? (
              <Layout>
                <Profile />
              </Layout>
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/Home"
          element={
            token ? (
              <Layout>
                <Home handleLogout={handleLogout} />
              </Layout>
            ) : (
              <SignIn onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
