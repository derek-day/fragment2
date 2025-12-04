// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { Sword, Sparkles, Package, DoorOpen, Heart, Shield } from 'lucide-react';
// import DiceBox from "@3d-dice/dice-box";
// import { useRouter } from "next/navigation";

// const BattleSystem = ({ userStats, page }) => {
//   const diceBoxRef = useRef(null);
//   const containerRef = useRef(null);
//   const router = useRouter();

//   const [gameLog, setGameLog] = useState([]);
//   const [playerHP, setPlayerHP] = useState(userStats?.hp || 100);
//   const [enemyHP, setEnemyHP] = useState(page?.enemy?.maxHP || 100);
//   const [isPlayerTurn, setIsPlayerTurn] = useState(true);
//   const [battleEnded, setBattleEnded] = useState(false);
//   const [selectedAction, setSelectedAction] = useState(null);
//   const [isRolling, setIsRolling] = useState(false);
//   const [potionsRemaining, setPotionsRemaining] = useState(userStats?.items?.healthPotion || 3);

//   // Initialize DiceBox
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const dice = new DiceBox("#dice-box", {
//       assetPath: "/dice-box-assets/",
//       scale: 15,
//       size: 6,
//       gravity: 9.8,
//       lightIntensity: 1,
//       perspective: true,
//       theme: "smooth",
//       themeColor: "#a60d0d",
//       shadowOpacity: 1,
//       throwForce: 0.02,
//     });

//     dice.init().then(() => {
//       diceBoxRef.current = dice;
//       console.log("🎲 DiceBox ready for battle");
//     }).catch(err => console.error("Dice init error:", err));
//   }, []);

//   // Player stats from Firestore
//   const player = {
//     name: userStats?.characterName || "Yib",
//     maxHP: userStats?.HP || 20,
//     strength: userStats?.Strength || 10,
//     intelligence: userStats?.Intelligence || 10,
//     dexterity: userStats?.Dexterity || 10,
//     wisdom: userStats?.Wisdom || 10,
//     charisma: userStats?.Charisma || 10,
//     constitution: userStats?.Constitution || 10
//   };

//   // Calculate ability modifiers
//   const getModifier = (stat) => Math.floor((stat - 10) / 2);

//   // Get strongest physical stat (STR or DEX)
//   const getAttackStat = () => {
//     return player.strength >= player.dexterity ? 
//       { name: 'STR', value: player.strength, mod: getModifier(player.strength) } :
//       { name: 'DEX', value: player.dexterity, mod: getModifier(player.dexterity) };
//   };

//   // Get strongest spellcasting stat (INT, WIS, or CHA)
//   const getSpellcastingStat = () => {
//     const stats = [
//       { name: 'INT', value: player.intelligence, mod: getModifier(player.intelligence) },
//       { name: 'WIS', value: player.wisdom, mod: getModifier(player.wisdom) },
//       { name: 'CHA', value: player.charisma, mod: getModifier(player.charisma) }
//     ];
//     return stats.reduce((best, current) => current.value > best.value ? current : best);
//   };

//   const addLog = (message, type = 'normal') => {
//     setGameLog(prev => [...prev, { message, type, id: Date.now() + Math.random() }]);
//   };

//   const rollDice = async (sides = 20) => {
//     if (!diceBoxRef.current) {
//       // Fallback if dice not initialized
//       return Math.floor(Math.random() * sides) + 1;
//     }

//     setIsRolling(true);
//     const roll = await diceBoxRef.current.roll(`1d${sides}`);
//     setIsRolling(false);
//     return roll[0]?.value ?? 1;
//   };

//   const calculateDamage = async (diceCount, diceSides) => {
//     if (!diceBoxRef.current) {
//       return Math.floor(Math.random() * (diceCount * diceSides)) + diceCount;
//     }

//     const roll = await diceBoxRef.current.roll(`${diceCount}d${diceSides}`);
//     return roll.reduce((sum, die) => sum + die.value, 0);
//   };

//   const handleAttack = async () => {
//     if (isRolling) return;
//     setSelectedAction('attack');

//     const attackStat = getAttackStat();
//     const roll = await rollDice(20);
//     const total = roll + attackStat.mod;

//     addLog(`You roll ${roll} + ${attackStat.mod} (${attackStat.name}) = ${total} to attack!`, 'roll');

//     if (total >= page.enemy.ac) {
//       const damage = await calculateDamage(1, 8) + attackStat.mod;
//       setEnemyHP(prev => Math.max(0, prev - damage));
//       addLog(`Hit! You deal ${damage} damage with your weapon!`, 'success');
//     } else {
//       addLog('Miss! Your attack fails to connect.', 'fail');
//     }

//     setTimeout(() => {
//       setIsPlayerTurn(false);
//       setSelectedAction(null);
//     }, 1500);
//   };

//   const handleMagic = async () => {
//     if (isRolling) return;
//     setSelectedAction('magic');

//     const spellStat = getSpellcastingStat();
//     const roll = await rollDice(20);
//     const total = roll + spellStat.mod;

//     addLog(`You roll ${roll} + ${spellStat.mod} (${spellStat.name}) = ${total} for magic attack!`, 'roll');

//     if (total >= page.enemy.ac) {
//       const damage = await calculateDamage(2, 6) + spellStat.mod;
//       setEnemyHP(prev => Math.max(0, prev - damage));
//       addLog(`Success! Your spell strikes for ${damage} magical damage!`, 'success');
//     } else {
//       addLog('Miss! The spell fizzles out harmlessly.', 'fail');
//     }

//     setTimeout(() => {
//       setIsPlayerTurn(false);
//       setSelectedAction(null);
//     }, 1500);
//   };

//   const handleItem = () => {
//     if (potionsRemaining > 0) {
//       setSelectedAction('item');
//       const healing = 30;
//       setPlayerHP(prev => Math.min(player.maxHP, prev + healing));
//       setPotionsRemaining(prev => prev - 1);
//       addLog(`You use a Health Potion and restore ${healing} HP!`, 'heal');

//       setTimeout(() => {
//         setIsPlayerTurn(false);
//         setSelectedAction(null);
//       }, 1500);
//     } else {
//       addLog('You have no potions left!', 'fail');
//     }
//   };

//   const handleLeave = async () => {
//     if (isRolling) return;

//     const roll = await rollDice(20);
//     const dexMod = getModifier(player.dexterity);
//     const total = roll + dexMod;

//     addLog(`You attempt to flee! Roll: ${roll} + ${dexMod} (DEX) = ${total}`, 'roll');

//     if (total >= 12) {
//       addLog('You successfully escape from battle!', 'success');
//       setBattleEnded(true);
      
//       setTimeout(() => {
//         if (page.flee) {
//           router.push(`/adventure/${page.flee}`);
//         }
//       }, 2000);
//     } else {
//       addLog('You failed to escape!', 'fail');
//       setTimeout(() => {
//         setIsPlayerTurn(false);
//       }, 1500);
//     }
//   };

//   // Enemy turn
//   useEffect(() => {
//     if (!isPlayerTurn && !battleEnded && enemyHP > 0 && !isRolling) {
//       const enemyTurnAsync = async () => {
//         // Delay before enemy acts
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         const enemyAction = Math.random() > 0.5 ? 'attack' : 'magic';
//         const roll = await rollDice(20);
        
//         if (enemyAction === 'attack') {
//           const total = roll + (page.enemy.attack || 0);
//           addLog(`${page.enemy.name} rolls ${roll} + ${page.enemy.attack} = ${total} to attack!`, 'enemy');
          
//           const playerAC = 10 + getModifier(player.dexterity);
          
//           if (total >= playerAC) {
//             const damage = await calculateDamage(1, 6) + (page.enemy.attack || 0);
//             setPlayerHP(prev => Math.max(0, prev - damage));
//             addLog(`${page.enemy.name} hits you for ${damage} damage!`, 'damage');
//           } else {
//             addLog(`${page.enemy.name}'s attack misses!`, 'success');
//           }
//         } else {
//           const total = roll + (page.enemy.magic || 0);
//           addLog(`${page.enemy.name} casts a spell! Roll: ${roll} + ${page.enemy.magic} = ${total}`, 'enemy');
          
//           const playerAC = 10 + getModifier(player.dexterity);
          
//           if (total >= playerAC) {
//             const damage = await calculateDamage(1, 8) + (page.enemy.magic || 0);
//             setPlayerHP(prev => Math.max(0, prev - damage));
//             addLog(`The spell hits you for ${damage} magical damage!`, 'damage');
//           } else {
//             addLog(`The spell misses!`, 'success');
//           }
//         }

//         // Wait before returning to player turn
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         setIsPlayerTurn(true);
//       };

//       enemyTurnAsync();
//     }
//   }, [isPlayerTurn, battleEnded, enemyHP]);

//   // Check for battle end
//   useEffect(() => {
//     if (playerHP <= 0 && !battleEnded) {
//       addLog('You have been defeated...', 'fail');
//       setBattleEnded(true);
      
//       setTimeout(() => {
//         if (page.fail) {
//           router.push(`/adventure/${page.fail}`);
//         }
//       }, 3000);
//     } else if (enemyHP <= 0 && !battleEnded) {
//       addLog('Victory! You defeated the enemy!', 'success');
//       setBattleEnded(true);
      
//       setTimeout(() => {
//         if (page.next) {
//           router.push(`/adventure/${page.next}`);
//         }
//       }, 3000);
//     }
//   }, [playerHP, enemyHP, battleEnded]);

//   const HPBar = ({ current, max, color }) => {
//     const percentage = Math.max(0, (current / max) * 100);
//     return (
//       <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden border-2 border-gray-600">
//         <div 
//           className={`h-full ${color} transition-all duration-500 flex items-center justify-center text-white text-sm font-bold`}
//           style={{ width: `${percentage}%` }}
//         >
//           {current}/{max}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-4xl font-bold text-center mb-2">{page.title}</h1>
        
//         {/* Battle Scene */}
//         <div className="bg-gray-800 rounded-lg p-6 mb-6 border-2 border-gray-700">
//           <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-line">{page.text}</p>
          
//           {/* Combatants */}
//           <div className="grid grid-cols-2 gap-8 mb-6">
//             {/* Player */}
//             <div className="bg-gray-900 p-4 rounded-lg border-2 border-blue-500">
//               <div className="flex items-center gap-2 mb-3">
//                 <Heart className="w-5 h-5 text-red-500" />
//                 <h3 className="text-xl font-bold">{player.name}</h3>
//               </div>
//               <HPBar current={playerHP} max={player.maxHP} color="bg-green-500" />
//               <div className="mt-3 text-sm text-gray-400 space-y-1">
//                 <div className="flex justify-between">
//                   <span>STR:</span>
//                   <span className="text-orange-400">{player.strength} ({getModifier(player.strength) >= 0 ? '+' : ''}{getModifier(player.strength)})</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>DEX:</span>
//                   <span className="text-blue-400">{player.dexterity} ({getModifier(player.dexterity) >= 0 ? '+' : ''}{getModifier(player.dexterity)})</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>CON:</span>
//                   <span className="text-red-400">{player.constitution} ({getModifier(player.constitution) >= 0 ? '+' : ''}{getModifier(player.constitution)})</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>INT:</span>
//                   <span className="text-purple-400">{player.intelligence} ({getModifier(player.intelligence) >= 0 ? '+' : ''}{getModifier(player.intelligence)})</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>WIS:</span>
//                   <span className="text-green-400">{player.wisdom} ({getModifier(player.wisdom) >= 0 ? '+' : ''}{getModifier(player.wisdom)})</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>CHA:</span>
//                   <span className="text-pink-400">{player.charisma} ({getModifier(player.charisma) >= 0 ? '+' : ''}{getModifier(player.charisma)})</span>
//                 </div>
//                 <div className="flex justify-between border-t border-gray-600 pt-1 mt-1">
//                   <span>Potions:</span>
//                   <span className="text-green-400">{potionsRemaining}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Enemy */}
//             <div className="bg-gray-900 p-4 rounded-lg border-2 border-red-500">
//               <div className="flex items-center gap-2 mb-3">
//                 <Shield className="w-5 h-5 text-yellow-500" />
//                 <h3 className="text-xl font-bold">{page.enemy.name}</h3>
//               </div>
//               <HPBar current={enemyHP} max={page.enemy.maxHP} color="bg-red-500" />
//               <div className="mt-3 text-sm text-gray-400 space-y-1">
//                 <div className="flex justify-between">
//                   <span>AC:</span>
//                   <span className="text-blue-400">{page.enemy.ac}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Attack:</span>
//                   <span className="text-orange-400">+{page.enemy.attack}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Magic:</span>
//                   <span className="text-purple-400">+{page.enemy.magic}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Dice Box */}
//         <div
//           id="dice-box"
//           ref={containerRef}
//           className="w-full h-48 rounded-lg mb-4 bg-gray-900 border-2 border-gray-700"
//         />

//         {/* Battle Log */}
//         <div className="bg-gray-800 rounded-lg p-4 mb-6 h-48 overflow-y-auto border-2 border-gray-700">
//           <h3 className="text-lg font-bold mb-3 text-gray-400">Battle Log</h3>
//           <div className="space-y-2">
//             {gameLog.map((log) => (
//               <div 
//                 key={log.id}
//                 className={`p-2 rounded text-sm ${
//                   log.type === 'success' ? 'bg-green-900 text-green-200' :
//                   log.type === 'fail' ? 'bg-red-900 text-red-200' :
//                   log.type === 'damage' ? 'bg-orange-900 text-orange-200' :
//                   log.type === 'heal' ? 'bg-blue-900 text-blue-200' :
//                   log.type === 'roll' ? 'bg-purple-900 text-purple-200' :
//                   log.type === 'enemy' ? 'bg-red-800 text-red-100' :
//                   'bg-gray-700 text-gray-300'
//                 }`}
//               >
//                 {log.message}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="grid grid-cols-2 gap-4">
//           <button
//             onClick={handleAttack}
//             disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//             className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
//           >
//             <Sword className="w-5 h-5" />
//             Attack ({getAttackStat().name})
//           </button>
          
//           <button
//             onClick={handleMagic}
//             disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//             className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
//           >
//             <Sparkles className="w-5 h-5" />
//             Spell ({getSpellcastingStat().name})
//           </button>
          
//           <button
//             onClick={handleItem}
//             disabled={!isPlayerTurn || battleEnded || selectedAction || potionsRemaining === 0}
//             className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
//           >
//             <Package className="w-5 h-5" />
//             Item ({potionsRemaining})
//           </button>
          
//           {/* <button
//             onClick={handleLeave}
//             disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//             className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
//           >
//             <DoorOpen className="w-5 h-5" />
//             Flee (DEX)
//           </button> */}
//         </div>

//         {/* Turn Indicator */}
//         <div className="mt-6 text-center">
//           {!battleEnded && (
//             <p className="text-xl font-bold">
//               {isPlayerTurn ? '⚔️ Your Turn' : '🛡️ Enemy Turn...'}
//             </p>
//           )}
//           {battleEnded && playerHP > 0 && enemyHP <= 0 && (
//             <div className="bg-green-900 p-4 rounded-lg">
//               <p className="text-2xl font-bold text-green-300">🎉 Victory!</p>
//               <p className="text-sm text-gray-400 mt-2">Redirecting...</p>
//             </div>
//           )}
//           {battleEnded && playerHP <= 0 && (
//             <div className="bg-red-900 p-4 rounded-lg">
//               <p className="text-2xl font-bold text-red-300">💀 Defeated</p>
//               <p className="text-sm text-gray-400 mt-2">Redirecting...</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BattleSystem;


"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sword, Sparkles, Package, DoorOpen, Heart, Shield } from 'lucide-react';
import DiceBox from "@3d-dice/dice-box";
import { useRouter } from "next/navigation";

const BattleSystem = ({ userStats, page }) => {
  const diceBoxRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  const [gameLog, setGameLog] = useState([]);
  const [playerHP, setPlayerHP] = useState(userStats?.HP || 20);
  const [enemyHP, setEnemyHP] = useState(page?.enemy?.maxHP || 100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleEnded, setBattleEnded] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [potionsRemaining, setPotionsRemaining] = useState(userStats?.items?.healthPotion || 3);

  // Initialize DiceBox
  useEffect(() => {
    if (!containerRef.current) return;

    const dice = new DiceBox("#dice-box", {
      assetPath: "/dice-box-assets/",
      scale: 15,
      size: 6,
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
      console.log("🎲 DiceBox ready for battle");
    }).catch(err => console.error("Dice init error:", err));
  }, []);

  // Player stats from Firestore
  const player = {
    name: userStats?.name || "Yib",
    maxHP: userStats?.HP || 20,
    strength: userStats?.Strength || 10,
    intelligence: userStats?.Intelligence || 10,
    dexterity: userStats?.Dexterity || 10,
    wisdom: userStats?.Wisdom || 10,
    charisma: userStats?.Charisma || 10,
    constitution: userStats?.Constitution || 10,
  };

  console.log("Player Stats:", player);

  // Calculate ability modifiers
  const getModifier = (stat) => Math.floor((stat - 10) / 2);

  // Get strongest physical stat (STR or DEX)
  const getAttackStat = () => {
    return player.strength >= player.dexterity ? 
      { name: 'STR', value: player.strength, mod: getModifier(player.strength) } :
      { name: 'DEX', value: player.dexterity, mod: getModifier(player.dexterity) };
  };

  // Get strongest spellcasting stat (INT, WIS, or CHA)
  const getSpellcastingStat = () => {
    const stats = [
      { name: 'INT', value: player.intelligence, mod: getModifier(player.intelligence) },
      { name: 'WIS', value: player.wisdom, mod: getModifier(player.wisdom) },
      { name: 'CHA', value: player.charisma, mod: getModifier(player.charisma) }
    ];
    return stats.reduce((best, current) => current.value > best.value ? current : best);
  };

  const addLog = (message, type = 'normal') => {
    setGameLog(prev => [...prev, { message, type, id: Date.now() + Math.random() }]);
  };

  const rollDice = async (sides = 20) => {
    if (!diceBoxRef.current) {
      // Fallback if dice not initialized
      return Math.floor(Math.random() * sides) + 1;
    }

    // Clear previous dice
    diceBoxRef.current.clear();
    
    setIsRolling(true);
    const roll = await diceBoxRef.current.roll(`1d${sides}`);
    setIsRolling(false);
    return roll[0]?.value ?? 1;
  };

  const calculateDamage = async (diceCount, diceSides) => {
    if (!diceBoxRef.current) {
      return Math.floor(Math.random() * (diceCount * diceSides)) + diceCount;
    }

    // Clear previous dice
    diceBoxRef.current.clear();
    
    const roll = await diceBoxRef.current.roll(`${diceCount}d${diceSides}`);
    return roll.reduce((sum, die) => sum + die.value, 0);
  };

  const handleAttack = async () => {
    if (isRolling) return;
    setSelectedAction('attack');

    const attackStat = getAttackStat();
    const roll = await rollDice(20);
    const total = roll + attackStat.mod;

    addLog(`You roll ${roll} + ${attackStat.mod} (${attackStat.name}) = ${total} to attack!`, 'roll');

    if (total >= page.enemy.ac) {
      const damage = await calculateDamage(1, 8) + attackStat.mod;
      setEnemyHP(prev => Math.max(0, prev - damage));
      addLog(`Hit! You deal ${damage} damage with your weapon!`, 'success');
    } else {
      addLog('Miss! Your attack fails to connect.', 'fail');
    }

    setTimeout(() => {
      setIsPlayerTurn(false);
      setSelectedAction(null);
    }, 1500);
  };

  const handleMagic = async () => {
    if (isRolling) return;
    setSelectedAction('magic');

    const spellStat = getSpellcastingStat();
    const roll = await rollDice(20);
    const total = roll + spellStat.mod;

    addLog(`You roll ${roll} + ${spellStat.mod} (${spellStat.name}) = ${total} for magic attack!`, 'roll');

    if (total >= page.enemy.ac) {
      const damage = await calculateDamage(2, 6) + spellStat.mod;
      setEnemyHP(prev => Math.max(0, prev - damage));
      addLog(`Success! Your spell strikes for ${damage} magical damage!`, 'success');
    } else {
      addLog('Miss! The spell fizzles out harmlessly.', 'fail');
    }

    setTimeout(() => {
      setIsPlayerTurn(false);
      setSelectedAction(null);
    }, 1500);
  };

  const handleItem = () => {
    if (potionsRemaining > 0) {
      setSelectedAction('item');
      const healing = 30;
      setPlayerHP(prev => Math.min(player.maxHP, prev + healing));
      setPotionsRemaining(prev => prev - 1);
      addLog(`You use a Health Potion and restore ${healing} HP!`, 'heal');

      setTimeout(() => {
        setIsPlayerTurn(false);
        setSelectedAction(null);
      }, 1500);
    } else {
      addLog('You have no potions left!', 'fail');
    }
  };

  const handleLeave = async () => {
    if (isRolling) return;

    const roll = await rollDice(20);
    const dexMod = getModifier(player.dexterity);
    const total = roll + dexMod;

    addLog(`You attempt to flee! Roll: ${roll} + ${dexMod} (DEX) = ${total}`, 'roll');

    if (total >= 12) {
      addLog('You successfully escape from battle!', 'success');
      setBattleEnded(true);
      
      setTimeout(() => {
        if (page.flee) {
          router.push(`/adventure/${page.flee}`);
        }
      }, 2000);
    } else {
      addLog('You failed to escape!', 'fail');
      setTimeout(() => {
        setIsPlayerTurn(false);
      }, 1500);
    }
  };

  // Enemy turn
  useEffect(() => {
    if (!isPlayerTurn && !battleEnded && enemyHP > 0 && !isRolling) {
      const enemyTurnAsync = async () => {
        // Delay before enemy acts
        await new Promise(resolve => setTimeout(resolve, 1000));

        const enemyAction = Math.random() > 0.5 ? 'attack' : 'magic';
        const roll = await rollDice(20);
        
        if (enemyAction === 'attack') {
          const total = roll + (page.enemy.attack || 0);
          addLog(`${page.enemy.name} rolls ${roll} + ${page.enemy.attack} = ${total} to attack!`, 'enemy');
          
          const playerAC = 10 + getModifier(player.dexterity);
          
          if (total >= playerAC) {
            const damage = await calculateDamage(1, 6) + (page.enemy.attack || 0);
            setPlayerHP(prev => Math.max(0, prev - damage));
            addLog(`${page.enemy.name} hits you for ${damage} damage!`, 'damage');
          } else {
            addLog(`${page.enemy.name}'s attack misses!`, 'success');
          }
        } else {
          const total = roll + (page.enemy.magic || 0);
          addLog(`${page.enemy.name} casts a spell! Roll: ${roll} + ${page.enemy.magic} = ${total}`, 'enemy');
          
          const playerAC = 10 + getModifier(player.dexterity);
          
          if (total >= playerAC) {
            const damage = await calculateDamage(1, 8) + (page.enemy.magic || 0);
            setPlayerHP(prev => Math.max(0, prev - damage));
            addLog(`The spell hits you for ${damage} magical damage!`, 'damage');
          } else {
            addLog(`The spell misses!`, 'success');
          }
        }

        // Wait before returning to player turn
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsPlayerTurn(true);
      };

      enemyTurnAsync();
    }
  }, [isPlayerTurn, battleEnded, enemyHP]);

  // Check for battle end
  useEffect(() => {
    if (playerHP <= 0 && !battleEnded) {
      addLog('You have been defeated...', 'fail');
      setBattleEnded(true);
      
      setTimeout(() => {
        if (page.fail) {
          router.push(`/adventure/${page.fail}`);
        }
      }, 3000);
    } else if (enemyHP <= 0 && !battleEnded) {
      addLog('Victory! You defeated the enemy!', 'success');
      setBattleEnded(true);
      
      setTimeout(() => {
        if (page.next) {
          router.push(`/adventure/${page.next}`);
        }
      }, 3000);
    }
  }, [playerHP, enemyHP, battleEnded]);

  const HPBar = ({ current, max, color }) => {
    const percentage = Math.max(0, (current / max) * 100);
    return (
      <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden border-2 border-gray-600">
        <div 
          className={`h-full ${color} transition-all duration-500 flex items-center justify-center text-white text-sm font-bold`}
          style={{ width: `${percentage}%` }}
        >
          {current}/{max}
        </div>
      </div>
    );
  };

  return (
    <div className="box min-h-screen bg-gradient-to-b text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">{page.title}</h1>
        
        {/* Compact Battle Scene */}
        <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
          <p className="text-gray-300 text-sm md:text-base mb-4 leading-relaxed line-clamp-3">{page.text}</p>
          
          {/* Combatants - Horizontal Layout */}
          <div className="grid grid-cols-2 gap-3">
            {/* Player */}
            <div className="bg-gray-900 p-3 rounded-lg border-2 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-red-500" />
                <h3 className="text-sm md:text-base font-bold truncate">{player.name}</h3>
              </div>
              <HPBar current={playerHP} max={player.maxHP} color="bg-green-500" />
              <div className="mt-2 text-xs grid grid-cols-3 gap-1">
                <div className="text-center">
                  <div className="text-gray-500">STR</div>
                  <div className="text-orange-400 font-bold">{getModifier(player.strength) >= 0 ? '+' : ''}{getModifier(player.strength)}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500">DEX</div>
                  <div className="text-blue-400 font-bold">{getModifier(player.dexterity) >= 0 ? '+' : ''}{getModifier(player.dexterity)}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500">Potions</div>
                  <div className="text-green-400 font-bold">{potionsRemaining}</div>
                </div>
              </div>
            </div>

            {/* Enemy */}
            <div className="bg-gray-900 p-3 rounded-lg border-2 border-red-500">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-yellow-500" />
                <h3 className="text-sm md:text-base font-bold truncate">{page.enemy.name}</h3>
              </div>
              <HPBar current={enemyHP} max={page.enemy.maxHP} color="bg-red-500" />
              <div className="mt-2 text-xs grid grid-cols-3 gap-1">
                <div className="text-center">
                  <div className="text-gray-500">AC</div>
                  <div className="text-blue-400 font-bold">{page.enemy.ac}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500">ATK</div>
                  <div className="text-orange-400 font-bold">+{page.enemy.attack}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500">MAG</div>
                  <div className="text-purple-400 font-bold">+{page.enemy.magic}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dice Box - Compact */}
        <div
          id="dice-box"
          ref={containerRef}
          className="w-full h-32 md:h-40 rounded-lg bg-gray-900 border-2 border-gray-700"
        />

        {/* Battle Log - Compact */}
        <div className="bg-gray-800 rounded-lg p-3 h-32 md:h-40 overflow-y-auto border-2 border-gray-700">
          {/* <h3 className="text-sm font-bold mb-2 text-gray-400 sticky top-0 bg-gray-800">Battle Log</h3> */}
          <div className="space-y-1">
            {gameLog.slice(-5).map((log) => (
              <div 
                key={log.id}
                className={`p-2 rounded text-xs ${
                  log.type === 'success' ? 'bg-green-900 text-green-200' :
                  log.type === 'fail' ? 'bg-red-900 text-red-200' :
                  log.type === 'damage' ? 'bg-orange-900 text-orange-200' :
                  log.type === 'heal' ? 'bg-blue-900 text-blue-200' :
                  log.type === 'roll' ? 'bg-purple-900 text-purple-200' :
                  log.type === 'enemy' ? 'bg-red-800 text-red-100' :
                  'bg-gray-700 text-gray-300'
                }`}
              >
                {log.message}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons - Compact Grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAttack}
            disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Sword className="w-4 h-4" />
            <span className="hidden sm:inline">Attack</span> ({getAttackStat().name})
          </button>
          
          <button
            onClick={handleMagic}
            disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Magic</span> ({getSpellcastingStat().name})
          </button>
          
          <button
            onClick={handleItem}
            disabled={!isPlayerTurn || battleEnded || selectedAction || potionsRemaining === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Item</span> ({potionsRemaining})
          </button>
          
          {/* <button
            onClick={handleLeave}
            disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <DoorOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Flee</span> (DEX)
          </button> */}
        </div>

        {/* Turn Indicator */}
        <div className="text-center">
          {!battleEnded && (
            <p className="text-lg md:text-xl font-bold">
              {isPlayerTurn ? 'Your Turn' : 'Enemy Turn...'}
            </p>
          )}
          {battleEnded && playerHP > 0 && enemyHP <= 0 && (
            <div className="bg-green-900 p-3 rounded-lg">
              <p className="text-xl md:text-2xl font-bold text-green-300">Victory!</p>
              <p className="text-xs text-gray-400 mt-1">Redirecting...</p>
            </div>
          )}
          {battleEnded && playerHP <= 0 && (
            <div className="bg-red-900 p-3 rounded-lg">
              <p className="text-xl md:text-2xl font-bold text-red-300">Defeated</p>
              <p className="text-xs text-gray-400 mt-1">Redirecting...</p>
            </div>
          )}
        </div>
      </div>
    </div>



  );
};

export default BattleSystem;