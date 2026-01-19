"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { generateUniqueBreakerID, formatBreakerID } from "../lib/breakerIdGenerator";

const PARTICLE_COUNT = 40;

export default function Home() {
  const [authMode, setAuthMode] = useState(null); // "login", "register", or "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const duration = Math.random() * 18 + 14;
      return {
        id: i,
        size: Math.random() * 2.5 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration,
        delay: Math.random() * -duration
      };
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !isAuthenticating && !successMessage) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const savedPage = userDoc.exists() ? userDoc.data().currentPage : null;

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
  }, [isAuthenticating, successMessage, router]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handlePasswordReset = async () => {
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setAuthMode("login");
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");
    setIsAuthenticating(true);

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsAuthenticating(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsAuthenticating(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters");
      setIsAuthenticating(false);
      return;
    }

    if (authMode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      setIsAuthenticating(false);
      return;
    }

    try {
      let userCred;

      if (authMode === "register") {
        // Create new account
        userCred = await createUserWithEmailAndPassword(auth, email, password);

        const breakerId = await generateUniqueBreakerID(db);
        const formattedId = formatBreakerID(breakerId);
        
        // Firebase Auth automatically hashes passwords - no need to manually salt/hash
        // Email is stored as-is (not sensitive like passwords)
        await setDoc(doc(db, "users", userCred.user.uid), {
          email: userCred.user.email,
          breakerId: breakerId,
          breakerIdFormatted: formattedId, // For display purposes
          currentPage: "page_1",
          createdAt: new Date(),
          characterName: "",
          stats: {
            Fellowship: 10,
            Athletics: 10,
            Thought: 10,
            Essence: 10,
            HP: 20,
            MaxHP: 20,
            BP: 0,
            Level: 1,
          },
          route: "",
          className: "",
          breakerClass: "",
          metNPCs: [],
          deadNPCs: [],
          failedCombats: [],
          failedRolls: [],
          deaths: 0,
          revivals: 0,
          deathLocations: [],
          toldTeamAbout: [],
          niceToAkemi: false,
          gaveToCale: false,
          tookEnvironmentPotion: false,
          visitedPages: ["page_1"],
          wentAlone: false,
          minionGroups: {},
          lastUpdated: new Date()
        });
        
        // setSuccessMessage("Protocol generating...");
        setSuccessMessage(`Protocol Initialized\nBreaker ID: ${formattedId}`);
      } else {
        // Login
        userCred = await signInWithEmailAndPassword(auth, email, password);
        const docSnap = await getDoc(doc(db, "users", userCred.user.uid));
        const characterName = docSnap.exists() ? docSnap.data().characterName : null;
        const breakerIdFormatted = docSnap.exists() ? docSnap.data().breakerIdFormatted : null;
        //setSuccessMessage(`Welcome back, ${characterName || "Gatebreaker"}!`);
        setSuccessMessage(`Welcome back, ${characterName || "Gatebreaker"}!\nID: ${breakerIdFormatted || "Unknown"}`);
      }

      // Redirect after short delay
      setTimeout(async () => {
        const userRef = doc(db, "users", userCred.user.uid);
        const userDoc = await getDoc(userRef);
        const page = userDoc.exists() ? userDoc.data().currentPage : "page_1";
        router.push(`/adventure/${page}`);
      }, 2000);
    } catch (err) {
      // Handle specific Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password");
      } else if (err.code === 'auth/user-not-found') {
        setError("No account found with this email");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many attempts. Please try again later");
      } else {
        setError(err.message || "Authentication failed");
      }
      setIsAuthenticating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-auth hero">
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

        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
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

      <img 
        src="assets/logo2.png" 
        alt="Gatebreaker Protocol Logo" 
        className="mb-16 object-contain logo" 
      />

      <div className="rounded shadow-md w-full max-w-md text-center">
        <AnimatePresence mode="wait" initial={false}>
          {!authMode ? (
            // Initial button selection
            <motion.div
              key="buttons"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <button
                className="login text-xl tracking-wide w-full text-white py-3"
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                className="login text-xl tracking-wide w-full text-white py-3"
                onClick={() => setAuthMode("register")}
              >
                Create Account
              </button>
            </motion.div>
          ) : (
            // Auth form
            <motion.div
              key="form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="login-div box p-8">
                <h1 className="text-2xl tracking-wider mb-6 capitalize text-white">
                  {authMode === "reset" ? "Reset Password" : authMode === "register" ? "Create Account" : "Login"}
                </h1>

                {/* Email Input */}
                <div className="mb-4 text-left">
                  <label className="block text-white mb-2 text-sm">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full border px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isAuthenticating}
                  />
                </div>

                {/* Password Input (not shown for reset) */}
                {authMode !== "reset" && (
                  <div className="mb-4 text-left">
                    <label className="block text-white mb-2 text-sm">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full border px-3 py-2 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isAuthenticating}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Password (only for registration) */}
                {authMode === "register" && (
                  <div className="mb-4 text-left">
                    <label className="block text-white mb-2 text-sm">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="w-full border px-3 py-2 pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isAuthenticating}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-900 border border-red-600 text-red-200 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-green-900 border border-green-600 text-green-200 text-sm"
                  >
                    {successMessage}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  onClick={authMode === "reset" ? handlePasswordReset : handleSubmit}
                  disabled={isAuthenticating}
                  className="login tracking-wide w-full text-white py-3 mb-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAuthenticating ? "Please wait..." : 
                   authMode === "reset" ? "Send Reset Email" :
                   authMode === "register" ? "Create Account" : "Sign In"}
                </button>

                {/* Forgot Password Link (only for login) */}
                {authMode === "login" && (
                  <button
                    onClick={() => {
                      setAuthMode("reset");
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="text-sm text-blue-400 hover:underline mb-3 block"
                  >
                    Forgot password?
                  </button>
                )}

                {/* Switch between Login/Register */}
                {authMode !== "reset" && (
                  <button
                    onClick={() => {
                      setAuthMode(authMode === "login" ? "register" : "login");
                      setError("");
                      setSuccessMessage("");
                      setPassword("");
                      setConfirmPassword("");
                    }}
                    className="text-sm text-gray-400 hover:underline mb-3 block"
                  >
                    {authMode === "login" 
                      ? "Don't have an account? Create one" 
                      : "Already have an account? Login"}
                  </button>
                )}

                {/* Back Button */}
                <button
                  onClick={() => {
                    setAuthMode(null);
                    setError("");
                    setSuccessMessage("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={isAuthenticating}
                  className="text-sm text-gray-400 hover:underline text-white"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Password Security Note */}
      <div className="mt-8 max-w-md text-center">
        <p className="text-xs text-gray-400">
          All passwords are securely encrypted by Firebase Authentication
        </p>
      </div>
    </div>
  );
}











// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { auth, db } from "../lib/firebase";
// import { 
//   onAuthStateChanged, 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   sendPasswordResetEmail 
// } from "firebase/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { motion, AnimatePresence } from "framer-motion";
// import { Eye, EyeOff } from "lucide-react";

// const PARTICLE_COUNT = 40;

// export default function Home() {
//   const [authMode, setAuthMode] = useState(null); // "login", "register", or "reset"
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isAuthenticating, setIsAuthenticating] = useState(false);
//   const router = useRouter();

//   const particles = useMemo(() => {
//     return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
//       const duration = Math.random() * 18 + 14;
//       return {
//         id: i,
//         size: Math.random() * 2.5 + 1,
//         left: Math.random() * 100,
//         top: Math.random() * 100,
//         duration,
//         delay: Math.random() * -duration
//       };
//     });
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user && !isAuthenticating && !successMessage) {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         const savedPage = userDoc.exists() ? userDoc.data().currentPage : null;

//         if (savedPage) {
//           router.push(`/adventure/${savedPage}`);
//         } else {
//           router.push("/dashboard");
//         }
//       } else {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [isAuthenticating, successMessage, router]);

//   const validateEmail = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const validatePassword = (password) => {
//     return password.length >= 6;
//   };

//   const handlePasswordReset = async () => {
//     setError("");
//     setSuccessMessage("");

//     if (!email) {
//       setError("Please enter your email address");
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     try {
//       await sendPasswordResetEmail(auth, email);
//       setSuccessMessage("Password reset email sent! Check your inbox.");
//       setTimeout(() => {
//         setAuthMode("login");
//         setSuccessMessage("");
//       }, 3000);
//     } catch (err) {
//       setError(err.message || "Failed to send reset email");
//     }
//   };

//   const handleSubmit = async () => {
//     setError("");
//     setSuccessMessage("");
//     setIsAuthenticating(true);

//     // Validation
//     if (!email || !password) {
//       setError("Please fill in all fields");
//       setIsAuthenticating(false);
//       return;
//     }

//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       setIsAuthenticating(false);
//       return;
//     }

//     if (!validatePassword(password)) {
//       setError("Password must be at least 6 characters");
//       setIsAuthenticating(false);
//       return;
//     }

//     if (authMode === "register" && password !== confirmPassword) {
//       setError("Passwords do not match");
//       setIsAuthenticating(false);
//       return;
//     }

//     try {
//       let userCred;

//       if (authMode === "register") {
//         // Create new account
//         userCred = await createUserWithEmailAndPassword(auth, email, password);
        
//         // Firebase Auth automatically hashes passwords - no need to manually salt/hash
//         // Email is stored as-is (not sensitive like passwords)
//         await setDoc(doc(db, "users", userCred.user.uid), {
//           email: userCred.user.email,
//           currentPage: "page_1",
//           createdAt: new Date(),
//           characterName: "",
//           stats: {
//             Strength: 10,
//             Dexterity: 10,
//             Constitution: 10,
//             Intelligence: 10,
//             Wisdom: 10,
//             Charisma: 10,
//             HP: 20,
//             MaxHP: 20,
//             XP: 0,
//             Level: 1,
//           },
//         });
        
//         setSuccessMessage("Protocol generating...");
//       } else {
//         // Login
//         userCred = await signInWithEmailAndPassword(auth, email, password);
//         const docSnap = await getDoc(doc(db, "users", userCred.user.uid));
//         const characterName = docSnap.exists() ? docSnap.data().characterName : null;
//         setSuccessMessage(`Welcome back, ${characterName || "Gatebreaker"}!`);
//       }

//       // Redirect after short delay
//       setTimeout(async () => {
//         const userRef = doc(db, "users", userCred.user.uid);
//         const userDoc = await getDoc(userRef);
//         const page = userDoc.exists() ? userDoc.data().currentPage : "page_1";
//         router.push(`/adventure/${page}`);
//       }, 1000);
//     } catch (err) {
//       // Handle specific Firebase errors
//       if (err.code === 'auth/email-already-in-use') {
//         setError("This email is already registered");
//       } else if (err.code === 'auth/wrong-password') {
//         setError("Incorrect password");
//       } else if (err.code === 'auth/user-not-found') {
//         setError("No account found with this email");
//       } else if (err.code === 'auth/too-many-requests') {
//         setError("Too many attempts. Please try again later");
//       } else {
//         setError(err.message || "Authentication failed");
//       }
//       setIsAuthenticating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-auth">
//         <p className="text-white text-xl">Loading...</p>
//       </div>
//     );
//   }

//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
//     exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-auth px-10 hero">
//       <div className="screen-particles">
//         {particles.map(p => (
//           <span
//             key={p.id}
//             style={{
//               width: `${p.size}px`,
//               height: `${p.size}px`,
//               left: `${p.left}%`,
//               top: `${p.top}%`,
//               filter: 'blur(0.8px) saturate(1.1) contrast(1.1)',
//               animationDuration: `${p.duration}s`,
//               animationDelay: `${p.delay}s`
//             }}
//           />
//         ))}
//       </div>

//       <img 
//         src="assets/logo2.png" 
//         alt="Gatebreaker Protocol Logo" 
//         className="mb-16 object-contain logo" 
//       />

//       <div className="rounded shadow-md w-full max-w-md text-center">
//         <AnimatePresence mode="wait" initial={false}>
//           {!authMode ? (
//             // Initial button selection
//             <motion.div
//               key="buttons"
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               className="space-y-4"
//             >
//               <button
//                 className="login text-xl tracking-wide w-full text-white py-3"
//                 onClick={() => setAuthMode("login")}
//               >
//                 Login
//               </button>
//               <button
//                 className="login text-xl tracking-wide w-full text-white py-3"
//                 onClick={() => setAuthMode("register")}
//               >
//                 Create Account
//               </button>
//             </motion.div>
//           ) : (
//             // Auth form
//             <motion.div
//               key="form"
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//             >
//               <div className="login-div box p-8">
//                 <h1 className="text-2xl tracking-wider mb-6 capitalize text-white">
//                   {authMode === "reset" ? "Reset Password" : authMode === "register" ? "Create Account" : "Login"}
//                 </h1>

//                 {/* Email Input */}
//                 <div className="mb-4 text-left">
//                   <label className="block text-white mb-2 text-sm">Email</label>
//                   <input
//                     type="email"
//                     placeholder="Enter your email address"
//                     className="w-full border rounded px-3 py-2"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     disabled={isAuthenticating}
//                   />
//                 </div>

//                 {/* Password Input (not shown for reset) */}
//                 {authMode !== "reset" && (
//                   <div className="mb-4 text-left">
//                     <label className="block text-white mb-2 text-sm">Password</label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         className="w-full border rounded px-3 py-2 pr-10"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         disabled={isAuthenticating}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                       >
//                         {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Confirm Password (only for registration) */}
//                 {authMode === "register" && (
//                   <div className="mb-4 text-left">
//                     <label className="block text-white mb-2 text-sm">Confirm Password</label>
//                     <div className="relative">
//                       <input
//                         type={showConfirmPassword ? "text" : "password"}
//                         placeholder="Confirm your password"
//                         className="w-full border rounded px-3 py-2 pr-10"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         disabled={isAuthenticating}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                       >
//                         {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Error Message */}
//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-4 p-3 bg-red-900 border border-red-600 rounded text-red-200 text-sm"
//                   >
//                     {error}
//                   </motion.div>
//                 )}

//                 {/* Success Message */}
//                 {successMessage && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-4 p-3 bg-green-900 border border-green-600 rounded text-green-200 text-sm"
//                   >
//                     {successMessage}
//                   </motion.div>
//                 )}

//                 {/* Submit Button */}
//                 <button
//                   onClick={authMode === "reset" ? handlePasswordReset : handleSubmit}
//                   disabled={isAuthenticating}
//                   className="login tracking-wide w-full text-white py-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isAuthenticating ? "Please wait..." : 
//                    authMode === "reset" ? "Send Reset Email" :
//                    authMode === "register" ? "Create Account" : "Sign In"}
//                 </button>

//                 {/* Forgot Password Link (only for login) */}
//                 {authMode === "login" && (
//                   <button
//                     onClick={() => {
//                       setAuthMode("reset");
//                       setError("");
//                       setSuccessMessage("");
//                     }}
//                     className="text-sm text-blue-400 hover:underline mb-3 block"
//                   >
//                     Forgot password?
//                   </button>
//                 )}

//                 {/* Switch between Login/Register */}
//                 {authMode !== "reset" && (
//                   <button
//                     onClick={() => {
//                       setAuthMode(authMode === "login" ? "register" : "login");
//                       setError("");
//                       setSuccessMessage("");
//                       setPassword("");
//                       setConfirmPassword("");
//                     }}
//                     className="text-sm text-gray-400 hover:underline mb-3 block"
//                   >
//                     {authMode === "login" 
//                       ? "Don't have an account? Create one" 
//                       : "Already have an account? Login"}
//                   </button>
//                 )}

//                 {/* Back Button */}
//                 <button
//                   onClick={() => {
//                     setAuthMode(null);
//                     setError("");
//                     setSuccessMessage("");
//                     setEmail("");
//                     setPassword("");
//                     setConfirmPassword("");
//                   }}
//                   disabled={isAuthenticating}
//                   className="text-sm text-gray-400 hover:underline text-white"
//                 >
//                   Back
//                 </button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Password Security Note */}
//       <div className="mt-8 max-w-md text-center">
//         <p className="text-xs text-gray-400">
//           All passwords are securely encrypted by Firebase Authentication
//         </p>
//       </div>
//     </div>
//   );
// }











// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { auth, db } from "../lib/firebase";
// import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import { motion, AnimatePresence } from "framer-motion";
// import { animate, waapi, eases, spring } from 'animejs';


// const PARTICLE_COUNT = 40;

// export default function Home() {
//   const [authMode, setAuthMode] = useState(null); // "login" or "register"
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const [successMessage, setSuccessMessage] = useState("");
//   const [isAuthenticating, setIsAuthenticating] = useState(false);

//   {successMessage && (
//     <div style={{ color: 'green', marginTop: '10px' }}>
//       {successMessage}
//     </div>
//   )}

//   //   useEffect(() => {
//   //   const container = document.getElementById("screenParticles");
//   //   if (!container) return;

//   //   const PARTICLE_COUNT = 40;

//   //   for (let i = 0; i < PARTICLE_COUNT; i++) {
//   //     const dot = document.createElement("span");
//   //     const size = Math.random() * 2.5 + 1;
//   //     const duration = Math.random() * 18 + 14;
//   //     const delay = Math.random() * -duration;
//   //     const left = Math.random() * 100;
//   //     const top = Math.random() * 100;

//   //     dot.style.width = size + "px";
//   //     dot.style.height = size + "px";
//   //     dot.style.left = left + "%";
//   //     dot.style.top = top + "%";
//   //     dot.style.animationDuration = duration + "s";
//   //     dot.style.animationDelay = delay + "s";

//   //     container.appendChild(dot);
//   //   }

//   //   return () => (container.innerHTML = "");
//   // }, []);

//     const particles = useMemo(() => {
//     return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
//       const duration = Math.random() * 18 + 14; // 14–32s
//       return {
//         id: i,
//         size: Math.random() * 2.5 + 1,      // 1–3.2px
//         left: Math.random() * 100,          // %
//         top: Math.random() * 100,           // %
//         duration,
//         delay: Math.random() * -duration    // negative for staggered starts
//       };
//     });
//   }, []);
  

// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, async (user) => {
//     if (user && !isAuthenticating && !successMessage) {
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       const savedPage = userDoc.exists() ? userDoc.data().currentPage : null;
//       console.log(user);

//       if (savedPage) {
//         router.push(`/adventure/${savedPage}`);
//       } else {
//         router.push("/dashboard");
//       }
//     } else {
//       setLoading(false);
//     }
//   });

//   return () => unsubscribe();
// }, [isAuthenticating, successMessage]);


//   // const handleSubmit = async () => {
//   //   const userRef = doc(db, "users", user.uid);

//   //   try {
//   //     if (authMode === "register") {
//   //       const userCred = await createUserWithEmailAndPassword(auth, email, password);
//   //       await setDoc(doc(db, "users", userCred.user.uid), {
//   //         email: userCred.user.email,
//   //         currentPage: "page_1",
//   //         createdAt: new Date(),
//   //       });
//   //       router.push(`/adventure/page_1`);
//   //     } else {
//   //       await signInWithEmailAndPassword(auth, email, password);
//   //         const docSnap = await getDoc(userRef);
//   //         const savedPage = docSnap.exists() ? docSnap.data().currentPage : "page_1";
//   //         router.push(`/adventure/${savedPage}`);
//   //     }
//   //   } catch (err) {
//   //     alert(err.message);
//   //   }
//   // };

//   const handleSubmit = async () => {
//     setIsAuthenticating(true);
//     try {
//       let userCred;

//       if (authMode === "create account") {
//         userCred = await createUserWithEmailAndPassword(auth, email, password);
//         await setDoc(doc(db, "users", userCred.user.uid), {
//           email: userCred.user.email,
//           currentPage: "page_1",
//           createdAt: new Date(),
//           name: "",
//           stats: {
//             Strength: 10,
//             Dexterity: 10,
//             Constitution: 10,
//             Intelligence: 10,
//             Wisdom: 10,
//             Charisma: 10,
//             HP: 20,
//             MaxHP: 20,
//             XP: 0,
//             Level: 1,
//           },
//         });
//         setSuccessMessage("Protocol generating...");
//       } else {
//         userCred = await signInWithEmailAndPassword(auth, email, password);
//         const docSnap = await getDoc(doc(db, "users", userCred.user.uid));
//         const savedPage = docSnap.exists() ? docSnap.data().currentPage : "page_1";
//         setSuccessMessage(`Welcome back, ${userProfile?.characterName || "Gatebreaker"}!`);
//       }

//       setTimeout(async () => {
//         const userRef = doc(db, "users", userCred.user.uid);
//         const userDoc = await getDoc(userRef);
//         const page = userDoc.exists() ? userDoc.data().currentPage : "page_1";
//         router.push(`/adventure/${page}`);
//         // router.push(`/adventure/1`);
//       }, 1000);
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   const containerVariants = {
//     hidden: { opacity: 0, x: 50 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
//     exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-auth px-10 hero">

//       <div className="screen-particles">
//         {particles.map(p => (
//           <span
//             key={p.id}
//             style={{
//               width: `${p.size}px`,
//               height: `${p.size}px`,
//               left: `${p.left}%`,
//               top: `${p.top}%`,
//               filter: 'blur(0.8px) saturate(1.1) contrast(1.1)',
//               animationDuration: `${p.duration}s`,
//               animationDelay: `${p.delay}s`
//             }}
//           />
//         ))}
//       </div>

//       {/* <div className="screen-particles" id="screenParticles"></div> */}

//       {/* <div style={{ width: '100%', height: '600px', position: 'fixed', zIndex: "-1", mixBlendMode: 'lighten', top: 0, left: 0 }}>
//         <DarkVeil />
//       </div> */}

//       <img src="assets/logo2.png" alt="Gatebreaker Protocol Logo" className="mb-16 object-contain logo" />
//       {/* <img src="assets/logo.png" alt="Gatebreaker Protocol Logo" className="mb-16 object-contain logo" /> */}
//       {/* <h1 className="text-2xl tracking-wider mb-16 text-white drop-shadow-lg">"The Chosen Operator"</h1> */}
//       <div className="rounded shadow-md w-full max-w-xs sm:max-w-xs text-center">
//         <AnimatePresence mode="wait" initial={false}>
//           {!authMode ? (
//             <motion.div
//               key="buttons"
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//             >
//               <button
//                 className="login text-xl tracking-wide w-full text-white py-3 mb-4"
//                 onClick={() => setAuthMode("login")}
//               >
//                 Login
//               </button>
//               <button
//                 className="login text-xl tracking-wide w-full text-white py-3"
//                 onClick={() => setAuthMode("create account")}
//               >
//                 Create Account
//               </button>

//               {/* <StarBorder
//                 as="button"
//                 className="custom-class"
//                 color="cyan"
//                 speed="5s"
//               >
//                 // content
//               </StarBorder> */}

//             </motion.div>
//           ) : (
//             <motion.div
//               key="form"
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//             >
//               <div className="login-div box">
//                 <h1 className="text-2xl tracking-wider mb-4 capitalize text-white">{authMode}</h1>
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   placeholder="Enter your email address"
//                   className="w-full border mb-3"
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <label>Password</label>
//                 <input
//                   type="password"
//                   placeholder="Enter your password"
//                   className="w-full border mb-3"
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 {/* <button
//                   onClick={handleSubmit}
//                   className="login text-xl tracking-wide w-full text-white py-3 mb-4"
//                 >
//                   Create an account
//                 </button> */}
//                 <button
//                   onClick={handleSubmit}
//                   className="login tracking-wide w-full text-white py-3 mb-4"
//                 >
//                   SIGN IN
//                 </button>
//                 <button
//                   onClick={() => setAuthMode(null)}
//                   className="text-sm text-gray-600 hover:underline text-white"
//                 >
//                   Back
//                 </button>
//               </div>
//             </motion.div>
//           )}
//           {successMessage && (
//             <motion.div
//               className="mt-4 text-white-700 font-semibold"
//               style={{ color: 'white', marginTop: '15px' }}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               {successMessage}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }
