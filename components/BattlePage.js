"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sword, Sparkles, Package, Heart, Shield, X, Swords, Target } from 'lucide-react';
import DiceBox from "@3d-dice/dice-box";
import { useRouter } from "next/navigation";
import { updatePlayerHP } from '../lib/hpModifier';
import { getUnlockedEquipment, useConsumable } from '../components/Equipment';
import { awardBreakerPoints, calculateEnemyBP } from '../lib/breakerPointsService';
import { BPNotification } from '../components/BPNotification';
import { motion, AnimatePresence } from 'framer-motion';
import { environmentalActions } from '../lib/environmentalActions';
import { hasUsedEnvironmentalAction, markEnvironmentalActionUsed } from '../lib/environmentalService';
import { recordTookEnvironmentalPotion } from '../lib/progressService';

const BattleSystem = ({ userStats, page, userId, pageId }) => {
  const diceBoxRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  const [gameLog, setGameLog] = useState([]);
  const [playerHP, setPlayerHP] = useState(userStats?.HP || 20);
  const [maxHP, setMaxHP] = useState(userStats?.MaxHP || 20);
  const [enemyHP, setEnemyHP] = useState(page?.enemy?.maxHP || 100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleEnded, setBattleEnded] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  const [equippedWeapon, setEquippedWeapon] = useState(null);
  const [bpResult, setBPResult] = useState(null);
  const [showBPNotification, setShowBPNotification] = useState(false);
  const [environmentalActionUsed, setEnvironmentalActionUsed] = useState(false);
  const [environmentalAction, setEnvironmentalAction] = useState(null);
  const [showAttackMenu, setShowAttackMenu] = useState(false);
  const [showMagicMenu, setShowMagicMenu] = useState(false);
  const [playerStance, setPlayerStance] = useState('normal'); // defensive, normal, aggressive
  const [playerMissNextTurn, setPlayerMissNextTurn] = useState(false);

  useEffect(() => {
    const loadEnvironmental = async () => {
      if (userId && page.environment) {
        const used = await hasUsedEnvironmentalAction(userId, pageId);
        setEnvironmentalActionUsed(used);
        setEnvironmentalAction(environmentalActions[page.environment]);
      }
    };
    loadEnvironmental();
  }, [userId, page.environment, pageId]);

  // Load player inventory
  useEffect(() => {
    const loadInventory = async () => {
      if (userId) {
        const items = await getUnlockedEquipment(userId);
        setInventory(items);
        
        // Auto-equip first weapon
        const weapon = items.find(item => item.type === 'Weapon');
        if (weapon) setEquippedWeapon(weapon);
      }
    };
    loadInventory();
  }, [userId]);

  // Initialize DiceBox
  useEffect(() => {
    if (!containerRef.current) return;

    const dice = new DiceBox("#dice-box", {
      assetPath: "/dice-box-assets/",
      scale: 16,
      size: 6,
      gravity: 11,
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

  const player = {
    name: userStats?.characterName || "My Guy",
    maxHP: maxHP,
    athletics: userStats?.Athletics || 10,
    essence: userStats?.Essence || 10,
    thought: userStats?.Thought || 10,
    fellowship: userStats?.Fellowship || 10,
    AC: 10 + Math.floor(( (userStats?.Athletics || 10) - 10) / 2) + (playerStance === 'defensive' ? 2 : playerStance === 'aggressive' ? -2 : 0)
  };

  const getModifier = (stat) => Math.floor((stat - 10) / 2);

  const getAttackStat = () => {
    return { 
      name: 'ATH', 
      value: player.athletics, 
      mod: getModifier(player.athletics) 
    };
  };

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
      return Math.floor(Math.random() * sides) + 1;
    }
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
    diceBoxRef.current.clear();
    const roll = await diceBoxRef.current.roll(`${diceCount}d${diceSides}`);
    return roll.reduce((sum, die) => sum + die.value, 0);
  };

  const handleAttack = async (attackType = 'normal') => {
    if (isRolling) return;
    
    // Check if player fumbled last turn
    if (playerMissNextTurn) {
      addLog('💫 You are still recovering from your fumble! Turn skipped.', 'fail');
      setPlayerMissNextTurn(false);
      setTimeout(() => {
        setIsPlayerTurn(false);
      }, 1500);
      return;
    }
    
    setSelectedAction('attack');
    setShowAttackMenu(false);

    const attackStat = getAttackStat();
    const weaponBonus = equippedWeapon?.stats?.damage ? parseInt(equippedWeapon.stats.damage.replace(/\D/g, '')) || 0 : 0;
    
    // Light Attack: +2 to hit, -2 damage, 1d6 base damage
    // Normal Attack: standard (1d8)
    // Heavy Attack: -2 to hit, +4 damage, 1d10 base damage
    let hitBonus = 0;
    let damageBonus = 0;
    let damageDice = { count: 1, sides: 8 };
    let attackLabel = "attack";
    
    if (attackType === 'light') {
      hitBonus = 2;
      damageBonus = -2;
      damageDice = { count: 1, sides: 6 };
      attackLabel = "light attack";
    } else if (attackType === 'heavy') {
      hitBonus = -2;
      damageBonus = 4;
      damageDice = { count: 1, sides: 10 };
      attackLabel = "heavy attack";
    }
    
    // Add stance bonuses
    const stanceDamageBonus = playerStance === 'aggressive' ? 2 : 0;
    
    const roll = await rollDice(20);
    
    // Check for fumble (natural 1)
    if (roll === 1) {
      addLog(`💥 FUMBLE! You rolled a natural 1! You lose your next turn.`, 'fail');
      setPlayerMissNextTurn(true);
      setTimeout(() => {
        setIsPlayerTurn(false);
        setSelectedAction(null);
      }, 1500);
      return;
    }
    
    const total = roll + attackStat.mod + weaponBonus + hitBonus;

    addLog(`${attackLabel.toUpperCase()}: You roll ${roll} + ${attackStat.mod} (${attackStat.name}) + ${weaponBonus} (weapon)${hitBonus !== 0 ? ` + ${hitBonus} (${attackType})` : ''} = ${total}`, 'roll');

    if (total >= page.enemy.ac || roll === 20) {
      const baseDamage = await calculateDamage(damageDice.count, damageDice.sides);
      let totalDamage = Math.max(1, baseDamage + attackStat.mod + weaponBonus + damageBonus + stanceDamageBonus);
      
      // Critical hit (natural 20)
      if (roll === 20) {
        totalDamage *= 2;
        addLog(`⭐ CRITICAL HIT! Damage doubled!`, 'success');
      }
      
      setEnemyHP(prev => Math.max(0, prev - totalDamage));
      addLog(`Hit! ${attackLabel} deals ${totalDamage} damage${equippedWeapon ? ` with ${equippedWeapon.name}` : ''}!`, 'success');
    } else {
      addLog(`Miss! Your ${attackLabel} fails to connect.`, 'fail');
    }

    setTimeout(() => {
      setIsPlayerTurn(false);
      setSelectedAction(null);
    }, 1500);
  };

  const handleMagic = async (spellType = 'normal') => {
    if (isRolling) return;
    
    // Check if player fumbled last turn
    if (playerMissNextTurn) {
      addLog('💫 You are still recovering from your fumble! Turn skipped.', 'fail');
      setPlayerMissNextTurn(false);
      setTimeout(() => {
        setIsPlayerTurn(false);
      }, 1500);
      return;
    }
    
    setSelectedAction('magic');
    setShowMagicMenu(false);

    const spellStat = getSpellcastingStat();
    
    // Light Spell: +2 to hit, -1 damage, 2d4
    // Normal Spell: standard (2d6)
    // Heavy Spell: -2 to hit, +3 damage, 3d6
    let hitBonus = 0;
    let damageBonus = 0;
    let damageDice = { count: 2, sides: 6 };
    let spellLabel = "spell";
    
    if (spellType === 'light') {
      hitBonus = 2;
      damageBonus = -1;
      damageDice = { count: 2, sides: 4 };
      spellLabel = "minor spell";
    } else if (spellType === 'heavy') {
      hitBonus = -2;
      damageBonus = 3;
      damageDice = { count: 3, sides: 6 };
      spellLabel = "powerful spell";
    }
    
    // Add stance bonuses
    const stanceDamageBonus = playerStance === 'aggressive' ? 2 : 0;
    
    const roll = await rollDice(20);
    
    // Check for fumble (natural 1)
    if (roll === 1) {
      addLog(`💥 FUMBLE! You rolled a natural 1! You lose your next turn.`, 'fail');
      setPlayerMissNextTurn(true);
      setTimeout(() => {
        setIsPlayerTurn(false);
        setSelectedAction(null);
      }, 1500);
      return;
    }
    
    const total = roll + spellStat.mod + hitBonus;

    addLog(`${spellLabel.toUpperCase()}: You roll ${roll} + ${spellStat.mod} (${spellStat.name})${hitBonus !== 0 ? ` + ${hitBonus} (${spellType})` : ''} = ${total}`, 'roll');

    if (total >= page.enemy.ac || roll === 20) {
      const baseDamage = await calculateDamage(damageDice.count, damageDice.sides);
      let totalDamage = Math.max(1, baseDamage + spellStat.mod + damageBonus + stanceDamageBonus);
      
      // Critical hit (natural 20)
      if (roll === 20) {
        totalDamage *= 2;
        addLog(`⭐ CRITICAL HIT! Damage doubled!`, 'success');
      }
      
      setEnemyHP(prev => Math.max(0, prev - totalDamage));
      addLog(`Success! Your ${spellLabel} strikes for ${totalDamage} magical damage!`, 'success');
    } else {
      addLog(`Miss! The ${spellLabel} fizzles out.`, 'fail');
    }

    setTimeout(() => {
      setIsPlayerTurn(false);
      setSelectedAction(null);
    }, 1500);
  };

  const handleEnvironmental = async () => {
    if (isRolling || !environmentalAction) return;
    
    // Check if player fumbled last turn
    if (playerMissNextTurn) {
      addLog('💫 You are still recovering from your fumble! Turn skipped.', 'fail');
      setPlayerMissNextTurn(false);
      setTimeout(() => {
        setIsPlayerTurn(false);
      }, 1500);
      return;
    }
    
    setSelectedAction('environmental');

    const stat = userStats[environmentalAction.stat] || 10;
    const mod = getModifier(stat);
    const roll = await rollDice(20);
    
    // Check for fumble
    if (roll === 1) {
      addLog(`💥 FUMBLE! Your environmental attack backfires! You lose your next turn.`, 'fail');
      setPlayerMissNextTurn(true);
      await markEnvironmentalActionUsed(userId, pageId);
      setEnvironmentalActionUsed(true);
      setTimeout(() => {
        setIsPlayerTurn(false);
        setSelectedAction(null);
      }, 1500);
      return;
    }
    
    const total = roll + mod;

    addLog(`You attempt ${environmentalAction.name}! Roll: ${roll} + ${mod} = ${total}`, 'roll');

    if (total >= environmentalAction.dc || roll === 20) {
      let damage = await calculateDamage(
        environmentalAction.damage.dice,
        environmentalAction.damage.sides
      );
      
      // Critical hit
      if (roll === 20) {
        damage *= 2;
        addLog(`⭐ CRITICAL HIT! Environmental damage doubled!`, 'success');
      }
      
      setEnemyHP(prev => Math.max(0, prev - damage));
      addLog(`Success! ${environmentalAction.name} deals ${damage} damage!`, 'success');
      if (environmentalAction.effect) {
        addLog(environmentalAction.effect, 'success');
      }
    } else {
      addLog(`Failed! ${environmentalAction.name} misses!`, 'fail');
    }

    // Mark as used
    await markEnvironmentalActionUsed(userId, pageId);
    setEnvironmentalActionUsed(true);

    setTimeout(() => {
      setIsPlayerTurn(false);
      setSelectedAction(null);
    }, 1500);
  };

  const handleUseItem = async (item) => {
    if (!userId) return;
    
    setSelectedAction('item');
    setShowInventory(false);

    if (item.type === 'Consumable') {
      if (item.id === 'health_potion') {
        const healAmount = 10;
        const newHP = Math.min(playerHP + healAmount, maxHP + 10);
        const newMaxHP = Math.max(maxHP, newHP);
        
        setPlayerHP(newHP);
        setMaxHP(newMaxHP);
        
        addLog(`You use ${item.name} and restore ${healAmount} HP!`, 'heal');
        
        // Remove from inventory
        const result = await useConsumable(userId, item.id);
        if (result.success && result.consumed) {
          setInventory(prev => prev.filter(i => i.id !== item.id));
        }
      } else if (item.id === 'environment_potion') {
        await recordTookEnvironmentalPotion(userId);
      
        addLog(`You drink the ${item.name}. Environmental effects negated!`, 'heal');
      
        // Remove from inventory
        const result = await useConsumable(userId, item.id);
        if (result.success && result.consumed) {
          setInventory(prev => prev.filter(i => i.id !== item.id));
        }
      }
    } else if (item.type === 'Weapon') {
      setEquippedWeapon(item);
      addLog(`You equipped ${item.name}!`, 'success');
    }

    setTimeout(() => {
      setIsPlayerTurn(false);
      setSelectedAction(null);
    }, 1500);
  };

  // Enemy turn
  useEffect(() => {
    if (!isPlayerTurn && !battleEnded && enemyHP > 0 && !isRolling) {
      const enemyTurnAsync = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const enemyAction = Math.random() > 0.5 ? 'attack' : 'magic';
        const roll = await rollDice(20);
        
        if (enemyAction === 'attack') {
          const total = roll + (page.enemy.attack || 0);
          addLog(`${page.enemy.name} rolls ${roll} + ${page.enemy.attack} = ${total}!`, 'enemy');
          
          const playerAC = player.AC;
          
          if (total >= playerAC || roll === 20) {
            let damage = await calculateDamage(1, 6) + (page.enemy.attack || 0);
            
            if (roll === 20) {
              damage *= 2;
              addLog(`💀 Enemy CRITICAL HIT!`, 'damage');
            }
            
            setPlayerHP(prev => Math.max(0, prev - damage));
            addLog(`${page.enemy.name} hits you for ${damage} damage!`, 'damage');
          } else {
            addLog(`${page.enemy.name}'s attack misses!`, 'success');
          }
        } else {
          const total = roll + (page.enemy.magic || 0);
          addLog(`${page.enemy.name} casts a spell! ${total}`, 'enemy');
          
          const playerAC = player.AC;
          
          if (total >= playerAC || roll === 20) {
            let damage = await calculateDamage(1, 8) + (page.enemy.magic || 0);
            
            if (roll === 20) {
              damage *= 2;
              addLog(`💀 Enemy CRITICAL HIT!`, 'damage');
            }
            
            setPlayerHP(prev => Math.max(0, prev - damage));
            addLog(`Spell hits for ${damage} damage!`, 'damage');
          } else {
            addLog(`Spell misses!`, 'success');
          }
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsPlayerTurn(true);
      };

      enemyTurnAsync();
    }
  }, [isPlayerTurn, battleEnded, enemyHP, isRolling, page.enemy, player.AC]);

  // Save HP and check battle end
  useEffect(() => {
    const saveAndCheck = async () => {
      // Save HP to Firestore
      if (userId) {
        await updatePlayerHP(userId, playerHP, maxHP);
      }

      // Check battle end
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
        
        // Define result here so it's scoped for the timeout
        let result = null;

        // Award Breaker Points
        if (userId) {
          const bpAmount = calculateEnemyBP(page.enemy);
          result = await awardBreakerPoints(userId, bpAmount, `defeated ${page.enemy.name}`);
          
          if (result) {
            setBPResult(result);
            setShowBPNotification(true);
            
            // Auto-hide BP notification after 6 seconds (or 10 if leveled up)
            setTimeout(() => {
              setShowBPNotification(false);
            }, result.leveledUp ? 10000 : 6000);
          }
        }
        
        setTimeout(() => {
          if (page.next) {
            router.push(`/adventure/${page.next}`);
          }
        }, result?.leveledUp ? 12000 : 8000); // Longer delay if leveled up
      }
    };

    saveAndCheck();
  }, [playerHP, enemyHP, battleEnded, userId, maxHP, page, router]);

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

  const consumables = inventory.filter(item => item.type === 'Consumable');
  const weapons = inventory.filter(item => item.type === 'Weapon');

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-6 md:p-12 lg:p-16 pointer-events-none">
      <div className="display w-full max-w-md md:max-w-4xl max-h-full flex flex-col bg-slate-950/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden pointer-events-auto">
        
        {/* Header */}
        <header className="bg-slate-900/50 border-b border-slate-700/50 p-3 shrink-0 flex justify-between items-center">
          <h1 className="text-lg font-bold text-slate-100 shadow-black drop-shadow-md">{page.title}</h1>
          <div className="flex items-center gap-2">
            {/* Stance Indicator */}
            <div className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
              playerStance === 'defensive' ? 'bg-blue-900/60 border-blue-500 text-blue-200' :
              playerStance === 'aggressive' ? 'bg-red-900/60 border-red-500 text-red-200' :
              'bg-gray-900/60 border-gray-500 text-gray-200'
            }`}>
              {playerStance === 'defensive' ? 'DEF' : playerStance === 'aggressive' ? 'AGG' : 'NOR'}
            </div>
            <div className={`px-3 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
              battleEnded 
                ? (playerHP > 0 ? "bg-green-900/60 border-green-600 text-green-200" : "bg-red-900/60 border-red-600 text-red-200")
                : (isPlayerTurn ? "bg-blue-900/60 border-blue-500 text-blue-200 animate-pulse" : "bg-orange-900/60 border-orange-500 text-orange-200")
            }`}>
              {battleEnded ? (playerHP > 0 ? "Victory" : "Defeat") : (isPlayerTurn ? "Your Turn" : "Enemy Turn")}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-3">
            {/* Combatants */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/60 p-2.5 border border-blue-500/30">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-blue-100">
                    <Heart className="w-3.5 h-3.5 text-red-600" /> {player.name}
                  </div>
                  <span className="text-[10px] text-slate-400">AC: {player.AC}</span>
                </div>
                <HPBar current={playerHP} max={maxHP} color="bg-green-600" />
                {equippedWeapon && (
                  <div className="mt-1 text-[10px] text-green-400">
                    ⚔️ {equippedWeapon.name}
                  </div>
                )}
              </div>
              
              <div className="bg-slate-900/60 p-2.5 border border-red-600/30">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-red-100">
                    <Shield className="w-3.5 h-3.5 text-yellow-500" /> {page.enemy.name}
                  </div>
                  <div className="text-[10px] text-slate-400">AC: {page.enemy.ac}</div>
                </div>
                <HPBar current={enemyHP} max={page.enemy.maxHP} color="bg-red-600" />
              </div>
            </div>

            {/* Dice Tray */}
            <div className="h-32 md:h-48 w-full bg-slate-900/40 border-2 border-dashed border-slate-700/50 relative">
              <div id="dice-box" ref={containerRef} className="w-full h-full" />
            </div>

            {/* Stance Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPlayerStance('defensive')}
                disabled={!isPlayerTurn || battleEnded}
                className={`px-2 py-1.5 text-xs font-bold transition-all ${
                  playerStance === 'defensive' 
                    ? 'bg-blue-600 text-white border-2 border-blue-400' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                } disabled:opacity-50`}
              >
                Defensive
                <div className="text-[9px] opacity-75">+2 AC, -2 DMG</div>
              </button>
              <button
                onClick={() => setPlayerStance('normal')}
                disabled={!isPlayerTurn || battleEnded}
                className={`px-2 py-1.5 text-xs font-bold transition-all ${
                  playerStance === 'normal' 
                    ? 'bg-gray-600 text-white border-2 border-gray-400' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                } disabled:opacity-50`}
              >
                Normal
                <div className="text-[9px] opacity-75">Balanced</div>
              </button>
              <button
                onClick={() => setPlayerStance('aggressive')}
                disabled={!isPlayerTurn || battleEnded}
                className={`px-2 py-1.5 text-xs font-bold transition-all ${
                  playerStance === 'aggressive' 
                    ? 'bg-red-600 text-white border-2 border-red-400' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                } disabled:opacity-50`}
              >
                Aggressive
                <div className="text-[9px] opacity-75">-2 AC, +2 DMG</div>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-3 min-h-0">
            <div className="bg-slate-800/30 p-2 text-sm text-slate-300 border border-white/5">
              <p className="line-clamp-3 md:line-clamp-none">{page.text}</p>
            </div>

            {/* Battle Log */}
            <div className="battle-log flex-1 min-h-[100px] md:min-h-0 bg-black/40 border border-slate-700/50 p-2 flex flex-col relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider sticky top-0">Log</span>
              <div className="overflow-y-auto space-y-1 pr-1">
                {gameLog.slice().reverse().map((log) => (
                  <div key={log.id} className={`text-[11px] p-1.5 ${
                    log.type === 'success' ? 'text-green-300 bg-green-900/20' :
                    log.type === 'fail' ? 'text-red-300 bg-red-900/20' :
                    log.type === 'damage' ? 'text-orange-300 bg-orange-900/20' :
                    log.type === 'heal' ? 'text-blue-300 bg-blue-900/20' :
                    log.type === 'enemy' ? 'text-yellow-300 bg-yellow-900/20' :
                    log.type === 'roll' ? 'text-purple-300 bg-purple-900/20' :
                    'text-slate-400'
                  }`}>
                    {log.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className={`p-3 bg-slate-900/80 border-t border-slate-700/50 grid ${environmentalAction && !environmentalActionUsed ? 'grid-cols-4' : 'grid-cols-3'} gap-2 shrink-0`}>
          
          {/* Attack Button with Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAttackMenu(!showAttackMenu)}
              disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
              className="w-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-3 font-bold shadow-lg border-b-4 border-red-900 active:border-b-0 active:scale-95 transition-all"
            >
              <Sword className="w-4 h-4 mb-1" />
              <span className="text-xs">ATTACK</span>
              <span className="text-[9px] opacity-70">{getAttackStat().name}</span>
            </button>
            
            {showAttackMenu && isPlayerTurn && !battleEnded && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 border-2 border-orange-500 overflow-hidden shadow-xl z-10">
                <button
                  onClick={() => handleAttack('light')}
                  className="w-full px-2 py-3 text-left hover:bg-orange-900/50 transition-colors border-b border-slate-700"
                >
                  <div className="text-xs font-bold text-green-300">Light</div>
                  {/* <div className="text-[10px] text-gray-400">+2 to hit, -2 dmg, 1d6</div> */}
                </button>
                <button
                  onClick={() => handleAttack('normal')}
                  className="w-full px-2 py-3 text-left hover:bg-orange-900/50 transition-colors border-b border-slate-700"
                >
                  <div className="text-xs font-bold text-white">Normal</div>
                  {/* <div className="text-[10px] text-gray-400">Standard, 1d8</div> */}
                </button>
                <button
                  onClick={() => handleAttack('heavy')}
                  className="w-full px-2 py-3 text-left hover:bg-orange-900/50 transition-colors"
                >
                  <div className="text-xs font-bold text-red-300">Heavy</div>
                  {/* <div className="text-[10px] text-gray-400">-2 to hit, +4 dmg, 1d10</div> */}
                </button>
              </div>
            )}
          </div>

          {/* Magic Button with Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMagicMenu(!showMagicMenu)}
              disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
              className="w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-3 font-bold shadow-lg border-b-4 border-purple-900 active:border-b-0 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 mb-1" />
              <span className="text-xs">MAGIC</span>
              <span className="text-[9px] opacity-70">{getSpellcastingStat().name}</span>
            </button>
            
            {showMagicMenu && isPlayerTurn && !battleEnded && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 border-2 border-purple-500 overflow-hidden shadow-xl z-10">
                <button
                  onClick={() => handleMagic('light')}
                  className="w-full px-2 py-3 text-left hover:bg-purple-900/50 transition-colors border-b border-slate-700"
                >
                  <div className="text-xs font-bold text-cyan-300">Minor</div>
                  {/* <div className="text-[10px] text-gray-400">+2 to hit, -1 dmg, 2d4</div> */}
                </button>
                <button
                  onClick={() => handleMagic('normal')}
                  className="w-full px-2 py-3 text-left hover:bg-purple-900/50 transition-colors border-b border-slate-700"
                >
                  <div className="text-xs font-bold text-white">Standard</div>
                  {/* <div className="text-[10px] text-gray-400">Normal power, 2d6</div> */}
                </button>
                <button
                  onClick={() => handleMagic('heavy')}
                  className="w-full px-2 py-3 text-left hover:bg-purple-900/50 transition-colors"
                >
                  <div className="text-xs font-bold text-purple-300">Powerful</div>
                  {/* <div className="text-[10px] text-gray-400">-2 to hit, +3 dmg, 3d6</div> */}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowInventory(true)}
            disabled={!isPlayerTurn || battleEnded || selectedAction || consumables.length === 0}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-3 font-bold shadow-lg border-b-4 border-green-900 active:border-b-0 active:scale-95 transition-all"
          >
            <Package className="w-4 h-4 mb-1" />
            <span className="text-xs">ITEMS</span>
            <span className="text-[9px] opacity-70">({consumables.length})</span>
          </button>

          {environmentalAction && !environmentalActionUsed && (
            <button
              onClick={handleEnvironmental}
              disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
              className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-2 font-bold shadow-lg border-b-4 border-emerald-900 active:border-b-0 active:scale-95 transition-all"
              title={environmentalAction.description}
            >
              <span className="text-2xl mb-1">{environmentalAction.icon}</span>
              <span className="text-xs">{environmentalAction.name.toUpperCase()}</span>
              <span className="text-[9px] opacity-70">{environmentalAction.stat.slice(0, 3).toUpperCase()}</span>
            </button>
          )}
        </div>
      </div>

      {/* Inventory Modal */}
      <AnimatePresence>
        {showInventory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 pointer-events-auto"
            onClick={() => setShowInventory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Use Item</h3>
                <button onClick={() => setShowInventory(false)}>
                  <X className="text-gray-400 hover:text-white" size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {consumables.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No items available</p>
                )}
                
                {consumables.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleUseItem(item)}
                    className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className="text-green-400" size={20} />}
                      <div className="flex-1">
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                      </div>
                    </div>
                  </button>
                ))}

                {weapons.length > 0 && (
                  <>
                    <div className="text-sm font-bold text-gray-400 mt-4 mb-2">Weapons</div>
                    {weapons.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleUseItem(item)}
                        className={`w-full text-left p-3 rounded border transition-colors ${
                          equippedWeapon?.id === item.id
                            ? 'bg-blue-900/50 border-blue-500'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon && <item.icon className="text-orange-400" size={20} />}
                          <div className="flex-1">
                            <div className="font-bold text-white">
                              {item.name}
                              {equippedWeapon?.id === item.id && <span className="text-xs ml-2 text-blue-400">✓ Equipped</span>}
                            </div>
                            <div className="text-xs text-gray-400">{item.stats?.damage || '+0'} damage</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BP Notification */}
      <AnimatePresence>
        {showBPNotification && bpResult && (
          <BPNotification
            result={bpResult}
            onClose={() => setShowBPNotification(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleSystem;










// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { Sword, Sparkles, Package, Heart, Shield, X } from 'lucide-react';
// import DiceBox from "@3d-dice/dice-box";
// import { useRouter } from "next/navigation";
// import { updatePlayerHP } from '../lib/hpModifier';
// import { getUnlockedEquipment, useConsumable } from '../components/Equipment';
// import { awardBreakerPoints, calculateEnemyBP } from '../lib/breakerPointsService';
// import { BPNotification } from '../components/BPNotification';
// import { motion, AnimatePresence } from 'framer-motion';
// import { environmentalActions } from '../lib/environmentalActions';
// import { hasUsedEnvironmentalAction, markEnvironmentalActionUsed } from '../lib/environmentalService';

// const BattleSystem = ({ userStats, page, userId, pageId }) => {
//   const diceBoxRef = useRef(null);
//   const containerRef = useRef(null);
//   const router = useRouter();

//   const [gameLog, setGameLog] = useState([]);
//   const [playerHP, setPlayerHP] = useState(userStats?.HP || 20);
//   const [maxHP, setMaxHP] = useState(userStats?.MaxHP || 20);
//   const [enemyHP, setEnemyHP] = useState(page?.enemy?.maxHP || 100);
//   const [isPlayerTurn, setIsPlayerTurn] = useState(true);
//   const [battleEnded, setBattleEnded] = useState(false);
//   const [selectedAction, setSelectedAction] = useState(null);
//   const [isRolling, setIsRolling] = useState(false);
//   const [inventory, setInventory] = useState([]);
//   const [showInventory, setShowInventory] = useState(false);
//   const [equippedWeapon, setEquippedWeapon] = useState(null);
//   const [bpResult, setBPResult] = useState(null);
//   const [showBPNotification, setShowBPNotification] = useState(false);
//   const [environmentalActionUsed, setEnvironmentalActionUsed] = useState(false);
//   const [environmentalAction, setEnvironmentalAction] = useState(null);

//   useEffect(() => {
//     const loadEnvironmental = async () => {
//       if (userId && page.environment) {
//         const used = await hasUsedEnvironmentalAction(userId, pageId);
//         setEnvironmentalActionUsed(used);
//         setEnvironmentalAction(environmentalActions[page.environment]);
//       }
//     };
//     loadEnvironmental();
//   }, [userId, page.environment]);

//   const handleEnvironmental = async () => {
//     if (isRolling || !environmentalAction) return;
//     setSelectedAction('environmental');

//     const stat = userStats[environmentalAction.stat] || 10;
//     const mod = getModifier(stat);
//     const roll = await rollDice(20);
//     const total = roll + mod;

//     addLog(`You attempt ${environmentalAction.name}! Roll: ${roll} + ${mod} = ${total}`, 'roll');

//     if (total >= environmentalAction.dc) {
//       const damage = await calculateDamage(
//         environmentalAction.damage.dice,
//         environmentalAction.damage.sides
//       );
//       setEnemyHP(prev => Math.max(0, prev - damage));
//       addLog(`Success! ${environmentalAction.name} deals ${damage} damage!`, 'success');
//       if (environmentalAction.effect) {
//         addLog(environmentalAction.effect, 'success');
//       }
//     } else {
//       addLog(`Failed! ${environmentalAction.name} misses!`, 'fail');
//     }

//     // Mark as used
//     await markEnvironmentalActionUsed(userId, pageId);
//     setEnvironmentalActionUsed(true);

//     setTimeout(() => {
//       setIsPlayerTurn(false);
//       setSelectedAction(null);
//     }, 1500);
//   };

//   // Load player inventory
//   useEffect(() => {
//     const loadInventory = async () => {
//       if (userId) {
//         const items = await getUnlockedEquipment(userId);
//         setInventory(items);
        
//         // Auto-equip first weapon
//         const weapon = items.find(item => item.type === 'Weapon');
//         if (weapon) setEquippedWeapon(weapon);
//       }
//     };
//     loadInventory();
//   }, [userId]);

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
//       console.log("🎲 DiceBox ready for battle");
//     }).catch(err => console.error("Dice init error:", err));
//   }, []);

//   const player = {
//     name: userStats?.characterName || "My Guy",
//     maxHP: maxHP,
//     athletics: userStats?.Athletics || 10,
//     essence: userStats?.Essence || 10,
//     thought: userStats?.Thought || 10,
//     fellowship: userStats?.Fellowship || 10,
//     AC: 10 + Math.floor(( (userStats?.Athletics || 10) - 10) / 2)
//   };

//   const getModifier = (stat) => Math.floor((stat - 10) / 2);

//   const getAttackStat = () => {
//     return { 
//       name: 'ATH', 
//       value: player.athletics, 
//       mod: getModifier(player.athletics) 
//     };
//   };

//   const getSpellcastingStat = () => {
//     const stats = [
//       { name: 'THO', value: player.thought, mod: getModifier(player.thought) },
//       { name: 'ESS', value: player.essence, mod: getModifier(player.essence) },
//       { name: 'FEL', value: player.fellowship, mod: getModifier(player.fellowship) }
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
//     if (isRolling) return;
//     setSelectedAction('attack');

//     const attackStat = getAttackStat();
//     const weaponBonus = equippedWeapon?.stats?.damage ? parseInt(equippedWeapon.stats.damage.replace(/\D/g, '')) || 0 : 0;
//     const roll = await rollDice(20);
//     const total = roll + attackStat.mod + weaponBonus;

//     addLog(`You roll ${roll} + ${attackStat.mod} (${attackStat.name}) + ${weaponBonus} (weapon) = ${total}`, 'roll');

//     if (total >= page.enemy.ac) {
//       const baseDamage = await calculateDamage(1, 8);
//       const totalDamage = baseDamage + attackStat.mod + weaponBonus;
//       setEnemyHP(prev => Math.max(0, prev - totalDamage));
//       addLog(`Hit! You deal ${totalDamage} damage${equippedWeapon ? ` with ${equippedWeapon.name}` : ''}!`, 'success');
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

//     addLog(`You roll ${roll} + ${spellStat.mod} (${spellStat.name}) = ${total} for magic!`, 'roll');

//     if (total >= page.enemy.ac) {
//       const damage = await calculateDamage(2, 6) + spellStat.mod;
//       setEnemyHP(prev => Math.max(0, prev - damage));
//       addLog(`Success! Your spell strikes for ${damage} magical damage!`, 'success');
//     } else {
//       addLog('Miss! The spell fizzles out.', 'fail');
//     }

//     setTimeout(() => {
//       setIsPlayerTurn(false);
//       setSelectedAction(null);
//     }, 1500);
//   };

//   const handleUseItem = async (item) => {
//     if (!userId) return;
    
//     setSelectedAction('item');
//     setShowInventory(false);

//     if (item.type === 'Consumable') {
//       if (item.id === 'health_potion') {
//         const healAmount = 10;
//         const newHP = Math.min(playerHP + healAmount, maxHP + 10);
//         const newMaxHP = Math.max(maxHP, newHP);
        
//         setPlayerHP(newHP);
//         setMaxHP(newMaxHP);
        
//         addLog(`You use ${item.name} and restore ${healAmount} HP!`, 'heal');
        
//         // Remove from inventory
//         const result = await useConsumable(userId, item.id);
//         if (result.success && result.consumed) {
//           setInventory(prev => prev.filter(i => i.id !== item.id));
//         }
//       } else if (item.id === 'environment_potion') {
//         await recordTookEnvironmentalPotion(userId);
      
//         addLog(`You drink the ${item.name}. Environmental effects negated!`, 'heal');
      
//         // Remove from inventory
//         const result = await useConsumable(userId, item.id);
//         if (result.success && result.consumed) {
//           setInventory(prev => prev.filter(i => i.id !== item.id));
//         }
//       }
//     } else if (item.type === 'Weapon') {
//       setEquippedWeapon(item);
//       addLog(`You equipped ${item.name}!`, 'success');
//     }

//     setTimeout(() => {
//       setIsPlayerTurn(false);
//       setSelectedAction(null);
//     }, 1500);
//   };

//   // Enemy turn
//   useEffect(() => {
//     if (!isPlayerTurn && !battleEnded && enemyHP > 0 && !isRolling) {
//       const enemyTurnAsync = async () => {
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         const enemyAction = Math.random() > 0.5 ? 'attack' : 'magic';
//         const roll = await rollDice(20);
        
//         if (enemyAction === 'attack') {
//           const total = roll + (page.enemy.attack || 0);
//           addLog(`${page.enemy.name} rolls ${roll} + ${page.enemy.attack} = ${total}!`, 'enemy');
          
//           const playerAC = 10 + getModifier(player.athletics);
          
//           if (total >= playerAC) {
//             const damage = await calculateDamage(1, 6) + (page.enemy.attack || 0);
//             setPlayerHP(prev => Math.max(0, prev - damage));
//             addLog(`${page.enemy.name} hits you for ${damage} damage!`, 'damage');
//           } else {
//             addLog(`${page.enemy.name}'s attack misses!`, 'success');
//           }
//         } else {
//           const total = roll + (page.enemy.magic || 0);
//           addLog(`${page.enemy.name} casts a spell! ${total}`, 'enemy');
          
//           const playerAC = 10 + getModifier(player.athletics);
          
//           if (total >= playerAC) {
//             const damage = await calculateDamage(1, 8) + (page.enemy.magic || 0);
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

//   // Save HP and check battle end
//   useEffect(() => {
//     const saveAndCheck = async () => {
//       // Save HP to Firestore
//       if (userId) {
//         await updatePlayerHP(userId, playerHP, maxHP);
//       }

//       // Check battle end
//       if (playerHP <= 0 && !battleEnded) {
//         addLog('You have been defeated...', 'fail');
//         setBattleEnded(true);
        
//         setTimeout(() => {
//           if (page.fail) {
//             router.push(`/adventure/${page.fail}`);
//           }
//         }, 3000);
//       } else if (enemyHP <= 0 && !battleEnded) {
//         addLog('Victory! You defeated the enemy!', 'success');
//         setBattleEnded(true);
        
//         // Define result here so it's scoped for the timeout
//         let result = null;

//         // Award Breaker Points
//         if (userId) {
//           const bpAmount = calculateEnemyBP(page.enemy);
//           result = await awardBreakerPoints(userId, bpAmount, `defeated ${page.enemy.name}`);
          
//           if (result) {
//             setBPResult(result);
//             setShowBPNotification(true);
            
//             // Auto-hide BP notification after 6 seconds (or 10 if leveled up)
//             setTimeout(() => {
//               setShowBPNotification(false);
//             }, result.leveledUp ? 10000 : 6000);
//           }
//         }
        
//         setTimeout(() => {
//           if (page.next) {
//             router.push(`/adventure/${page.next}`);
//           }
//         }, result?.leveledUp ? 12000 : 8000); // Longer delay if leveled up
//       }
//     };

//     saveAndCheck();
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

//   const consumables = inventory.filter(item => item.type === 'Consumable');
//   const weapons = inventory.filter(item => item.type === 'Weapon');

//   return (
//     <div className="fixed inset-0 z-10 flex items-center justify-center p-6 md:p-12 lg:p-16 pointer-events-none">
//       <div className="display w-full max-w-md md:max-w-4xl max-h-full flex flex-col bg-slate-950/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden pointer-events-auto">
        
//         {/* Header */}
//         <header className="bg-slate-900/50 border-b border-slate-700/50 p-3 shrink-0 flex justify-between items-center">
//           <h1 className="text-lg font-bold text-slate-100 shadow-black drop-shadow-md">{page.title}</h1>
//           <div className={`px-3 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
//             battleEnded 
//               ? (playerHP > 0 ? "bg-green-900/60 border-green-600 text-green-200" : "bg-red-900/60 border-red-600 text-red-200")
//               : (isPlayerTurn ? "bg-blue-900/60 border-blue-500 text-blue-200 animate-pulse" : "bg-orange-900/60 border-orange-500 text-orange-200")
//           }`}>
//             {battleEnded ? (playerHP > 0 ? "Victory" : "Defeat") : (isPlayerTurn ? "Your Turn" : "Enemy Turn")}
//           </div>
//         </header>

//         {/* Main Content */}
//         <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          
//           {/* LEFT COLUMN */}
//           <div className="flex flex-col gap-3">
//             {/* Combatants */}
//             <div className="grid grid-cols-2 gap-3">
//               <div className="bg-slate-900/60 p-2.5 border border-blue-500/30">
//                 <div className="flex justify-between items-center mb-1">
//                   <div className="flex items-center gap-1.5 font-bold text-sm text-blue-100">
//                     <Heart className="w-3.5 h-3.5 text-red-600" /> {player.name}
//                   </div>
//                   <span className="text-[10px] text-slate-400">AC: {player.AC}</span>
//                 </div>
//                 <HPBar current={playerHP} max={maxHP} color="bg-green-600" />
//                 {equippedWeapon && (
//                   <div className="mt-1 text-[10px] text-green-400">
//                     ⚔️ {equippedWeapon.name}
//                   </div>
//                 )}
//               </div>
              
//               <div className="bg-slate-900/60 p-2.5 border border-red-600/30">
//                 <div className="flex justify-between items-center mb-1">
//                   <div className="flex items-center gap-1.5 font-bold text-sm text-red-100">
//                     <Shield className="w-3.5 h-3.5 text-yellow-500" /> {page.enemy.name}
//                   </div>
//                   <div className="text-[10px] text-slate-400">AC: {page.enemy.ac}</div>
//                 </div>
//                 <HPBar current={enemyHP} max={page.enemy.maxHP} color="bg-red-600" />
//               </div>
//             </div>

//             {/* Dice Tray */}
//             <div className="h-32 md:h-48 w-full bg-slate-900/40 border-2 border-dashed border-slate-700/50 relative">
//               <div id="dice-box" ref={containerRef} className="w-full h-full" />
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="flex flex-col gap-3 min-h-0">
//             <div className="bg-slate-800/30 p-2 text-sm text-slate-300 border border-white/5">
//               <p className="line-clamp-3 md:line-clamp-none">{page.text}</p>
//             </div>

//             {/* Battle Log */}
//             <div className="battle-log flex-1 min-h-[100px] md:min-h-0 bg-black/40 border border-slate-700/50 p-2 flex flex-col relative overflow-hidden">
//               <span className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider sticky top-0">Log</span>
//               <div className="overflow-y-auto space-y-1 pr-1">
//                 {gameLog.slice().reverse().map((log) => (
//                   <div key={log.id} className={`text-[11px] p-1.5 ${
//                     log.type === 'success' ? 'text-green-300 bg-green-900/20' :
//                     log.type === 'fail' ? 'text-red-300 bg-red-900/20' :
//                     log.type === 'damage' ? 'text-orange-300 bg-orange-900/20' :
//                     log.type === 'heal' ? 'text-blue-300 bg-blue-900/20' :
//                     'text-slate-400'
//                   }`}>
//                     {log.message}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Buttons */}
//         {/* <div className="p-3 bg-slate-900/80 border-t border-slate-700/50 grid grid-cols-3 gap-3 shrink-0"> */}
//         <div className={`p-3 bg-slate-900/80 border-t border-slate-700/50 grid ${environmentalAction && !environmentalActionUsed ? 'grid-cols-4' : 'grid-cols-3'} gap-3 shrink-0`}>
//           <button
//             onClick={handleAttack}
//             disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//             className="flex flex-col items-center justify-center bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-3 font-bold shadow-lg border-b-4 border-red-900 active:border-b-0 active:scale-95 transition-all"
//           >
//             <Sword className="w-4 h-4 mb-1" />
//             <span className="text-xs">ATTACK</span>
//             <span className="text-[9px] opacity-70">{getAttackStat().name}</span>
//           </button>

//           <button
//             onClick={handleMagic}
//             disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//             className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-3 font-bold shadow-lg border-b-4 border-purple-900 active:border-b-0 active:scale-95 transition-all"
//           >
//             <Sparkles className="w-4 h-4 mb-1" />
//             <span className="text-xs">MAGIC</span>
//             <span className="text-[9px] opacity-70">{getSpellcastingStat().name}</span>
//           </button>

//           <button
//             onClick={() => setShowInventory(true)}
//             disabled={!isPlayerTurn || battleEnded || selectedAction || consumables.length === 0}
//             className="flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-3 font-bold shadow-lg border-b-4 border-green-900 active:border-b-0 active:scale-95 transition-all"
//           >
//             <Package className="w-4 h-4 mb-1" />
//             <span className="text-xs">ITEMS</span>
//             <span className="text-[9px] opacity-70">({consumables.length})</span>
//           </button>

//           {environmentalAction && !environmentalActionUsed && (
//             <button
//               onClick={handleEnvironmental}
//               disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//               className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-3 font-bold shadow-lg border-b-4 border-emerald-900 active:border-b-0 active:scale-95 transition-all"
//               title={environmentalAction.description}
//             >
//               <span className="text-2xl mb-1">{environmentalAction.icon}</span>
//               <span className="text-xs">{environmentalAction.name.toUpperCase()}</span>
//               <span className="text-[9px] opacity-70">{environmentalAction.stat.slice(0, 3).toUpperCase()}</span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Inventory Modal */}
//       <AnimatePresence>
//         {showInventory && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 pointer-events-auto"
//             onClick={() => setShowInventory(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4 max-w-md w-full mx-4"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-bold text-white">Use Item</h3>
//                 <button onClick={() => setShowInventory(false)}>
//                   <X className="text-gray-400 hover:text-white" size={20} />
//                 </button>
//               </div>

//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {consumables.length === 0 && (
//                   <p className="text-gray-400 text-center py-4">No items available</p>
//                 )}
                
//                 {consumables.map(item => (
//                   <button
//                     key={item.id}
//                     onClick={() => handleUseItem(item)}
//                     className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       {item.icon && <item.icon className="text-green-400" size={20} />}
//                       <div className="flex-1">
//                         <div className="font-bold text-white">{item.name}</div>
//                         <div className="text-xs text-gray-400">{item.description}</div>
//                       </div>
//                     </div>
//                   </button>
//                 ))}

//                 {weapons.length > 0 && (
//                   <>
//                     <div className="text-sm font-bold text-gray-400 mt-4 mb-2">Weapons</div>
//                     {weapons.map(item => (
//                       <button
//                         key={item.id}
//                         onClick={() => handleUseItem(item)}
//                         className={`w-full text-left p-3 rounded border transition-colors ${
//                           equippedWeapon?.id === item.id
//                             ? 'bg-blue-900/50 border-blue-500'
//                             : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
//                         }`}
//                       >
//                         <div className="flex items-center gap-3">
//                           {item.icon && <item.icon className="text-orange-400" size={20} />}
//                           <div className="flex-1">
//                             <div className="font-bold text-white">
//                               {item.name}
//                               {equippedWeapon?.id === item.id && <span className="text-xs ml-2 text-blue-400">✓ Equipped</span>}
//                             </div>
//                             <div className="text-xs text-gray-400">{item.stats?.damage || '+0'} damage</div>
//                           </div>
//                         </div>
//                       </button>
//                     ))}
//                   </>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* BP Notification */}
//       <AnimatePresence>
//         {showBPNotification && bpResult && (
//           <BPNotification
//             result={bpResult}
//             onClose={() => setShowBPNotification(false)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default BattleSystem;