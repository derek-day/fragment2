'use client';

import React, { useEffect, useState } from 'react';
import Veil from '../components/Veil';
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { auth, db } from '../lib/firebase'; // Adjust path to your firebase config
import { getDoc, doc } from 'firebase/firestore';

export default function NotFound() {
  const router = useRouter();
  const [returnPath, setReturnPath] = useState('/');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inject keyframe animation on client-side only
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleSheet);

    // Determine return path based on Firebase auth and Firestore
    const determineReturnPath = async () => {
      try {
        const user = auth.currentUser;
        
        if (user) {
          // User is logged in, check for saved page
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            const currentPage = userDoc.data().currentPage;
            
            if (currentPage) {
              setReturnPath(`/adventure/${currentPage}`);
            } else {
              // Logged in but no saved page, go to home
              setReturnPath('/');
            }
          } else {
            // User doc doesn't exist yet, go to home
            setReturnPath('/');
          }
        } else {
          // Not logged in, go to home
          setReturnPath('/');
        }
      } catch (error) {
        console.error('Error determining return path:', error);
        setReturnPath('/');
      } finally {
        setIsLoading(false);
      }
    };

    // Wait for auth state to be ready before determining path
    const unsubscribe = auth.onAuthStateChanged(() => {
      determineReturnPath();
    });

    // Cleanup
    return () => {
      document.head.removeChild(styleSheet);
      unsubscribe();
    };
  }, []);

  const handleReturn = () => {
    router.push(returnPath);
  };

  return (
    <div style={styles.container}>
      {/* Background Layer */}
      <div style={styles.backgroundWrapper}>
        <Veil 
          intensity={2.2} 
          speed={0.5} 
          distort={0.3}
        />
      </div>

      {/* Content Layer */}
      <div style={styles.card}>
        <h1 style={styles.title}>404 — GATE MISALIGNED</h1>
        <div style={styles.divider} />
        <p style={styles.text}>
          You stepped through a gate that was never meant to open.{'\n\n'}
          The path fractures here. The world beyond does not exist.{'\n\n'} 
          Return before it notices.
        </p>

        <motion.button
          whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReturn}
          disabled={isLoading}
          className="continue-btn w-full px-6 py-3 font-semibold text-lg transition-all max-w-xs bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isLoading ? 'Loading...' : 'Return'}</span>
        </motion.button>
      </div>
    </div>
  );
}

// CSS Styles
const styles = {
  container: {
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  backgroundWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  card: {
    position: 'absolute',
    placeSelf: 'anchor-center',
    zIndex: 10,
    width: '85%',
    maxWidth: '600px',
    padding: '2rem',
    background: 'rgba(20, 20, 30, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 25px rgba(0,255,255,.2),inset 0 0 20px rgba(0,180,255,.1)',
    textAlign: 'center',
    color: '#ffffff',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    animation: 'fadeIn 1.5s ease-out',
  },
  title: {
    fontSize: '2rem',
    fontFamily: 'Cinzel, serif',
    fontWeight: '600',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: 'linear-gradient(to right, #fff, #a5a5a5)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 2px 10px rgba(255,255,255,0.1)',
  },
  divider: {
    height: '2px',
    width: '10rem',
    background: 'linear-gradient(90deg, transparent, #fff, transparent)',
    margin: '1rem auto 2.5rem',
  },
  text: {
    fontSize: '1rem',
    fontFamily: 'Urbanist, sans-serif',
    lineHeight: '1.4',
    whiteSpace: 'pre-line',
    color: '#e0e0e0',
    marginBottom: '1rem',
  },
};











// 'use client';

// import React, { useEffect } from 'react';
// import Veil from '../components/Veil'; // Adjust path to where you saved the background
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";

// export default function NotFound() {
//   const router = useRouter();

//   // Inject keyframe animation on client-side only
//   useEffect(() => {
//     const styleSheet = document.createElement("style");
//     styleSheet.innerText = `
//       @keyframes fadeIn {
//         from { opacity: 0; transform: translateY(20px); }
//         to { opacity: 1; transform: translateY(0); }
//       }
//     `;
//     document.head.appendChild(styleSheet);

//     // Cleanup
//     return () => {
//       document.head.removeChild(styleSheet);
//     };
//   }, []);

//   return (
//     <div style={styles.container}>
//       {/* Background Layer */}
//       <div style={styles.backgroundWrapper}>
//         <Veil 
//           intensity={2.2} 
//           speed={0.5} 
//           distort={0.3}
//         />
//       </div>

//       {/* Content Layer */}
//       <div style={styles.card}>
//         <h1 style={styles.title}>404 — GATE MISALIGNED</h1>
//         <div style={styles.divider} />
//         <p style={styles.text}>
//           You stepped through a gate that was never meant to open.{'\n\n'}
//           The path fractures here. The world beyond does not exist.{'\n\n'} 
//           Return before it notices.
//         </p>

//         <motion.button
//           whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => router.push('/')} 
//           className="continue-btn w-full px-6 py-3 font-semibold text-lg transition-all max-w-xs bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
//         >
//           <span>Return</span>
//         </motion.button>
//       </div>
//     </div>
//   );
// }

// // CSS Styles
// const styles = {
//   container: {
//     width: '100vw',
//     overflow: 'hidden',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#000',
//   },
//   backgroundWrapper: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     zIndex: 0,
//   },
//   card: {
//     position: 'absolute',
//     placeSelf: 'anchor-center',
//     zIndex: 10,
//     width: '85%',
//     maxWidth: '600px',
//     padding: '2rem',
//     background: 'rgba(20, 20, 30, 0.6)',
//     backdropFilter: 'blur(20px)',
//     WebkitBackdropFilter: 'blur(20px)',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     boxShadow: '0 0 25px rgba(0,255,255,.2),inset 0 0 20px rgba(0,180,255,.1)',
//     textAlign: 'center',
//     color: '#ffffff',
//     fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
//     animation: 'fadeIn 1.5s ease-out',
//   },
//   title: {
//     fontSize: '2rem',
//     fontFamily: 'Cinzel, serif',
//     fontWeight: '600',
//     margin: '0 0 10px 0',
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em',
//     background: 'linear-gradient(to right, #fff, #a5a5a5)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     textShadow: '0 2px 10px rgba(255,255,255,0.1)',
//   },
//   divider: {
//     height: '2px',
//     width: '10rem',
//     background: 'linear-gradient(90deg, transparent, #fff, transparent)',
//     margin: '1rem auto 2.5rem',
//   },
//   text: {
//     fontSize: '1rem',
//     fontFamily: 'Urbanist, sans-serif',
//     lineHeight: '1.4',
//     whiteSpace: 'pre-line',
//     color: '#e0e0e0',
//     marginBottom: '1rem',
//   },
//   button: {
//     padding: '12px 30px',
//     fontSize: '1rem',
//     fontWeight: 'bold',
//     color: '#000',
//     backgroundColor: '#fff',
//     border: 'none',
//     borderRadius: '50px',
//     cursor: 'pointer',
//     boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
//     transition: 'transform 0.2s',
//   }
// };