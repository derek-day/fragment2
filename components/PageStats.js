"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Added Info icon
import { Plus, Minus, Sparkles, Swords, Wand2, Users, Smile, Info } from "lucide-react";

// 1. Data map for stat descriptions
const STAT_DESCRIPTIONS = {
  Fellowship: "Influences charisma, trading prices, and your ability to persuade NPCs.",
  Athletics: "Determines physical health, carrying capacity, and melee damage.",
  Thought: "Governs intelligence, puzzle-solving, and efficiency of summoned units.",
  Essence: "Affects spell potency, and resistance to magical effects.",
};

export default function PageStats({ onStatsChange }) {
  const [stats, setStats] = useState({
    Fellowship: 10,
    Athletics: 10,
    Thought: 10,
    Essence: 10,
  });
  
  // Track which stat's info is being displayed
  const [activeInfo, setActiveInfo] = useState(null);
  
  const MAX_POINTS = 6;
  const BASE_STAT_SUM = 40; 
  const [pointsRemaining, setPointsRemaining] = useState(MAX_POINTS);

  const handleStatChange = (stat, delta) => {
    if (pointsRemaining - delta < 0) return;
    if (stats[stat] + delta < 1) return;

    const newStats = { ...stats, [stat]: stats[stat] + delta };
    setStats(newStats);

    const currentSum = Object.values(newStats).reduce((a, b) => a + b, 0);
    setPointsRemaining(MAX_POINTS - (currentSum - BASE_STAT_SUM));
  };

  const getClassPrediction = () => {
    const { Fellowship, Athletics, Thought, Essence } = stats;
    if (Essence >= 14) return { name: "Mage", icon: Wand2, color: "text-purple-400" };
    if (Athletics >= 14) return { name: "Warrior", icon: Swords, color: "text-orange-400" };
    if (Thought >= 14) return { name: "Summoner", icon: Users, color: "text-blue-400" };
    if (Fellowship >= 14) return { name: "Undecided / Mixed", icon: Smile, color: "text-green-400", description: "Lowers cost of items" };
    return { name: "Undecided / Mixed", icon: Sparkles, color: "text-gray-400" };
  };

  useEffect(() => {
    onStatsChange(stats, pointsRemaining);
  }, [stats, pointsRemaining, onStatsChange]);

  const classInfo = getClassPrediction();
  const ClassIcon = classInfo.icon;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  const getModifier = (value) => Math.floor((value - 10) / 2);

  return (
    <motion.div 
      // className="p-6 stat-box box bg-gray-800 bg-opacity-90 backdrop-blur-sm border-2 border-gray-700 shadow-xl"
      className="display p-6 stat-box bg-gray-800 bg-opacity-90 backdrop-blur-sm border-2 border-gray-700 shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style= {{ width: '100%' }}
    >
      <motion.div variants={itemVariants} className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">Assign Your Stats</h2>
        <div className="inline-block bg-blue-900 bg-opacity-50 px-6 py-2 border-2 border-blue-800">
          <span className="text-lg font-bold text-blue-400">
            Points Available: {pointsRemaining}
          </span>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 stat-page">
        {Object.entries(stats).map(([stat, value]) => {
          const modifier = getModifier(value);
          const isShowingInfo = activeInfo === stat;

          return (
            <motion.div
              key={stat}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="stat-container bg-gray-900 bg-opacity-80 backdrop-blur-sm px-4 py-3 border-2 border-gray-700 hover:border-gray-600 transition-all stat-div"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="font-bold text-white text-lg">{stat}
                      <button 
                        onClick={() => setActiveInfo(isShowingInfo ? null : stat)}
                        className={`ml-1 rounded-full transition-colors ${isShowingInfo ? 'text-blue-400 bg-blue-900/30' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Info size={16} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400">
                      Modifier: {modifier >= 0 ? '+' : ''}{modifier}
                    </div>
                    {/* <div>
                      <button 
                        onClick={() => setActiveInfo(isShowingInfo ? null : stat)}
                        className={`mt-2 rounded-full transition-colors ${isShowingInfo ? 'text-blue-400 bg-blue-900/30' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Info size={18} />
                      </button>
                    </div> */}
                    {/* <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        Modifier: {modifier >= 0 ? '+' : ''}{modifier}
                      </span>
                      <button 
                        onClick={() => setActiveInfo(isShowingInfo ? null : stat)}
                        className={`p-1 rounded-full transition-colors ${isShowingInfo ? 'text-blue-400 bg-blue-900/30' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Info size={14} />
                      </button>
                    </div> */}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleStatChange(stat, -1)}
                      className="bg-red-600/80 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-600 p-2 rounded transition-colors"
                      disabled={value <= 10}
                    >
                      <Minus size={16} />
                    </motion.button>
                    
                    <motion.div 
                      className="w-12 text-center text-xl font-bold text-white bg-gray-800 rounded px-3 py-1 border border-gray-700"
                      key={value}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {value}
                    </motion.div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleStatChange(stat, +1)}
                      className="bg-green-600/80 hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-600 p-2 rounded transition-colors"
                      disabled={pointsRemaining <= 0}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                </div>

                {/* Animated Description Text */}
                <AnimatePresence>
                  {isShowingInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-blue-200/70 bg-blue-950/30 p-2 border-l-2 border-blue-500 mt-1">
                        {STAT_DESCRIPTIONS[stat]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Class Prediction Section */}
      <motion.div 
        variants={itemVariants}
        className="stat-box p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-700"
      >
        <div className="flex items-center justify-center gap-3">
          <ClassIcon className={`w-6 h-6 ${classInfo.color}`} />
          <div>
            {/* <div className="text-sm text-gray-400 uppercase tracking-wider text-xs">Predicted Class</div> */}
            <div className="text-sm text-gray-400">Predicted Class</div>
            <div className={`text-xl font-bold ${classInfo.color}`}>
              {classInfo.name}
            </div>
            {classInfo.description && (
              <div className={`text-sm ${classInfo.color}`}>
                {classInfo.description}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      {/* <motion.div variants={itemVariants} className="mt-4">
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((MAX_POINTS - pointsRemaining) / MAX_POINTS) * 100}%` }}
          />
        </div>
        <div className="text-xs text-center text-gray-500 mt-2 font-medium uppercase tracking-tighter">
          {MAX_POINTS - pointsRemaining} / {MAX_POINTS} Attribute Points Allocated
        </div>
      </motion.div> */}

      <motion.div 
         variants={itemVariants}
         className="mt-4"
       >
         <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
           <motion.div
             className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
             initial={{ width: "0%" }}
             animate={{ width: `${((MAX_POINTS - pointsRemaining) / MAX_POINTS) * 100}%` }}
             transition={{ duration: 0.5 }}
           />
         </div>
         <div className="text-xs text-center text-gray-400 mt-2">
           {MAX_POINTS - pointsRemaining} / {MAX_POINTS} points allocated
         </div>
       </motion.div>

    </motion.div>
  );
}