// src/App.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "./data";
import TopicQuestionTable from "./Topic";
import { useTheme } from "./ThemeProvider";
import { doc, onSnapshot } from "firebase/firestore";
import { db, logoutUser, saveProgress } from "./firebase";
import {
  MoonIcon,
  SunIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/solid";

export default function App({ user }) {
  const [completed, setCompleted] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null); // To track if loading fails

  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // ✅ ROBUST SYNC WITH TIMEOUT & LOGS
// ✅ ROBUST SYNC WITH TIMEOUT & LOGS
  useEffect(() => {
    if (!user?.uid) return;

    console.log("🔵 Starting Firestore listener for:", user.uid);
    setLoadingData(true);
    setError(null);

    // CHANGED: Increased timeout from 5000 (5s) to 15000 (15s)
    const timeoutId = setTimeout(() => {
      setLoadingData((currentLoading) => {
        if (currentLoading) {
          console.error("🔴 Firestore timed out!");
          setError("Connection is slow. Still trying...");
          // We do NOT stop loading here anymore, we just warn the user.
          return true; 
        }
        return currentLoading;
      });
    }, 15000); 

    const ref = doc(db, "progress", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      clearTimeout(timeoutId); // Stop the timer, data is here!
      console.log("🟢 Snapshot received!");

      if (snap.exists()) {
        console.log("✅ Data found:", snap.data().completed);
        setCompleted(snap.data().completed);
      } else {
        console.log("⚠️ New user or no save found. Starting fresh.");
        setCompleted({});
      }
      setLoadingData(false); // Remove loading screen
      setError(null); // Clear any timeout warnings
    }, (err) => {
      clearTimeout(timeoutId);
      console.error("🔴 Firestore Error:", err);
      setError(err.message);
      setLoadingData(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsub();
    };
  }, [user?.uid]);
  const toggleComplete = (topic, index) => {
    if (loadingData) return;
    
    // Optimistic UI Update: Update screen immediately
    const key = `${topic}-${index}`;
    const newCompleted = { ...completed, [key]: !completed[key] };
    
    setCompleted(newCompleted); // Update UI
    
    // Save to DB in background
    saveProgress(user.uid, newCompleted).catch(err => {
        console.error("Failed to save:", err);
        // Optional: Revert state if save fails
    });
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
            <span>🔒</span>
            <span>LOCK IN with <span className="italic font-semibold text-blue-600 dark:text-blue-400">Aditya Verma</span></span>
        </h1>

        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-gray-400" />
          )}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
             {theme === "dark" ? <SunIcon className="h-6 w-6 text-yellow-400" /> : <MoonIcon className="h-6 w-6 text-gray-800" />}
          </button>
          <button onClick={handleLogout} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-red-500" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        
        {/* LOADING STATE */}
        {loadingData && (
           <div className="text-center py-10">
             <p className="text-xl font-semibold animate-pulse">Loading your progress...</p>
             <p className="text-sm text-gray-500">Checking Firestore...</p>
           </div>
        )}

        {/* ERROR STATE */}
        {!loadingData && error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
             <strong className="font-bold">Error loading data: </strong>
             <span className="block sm:inline">{error}</span>
           </div>
        )}

        {/* DATA TABLE (Only show if not loading) */}
        {!loadingData && data.map((section, i) => (
          <TopicQuestionTable
            key={i}
            section={section}
            completed={completed}
            toggleComplete={toggleComplete}
            getDifficultyColor={(d) => {
              switch (d) {
                case "Easy": return "bg-green-200 text-green-800";
                case "Medium": return "bg-yellow-200 text-yellow-800";
                case "Hard": return "bg-red-200 text-red-800";
                default: return "bg-gray-100 text-gray-800";
              }
            }}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}