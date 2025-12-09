// src/LoginPage.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { loginWithGoogle, auth, onAuthStateChanged } from "./firebase";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/app");
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen transition-colors duration-300">
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-5 right-5 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-110 transition"
        title="Toggle Theme"
      >
        {theme === "dark" ? (
          <SunIcon className="h-6 w-6 text-yellow-400" />
        ) : (
          <MoonIcon className="h-6 w-6 text-gray-700" />
        )}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg p-10 flex flex-col items-center text-center max-w-sm w-full mx-4"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          🔒 Lock In
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Continue your DSA journey with{" "}
          <span className="font-semibold italic">Aditya Verma</span>
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-3 shadow-md hover:shadow-lg transition-all"
        >
          <FcGoogle className="text-2xl" />
          {loading ? "Signing in..." : "Continue with Google"}
        </motion.button>
      </motion.div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
        Built with ❤️ by <span className="font-semibold">Yashasvi Chauhan</span>
      </p>
    </div>
  );
}
