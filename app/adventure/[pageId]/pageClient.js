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
  getAliveMinions,
  recordGuildOpinion,
  joinGuild,
  getPlayerGuild,
  isInterestedInGuild,
  recordSacrifice,
  recordNiceToAkemi,
  recordGaveToCale,
  recordTookEnvironmentalPotion
} from '../../../lib/progressService';
import { getConditionalNextPage } from "../../../lib/conditionService";
import { checkAndUnlockPackets, DataPacketNotification } from "../../../components/DataPacket";
import { checkAndUnlockEquipment, EquipmentNotification } from "../../../components/Equipment";
import StatLayout from "../../../util/StatLayout";
import MenuButton from "../../../util/MenuButton";
import PageStats from "../../../components/PageStats";
import NameInput from "../../../components/NameInput";
import BattlePage from "../../../components/BattlePage";
import RollPage from "../../../components/RollPage";
import DeathPage from "../../../components/DeathPage";
import DebugPanel from "../../../components/DebugPanel";
import DataPacketBrowser from "../../../components/DataPacket";
import EquipmentBrowser from "../../../components/Equipment";
import { applyPageHPModification, hasVisitedPage } from "../../../lib/hpModifier";
import LightRay from "../../../components/LightRay";
import PrismaticBurst from "../../../components/PrismaticBurst";
import ChapterEndCard from "../../../components/ChapterEndCard";

export default function PageClient({ page: initialPage, pageId }) {
  const router = useRouter();
  const page = adventurePages[pageId];
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [className, setClassName] = useState("");
  const [allocatedStats, setAllocatedStats] = useState(null);
  const [pointsRemaining, setPointsRemaining] = useState(10);
  const [userStats, setUserStats] = useState(null);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [isPageChanging, setIsPageChanging] = useState(false);

  // Data Packet states
  const [newDataPackets, setNewDataPackets] = useState([]);
  const [showPacketNotification, setShowPacketNotification] = useState(false);
  const [showPacketBrowser, setShowPacketBrowser] = useState(false);

  const [newEquipment, setNewEquipment] = useState([]);
  const [showEquipmentNotification, setShowEquipmentNotification] = useState(false);
  const [showEquipmentBrowser, setShowEquipmentBrowser] = useState(false);

  const [hpModResult, setHpModResult] = useState(null);
  const [showHPNotification, setShowHPNotification] = useState(false);

  useEffect(() => {
    const handleHPModification = async () => {
      if (!user || !page.hpModification) return;

      // Check if this is a one-time modification and already applied
      if (page.hpModification.oneTime) {
        const visited = await hasVisitedPage(user.uid, pageId);
        if (visited) return; // Skip if already visited
      }

      // Apply the modification
      const result = await applyPageHPModification(user.uid, page.hpModification);
      
      if (result) {
        setHpModResult(result);
        setShowHPNotification(true);
        
        // Update local userStats to reflect change
        setUserStats(prev => ({
          ...prev,
          HP: result.newHP
        }));
        
        // Auto-hide after 4 seconds
        setTimeout(() => setShowHPNotification(false), 4000);
      }
    };

    handleHPModification();
  }, [user, pageId, page.hpModification]);

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
    useEffect(() => {
      const redirectToLastPage = async () => {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const lastPage = userDoc.data().currentPage || 'page_1';
            console.error(`Page "${pageId}" not found. Redirecting to last saved page: ${lastPage}`);
            router.push(`/adventure/${lastPage}`);
          } else {
            router.push('/adventure/page_1');
          }
        } else {
          router.push('/adventure/page_1');
        }
      };
      
      redirectToLastPage();
    }, [pageId, router]);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="mb-4">The page "{pageId}" does not exist.</p>
          <p className="text-sm text-gray-400">Redirecting to your last saved page...</p>
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
          setCharacterName(userData.characterName || "My Guy");
          setClassName(userData.className || "Unknown");
        }
        
        // Handle conditional branching
        await handlePageLoad(user.uid);

        // Check for new data packets
        const unlocked = await checkAndUnlockPackets(user.uid, pageId);
        if (unlocked.length > 0) {
          setNewDataPackets(unlocked);
          setShowPacketNotification(true);
        }

        const unlockedEquipment = await checkAndUnlockEquipment(user.uid, pageId);
        if (unlockedEquipment.length > 0) {
          setNewEquipment(unlockedEquipment);
          setShowEquipmentNotification(true);
        }
        
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
          // updates.characterName = "Yib";
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
        if (allocatedStats.Essence >= 14) className = "Mage";
        else if (allocatedStats.Athletics >= 14) className = "Warrior";
        else if (allocatedStats.Thought >= 14) className = "Summoner";
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
        const className = userData?.className || "Adventurer";
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

        if (selectedChoice.hpModification) {
          await applyPageHPModification(user.uid, selectedChoice.hpModification);
        }

        // Guild opinion action
        if (selectedChoice.action === 'guild_opinion' && selectedChoice.guildName) {
          await recordGuildOpinion(
            user.uid, 
            selectedChoice.guildName, 
            selectedChoice.opinion || 'interested',
            pageId
          );
        }
        
        // Join guild action
        if (selectedChoice.action === 'join_guild' && selectedChoice.guildName) {
          await joinGuild(user.uid, selectedChoice.guildName);
        }
        
        // Track choice actions
        if (selectedChoice.action === 'tell_team' && selectedChoice.npcName) {
          await recordToldTeam(user.uid, selectedChoice.npcName);
        }
        
        if (selectedChoice.action === 'meet_npc' && selectedChoice.npcName) {
          await recordNPCMeeting(
            user.uid, 
            selectedChoice.npcName, 
            selectedChoice.npcDescription,
            pageId,
            selectedChoice.npcStats
          );
        }

        if (selectedChoice.action === 'sacrifice' && selectedChoice.sacrificeLocation) {
          await recordSacrifice(user.uid, selectedChoice.sacrificeLocation);
        }

        if (selectedChoice.action === 'nice_to_akemi') {
          await recordNiceToAkemi(user.uid);
        }

        if (selectedChoice.action === 'gave_to_cale') {
          await recordGaveToCale(user.uid);
        }

        if (selectedChoice.action === 'took_environment_potion') {
          await recordTookEnvironmentalPotion(user.uid);
        }

        if (selectedChoice.action === 'took_hospital_note') {
          await recordTookHospitalNote(user.uid);
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
    // const text = (page.text || "").replace(/{{characterName}}/g, characterName || "Yib");
    let text = page.text || "";
    text = text.replace(/{{characterName}}/g, characterName || "My Dude");
    text = text.replace(/{{className}}/g, className || "Unknown");

    
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

  // Handle opening packet from notification
  const handleOpenPacketFromNotification = (packet) => {
    setShowPacketNotification(false);
    setShowPacketBrowser(true);
  };

  // Handle opening equipment from notification
  const handleOpenEquipmentFromNotification = (item) => {
    setShowEquipmentNotification(false);
    setShowEquipmentBrowser(true);
  }

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
        style={{ backgroundImage: page.src ? `url(${page.src})` : 'none',
        backgroundColor: page.useCustomBackground ? '#000' : undefined}}
      >

      {page.useCustomBackground && page.customBackgroundComponent === 'LightRays' && (
        <LightRay />
      )}

      {page.useCustomBackground && page.customBackgroundComponent === 'PrismaticBurst' && (
        // <PrismaticBurst/>
        <ChapterEndCard config={page} />
      )}

      {!page.useCustomBackground && (
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
      )}

        <StatLayout />
        <MenuButton />
        {/* <DebugPanel pageId={pageId} page={page} /> */}

        {page.type !== 'battle' && page.type !== 'roll' && page.type !== 'endCard' && (
          <motion.div 
            className="story-text p-4 mb-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-2 m-3">
              {renderText()}
            </div>
          </motion.div>
        )}

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

          {page.type === "death" && (
            <DeathPage 
              deathMessage={page.deathMessage || "Darkness consumes you..."}
              deathLocation={page.deathLocation || pageId}
              respawnPage={page.next || "page_1"}
            />
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

        {/* Equipment Notification */}
        <AnimatePresence>
          {showEquipmentNotification && (
            <EquipmentNotification
              items={newEquipment}
              onClose={() => setShowEquipmentNotification(false)}
              onOpenItem={handleOpenEquipmentFromNotification}
            />
          )}
        </AnimatePresence>

        {/* Data Packet Notification */}
        <AnimatePresence>
          {showPacketNotification && (
            <DataPacketNotification
              packets={newDataPackets}
              onClose={() => setShowPacketNotification(false)}
              onOpenPacket={handleOpenPacketFromNotification}
            />
          )}
        </AnimatePresence>
        
        {/* Data Packet Browser (opened from notification) */}
        <DataPacketBrowser
          isOpen={showPacketBrowser}
          onClose={() => setShowPacketBrowser(false)}
          userId={user?.uid}
        />
        	
        {/* Equipment Browser (opened from notification) */}
        <EquipmentBrowser
          isOpen={showEquipmentBrowser}
          onClose={() => setShowEquipmentBrowser(false)}
          userId={user?.uid}
        />

        {/* HP Modification Notification */}
        <AnimatePresence>
          {showHPNotification && hpModResult && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40"
            >
              <div className={`px-6 py-4 rounded-lg shadow-2xl border-2 ${
                hpModResult.newHP < hpModResult.oldHP 
                  ? 'bg-red-900 border-red-600' 
                  : 'bg-green-900 border-green-600'
              }`}>
                <div className="text-center">
                  <div className="text-sm font-semibold mb-1">
                    {page.hpModification.message || hpModResult.message}
                  </div>
                  <div className="text-2xl font-bold">
                    <span className={hpModResult.newHP < hpModResult.oldHP ? 'text-red-300' : 'text-green-300'}>
                      {hpModResult.oldHP}
                    </span>
                    <span className="text-gray-400 mx-2">→</span>
                    <span className={hpModResult.newHP < hpModResult.oldHP ? 'text-red-100' : 'text-green-100'}>
                      {hpModResult.newHP}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">HP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </AnimatePresence>
  );
}










// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState, useMemo } from "react";
// import { auth, db } from "../../../lib/firebase";
// import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { adventurePages } from "../pages";
// import { motion, AnimatePresence } from "framer-motion";
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
//   const [backgroundLoaded, setBackgroundLoaded] = useState(false);
//   const [isPageChanging, setIsPageChanging] = useState(false);

//   const PARTICLE_COUNT = 40;

//   const particles = useMemo(() => {
//       return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
//         const duration = Math.random() * 18 + 14;
//         return {
//           id: i,
//           size: Math.random() * 2 + 1,
//           left: Math.random() * 100,
//           top: Math.random() * 100,
//           duration,
//           delay: Math.random() * -duration
//         };
//       });
//   }, []);


//   //NEED TO MIGRATE PAGES TO FIREBASE

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

//   // Preload background image
//   useEffect(() => {
//     setBackgroundLoaded(false);
//     if (page.src) {
//       const img = new Image();
//       img.src = page.src;
//       img.onload = () => {
//         setBackgroundLoaded(true);
//       };
//     } else {
//       setBackgroundLoaded(true);
//     }
//   }, [page.src]);

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
//           setCharacterName(userData.characterName || "Unknown");
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
//       setIsPageChanging(true);
      
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
//         const className = userData?.className || "Unknown";
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

//       // Wait for animation before navigating
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       // Navigate to next page
//       if (nextPageId) {
//         router.push(`/adventure/${nextPageId}`);
//       }
//     } catch (error) {
//       console.error("Error in handleContinue:", error);
//       alert("An error occurred. Please try again.");
//       setIsPageChanging(false);
//     }
//   }

//   // Parse text with italics and character name
//   const renderText = () => {
//     const text = (page.text || "").replace(/{{characterName}}/g, characterName || "Yib");
    
//     return text.split("\n\n").map((para, idx) => {
//       const parts = para.split(/(\*[^*]+\*)/g);
      
//       return (
//         <motion.p 
//           key={idx} 
//           className="text-base"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: idx * 0.1 }}
//         >
//           {parts.map((part, i) => {
//             if (part.startsWith('*') && part.endsWith('*')) {
//               return <em key={i}>{part.slice(1, -1)}</em>;
//             }
//             return part;
//           })}
//         </motion.p>
//       );
//     });
//   };

//   // Handle choice selection - only allow if not already selected
//   const handleChoiceClick = (choice) => {
//     setSelectedChoice(selectedChoice?.next === choice.next ? null : choice);
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2
//       }
//     },
//     exit: { 
//       opacity: 0,
//       transition: { duration: 0.3 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: { duration: 0.4 }
//     }
//   };

//   const backgroundVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { duration: 0.8, ease: "easeInOut" }
//     }
//   };

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={pageId}
//         initial="hidden"
//         animate={backgroundLoaded ? "visible" : "hidden"}
//         exit="exit"
//         variants={backgroundVariants}
//         className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-6 story-hero"
//         style={{ backgroundImage: page.src ? `url(${page.src})` : 'none' }}
//       >

//         <div className="screen-particles">
//           {particles.map(p => (
//             <span
//               key={p.id}
//               style={{
//                 width: `${p.size}px`,
//                 height: `${p.size}px`,
//                 left: `${p.left}%`,
//                 top: `${p.top}%`,
//                 filter: 'blur(0.8px) saturate(1.1) contrast(1.1)',
//                 animationDuration: `${p.duration}s`,
//                 animationDelay: `${p.delay}s`
//               }}
//             />
//           ))}
//         </div>

//         <StatLayout />
//         <MenuButton />
//         {/* <DebugPanel pageId={pageId} page={page} /> */}

//         <motion.div 
//           className="story-text p-2 mb-6"
//           variants={itemVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <div className="space-y-2 m-3">
//             {renderText()}
//           </div>
//         </motion.div>

//         <motion.div 
//           className="space-y-4 w-full max-w-2xl"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {page.type === "input" && (
//             <motion.div variants={itemVariants}>
//               <NameInput
//                 label={page.input.label}
//                 value={inputValue}
//                 onChange={setInputValue}
//               />
//             </motion.div>
//           )}

//           {page.type === "stats" && (
//             <motion.div variants={itemVariants}>
//               <PageStats
//                 onStatsChange={(stats, remaining) => {
//                   setAllocatedStats(stats);
//                   setPointsRemaining(remaining);
//                 }}
//               />
//             </motion.div>
//           )}

//           {page.type === "roll" && (
//             <motion.div variants={itemVariants}>
//               <RollPage 
//                 userStats={userStats} 
//                 page={page} 
//                 onSuccess={handleContinue}
//               />
//             </motion.div>
//           )}

//           {page.type === "battle" && (
//             <motion.div variants={itemVariants}>
//               <BattlePage 
//                 userStats={userStats} 
//                 page={page}
//                 userId={user?.uid}
//               />
//             </motion.div>
//           )}

//           {/* Choices */}
//           {page.choices && page.choices.map((choice, i) => (
//             <motion.button
//               key={i}
//               variants={itemVariants}
//               whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
//               whileTap={{ scale: 0.98 }}
//               className={`block choice-button w-full px-4 py-3 text-md transition-colors ${
//                 selectedChoice?.next === choice.next
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-700 hover:bg-gray-600"
//               }`}
//               onClick={() => handleChoiceClick(choice)}
//             >
//               <div className="">{choice.label}</div>
//               {choice.description && (
//                 <div className="text-sm opacity-75 mt-1">{choice.description}</div>
//               )}
//             </motion.button>
//           ))}

//           {/* Continue Button */}
//           {(page.type === "stats" || 
//             page.type === "input" || 
//             page.type === "classRedirect" ||
//             page.type === "text" ||
//             page.type === "route" ||
//             page.choices) && 
//             page.type !== "roll" && 
//             page.type !== "battle" && (
//             <motion.button
//               variants={itemVariants}
//               whileHover={{ 
//                 scale: (page.type === "stats" && pointsRemaining > 0) ||
//                        (page.type === "input" && inputValue.trim() === "") ||
//                        (page.choices && !selectedChoice) ? 1 : 1.05,
//                 transition: { duration: 0.2 }
//               }}
//               whileTap={{ scale: 0.95 }}
//               className={`continue-btn w-full px-6 py-3 font-bold text-lg transition-all ${
//                 (page.type === "stats" && pointsRemaining > 0) ||
//                 (page.type === "input" && inputValue.trim() === "") ||
//                 (page.choices && !selectedChoice)
//                   ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
//                   : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
//               }`}
//               onClick={handleContinue}
//               disabled={
//                 isPageChanging ||
//                 (page.type === "stats" && pointsRemaining > 0) ||
//                 (page.type === "input" && inputValue.trim() === "") ||
//                 (page.choices && !selectedChoice)
//               }
//             >
//               {isPageChanging ? "Loading..." : "Continue"}
//             </motion.button>
//           )}
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }