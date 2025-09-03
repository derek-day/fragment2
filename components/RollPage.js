"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import DiceRoller from "../components/DiceRoller";

export default function RollPage({ page, router }) {
  const [result, setResult] = useState(null);
  const [userStats, setUserStats] = useState(null);

    useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      console.log("Current user:", user);
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserStats(snap.data().stats); // assumes stats saved under "stats"
      }
    };
    fetchStats();
    console.log(userStats);
  }, []);


  function handleRoll() {
    const roll = Math.floor(Math.random() * 20) + 1; // d20
    const mod = Math.floor((userStats.Strength - 10) / 2);
    console.log("Roll:", roll, "Mod:", mod, "Strength:", userStats.Strength);
    const total = roll + mod;

    

    if (total >= page.roll.dc) {
      setResult(page.roll.successText);
      setTimeout(() => router.push(`/adventure/${page.roll.nextSuccess}`), 2000);
    } else {
      setResult(page.roll.failText);
      setTimeout(() => router.push(`/adventure/${page.roll.nextFail}`), 2000);
    }
  }

    if (!userStats) return <p>Loading stats...</p>;


  return (
    // <div className="text-center">
    //   <p>{page.text}</p>
    //   {!result && (
    //     <button className="bg-blue-600 px-4 py-2 rounded" onClick={handleRoll}>
    //       Roll d20
    //     </button>
    //   )}
    //   {result && <p className="mt-4">{result}</p>}
    // </div>


    <div className="p-6">
      <h1 className="text-xl font-bold">Attack Roll</h1>
      <DiceRoller
        sides={20}
        onResult={(roll) => {
          console.log("🎲 Final roll:", roll);
        }}
      />
    </div>

  );
}
