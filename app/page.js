"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";


export default function Home() {
  const [authMode, setAuthMode] = useState(null); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
      else setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    try {
      if (authMode === "register") {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCred.user.uid), {
          email: userCred.user.email,
          createdAt: new Date(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-auth px-4">
      <img src="assets/logo.png" alt="Fragment Protocol Logo" className="mb-16 object-contain" />
        <h1 className="text-4xl tracking-wider mb-16 text-white drop-shadow-lg">"The Chosen Hunter"</h1>
      <div className="p-6 sm:p-8 rounded shadow-md w-full max-w-sm sm:max-w-xs text-center">
        <AnimatePresence mode="wait" initial={false}>
          {!authMode ? (
            <motion.div
              key="buttons"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button
                className="login text-2xl tracking-wide w-full text-white py-3 mb-4"
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                className="login text-2xl tracking-wide w-full text-white py-3"
                onClick={() => setAuthMode("register")}
              >
                Register
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h1 className="text-2xl font-bold mb-4 capitalize">{authMode}</h1>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded mb-3"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded mb-3"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded mb-4 hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                onClick={() => setAuthMode(null)}
                className="text-sm text-gray-600 hover:underline"
              >
                Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
