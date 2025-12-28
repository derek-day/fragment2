"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Shield, Zap, User } from "lucide-react";

export default function StatLayout() {
  const [stats, setStats] = useState(null);
  const [characterName, setCharacterName] = useState("");
  const [className, setClassName] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setStats(data.stats);
          setCharacterName(data.characterName || "Unknown");
          setClassName(data.className || "Unknown");
        }
      }
    };

    fetchStats();
    
    // Refresh stats every 5 seconds when page is visible
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchStats();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const statBarVariants = {
    hidden: { width: 0 },
    visible: (custom) => ({
      width: `${custom}%`,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut"
      }
    })
  };

  const hpPercentage = (stats.HP / stats.MaxHP) * 100;

  return (
    <motion.div 
      className="stat-layout fixed top-4 left-4 bg-gray-900 bg-opacity-90 backdrop-blur-sm text-white p-4 shadow-2xl border-2 border-gray-700 z-40"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      style={{ minWidth: "250px", left: 10, top: 10, zIndex: 4 }}
    >
      {/* Character Info */}
      <motion.div 
        className="mb-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ x: 2 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <User size={16} className="text-blue-400" />
          <h3 className="font-bold text-lg">{characterName}</h3>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-2">
          <Shield size={12} />
          {className} • Level {stats.Level}
        </div>
      </motion.div>

      {/* HP Bar */}
      <motion.div 
        className="mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Heart size={14} className="text-red-400" />
            <span className="text-xs font-semibold">HP</span>
          </div>
          <span className="text-xs font-bold">
            {stats.HP}/{stats.MaxHP}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-600 overflow-hidden">
          <motion.div
            custom={hpPercentage}
            variants={statBarVariants}
            initial="hidden"
            animate="visible"
            className={`h-full flex items-center justify-center text-xs font-bold ${
              hpPercentage > 60 ? 'bg-green-500' :
              hpPercentage > 30 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ 
              boxShadow: hpPercentage > 0 ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none'
            }}
          />
        </div>
      </motion.div>

      {/* XP Bar */}
      <motion.div 
        className="mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-xs font-semibold">XP</span>
          </div>
          <span className="text-xs">{stats.XP}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 border border-gray-600 overflow-hidden">
          <motion.div
            custom={(stats.XP % 100)}
            variants={statBarVariants}
            initial="hidden"
            animate="visible"
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            style={{ 
              boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)'
            }}
          />
        </div>
      </motion.div>

      {/* Expanded Stats */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <motion.div 
              className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-700"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {Object.entries({
                STR: stats.Strength,
                DEX: stats.Dexterity,
                CON: stats.Constitution,
                INT: stats.Intelligence,
                WIS: stats.Wisdom,
                CHA: stats.Charisma
              }).map(([stat, value], index) => (
                <motion.div
                  key={stat}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="bg-gray-800 p-2 rounded text-center border border-gray-700 hover:border-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-xs text-gray-400">{stat}</div>
                  <div className="text-lg font-bold text-blue-400">{value}</div>
                  <div className="text-xs text-gray-500">
                    {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand/Collapse Indicator */}
      <motion.div 
        className="text-center mt-2 text-xs text-gray-500 cursor-pointer hover:text-gray-400"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
      >
        {isExpanded ? '▲ Less' : '▼ More'}
      </motion.div>
    </motion.div>
  );
}











// 'use client'; // Only needed if you're using the App Router

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // For Pages Router
// import { auth, db } from "../lib/firebase";
// import { doc, updateDoc } from "firebase/firestore";
// import { signOut } from "firebase/auth";
// import { useParams } from "next/navigation";
// import { adventurePages } from '../app/adventure/pages';


// export default function MenuButton() {
//   const [open, setOpen] = useState(false);
//   const router = useRouter();
//   const { pageId } = useParams();
//   const page = adventurePages[pageId];
//   const user = auth.currentUser;
//   const characterName = user?.characterName || "???";
//   const className = user?.className || "???";

//   const handleNavigation = (path) => {
//     setOpen(false);
//     router.push(path);
//   };

//       useEffect(() => {
//           if (!page) router.push("/adventure/page_1");
//       }, [page]);
  
//       if (!page) return null;

//   return (
//     <div style={statStyle}>
//       <h2>Name: {characterName}</h2>
//       <h2>Class: {className}</h2>
//     </div>
    
//   );
// }

// const statStyle = {
//   //backgroundColor: 'rgba(9, 9, 19, 0.8)',
//   background: 'rgba(9, 9, 19, 0.8)',
//   border: '1px solid white',
//   padding: '8px 12px',
//   width: '100%',
//   textAlign: 'left',
//   fontFamily: '"ivypresto-headline", serif',
//   fontWeight: 300,
//   fontStyle: 'normal',
//   letterSpacing: '0.5px',
//   position: 'relative',
//   display: 'flex',
//   zIndex: 1
// };
