"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Shield, Zap, User, Badge, Key } from "lucide-react";

export default function StatLayout() {
  const [stats, setStats] = useState(null);
  const [characterName, setCharacterName] = useState("");
  const [className, setClassName] = useState("");
  const [breakerIdFormatted, setBreakerIdFormatted] = useState("");
  const [breakerClass, setBreakerClass] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Switched to onSnapshot for realtime updates (fixes 5s delay)
    const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats(data.stats);
        setCharacterName(data.characterName || "Unknown");
        setClassName(data.className || "Unknown");
        setBreakerIdFormatted(data.breakerIdFormatted || "000-000-000");
        setBreakerClass(data.breakerClass || "Unknown");
      }
    });

    return () => unsub();
  }, []);

  if (!stats) return null;

  // Safe Stats Calculation (Force Number type to avoid string math issues)
  const maxHP = Number(stats.MaxHP) || 20; 
  const currentHP = Number(stats.HP !== undefined ? stats.HP : 20);
  
  // Clamp percentage between 0 and 100
  const hpPercentage = Math.min(100, Math.max(0, (currentHP / maxHP) * 100));

  // Helper returns HEX codes for inline styles (guarantees visibility)
  const getHPColorInfo = (pct) => {
    if (pct > 60) return { hex: '#16a34a', tailwind: 'border-green-500', shadow: 'rgba(34, 197, 94, 0.5)' }; // green-600
    if (pct > 30) return { hex: '#eab308', tailwind: 'border-yellow-500', shadow: 'rgba(234, 179, 8, 0.5)' }; // yellow-500
    return { hex: '#dc2626', tailwind: 'border-red-500', shadow: 'rgba(239, 68, 68, 0.5)' }; // red-600
  };

  const colorInfo = getHPColorInfo(hpPercentage);

  return (
    <motion.div 
      className="display stat-layout fixed top-4 left-4 bg-gray-900 bg-opacity-95 backdrop-blur-md text-white p-4 shadow-2xl border-2 border-gray-700 z-50 rounded-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{ minWidth: "250px", left: 10, top: 10, zIndex: 50 }}
    >
      {/* Character Info Header */}
      <div 
        className="mb-4 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 mb-1">
          <User size={18} className="text-blue-400" />
          <h3 className="font-bold text-lg tracking-wide group-hover:text-blue-300 transition-colors">
            {characterName}
          </h3>
        </div>
        
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-2">
            <Key size={10} />
            ID: {breakerIdFormatted}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
            <Shield size={10} />
            {className} <span className="text-gray-600">|</span> LVL {stats.Level || 1}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
            <Badge size={10} />
            Breaker Class <span className="text-gray-600">|</span> {breakerClass}
          </div>
        </div>
      </div>

      {/* HP Bar Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Heart size={14} className="text-red-400" />
            <span className="text-xs font-bold text-gray-300 tracking-wider py-1">LP</span>
          </div>
          <span className="text-xs font-bold">
            {currentHP} <span className="text-gray-500">/</span> {maxHP}
          </span>
        </div>
        
        {/* Progress Bar Container */}
        <div className={`w-full bg-gray-800 rounded-full h-4 border ${colorInfo.tailwind} overflow-hidden transition-colors duration-300 relative`}>
          {/* Animated Inner Bar */}
          <div
            className="h-full transition-all duration-500 ease-out relative"
            style={{ 
              width: `${hpPercentage}%`,
              backgroundColor: colorInfo.hex, // Use explicit HEX to prevent grey bar
              boxShadow: `0 0 10px ${colorInfo.shadow}`
            }}
          >
            {/* Shine effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>
      </div>

      {/* BP (XP) Bar Section */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-xs font-bold text-gray-300 tracking-wider py-1">BP</span>
          </div>
          <span className="text-xs text-gray-400">{stats.BP || 0}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 border border-gray-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-500"
            style={{ 
              width: `${(Number(stats.BP) || 0) % 100}%`,
              boxShadow: '0 0 8px rgba(147, 51, 234, 0.3)' 
            }}
          />
        </div>
      </div>

      {/* Expanded Stats Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-700/50">
              {[
                { label: 'FEL', val: stats.Fellowship || 10, full: 'Fellowship' },
                { label: 'ATH', val: stats.Athletics || 10, full: 'Athletics' },
                { label: 'THO', val: stats.Thought || 10, full: 'Thought' },
                { label: 'ESS', val: stats.Essence || 10, full: 'Essence' }
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-800/50 p-2 border border-gray-700 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold">{stat.label}</div>
                    <div className="text-xs text-blue-400">
                      {Math.floor((Number(stat.val) - 10) / 2) >= 0 ? '+' : ''}
                      {Math.floor((Number(stat.val) - 10) / 2)}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-200">{stat.val}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div 
        className="flex justify-center mt-2 pt-1 cursor-pointer hover:bg-white/5 rounded transition-colors py-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          {isExpanded ? 'Collapse Stats' : 'View Stats'}
        </span>
      </div>
    </motion.div>
  );
}











// "use client";

// import { useEffect, useState } from "react";
// import { auth, db } from "../lib/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { motion, AnimatePresence } from "framer-motion";
// import { Heart, Shield, Zap, User, Badge, Key } from "lucide-react";

// export default function StatLayout() {
//   const [stats, setStats] = useState(null);
//   const [characterName, setCharacterName] = useState("");
//   const [className, setClassName] = useState("");
//   const [breakerIdFormatted, setBreakerIdFormatted] = useState("");
//   const [breakerClass, setBreakerClass] = useState("");
//   const [isExpanded, setIsExpanded] = useState(false);

//   useEffect(() => {
//     const fetchStats = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//           const data = userDoc.data();
//           setStats(data.stats);
//           setCharacterName(data.characterName || "Unknown");
//           setClassName(data.className || "Unknown");
//           setBreakerIdFormatted(data.breakerIdFormatted || "000-000-000");
//           setBreakerClass(data.breakerClass || "Unknown");
//         }
//       }
//     };

//     fetchStats();
    
//     const interval = setInterval(() => {
//       if (document.visibilityState === 'visible') {
//         fetchStats();
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   if (!stats) return null;

//   // Safe Stats Calculation
//   const maxHP = stats.MaxHP || 20; 
//   const currentHP = stats.HP !== undefined ? stats.HP : 20;
//   // Clamp percentage between 0 and 100
//   const hpPercentage = Math.min(100, Math.max(0, (currentHP / maxHP) * 100));

//   // Dynamic Colors Helper
//   const getHPBarColor = (pct) => {
//     if (pct > 60) return 'bg-green-600';
//     if (pct > 30) return 'bg-yellow-500';
//     return 'bg-red-600';
//   };

//   const getHPBorderColor = (pct) => {
//     if (pct > 60) return 'border-green-500';
//     if (pct > 30) return 'border-yellow-500';
//     return 'border-red-500';
//   };

//   const getHPShadow = (pct) => {
//     if (pct > 60) return '0 0 10px rgba(34, 197, 94, 0.5)';
//     if (pct > 30) return '0 0 10px rgba(234, 179, 8, 0.5)';
//     return '0 0 10px rgba(239, 68, 68, 0.5)';
//   };

//   console.log(getHPBarColor(hpPercentage));

//   return (
//     <motion.div 
//       className="display stat-layout fixed top-4 left-4 bg-gray-900 bg-opacity-95 backdrop-blur-md text-white p-4 shadow-2xl border-2 border-gray-700 z-50"
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.5 }}
//       style={{ minWidth: "250px", left: 10, top: 10, zIndex: 4 }}
//     >
//       {/* Character Info Header */}
//       <div 
//         className="mb-4 cursor-pointer group"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center gap-2 mb-1">
//           <User size={18} className="text-blue-400" />
//           <h3 className="font-bold text-lg tracking-wide group-hover:text-blue-300 transition-colors">
//             {characterName}
//           </h3>
//         </div>
        
//         <div className="space-y-0.5">
//           <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-2">
//             <Key size={10} />
//             ID: {breakerIdFormatted}
//           </div>
//           <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
//             <Shield size={10} />
//             {className} <span className="text-gray-600">|</span> LVL {stats.Level}
//           </div>
//           <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
//             <Badge size={10} />
//             Breaker Class <span className="text-gray-600">|</span> {breakerClass}
//           </div>
//         </div>
//       </div>

//       {/* HP Bar Section */}
//       <div className="mb-4">
//         <div className="flex items-center justify-between mb-1.5">
//           <div className="flex items-center gap-1.5">
//             <Heart size={14} className="text-red-400" />
//             <span className="text-xs font-bold text-gray-300 tracking-wider py-1">LP</span>
//           </div>
//           <span className="text-xs font-bold">
//             {currentHP} <span className="text-gray-500">/</span> {maxHP}
//           </span>
//         </div>
        
//         {/* Progress Bar Container */}
//         <div className={`w-full bg-gray-800 rounded-full h-4 border ${getHPBorderColor(hpPercentage)} overflow-hidden transition-all duration-300 relative`}>
//           {/* Animated Inner Bar - Key change: use style width instead of motion.div animate */}
//           <div
//             className={`h-full ${getHPBarColor(hpPercentage)} transition-all duration-500 ease-out relative`}
//             style={{ 
//               width: `${hpPercentage}%`,
//               boxShadow: getHPShadow(hpPercentage)
//             }}
//           >
//             {/* Shine effect */}
//             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent" />
//           </div>
//         </div>
//       </div>

//       {/* BP (XP) Bar Section */}
//       <div className="mb-2">
//         <div className="flex items-center justify-between mb-1.5">
//           <div className="flex items-center gap-1.5">
//             <Zap size={14} className="text-yellow-400" />
//             <span className="text-xs font-bold text-gray-300 tracking-wider py-1">BP</span>
//           </div>
//           <span className="text-xs text-gray-400">{stats.BP || 0}</span>
//         </div>
//         <div className="w-full bg-gray-800 rounded-full h-1.5 border border-gray-700 overflow-hidden">
//           <div
//             className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-500"
//             style={{ 
//               width: `${(stats.BP || 0) % 100}%`,
//               boxShadow: '0 0 8px rgba(147, 51, 234, 0.3)' 
//             }}
//           />
//         </div>
//       </div>

//       {/* Expanded Stats Drawer */}
//       <AnimatePresence>
//         {isExpanded && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="overflow-hidden"
//           >
//             <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-700/50">
//               {[
//                 { label: 'FEL', val: stats.Fellowship || 10, full: 'Fellowship' },
//                 { label: 'ATH', val: stats.Athletics || 10, full: 'Athletics' },
//                 { label: 'THO', val: stats.Thought || 10, full: 'Thought' },
//                 { label: 'ESS', val: stats.Essence || 10, full: 'Essence' }
//               ].map((stat) => (
//                 <div key={stat.label} className="bg-gray-800/50 p-2 border border-gray-700 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
//                   <div>
//                     <div className="text-[10px] text-gray-500 font-bold">{stat.label}</div>
//                     <div className="text-xs text-blue-400">
//                       {Math.floor((stat.val - 10) / 2) >= 0 ? '+' : ''}
//                       {Math.floor((stat.val - 10) / 2)}
//                     </div>
//                   </div>
//                   <div className="text-lg font-bold text-gray-200">{stat.val}</div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Toggle Button */}
//       <div 
//         className="flex justify-center mt-2 pt-1 cursor-pointer hover:bg-white/5 rounded transition-colors py-1"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
//           {isExpanded ? 'Collapse Stats' : 'View Stats'}
//         </span>
//       </div>
//     </motion.div>
//   );
// }















// "use client";

// import { useEffect, useState } from "react";
// import { auth, db } from "../lib/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { motion, AnimatePresence } from "framer-motion";
// import { Heart, Shield, Zap, User, Badge, Key } from "lucide-react";

// export default function StatLayout() {
//   const [stats, setStats] = useState(null);
//   const [characterName, setCharacterName] = useState("");
//   const [className, setClassName] = useState("");
//   const [breakerIdFormatted, setBreakerIdFormatted] = useState("");
//   const [breakerClass, setBreakerClass] = useState("");
//   const [isExpanded, setIsExpanded] = useState(false);

//   useEffect(() => {
//     const fetchStats = async () => {
//       const user = auth.currentUser;
//       if (user) {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//           const data = userDoc.data();
//           setStats(data.stats);
//           setCharacterName(data.characterName || "Unknown");
//           setClassName(data.className || "Unknown");
//           setBreakerIdFormatted(data.breakerIdFormatted || "000-000-000");
//           setBreakerClass(data.breakerClass || "Unknown");
//         }
//       }
//     };

//     fetchStats();
    
//     const interval = setInterval(() => {
//       if (document.visibilityState === 'visible') {
//         fetchStats();
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   if (!stats) return null;

//   // Safe Stats Calculation
//   const maxHP = stats.MaxHP || 20; 
//   const currentHP = stats.HP !== undefined ? stats.HP : 20;
//   // Clamp percentage between 0 and 100
//   const hpPercentage = Math.min(100, Math.max(0, (currentHP / maxHP) * 100));

//   // Dynamic Colors Helper
//   const getStatusStyles = (pct) => {
//     if (pct > 60) return { 
//       bg: 'bg-green-600', 
//       border: 'border-green-500', 
//       shadow: 'rgba(34, 197, 94, 0.5)',
//       text: 'text-green-400'
//     };
//     if (pct > 30) return { 
//       bg: 'bg-yellow-500', 
//       border: 'border-yellow-500', 
//       shadow: 'rgba(234, 179, 8, 0.5)',
//       text: 'text-yellow-400'
//     };
//     return { 
//       bg: 'bg-red-600', 
//       border: 'border-red-500', 
//       shadow: 'rgba(239, 68, 68, 0.5)',
//       text: 'text-red-400'
//     };
//   };

//   const status = getStatusStyles(hpPercentage);

//   return (
//     <motion.div 
//       className="display stat-layout fixed top-4 left-4 bg-gray-900 bg-opacity-95 backdrop-blur-md text-white p-4 shadow-2xl border-2 border-gray-700 z-50"
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.5 }}
//       style={{ minWidth: "250px", left: 10, top: 10, zIndex: 4 }}
//     >
//       {/* Character Info Header */}
//       <div 
//         className="mb-4 cursor-pointer group"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center gap-2 mb-1">
//           <User size={18} className="text-blue-400" />
//           <h3 className="font-bold text-lg tracking-wide group-hover:text-blue-300 transition-colors">
//             {characterName}
//           </h3>
//         </div>
        
//         <div className="space-y-0.5">
//           <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-2">
//             <Key size={10} />
//             ID: {breakerIdFormatted}
//           </div>
//           <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
//             <Shield size={10} />
//             {className} <span className="text-gray-600">|</span> LVL {stats.Level}
//           </div>
//           <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
//             <Badge size={10} />
//               Breaker Class <span className="text-gray-600">|</span> {breakerClass}
//           </div>

//         </div>
//       </div>

//       {/* HP Bar Section */}
//       <div className="mb-4">
//         <div className="flex items-center justify-between mb-1.5">
//           <div className="flex items-center gap-1.5">
//             <Heart size={14} className="text-red-400" />
//             <span className="text-xs font-bold text-gray-300 tracking-wider py-1">LP</span>
//           </div>
//           <span className={`text-xs  font-bold `}>
//             {currentHP} <span className="text-gray-500">/</span> {maxHP}
//           </span>
//         </div>
        
//         {/* Progress Bar Container */}
//         {/* We apply the dynamic border color here to the outer container */}
//         <div className={`w-full bg-gray-800 rounded-full h-4 border ${status.border} overflow-hidden transition-colors duration-300 relative`}>
          
//           {/* Animated Inner Bar */}
//           <motion.div
//             initial={{ width: 0 }}
//             animate={{ width: `${hpPercentage}%` }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//             className={`h-full ${status.bg} relative`}
//             style={{ 
//               boxShadow: `0 0 10px ${status.shadow}` 
//             }}
//           >
//             {/* Optional: Add a slight shine effect */}
//             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent" />
//           </motion.div>
//         </div>
//       </div>

//       {/* BP (XP) Bar Section */}
//       <div className="mb-2">
//         <div className="flex items-center justify-between mb-1.5">
//           <div className="flex items-center gap-1.5">
//             <Zap size={14} className="text-yellow-400" />
//             <span className="text-xs font-bold text-gray-300 tracking-wider py-1">BP</span>
//           </div>
//           <span className="text-xs text-gray-400">{stats.BP}</span>
//         </div>
//         <div className="w-full bg-gray-800 rounded-full h-1.5 border border-gray-700 overflow-hidden">
//           <motion.div
//             initial={{ width: 0 }}
//             animate={{ width: `${stats.BP % 100}%` }}
//             transition={{ duration: 0.6 }}
//             className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
//             style={{ boxShadow: '0 0 8px rgba(147, 51, 234, 0.3)' }}
//           />
//         </div>
//       </div>

//       {/* Expanded Stats Drawer */}
//       <AnimatePresence>
//         {isExpanded && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="overflow-hidden"
//           >
//             <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-700/50">
//               {[
//                 { label: 'FEL', val: stats.Fellowship, full: 'Fellowship' },
//                 { label: 'ATH', val: stats.Athletics, full: 'Athletics' },
//                 { label: 'THO', val: stats.Thought, full: 'Thought' },
//                 { label: 'ESS', val: stats.Essence, full: 'Essence' }
//               ].map((stat) => (
//                 <div key={stat.label} className="bg-gray-800/50 p-2  border border-gray-700 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
//                   <div>
//                     <div className="text-[10px] text-gray-500 font-bold">{stat.label}</div>
//                     <div className="text-xs text-blue-400">
//                       {Math.floor((stat.val - 10) / 2) >= 0 ? '+' : ''}
//                       {Math.floor((stat.val - 10) / 2)}
//                     </div>
//                   </div>
//                   <div className="text-lg font-bold text-gray-200">{stat.val}</div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Toggle Button */}
//       <div 
//         className="flex justify-center mt-2 pt-1 cursor-pointer hover:bg-white/5 rounded transition-colors py-1"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
//           {isExpanded ? 'Collapse Stats' : 'View Stats'}
//         </span>
//       </div>
//     </motion.div>
//   );
// }