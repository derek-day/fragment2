import React from 'react';
import PrismaticBurst from './PrismaticBurst'; // Adjust path to where you saved the background

const ChapterEndCard = ({ config }) => {
  const { title, text } = config;

  return (
    <div style={styles.container}>
      {/* Background Layer */}
      <div style={styles.backgroundWrapper}>
        <PrismaticBurst 
          intensity={2.2} 
          speed={0.5} 
          distort={0.3}
          // You can customize colors here if you want a specific theme
          // colors={["#FF0000", "#00FF00", "#0000FF"]} 
        />
      </div>

      {/* Content Layer */}
      <div style={styles.card}>
        <h1 style={styles.title}>{title}</h1>
        <div style={styles.divider} />
        <p style={styles.text}>You have finished Chapter 1 of The Gatebreaker Protocol!{'\n\n'}
            Thank you for playing!{'\n\n'} 
            Stay tuned for Chapter 2!
        </p>
        
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
    position: 'relative',
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

export default ChapterEndCard;