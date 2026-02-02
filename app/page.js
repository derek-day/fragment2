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
  const [cookieConsent, setCookieConsent] = useState(null); // null = not set, true = accepted
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
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setCookieConsent(true);
    }
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

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setCookieConsent(true);
  };

  const declineCookies = () => {
    setCookieConsent(false);
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
          hasFailed: false,
          tookEnvironmentPotion: false,
          tookHospitalNote: false,
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
        <style jsx>{`
          @keyframes rotate3d {
            0% {
              transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
            }
            50% {
              transform: perspective(1000px) rotateY(180deg) rotateX(10deg);
            }
            100% {
              transform: perspective(1000px) rotateY(360deg) rotateX(0deg);
            }
          }
          
          .logo-3d {
            animation: rotate3d 2s ease-in-out infinite;
            transform-style: preserve-3d;
          }
        `}</style>
        
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

        <div className="logo-3d">
          <img 
            src="/assets/logocircle.png" 
            alt="Loading" 
            className="w-24 h-24 md:w-32 md:h-32"
          />
        </div>
      </div>
    );
  }


  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-auth hero">
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

  //       <p className="text-white text-xl">Loading...</p>
  //     </div>
  //   );
  // }

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

      {/* Footer - Privacy Policy & Support */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 py-3 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
            <a 
              href="/privacy-policy" 
              className="hover:text-white transition-colors underline"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms-of-service" 
              className="hover:text-white transition-colors underline"
            >
              Terms of Service
            </a>
          </div>
          <div className="text-center md:text-right">
            Need help? Contact us at{' '}
            <a 
              href="mailto:gatebreakerllc@gmail.com" 
              className="text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              gatebreakerllc@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {cookieConsent === null && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-16 md:bottom-20 left-0 right-0 z-50 px-4"
          >
            <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 shadow-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-2 text-sm md:text-base">Cookie Notice</h3>
                  <p className="text-gray-300 text-xs md:text-sm">
                    We use essential cookies to ensure the website functions properly and to provide authentication services. 
                    We do not use tracking or advertising cookies. By continuing to use this site, you agree to our use of essential cookies.
                    {' '}
                    <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">
                      Learn more
                    </a>
                  </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={acceptCookies}
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-semibold transition-colors text-sm cinzel-text"
                  >
                    Accept
                  </button>
                  <button
                    onClick={declineCookies}
                    className="flex-1 md:flex-none bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 font-semibold transition-colors text-sm cinzel-text"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Decline Message */}
      <AnimatePresence>
        {cookieConsent === false && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-16 md:bottom-20 left-0 right-0 z-50 px-4"
          >
            <div className="max-w-2xl mx-auto bg-yellow-900/90 border border-yellow-700 shadow-2xl p-4">
              <p className="text-yellow-100 text-xs md:text-sm text-center">
                Without essential cookies, authentication and core features may not work properly. 
                You can change your preference at any time by refreshing the page.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
// import { generateUniqueBreakerID, formatBreakerID } from "../lib/breakerIdGenerator";

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

//         const breakerId = await generateUniqueBreakerID(db);
//         const formattedId = formatBreakerID(breakerId);
        
//         // Firebase Auth automatically hashes passwords - no need to manually salt/hash
//         // Email is stored as-is (not sensitive like passwords)
//         await setDoc(doc(db, "users", userCred.user.uid), {
//           email: userCred.user.email,
//           breakerId: breakerId,
//           breakerIdFormatted: formattedId, // For display purposes
//           currentPage: "page_1",
//           createdAt: new Date(),
//           characterName: "",
//           stats: {
//             Fellowship: 10,
//             Athletics: 10,
//             Thought: 10,
//             Essence: 10,
//             HP: 20,
//             MaxHP: 20,
//             BP: 0,
//             Level: 1,
//           },
//           route: "",
//           className: "",
//           breakerClass: "",
//           metNPCs: [],
//           deadNPCs: [],
//           failedCombats: [],
//           failedRolls: [],
//           deaths: 0,
//           revivals: 0,
//           deathLocations: [],
//           toldTeamAbout: [],
//           niceToAkemi: false,
//           gaveToCale: false,
//           hasFailed: false,
//           tookEnvironmentPotion: false,
//           tookHospitalNote: false,
//           visitedPages: ["page_1"],
//           wentAlone: false,
//           minionGroups: {},
//           lastUpdated: new Date()
//         });
        
//         // setSuccessMessage("Protocol generating...");
//         setSuccessMessage(`Protocol Initialized\nBreaker ID: ${formattedId}`);
//       } else {
//         // Login
//         userCred = await signInWithEmailAndPassword(auth, email, password);
//         const docSnap = await getDoc(doc(db, "users", userCred.user.uid));
//         const characterName = docSnap.exists() ? docSnap.data().characterName : null;
//         const breakerIdFormatted = docSnap.exists() ? docSnap.data().breakerIdFormatted : null;
//         //setSuccessMessage(`Welcome back, ${characterName || "Gatebreaker"}!`);
//         setSuccessMessage(`Welcome back, ${characterName || "Gatebreaker"}!\nID: ${breakerIdFormatted || "Unknown"}`);
//       }

//       // Redirect after short delay
//       setTimeout(async () => {
//         const userRef = doc(db, "users", userCred.user.uid);
//         const userDoc = await getDoc(userRef);
//         const page = userDoc.exists() ? userDoc.data().currentPage : "page_1";
//         router.push(`/adventure/${page}`);
//       }, 2000);
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
//       <div className="min-h-screen flex items-center justify-center bg-auth hero">
//         <style jsx>{`
//           @keyframes rotate3d {
//             0% {
//               transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
//             }
//             50% {
//               transform: perspective(1000px) rotateY(180deg) rotateX(10deg);
//             }
//             100% {
//               transform: perspective(1000px) rotateY(360deg) rotateX(0deg);
//             }
//           }
          
//           .logo-3d {
//             animation: rotate3d 2s ease-in-out infinite;
//             transform-style: preserve-3d;
//           }
//         `}</style>
        
//         <div className="screen-particles">
//           {particles.map(p => (
//             <span
//               key={p.id}
//               style={{
//                 width: `${p.size}px`,
//                 height: `${p.size}px`,
//                 left: `${p.left}%`,
//                 top: `${p.top}%`,
//                 filter: 'blur(0.8px) saturate(1.1) contrast(1.1)',
//                 animationDuration: `${p.duration}s`,
//                 animationDelay: `${p.delay}s`
//               }}
//             />
//           ))}
//         </div>

//         <div className="logo-3d">
//           <img 
//             src="/assets/logocircle.png" 
//             alt="Loading" 
//             className="w-24 h-24 md:w-32 md:h-32"
//           />
//         </div>
//       </div>
//     );
//   }


//   // if (loading) {
//   //   return (
//   //     <div className="min-h-screen flex items-center justify-center bg-auth hero">
//   //       <div className="screen-particles">
//   //         {particles.map(p => (
//   //           <span
//   //             key={p.id}
//   //             style={{
//   //               width: `${p.size}px`,
//   //               height: `${p.size}px`,
//   //               left: `${p.left}%`,
//   //               top: `${p.top}%`,
//   //               filter: 'blur(0.8px) saturate(1.1) contrast(1.1)',
//   //               animationDuration: `${p.duration}s`,
//   //               animationDelay: `${p.delay}s`
//   //             }}
//   //           />
//   //         ))}
//   //       </div>

//   //       <p className="text-white text-xl">Loading...</p>
//   //     </div>
//   //   );
//   // }

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
//                     className="w-full border px-3 py-2"
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
//                         className="w-full border px-3 py-2 pr-10"
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
//                         className="w-full border px-3 py-2 pr-10"
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
//                     className="mb-4 p-3 bg-red-900 border border-red-600 text-red-200 text-sm"
//                   >
//                     {error}
//                   </motion.div>
//                 )}

//                 {/* Success Message */}
//                 {successMessage && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-4 p-3 bg-green-900 border border-green-600 text-green-200 text-sm"
//                   >
//                     {successMessage}
//                   </motion.div>
//                 )}

//                 {/* Submit Button */}
//                 <button
//                   onClick={authMode === "reset" ? handlePasswordReset : handleSubmit}
//                   disabled={isAuthenticating}
//                   className="login tracking-wide w-full text-white py-3 mb-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
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