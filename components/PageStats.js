// "use client";

// import { useState } from "react";
// import { db, auth } from "@/lib/firebase";
// import { doc, updateDoc } from "firebase/firestore";
// import { useRouter } from "next/navigation";

// export default function PageStats({ page }) {
// //   const [stats, setStats] = useState(page.stats);
//   const [stats, setStats] = useState(
//   page.type === "stats"
//     ? { ...page.stats } // copy from JSON
//     : {} // fallback so we don't crash
//   );
//   const [remaining, setRemaining] = useState(page.stats.points);
//   const router = useRouter();

//   const adjustStat = (stat, amount) => {
//     if (amount > 0 && remaining === 0) return;
//     if (stats[stat] + amount < 1) return;
//     setStats(prev => ({ ...prev, [stat]: prev[stat] + amount }));
//     setRemaining(r => r - amount);
//   };

//   const getClassPrediction = () => {
//     const { Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma } = stats;
//     if (Intelligence >= 14) return "Mage";
//     if (Strength >= 14 || Constitution >= 14) return "Warrior";
//     if (Charisma >= 14 || Wisdom >= 14) return "Summoner";
//     return "Undecided / Mixed";
//   };

//   const handleContinue = async () => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const charClass = getClassPrediction();

//     await updateDoc(doc(db, "users", user.uid), {
//       stats: {
//         Strength: stats.Strength,
//         Dexterity: stats.Dexterity,
//         Constitution: stats.Constitution,
//         Intelligence: stats.Intelligence,
//         Wisdom: stats.Wisdom,
//         Charisma: stats.Charisma,
//         class: charClass
//       }
//     });

//     router.push(`/adventure/${page.next}`);
//   };

//   return (
//     <div className="p-6">
//       {/* <h1 className="text-xl font-bold mb-2">{page.text}</h1> */}

//       <div className="stat-box p-2 mb-4">
//         <h2 className="text-xl font-bold mb-2 justify-self-center">Allocate Your Stats</h2>
//         <p className="justify-self-center">Points Remaining: {remaining}</p>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         {Object.keys(stats)
//           .filter(s => s !== "points")
//           .map(stat => (
//             <div key={stat} className="flex items-center justify-between border rounded p-2 stat-box">
//               <span>{stat}: {stats[stat]}</span>
//               <div className="space-x-2">
//                 <button
//                   className="px-2 py-1 bg-red-500 rounded"
//                   onClick={() => adjustStat(stat, -1)}
//                   disabled={stats[stat] <= 1}
//                 >-</button>
//                 <button
//                   className="px-2 py-1 bg-green-500 rounded"
//                   onClick={() => adjustStat(stat, 1)}
//                   disabled={remaining <= 0}
//                 >+</button>
//               </div>
//             </div>
//           ))}
//       </div>

//       <div className="mt-6 stat-box p-2">
//         <p className="font-semibold justify-self-center">Predicted Class: {getClassPrediction()}</p>
//       </div>

//       {/* <button
//         className={`mt-6 px-4 py-2 rounded ${
//           remaining === 0
//             ? "bg-green-600 text-white hover:bg-green-700"
//             : "bg-gray-400 text-gray-700 cursor-not-allowed"
//         }`}
//         onClick={handleContinue}
//         disabled={remaining !== 0}
//       >
//         Continue
//       </button> */}
//     </div>
//   );
// }


// components/PageStats.js
"use client";
import { useState, useEffect } from "react";

export default function PageStats({ onStatsChange }) {
  const [stats, setStats] = useState({
    Strength: 10,
    Dexterity: 10,
    Constitution: 10,
    Intelligence: 10,
    Wisdom: 10,
    Charisma: 10,
  });
  const [allocatedStats, setAllocatedStats] = useState(null);
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
    if (Intelligence >= 14) return "Mage";
    if (Strength >= 14 || Constitution >= 14) return "Warrior";
    if (Charisma >= 14 || Wisdom >= 14) return "Summoner";
    return "Undecided / Mixed";
  };

  useEffect(() => {
    // notify parent ([pageId]/page.js) whenever stats/points change
    onStatsChange(stats, pointsRemaining);
  }, [stats, pointsRemaining, onStatsChange]);

  return (
    <div className="p-4 stat-box">
      {/* <h2 className="text-xl font-bold mb-2 justify-self-center">Allocate Your Stats</h2> */}
      <h2 className="text-lg mb-4 justify-self-center">Points Remaining: {pointsRemaining}</h2>

      <div className="grid grid-cols-2 gap-3 stat-page">
        {Object.entries(stats).map(([stat, value]) => (
          <div key={stat} className="flex items-center justify-between bg-gray-800 px-3 py-2 stat-div">
            <span>{stat}: {value}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleStatChange(stat, -1)}
                className="bg-red-500 px-2 py-1"
                disabled={value <= 1}
              >
                -
              </button>
              <button
                onClick={() => handleStatChange(stat, +1)}
                className="bg-green-500 px-2 py-1"
                disabled={pointsRemaining <= 0}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 stat-box p-2">
         <p className="font-semibold justify-self-center">Class: {getClassPrediction()}</p>
      </div>

    </div>
  );
}
