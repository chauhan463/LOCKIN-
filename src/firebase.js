import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  initializeFirestore,
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAku5d9x9UNhIF3PStNk3P0DYcHlLqyEgQ",
  authDomain: "lockin-f4e4d.firebaseapp.com",
  projectId: "lockin-f4e4d",
  storageBucket: "lockin-f4e4d.firebasestorage.app",
  messagingSenderId: "81728693307",
  appId: "1:81728693307:web:be45c89c3ffc0c9bc9e81e",
  measurementId: "G-L05YQLF79G",
};

// ------------------------------
// ⭐ IMPORTANT: FORCE LONG-POLLING
// ------------------------------
const app = initializeApp(firebaseConfig);
initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Logged out");
  } catch (e) {
    console.error("Logout error:", e);
  }
};

export const saveProgress = async (uid, completed) => {
  const ref = doc(db, "progress", uid);
  await setDoc(ref, { completed }, { merge: true });
};

export const loadProgress = async (uid) => {
  if (!uid) return {};
  const snap = await getDoc(doc(db, "progress", uid));
  return snap.exists() ? snap.data().completed : {};
};

export { onAuthStateChanged };
