"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Sparkles, Swords, Wand2, Users } from "lucide-react";

export default function PageStats({ onStatsChange }) {
  const [stats, setStats] = useState({
    Strength: 10,
    Dexterity: 10,
    Constitution: 10,
    Intelligence: 10,
    Wisdom: 10,
    Charisma: 10,
  });
  const [pointsRemaining, setPointsRemaining] = useState(10);

  const handleStatChange = (stat, delta) => {
    if (pointsRemaining - delta < 0) return;
    if (stats[stat] + delta < 1) return;

    const newStats = {
      ...stats,
      [stat]: stats[stat] + delta,
    };
    setStats(newStats);
    setPointsRemaining(10 - (Object.values(newStats).reduce((a, b) => a + b, 0) - 60));
  };

  const getClassPrediction = () => {
    const { Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma } = stats;
    if (Intelligence >= 14) return { name: "Mage", icon: Wand2, color: "text-purple-400" };
    if (Strength >= 14 || Constitution >= 14) return { name: "Warrior", icon: Swords, color: "text-orange-400" };
    if (Charisma >= 14 || Wisdom >= 14) return { name: "Summoner", icon: Users, color: "text-blue-400" };
    return { name: "Undecided / Mixed", icon: Sparkles, color: "text-gray-400" };
  };

  useEffect(() => {
    onStatsChange(stats, pointsRemaining);
  }, [stats, pointsRemaining, onStatsChange]);

  const classInfo = getClassPrediction();
  const ClassIcon = classInfo.icon;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const statIcons = {
    Strength: "💪",
    Dexterity: "🎯",
    Constitution: "❤️",
    Intelligence: "🧠",
    Wisdom: "🦉",
    Charisma: "✨"
  };

  const getModifier = (value) => Math.floor((value - 10) / 2);

  return (
    <motion.div 
      className="p-6 stat-box box bg-gray-800 bg-opacity-90 backdrop-blur-sm border-2 border-gray-700 shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style= {{ width: '100%' }}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">Allocate Your Stats</h2>
        <div className="inline-block bg-blue-900 bg-opacity-50 px-6 py-2 border-2 border-blue-600">
          <span className="text-lg font-bold text-blue-400">
            Points Remaining: {pointsRemaining}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 stat-page">
        {Object.entries(stats).map(([stat, value]) => {
          const modifier = getModifier(value);
          return (
            <motion.div
              key={stat}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              className="stat-container bg-gray-900 bg-opacity-80 backdrop-blur-sm px-4 py-3 border-2 border-gray-700 hover:border-gray-600 transition-all stat-div"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* <span className="text-2xl">{statIcons[stat]}</span> */}
                  <div>
                    <div className="font-bold text-white">{stat}</div>
                    <div className="text-xs text-gray-400">
                      Modifier: {modifier >= 0 ? '+' : ''}{modifier}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStatChange(stat, -1)}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed p-2 rounded transition-colors"
                    disabled={value <= 1}
                  >
                    <Minus size={16} />
                  </motion.button>
                  
                  <motion.div 
                    className="w-12 text-center text-xl font-bold text-white bg-gray-800 rounded px-3 py-1"
                    key={value}
                    initial={{ scale: 1.2, color: "#60a5fa" }}
                    animate={{ scale: 1, color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                  >
                    {value}
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStatChange(stat, +1)}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed p-2 rounded transition-colors"
                    disabled={pointsRemaining <= 0}
                  >
                    <Plus size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Class Prediction */}
      <motion.div 
        variants={itemVariants}
        className="stat-box p-4 bg-gradient-to-r from-gray-800 to-gray-900  border-2 border-gray-700"
      >
        <div className="flex items-center justify-center gap-3">
          <ClassIcon className={`w-6 h-6 ${classInfo.color}`} />
          <div>
            <div className="text-sm text-gray-400">Predicted Class</div>
            <div className={`text-xl font-bold ${classInfo.color}`}>
              {classInfo.name}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div 
        variants={itemVariants}
        className="mt-4"
      >
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((10 - pointsRemaining) / 10) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-xs text-center text-gray-400 mt-1">
          {10 - pointsRemaining} / 10 points allocated
        </div>
      </motion.div>
    </motion.div>
  );
}










// "use client";
// import { useState, useEffect } from "react";

// export default function PageStats({ onStatsChange }) {
//   const [stats, setStats] = useState({
//     Strength: 10,
//     Dexterity: 10,
//     Constitution: 10,
//     Intelligence: 10,
//     Wisdom: 10,
//     Charisma: 10,
//   });
//   const [allocatedStats, setAllocatedStats] = useState(null);
//   const [pointsRemaining, setPointsRemaining] = useState(10);

//   const handleStatChange = (stat, delta) => {
//     if (pointsRemaining - delta < 0) return;
//     if (stats[stat] + delta < 1) return;

//     const newStats = {
//       ...stats,
//       [stat]: stats[stat] + delta,
//     };
//     setStats(newStats);
//     setPointsRemaining(10 - (Object.values(newStats).reduce((a, b) => a + b, 0) - 60));
//   };

//   const getClassPrediction = () => {
//     const { Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma } = stats;
//     if (Intelligence >= 14) return "Mage";
//     if (Strength >= 14 || Constitution >= 14) return "Warrior";
//     if (Charisma >= 14 || Wisdom >= 14) return "Summoner";
//     return "Undecided / Mixed";
//   };

//   useEffect(() => {
//     // notify parent ([pageId]/page.js) whenever stats/points change
//     onStatsChange(stats, pointsRemaining);
//   }, [stats, pointsRemaining, onStatsChange]);

//   return (
//     <div className="p-4 stat-box box">
//       {/* <h2 className="text-xl font-bold mb-2 justify-self-center">Allocate Your Stats</h2> */}
//       <h2 className="text-lg mb-4 justify-self-center">Points Remaining: {pointsRemaining}</h2>

//       <div className="grid grid-cols-2 gap-3 stat-page">
//         {Object.entries(stats).map(([stat, value]) => (
//           <div key={stat} className="flex items-center justify-between bg-gray-900 px-3 py-2 stat-div">
//             <span>{stat}: {value}</span>
//             <div className="space-x-2">
//               <button
//                 onClick={() => handleStatChange(stat, -1)}
//                 className="bg-red-500 px-2 py-1"
//                 disabled={value <= 1}
//               >
//                 -
//               </button>
//               <button
//                 onClick={() => handleStatChange(stat, +1)}
//                 className="bg-green-500 px-2 py-1"
//                 disabled={pointsRemaining <= 0}
//               >
//                 +
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-6 stat-box p-2">
//          <p className="font-semibold justify-self-center">Class: {getClassPrediction()}</p>
//       </div>

//     </div>
//   );
// }
