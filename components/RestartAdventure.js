"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Home, AlertTriangle } from "lucide-react";

export default function RestartAdventure({ userId, userName }) {
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleRestartAdventure = async () => {
    if (!userId) return;
    
    setIsResetting(true);
    
    try {
      const userRef = doc(db, "users", userId);
      
      // Get current breaker ID to preserve it
      const userDoc = await getDoc(userRef);
      const currentBreakerId = userDoc.data()?.breakerId;
      const currentBreakerIdFormatted = userDoc.data()?.breakerIdFormatted;
      const currentEmail = userDoc.data()?.email;
      const currentCreatedAt = userDoc.data()?.createdAt;
      
      // Reset everything to initial state
      await updateDoc(userRef, {
        // Preserve account info
        email: currentEmail,
        breakerId: currentBreakerId,
        breakerIdFormatted: currentBreakerIdFormatted,
        createdAt: currentCreatedAt,
        
        // Reset progress
        currentPage: "page_1",
        characterName: "",
        
        // Reset stats to initial values
        stats: {
          Fellowship: 10,
          Athletics: 10,
          Thought: 10,
          Essence: 10,
          HP: 20,
          MaxHP: 20,
          BP: 0,
          Level: 1,
        },
        
        // Clear all progress data
        route: "",
        className: "",
        breakerClass: "",
        metNPCs: [],
        deadNPCs: [],
        failedCombats: [],
        failedRolls: [],
        deaths: 0,
        revivals: 0,
        deathLocations: [],
        toldTeamAbout: [],
        wentAlone: false,
        niceToAkemi: false,
        akemiInterested: false,
        gaveToCale: false,
        tookEnvironmentPotion: false,
        tookHospitalNote: false,
        removedCamperMinions: false,
        hasFailed: false,
        hasSacrificed: false,
        
        // Clear inventory
        unlockedDataPackets: [],
        unlockedEquipment: [],
        
        // Clear environmental actions
        usedEnvironmentalActions: [],
        
        // Clear visited pages
        visitedPages: [],
        
        // Clear any other progress tracking
        interestedGuilds: [],
        currentGuild: null,
        
        // Add reset timestamp
        lastReset: new Date(),
      });
      
      // Redirect to beginning
      router.push('/adventure/page_1');
      
    } catch (error) {
      console.error("Error resetting journey:", error);
      alert("Failed to reset journey. Please try again or contact support.");
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <motion.button
        // <button
            // variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}

          onClick={() => setShowConfirmation(true)}
          className="continue-btn w-full px-6 py-3 font-semibold text-lg transition-all max-w-xs bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
        //   className="flex items-center gap-3 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 font-bold text-lg shadow-2xl border-b-4 border-green-900 active:border-b-0 active:scale-95 transition-all display cinzel-text"
        >
          {/* <RotateCcw size={24} /> */}
          <span>Restart Adventure</span>
        {/* </button> */}
        </motion.button>

        
        {/* <p className="text-gray-400 text-sm text-center max-w-md">
          Start a new adventure from the beginning. Your account will be preserved, but all progress will be reset.
        </p> */}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            style={{marginTop:"0rem"}}
            onClick={() => !isResetting && setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border-2 border-red-600 shadow-2xl p-6 md:p-8 max-w-lg w-full"
            >
              <div className="flex items-center gap-3 mb-4 text-red-400">
                {/* <AlertTriangle size={32} /> */}
                <h2 className="text-2xl font-bold text-white presto-text">Confirm Restart</h2>
              </div>
              
              <div className="mb-6 space-y-3">
                <p className="text-gray-300 presto-text">
                  Are you absolutely sure you want to restart your adventure?
                </p>
                
                <div className="bg-red-900/30 border border-red-700 p-4 space-y-2">
                  <p className="text-red-200 font-semibold text-sm">This will permanently delete:</p>
                  <ul className="text-red-300 text-sm space-y-1 ml-4 list-none">
                    <li>Character name and class</li>
                    <li>All stats and levels</li>
                    <li>Story progress and choices</li>
                    <li>Data packets and equipment</li>
                    <li>All achievements and milestones</li>
                  </ul>
                </div>
                
                <p className="text-gray-400 text-sm">
                  Your account and email will remain intact. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRestartAdventure}
                  disabled={isResetting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 cinzel-text"
                >
                  {isResetting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Restarting...</span>
                    </>
                  ) : (
                    <>
                      {/* <RotateCcw size={20} /> */}
                      <span>Restart</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isResetting}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-6 py-3 font-semibold transition-colors cinzel-text"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}