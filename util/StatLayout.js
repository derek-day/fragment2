"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
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
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setStats(data.stats);
          setCharacterName(data.characterName || "Unknown");
          setClassName(data.className || "Unknown");
          setBreakerIdFormatted(data.breakerIdFormatted || "000-000-000");
          setBreakerClass(data.breakerClass || "Unknown");
        }
      }
    };

    fetchStats();
    
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchStats();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  // Safe Stats Calculation
  const maxHP = stats.MaxHP || 20; 
  const currentHP = stats.HP !== undefined ? stats.HP : 20;
  // Clamp percentage between 0 and 100
  const hpPercentage = Math.min(100, Math.max(0, (currentHP / maxHP) * 100));

  // Dynamic Colors Helper
  const getStatusStyles = (pct) => {
    if (pct > 60) return { 
      bg: 'bg-green-600', 
      border: 'border-green-500', 
      shadow: 'rgba(34, 197, 94, 0.5)',
      text: 'text-green-400'
    };
    if (pct > 30) return { 
      bg: 'bg-yellow-500', 
      border: 'border-yellow-500', 
      shadow: 'rgba(234, 179, 8, 0.5)',
      text: 'text-yellow-400'
    };
    return { 
      bg: 'bg-red-600', 
      border: 'border-red-500', 
      shadow: 'rgba(239, 68, 68, 0.5)',
      text: 'text-red-400'
    };
  };

  const status = getStatusStyles(hpPercentage);

  return (
    <motion.div 
      className="display stat-layout fixed top-4 left-4 bg-gray-900 bg-opacity-95 backdrop-blur-md text-white p-4 shadow-2xl border-2 border-gray-700 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{ minWidth: "250px", left: 10, top: 10, zIndex: 4 }}
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
            {className} <span className="text-gray-600">|</span> LVL {stats.Level}
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
          <span className={`text-xs  font-bold `}>
            {currentHP} <span className="text-gray-500">/</span> {maxHP}
          </span>
        </div>
        
        {/* Progress Bar Container */}
        {/* We apply the dynamic border color here to the outer container */}
        <div className={`w-full bg-gray-800 rounded-full h-4 border ${status.border} overflow-hidden transition-colors duration-300 relative`}>
          
          {/* Animated Inner Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${hpPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`h-full ${status.bg} relative`}
            style={{ 
              boxShadow: `0 0 10px ${status.shadow}` 
            }}
          >
            {/* Optional: Add a slight shine effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* BP (XP) Bar Section */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-xs font-bold text-gray-300 tracking-wider py-1">BP</span>
          </div>
          <span className="text-xs text-gray-400">{stats.BP}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 border border-gray-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.BP % 100}%` }}
            transition={{ duration: 0.6 }}
            className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
            style={{ boxShadow: '0 0 8px rgba(147, 51, 234, 0.3)' }}
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
                { label: 'FEL', val: stats.Fellowship, full: 'Fellowship' },
                { label: 'ATH', val: stats.Athletics, full: 'Athletics' },
                { label: 'THO', val: stats.Thought, full: 'Thought' },
                { label: 'ESS', val: stats.Essence, full: 'Essence' }
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-800/50 p-2  border border-gray-700 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold">{stat.label}</div>
                    <div className="text-xs text-blue-400">
                      {Math.floor((stat.val - 10) / 2) >= 0 ? '+' : ''}
                      {Math.floor((stat.val - 10) / 2)}
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
    
//     // Refresh stats every 5 seconds when page is visible
//     const interval = setInterval(() => {
//       if (document.visibilityState === 'visible') {
//         fetchStats();
//       }
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   if (!stats) return null;

//   const containerVariants = {
//     hidden: { 
//       opacity: 0, 
//       y: -20,
//       scale: 0.9
//     },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       scale: 1,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut"
//       }
//     }
//   };

//   const statBarVariants = {
//     hidden: { width: 0 },
//     visible: (custom) => ({
//       width: `${custom}%`,
//       transition: {
//         duration: 0.8,
//         delay: 0.2,
//         ease: "easeOut"
//       }
//     })
//   };

//   const hpPercentage = (stats.HP / stats.MaxHP) * 100;

//   return (
//     <motion.div 
//       className="display stat-layout fixed top-4 left-4 bg-gray-900 bg-opacity-90 backdrop-blur-sm text-white p-4 shadow-2xl border-2 border-gray-700 z-40"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       whileHover={{ scale: 1.02 }}
//       style={{ minWidth: "250px", left: 10, top: 10, zIndex: 4 }}
//     >
//       {/* Character Info */}
//       <motion.div 
//         className="mb-3 cursor-pointer"
//         onClick={() => setIsExpanded(!isExpanded)}
//         whileHover={{ x: 2 }}
//       >
//         <div className="flex items-center gap-2 mb-1">
//           <User size={16} className="text-blue-400" />
//           <h3 className="font-bold text-lg">{characterName}</h3>
//         </div>
//         <div className="text-xs text-gray-400 flex items-center gap-2">
//           <Key size={12} />
//           Breaker ID • {breakerIdFormatted}
//         </div>
//         <div className="text-xs text-gray-400 flex items-center gap-2">
//           <Shield size={12} />
//           {className} • Level {stats.Level}
//         </div>
//         <div className="text-xs text-gray-400 flex items-center gap-2">
//           <Badge size={12} />
//           Breaker Class • {breakerClass}
//         </div>
//       </motion.div>

//       {/* HP Bar */}
//       <motion.div 
//         className="mb-3"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3 }}
//       >
//         <div className="flex items-center justify-between mb-1">
//           <div className="flex items-center gap-1">
//             <Heart size={14} className="text-red-400" />
//             <span className="text-xs font-semibold">LP</span>
//           </div>
//           <span className="text-xs font-bold">
//             {stats.HP}/{stats.MaxHP}
//           </span>
//         </div>
//         <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-600 overflow-hidden">
//           <motion.div
//             custom={hpPercentage}
//             variants={statBarVariants}
//             initial="hidden"
//             animate="visible"
//             className={`h-full flex items-center justify-center text-xs font-bold ${
//               hpPercentage > 60 ? 'bg-green-500' :
//               hpPercentage > 30 ? 'bg-yellow-500' :
//               'bg-red-500'
//             }`}
//             style={{ 
//               boxShadow: hpPercentage > 0 ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none'
//             }}
//           />
//         </div>
//       </motion.div>

//       {/* XP Bar */}
//       <motion.div 
//         className="mb-2"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4 }}
//       >
//         <div className="flex items-center justify-between mb-1">
//           <div className="flex items-center gap-1">
//             <Zap size={14} className="text-yellow-400" />
//             <span className="text-xs font-semibold">BP</span>
//           </div>
//           <span className="text-xs">{stats.BP}</span>
//         </div>
//         <div className="w-full bg-gray-700 rounded-full h-2 border border-gray-600 overflow-hidden">
//           <motion.div
//             custom={(stats.BP % 100)}
//             variants={statBarVariants}
//             initial="hidden"
//             animate="visible"
//             className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
//             style={{ 
//               boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)'
//             }}
//           />
//         </div>
//       </motion.div>

//       {/* Expanded Stats */}
//       <AnimatePresence>
//         {isExpanded && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="overflow-hidden"
//           >
//             <motion.div 
//               className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-700"
//               initial="hidden"
//               animate="visible"
//               variants={{
//                 visible: {
//                   transition: {
//                     staggerChildren: 0.05
//                   }
//                 }
//               }}
//             >
//               {Object.entries({
//                 FEL: stats.Fellowship,
//                 ATH: stats.Athletics,
//                 THO: stats.Thought,
//                 ESS: stats.Essence
//               }).map(([stat, value], index) => (
//                 <motion.div
//                   key={stat}
//                   variants={{
//                     hidden: { opacity: 0, x: -10 },
//                     visible: { opacity: 1, x: 0 }
//                   }}
//                   className="bg-gray-900 p-2 text-center border border-gray-800 hover:border-gray-700 transition-colors"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   <div className="text-xs text-gray-400">{stat}</div>
//                   <div className="text-lg font-bold text-blue-400">{value}</div>
//                   <div className="text-xs text-gray-500">
//                     {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)}
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Expand/Collapse Indicator */}
//       <motion.div 
//         className="text-center mt-2 text-xs text-gray-500 cursor-pointer hover:text-gray-400"
//         onClick={() => setIsExpanded(!isExpanded)}
//         whileHover={{ scale: 1.1 }}
//       >
//         {isExpanded ? '▲ Less' : '▼ More'}
//       </motion.div>
//     </motion.div>
//   );
// }