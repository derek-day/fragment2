"use client";

import { useEffect, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

export default function RollPage({ userStats, page }) {
  const diceBoxRef = useRef(null);
  const containerRef = useRef(null);
  const [result, setResult] = useState(null);
  
  // FIXED: Refs don't trigger re-renders. We need state to tell the UI the dice are ready.
  const [isDiceReady, setIsDiceReady] = useState(false); 
  const [isRolling, setIsRolling] = useState(false);
  const router = useRouter();

  // Init dice roller
  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent double init if React Strict Mode runs effect twice
    if (diceBoxRef.current) return;

    const dice = new DiceBox("#dice-box", {
      assetPath: "/dice-box-assets/",
      scale: 16,
      size: 6,
      gravity: 11,
      lightIntensity: 1,
      perspective: true,
      theme: "smooth",
      themeColor: "#ca3500", // Blue dice for skill checks
      shadowOpacity: 1,
      throwForce: 0.02,
    });

    dice.init().then(() => {
      diceBoxRef.current = dice;
      setIsDiceReady(true); // Trigger re-render now that dice are ready
      console.log("DiceBox ready");
    }).catch(err => {
      console.error("Dice init error:", err);
    });

    return () => {
      // Cleanup handled by library usually, but we leave the ref for safety
    };
  }, []);

  const handleRoll = async () => {
    if (!diceBoxRef.current || !userStats || isRolling) return;

    setIsRolling(true);

    try {
      // Clear previous dice before new roll
      diceBoxRef.current.clear();
      
      const rollResult = await diceBoxRef.current.roll("1d20");
      
      const raw = rollResult[0]?.value ?? 0;
      const statName = page.roll.stat;
      
      // Handle case sensitivity for stats
      const statScore = userStats[statName] ?? userStats[statName.toLowerCase()] ?? 10;
      
      const statMod = Math.floor((statScore - 10) / 2);
      const final = raw + statMod;
      const success = final >= page.roll.dc;

      // Small delay to let user see the dice settle before showing UI
      setTimeout(() => {
        setResult({
          raw,
          statMod,
          final,
          success,
          statName,
          statScore
        });
        setIsRolling(false);
      }, 500);

    } catch (error) {
      console.error("Roll error:", error);
      setIsRolling(false);
    }
  };

  const handleContinue = () => {
    if (!result) return;
    const nextPage = result.success ? page.roll.nextSuccess : page.roll.nextFail;
    router.push(`/adventure/${nextPage}`);
  };

  return (
    // ROOT CONTAINER: Matches Battle System (Transparent, Centered, Padding)
    <div className="fixed inset-0 z-10 flex items-center justify-center p-6 md:p-12 lg:p-16 pointer-events-none">
      
      {/* GLASS CARD */}
      <div className="display w-full max-w-md md:max-w-2xl max-h-full flex flex-col bg-slate-950/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden pointer-events-auto">
        
        {/* Header */}
        <header className="bg-slate-900/50 border-b border-slate-700/50 p-4 shrink-0 flex justify-between items-center">
          <h1 className="text-lg font-bold text-slate-100 shadow-black drop-shadow-md presto-text">
            Skill Check: <span className="text-orange-400 uppercase">{page.roll.stat}</span>
          </h1>
          <div className="px-3 py-1 bg-slate-800  border border-slate-600 text-xs font-mono text-slate-300 presto-text">
            DC {page.roll.dc}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          
          {/* LEFT: Dice Tray */}
          <div className="flex flex-col h-full min-h-[200px]">
            <div className="flex-1 w-full bg-slate-900/40  border-2 border-dashed border-slate-700/50 relative shadow-inner overflow-hidden">
               {/* <span className="absolute top-3 left-3 text-[10px] text-slate-600 font-mono uppercase z-10 pointer-events-none">
                 Dice Tray
               </span> */}
               <div id="dice-box" ref={containerRef} className="w-full h-full absolute inset-0" />
            </div>
          </div>

          {/* RIGHT: Interaction Area */}
          <div className="flex flex-col justify-center space-y-6">
            
            {/* Context Text */}
            {!result && (
               <div className="bg-slate-800/30  p-4 border border-white/5">
                 <p className="text-slate-300 text-sm leading-relaxed presto-text">
                   {page.text || `You must roll a ${page.roll.stat} check to proceed.`}
                 </p>
               </div>
            )}

            {/* RESULTS AREA */}
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={` border p-4 text-center presto-text ${
                    result.success 
                      ? "bg-green-950/30 border-green-500/50" 
                      : "bg-red-950/30 border-red-500/50"
                  }`}
                >
                  <div className="flex justify-center items-center gap-2 mb-2">
                    {/* {result.success ? <CheckCircle2 className="text-green-400" /> : <XCircle className="text-red-400" />} */}
                    <h2 className={`text-xl font-bold presto-text ${result.success ? "text-green-400" : "text-red-400"}`}>
                      {result.success ? "Success" : "Failure"}
                    </h2>
                  </div>

                  <div className="text-3xl font-bold text-white mb-1 presto-text">
                    {result.final}
                  </div>
                  
                  <div className="text-xs text-slate-400 font-mono mb-4 presto-text">
                    Roll ({result.raw}) + Mod ({result.statMod}) vs DC {page.roll.dc}
                  </div>

                  <p className="text-sm text-slate-300 mb-4 px-2 presto-text">
                    {result.success ? page.roll.successText : page.roll.failText}
                  </p>

                  <button
                    onClick={handleContinue}
                    className={`w-full py-3 cinzel-text font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      result.success 
                        ? "bg-green-700 hover:bg-green-600" 
                        : "bg-red-700 hover:bg-red-600"
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                /* ACTION AREA */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                   {/* Stat Badge */}
                   <div className="flex justify-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800  border border-slate-700">
                        <span className="text-slate-400 text-sm presto-text">Your {page.roll.stat}:</span>
                        <span className="text-blue-400 font-bold presto-text">
                          {userStats ? (userStats[page.roll.stat] ?? 10) : "..."}
                        </span>
                      </div>
                   </div>

                   <button
                    onClick={handleRoll}
                    disabled={!isDiceReady || isRolling || !userStats}
                    className="w-full group relative flex items-center justify-center bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed p-4  shadow-lg border-b-4 border-red-900 active:border-b-0 active:translate-y-1 transition-all"
                  >
                    <div className="flex items-center gap-3">
                       <Dices className={`w-6 h-6 text-white`} />
                       <span className="font-bold text-white text-base cinzel-text">
                         {isRolling ? "Rolling..." : !isDiceReady ? "Loading Dice..." : "ROLL D20"}
                       </span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>
      </div>
    </div>
  );
}