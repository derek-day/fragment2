// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { Sword, Sparkles, Package, Heart, Shield } from 'lucide-react';
// import DiceBox from "@3d-dice/dice-box";
// import { useRouter } from "next/navigation";
// import { recordCombatFailure, recordNPCDeath, recordRevival, getAliveMinions } from '../lib/progressService';
// import { auth } from '../lib/firebase';

// const BattlePage = ({ userStats, page, userId }) => {
//   const diceBoxRef = useRef(null);
//   const containerRef = useRef(null);
//   const router = useRouter();

//   // Multi-enemy support
//   const [enemies, setEnemies] = useState([]);
//   const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
//   const [defeatedEnemies, setDefeatedEnemies] = useState([]);

//   const [gameLog, setGameLog] = useState([]);
//   const [playerHP, setPlayerHP] = useState(userStats?.HP || 20);
//   const [enemyHP, setEnemyHP] = useState(0);
//   const [isPlayerTurn, setIsPlayerTurn] = useState(true);
//   const [battleEnded, setBattleEnded] = useState(false);
//   const [selectedAction, setSelectedAction] = useState(null);
//   const [isRolling, setIsRolling] = useState(false);
//   const [potionsRemaining, setPotionsRemaining] = useState(3);

//   // Initialize enemies
//   useEffect(() => {
//     const initEnemies = async () => {
//       if (page.minionGroup && userId) {
//         // Multi-enemy battle - check who's alive
//         const aliveMinions = await getAliveMinions(userId, page.minionGroup);
        
//         const enemyList = aliveMinions.map(name => ({
//           name,
//           maxHP: page.minionStats?.hp || 50,
//           ac: page.minionStats?.ac || 12,
//           attack: page.minionStats?.attack || 5,
//           magic: page.minionStats?.magic || 3,
//           isMinion: true
//         }));
        
//         setEnemies(enemyList);
//         setEnemyHP(enemyList[0]?.maxHP || 0);
        
//         if (enemyList.length === 0) {
//           // All minions already dead - skip battle
//           addLog('All enemies have already been defeated!', 'success');
//           setBattleEnded(true);
//           setTimeout(() => router.push(`/adventure/${page.next}`), 2000);
//         }
//       } else if (page.enemy) {
//         // Single enemy
//         setEnemies([page.enemy]);
//         setEnemyHP(page.enemy.maxHP);
//       }
//     };
    
//     initEnemies();
//   }, [page, userId]);

//   const currentEnemy = enemies[currentEnemyIndex];

//   // Initialize DiceBox
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const dice = new DiceBox("#dice-box", {
//       assetPath: "/dice-box-assets/",
//       scale: 20,
//       size: 8,
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
//     }).catch(err => console.error("Dice init error:", err));
//   }, []);

//   const player = {
//     name: userStats?.name || "Yib",
//     maxHP: userStats?.HP || 20,
//     strength: userStats?.Strength || 10,
//     intelligence: userStats?.Intelligence || 10,
//     dexterity: userStats?.Dexterity || 10,
//     wisdom: userStats?.Wisdom || 10,
//     charisma: userStats?.Charisma || 10,
//     constitution: userStats?.Constitution || 10,
//   };

//   const getModifier = (stat) => Math.floor((stat - 10) / 2);

//   const getAttackStat = () => {
//     return player.strength >= player.dexterity ? 
//       { name: 'STR', mod: getModifier(player.strength) } :
//       { name: 'DEX', mod: getModifier(player.dexterity) };
//   };

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
//       return Math.floor(Math.random() * sides) + 1;
//     }

//     diceBoxRef.current.clear();
//     setIsRolling(true);
//     const roll = await diceBoxRef.current.roll(`1d${sides}`);
//     setIsRolling(false);
//     return roll[0]?.value ?? 1;
//   };

//   const calculateDamage = async (diceCount, diceSides) => {
//     if (!diceBoxRef.current) {
//       return Math.floor(Math.random() * (diceCount * diceSides)) + diceCount;
//     }

//     diceBoxRef.current.clear();
//     const roll = await diceBoxRef.current.roll(`${diceCount}d${diceSides}`);
//     return roll.reduce((sum, die) => sum + die.value, 0);
//   };

//   const handleAttack = async () => {
//     if (isRolling || !currentEnemy) return;
//     setSelectedAction('attack');

//     const attackStat = getAttackStat();
//     const roll = await rollDice(20);
//     const total = roll + attackStat.mod;

//     addLog(`You roll ${roll} + ${attackStat.mod} (${attackStat.name}) = ${total} to attack!`, 'roll');

//     if (total >= currentEnemy.ac) {
//       const damage = await calculateDamage(1, 8) + attackStat.mod;
//       setEnemyHP(prev => Math.max(0, prev - damage));
//       addLog(`Hit! You deal ${damage} damage!`, 'success');
//     } else {
//       addLog('Miss!', 'fail');
//     }

//     setTimeout(() => {
//       setIsPlayerTurn(false);
//       setSelectedAction(null);
//     }, 1500);
//   };

//   const handleMagic = async () => {
//     if (isRolling || !currentEnemy) return;
//     setSelectedAction('magic');

//     const spellStat = getSpellcastingStat();
//     const roll = await rollDice(20);
//     const total = roll + spellStat.mod;

//     addLog(`You roll ${roll} + ${spellStat.mod} (${spellStat.name}) for magic!`, 'roll');

//     if (total >= currentEnemy.ac) {
//       const damage = await calculateDamage(2, 6) + spellStat.mod;
//       setEnemyHP(prev => Math.max(0, prev - damage));
//       addLog(`Hit! Your spell deals ${damage} damage!`, 'success');
//     } else {
//       addLog('Miss!', 'fail');
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
//       addLog(`You restore ${healing} HP!`, 'heal');

//       setTimeout(() => {
//         setIsPlayerTurn(false);
//         setSelectedAction(null);
//       }, 1500);
//     }
//   };

//   // When current enemy dies
//   useEffect(() => {
//     if (enemyHP <= 0 && !battleEnded && currentEnemy) {
//       // Track NPC death
//       if (userId && currentEnemy.isMinion) {
//         recordNPCDeath(userId, currentEnemy.name);
//       }
      
//       setDefeatedEnemies(prev => [...prev, currentEnemy.name]);
      
//       // Check if more enemies remain
//       if (currentEnemyIndex + 1 < enemies.length) {
//         addLog(`${currentEnemy.name} defeated! Next enemy incoming...`, 'success');
//         setTimeout(() => {
//           setCurrentEnemyIndex(prev => prev + 1);
//           setEnemyHP(enemies[currentEnemyIndex + 1].maxHP);
//         }, 2000);
//       } else {
//         // All enemies defeated!
//         addLog('All enemies defeated!', 'success');
//         setBattleEnded(true);
//         setTimeout(() => {
//           router.push(`/adventure/${page.next}`);
//         }, 2000);
//       }
//     }
//   }, [enemyHP]);

//   // When player dies
//   useEffect(() => {
//     if (playerHP <= 0 && !battleEnded) {
//       addLog('You have been defeated...', 'fail');
//       setBattleEnded(true);
      
//       if (userId) {
//         recordCombatFailure(userId, page.id);
//         recordDeath(userId, page.id);
//       }
      
//       setTimeout(() => {
//         if (userId) recordRevival(userId);
//         router.push(`/adventure/${page.fail}`);
//       }, 3000);
//     }
//   }, [playerHP]);

//   // Enemy turn
//   useEffect(() => {
//     if (!isPlayerTurn && !battleEnded && enemyHP > 0 && !isRolling && currentEnemy) {
//       const enemyTurnAsync = async () => {
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         const enemyAction = Math.random() > 0.5 ? 'attack' : 'magic';
//         const roll = await rollDice(20);
        
//         if (enemyAction === 'attack') {
//           const total = roll + (currentEnemy.attack || 0);
//           addLog(`${currentEnemy.name} rolls ${roll} + ${currentEnemy.attack} = ${total}!`, 'enemy');
          
//           const playerAC = 10 + getModifier(player.dexterity);
          
//           if (total >= playerAC) {
//             const damage = await calculateDamage(1, 6) + (currentEnemy.attack || 0);
//             setPlayerHP(prev => Math.max(0, prev - damage));
//             addLog(`${currentEnemy.name} hits for ${damage} damage!`, 'damage');
//           } else {
//             addLog(`${currentEnemy.name} misses!`, 'success');
//           }
//         } else {
//           const total = roll + (currentEnemy.magic || 0);
//           addLog(`${currentEnemy.name} casts a spell! ${total}`, 'enemy');
          
//           const playerAC = 10 + getModifier(player.dexterity);
          
//           if (total >= playerAC) {
//             const damage = await calculateDamage(1, 8) + (currentEnemy.magic || 0);
//             setPlayerHP(prev => Math.max(0, prev - damage));
//             addLog(`Spell hits for ${damage} damage!`, 'damage');
//           } else {
//             addLog(`Spell misses!`, 'success');
//           }
//         }

//         await new Promise(resolve => setTimeout(resolve, 1500));
//         setIsPlayerTurn(true);
//       };

//       enemyTurnAsync();
//     }
//   }, [isPlayerTurn, battleEnded, enemyHP]);

//   const HPBar = ({ current, max, color }) => {
//     const percentage = Math.max(0, (current / max) * 100);
//     return (
//       <div className="w-full bg-gray-700 rounded-full h-6 border-2 border-gray-600">
//         <div 
//           className={`h-full ${color} transition-all duration-500 flex items-center justify-center text-white text-sm font-bold`}
//           style={{ width: `${percentage}%` }}
//         >
//           {current}/{max}
//         </div>
//       </div>
//     );
//   };

//   if (!currentEnemy) return null;

//   return (
//     <div className="box min-h-screen bg-gradient-to-b text-white p-4 md:p-6">
//       <div className="max-w-5xl mx-auto space-y-4">
//         <h1 className="text-2xl md:text-3xl font-bold text-center">{page.title}</h1>
        
//         {/* Show progress for multi-enemy */}
//         {enemies.length > 1 && (
//           <div className="text-center text-sm text-gray-400">
//             Enemy {currentEnemyIndex + 1} of {enemies.length}
//             {defeatedEnemies.length > 0 && (
//               <div className="text-xs text-green-400">
//                 Defeated: {defeatedEnemies.join(', ')}
//               </div>
//             )}
//           </div>
//         )}
        
//         <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
//           <div className="grid grid-cols-2 gap-3">
//             {/* Player */}
//             <div className="bg-gray-900 p-3 rounded-lg border-2 border-blue-500">
//               <div className="flex items-center gap-2 mb-2">
//                 <Heart className="w-4 h-4 text-red-500" />
//                 <h3 className="text-sm font-bold">{player.name}</h3>
//               </div>
//               <HPBar current={playerHP} max={player.maxHP} color="bg-green-500" />
//             </div>

//             {/* Enemy */}
//             <div className="bg-gray-900 p-3 rounded-lg border-2 border-red-500">
//               <div className="flex items-center gap-2 mb-2">
//                 <Shield className="w-4 h-4 text-yellow-500" />
//                 <h3 className="text-sm font-bold">{currentEnemy.name}</h3>
//               </div>
//               <HPBar current={enemyHP} max={currentEnemy.maxHP} color="bg-red-500" />
//             </div>
//           </div>
//         </div>

//         <div
//           id="dice-box"
//           ref={containerRef}
//           className="w-full h-32 rounded-lg bg-gray-900 border-2 border-gray-700"
//         />

//         <div className="bg-gray-800 rounded-lg p-3 h-32 overflow-y-auto border-2 border-gray-700">
//           <div className="space-y-1">
//             {gameLog.slice(-5).map((log) => (
//               <div 
//                 key={log.id}
//                 className={`p-2 rounded text-xs ${
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

//         <div className="grid grid-cols-2 gap-2">
//           <button
//             onClick={handleAttack}
//             disabled={!isPlayerTurn || battleEnded || isRolling}
//             className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 p-3 rounded-lg font-bold flex items-center justify-center gap-2"
//           >
//             <Sword className="w-4 h-4" />
//             Attack ({getAttackStat().name})
//           </button>
          
//           <button
//             onClick={handleMagic}
//             disabled={!isPlayerTurn || battleEnded || isRolling}
//             className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 p-3 rounded-lg font-bold flex items-center justify-center gap-2"
//           >
//             <Sparkles className="w-4 h-4" />
//             Magic ({getSpellcastingStat().name})
//           </button>
          
//           <button
//             onClick={handleItem}
//             disabled={!isPlayerTurn || battleEnded || potionsRemaining === 0}
//             className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 p-3 rounded-lg font-bold flex items-center justify-center gap-2"
//           >
//             <Package className="w-4 h-4" />
//             Item ({potionsRemaining})
//           </button>
//         </div>

//         <div className="text-center">
//           {!battleEnded && (
//             <p className="text-lg font-bold">
//               {isPlayerTurn ? 'Your Turn' : 'Enemy Turn...'}
//             </p>
//           )}
//           {battleEnded && (
//             <div className={playerHP > 0 ? "bg-green-900 p-3 rounded-lg" : "bg-red-900 p-3 rounded-lg"}>
//               <p className="text-xl font-bold">
//                 {playerHP > 0 ? 'Victory!' : 'Defeated'}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BattlePage;









//NEED TO USE THIS ONE FOR DICE ROLLER
//RUN THROUGH CLAUDE TO FIX DICE ROLLER AND UPDATE UI FOR DESKTOP AND MOBILE

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
      // scale: 15,
      scale: 20,
      // size: 6,
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
      console.log("🎲 DiceBox ready for battle");
    }).catch(err => console.error("Dice init error:", err));
  }, []);

  // Player stats from Firestore
  const player = {
    name: userStats?.name || "Yib",
    maxHP: userStats?.HP || 20,
    athletics: userStats?.Athletics || 10,
    essence: userStats?.Essence || 10,
    thought: userStats?.Thought || 10,
    fellowship: userStats?.Fellowship || 10,
  };

  console.log("Player Stats:", player);

  // Calculate ability modifiers
  const getModifier = (stat) => Math.floor((stat - 10) / 2);

  // Get strongest physical stat (STR or DEX)
  const getAttackStat = () => {
    // return player.athletics;
    return player.athletics >= player.athletics ? 
      { name: 'ATH', value: player.athletics, mod: getModifier(player.athletics) } :
      { name: 'ATH', value: player.athletics, mod: getModifier(player.athletics) };
  };

  // Get strongest spellcasting stat (INT, WIS, or CHA)
  const getSpellcastingStat = () => {
    const stats = [
      { name: 'THO', value: player.thought, mod: getModifier(player.thought) },
      { name: 'ESS', value: player.essence, mod: getModifier(player.essence) },
      { name: 'FEL', value: player.fellowship, mod: getModifier(player.fellowship) }
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
    const dexMod = getModifier(player.athletics);
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
          
          const playerAC = 10 + getModifier(player.athletics);
          
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
          
          const playerAC = 10 + getModifier(player.athletics);
          
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
    // ROOT CONTAINER: 
    // - Transparent so background image shows.
    // - Flex/Centered to float the UI in the middle.
    // - Padding (p-6 md:p-12) keeps UI away from corner buttons.
    <div className="fixed inset-0 z-10 flex items-center justify-center p-6 md:p-12 lg:p-16 pointer-events-none">
      
      {/* GLASS CARD: The actual interface */}
      <div className="display w-full max-w-md md:max-w-4xl max-h-full flex flex-col bg-slate-950/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden pointer-events-auto">
        
        {/* 1. Header */}
        <header className="bg-slate-900/50 border-b border-slate-700/50 p-3 shrink-0 flex justify-between items-center">
          <h1 className="text-lg font-bold text-slate-100 shadow-black drop-shadow-md">{page.title}</h1>
          
          {/* Status Badge */}
          <div className={`px-3 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
            battleEnded 
              ? (playerHP > 0 ? "bg-green-900/60 border-green-600 text-green-200" : "bg-red-900/60 border-red-600 text-red-200")
              : (isPlayerTurn ? "bg-blue-900/60 border-blue-500 text-blue-200 animate-pulse" : "bg-orange-900/60 border-orange-500 text-orange-200")
          }`}>
             {battleEnded ? (playerHP > 0 ? "Victory" : "Defeat") : (isPlayerTurn ? "Your Turn" : "Enemy Turn")}
          </div>
        </header>

        {/* 2. Main Content - Scrollable internal area if height gets too small */}
        <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          
          {/* LEFT COLUMN: Visuals */}
          <div className="flex flex-col gap-3">
            {/* Combatants */}
            <div className="grid grid-cols-2 gap-3">
              {/* Player */}
              <div className="bg-slate-900/60 p-2.5 border border-blue-500/30">
                <div className="flex justify-between items-center mb-1">
                   <div className="flex items-center gap-1.5 font-bold text-sm text-blue-100">
                     <Heart className="w-3.5 h-3.5 text-red-600" /> {player.name}
                   </div>
                   <span className="text-[10px] text-slate-400">{playerHP}/{player.maxHP}</span>
                </div>
                <HPBar current={playerHP} max={player.maxHP} color="bg-green-600" />
              </div>
              
              {/* Enemy */}
              <div className="bg-slate-900/60 p-2.5 border border-red-600/30">
                <div className="flex justify-between items-center mb-1">
                   <div className="flex items-center gap-1.5 font-bold text-sm text-red-100">
                     <Shield className="w-3.5 h-3.5 text-yellow-500" /> {page.enemy.name}
                   </div>
                   <div className="text-[10px] text-slate-400 font-mono">AC:{page.enemy.ac}</div>
                </div>
                <HPBar current={enemyHP} max={page.enemy.maxHP} color="bg-red-600" />
              </div>
            </div>

            {/* Dice Tray - Fixed Height so it doesn't sprawl */}
            <div className="h-32 md:h-48 w-full bg-slate-900/40 border-2 border-dashed border-slate-700/50 relative">
               {/* <span className="absolute top-2 left-2 text-[10px] text-slate-600 font-mono uppercase">Dice Tray</span> */}
               <div id="dice-box" ref={containerRef} className="w-full h-full" />
            </div>
          </div>

          {/* RIGHT COLUMN: Info & Logs */}
          <div className="flex flex-col gap-3 min-h-0">
             {/* Story Text */}
             {/* <div className="bg-slate-800/30 p-2 text-sm text-slate-300 border border-white/5">
                <p className="line-clamp-3 md:line-clamp-none">{page.text}</p>
             </div> */}

             {/* Battle Log - constrained height */}
             <div className="flex-1 min-h-[100px] md:min-h-0 bg-black/40 border border-slate-700/50 p-2 flex flex-col relative overflow-hidden">
                <span className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider sticky top-0">Log</span>
                <div className="overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {gameLog.slice().reverse().map((log) => (
                    <div key={log.id} className={`text-[11px] p-1.5 ${
                        log.type === 'success' ? 'text-green-300 bg-green-900/20' :
                        log.type === 'fail' ? 'text-red-300 bg-red-900/20' :
                        log.type === 'damage' ? 'text-orange-300 bg-orange-900/20' :
                        'text-slate-400'
                    }`}>
                      {log.message}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* 3. Footer Buttons */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-700/50 grid grid-cols-2 gap-3 shrink-0">
          <button
            onClick={handleAttack}
            disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
            className="flex items-center justify-center bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-4 font-bold gap-2 justify-center shadow-lg border-b-4 border-red-900 active:border-b-0 active:scale-95 transition-all"
            // className="bg-orange-700 hover:bg-orange-600 disabled:opacity-50 disabled:bg-slate-700 text-white py-3 font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Sword className="w-4 h-4" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-sm">ATTACK</span>
              <span className="text-[10px] opacity-70 font-mono">{getAttackStat().name}</span>
            </div>
          </button>

          <button
            onClick={handleMagic}
            disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
            className="flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-4 font-bold gap-2 justify-center shadow-lg border-b-4 border-purple-900 active:border-b-0 active:scale-95 transition-all"
            // className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:bg-slate-700 text-white py-3 font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
             <div className="flex flex-col items-start leading-none">
              <span className="text-sm">MAGIC</span>
              <span className="text-[10px] opacity-70 font-mono">{getSpellcastingStat().name}</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );

  
  // return (
  //   <div className="box min-h-screen bg-gradient-to-b text-white p-4 md:p-6">
  //     <div className="max-w-5xl mx-auto space-y-4">
  //       <h1 className="text-2xl md:text-3xl font-bold text-center">{page.title}</h1>
        
  //       {/* Compact Battle Scene */}
  //       <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
  //         <p className="text-gray-300 text-sm md:text-base mb-4 leading-relaxed line-clamp-3">{page.text}</p>
          
  //         {/* Combatants - Horizontal Layout */}
  //         <div className="grid grid-cols-2 gap-3">
  //           {/* Player */}
  //           <div className="bg-gray-900 p-3 rounded-lg border-2 border-blue-500">
  //             <div className="flex items-center gap-2 mb-2">
  //               <Heart className="w-4 h-4 text-red-500" />
  //               <h3 className="text-sm md:text-base font-bold truncate">{player.name}</h3>
  //             </div>
  //             <HPBar current={playerHP} max={player.maxHP} color="bg-green-500" />
  //             {/* <div className="mt-2 text-xs grid grid-cols-3 gap-1">
  //               <div className="text-center">
  //                 <div className="text-gray-500">AC</div>
  //                 <div className="text-orange-400 font-bold">{getModifier(player.athletics) >= 0 ? '+' : ''}{getModifier(player.athletics)}</div>
  //               </div>
  //               <div className="text-center">
  //                 <div className="text-gray-500">Potions</div>
  //                 <div className="text-green-400 font-bold">{potionsRemaining}</div>
  //               </div>
  //             </div> */}
  //           </div>

  //           {/* Enemy */}
  //           <div className="bg-gray-900 p-3 rounded-lg border-2 border-red-500">
  //             <div className="flex items-center gap-2 mb-2">
  //               <Shield className="w-4 h-4 text-yellow-500" />
  //               <h3 className="text-sm md:text-base font-bold truncate">{page.enemy.name}</h3>
  //             </div>
  //             <HPBar current={enemyHP} max={page.enemy.maxHP} color="bg-red-500" />
  //             <div className="mt-2 text-xs grid grid-cols-3 gap-1">
  //               <div className="text-center">
  //                 <div className="text-gray-500">AC</div>
  //                 <div className="text-blue-400 font-bold">{page.enemy.ac}</div>
  //               </div>
  //               <div className="text-center">
  //                 <div className="text-gray-500">ATK</div>
  //                 <div className="text-orange-400 font-bold">+{page.enemy.attack}</div>
  //               </div>
  //               <div className="text-center">
  //                 <div className="text-gray-500">MAG</div>
  //                 <div className="text-purple-400 font-bold">+{page.enemy.magic}</div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Dice Box - Compact */}
  //       <div
  //         id="dice-box"
  //         ref={containerRef}
  //         className="w-full h-32 md:h-40 rounded-lg bg-gray-900 border-2 border-gray-700"
  //       />

  //       {/* Battle Log - Compact */}
  //       <div className="bg-gray-800 rounded-lg p-3 h-32 md:h-40 overflow-y-auto border-2 border-gray-700">
  //         {/* <h3 className="text-sm font-bold mb-2 text-gray-400 sticky top-0 bg-gray-800">Battle Log</h3> */}
  //         <div className="space-y-1">
  //           {gameLog.slice(-5).map((log) => (
  //             <div 
  //               key={log.id}
  //               className={`p-2 rounded text-xs ${
  //                 log.type === 'success' ? 'bg-green-900 text-green-200' :
  //                 log.type === 'fail' ? 'bg-red-900 text-red-200' :
  //                 log.type === 'damage' ? 'bg-orange-900 text-orange-200' :
  //                 log.type === 'heal' ? 'bg-blue-900 text-blue-200' :
  //                 log.type === 'roll' ? 'bg-purple-900 text-purple-200' :
  //                 log.type === 'enemy' ? 'bg-red-800 text-red-100' :
  //                 'bg-gray-700 text-gray-300'
  //               }`}
  //             >
  //               {log.message}
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       {/* Action Buttons - Compact Grid */}
  //       <div className="grid grid-cols-2 gap-2">
  //         <button
  //           onClick={handleAttack}
  //           disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
  //           className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm"
  //         >
  //           <Sword className="w-4 h-4" />
  //           <span className="hidden sm:inline">Attack</span> ({getAttackStat().name})
  //         </button>
          
  //         <button
  //           onClick={handleMagic}
  //           disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
  //           className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm"
  //         >
  //           <Sparkles className="w-4 h-4" />
  //           <span className="hidden sm:inline">Magic</span> ({getSpellcastingStat().name})
  //         </button>
          
  //         {/* <button
  //           onClick={handleItem}
  //           disabled={!isPlayerTurn || battleEnded || selectedAction || potionsRemaining === 0}
  //           className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm"
  //         >
  //           <Package className="w-4 h-4" />
  //           <span className="hidden sm:inline">Item</span> ({potionsRemaining})
  //         </button> */}
          
  //         {/* <button
  //           onClick={handleLeave}
  //           disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
  //           className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm"
  //         >
  //           <DoorOpen className="w-4 h-4" />
  //           <span className="hidden sm:inline">Flee</span> (DEX)
  //         </button> */}
  //       </div>

  //       {/* Turn Indicator */}
  //       <div className="text-center">
  //         {!battleEnded && (
  //           <p className="text-lg md:text-xl font-bold">
  //             {isPlayerTurn ? 'Your Turn' : 'Enemy Turn...'}
  //           </p>
  //         )}
  //         {battleEnded && playerHP > 0 && enemyHP <= 0 && (
  //           <div className="bg-green-900 p-3 rounded-lg">
  //             <p className="text-xl md:text-2xl font-bold text-green-300">Victory!</p>
  //             <p className="text-xs text-gray-400 mt-1">Redirecting...</p>
  //           </div>
  //         )}
  //         {battleEnded && playerHP <= 0 && (
  //           <div className="bg-red-900 p-3 rounded-lg">
  //             <p className="text-xl md:text-2xl font-bold text-red-300">Defeated</p>
  //             <p className="text-xs text-gray-400 mt-1">Redirecting...</p>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default BattleSystem;