"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { adventurePages } from "../pages";
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
          setCharacterName(userData.characterName || "Yib");
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

      // Navigate to next page
      if (nextPageId) {
        router.push(`/adventure/${nextPageId}`);
      }
    } catch (error) {
      console.error("Error in handleContinue:", error);
      alert("An error occurred. Please try again.");
    }
  }

  // Parse text with italics and character name
  const renderText = () => {
    const text = (page.text || "").replace(/{{characterName}}/g, characterName || "Yib");
    
    return text.split("\n\n").map((para, idx) => {
      const parts = para.split(/(\*[^*]+\*)/g);
      
      return (
        <p key={idx} className="text-base">
          {parts.map((part, i) => {
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={i}>{part.slice(1, -1)}</em>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  // Handle choice selection - only allow if not already selected
  const handleChoiceClick = (choice) => {
    setSelectedChoice(selectedChoice?.next === choice.next ? null : choice);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-6 story-hero"
      style={{ backgroundImage: `url(${page.src})` }}
    >
      <StatLayout />
      <MenuButton />
      <DebugPanel pageId={pageId} page={page} />

      <div className="story-text p-2 mb-6">
        <div className="space-y-2 m-3">
          {renderText()}
        </div>
      </div>

      <div className="space-y-4">
        {page.type === "input" && (
          <NameInput
            label={page.input.label}
            value={inputValue}
            onChange={setInputValue}
          />
        )}

        {page.type === "stats" && (
          <PageStats
            onStatsChange={(stats, remaining) => {
              setAllocatedStats(stats);
              setPointsRemaining(remaining);
            }}
          />
        )}

        {page.type === "roll" && (
          <RollPage 
            userStats={userStats} 
            page={page} 
            onSuccess={handleContinue}
          />
        )}

        {page.type === "battle" && (
          <BattlePage 
            userStats={userStats} 
            page={page}
            userId={user?.uid}
          />
        )}

        {/* Choices */}
        {page.choices && page.choices.map((choice, i) => (
          <button
            key={i}
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
          </button>
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
          <button
            className={`continue-btn w-full px-6 py-3 font-bold text-lg transition-all ${
              (page.type === "stats" && pointsRemaining > 0) ||
              (page.type === "input" && inputValue.trim() === "") ||
              (page.choices && !selectedChoice)
                ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
            }`}
            onClick={handleContinue}
            disabled={
              (page.type === "stats" && pointsRemaining > 0) ||
              (page.type === "input" && inputValue.trim() === "") ||
              (page.choices && !selectedChoice)
            }
          >
            Continue
          </button>
        )}
      </div>
    </div>
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
//   // getConditionalNextPage,
//   getAliveMinions
// } from '../../../lib/progressService';
// import { getConditionalNextPage } from "../../../lib/conditionService";
// import StatLayout from "../../../util/StatLayout";
// import MenuButton from "../../../util/MenuButton";
// import PageStats from "../../../components/PageStats";
// import NameInput from "../../../components/NameInput";
// import BattlePage from "../../../components/BattlePage";
// import RollPage from "../../../components/RollPage";

// export default function PageClient({ page: initialPage, pageId }) {
//   const router = useRouter();
//   // const [page, setPage] = useState(initialPage);
//   const page = adventurePages[pageId];
//   const [selectedChoice, setSelectedChoice] = useState(null);
//   const [user, setUser] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [characterName, setCharacterName] = useState("");
//   const [allocatedStats, setAllocatedStats] = useState(null);
//   const [pointsRemaining, setPointsRemaining] = useState(10);
//   const [userStats, setUserStats] = useState(null);

//   // Load user stats and handle page loading
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setUser(user);
//         const ref = doc(db, "users", user.uid);
//         const snap = await getDoc(ref);
//         if (snap.exists()) {
//           setUserStats(snap.data().stats || {});
//           setCharacterName(snap.data().characterName || "Yib");
//         }
        
//         // Handle conditional branching
//         await handlePageLoad(user.uid);
        
//         // Auto-track NPC meetings
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
//         // Conditionally redirect
//         console.log(`Conditional redirect: ${nextPage}`);
//         // You could auto-redirect or update the page
//         // For now, we'll just update the next button
//         setPage({ ...page, next: nextPage });
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

//     // Handle input type
//     if (page.type === "input") {
//       await setDoc(ref, { [page.input.field]: inputValue }, { merge: true });
//       router.push(`/adventure/${page.input.next}`);
//       return;
//     }

//     // Handle route type
//     if (page.type === "route") {
//       await updateDoc(ref, { route: page.route }, { merge: true });
      
//       if (page.route === "alone") {
//         await setDoc(ref, { characterName: "Yib", wentAlone: true }, { merge: true });
//       }
      
//       router.push(`/adventure/${page.next}`);
//       return;
//     }

//     // Handle stats type
//     if (page.type === "stats") {
//       await updateDoc(ref, { stats: allocatedStats });
      
//       let className = "";
//       if (allocatedStats.Intelligence >= 14) className = "Mage";
//       if (allocatedStats.Strength >= 14 || allocatedStats.Constitution >= 14) className = "Warrior";
//       if (allocatedStats.Charisma >= 14 || allocatedStats.Wisdom >= 14) className = "Summoner";
//       if (!className) className = "Undecided / Mixed";

//       await updateDoc(ref, { className }, { merge: true });
//       router.push(`/adventure/${page.next}`);
//       return;
//     }

//     // Handle class redirect
//     if (page.type === "classRedirect") {
//       const userSnap = await getDoc(ref);
//       const userData = userSnap.data();
//       const className = userData?.className || "Adventurer";
//       const route = userData?.route || "team";

//       const classBranch = page.classNext[className];
//       if (!classBranch) {
//         router.push(`/adventure/${page.next}`);
//         return;
//       }

//       const nextPageId = classBranch[route];
//       router.push(`/adventure/${nextPageId}`);
//       return;
//     }

//     // Handle choices
//     if (selectedChoice) {
//       // Track choice actions
//       if (selectedChoice.action === 'tell_team' && selectedChoice.npcName) {
//         await recordToldTeam(user.uid, selectedChoice.npcName);
//       }
      
//       if (selectedChoice.action === 'meet_npc' && selectedChoice.npcName) {
//         // await recordNPCMeeting(user.uid, selectedChoice.npcName, selectedChoice.npcDescription);
//         await recordNPCMeeting(user.uid, selectedChoice.npcName, selectedChoice.npcDescription, pageId);
//       }
      
//       router.push(`/adventure/${selectedChoice.next}`);
//       setSelectedChoice(null);
//     } else if (page.next) {
//       // Check for conditional branching
//       const nextPage = await getConditionalNextPage(user.uid, page);
//       router.push(`/adventure/${nextPage || page.next}`);
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

//     // Handle choice selection - only allow if not already selected
//     const handleChoiceClick = (choice) => {
//     setSelectedChoice(selectedChoice?.next === choice.next ? null : choice);
//   };

//   return (
//     <div
//       className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-6 story-hero"
//       style={{ backgroundImage: `url(${page.src})` }}
//     >
//       <StatLayout />
//       <MenuButton />

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
//             // onClick={() => setSelectedChoice(choice)}
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
//             className={`continue-btn ${
//               (page.type === "stats" && pointsRemaining > 0) ||
//               (page.type === "input" && inputValue.trim() === "") ||
//               (page.choices && !selectedChoice)
//                 ? "bg-gray-400 text-gray-700 cursor-not-allowed"
//                 : "bg-green-600 text-white hover:bg-green-700"
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












// "use client";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { auth, db } from "../../../lib/firebase";
// import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import { adventurePages } from "../pages";
// import { getPageData } from '../../../lib/pageService';
// import { 
//   recordPageVisit, 
//   recordCombatFailure, 
//   recordRollFailure,
//   recordDeath,
//   recordWentAlone,
//   recordNPCMeeting,
//   recordNPCDeath,
//   recordToldTeam,
//   getPlayerProgress
// } from '../../../lib/progressService';
// import StatLayout from "../../../util/StatLayout";
// import MenuButton from "../../../util/MenuButton";
// import PageStats from "../../../components/PageStats";
// import NameInput from "../../../components/NameInput";
// import BattlePage from "../../../components/BattlePage";
// import RollPage from "../../../components/RollPage";


// export default function AdventurePage() {
// // export default function AdventurePage({page, pageId }) {
//   const { pageId } = useParams();
//   const router = useRouter();
//   const page = adventurePages[pageId];
//   //const page = await getPageData(pageId);

//   const [selectedChoice, setSelectedChoice] = useState(null);
//   const [user, setUser] = useState(null);
//   const [inputValue, setInputValue] = useState("");
//   const [characterName, setCharacterName] = useState("");

//   const [allocatedStats, setAllocatedStats] = useState(null);
//   const [pointsRemaining, setPointsRemaining] = useState(10);

//   const [userStats, setUserStats] = useState(null);

//   useEffect(() => {
//   const unsub = onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       const ref = doc(db, "users", user.uid);
//       const snap = await getDoc(ref);
//       if (snap.exists()) {
//         setUserStats(snap.data().stats || {});
//       }
//     }
//   });
//   return () => unsub();
// }, []);


//   useEffect(() => {
//     const loadUser = async () => {
//       const user = auth.currentUser;
//       if (!user) return;
//       const snap = await getDoc(doc(db, "users", user.uid));
//       if (snap.exists()) {
//         setCharacterName(snap.data().characterName || "Yib");
//       }
//     };

//     loadUser();
//   }, []);


//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (page?.title) {
//       document.title = page.title + " | The Gatebreaker Protocol";
//     }
//   }, [page]);

//   // useEffect(() => {
//   //   if (!page) router.push("/adventure/page_1");
//   // }, [page]);

//   // if (!page) return null;

//   async function handleContinue() {
//     if (!user) return;

//     const ref = doc(db, "users", user.uid);

//     if (page.type === "input" && user) {
//       // const ref = doc(db, "users", user.uid);
//       await setDoc(ref, { [page.input.field]: inputValue }, { merge: true });
//       router.push(`/adventure/${page.input.next}`);
//       return;
//     }

//     if (page.type === "route" && user) {
//       let route = page.route;

//       await updateDoc(ref, { route }, { merge: true });

//       if (page.route === "alone") {
//         await setDoc(ref, { characterName: "Yib" }, { merge: true });
//       }

//       console.log("route:", route);

//       router.push(`/adventure/${page.next}`);
//       return;
//     }

//     if (page.type === "stats" && user) {
//       // const ref = doc(db, "users", user.uid);
//       await updateDoc(ref, {
//         stats: allocatedStats,   // save all stats
//       });

//       await setDoc(ref, { allocatedStats }, { merge: true });

//       let className = "";

//       if (allocatedStats.Intelligence >= 14) className = "Mage";
//       if (allocatedStats.Strength >= 14 || allocatedStats.Constitution >= 14) className = "Warrior";
//       if (allocatedStats.Charisma >= 14 || allocatedStats.Wisdom >= 14) className = "Summoner";
//       if (!className) className = "Undecided / Mixed";

//       await updateDoc(ref, { className }, { merge: true });

//       router.push(`/adventure/${page.next}`);
//       return;
//     }

//     if (page.type === "classRedirect") {
//       const userSnap = await getDoc(ref);
//       const userData = userSnap.data();
//       const className = userData?.className || "Adventurer";
//       const route = userData?.route || "team";

//       const classBranch = page.classNext[className];

//       // let nextPageId = page.next;
        
//       if (!classBranch) {
//         console.warn("Missing class entry. Using fallback.");
//         router.push(`/adventure/${page.next}`);
//         return;
//       }

//       const nextPageId = classBranch[route];

//       console.log("Redirecting to:", nextPageId);
//       router.push(`/adventure/${nextPageId}`);
//       return;

//       // console.log(page.classNext, "team_" + className);
//       // nextPageId = page.classNext[className] || page.next;
//       // console.log("Redirecting to:", nextPageId);
//       // router.push(`/adventure/${nextPageId}`);
//       // return;
//     }

//     if (selectedChoice) {
//       router.push(`/adventure/${selectedChoice.next}`);
//       setSelectedChoice(null);
//     } else if (page.next) {
//       router.push(`/adventure/${page.next}`);
//     }
//   }

//   useEffect(() => {
//     if (page?.title) {
//       document.title = page.title + " | The Gatebreaker Protocol";
//     }
//   }, [page]);

//   const renderText = page.text.replace(/{{characterName}}/g, characterName) || "Yib";

//   return (
//     <div
//       className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white p-6 story-hero"
//       style={{ backgroundImage: `url(${page.src})` }}
//     >
//       <StatLayout />
//       <MenuButton />

//       <div className="story-text p-2 mb-6">
//         <div className="space-y-2 m-3">
//           {renderText.split("\n\n").map((para, idx) => (
//             <p key={idx} className="text-base">{para}</p>
//           ))}
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
//           <PageStats onStatsChange={(stats, pointsRemaining) => {
//             setAllocatedStats(stats);
//             setPointsRemaining(pointsRemaining);
//           }} />
//         )}

//         {page.type === "roll" && (
//           <RollPage userStats={userStats} page={page} onSuccess={handleContinue} />
//         )}

//         {/* {page.type === "roll" && (
//           <RollPage userStats={userStats} enemyAC={12} page={page} />
//           // <RollPage page={page} router={router} />
//         )} */}

//         {page.type === "battle" && (
//           <BattlePage userStats={userStats} page={page} />
//         )}

//         {/* Choices */}
//         {page.choices &&
//           page.choices.map((choice, i) => (
//             <button
//               key={i}
//               className={`block choice-button w-64 px-4 py-2 text-md ${
//                 selectedChoice?.next === choice.next
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200"
//               }`}
//               onClick={() => setSelectedChoice(choice)}
//             >
//               {choice.label}
//             </button>
//           ))}

//         {(page.type === "stats" || page.type === "input" || page.type === "classRedirect" || page.type === "battle" || page.choices || page.next) && (
//           <button
//             className={`mt-4 float-right px-4 py-2 continue ${
//               (page.type === "stats" && pointsRemaining > 0) ||
//               (page.type === "input" && inputValue.trim() === "") ||
//               (page.choices && !selectedChoice)
//                 ? "bg-gray-400 text-gray-700 cursor-not-allowed continue unselect"
//                 : "bg-green-600 text-white hover:bg-green-800 continue select"
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

//         <button
//           className={`continue-btn ${
//             (page.type === "stats" && pointsRemaining > 0) ||
//             (page.type === "input" && inputValue.trim() === "") ||
//             (page.choices && !selectedChoice)
//               ? "disabled"
//               : "enabled"
//           }`}
//           onClick={handleContinue}
//           disabled={
//             (page.type === "stats" && pointsRemaining > 0) ||
//             (page.type === "input" && inputValue.trim() === "") ||
//             (page.choices && !selectedChoice)
//           }
//         >
//           Continue
//         </button>


//       </div>
//     </div>
//   );
// }
