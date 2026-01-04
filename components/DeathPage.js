"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, RotateCcw, BookOpen } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { recordRevival } from '../lib/progressService';

const DeathPage = ({ deathMessage, deathLocation, respawnPage = 'page_1' }) => {
  const router = useRouter();
  const [isReviving, setIsReviving] = useState(false);
  const [deathCount, setDeathCount] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadDeathInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setDeathCount(userDoc.data().deaths || 0);
        }
      }
    };
    loadDeathInfo();
  }, []);

  const handleRevive = async () => {
    setIsReviving(true);
    
    if (userId) {
      await recordRevival(userId);
    }
    
    // Dramatic pause before revival
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    router.push(`/adventure/${respawnPage}`);
  };

  const handleViewJournal = () => {
    router.push('/journal');
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Light Rays Background Effect */}
      <LightRays />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Skull Icon */}
            <motion.div
              className="flex justify-center mb-8"
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Skull className="w-32 h-32 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
            </motion.div>

            {/* Death Title */}
            <motion.h1
              className="text-6xl font-bold mb-4 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              You Died
            </motion.h1>

            {/* Death Message */}
            <motion.p
              className="text-xl text-gray-300 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {deathMessage || "Darkness consumes you..."}
            </motion.p>

            {/* Death Location */}
            {deathLocation && (
              <motion.p
                className="text-sm text-gray-500 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Location: {deathLocation}
              </motion.p>
            )}

            {/* Death Count */}
            {deathCount > 0 && (
              <motion.div
                className="mb-8 inline-block bg-red-900 bg-opacity-30 px-6 py-3 rounded-lg border border-red-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="text-xs text-gray-400 mb-1">Total Deaths</div>
                <div className="text-3xl font-bold text-red-400">{deathCount}</div>
              </motion.div>
            )}

            {/* Mysterious Message */}
            <motion.div
              className="mb-8 p-6 bg-gray-900 bg-opacity-50 backdrop-blur-sm rounded-lg border border-gray-800"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <p className="text-gray-400 italic text-sm leading-relaxed">
                "Go back," a soft voice tells you. It sounds so familiar.
              </p>
              <p className="text-gray-400 italic text-sm leading-relaxed mt-2">
                "I'm not ready for you yet."
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRevive}
                disabled={isReviving}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold rounded-lg flex items-center justify-center gap-3 shadow-lg disabled:cursor-not-allowed transition-all group"
              >
                <RotateCcw className={`w-5 h-5 ${isReviving ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                {isReviving ? 'Reviving...' : 'Revive'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewJournal}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg flex items-center justify-center gap-3 shadow-lg transition-all"
              >
                <BookOpen className="w-5 h-5" />
                View Journal
              </motion.button>
            </motion.div>

            {/* Hint Text */}
            <motion.p
              className="mt-8 text-xs text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              Death is not the end, only a temporary setback...
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Light Rays Background Component
const LightRays = ({ raysSpeed = 0.5 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="lightGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
        </defs>
        
        {/* Light Rays */}
        {[...Array(12)].map((_, i) => (
          <LightRay 
            key={i} 
            index={i} 
            speed={raysSpeed}
          />
        ))}
      </svg>
    </div>
  );
};

// Individual Light Ray Component
const LightRay = ({ index, speed }) => {
  const [rotation, setRotation] = useState(index * 30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + speed) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [speed]);

  return (
    <g transform={`rotate(${rotation} 50 50)`} opacity="0.15">
      <polygon
        points="50,50 48,0 52,0"
        fill="url(#lightGradient)"
        transform="translate(0, 0)"
      />
    </g>
  );
};

export default DeathPage;