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


"use client";

import { useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import { useRouter } from "next/navigation";
import { recordRollFailure } from "../lib/progressService";
import { auth } from "../lib/firebase";


export default function RollPage({ userStats, page }) {
  const diceBoxRef = useRef(null);
  const containerRef = useRef(null);
  const [result, setResult] = useState(null);
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
    // Optional camera tweak
    perspective: true,
    //cameraDistance: 100, // move camera further so big dice still fit
    theme: "smooth",
    themeColor: "#a60d0d",
    shadowOpacity: 1,
    throwForce: 0.02,
  });

  dice.init().then(() => {
    diceBoxRef.current = dice;
    console.log("🎲 DiceBox ready");
  }).catch(err => console.error("Dice init error:", err));
}, []);

  // Roll D20
  const handleRoll = async () => {
    if (!diceBoxRef.current || !userStats) return;

    const roll = await diceBoxRef.current.roll("1d20");
    const raw = roll[0]?.value ?? 0;

    const statName = page.roll.stat;
    const statScore = userStats?.[statName] ?? 10;
    const statMod = Math.floor((statScore - 10) / 2);

    const final = raw + statMod;
    const success = final >= page.roll.dc;

    setResult({
      raw,
      statMod,
      final,
      success,
    });
  };

  const handleContinue = () => {
    if (!result) return;

    const nextPage = result.success
      ? page.roll.nextSuccess
      : page.roll.nextFail;

    router.push(`/adventure/${nextPage}`);
  };


  return (
    <div className="p-6">
      {/* <h1 className="text-xl font-bold mb-4">Battle Roll</h1> */}

      <div
        id="dice-box"
        ref={containerRef}
        className="w-full h-64 rounded-lg"
      />

      {!result && (
        <button
          onClick={handleRoll}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-800 text-white"
        >
          Roll
        </button>
      )}

      {result && (
        <div className="mt-4 p-3 shadow stat-box">
          🎲 Rolled: {result.raw} + {result.statMod} ={" "}
          <strong>{result.final}</strong> vs AC {page.roll.dc} →{" "}
          {result.success ? (
            <span className="text-green-400">Hit!</span>
          ) : (
            <span className="text-red-400">Miss!</span>
          )}
          <p className="mt-2">
            {/* {result.success ? page.roll.successText : page.roll.failText} */}
            {result.success}
          </p>
          <button
            onClick={handleContinue}
            className="mt-4 px-6 py-2 rounded bg-blue-600 hover:bg-blue-800 text-white"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
