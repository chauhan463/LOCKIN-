// src/main.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, auth } from "./firebase";
import App from "./App";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import { ThemeProvider } from "./ThemeProvider";
import "./index.css";

function Root() {
  const [user, setUser] = useState(undefined); // ✅ undefined = not yet loaded
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    console.log("Auth state changed:", currentUser);
    setUser(currentUser);
    setLoading(false);
  });
  return unsubscribe;
}, []);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root based on user */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected route */}
        <Route
          path="/app"
          element={
            <ProtectedRoute user={user}>
              <App user={user} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={<Navigate to={user ? "/app" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  </React.StrictMode>
);
