"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Zap, Award, ChevronUp } from "lucide-react";

export function BPNotification({ result, onClose }) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      className="fixed top-20 inset-x-0 z-50 max-w-md mx-auto px-4"
      // className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
    >
      <div className="display w-full bg-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-black/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-400" size={24} />
            <h3 className="text-lg font-bold text-white presto-text">Breaker Points Earned!</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* BP Awarded */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-center"
          >
            <div className="text-5xl font-bold text-yellow-400 mb-2 presto-text">
              +{result.bpAwarded}
            </div>
            <div className="text-sm text-gray-300 presto-text">Breaker Points</div>
            {result.source && (
              <div className="text-xs text-gray-400 mt-1 presto-text">
                from {result.source}
              </div>
            )}
          </motion.div>

          {/* Level Up */}
          {result.leveledUp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-lg border-2 border-yellow-400"
            >
              <div className="flex items-center gap-3 mb-2">
                <Award className="text-yellow-200" size={32} />
                <div>
                  <div className="text-xl font-bold text-white presto-text">
                    Level Up! {result.levelsGained > 1 && `x${result.levelsGained}`}
                  </div>
                  <div className="text-sm text-yellow-100 presto-text">
                    Now Level {result.currentLevel}
                  </div>
                </div>
              </div>
              
              {result.statIncrease && (
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-yellow-100 presto-text">
                    <span>Max HP:</span>
                    <span className="font-bold">
                      +{result.statIncrease.MaxHP - (result.statIncrease.MaxHP - (result.levelsGained * 5))}
                    </span>
                  </div>
                  <div className="flex justify-between text-yellow-100 presto-text">
                    <span>Stat Points:</span>
                    <span className="font-bold">
                      +{result.levelsGained * 2}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Progress to Next Level */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm text-gray-300">
              <span>Level {result.currentLevel}</span>
              <span>{result.bpToNextLevel} BP to next level</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((result.newBP % result.bpToNextLevel) / result.bpToNextLevel) * 100}%` }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </motion.div> */}
        </div>
      </div>
    </motion.div>
  );
}

export function BPProgressBar({ userId, className = "" }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      if (userId) {
        const prog = await getBPProgress(userId);
        setProgress(prog);
      }
    };
    loadProgress();
  }, [userId]);

  if (!progress) return null;

  return (
    <div className={`bg-gray-800/50 p-3 border border-gray-700 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {/* <div className="flex items-center gap-2">
          <ChevronUp className="text-blue-400" size={16} />
          <span className="text-sm font-bold text-white">
            Level {progress.currentLevel}
          </span>
        </div> */}
        <span className="text-xs text-gray-400 cinzel-text">
          {progress.currentBP} BP
        </span>
      </div>
      
      {/* <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progress.progressPercent}%` }}
        />
      </div>
      
      <div className="text-xs text-gray-400 mt-1 text-right">
        {progress.xpNeededForNext} BP to Level {progress.currentLevel + 1}
      </div> */}
    </div>
  );
}










// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { TrendingUp, Zap, Award, ChevronUp } from "lucide-react";

// export function BPNotification({ result, onClose }) {
//   if (!result) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.8, y: -50 }}
//       animate={{ opacity: 1, scale: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.8, y: -50 }}
//       className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
//     >
//       <div className="display w-full bg-gray-700 shadow-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-black/30 p-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Zap className="text-yellow-400" size={24} />
//             <h3 className="text-lg font-bold text-white presto-text">Breaker Points Earned!</h3>
//           </div>
//           <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition-colors"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-4">
//           {/* BP Awarded */}
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.2, type: "spring" }}
//             className="text-center"
//           >
//             <div className="text-5xl font-bold text-yellow-400 mb-2 presto-text">
//               +{result.bpAwarded}
//             </div>
//             <div className="text-sm text-gray-300 presto-text">Breaker Points</div>
//             {result.source && (
//               <div className="text-xs text-gray-400 mt-1 presto-text">
//                 from {result.source}
//               </div>
//             )}
//           </motion.div>

//           {/* Level Up */}
//           {result.leveledUp && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 rounded-lg border-2 border-yellow-400"
//             >
//               <div className="flex items-center gap-3 mb-2">
//                 <Award className="text-yellow-200" size={32} />
//                 <div>
//                   <div className="text-xl font-bold text-white presto-text">
//                     Level Up! {result.levelsGained > 1 && `x${result.levelsGained}`}
//                   </div>
//                   <div className="text-sm text-yellow-100 presto-text">
//                     Now Level {result.currentLevel}
//                   </div>
//                 </div>
//               </div>
              
//               {result.statIncrease && (
//                 <div className="mt-3 space-y-1 text-sm">
//                   <div className="flex justify-between text-yellow-100 presto-text">
//                     <span>Max HP:</span>
//                     <span className="font-bold">
//                       +{result.statIncrease.MaxHP - (result.statIncrease.MaxHP - (result.levelsGained * 5))}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-yellow-100 presto-text">
//                     <span>Stat Points:</span>
//                     <span className="font-bold">
//                       +{result.levelsGained * 2}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           )}

//           {/* Progress to Next Level */}
//           {/* <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//             className="space-y-2"
//           >
//             <div className="flex justify-between text-sm text-gray-300">
//               <span>Level {result.currentLevel}</span>
//               <span>{result.bpToNextLevel} BP to next level</span>
//             </div>
//             <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${((result.newBP % result.bpToNextLevel) / result.bpToNextLevel) * 100}%` }}
//                 transition={{ delay: 0.8, duration: 0.5 }}
//                 className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
//               />
//             </div>
//           </motion.div> */}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export function BPProgressBar({ userId, className = "" }) {
//   const [progress, setProgress] = useState(null);

//   useEffect(() => {
//     const loadProgress = async () => {
//       if (userId) {
//         const prog = await getBPProgress(userId);
//         setProgress(prog);
//       }
//     };
//     loadProgress();
//   }, [userId]);

//   if (!progress) return null;

//   return (
//     <div className={`bg-gray-800/50 p-3 border border-gray-700 ${className}`}>
//       <div className="flex justify-between items-center mb-2">
//         {/* <div className="flex items-center gap-2">
//           <ChevronUp className="text-blue-400" size={16} />
//           <span className="text-sm font-bold text-white">
//             Level {progress.currentLevel}
//           </span>
//         </div> */}
//         <span className="text-xs text-gray-400 cinzel-text">
//           {progress.currentBP} BP
//         </span>
//       </div>
      
//       {/* <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
//         <div
//           className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
//           style={{ width: `${progress.progressPercent}%` }}
//         />
//       </div>
      
//       <div className="text-xs text-gray-400 mt-1 text-right">
//         {progress.xpNeededForNext} BP to Level {progress.currentLevel + 1}
//       </div> */}
//     </div>
//   );
// }