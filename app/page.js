"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { animate, waapi, eases, spring } from 'animejs';


const PARTICLE_COUNT = 40;

export default function Home() {
  const [authMode, setAuthMode] = useState(null); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  {successMessage && (
    <div style={{ color: 'green', marginTop: '10px' }}>
      {successMessage}
    </div>
  )}

  //   useEffect(() => {
  //   const container = document.getElementById("screenParticles");
  //   if (!container) return;

  //   const PARTICLE_COUNT = 40;

  //   for (let i = 0; i < PARTICLE_COUNT; i++) {
  //     const dot = document.createElement("span");
  //     const size = Math.random() * 2.5 + 1;
  //     const duration = Math.random() * 18 + 14;
  //     const delay = Math.random() * -duration;
  //     const left = Math.random() * 100;
  //     const top = Math.random() * 100;

  //     dot.style.width = size + "px";
  //     dot.style.height = size + "px";
  //     dot.style.left = left + "%";
  //     dot.style.top = top + "%";
  //     dot.style.animationDuration = duration + "s";
  //     dot.style.animationDelay = delay + "s";

  //     container.appendChild(dot);
  //   }

  //   return () => (container.innerHTML = "");
  // }, []);

    const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const duration = Math.random() * 18 + 14; // 14–32s
      return {
        id: i,
        size: Math.random() * 2.5 + 1,      // 1–3.2px
        left: Math.random() * 100,          // %
        top: Math.random() * 100,           // %
        duration,
        delay: Math.random() * -duration    // negative for staggered starts
      };
    });
  }, []);
  

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user && !isAuthenticating && !successMessage) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const savedPage = userDoc.exists() ? userDoc.data().currentPage : null;
      console.log(user);

      if (savedPage) {
        router.push(`/adventure/${savedPage}`);
      } else {
        router.push("/dashboard");
      }
    } else {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, [isAuthenticating, successMessage]);


  // const handleSubmit = async () => {
  //   const userRef = doc(db, "users", user.uid);

  //   try {
  //     if (authMode === "register") {
  //       const userCred = await createUserWithEmailAndPassword(auth, email, password);
  //       await setDoc(doc(db, "users", userCred.user.uid), {
  //         email: userCred.user.email,
  //         currentPage: "page_1",
  //         createdAt: new Date(),
  //       });
  //       router.push(`/adventure/page_1`);
  //     } else {
  //       await signInWithEmailAndPassword(auth, email, password);
  //         const docSnap = await getDoc(userRef);
  //         const savedPage = docSnap.exists() ? docSnap.data().currentPage : "page_1";
  //         router.push(`/adventure/${savedPage}`);
  //     }
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

  const handleSubmit = async () => {
    setIsAuthenticating(true);
    try {
      let userCred;

      if (authMode === "create account") {
        userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCred.user.uid), {
          email: userCred.user.email,
          currentPage: "page_1",
          createdAt: new Date(),
          name: "",
          stats: {
            Strength: 10,
            Dexterity: 10,
            Constitution: 10,
            Intelligence: 10,
            Wisdom: 10,
            Charisma: 10,
            HP: 20,
            MaxHP: 20,
            XP: 0,
            Level: 1,
          },
        });
        setSuccessMessage("Protocol generating...");
      } else {
        userCred = await signInWithEmailAndPassword(auth, email, password);
        const docSnap = await getDoc(doc(db, "users", userCred.user.uid));
        const savedPage = docSnap.exists() ? docSnap.data().currentPage : "page_1";
        setSuccessMessage(`Welcome back, ${userProfile?.characterName || "Gatebreaker"}!`);
      }

      setTimeout(async () => {
        const userRef = doc(db, "users", userCred.user.uid);
        const userDoc = await getDoc(userRef);
        const page = userDoc.exists() ? userDoc.data().currentPage : "page_1";
        router.push(`/adventure/${page}`);
        // router.push(`/adventure/1`);
      }, 1000);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-auth px-10 hero">

      <div className="screen-particles">
        {particles.map(p => (
          <span
            key={p.id}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              filter: 'blur(0.8px) saturate(1.1) contrast(1.1)',
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* <div className="screen-particles" id="screenParticles"></div> */}

      {/* <div style={{ width: '100%', height: '600px', position: 'fixed', zIndex: "-1", mixBlendMode: 'lighten', top: 0, left: 0 }}>
        <DarkVeil />
      </div> */}

      <img src="assets/logo2.png" alt="Gatebreaker Protocol Logo" className="mb-16 object-contain logo" />
      {/* <img src="assets/logo.png" alt="Gatebreaker Protocol Logo" className="mb-16 object-contain logo" /> */}
      {/* <h1 className="text-2xl tracking-wider mb-16 text-white drop-shadow-lg">"The Chosen Operator"</h1> */}
      <div className="rounded shadow-md w-full max-w-xs sm:max-w-xs text-center">
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
                className="login text-xl tracking-wide w-full text-white py-3 mb-4"
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                className="login text-xl tracking-wide w-full text-white py-3"
                onClick={() => setAuthMode("create account")}
              >
                Create Account
              </button>

              {/* <StarBorder
                as="button"
                className="custom-class"
                color="cyan"
                speed="5s"
              >
                // content
              </StarBorder> */}

            </motion.div>
          ) : (
            <motion.div
              key="form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="login-div box">
                <h1 className="text-2xl tracking-wider mb-4 capitalize text-white">{authMode}</h1>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full border mb-3"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border mb-3"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* <button
                  onClick={handleSubmit}
                  className="login text-xl tracking-wide w-full text-white py-3 mb-4"
                >
                  Create an account
                </button> */}
                <button
                  onClick={handleSubmit}
                  className="login tracking-wide w-full text-white py-3 mb-4"
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => setAuthMode(null)}
                  className="text-sm text-gray-600 hover:underline text-white"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              className="mt-4 text-white-700 font-semibold"
              style={{ color: 'white', marginTop: '15px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
