"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { adventurePages } from "../pages";
import { motion, AnimatePresence } from "framer-motion";
import { 
  recordNPCMeeting,
  recordNPCDeath,
  recordToldTeam,
  recordCombatFailure,
  recordRollFailure,
  recordDeath,
  recordRevival,
  getAliveMinions
} from '../../../lib/progressService';
import { getConditionalNextPage } from "../../../lib/conditionService";
import StatLayout from "../../../util/StatLayout";
import MenuButton from "../../../util/MenuButton";
import PageStats from "../../../components/PageStats";
import NameInput from "../../../components/NameInput";
import BattlePage from "../../../components/BattlePage";
import RollPage from "../../../components/RollPage";
import DebugPanel from "../../../components/DebugPanel";

export default function PageClient({ page: initialPage, pageId }) {
  const router = useRouter();
  const page = adventurePages[pageId];
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [allocatedStats, setAllocatedStats] = useState(null);
  const [pointsRemaining, setPointsRemaining] = useState(10);
  const [userStats, setUserStats] = useState(null);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [isPageChanging, setIsPageChanging] = useState(false);

  const PARTICLE_COUNT = 40;

  const particles = useMemo(() => {
      return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const duration = Math.random() * 18 + 14;
        return {
          id: i,
          size: Math.random() * 2 + 1,
          left: Math.random() * 100,
          top: Math.random() * 100,
          duration,
          delay: Math.random() * -duration
        };
      });
  }, []);


  //NEED TO MIGRATE PAGES TO FIREBASE

  // Check if page exists
  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="mb-4">The page "{pageId}" does not exist.</p>
          <button
            onClick={() => router.push('/adventure/page_1')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded"
          >
            Return to Start
          </button>
        </div>
      </div>
    );
  }

  // Preload background image
  useEffect(() => {
    setBackgroundLoaded(false);
    if (page.src) {
      const img = new Image();
      img.src = page.src;
      img.onload = () => {
        setBackgroundLoaded(true);
      };
    } else {
      setBackgroundLoaded(true);
    }
  }, [page.src]);

  // Load user stats and handle page loading
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const userData = snap.data();
          setUserStats(userData.stats || {});
          setCharacterName(userData.characterName || "Unknown");
        }
        
        // Handle conditional branching
        await handlePageLoad(user.uid);
        
        // Auto-track NPC meetings with full info
        if (page.npcPresent) {
          await recordNPCMeeting(
            user.uid, 
            page.npcPresent, 
            page.npcDescription,
            pageId
          );
        }
      }
    });
    return () => unsub();
  }, [pageId]);

  // Handle conditional page loading
  const handlePageLoad = async (userId) => {
    if (page.conditionalNext) {
      const nextPage = await getConditionalNextPage(userId, page);
      if (nextPage && nextPage !== page.next) {
        console.log(`Conditional redirect: ${nextPage}`);
      }
    }
  };

  // Set page title
  useEffect(() => {
    if (page?.title) {
      document.title = page.title + " | The Gatebreaker Protocol";
    }
  }, [page]);

  async function handleContinue() {
    if (!user) return;
    const ref = doc(db, "users", user.uid);

    try {
      setIsPageChanging(true);
      
      // Determine next page
      let nextPageId = null;

      // Handle input type
      if (page.type === "input") {
        await setDoc(ref, { 
          [page.input.field]: inputValue,
          currentPage: page.input.next
        }, { merge: true });
        nextPageId = page.input.next;
      }
      // Handle route type
      else if (page.type === "route") {
        const updates = { 
          route: page.route,
          currentPage: page.next
        };
        
        if (page.route === "alone") {
          updates.characterName = "Yib";
          updates.wentAlone = true;
        }
        
        await updateDoc(ref, updates);
        nextPageId = page.next;
      }
      // Handle stats type
      else if (page.type === "stats") {
        // Get current user data to preserve HP, MaxHP, XP, Level
        const userSnap = await getDoc(ref);
        const currentData = userSnap.data();
        
        // Merge new stats with existing HP/MaxHP/XP/Level
        const updatedStats = {
          ...allocatedStats,
          HP: currentData?.stats?.HP || 20,
          MaxHP: currentData?.stats?.MaxHP || 20,
          XP: currentData?.stats?.XP || 0,
          Level: currentData?.stats?.Level || 1
        };
        
        // Determine class
        let className = "";
        if (allocatedStats.Intelligence >= 14) className = "Mage";
        else if (allocatedStats.Strength >= 14 || allocatedStats.Constitution >= 14) className = "Warrior";
        else if (allocatedStats.Charisma >= 14 || allocatedStats.Wisdom >= 14) className = "Summoner";
        else className = "Undecided / Mixed";

        await updateDoc(ref, { 
          stats: updatedStats,
          className,
          currentPage: page.next
        });
        nextPageId = page.next;
      }
      // Handle class redirect
      else if (page.type === "classRedirect") {
        const userSnap = await getDoc(ref);
        const userData = userSnap.data();
        const className = userData?.className || "Unknown";
        const route = userData?.route || "team";

        const classBranch = page.classNext[className];
        if (!classBranch) {
          nextPageId = page.next;
        } else {
          nextPageId = classBranch[route];
        }
        
        await updateDoc(ref, { currentPage: nextPageId });
      }
      // Handle choices
      else if (selectedChoice) {
        // Track choice actions
        if (selectedChoice.action === 'tell_team' && selectedChoice.npcName) {
          await recordToldTeam(user.uid, selectedChoice.npcName);
        }
        
        if (selectedChoice.action === 'meet_npc' && selectedChoice.npcName) {
          await recordNPCMeeting(
            user.uid, 
            selectedChoice.npcName, 
            selectedChoice.npcDescription,
            pageId
          );
        }
        
        nextPageId = selectedChoice.next;
        await updateDoc(ref, { currentPage: nextPageId });
        setSelectedChoice(null);
      } 
      // Handle regular next
      else if (page.next) {
        // Check for conditional branching
        nextPageId = await getConditionalNextPage(user.uid, page);
        await updateDoc(ref, { currentPage: nextPageId || page.next });
      }

      // Wait for animation before navigating
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate to next page
      if (nextPageId) {
        router.push(`/adventure/${nextPageId}`);
      }
    } catch (error) {
      console.error("Error in handleContinue:", error);
      alert("An error occurred. Please try again.");
      setIsPageChanging(false);
    }
  }

  // Parse text with italics and character name
  const renderText = () => {
    const text = (page.text || "").replace(/{{characterName}}/g, characterName || "Yib");
    
    return text.split("\n\n").map((para, idx) => {
      const parts = para.split(/(\*[^*]+\*)/g);
      
      return (
        <motion.p 
          key={idx} 
          className="text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
        >
          {parts.map((part, i) => {
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={i}>{part.slice(1, -1)}</em>;
            }
            return part;
          })}
        </motion.p>
      );
    });
  };

  // Handle choice selection - only allow if not already selected
  const handleChoiceClick = (choice) => {
    setSelectedChoice(selectedChoice?.next === choice.next ? null : choice);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageId}
        initial="hidden"
        animate={backgroundLoaded ? "visible" : "hidden"}
        exit="exit"
        variants={backgroundVariants}
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-6 story-hero"
        style={{ backgroundImage: page.src ? `url(${page.src})` : 'none' }}
      >

        <div className="screen-particles">
          {particles.map(p => (
            <span
              key={p.id}
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: `${p.left}%`,
                top: `${p.top}%`,
                filter: 'blur(0.8px) saturate(1.1) contrast(1.1)',
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
        </div>

        <StatLayout />
        <MenuButton />
        {/* <DebugPanel pageId={pageId} page={page} /> */}

        <motion.div 
          className="story-text p-2 mb-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-2 m-3">
            {renderText()}
          </div>
        </motion.div>

        <motion.div 
          className="space-y-4 w-full max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {page.type === "input" && (
            <motion.div variants={itemVariants}>
              <NameInput
                label={page.input.label}
                value={inputValue}
                onChange={setInputValue}
              />
            </motion.div>
          )}

          {page.type === "stats" && (
            <motion.div variants={itemVariants}>
              <PageStats
                onStatsChange={(stats, remaining) => {
                  setAllocatedStats(stats);
                  setPointsRemaining(remaining);
                }}
              />
            </motion.div>
          )}

          {page.type === "roll" && (
            <motion.div variants={itemVariants}>
              <RollPage 
                userStats={userStats} 
                page={page} 
                onSuccess={handleContinue}
              />
            </motion.div>
          )}

          {page.type === "battle" && (
            <motion.div variants={itemVariants}>
              <BattlePage 
                userStats={userStats} 
                page={page}
                userId={user?.uid}
              />
            </motion.div>
          )}

          {/* Choices */}
          {page.choices && page.choices.map((choice, i) => (
            <motion.button
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              className={`block choice-button w-full px-4 py-3 text-md transition-colors ${
                selectedChoice?.next === choice.next
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => handleChoiceClick(choice)}
            >
              <div className="">{choice.label}</div>
              {choice.description && (
                <div className="text-sm opacity-75 mt-1">{choice.description}</div>
              )}
            </motion.button>
          ))}

          {/* Continue Button */}
          {(page.type === "stats" || 
            page.type === "input" || 
            page.type === "classRedirect" ||
            page.type === "text" ||
            page.type === "route" ||
            page.choices) && 
            page.type !== "roll" && 
            page.type !== "battle" && (
            <motion.button
              variants={itemVariants}
              whileHover={{ 
                scale: (page.type === "stats" && pointsRemaining > 0) ||
                       (page.type === "input" && inputValue.trim() === "") ||
                       (page.choices && !selectedChoice) ? 1 : 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className={`continue-btn w-full px-6 py-3 font-bold text-lg transition-all ${
                (page.type === "stats" && pointsRemaining > 0) ||
                (page.type === "input" && inputValue.trim() === "") ||
                (page.choices && !selectedChoice)
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
              }`}
              onClick={handleContinue}
              disabled={
                isPageChanging ||
                (page.type === "stats" && pointsRemaining > 0) ||
                (page.type === "input" && inputValue.trim() === "") ||
                (page.choices && !selectedChoice)
              }
            >
              {isPageChanging ? "Loading..." : "Continue"}
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}











// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { auth, db } from "../../../lib/firebase";
// import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { adventurePages } from "../pages";
// import { 
//   recordNPCMeeting,
//   recordNPCDeath,
//   recordToldTeam,
//   recordCombatFailure,
//   recordRollFailure,
//   recordDeath,
//   recordRevival,
//   getAliveMinions
// } from '../../../lib/progressService';
// import { getConditionalNextPage } from "../../../lib/conditionService";
// import StatLayout from "../../../util/StatLayout";
// import MenuButton from "../../../util/MenuButton";
// import PageStats from "../../../components/PageStats";
// import NameInput from "../../../components/NameInput";
// import BattlePage from "../../../components/BattlePage";
// import RollPage from "../../../components/RollPage";
// import DebugPanel from "../../../components/DebugPanel";

// export default function PageClient({ page: initialPage, pageId }) {
//   const router = useRouter();
//   const page = adventurePages[pageId];
//   const [selectedChoice, setSelectedChoice] = useState(null);
//   const [user, setUser] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [characterName, setCharacterName] = useState("");
//   const [allocatedStats, setAllocatedStats] = useState(null);
//   const [pointsRemaining, setPointsRemaining] = useState(10);
//   const [userStats, setUserStats] = useState(null);

//   // Check if page exists
//   if (!page) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
//           <p className="mb-4">The page "{pageId}" does not exist.</p>
//           <button
//             onClick={() => router.push('/adventure/page_1')}
//             className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded"
//           >
//             Return to Start
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Load user stats and handle page loading
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setUser(user);
//         const ref = doc(db, "users", user.uid);
//         const snap = await getDoc(ref);
//         if (snap.exists()) {
//           const userData = snap.data();
//           setUserStats(userData.stats || {});
//           setCharacterName(userData.characterName || "Yib");
//         }
        
//         // Handle conditional branching
//         await handlePageLoad(user.uid);
        
//         // Auto-track NPC meetings with full info
//         if (page.npcPresent) {
//           await recordNPCMeeting(
//             user.uid, 
//             page.npcPresent, 
//             page.npcDescription,
//             pageId
//           );
//         }
//       }
//     });
//     return () => unsub();
//   }, [pageId]);

//   // Handle conditional page loading
//   const handlePageLoad = async (userId) => {
//     if (page.conditionalNext) {
//       const nextPage = await getConditionalNextPage(userId, page);
//       if (nextPage && nextPage !== page.next) {
//         console.log(`Conditional redirect: ${nextPage}`);
//       }
//     }
//   };

//   // Set page title
//   useEffect(() => {
//     if (page?.title) {
//       document.title = page.title + " | The Gatebreaker Protocol";
//     }
//   }, [page]);

//   async function handleContinue() {
//     if (!user) return;
//     const ref = doc(db, "users", user.uid);

//     try {
//       // Determine next page
//       let nextPageId = null;

//       // Handle input type
//       if (page.type === "input") {
//         await setDoc(ref, { 
//           [page.input.field]: inputValue,
//           currentPage: page.input.next
//         }, { merge: true });
//         nextPageId = page.input.next;
//       }
//       // Handle route type
//       else if (page.type === "route") {
//         const updates = { 
//           route: page.route,
//           currentPage: page.next
//         };
        
//         if (page.route === "alone") {
//           updates.characterName = "Yib";
//           updates.wentAlone = true;
//         }
        
//         await updateDoc(ref, updates);
//         nextPageId = page.next;
//       }
//       // Handle stats type
//       else if (page.type === "stats") {
//         // Get current user data to preserve HP, MaxHP, XP, Level
//         const userSnap = await getDoc(ref);
//         const currentData = userSnap.data();
        
//         // Merge new stats with existing HP/MaxHP/XP/Level
//         const updatedStats = {
//           ...allocatedStats,
//           HP: currentData?.stats?.HP || 20,
//           MaxHP: currentData?.stats?.MaxHP || 20,
//           XP: currentData?.stats?.XP || 0,
//           Level: currentData?.stats?.Level || 1
//         };
        
//         // Determine class
//         let className = "";
//         if (allocatedStats.Intelligence >= 14) className = "Mage";
//         else if (allocatedStats.Strength >= 14 || allocatedStats.Constitution >= 14) className = "Warrior";
//         else if (allocatedStats.Charisma >= 14 || allocatedStats.Wisdom >= 14) className = "Summoner";
//         else className = "Undecided / Mixed";

//         await updateDoc(ref, { 
//           stats: updatedStats,
//           className,
//           currentPage: page.next
//         });
//         nextPageId = page.next;
//       }
//       // Handle class redirect
//       else if (page.type === "classRedirect") {
//         const userSnap = await getDoc(ref);
//         const userData = userSnap.data();
//         const className = userData?.className || "Adventurer";
//         const route = userData?.route || "team";

//         const classBranch = page.classNext[className];
//         if (!classBranch) {
//           nextPageId = page.next;
//         } else {
//           nextPageId = classBranch[route];
//         }
        
//         await updateDoc(ref, { currentPage: nextPageId });
//       }
//       // Handle choices
//       else if (selectedChoice) {
//         // Track choice actions
//         if (selectedChoice.action === 'tell_team' && selectedChoice.npcName) {
//           await recordToldTeam(user.uid, selectedChoice.npcName);
//         }
        
//         if (selectedChoice.action === 'meet_npc' && selectedChoice.npcName) {
//           await recordNPCMeeting(
//             user.uid, 
//             selectedChoice.npcName, 
//             selectedChoice.npcDescription,
//             pageId
//           );
//         }
        
//         nextPageId = selectedChoice.next;
//         await updateDoc(ref, { currentPage: nextPageId });
//         setSelectedChoice(null);
//       } 
//       // Handle regular next
//       else if (page.next) {
//         // Check for conditional branching
//         nextPageId = await getConditionalNextPage(user.uid, page);
//         await updateDoc(ref, { currentPage: nextPageId || page.next });
//       }

//       // Navigate to next page
//       if (nextPageId) {
//         router.push(`/adventure/${nextPageId}`);
//       }
//     } catch (error) {
//       console.error("Error in handleContinue:", error);
//       alert("An error occurred. Please try again.");
//     }
//   }

//   // Parse text with italics and character name
//   const renderText = () => {
//     const text = (page.text || "").replace(/{{characterName}}/g, characterName || "Yib");
    
//     return text.split("\n\n").map((para, idx) => {
//       const parts = para.split(/(\*[^*]+\*)/g);
      
//       return (
//         <p key={idx} className="text-base">
//           {parts.map((part, i) => {
//             if (part.startsWith('*') && part.endsWith('*')) {
//               return <em key={i}>{part.slice(1, -1)}</em>;
//             }
//             return part;
//           })}
//         </p>
//       );
//     });
//   };

//   // Handle choice selection - only allow if not already selected
//   const handleChoiceClick = (choice) => {
//     setSelectedChoice(selectedChoice?.next === choice.next ? null : choice);
//   };

//   return (
//     <div
//       className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-6 story-hero"
//       style={{ backgroundImage: `url(${page.src})` }}
//     >
//       <StatLayout />
//       <MenuButton />
//       <DebugPanel pageId={pageId} page={page} />

//       <div className="story-text p-2 mb-6">
//         <div className="space-y-2 m-3">
//           {renderText()}
//         </div>
//       </div>

//       <div className="space-y-4">
//         {page.type === "input" && (
//           <NameInput
//             label={page.input.label}
//             value={inputValue}
//             onChange={setInputValue}
//           />
//         )}

//         {page.type === "stats" && (
//           <PageStats
//             onStatsChange={(stats, remaining) => {
//               setAllocatedStats(stats);
//               setPointsRemaining(remaining);
//             }}
//           />
//         )}

//         {page.type === "roll" && (
//           <RollPage 
//             userStats={userStats} 
//             page={page} 
//             onSuccess={handleContinue}
//           />
//         )}

//         {page.type === "battle" && (
//           <BattlePage 
//             userStats={userStats} 
//             page={page}
//             userId={user?.uid}
//           />
//         )}

//         {/* Choices */}
//         {page.choices && page.choices.map((choice, i) => (
//           <button
//             key={i}
//             className={`block choice-button w-full px-4 py-3 text-md transition-colors ${
//               selectedChoice?.next === choice.next
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-700 hover:bg-gray-600"
//             }`}
//             onClick={() => handleChoiceClick(choice)}
//           >
//             <div className="">{choice.label}</div>
//             {choice.description && (
//               <div className="text-sm opacity-75 mt-1">{choice.description}</div>
//             )}
//           </button>
//         ))}

//         {/* Continue Button */}
//         {(page.type === "stats" || 
//           page.type === "input" || 
//           page.type === "classRedirect" ||
//           page.type === "text" ||
//           page.type === "route" ||
//           page.choices) && 
//           page.type !== "roll" && 
//           page.type !== "battle" && (
//           <button
//             className={`continue-btn w-full px-6 py-3 font-bold text-lg transition-all ${
//               (page.type === "stats" && pointsRemaining > 0) ||
//               (page.type === "input" && inputValue.trim() === "") ||
//               (page.choices && !selectedChoice)
//                 ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
//                 : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
//             }`}
//             onClick={handleContinue}
//             disabled={
//               (page.type === "stats" && pointsRemaining > 0) ||
//               (page.type === "input" && inputValue.trim() === "") ||
//               (page.choices && !selectedChoice)
//             }
//           >
//             Continue
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }