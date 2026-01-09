"use client";

import { useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RollPage({ userStats, page }) {
  const diceBoxRef = useRef(null);
  const containerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const router = useRouter();

  // Init dice roller
  useEffect(() => {
    if (!containerRef.current) return;

    const dice = new DiceBox("#dice-box", {
      assetPath: "/dice-box-assets/",
      scale: 20,
      size: 8,
      gravity: 9.8,
      lightIntensity: 1,
      perspective: true,
      theme: "smooth",
      themeColor: "#a60d0d",
      shadowOpacity: 1,
      throwForce: 0.02,
    });

    dice.init().then(() => {
      diceBoxRef.current = dice;
      console.log("DiceBox ready");
    }).catch(err => {
      console.error("Dice init error:", err);
    });

    return () => {
      // Cleanup
      if (diceBoxRef.current) {
        diceBoxRef.current.clear();
      }
    };
  }, []);

  // Roll D20
  const handleRoll = async () => {
    if (!diceBoxRef.current || !userStats || isRolling) {
      console.log("Cannot roll:", { 
        hasDiceBox: !!diceBoxRef.current, 
        hasUserStats: !!userStats, 
        isRolling 
      });
      return;
    }

    setIsRolling(true);

    try {
      const rollResult = await diceBoxRef.current.roll("1d20");
      console.log("Roll result:", rollResult);
      
      const raw = rollResult[0]?.value ?? 0;
      const statName = page.roll.stat;
      
      // Get stat score - handle case sensitivity
      const statScore = userStats[statName] ?? userStats[statName.toLowerCase()] ?? 10;
      console.log("Stat lookup:", { statName, statScore, userStats });
      
      // Calculate modifier (same as D&D: (stat - 10) / 2)
      const statMod = Math.floor((statScore - 10) / 2);
      const final = raw + statMod;
      const success = final >= page.roll.dc;

      setResult({
        raw,
        statMod,
        final,
        success,
        statName,
        statScore
      });

      setIsRolling(false);
    } catch (error) {
      console.error("Roll error:", error);
      setIsRolling(false);
    }
  };

  const handleContinue = () => {
    if (!result) return;

    const nextPage = result.success
      ? page.roll.nextSuccess
      : page.roll.nextFail;

    router.push(`/adventure/${nextPage}`);
  };

  return (
    <div className="w-full">
      {/* Dice Box Container */}
      <div
        id="dice-box"
        ref={containerRef}
        className="w-full h-64 rounded-lg bg-gray-900 bg-opacity-50 mb-4"
      />

      {/* Roll Button */}
      {!result && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRoll}
          disabled={isRolling || !diceBoxRef.current || !userStats}
          className={`w-full px-6 py-3 font-bold text-lg transition-all ${
            isRolling || !diceBoxRef.current || !userStats
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isRolling ? "Rolling..." : !userStats ? "Loading Stats..." : "Roll"}
        </motion.button>
      )}

      {/* Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-800 rounded-lg border-2 border-gray-700"
        >
          <div className="text-center mb-3">
            <div className="text-2xl font-bold mb-2">
              {result.raw} 
              <span className="text-blue-400"> + {result.statMod}</span>
              <span className="text-gray-400"> = </span>
              <span className={result.success ? "text-green-400" : "text-red-400"}>
                {result.final}
              </span>
            </div>
            <div className="text-sm text-gray-400 mb-2">
              DC {page.roll.dc} • {result.statName} ({result.statScore})
            </div>
            <div className={`text-xl font-bold ${result.success ? "text-green-400" : "text-red-400"}`}>
              {result.success ? "✓ Success!" : "✗ Failed"}
            </div>
          </div>

          <div className="text-gray-300 mb-4 p-3 bg-gray-900 rounded">
            {result.success ? page.roll.successText : page.roll.failText}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition-all"
          >
            Continue
          </motion.button>
        </motion.div>
      )}

      {/* Debug Info (remove in production) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-900 text-xs text-gray-500 rounded">
          <div>DiceBox Ready: {diceBoxRef.current ? '✓' : '✗'}</div>
          <div>User Stats: {userStats ? '✓' : '✗'}</div>
          <div>Page Roll Config: {page?.roll ? '✓' : '✗'}</div>
          {userStats && <div>Stats: {JSON.stringify(userStats)}</div>}
        </div>
      )} */}
    </div>
  );
}










// "use client";

// import { useEffect, useRef, useState } from "react";
// import DiceBox from "@3d-dice/dice-box";
// import { useRouter } from "next/navigation";
// // import { recordRollFailure } from "../lib/progressService";
// import { auth } from "../lib/firebase";


// export default function RollPage({ userStats, page }) {
//   const diceBoxRef = useRef(null);
//   const containerRef = useRef(null);
//   const [result, setResult] = useState(null);
//   const router = useRouter();


//   // Init dice roller
// useEffect(() => {
//   if (!containerRef.current) return;

//   const dice = new DiceBox("#dice-box", {
//     assetPath: "/dice-box-assets/",
//     scale: 20,
//     size: 8,
//     gravity: 9.8,
//     lightIntensity: 1,
//     // Optional camera tweak
//     perspective: true,
//     //cameraDistance: 100, // move camera further so big dice still fit
//     theme: "smooth",
//     themeColor: "#a60d0d",
//     shadowOpacity: 1,
//     throwForce: 0.02,
//   });

//   dice.init().then(() => {
//     diceBoxRef.current = dice;
//     console.log("🎲 DiceBox ready");
//   }).catch(err => console.error("Dice init error:", err));
// }, []);

//   // Roll D20
//   const handleRoll = async () => {
//     if (!diceBoxRef.current || !userStats) return;

//     const roll = await diceBoxRef.current.roll("1d20");
//     const raw = roll[0]?.value ?? 0;

//     const statName = page.roll.stat;
//     const statScore = userStats?.[statName] ?? 10;
//     const statMod = Math.floor((statScore - 10) / 2);

//     const final = raw + statMod;
//     const success = final >= page.roll.dc;

//     setResult({
//       raw,
//       statMod,
//       final,
//       success,
//     });

//     // if (!success) {
//     //   const user = auth.currentUser;
//     //   if (user) {
//     //     await recordRollFailure(user.uid, page.id);
//     //   }
//     // }

//   };

//   const handleContinue = () => {
//     if (!result) return;

//     const nextPage = result.success
//       ? page.roll.nextSuccess
//       : page.roll.nextFail;

//     router.push(`/adventure/${nextPage}`);
//   };


//   return (
//     <div className="p-6">
//       {/* <h1 className="text-xl font-bold mb-4">Battle Roll</h1> */}

//       <div
//         id="dice-box"
//         ref={containerRef}
//         className="w-full h-64 rounded-lg"
//       />

//       {!result && (
//         <button
//           onClick={handleRoll}
//           className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-800 text-white"
//         >
//           Roll
//         </button>
//       )}

//       {result && (
//         <div className="mt-4 p-3 shadow stat-box">
//           🎲 Rolled: {result.raw} + {result.statMod} ={" "}
//           <strong>{result.final}</strong> vs AC {page.roll.dc} →{" "}
//           {result.success ? (
//             <span className="text-green-400">Hit!</span>
//           ) : (
//             <span className="text-red-400">Miss!</span>
//           )}
//           <p className="mt-2">
//             {/* {result.success ? page.roll.successText : page.roll.failText} */}
//             {result.success}
//           </p>
//           <button
//             onClick={handleContinue}
//             className="mt-4 px-6 py-2 rounded bg-blue-600 hover:bg-blue-800 text-white"
//           >
//             Continue
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }














// "use client";
// import { useState, useEffect } from "react";
// import { auth, db } from "@/lib/firebase";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import DiceRoller from "../components/DiceRoller";
// import DiceBox from "@3d-dice/dice-box";

// export default function RollPage({ page, router }) {
//   const [result, setResult] = useState(null);
//   const [userStats, setUserStats] = useState(null);

//     useEffect(() => {
//     const fetchStats = async () => {
//       const user = auth.currentUser;
//       console.log("Current user:", user);
//       if (!user) return;
//       const ref = doc(db, "users", user.uid);
//       const snap = await getDoc(ref);
//       if (snap.exists()) {
//         setUserStats(snap.data().stats); // assumes stats saved under "stats"
//       }
//     };
//     fetchStats();
//     console.log(userStats);
//   }, []);


//   function handleRoll() {
//     const roll = Math.floor(Math.random() * 20) + 1; // d20
//     const mod = Math.floor((userStats.Strength - 10) / 2);
//     console.log("Roll:", roll, "Mod:", mod, "Strength:", userStats.Strength);
//     const total = roll + mod;

    

//     if (total >= page.roll.dc) {
//       setResult(page.roll.successText);
//       setTimeout(() => router.push(`/adventure/${page.roll.nextSuccess}`), 2000);
//     } else {
//       setResult(page.roll.failText);
//       setTimeout(() => router.push(`/adventure/${page.roll.nextFail}`), 2000);
//     }
//   }

//     if (!userStats) return <p>Loading stats...</p>;


//   return (
//     // <div className="text-center">
//     //   <p>{page.text}</p>
//     //   {!result && (
//     //     <button className="bg-blue-600 px-4 py-2 rounded" onClick={handleRoll}>
//     //       Roll d20
//     //     </button>
//     //   )}
//     //   {result && <p className="mt-4">{result}</p>}
//     // </div>


//     <div className="p-6">
//       <h1 className="text-xl font-bold">Attack Roll</h1>
//       <DiceRoller
//         sides={20}
//         onResult={(roll) => {
//           console.log("🎲 Final roll:", roll);
//         }}
//       />
//     </div>

//   );
// }
