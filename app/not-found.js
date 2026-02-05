'use client';

import React from 'react';
import Veil from '../components/Veil'; // Adjust path to where you saved the background
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default async function NotFound() {
// const NotFound = ({ }) => {
//   const { title, text } = config;
  const router = useRouter();


  return (
    <div style={styles.container}>
      {/* Background Layer */}
      <div style={styles.backgroundWrapper}>
        <Veil 
          intensity={2.2} 
          speed={0.5} 
          distort={0.3}
          // You can customize colors here if you want a specific theme
          // colors={["#FF0000", "#00FF00", "#0000FF"]} 
        />
      </div>

      {/* Content Layer */}
      <div style={styles.card}>
        <h1 style={styles.title}>404 — GATE MISALIGNED</h1>
        <div style={styles.divider} />
        <p style={styles.text}>You stepped through a gate that was never meant to open.{'\n\n'}
            The path fractures here. The world beyond does not exist.{'\n\n'} 
            Return before it notices.
        </p>

        <motion.button
        // <button
            // variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}

          onClick={() => router.push('/')} 
          className="continue-btn w-full px-6 py-3 font-semibold text-lg transition-all max-w-xs bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
        //   className="flex items-center gap-3 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 font-bold text-lg shadow-2xl border-b-4 border-green-900 active:border-b-0 active:scale-95 transition-all display cinzel-text"
        >
          {/* <RotateCcw size={24} /> */}
          <span>Return</span>
        {/* </button> */}
        </motion.button>

        
        {/* Optional: Add a 'Next' button if your game needs it */}
        {/* <button style={styles.button}>Continue</button> */}
      </div>
    </div>
  );
};

// CSS Styles (Inline for easy copy-paste, but can be moved to CSS/Tailwind)
const styles = {
  container: {
    // position: 'relative',
    width: '100vw',
    // height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // Fallback color
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
    // position: 'relative',
    position: 'absolute',
    placeSelf: 'anchor-center',
    zIndex: 10,
    width: '85%',
    maxWidth: '600px',
    padding: '2rem',
    // borderRadius: '20px',
    // Glassmorphism effect
    background: 'rgba(20, 20, 30, 0.6)', // Dark semi-transparent
    backdropFilter: 'blur(20px)',        // Blurs the Prismatic Burst behind the card
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    // boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
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
    whiteSpace: 'pre-line', // Respects the \n in your config text
    color: '#e0e0e0',
    marginBottom: '1rem',
  },
  button: {
    padding: '12px 30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
    transition: 'transform 0.2s',
  }
};

// Simple Fade In Keyframe injection
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

// export default NotFound;