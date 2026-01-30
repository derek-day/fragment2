"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sword, Sparkles, Package, Heart, Shield, X, Swords, Target, Skull, User, Users, Menu, Zap, ArrowLeft, ChevronRight } from 'lucide-react';
import DiceBox from "@3d-dice/dice-box";
import { useRouter } from "next/navigation";
import { updatePlayerHP } from '../lib/hpModifier';
import { getUnlockedEquipment, useConsumable } from '../components/Equipment';
import { awardBreakerPoints } from '../lib/breakerPointsService';
import { BPNotification } from '../components/BPNotification';
import { motion, AnimatePresence } from 'framer-motion';
import { environmentalActions } from '../lib/environmentalActions';
import { hasUsedEnvironmentalAction, markEnvironmentalActionUsed } from '../lib/environmentalService';
import { recordTookEnvironmentalPotion } from '../lib/progressService';
import { getNPCCombatStats, updateNPCCombatHP } from "../lib/npcCombatService";

const BattleSystem = ({ userStats, playerName, page, userId, pageId }) => {
  const diceBoxRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();
  
  // Ref to prevent double-execution of NPC turns
  const turnInProgress = useRef(false);

  const [gameLog, setGameLog] = useState([]);
  
  // Player Stats
  const [playerHP, setPlayerHP] = useState(userStats?.HP || 20);
  const [maxHP, setMaxHP] = useState(userStats?.MaxHP || 20);
  const [playerStance, setPlayerStance] = useState('normal'); 
  const [playerMissNextTurn, setPlayerMissNextTurn] = useState(false);

  // Combat State
  const [enemies, setEnemies] = useState([]);
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [allies, setAllies] = useState([]);
  const [turnOrder, setTurnOrder] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  
  // UI State
  const [isPlayerTurn, setIsPlayerTurn] = useState(false); 
  const [battleEnded, setBattleEnded] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  
  // Menus & Items
  const [inventory, setInventory] = useState([]);
  const [showInventory, setShowInventory] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); 
  const [mobileMenuView, setMobileMenuView] = useState('main'); // 'main', 'attack', 'magic'
  const [equippedWeapon, setEquippedWeapon] = useState(null);
  const [showAttackMenu, setShowAttackMenu] = useState(false); // Desktop only
  const [showMagicMenu, setShowMagicMenu] = useState(false); // Desktop only
  
  // Environmental & Rewards
  const [bpResult, setBPResult] = useState(null);
  const [showBPNotification, setShowBPNotification] = useState(false);
  const [environmentalActionUsed, setEnvironmentalActionUsed] = useState(false);
  const [environmentalAction, setEnvironmentalAction] = useState(null);

  // --- HELPERS ---

  const getModifier = (stat) => Math.floor((stat - 10) / 2);
  const rollSimple = (sides = 20) => Math.floor(Math.random() * sides) + 1;

  const advanceTurn = () => {
    setTurnOrder(prevOrder => {
      if (prevOrder.length === 0) return prevOrder;
      const nextIndex = (currentTurnIndex + 1) % prevOrder.length;
      setCurrentTurnIndex(nextIndex);
      return prevOrder;
    });
  };

  // --- INITIALIZATION ---

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

  useEffect(() => {
    const initializeCombat = async () => {
      // 1. Initialize Enemies
      let enemyList = [];
      if (page.enemies) {
        if (page.enemies.count && page.enemies.template) {
          for (let i = 0; i < page.enemies.count; i++) {
            enemyList.push({
              ...page.enemies.template,
              id: `enemy_${i}`,
              name: `${page.enemies.template.name} ${i + 1}`,
              currentHP: page.enemies.template.maxHP,
              isAlive: true
            });
          }
        } else if (Array.isArray(page.enemies)) {
          enemyList = page.enemies.map((enemy, i) => ({
            ...enemy,
            id: `enemy_${i}`,
            currentHP: enemy.maxHP,
            isAlive: true
          }));
        }
      } else if (page.enemy) {
        enemyList = [{
          ...page.enemy,
          id: 'enemy_0',
          currentHP: page.enemy.maxHP,
          isAlive: true
        }];
      }
      setEnemies(enemyList);
      
      // 2. Initialize Allies
      const allyList = [];
      if (userId && page.allies && Array.isArray(page.allies)) {
        for (const allyName of page.allies) {
          const allyStats = await getNPCCombatStats(userId, allyName);
          if (allyStats && allyStats.alive) {
            allyList.push({ ...allyStats, id: `ally_${allyName}`, isAlly: true });
          }
        }
        setAllies(allyList);
      }
      
      // 3. Initiative
      let participants = [];
      const playerAthletics = userStats?.Athletics || 10;
      let playerInit = rollSimple(20) + getModifier(playerAthletics);
      
      if (page.initiative === 'player') playerInit += 1000;
      if (page.initiative === 'enemy') playerInit -= 1000;
      
      participants.push({ type: 'player', id: 'player', val: playerInit, name: playerName || "You" });

      allyList.forEach(ally => {
        const score = rollSimple(20) + getModifier(ally.athletics || 10);
        participants.push({ type: 'ally', id: ally.id, val: score, name: ally.name });
      });

      enemyList.forEach(enemy => {
        let score = (typeof enemy.initiative === 'number') ? enemy.initiative : rollSimple(20) + (enemy.initiativeMod || 0);
        participants.push({ type: 'enemy', id: enemy.id, val: score, name: enemy.name });
      });

      participants.sort((a, b) => b.val - a.val);
      setTurnOrder(participants);
      setCurrentTurnIndex(0);
      
      if (participants.length > 0 && participants[0].type === 'player') {
        setIsPlayerTurn(true);
      } else {
        setIsPlayerTurn(false);
      }
    };
    
    initializeCombat();
  }, [userId, page, userStats, playerName]);

  useEffect(() => {
    const loadInventory = async () => {
      if (userId) {
        const items = await getUnlockedEquipment(userId);
        setInventory(items);
        const weapon = items.find(item => item.type === 'Weapon');
        if (weapon) setEquippedWeapon(weapon);
      }
    };
    loadInventory();
  }, [userId]);

  // --- DICE BOX ADAPTIVE INITIALIZATION ---
  useEffect(() => {
    if (!containerRef.current) return;
    
    const isMobile = window.innerWidth < 768;
    
    // UPDATED: Physics config for faster stopping
    const config = {
      assetPath: "/dice-box-assets/",
      scale: isMobile ? 9 : 18, // Larger on desktop
      size: 6,
      gravity: 5,
      mass: 2, // Heavier dice stop faster
      friction: 0.8, // High friction to stop sliding
      restitution: 0.5, // Lower bounciness
      lightIntensity: 1,
      perspective: true, 
      theme: "smooth",
      themeColor: "#a60d0d",
      shadowOpacity: 0.8,
      throwForce: isMobile ? 0.05 : 0.08,
    };

    const dice = new DiceBox("#dice-box", config);

    dice.init().then(() => diceBoxRef.current = dice);
    
    return () => {
      // Clean up if library supported it, otherwise handled by ref reassignment
    };
  }, []);

  // --- STAT HELPERS ---

  const player = {
    name: playerName || "My Guy",
    maxHP: maxHP,
    athletics: userStats?.Athletics || 10,
    essence: userStats?.Essence || 10,
    thought: userStats?.Thought || 10,
    fellowship: userStats?.Fellowship || 10,
    AC: 10 + Math.floor(( (userStats?.Athletics || 10) - 10) / 2) + (playerStance === 'defensive' ? 2 : playerStance === 'aggressive' ? -2 : 0)
  };

  const getAttackStat = () => ({ name: 'ATH', value: player.athletics, mod: getModifier(player.athletics) });

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
    if (!diceBoxRef.current) return Math.floor(Math.random() * sides) + 1;
    diceBoxRef.current.clear();
    setIsRolling(true);
    const roll = await diceBoxRef.current.roll(`1d${sides}`);
    setIsRolling(false);
    return roll[0]?.value ?? 1;
  };

  const calculateDamage = async (diceCount, diceSides) => {
    if (!diceBoxRef.current) return Math.floor(Math.random() * (diceCount * diceSides)) + diceCount;
    diceBoxRef.current.clear();
    const roll = await diceBoxRef.current.roll(`${diceCount}d${diceSides}`);
    return roll.reduce((sum, die) => sum + die.value, 0);
  };

  const validateTarget = () => {
    if (enemies[currentEnemyIndex]?.currentHP <= 0) {
      const nextAliveIndex = enemies.findIndex(e => e.currentHP > 0);
      if (nextAliveIndex !== -1) {
        setCurrentEnemyIndex(nextAliveIndex);
        return nextAliveIndex;
      }
    }
    return currentEnemyIndex;
  };

  // --- PLAYER ACTIONS ---

  const handleMobileAction = (actionType) => {
    // Navigate deeper into menu
    if (actionType === 'attack') setMobileMenuView('attack');
    else if (actionType === 'magic') setMobileMenuView('magic');
    else if (actionType === 'item') {
      // Items links directly to the existing inventory modal
      setShowMobileMenu(false);
      setShowInventory(true);
    } 
    else if (actionType === 'environmental') {
      handleEnvironmental();
      setShowMobileMenu(false);
    }
  };

  const handleAttack = async (attackType = 'normal') => {
    if (isRolling) return;
    
    // Close mobile menu if open
    setShowMobileMenu(false);
    
    if (playerMissNextTurn) {
      addLog('You are recovering from a fumble! Turn skipped.', 'fail');
      setPlayerMissNextTurn(false);
      setTimeout(() => advanceTurn(), 1500);
      return;
    }
    
    setSelectedAction('attack');
    setShowAttackMenu(false);
    
    const targetIndex = validateTarget();
    const targetEnemy = enemies[targetIndex];
    if (!targetEnemy || targetEnemy.currentHP <= 0) return;

    const attackStat = getAttackStat();
    const weaponBonus = equippedWeapon?.stats?.damage ? parseInt(equippedWeapon.stats.damage.replace(/\D/g, '')) || 0 : 0;
    
    let hitBonus = 0;
    let damageBonus = 0;
    let damageDice = { count: 1, sides: 8 };
    
    if (attackType === 'light') { hitBonus = 2; damageBonus = -2; damageDice = { count: 1, sides: 6 }; }
    else if (attackType === 'heavy') { hitBonus = -2; damageBonus = 4; damageDice = { count: 1, sides: 10 }; }
    
    const stanceDamageBonus = playerStance === 'aggressive' ? 2 : 0;
    const roll = await rollDice(20);
    
    if (roll === 1) {
      addLog(`FUMBLE! Natural 1! You lose your next turn.`, 'fail');
      setPlayerMissNextTurn(true);
      setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
      return;
    }
    
    const total = roll + attackStat.mod + weaponBonus + hitBonus;
    addLog(`ATTACK vs ${targetEnemy.name}: ${roll} + ${attackStat.mod} + ${weaponBonus} = ${total}`, 'roll');

    if (total >= targetEnemy.ac || roll === 20) {
      const baseDamage = await calculateDamage(damageDice.count, damageDice.sides);
      let totalDamage = Math.max(1, baseDamage + attackStat.mod + weaponBonus + damageBonus + stanceDamageBonus);
      if (roll === 20) { totalDamage *= 2; addLog(`CRITICAL HIT!`, 'success'); }
      
      const newEnemies = [...enemies];
      newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - totalDamage);
      setEnemies(newEnemies);
      
      addLog(`Hit! Dealt ${totalDamage} damage to ${targetEnemy.name}!`, 'success');
      if (newEnemies[targetIndex].currentHP === 0) {
        addLog(`${targetEnemy.name} has been defeated!`, 'success');
      }
    } else {
      addLog(`Miss! Attack against ${targetEnemy.name} failed.`, 'fail');
    }

    setTimeout(() => { 
      setSelectedAction(null); 
      advanceTurn();
    }, 1500);
  };

  const handleMagic = async (spellType = 'normal') => {
    if (isRolling) return;
    
    setShowMobileMenu(false);

    if (playerMissNextTurn) {
      addLog('Turn skipped due to fumble.', 'fail');
      setPlayerMissNextTurn(false);
      setTimeout(() => advanceTurn(), 1500);
      return;
    }
    
    setSelectedAction('magic');
    setShowMagicMenu(false);

    const targetIndex = validateTarget();
    const targetEnemy = enemies[targetIndex];
    if (!targetEnemy || targetEnemy.currentHP <= 0) return;

    const spellStat = getSpellcastingStat();
    let hitBonus = 0;
    let damageBonus = 0;
    let damageDice = { count: 2, sides: 6 };
    
    if (spellType === 'light') { hitBonus = 2; damageBonus = -1; damageDice = { count: 2, sides: 4 }; }
    else if (spellType === 'heavy') { hitBonus = -2; damageBonus = 3; damageDice = { count: 3, sides: 6 }; }
    
    const stanceDamageBonus = playerStance === 'aggressive' ? 2 : 0;
    const roll = await rollDice(20);
    
    if (roll === 1) {
      addLog(`FUMBLE! Spell backfires! Lose next turn.`, 'fail');
      setPlayerMissNextTurn(true);
      setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
      return;
    }
    
    const total = roll + spellStat.mod + hitBonus;
    addLog(`CAST SPELL at ${targetEnemy.name}: ${roll} + ${spellStat.mod} = ${total}`, 'roll');

    if (total >= targetEnemy.ac || roll === 20) {
      const baseDamage = await calculateDamage(damageDice.count, damageDice.sides);
      let totalDamage = Math.max(1, baseDamage + spellStat.mod + damageBonus + stanceDamageBonus);
      if (roll === 20) { totalDamage *= 2; addLog(`CRITICAL HIT!`, 'success'); }
      
      const newEnemies = [...enemies];
      newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - totalDamage);
      setEnemies(newEnemies);
      
      addLog(`Success! ${totalDamage} magic damage to ${targetEnemy.name}!`, 'success');
    } else {
      addLog(`Miss! Spell fizzles against ${targetEnemy.name}.`, 'fail');
    }

    setTimeout(() => { 
      setSelectedAction(null); 
      advanceTurn();
    }, 1500);
  };

  const handleEnvironmental = async () => {
    if (isRolling || !environmentalAction) return;
    
    const targetIndex = validateTarget();
    const targetEnemy = enemies[targetIndex];
    
    setSelectedAction('environmental');
    const stat = userStats[environmentalAction.stat] || 10;
    const mod = getModifier(stat);
    const roll = await rollDice(20);
    
    if (roll === 1) {
      addLog(`FUMBLE! Environmental action failed badly!`, 'fail');
      setPlayerMissNextTurn(true);
      await markEnvironmentalActionUsed(userId, pageId);
      setEnvironmentalActionUsed(true);
      setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
      return;
    }
    
    const total = roll + mod;
    addLog(`Attempting ${environmentalAction.name}... Roll: ${roll} + ${mod} = ${total}`, 'roll');

    if (total >= environmentalAction.dc || roll === 20) {
      let damage = await calculateDamage(environmentalAction.damage.dice, environmentalAction.damage.sides);
      if (roll === 20) damage *= 2;
      
      const newEnemies = [...enemies];
      newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - damage);
      setEnemies(newEnemies);

      addLog(`Success! ${environmentalAction.name} deals ${damage} damage to ${targetEnemy.name}!`, 'success');
      if (environmentalAction.effect) addLog(environmentalAction.effect, 'success');
    } else {
      addLog(`Failed! ${environmentalAction.name} misses!`, 'fail');
    }

    await markEnvironmentalActionUsed(userId, pageId);
    setEnvironmentalActionUsed(true);
    setTimeout(() => { 
      setSelectedAction(null); 
      advanceTurn();
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
        setPlayerHP(newHP);
        setMaxHP(Math.max(maxHP, newHP));
        addLog(`Used ${item.name}, restored ${healAmount} HP!`, 'heal');
      } else if (item.id === 'environment_potion') {
        await recordTookEnvironmentalPotion(userId);
        addLog(`Drank ${item.name}. Effects negated!`, 'heal');
      }
      const result = await useConsumable(userId, item.id);
      if (result.success && result.consumed) {
        setInventory(prev => prev.filter(i => i.id !== item.id));
      }
    } else if (item.type === 'Weapon') {
      setEquippedWeapon(item);
      addLog(`Equipped ${item.name}!`, 'success');
    }

    setTimeout(() => { 
      setSelectedAction(null); 
      advanceTurn();
    }, 1500);
  };

  // --- TURN SYSTEM LOOP ---

  useEffect(() => {
    if (battleEnded || turnOrder.length === 0) return;

    const currentTurn = turnOrder[currentTurnIndex];
    if (!currentTurn) return;

    if (currentTurn.type === 'player') {
      setIsPlayerTurn(true);
      turnInProgress.current = false;
      return;
    }

    setIsPlayerTurn(false);
    
    if (turnInProgress.current) return;
    turnInProgress.current = true;
    
    const executeTurn = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (battleEnded) return;
      if (currentTurnIndex >= turnOrder.length) return;

      if (currentTurn.type === 'ally') {
        const ally = allies.find(a => a.id === currentTurn.id);
        if (ally && ally.currentHP > 0) {
          const livingEnemies = enemies.filter(e => e.currentHP > 0);
          if (livingEnemies.length > 0) {
            const target = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
            await performAllyTurn(ally, target);
          } else {
             addLog(`${ally.name} looks around...`, 'normal');
          }
        }
      } 
      else if (currentTurn.type === 'enemy') {
        const enemy = enemies.find(e => e.id === currentTurn.id);
        if (enemy && enemy.currentHP > 0) {
          await performEnemyTurn(enemy);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
      turnInProgress.current = false;
      advanceTurn();
    };
    
    executeTurn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurnIndex, battleEnded, turnOrder]); 

  const performAllyTurn = async (ally, target) => {
    const attackStat = Math.floor((ally.athletics - 10) / 2);
    const roll = await rollDice(20);
    const total = roll + attackStat;
    
    addLog(`${ally.name} attacks ${target.name}: ${roll} + ${attackStat} = ${total}`, 'success');
    
    if (total >= target.ac || roll === 20) {
      let damage = await calculateDamage(1, 8) + attackStat;
      if (roll === 20) { damage *= 2; addLog(`${ally.name} CRITICAL HIT!`, 'success'); }
      
      setEnemies(prev => {
        const newEnemies = [...prev];
        const idx = newEnemies.findIndex(e => e.id === target.id);
        if (idx >= 0) {
          newEnemies[idx].currentHP = Math.max(0, newEnemies[idx].currentHP - damage);
        }
        return newEnemies;
      });
      addLog(`${ally.name} hits ${target.name} for ${damage}!`, 'success');
    } else {
      addLog(`${ally.name} misses ${target.name}.`, 'fail');
    }
  };

  const performEnemyTurn = async (enemy) => {
    const livingAllies = allies.filter(a => a.currentHP > 0);
    const hasAllies = livingAllies.length > 0;
    
    let target = 'player';
    if (hasAllies && Math.random() > 0.5) {
      target = livingAllies[Math.floor(Math.random() * livingAllies.length)];
    }

    const roll = await rollDice(20);
    const total = roll + (enemy.attack || 0);

    if (target === 'player') {
      const currentPlayerAC = 10 + Math.floor(((userStats?.Athletics || 10) - 10) / 2) + 
        (playerStance === 'defensive' ? 2 : playerStance === 'aggressive' ? -2 : 0);
      
      addLog(`${enemy.name} attacks YOU: ${roll} + ${enemy.attack} = ${total}`, 'enemy');
      
      if (total >= currentPlayerAC || roll === 20) {
        let damage = await calculateDamage(1, 6) + (enemy.attack || 0);
        if (roll === 20) { damage *= 2; addLog(`Enemy CRITICAL HIT!`, 'damage'); }
        
        setPlayerHP(prev => Math.max(0, prev - damage));
        addLog(`${enemy.name} hits you for ${damage} damage!`, 'damage');
      } else {
        addLog(`${enemy.name} misses you!`, 'success');
      }
    } else {
      addLog(`${enemy.name} attacks ${target.name}: ${roll} + ${enemy.attack} = ${total}`, 'enemy');
      if (total >= target.ac || roll === 20) {
        let damage = await calculateDamage(1, 6) + (enemy.attack || 0);
        
        setAllies(prev => {
          const newAllies = [...prev];
          const idx = newAllies.findIndex(a => a.id === target.id);
          if (idx >= 0) {
            newAllies[idx].currentHP = Math.max(0, newAllies[idx].currentHP - damage);
          }
          return newAllies;
        });
        
        addLog(`${enemy.name} hits ${target.name} for ${damage}!`, 'damage');
      } else {
        addLog(`${enemy.name} misses ${target.name}!`, 'success');
      }
    }
  };

  // --- VICTORY / DEFEAT ---

  useEffect(() => {
    const checkBattleEnd = async () => {
      if (userId) await updatePlayerHP(userId, playerHP, maxHP);
      
      if (playerHP <= 0 && !battleEnded) {
        setBattleEnded(true);
        addLog('You have been defeated...', 'fail');
        await saveAllyStatus();
        setTimeout(() => { if (page.fail) router.push(`/adventure/${page.fail}`); }, 3000);
      } 
      else if (enemies.length > 0 && enemies.every(e => e.currentHP <= 0) && !battleEnded) {
        setBattleEnded(true);
        addLog('Victory! All enemies defeated!', 'success');
        await saveAllyStatus();
        
        if (userId) {
          const totalBP = enemies.reduce((sum, enemy) => sum + (enemy.bp || 5), 0);
          const result = await awardBreakerPoints(userId, totalBP, `defeated ${enemies.length} enemies`);
          if (result) {
            setBPResult(result);
            setShowBPNotification(true);
            setTimeout(() => setShowBPNotification(false), result.leveledUp ? 10000 : 6000);
          }
        }
        setTimeout(() => { if (page.next) router.push(`/adventure/${page.next}`); }, 8000);
      }
    };
    checkBattleEnd();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerHP, enemies, battleEnded]);

  const saveAllyStatus = async () => {
    if (!userId || allies.length === 0) return;
    for (const ally of allies) {
      await updateNPCCombatHP(userId, ally.name, ally.currentHP);
    }
  };

  const HPBar = ({ current, max, color, label }) => {
    const percentage = Math.max(0, (current / max) * 100);
    return (
      <div className="w-full">
         <div className="flex justify-between text-[10px] text-gray-400 mb-0.5 px-1">
          <span>{label}</span>
          <span>{current}/{max}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden border border-gray-600">
          <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  };

  const consumables = inventory.filter(item => item.type === 'Consumable');
  const weapons = inventory.filter(item => item.type === 'Weapon');
  
  const currentTurnType = turnOrder[currentTurnIndex]?.type || 'player';

  return (
    <>
      <style jsx global>{`
        #dice-box canvas {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-12 lg:p-16 pointer-events-none">
        {/* <div className="display h-auto w-full max-w-md md:max-w-5xl h-[100dvh] md:h-full md:max-h-[90vh] flex flex-col bg-slate-950/95 md:bg-slate-950/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden pointer-events-auto rounded-none md:rounded-lg"> */}
        <div className="display h-auto w-full max-w-md md:max-w-5xl h-[100dvh] md:max-h-[90vh] flex flex-col bg-slate-950/95 md:bg-slate-950/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden pointer-events-auto rounded-none md:rounded-lg">
          
          {/* Header */}
          <header className="bg-slate-900/50 border-b border-slate-700/50 p-2 md:p-3 shrink-0 flex justify-between items-center">
            <h1 className="text-sm md:text-lg font-bold text-slate-100 shadow-black drop-shadow-md truncate max-w-[50%]">{page.title}</h1>
            <div className="flex items-center gap-1 md:gap-2">
              <div className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                playerStance === 'defensive' ? 'bg-blue-900/60 border-blue-500 text-blue-200' :
                playerStance === 'aggressive' ? 'bg-red-900/60 border-red-500 text-red-200' :
                'bg-gray-900/60 border-gray-500 text-gray-200'
              }`}>
                {playerStance === 'defensive' ? 'DEF' : playerStance === 'aggressive' ? 'AGG' : 'NOR'}
              </div>
              
              <div className={`px-2 md:px-3 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
                battleEnded 
                  ? (playerHP > 0 ? "bg-green-900/60 border-green-600 text-green-200" : "bg-red-900/60 border-red-600 text-red-200")
                  : (currentTurnType === 'player' 
                      ? "bg-blue-900/60 border-blue-500 text-blue-200 animate-pulse" 
                      : currentTurnType === 'ally'
                      ? "bg-teal-900/60 border-teal-500 text-teal-200"
                      : "bg-orange-900/60 border-orange-500 text-orange-200")
              }`}>
                {battleEnded 
                  ? (playerHP > 0 ? "Victory" : "Defeat") 
                  : (currentTurnType === 'player' ? "Your Turn" : currentTurnType === 'ally' ? "Ally Turn" : "Enemy Turn")}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-2 md:p-5 space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 max-h-fit">
            
            {/* LEFT COLUMN: Stats, Allies, Dice */}
            <div className="flex flex-col gap-2 md:gap-3 shrink-0">
              {/* Player Card */}
              <div className="bg-slate-900/60 p-2 md:p-3 border border-blue-500/30 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-blue-100">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-blue-400" /> {player.name}
                  </div>
                  <span className="text-[10px] md:text-xs text-slate-400 bg-slate-800 px-2 py-0.5 border border-slate-700 rounded">AC: {player.AC}</span>
                </div>
                <HPBar current={playerHP} max={maxHP} color="bg-green-600" label="LP" />
                {equippedWeapon && (
                  <div className="mt-1 text-[10px] md:text-xs flex items-center gap-1 text-green-400">
                    <Sword size={10} /> {equippedWeapon.name} <span className="text-slate-500">({equippedWeapon.stats?.damage})</span>
                  </div>
                )}
              </div>

              {/* Allies */}
              {allies.length > 0 && (
                <div className="relative">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                      <Users size={10} /> Allies ({allies.filter(a=>a.currentHP>0).length})
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                    {allies.map(ally => (
                      <div key={ally.id} className={`flex-none w-[140px] md:w-[160px] p-2 border snap-start rounded ${ally.currentHP > 0 ? 'bg-slate-900/40 border-slate-700' : 'bg-red-900/20 border-red-900 opacity-60'}`}>
                        <div className="flex justify-between text-[10px] md:text-xs text-slate-300 mb-1">
                          <span className="font-bold truncate">{ally.name}</span>
                          <span>AC: {ally.ac}</span>
                        </div>
                        <HPBar current={ally.currentHP} max={ally.maxHP} color="bg-teal-600" label="LP" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dice Box - INCREASED HEIGHT FOR DESKTOP */}
              <div className="h-28 md:h-64 w-full bg-slate-900/40 border-2 border-dashed border-slate-700/50 relative overflow-hidden shrink-0 rounded-lg">
                <div id="dice-box" ref={containerRef} className="w-full h-full p-1" />
              </div>

              {/* Stance Buttons - Hidden on Mobile */}
              <div className="hidden md:grid grid-cols-3 gap-1 md:gap-2">
                {['defensive', 'normal', 'aggressive'].map((stance) => (
                  <button
                    key={stance}
                    onClick={() => setPlayerStance(stance)}
                    disabled={!isPlayerTurn || battleEnded}
                    className={`px-1 py-2 md:px-2 md:py-3 text-[10px] md:text-xs font-bold transition-all rounded ${
                      playerStance === stance
                        ? (stance === 'defensive' ? 'bg-blue-700 border-blue-500' : stance === 'aggressive' ? 'bg-red-700 border-red-500' : 'bg-gray-600 border-gray-400') + ' text-white border-2'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                    } disabled:opacity-50`}
                  >
                    {stance.charAt(0).toUpperCase() + stance.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Enemies, Text, Log */}
            <div className="flex flex-col gap-2 md:gap-3 min-h-0 flex-1">
              
              {/* Enemy List */}
              <div className="bg-slate-900/60 border border-red-900/30 p-2 max-h-32 md:max-h-48 overflow-y-auto shrink-0 rounded-lg">
                <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between sticky top-0 bg-slate-900/90 z-10">
                  <span>Enemies ({enemies.filter(e => e.currentHP > 0).length} Alive)</span>
                  {enemies.length > 1 && <span className="text-[9px]">Click to target</span>}
                </div>
                
                <div className="space-y-1 md:space-y-2">
                  {enemies.map((enemy, idx) => (
                    <button
                      key={enemy.id}
                      onClick={() => enemy.currentHP > 0 && setCurrentEnemyIndex(idx)}
                      disabled={enemy.currentHP <= 0}
                      className={`w-full text-left p-1.5 md:p-2 flex items-center justify-between border transition-all rounded ${
                        idx === currentEnemyIndex 
                          ? 'bg-red-900/30 border-red-500 ring-1 ring-red-500/50' 
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                      } ${enemy.currentHP <= 0 ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`text-xs md:text-sm font-bold ${idx === currentEnemyIndex ? 'text-red-200' : 'text-slate-300'}`}>
                            {idx === currentEnemyIndex && <Target className="inline w-3 h-3 mr-1 text-red-500"/>}
                            {enemy.name}
                          </span>
                          <span className="text-[9px] md:text-[10px] text-slate-500">AC: {enemy.ac}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1 md:h-1.5">
                          <div className="bg-red-600 h-1 md:h-1.5 rounded-full transition-all" style={{ width: `${(enemy.currentHP / enemy.maxHP) * 100}%` }} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Battle Log */}
              <div className="battle-log flex-1 min-h-[100px] bg-black/40 border border-slate-700/50 p-2 flex flex-col relative overflow-hidden rounded-lg">
                <span className="text-[9px] md:text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider sticky top-0 bg-black/20 w-full">Combat Log</span>
                <div className="overflow-y-auto space-y-0.5 md:space-y-1 pr-1 flex-1">
                  {gameLog.slice().reverse().map((log) => (
                    <div key={log.id} className={`text-[10px] md:text-[11px] p-1 md:p-1.5 border-l-2 rounded ${
                      log.type === 'success' ? 'border-green-500 text-green-300 bg-green-900/10' :
                      log.type === 'fail' ? 'border-red-500 text-red-300 bg-red-900/10' :
                      log.type === 'damage' ? 'border-orange-500 text-orange-300 bg-orange-900/10' :
                      log.type === 'heal' ? 'border-blue-500 text-blue-300 bg-blue-900/10' :
                      log.type === 'enemy' ? 'border-yellow-500 text-yellow-300 bg-yellow-900/10' :
                      log.type === 'roll' ? 'border-purple-500 text-purple-300 bg-purple-900/10' :
                      'border-slate-600 text-slate-400'
                    }`}>
                      {log.message}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* === FOOTER ACTION BAR === */}
          
          {/* MOBILE: Single Action Button */}
          <div className="md:hidden p-2 bg-slate-900/90 border-t border-slate-700/50 z-20">
             <button
              onClick={() => { setShowMobileMenu(true); setMobileMenuView('main'); }}
              disabled={!isPlayerTurn || battleEnded || isRolling}
              className="w-full cinzel-text py-2 bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-bold rounded-lg shadow-lg border border-blue-500 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
             >
                {/* <Menu size={20} /> ACTIONS */}
                ACTIONS
             </button>
          </div>

          {/* DESKTOP: Traditional Grid Buttons */}
          <div className={`hidden md:grid p-3 bg-slate-900/90 border-t border-slate-700/50 ${environmentalAction && !environmentalActionUsed ? 'grid-cols-4' : 'grid-cols-3'} gap-2 shrink-0 z-20`}>
            {/* Attack */}
            <div className="relative group">
              <button
                onClick={() => setShowAttackMenu(!showAttackMenu)}
                disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
                className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-red-900 active:border-b-0 active:scale-95 transition-all rounded"
              >
                <Swords className="w-5 h-5 mb-1" />
                <span className="text-xs">ATTACK</span>
              </button>
              
              {showAttackMenu && isPlayerTurn && !battleEnded && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 border border-orange-500 shadow-xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 rounded">
                  <button onClick={() => handleAttack('light')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-green-300 border-b border-white/10">Light (+2 Hit, -2 Dmg)</button>
                  <button onClick={() => handleAttack('normal')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-white border-b border-white/10">Normal</button>
                  <button onClick={() => handleAttack('heavy')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-red-300">Heavy (-2 Hit, +4 Dmg)</button>
                </div>
              )}
            </div>

            {/* Magic */}
            <div className="relative group">
              <button
                onClick={() => setShowMagicMenu(!showMagicMenu)}
                disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
                className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-purple-900 active:border-b-0 active:scale-95 transition-all rounded"
              >
                <Sparkles className="w-5 h-5 mb-1" />
                <span className="text-xs">MAGIC</span>
              </button>

              {showMagicMenu && isPlayerTurn && !battleEnded && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 border border-purple-500 shadow-xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 rounded">
                  <button onClick={() => handleMagic('light')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-cyan-300 border-b border-white/10">Minor (+2 Hit, -2 Dmg)</button>
                  <button onClick={() => handleMagic('normal')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-white border-b border-white/10">Standard</button>
                  <button onClick={() => handleMagic('heavy')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-purple-300">Powerful (-2 Hit, +4 Dmg)</button>
                </div>
              )}
            </div>

            {/* Items */}
            <button
              onClick={() => setShowInventory(true)}
              disabled={!isPlayerTurn || battleEnded || selectedAction || consumables.length === 0}
              className="flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-green-900 active:border-b-0 active:scale-95 transition-all rounded"
            >
              <Package className="w-5 h-5 mb-1" />
              <span className="text-xs">ITEMS</span>
            </button>

            {/* Environment */}
            {environmentalAction && !environmentalActionUsed && (
              <button
                onClick={handleEnvironmental}
                disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
                className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 px-1 font-bold shadow-lg border-b-4 border-emerald-900 active:border-b-0 active:scale-95 transition-all rounded"
                title={environmentalAction.description}
              >
                <span className="text-xl mb-1">{environmentalAction.icon}</span>
                <span className="text-[10px] leading-tight truncate w-full text-center">{environmentalAction.name.split(' ')[0]}</span>
              </button>
            )}
          </div>
        </div>

        {/* --- MODALS & OVERLAYS --- */}

        {/* UPDATED: Central Mobile Action Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
               onClick={() => setShowMobileMenu(false)}
            >
               <motion.div
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 onClick={(e) => e.stopPropagation()}
                 className="w-full max-w-sm bg-slate-950 border border-slate-700 rounded-lg shadow-2xl overflow-hidden"
               >
                 <div className="bg-slate-900 p-3 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                       {mobileMenuView === 'main' && 'Select Action'}
                       {mobileMenuView === 'attack' && 'Attack Options'}
                       {mobileMenuView === 'magic' && 'Magic Options'}
                    </h3>
                    <button onClick={() => setShowMobileMenu(false)}><X size={20} className="text-gray-400" /></button>
                 </div>

                 <div className="p-4 space-y-3">
                    
                    {/* VIEW: MAIN */}
                    {mobileMenuView === 'main' && (
                      <>
                        {/* Stance Toggles */}
                        <div className="flex bg-slate-800 p-1 rounded-lg mb-2">
                          {['defensive', 'normal', 'aggressive'].map((stance) => (
                              <button
                                key={stance}
                                onClick={() => setPlayerStance(stance)}
                                className={`flex-1 py-2 text-xs font-bold rounded capitalize ${
                                  playerStance === stance 
                                  ? (stance === 'defensive' ? 'bg-blue-600' : stance === 'aggressive' ? 'bg-red-600' : 'bg-gray-600') + ' text-white' 
                                  : 'text-gray-400'
                                }`}
                              >
                                {stance}
                              </button>
                            ))}
                        </div>

                        <button onClick={() => handleMobileAction('attack')} className="w-full bg-slate-800 border border-slate-600 p-3 rounded-lg flex items-center justify-between hover:bg-slate-700 text-white font-bold">
                           <span className="flex items-center gap-2"><Swords size={18} className="text-red-400" /> Attack</span>
                           <ChevronRight size={16} className="text-slate-500" />
                        </button>
                        <button onClick={() => handleMobileAction('magic')} className="w-full bg-slate-800 border border-slate-600 p-3 rounded-lg flex items-center justify-between hover:bg-slate-700 text-white font-bold">
                           <span className="flex items-center gap-2"><Sparkles size={18} className="text-purple-400" /> Magic</span>
                           <ChevronRight size={16} className="text-slate-500" />
                        </button>
                        <button onClick={() => handleMobileAction('item')} className="w-full bg-slate-800 border border-slate-600 p-3 rounded-lg flex items-center justify-between hover:bg-slate-700 text-white font-bold">
                           <span className="flex items-center gap-2"><Package size={18} className="text-green-400" /> Items / Equip</span>
                           <ChevronRight size={16} className="text-slate-500" />
                        </button>
                        
                        {environmentalAction && !environmentalActionUsed && (
                          <button onClick={() => handleMobileAction('environmental')} className="w-full bg-slate-800 border border-slate-600 p-3 rounded-lg flex items-center gap-2 hover:bg-slate-700 text-white font-bold">
                            <Zap size={18} className="text-yellow-400" /> {environmentalAction.name}
                          </button>
                        )}
                      </>
                    )}

                    {/* VIEW: ATTACK SUB-MENU */}
                    {mobileMenuView === 'attack' && (
                      <>
                        <button onClick={() => setMobileMenuView('main')} className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                           <ArrowLeft size={12} /> Back
                        </button>
                        <div className="grid grid-cols-1 gap-2">
                          <button onClick={() => handleAttack('light')} className="p-3 bg-slate-800 border border-green-900/50 rounded text-left hover:bg-slate-700">
                             <div className="text-sm font-bold text-green-300">Light Attack</div>
                             <div className="text-xs text-slate-400">+2 Hit, -2 Dmg</div>
                          </button>
                          <button onClick={() => handleAttack('normal')} className="p-3 bg-slate-800 border border-slate-600 rounded text-left hover:bg-slate-700">
                             <div className="text-sm font-bold text-white">Normal Attack</div>
                             <div className="text-xs text-slate-400">Standard roll</div>
                          </button>
                          <button onClick={() => handleAttack('heavy')} className="p-3 bg-slate-800 border border-red-900/50 rounded text-left hover:bg-slate-700">
                             <div className="text-sm font-bold text-red-300">Heavy Attack</div>
                             <div className="text-xs text-slate-400">-2 Hit, +4 Dmg</div>
                          </button>
                        </div>
                      </>
                    )}

                    {/* VIEW: MAGIC SUB-MENU */}
                    {mobileMenuView === 'magic' && (
                      <>
                        <button onClick={() => setMobileMenuView('main')} className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                           <ArrowLeft size={12} /> Back
                        </button>
                        <div className="grid grid-cols-1 gap-2">
                          <button onClick={() => handleMagic('light')} className="p-3 bg-slate-800 border border-cyan-900/50 rounded text-left hover:bg-slate-700">
                             <div className="text-sm font-bold text-cyan-300">Minor Spell</div>
                             <div className="text-xs text-slate-400">+2 Hit</div>
                          </button>
                          <button onClick={() => handleMagic('normal')} className="p-3 bg-slate-800 border border-slate-600 rounded text-left hover:bg-slate-700">
                             <div className="text-sm font-bold text-white">Standard Spell</div>
                             <div className="text-xs text-slate-400">Standard roll</div>
                          </button>
                          <button onClick={() => handleMagic('heavy')} className="p-3 bg-slate-800 border border-purple-900/50 rounded text-left hover:bg-slate-700">
                             <div className="text-sm font-bold text-purple-300">Powerful Spell</div>
                             <div className="text-xs text-slate-400">-2 Hit</div>
                          </button>
                        </div>
                      </>
                    )}

                 </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showInventory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 flex items-center justify-center z-[70] pointer-events-auto backdrop-blur-sm"
              onClick={() => setShowInventory(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border-2 border-slate-700 p-4 max-w-md w-full mx-4 shadow-2xl rounded-lg"
              >
                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Package size={20} /> Inventory
                  </h3>
                  <button onClick={() => setShowInventory(false)}>
                    <X className="text-gray-400 hover:text-white" size={24} />
                  </button>
                </div>

                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Consumables</div>
                  {consumables.length === 0 && <p className="text-slate-600 italic text-sm">No consumables.</p>}
                  
                  {consumables.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleUseItem(item)}
                      className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors flex items-center gap-3 group rounded"
                    >
                      <div className="bg-slate-900 p-2 group-hover:bg-slate-800 rounded">
                        {item.icon ? <item.icon className="text-green-400" size={16} /> : <Heart className="text-green-400" size={16} />}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                      </div>
                    </button>
                  ))}

                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2">Weapons</div>
                  {weapons.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleUseItem(item)}
                      className={`w-full text-left p-3 border transition-colors flex items-center gap-3 rounded ${
                        equippedWeapon?.id === item.id
                          ? 'bg-blue-900/30 border-blue-500'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
                      }`}
                    >
                       <div className="bg-slate-900 p-2 rounded">
                        <Sword className="text-orange-400" size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white text-sm flex justify-between">
                          {item.name}
                          {equippedWeapon?.id === item.id && <span className="text-[10px] bg-blue-600 px-1.5 rounded flex items-center">EQUIPPED</span>}
                        </div>
                        <div className="text-xs text-gray-400">Damage: {item.stats?.damage || '1d8'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBPNotification && bpResult && (
            <BPNotification
              result={bpResult}
              onClose={() => setShowBPNotification(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default BattleSystem;















// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { Sword, Sparkles, Package, Heart, Shield, X, Swords, Target, Skull, User, Users, Menu, Zap } from 'lucide-react';
// import DiceBox from "@3d-dice/dice-box";
// import { useRouter } from "next/navigation";
// import { updatePlayerHP } from '../lib/hpModifier';
// import { getUnlockedEquipment, useConsumable } from '../components/Equipment';
// import { awardBreakerPoints } from '../lib/breakerPointsService';
// import { BPNotification } from '../components/BPNotification';
// import { motion, AnimatePresence } from 'framer-motion';
// import { environmentalActions } from '../lib/environmentalActions';
// import { hasUsedEnvironmentalAction, markEnvironmentalActionUsed } from '../lib/environmentalService';
// import { recordTookEnvironmentalPotion } from '../lib/progressService';
// import { getNPCCombatStats, updateNPCCombatHP } from "../lib/npcCombatService";

// const BattleSystem = ({ userStats, playerName, page, userId, pageId }) => {
//   const diceBoxRef = useRef(null);
//   const containerRef = useRef(null);
//   const router = useRouter();
  
//   // Ref to prevent double-execution of NPC turns
//   const turnInProgress = useRef(false);

//   const [gameLog, setGameLog] = useState([]);
  
//   // Player Stats
//   const [playerHP, setPlayerHP] = useState(userStats?.HP || 20);
//   const [maxHP, setMaxHP] = useState(userStats?.MaxHP || 20);
//   const [playerStance, setPlayerStance] = useState('normal'); 
//   const [playerMissNextTurn, setPlayerMissNextTurn] = useState(false);

//   // Combat State
//   const [enemies, setEnemies] = useState([]);
//   const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
//   const [allies, setAllies] = useState([]);
//   const [turnOrder, setTurnOrder] = useState([]);
//   const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  
//   // UI State
//   const [isPlayerTurn, setIsPlayerTurn] = useState(false); 
//   const [battleEnded, setBattleEnded] = useState(false);
//   const [selectedAction, setSelectedAction] = useState(null);
//   const [isRolling, setIsRolling] = useState(false);
  
//   // Menus & Items
//   const [inventory, setInventory] = useState([]);
//   const [showInventory, setShowInventory] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false); // NEW: Mobile Menu Toggle
//   const [equippedWeapon, setEquippedWeapon] = useState(null);
//   const [showAttackMenu, setShowAttackMenu] = useState(false);
//   const [showMagicMenu, setShowMagicMenu] = useState(false);
  
//   // Environmental & Rewards
//   const [bpResult, setBPResult] = useState(null);
//   const [showBPNotification, setShowBPNotification] = useState(false);
//   const [environmentalActionUsed, setEnvironmentalActionUsed] = useState(false);
//   const [environmentalAction, setEnvironmentalAction] = useState(null);

//   // --- HELPERS ---

//   const getModifier = (stat) => Math.floor((stat - 10) / 2);
//   const rollSimple = (sides = 20) => Math.floor(Math.random() * sides) + 1;

//   const advanceTurn = () => {
//     setTurnOrder(prevOrder => {
//       if (prevOrder.length === 0) return prevOrder;
//       const nextIndex = (currentTurnIndex + 1) % prevOrder.length;
//       setCurrentTurnIndex(nextIndex);
//       return prevOrder;
//     });
//   };

//   // --- INITIALIZATION ---

//   useEffect(() => {
//     const loadEnvironmental = async () => {
//       if (userId && page.environment) {
//         const used = await hasUsedEnvironmentalAction(userId, pageId);
//         setEnvironmentalActionUsed(used);
//         setEnvironmentalAction(environmentalActions[page.environment]);
//       }
//     };
//     loadEnvironmental();
//   }, [userId, page.environment, pageId]);

//   useEffect(() => {
//     const initializeCombat = async () => {
//       // 1. Initialize Enemies
//       let enemyList = [];
//       if (page.enemies) {
//         if (page.enemies.count && page.enemies.template) {
//           for (let i = 0; i < page.enemies.count; i++) {
//             enemyList.push({
//               ...page.enemies.template,
//               id: `enemy_${i}`,
//               name: `${page.enemies.template.name} ${i + 1}`,
//               currentHP: page.enemies.template.maxHP,
//               isAlive: true
//             });
//           }
//         } else if (Array.isArray(page.enemies)) {
//           enemyList = page.enemies.map((enemy, i) => ({
//             ...enemy,
//             id: `enemy_${i}`,
//             currentHP: enemy.maxHP,
//             isAlive: true
//           }));
//         }
//       } else if (page.enemy) {
//         enemyList = [{
//           ...page.enemy,
//           id: 'enemy_0',
//           currentHP: page.enemy.maxHP,
//           isAlive: true
//         }];
//       }
//       setEnemies(enemyList);
      
//       // 2. Initialize Allies
//       const allyList = [];
//       if (userId && page.allies && Array.isArray(page.allies)) {
//         for (const allyName of page.allies) {
//           const allyStats = await getNPCCombatStats(userId, allyName);
//           if (allyStats && allyStats.alive) {
//             allyList.push({ ...allyStats, id: `ally_${allyName}`, isAlly: true });
//           }
//         }
//         setAllies(allyList);
//       }
      
//       // 3. Initiative
//       let participants = [];
//       const playerAthletics = userStats?.Athletics || 10;
//       let playerInit = rollSimple(20) + getModifier(playerAthletics);
      
//       if (page.initiative === 'player') playerInit += 1000;
//       if (page.initiative === 'enemy') playerInit -= 1000;
      
//       participants.push({ type: 'player', id: 'player', val: playerInit, name: playerName || "You" });

//       allyList.forEach(ally => {
//         const score = rollSimple(20) + getModifier(ally.athletics || 10);
//         participants.push({ type: 'ally', id: ally.id, val: score, name: ally.name });
//       });

//       enemyList.forEach(enemy => {
//         let score = (typeof enemy.initiative === 'number') ? enemy.initiative : rollSimple(20) + (enemy.initiativeMod || 0);
//         participants.push({ type: 'enemy', id: enemy.id, val: score, name: enemy.name });
//       });

//       participants.sort((a, b) => b.val - a.val);
//       setTurnOrder(participants);
//       setCurrentTurnIndex(0);
      
//       if (participants.length > 0 && participants[0].type === 'player') {
//         setIsPlayerTurn(true);
//       } else {
//         setIsPlayerTurn(false);
//       }
//     };
    
//     initializeCombat();
//   }, [userId, page, userStats, playerName]);

//   useEffect(() => {
//     const loadInventory = async () => {
//       if (userId) {
//         const items = await getUnlockedEquipment(userId);
//         setInventory(items);
//         const weapon = items.find(item => item.type === 'Weapon');
//         if (weapon) setEquippedWeapon(weapon);
//       }
//     };
//     loadInventory();
//   }, [userId]);

//   // --- DICE BOX ADAPTIVE INITIALIZATION ---
//   useEffect(() => {
//     if (!containerRef.current) return;
    
//     const isMobile = window.innerWidth < 768;
    
//     // Adaptive config based on device
//     const config = {
//       assetPath: "/dice-box-assets/",
//       scale: isMobile ? 8 : 14, // Smaller on mobile, Larger on desktop
//       size: 6,
//       gravity: 10,
//       lightIntensity: 1,
//       perspective: true, // Use perspective camera
//       theme: "smooth",
//       themeColor: "#a60d0d",
//       shadowOpacity: 0.8,
//       throwForce: isMobile ? 0.02 : 0.04, // Stronger throw on desktop
//     };

//     const dice = new DiceBox("#dice-box", config);

//     dice.init().then(() => diceBoxRef.current = dice);
    
//     // Clean up to avoid duplicates on strict mode
//     return () => {
//       // DiceBox doesn't always have a clean destroy method exposed simply, 
//       // but ensuring refs are handled prevents logic errors.
//     };
//   }, []);

//   // --- STAT HELPERS ---

//   const player = {
//     name: playerName || "My Guy",
//     maxHP: maxHP,
//     athletics: userStats?.Athletics || 10,
//     essence: userStats?.Essence || 10,
//     thought: userStats?.Thought || 10,
//     fellowship: userStats?.Fellowship || 10,
//     AC: 10 + Math.floor(( (userStats?.Athletics || 10) - 10) / 2) + (playerStance === 'defensive' ? 2 : playerStance === 'aggressive' ? -2 : 0)
//   };

//   const getAttackStat = () => ({ name: 'ATH', value: player.athletics, mod: getModifier(player.athletics) });

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
//     if (!diceBoxRef.current) return Math.floor(Math.random() * sides) + 1;
//     diceBoxRef.current.clear();
//     setIsRolling(true);
//     const roll = await diceBoxRef.current.roll(`1d${sides}`);
//     setIsRolling(false);
//     return roll[0]?.value ?? 1;
//   };

//   const calculateDamage = async (diceCount, diceSides) => {
//     if (!diceBoxRef.current) return Math.floor(Math.random() * (diceCount * diceSides)) + diceCount;
//     diceBoxRef.current.clear();
//     const roll = await diceBoxRef.current.roll(`${diceCount}d${diceSides}`);
//     return roll.reduce((sum, die) => sum + die.value, 0);
//   };

//   const validateTarget = () => {
//     if (enemies[currentEnemyIndex]?.currentHP <= 0) {
//       const nextAliveIndex = enemies.findIndex(e => e.currentHP > 0);
//       if (nextAliveIndex !== -1) {
//         setCurrentEnemyIndex(nextAliveIndex);
//         return nextAliveIndex;
//       }
//     }
//     return currentEnemyIndex;
//   };

//   // --- PLAYER ACTIONS ---

//   const handleActionClick = (action, type) => {
//     // Closes mobile menu if open
//     setShowMobileMenu(false);
    
//     if (action === 'attack') handleAttack(type);
//     if (action === 'magic') handleMagic(type);
//     if (action === 'item') setShowInventory(true);
//     if (action === 'environmental') handleEnvironmental();
//   };

//   const handleAttack = async (attackType = 'normal') => {
//     if (isRolling) return;
    
//     if (playerMissNextTurn) {
//       addLog('You are recovering from a fumble! Turn skipped.', 'fail');
//       setPlayerMissNextTurn(false);
//       setTimeout(() => advanceTurn(), 1500);
//       return;
//     }
    
//     setSelectedAction('attack');
//     setShowAttackMenu(false);
    
//     const targetIndex = validateTarget();
//     const targetEnemy = enemies[targetIndex];
//     if (!targetEnemy || targetEnemy.currentHP <= 0) return;

//     const attackStat = getAttackStat();
//     const weaponBonus = equippedWeapon?.stats?.damage ? parseInt(equippedWeapon.stats.damage.replace(/\D/g, '')) || 0 : 0;
    
//     let hitBonus = 0;
//     let damageBonus = 0;
//     let damageDice = { count: 1, sides: 8 };
    
//     if (attackType === 'light') { hitBonus = 2; damageBonus = -2; damageDice = { count: 1, sides: 6 }; }
//     else if (attackType === 'heavy') { hitBonus = -2; damageBonus = 4; damageDice = { count: 1, sides: 10 }; }
    
//     const stanceDamageBonus = playerStance === 'aggressive' ? 2 : 0;
//     const roll = await rollDice(20);
    
//     if (roll === 1) {
//       addLog(`FUMBLE! Natural 1! You lose your next turn.`, 'fail');
//       setPlayerMissNextTurn(true);
//       setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
//       return;
//     }
    
//     const total = roll + attackStat.mod + weaponBonus + hitBonus;
//     addLog(`ATTACK vs ${targetEnemy.name}: ${roll} + ${attackStat.mod} + ${weaponBonus} = ${total}`, 'roll');

//     if (total >= targetEnemy.ac || roll === 20) {
//       const baseDamage = await calculateDamage(damageDice.count, damageDice.sides);
//       let totalDamage = Math.max(1, baseDamage + attackStat.mod + weaponBonus + damageBonus + stanceDamageBonus);
//       if (roll === 20) { totalDamage *= 2; addLog(`CRITICAL HIT!`, 'success'); }
      
//       const newEnemies = [...enemies];
//       newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - totalDamage);
//       setEnemies(newEnemies);
      
//       addLog(`Hit! Dealt ${totalDamage} damage to ${targetEnemy.name}!`, 'success');
//       if (newEnemies[targetIndex].currentHP === 0) {
//         addLog(`${targetEnemy.name} has been defeated!`, 'success');
//       }
//     } else {
//       addLog(`Miss! Attack against ${targetEnemy.name} failed.`, 'fail');
//     }

//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn();
//     }, 1500);
//   };

//   const handleMagic = async (spellType = 'normal') => {
//     if (isRolling) return;
//     if (playerMissNextTurn) {
//       addLog('Turn skipped due to fumble.', 'fail');
//       setPlayerMissNextTurn(false);
//       setTimeout(() => advanceTurn(), 1500);
//       return;
//     }
    
//     setSelectedAction('magic');
//     setShowMagicMenu(false);

//     const targetIndex = validateTarget();
//     const targetEnemy = enemies[targetIndex];
//     if (!targetEnemy || targetEnemy.currentHP <= 0) return;

//     const spellStat = getSpellcastingStat();
//     let hitBonus = 0;
//     let damageBonus = 0;
//     let damageDice = { count: 2, sides: 6 };
    
//     if (spellType === 'light') { hitBonus = 2; damageBonus = -1; damageDice = { count: 2, sides: 4 }; }
//     else if (spellType === 'heavy') { hitBonus = -2; damageBonus = 3; damageDice = { count: 3, sides: 6 }; }
    
//     const stanceDamageBonus = playerStance === 'aggressive' ? 2 : 0;
//     const roll = await rollDice(20);
    
//     if (roll === 1) {
//       addLog(`FUMBLE! Spell backfires! Lose next turn.`, 'fail');
//       setPlayerMissNextTurn(true);
//       setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
//       return;
//     }
    
//     const total = roll + spellStat.mod + hitBonus;
//     addLog(`CAST SPELL at ${targetEnemy.name}: ${roll} + ${spellStat.mod} = ${total}`, 'roll');

//     if (total >= targetEnemy.ac || roll === 20) {
//       const baseDamage = await calculateDamage(damageDice.count, damageDice.sides);
//       let totalDamage = Math.max(1, baseDamage + spellStat.mod + damageBonus + stanceDamageBonus);
//       if (roll === 20) { totalDamage *= 2; addLog(`CRITICAL HIT!`, 'success'); }
      
//       const newEnemies = [...enemies];
//       newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - totalDamage);
//       setEnemies(newEnemies);
      
//       addLog(`Success! ${totalDamage} magic damage to ${targetEnemy.name}!`, 'success');
//     } else {
//       addLog(`Miss! Spell fizzles against ${targetEnemy.name}.`, 'fail');
//     }

//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn();
//     }, 1500);
//   };

//   const handleEnvironmental = async () => {
//     if (isRolling || !environmentalAction) return;
    
//     const targetIndex = validateTarget();
//     const targetEnemy = enemies[targetIndex];
    
//     setSelectedAction('environmental');
//     const stat = userStats[environmentalAction.stat] || 10;
//     const mod = getModifier(stat);
//     const roll = await rollDice(20);
    
//     if (roll === 1) {
//       addLog(`FUMBLE! Environmental action failed badly!`, 'fail');
//       setPlayerMissNextTurn(true);
//       await markEnvironmentalActionUsed(userId, pageId);
//       setEnvironmentalActionUsed(true);
//       setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
//       return;
//     }
    
//     const total = roll + mod;
//     addLog(`Attempting ${environmentalAction.name}... Roll: ${roll} + ${mod} = ${total}`, 'roll');

//     if (total >= environmentalAction.dc || roll === 20) {
//       let damage = await calculateDamage(environmentalAction.damage.dice, environmentalAction.damage.sides);
//       if (roll === 20) damage *= 2;
      
//       const newEnemies = [...enemies];
//       newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - damage);
//       setEnemies(newEnemies);

//       addLog(`Success! ${environmentalAction.name} deals ${damage} damage to ${targetEnemy.name}!`, 'success');
//       if (environmentalAction.effect) addLog(environmentalAction.effect, 'success');
//     } else {
//       addLog(`Failed! ${environmentalAction.name} misses!`, 'fail');
//     }

//     await markEnvironmentalActionUsed(userId, pageId);
//     setEnvironmentalActionUsed(true);
//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn();
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
//         setPlayerHP(newHP);
//         setMaxHP(Math.max(maxHP, newHP));
//         addLog(`Used ${item.name}, restored ${healAmount} HP!`, 'heal');
//       } else if (item.id === 'environment_potion') {
//         await recordTookEnvironmentalPotion(userId);
//         addLog(`Drank ${item.name}. Effects negated!`, 'heal');
//       }
//       const result = await useConsumable(userId, item.id);
//       if (result.success && result.consumed) {
//         setInventory(prev => prev.filter(i => i.id !== item.id));
//       }
//     } else if (item.type === 'Weapon') {
//       setEquippedWeapon(item);
//       addLog(`Equipped ${item.name}!`, 'success');
//     }

//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn();
//     }, 1500);
//   };

//   // --- TURN SYSTEM LOOP ---

//   useEffect(() => {
//     if (battleEnded || turnOrder.length === 0) return;

//     const currentTurn = turnOrder[currentTurnIndex];
//     if (!currentTurn) return;

//     // IF PLAYER: Just unlock UI
//     if (currentTurn.type === 'player') {
//       setIsPlayerTurn(true);
//       turnInProgress.current = false;
//       return;
//     }

//     // IF NPC: Lock UI and Execute
//     setIsPlayerTurn(false);
    
//     // Prevent double execution
//     if (turnInProgress.current) return;
//     turnInProgress.current = true;
    
//     const executeTurn = async () => {
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       if (battleEnded) return;

//       // Double check we are still on the correct turn before executing logic
//       // This prevents race conditions where effect might fire twice
//       if (currentTurnIndex >= turnOrder.length) return;

//       if (currentTurn.type === 'ally') {
//         const ally = allies.find(a => a.id === currentTurn.id);
//         if (ally && ally.currentHP > 0) {
//           const livingEnemies = enemies.filter(e => e.currentHP > 0);
//           if (livingEnemies.length > 0) {
//             const target = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
//             await performAllyTurn(ally, target);
//           } else {
//              addLog(`${ally.name} looks around...`, 'normal');
//           }
//         }
//       } 
//       else if (currentTurn.type === 'enemy') {
//         const enemy = enemies.find(e => e.id === currentTurn.id);
//         if (enemy && enemy.currentHP > 0) {
//           await performEnemyTurn(enemy);
//         }
//       }
      
//       await new Promise(resolve => setTimeout(resolve, 800));
//       turnInProgress.current = false;
//       advanceTurn();
//     };
    
//     executeTurn();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentTurnIndex, battleEnded, turnOrder]); 
//   // IMPORTANT: 'enemies' and 'allies' removed from deps to prevent re-execution on damage updates

//   const performAllyTurn = async (ally, target) => {
//     const attackStat = Math.floor((ally.athletics - 10) / 2);
//     const roll = await rollDice(20);
//     const total = roll + attackStat;
    
//     addLog(`${ally.name} attacks ${target.name}: ${roll} + ${attackStat} = ${total}`, 'success');
    
//     if (total >= target.ac || roll === 20) {
//       let damage = await calculateDamage(1, 8) + attackStat;
//       if (roll === 20) { damage *= 2; addLog(`${ally.name} CRITICAL HIT!`, 'success'); }
      
//       setEnemies(prev => {
//         const newEnemies = [...prev];
//         const idx = newEnemies.findIndex(e => e.id === target.id);
//         if (idx >= 0) {
//           newEnemies[idx].currentHP = Math.max(0, newEnemies[idx].currentHP - damage);
//         }
//         return newEnemies;
//       });
//       addLog(`${ally.name} hits ${target.name} for ${damage}!`, 'success');
//     } else {
//       addLog(`${ally.name} misses ${target.name}.`, 'fail');
//     }
//   };

//   const performEnemyTurn = async (enemy) => {
//     const livingAllies = allies.filter(a => a.currentHP > 0);
//     const hasAllies = livingAllies.length > 0;
    
//     let target = 'player';
//     if (hasAllies && Math.random() > 0.5) {
//       target = livingAllies[Math.floor(Math.random() * livingAllies.length)];
//     }

//     const roll = await rollDice(20);
//     const total = roll + (enemy.attack || 0);

//     if (target === 'player') {
//       const currentPlayerAC = 10 + Math.floor(((userStats?.Athletics || 10) - 10) / 2) + 
//         (playerStance === 'defensive' ? 2 : playerStance === 'aggressive' ? -2 : 0);
      
//       addLog(`${enemy.name} attacks YOU: ${roll} + ${enemy.attack} = ${total}`, 'enemy');
      
//       if (total >= currentPlayerAC || roll === 20) {
//         let damage = await calculateDamage(1, 6) + (enemy.attack || 0);
//         if (roll === 20) { damage *= 2; addLog(`Enemy CRITICAL HIT!`, 'damage'); }
        
//         setPlayerHP(prev => Math.max(0, prev - damage));
//         addLog(`${enemy.name} hits you for ${damage} damage!`, 'damage');
//       } else {
//         addLog(`${enemy.name} misses you!`, 'success');
//       }
//     } else {
//       addLog(`${enemy.name} attacks ${target.name}: ${roll} + ${enemy.attack} = ${total}`, 'enemy');
//       if (total >= target.ac || roll === 20) {
//         let damage = await calculateDamage(1, 6) + (enemy.attack || 0);
        
//         setAllies(prev => {
//           const newAllies = [...prev];
//           const idx = newAllies.findIndex(a => a.id === target.id);
//           if (idx >= 0) {
//             newAllies[idx].currentHP = Math.max(0, newAllies[idx].currentHP - damage);
//           }
//           return newAllies;
//         });
        
//         addLog(`${enemy.name} hits ${target.name} for ${damage}!`, 'damage');
//       } else {
//         addLog(`${enemy.name} misses ${target.name}!`, 'success');
//       }
//     }
//   };

//   // --- VICTORY / DEFEAT ---

//   useEffect(() => {
//     const checkBattleEnd = async () => {
//       if (userId) await updatePlayerHP(userId, playerHP, maxHP);
      
//       if (playerHP <= 0 && !battleEnded) {
//         setBattleEnded(true);
//         addLog('You have been defeated...', 'fail');
//         await saveAllyStatus();
//         setTimeout(() => { if (page.fail) router.push(`/adventure/${page.fail}`); }, 3000);
//       } 
//       else if (enemies.length > 0 && enemies.every(e => e.currentHP <= 0) && !battleEnded) {
//         setBattleEnded(true);
//         addLog('Victory! All enemies defeated!', 'success');
//         await saveAllyStatus();
        
//         if (userId) {
//           const totalBP = enemies.reduce((sum, enemy) => sum + (enemy.bp || 5), 0);
//           const result = await awardBreakerPoints(userId, totalBP, `defeated ${enemies.length} enemies`);
//           if (result) {
//             setBPResult(result);
//             setShowBPNotification(true);
//             setTimeout(() => setShowBPNotification(false), result.leveledUp ? 10000 : 6000);
//           }
//         }
//         setTimeout(() => { if (page.next) router.push(`/adventure/${page.next}`); }, 8000);
//       }
//     };
//     checkBattleEnd();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [playerHP, enemies, battleEnded]);

//   const saveAllyStatus = async () => {
//     if (!userId || allies.length === 0) return;
//     for (const ally of allies) {
//       await updateNPCCombatHP(userId, ally.name, ally.currentHP);
//     }
//   };

//   const HPBar = ({ current, max, color, label }) => {
//     const percentage = Math.max(0, (current / max) * 100);
//     return (
//       <div className="w-full">
//          <div className="flex justify-between text-[10px] text-gray-400 mb-0.5 px-1">
//           <span>{label}</span>
//           <span>{current}/{max}</span>
//         </div>
//         <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden border border-gray-600">
//           <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
//         </div>
//       </div>
//     );
//   };

//   const consumables = inventory.filter(item => item.type === 'Consumable');
//   const weapons = inventory.filter(item => item.type === 'Weapon');
  
//   const currentTurnType = turnOrder[currentTurnIndex]?.type || 'player';

//   return (
//     <>
//       {/* CSS Injection to force Dice Box Canvas to fit correctly */}
//       <style jsx global>{`
//         #dice-box canvas {
//           width: 100% !important;
//           height: 100% !important;
//           object-fit: contain;
//         }
//       `}</style>

//       <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-12 lg:p-16 pointer-events-none">
//         <div className="display h-auto w-full max-w-md md:max-w-5xl h-[100dvh] md:h-full md:max-h-[90vh] flex flex-col bg-slate-950/95 md:bg-slate-950/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden pointer-events-auto rounded-none md:rounded-lg">
          
//           {/* Header */}
//           <header className="bg-slate-900/50 border-b border-slate-700/50 p-2 md:p-3 shrink-0 flex justify-between items-center">
//             <h1 className="text-sm md:text-lg font-bold text-slate-100 shadow-black drop-shadow-md truncate max-w-[50%]">{page.title}</h1>
//             <div className="flex items-center gap-1 md:gap-2">
//               <div className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
//                 playerStance === 'defensive' ? 'bg-blue-900/60 border-blue-500 text-blue-200' :
//                 playerStance === 'aggressive' ? 'bg-red-900/60 border-red-500 text-red-200' :
//                 'bg-gray-900/60 border-gray-500 text-gray-200'
//               }`}>
//                 {playerStance === 'defensive' ? 'DEF' : playerStance === 'aggressive' ? 'AGG' : 'NOR'}
//               </div>
              
//               <div className={`px-2 md:px-3 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
//                 battleEnded 
//                   ? (playerHP > 0 ? "bg-green-900/60 border-green-600 text-green-200" : "bg-red-900/60 border-red-600 text-red-200")
//                   : (currentTurnType === 'player' 
//                       ? "bg-blue-900/60 border-blue-500 text-blue-200 animate-pulse" 
//                       : currentTurnType === 'ally'
//                       ? "bg-teal-900/60 border-teal-500 text-teal-200"
//                       : "bg-orange-900/60 border-orange-500 text-orange-200")
//               }`}>
//                 {battleEnded 
//                   ? (playerHP > 0 ? "Victory" : "Defeat") 
//                   : (currentTurnType === 'player' ? "Your Turn" : currentTurnType === 'ally' ? "Ally Turn" : "Enemy Turn")}
//               </div>
//             </div>
//           </header>

//           {/* Main Content */}
//           <div className="flex-1 overflow-y-auto p-2 md:p-5 space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 max-h-fit">
            
//             {/* LEFT COLUMN: Stats, Allies, Dice */}
//             <div className="flex flex-col gap-2 md:gap-3 shrink-0">
//               {/* Player Card */}
//               <div className="bg-slate-900/60 p-2 md:p-3 border border-blue-500/30 rounded-lg">
//                 <div className="flex justify-between items-center mb-1">
//                   <div className="flex items-center gap-2 font-bold text-sm text-blue-100">
//                     <User className="w-3 h-3 md:w-4 md:h-4 text-blue-400" /> {player.name}
//                   </div>
//                   <span className="text-[10px] md:text-xs text-slate-400 bg-slate-800 px-2 py-0.5 border border-slate-700 rounded">AC: {player.AC}</span>
//                 </div>
//                 <HPBar current={playerHP} max={maxHP} color="bg-green-600" label="LP" />
//                 {equippedWeapon && (
//                   <div className="mt-1 text-[10px] md:text-xs flex items-center gap-1 text-green-400">
//                     <Sword size={10} /> {equippedWeapon.name} <span className="text-slate-500">({equippedWeapon.stats?.damage})</span>
//                   </div>
//                 )}
//               </div>

//               {/* Allies */}
//               {allies.length > 0 && (
//                 <div className="relative">
//                   <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
//                       <Users size={10} /> Allies ({allies.filter(a=>a.currentHP>0).length})
//                   </div>
//                   <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
//                     {allies.map(ally => (
//                       <div key={ally.id} className={`flex-none w-[140px] md:w-[160px] p-2 border snap-start rounded ${ally.currentHP > 0 ? 'bg-slate-900/40 border-slate-700' : 'bg-red-900/20 border-red-900 opacity-60'}`}>
//                         <div className="flex justify-between text-[10px] md:text-xs text-slate-300 mb-1">
//                           <span className="font-bold truncate">{ally.name}</span>
//                           <span>AC: {ally.ac}</span>
//                         </div>
//                         <HPBar current={ally.currentHP} max={ally.maxHP} color="bg-teal-600" label="LP" />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Dice Box */}
//               <div className="h-28 md:h-48 w-full bg-slate-900/40 border-2 border-dashed border-slate-700/50 relative overflow-hidden shrink-0 rounded-lg">
//                 <div id="dice-box" ref={containerRef} className="w-full h-full p-1" />
//               </div>

//               {/* Stance Buttons - Hidden on Mobile to save space (moved to Action Menu) */}
//               <div className="hidden md:grid grid-cols-3 gap-1 md:gap-2">
//                 {['defensive', 'normal', 'aggressive'].map((stance) => (
//                   <button
//                     key={stance}
//                     onClick={() => setPlayerStance(stance)}
//                     disabled={!isPlayerTurn || battleEnded}
//                     className={`px-1 py-2 md:px-2 md:py-3 text-[10px] md:text-xs font-bold transition-all rounded ${
//                       playerStance === stance
//                         ? (stance === 'defensive' ? 'bg-blue-700 border-blue-500' : stance === 'aggressive' ? 'bg-red-700 border-red-500' : 'bg-gray-600 border-gray-400') + ' text-white border-2'
//                         : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
//                     } disabled:opacity-50`}
//                   >
//                     {stance.charAt(0).toUpperCase() + stance.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* RIGHT COLUMN: Enemies, Text, Log */}
//             <div className="flex flex-col gap-2 md:gap-3 min-h-0 flex-1">
              
//               {/* Enemy List */}
//               <div className="bg-slate-900/60 border border-red-900/30 p-2 max-h-32 md:max-h-48 overflow-y-auto shrink-0 rounded-lg">
//                 <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between sticky top-0 bg-slate-900/90 z-10">
//                   <span>Enemies ({enemies.filter(e => e.currentHP > 0).length} Alive)</span>
//                   {enemies.length > 1 && <span className="text-[9px]">Click to target</span>}
//                 </div>
                
//                 <div className="space-y-1 md:space-y-2">
//                   {enemies.map((enemy, idx) => (
//                     <button
//                       key={enemy.id}
//                       onClick={() => enemy.currentHP > 0 && setCurrentEnemyIndex(idx)}
//                       disabled={enemy.currentHP <= 0}
//                       className={`w-full text-left p-1.5 md:p-2 flex items-center justify-between border transition-all rounded ${
//                         idx === currentEnemyIndex 
//                           ? 'bg-red-900/30 border-red-500 ring-1 ring-red-500/50' 
//                           : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
//                       } ${enemy.currentHP <= 0 ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
//                     >
//                       <div className="flex-1">
//                         <div className="flex justify-between items-center mb-0.5">
//                           <span className={`text-xs md:text-sm font-bold ${idx === currentEnemyIndex ? 'text-red-200' : 'text-slate-300'}`}>
//                             {idx === currentEnemyIndex && <Target className="inline w-3 h-3 mr-1 text-red-500"/>}
//                             {enemy.name}
//                           </span>
//                           <span className="text-[9px] md:text-[10px] text-slate-500">AC: {enemy.ac}</span>
//                         </div>
//                         <div className="w-full bg-gray-800 rounded-full h-1 md:h-1.5">
//                           <div className="bg-red-600 h-1 md:h-1.5 rounded-full transition-all" style={{ width: `${(enemy.currentHP / enemy.maxHP) * 100}%` }} />
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Battle Log */}
//               <div className="battle-log flex-1 min-h-[100px] bg-black/40 border border-slate-700/50 p-2 flex flex-col relative overflow-hidden rounded-lg">
//                 <span className="text-[9px] md:text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider sticky top-0 bg-black/20 w-full">Combat Log</span>
//                 <div className="overflow-y-auto space-y-0.5 md:space-y-1 pr-1 flex-1">
//                   {gameLog.slice().reverse().map((log) => (
//                     <div key={log.id} className={`text-[10px] md:text-[11px] p-1 md:p-1.5 border-l-2 rounded ${
//                       log.type === 'success' ? 'border-green-500 text-green-300 bg-green-900/10' :
//                       log.type === 'fail' ? 'border-red-500 text-red-300 bg-red-900/10' :
//                       log.type === 'damage' ? 'border-orange-500 text-orange-300 bg-orange-900/10' :
//                       log.type === 'heal' ? 'border-blue-500 text-blue-300 bg-blue-900/10' :
//                       log.type === 'enemy' ? 'border-yellow-500 text-yellow-300 bg-yellow-900/10' :
//                       log.type === 'roll' ? 'border-purple-500 text-purple-300 bg-purple-900/10' :
//                       'border-slate-600 text-slate-400'
//                     }`}>
//                       {log.message}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* === FOOTER ACTION BAR === */}
          
//           {/* MOBILE: Single Action Button */}
//           <div className="md:hidden p-2 bg-slate-900/90 border-t border-slate-700/50 z-20">
//              <button
//               onClick={() => setShowMobileMenu(true)}
//               disabled={!isPlayerTurn || battleEnded || isRolling}
//               className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-bold rounded-lg shadow-lg border border-blue-500 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
//              >
//                 <Menu size={20} /> ACTIONS
//              </button>
//           </div>

//           {/* DESKTOP: Traditional Grid Buttons */}
//           <div className={`hidden md:grid p-3 bg-slate-900/90 border-t border-slate-700/50 ${environmentalAction && !environmentalActionUsed ? 'grid-cols-4' : 'grid-cols-3'} gap-2 shrink-0 z-20`}>
//             {/* Attack */}
//             <div className="relative group">
//               <button
//                 onClick={() => setShowAttackMenu(!showAttackMenu)}
//                 disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//                 className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-red-900 active:border-b-0 active:scale-95 transition-all rounded"
//               >
//                 <Swords className="w-5 h-5 mb-1" />
//                 <span className="text-xs">ATTACK</span>
//               </button>
              
//               {showAttackMenu && isPlayerTurn && !battleEnded && (
//                 <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 border border-orange-500 shadow-xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 rounded">
//                   <button onClick={() => handleAttack('light')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-green-300 border-b border-white/10">Light (+2 Hit, -2 Dmg)</button>
//                   <button onClick={() => handleAttack('normal')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-white border-b border-white/10">Normal</button>
//                   <button onClick={() => handleAttack('heavy')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-red-300">Heavy (-2 Hit, +4 Dmg)</button>
//                 </div>
//               )}
//             </div>

//             {/* Magic */}
//             <div className="relative group">
//               <button
//                 onClick={() => setShowMagicMenu(!showMagicMenu)}
//                 disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//                 className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-purple-900 active:border-b-0 active:scale-95 transition-all rounded"
//               >
//                 <Sparkles className="w-5 h-5 mb-1" />
//                 <span className="text-xs">MAGIC</span>
//               </button>

//               {showMagicMenu && isPlayerTurn && !battleEnded && (
//                 <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 border border-purple-500 shadow-xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 rounded">
//                   <button onClick={() => handleMagic('light')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-cyan-300 border-b border-white/10">Minor (+2 Hit)</button>
//                   <button onClick={() => handleMagic('normal')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-white border-b border-white/10">Standard</button>
//                   <button onClick={() => handleMagic('heavy')} className="p-3 text-left hover:bg-white/10 text-xs font-bold text-purple-300">Powerful (-2 Hit)</button>
//                 </div>
//               )}
//             </div>

//             {/* Items */}
//             <button
//               onClick={() => setShowInventory(true)}
//               disabled={!isPlayerTurn || battleEnded || selectedAction || consumables.length === 0}
//               className="flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-green-900 active:border-b-0 active:scale-95 transition-all rounded"
//             >
//               <Package className="w-5 h-5 mb-1" />
//               <span className="text-xs">ITEMS</span>
//             </button>

//             {/* Environment */}
//             {environmentalAction && !environmentalActionUsed && (
//               <button
//                 onClick={handleEnvironmental}
//                 disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//                 className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 px-1 font-bold shadow-lg border-b-4 border-emerald-900 active:border-b-0 active:scale-95 transition-all rounded"
//                 title={environmentalAction.description}
//               >
//                 <span className="text-xl mb-1">{environmentalAction.icon}</span>
//                 <span className="text-[10px] leading-tight truncate w-full text-center">{environmentalAction.name.split(' ')[0]}</span>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* --- MODALS & OVERLAYS --- */}

//         {/* Mobile Action Menu Modal */}
//         <AnimatePresence>
//           {showMobileMenu && (
//             <motion.div 
//                initial={{ opacity: 0, y: 100 }}
//                animate={{ opacity: 1, y: 0 }}
//                exit={{ opacity: 0, y: 100 }}
//                className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t-2 border-slate-600 z-[60] p-4 rounded-t-xl shadow-2xl pointer-events-auto"
//             >
//                <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-bold text-white">Select Action</h3>
//                   <button onClick={() => setShowMobileMenu(false)} className="p-1 bg-slate-800 rounded-full"><X size={20} className="text-white" /></button>
//                </div>

//                {/* Stance Toggles */}
//                <div className="flex bg-slate-800 p-1 rounded-lg mb-4">
//                  {['defensive', 'normal', 'aggressive'].map((stance) => (
//                     <button
//                       key={stance}
//                       onClick={() => setPlayerStance(stance)}
//                       className={`flex-1 py-2 text-xs font-bold rounded capitalize ${
//                         playerStance === stance 
//                         ? (stance === 'defensive' ? 'bg-blue-600' : stance === 'aggressive' ? 'bg-red-600' : 'bg-gray-600') + ' text-white' 
//                         : 'text-gray-400'
//                       }`}
//                     >
//                       {stance}
//                     </button>
//                   ))}
//                </div>

//                <div className="grid grid-cols-2 gap-3">
//                   <button onClick={() => handleActionClick('attack', 'normal')} className="bg-slate-800 border border-slate-600 p-3 rounded-lg flex items-center gap-2 hover:bg-slate-700 text-white font-bold">
//                      <Swords size={18} className="text-red-400" /> Attack
//                   </button>
//                    <button onClick={() => handleActionClick('magic', 'normal')} className="bg-slate-800 border border-slate-600 p-3 rounded-lg flex items-center gap-2 hover:bg-slate-700 text-white font-bold">
//                      <Sparkles size={18} className="text-purple-400" /> Magic
//                   </button>
//                   <button onClick={() => handleActionClick('item')} className="bg-slate-800 border border-slate-600 p-3 rounded-lg flex items-center gap-2 hover:bg-slate-700 text-white font-bold">
//                      <Package size={18} className="text-green-400" /> Items
//                   </button>
//                   {environmentalAction && !environmentalActionUsed && (
//                     <button onClick={() => handleActionClick('environmental')} className="bg-slate-800 border border-slate-600 p-3 rounded-lg flex items-center gap-2 hover:bg-slate-700 text-white font-bold">
//                       <Zap size={18} className="text-yellow-400" /> {environmentalAction.name}
//                     </button>
//                   )}
//                </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//           {showInventory && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/75 flex items-center justify-center z-[70] pointer-events-auto backdrop-blur-sm"
//               onClick={() => setShowInventory(false)}
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 onClick={(e) => e.stopPropagation()}
//                 className="bg-slate-900 border-2 border-slate-700 p-4 max-w-md w-full mx-4 shadow-2xl rounded-lg"
//               >
//                 <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
//                   <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                     <Package size={20} /> Inventory
//                   </h3>
//                   <button onClick={() => setShowInventory(false)}>
//                     <X className="text-gray-400 hover:text-white" size={24} />
//                   </button>
//                 </div>

//                 <div className="space-y-2 max-h-[60vh] overflow-y-auto">
//                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Consumables</div>
//                   {consumables.length === 0 && <p className="text-slate-600 italic text-sm">No consumables.</p>}
                  
//                   {consumables.map(item => (
//                     <button
//                       key={item.id}
//                       onClick={() => handleUseItem(item)}
//                       className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors flex items-center gap-3 group rounded"
//                     >
//                       <div className="bg-slate-900 p-2 group-hover:bg-slate-800 rounded">
//                         {item.icon ? <item.icon className="text-green-400" size={16} /> : <Heart className="text-green-400" size={16} />}
//                       </div>
//                       <div>
//                         <div className="font-bold text-white text-sm">{item.name}</div>
//                         <div className="text-xs text-gray-400">{item.description}</div>
//                       </div>
//                     </button>
//                   ))}

//                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2">Weapons</div>
//                   {weapons.map(item => (
//                     <button
//                       key={item.id}
//                       onClick={() => handleUseItem(item)}
//                       className={`w-full text-left p-3 border transition-colors flex items-center gap-3 rounded ${
//                         equippedWeapon?.id === item.id
//                           ? 'bg-blue-900/30 border-blue-500'
//                           : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
//                       }`}
//                     >
//                        <div className="bg-slate-900 p-2 rounded">
//                         <Sword className="text-orange-400" size={16} />
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-bold text-white text-sm flex justify-between">
//                           {item.name}
//                           {equippedWeapon?.id === item.id && <span className="text-[10px] bg-blue-600 px-1.5 rounded flex items-center">EQUIPPED</span>}
//                         </div>
//                         <div className="text-xs text-gray-400">Damage: {item.stats?.damage || '1d8'}</div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//           {showBPNotification && bpResult && (
//             <BPNotification
//               result={bpResult}
//               onClose={() => setShowBPNotification(false)}
//             />
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// };

// export default BattleSystem;












// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { Sword, Sparkles, Package, Heart, Shield, X, Swords, Target, Skull, User, Users } from 'lucide-react';
// import DiceBox from "@3d-dice/dice-box";
// import { useRouter } from "next/navigation";
// import { updatePlayerHP } from '../lib/hpModifier';
// import { getUnlockedEquipment, useConsumable } from '../components/Equipment';
// import { awardBreakerPoints } from '../lib/breakerPointsService';
// import { BPNotification } from '../components/BPNotification';
// import { motion, AnimatePresence } from 'framer-motion';
// import { environmentalActions } from '../lib/environmentalActions';
// import { hasUsedEnvironmentalAction, markEnvironmentalActionUsed } from '../lib/environmentalService';
// import { recordTookEnvironmentalPotion } from '../lib/progressService';
// import { getNPCCombatStats, updateNPCCombatHP } from "../lib/npcCombatService";

// const BattleSystem = ({ userStats, playerName, page, userId, pageId }) => {
//   const diceBoxRef = useRef(null);
//   const containerRef = useRef(null);
//   const router = useRouter();
  
//   // Ref to prevent double-execution of NPC turns
//   const turnInProgress = useRef(false);

//   const [gameLog, setGameLog] = useState([]);
  
//   // Player Stats
//   const [playerHP, setPlayerHP] = useState(userStats?.HP || 20);
//   const [maxHP, setMaxHP] = useState(userStats?.MaxHP || 20);
//   const [playerStance, setPlayerStance] = useState('normal'); 
//   const [playerMissNextTurn, setPlayerMissNextTurn] = useState(false);

//   // Combat State
//   const [enemies, setEnemies] = useState([]);
//   const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
//   const [allies, setAllies] = useState([]);
//   const [turnOrder, setTurnOrder] = useState([]);
//   const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  
//   // UI State
//   const [isPlayerTurn, setIsPlayerTurn] = useState(false); 
//   const [battleEnded, setBattleEnded] = useState(false);
//   const [selectedAction, setSelectedAction] = useState(null);
//   const [isRolling, setIsRolling] = useState(false);
  
//   // Menus & Items
//   const [inventory, setInventory] = useState([]);
//   const [showInventory, setShowInventory] = useState(false);
//   const [equippedWeapon, setEquippedWeapon] = useState(null);
//   const [showAttackMenu, setShowAttackMenu] = useState(false);
//   const [showMagicMenu, setShowMagicMenu] = useState(false);
  
//   // Environmental & Rewards
//   const [bpResult, setBPResult] = useState(null);
//   const [showBPNotification, setShowBPNotification] = useState(false);
//   const [environmentalActionUsed, setEnvironmentalActionUsed] = useState(false);
//   const [environmentalAction, setEnvironmentalAction] = useState(null);

//   // --- HELPERS ---

//   const getModifier = (stat) => Math.floor((stat - 10) / 2);
//   const rollSimple = (sides = 20) => Math.floor(Math.random() * sides) + 1;

//   const advanceTurn = () => {
//     setTurnOrder(prevOrder => {
//       if (prevOrder.length === 0) return prevOrder;
//       const nextIndex = (currentTurnIndex + 1) % prevOrder.length;
//       setCurrentTurnIndex(nextIndex);
//       return prevOrder;
//     });
//   };

//   // --- INITIALIZATION ---

//   useEffect(() => {
//     const loadEnvironmental = async () => {
//       if (userId && page.environment) {
//         const used = await hasUsedEnvironmentalAction(userId, pageId);
//         setEnvironmentalActionUsed(used);
//         setEnvironmentalAction(environmentalActions[page.environment]);
//       }
//     };
//     loadEnvironmental();
//   }, [userId, page.environment, pageId]);

//   useEffect(() => {
//     const initializeCombat = async () => {
//       // 1. Initialize Enemies
//       let enemyList = [];
//       if (page.enemies) {
//         if (page.enemies.count && page.enemies.template) {
//           for (let i = 0; i < page.enemies.count; i++) {
//             enemyList.push({
//               ...page.enemies.template,
//               id: `enemy_${i}`,
//               name: `${page.enemies.template.name} ${i + 1}`,
//               currentHP: page.enemies.template.maxHP,
//               isAlive: true
//             });
//           }
//         } else if (Array.isArray(page.enemies)) {
//           enemyList = page.enemies.map((enemy, i) => ({
//             ...enemy,
//             id: `enemy_${i}`,
//             currentHP: enemy.maxHP,
//             isAlive: true
//           }));
//         }
//       } else if (page.enemy) {
//         enemyList = [{
//           ...page.enemy,
//           id: 'enemy_0',
//           currentHP: page.enemy.maxHP,
//           isAlive: true
//         }];
//       }
//       setEnemies(enemyList);
      
//       // 2. Initialize Allies
//       const allyList = [];
//       if (userId && page.allies && Array.isArray(page.allies)) {
//         for (const allyName of page.allies) {
//           const allyStats = await getNPCCombatStats(userId, allyName);
//           if (allyStats && allyStats.alive) {
//             allyList.push({ ...allyStats, id: `ally_${allyName}`, isAlly: true });
//           }
//         }
//         setAllies(allyList);
//       }
      
//       // 3. Initiative
//       let participants = [];
//       const playerAthletics = userStats?.Athletics || 10;
//       let playerInit = rollSimple(20) + getModifier(playerAthletics);
      
//       if (page.initiative === 'player') playerInit += 1000;
//       if (page.initiative === 'enemy') playerInit -= 1000;
      
//       participants.push({ type: 'player', id: 'player', val: playerInit, name: playerName || "You" });

//       allyList.forEach(ally => {
//         const score = rollSimple(20) + getModifier(ally.athletics || 10);
//         participants.push({ type: 'ally', id: ally.id, val: score, name: ally.name });
//       });

//       enemyList.forEach(enemy => {
//         let score = (typeof enemy.initiative === 'number') ? enemy.initiative : rollSimple(20) + (enemy.initiativeMod || 0);
//         participants.push({ type: 'enemy', id: enemy.id, val: score, name: enemy.name });
//       });

//       participants.sort((a, b) => b.val - a.val);
//       setTurnOrder(participants);
//       setCurrentTurnIndex(0);
      
//       if (participants.length > 0 && participants[0].type === 'player') {
//         setIsPlayerTurn(true);
//       } else {
//         setIsPlayerTurn(false);
//       }
//     };
    
//     initializeCombat();
//   }, [userId, page, userStats, playerName]);

//   useEffect(() => {
//     const loadInventory = async () => {
//       if (userId) {
//         const items = await getUnlockedEquipment(userId);
//         setInventory(items);
//         const weapon = items.find(item => item.type === 'Weapon');
//         if (weapon) setEquippedWeapon(weapon);
//       }
//     };
//     loadInventory();
//   }, [userId]);

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const dice = new DiceBox("#dice-box", {
//       assetPath: "/dice-box-assets/",
//       scale: 20, // Adjusted scale might help visibility
//       size: 8,
//       gravity: 11,
//       lightIntensity: 1,
//       perspective: true,
//       theme: "smooth",
//       themeColor: "#a60d0d",
//       shadowOpacity: 1,
//       throwForce: 0.02,
//     });
//     dice.init().then(() => diceBoxRef.current = dice);
//   }, []);

//   // --- STAT HELPERS ---

//   const player = {
//     name: playerName || "My Guy",
//     maxHP: maxHP,
//     athletics: userStats?.Athletics || 10,
//     essence: userStats?.Essence || 10,
//     thought: userStats?.Thought || 10,
//     fellowship: userStats?.Fellowship || 10,
//     AC: 10 + Math.floor(( (userStats?.Athletics || 10) - 10) / 2) + (playerStance === 'defensive' ? 2 : playerStance === 'aggressive' ? -2 : 0)
//   };

//   const getAttackStat = () => ({ name: 'ATH', value: player.athletics, mod: getModifier(player.athletics) });

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
//     if (!diceBoxRef.current) return Math.floor(Math.random() * sides) + 1;
//     diceBoxRef.current.clear();
//     setIsRolling(true);
//     const roll = await diceBoxRef.current.roll(`1d${sides}`);
//     setIsRolling(false);
//     return roll[0]?.value ?? 1;
//   };

//   const calculateDamage = async (diceCount, diceSides) => {
//     if (!diceBoxRef.current) return Math.floor(Math.random() * (diceCount * diceSides)) + diceCount;
//     diceBoxRef.current.clear();
//     const roll = await diceBoxRef.current.roll(`${diceCount}d${diceSides}`);
//     return roll.reduce((sum, die) => sum + die.value, 0);
//   };

//   const validateTarget = () => {
//     if (enemies[currentEnemyIndex]?.currentHP <= 0) {
//       const nextAliveIndex = enemies.findIndex(e => e.currentHP > 0);
//       if (nextAliveIndex !== -1) {
//         setCurrentEnemyIndex(nextAliveIndex);
//         return nextAliveIndex;
//       }
//     }
//     return currentEnemyIndex;
//   };

//   // --- PLAYER ACTIONS ---

//   const handleAttack = async (attackType = 'normal') => {
//     if (isRolling) return;
    
//     if (playerMissNextTurn) {
//       addLog('You are recovering from a fumble! Turn skipped.', 'fail');
//       setPlayerMissNextTurn(false);
//       setTimeout(() => advanceTurn(), 1500);
//       return;
//     }
    
//     setSelectedAction('attack');
//     setShowAttackMenu(false);
    
//     const targetIndex = validateTarget();
//     const targetEnemy = enemies[targetIndex];
//     if (!targetEnemy || targetEnemy.currentHP <= 0) return;

//     const attackStat = getAttackStat();
//     const weaponBonus = equippedWeapon?.stats?.damage ? parseInt(equippedWeapon.stats.damage.replace(/\D/g, '')) || 0 : 0;
    
//     let hitBonus = 0;
//     let damageBonus = 0;
//     let damageDice = { count: 1, sides: 8 };
    
//     if (attackType === 'light') { hitBonus = 2; damageBonus = -2; damageDice = { count: 1, sides: 6 }; }
//     else if (attackType === 'heavy') { hitBonus = -2; damageBonus = 4; damageDice = { count: 1, sides: 10 }; }
    
//     const stanceDamageBonus = playerStance === 'aggressive' ? 2 : 0;
//     const roll = await rollDice(20);
    
//     if (roll === 1) {
//       addLog(`FUMBLE! Natural 1! You lose your next turn.`, 'fail');
//       setPlayerMissNextTurn(true);
//       setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
//       return;
//     }
    
//     const total = roll + attackStat.mod + weaponBonus + hitBonus;
//     addLog(`ATTACK vs ${targetEnemy.name}: ${roll} + ${attackStat.mod} + ${weaponBonus} = ${total}`, 'roll');

//     if (total >= targetEnemy.ac || roll === 20) {
//       const baseDamage = await calculateDamage(damageDice.count, damageDice.sides);
//       let totalDamage = Math.max(1, baseDamage + attackStat.mod + weaponBonus + damageBonus + stanceDamageBonus);
//       if (roll === 20) { totalDamage *= 2; addLog(`CRITICAL HIT!`, 'success'); }
      
//       const newEnemies = [...enemies];
//       newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - totalDamage);
//       setEnemies(newEnemies);
      
//       addLog(`Hit! Dealt ${totalDamage} damage to ${targetEnemy.name}!`, 'success');
//       if (newEnemies[targetIndex].currentHP === 0) {
//         addLog(`${targetEnemy.name} has been defeated!`, 'success');
//       }
//     } else {
//       addLog(`Miss! Attack against ${targetEnemy.name} failed.`, 'fail');
//     }

//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn();
//     }, 1500);
//   };

//   const handleMagic = async (spellType = 'normal') => {
//     if (isRolling) return;
//     if (playerMissNextTurn) {
//       addLog('Turn skipped due to fumble.', 'fail');
//       setPlayerMissNextTurn(false);
//       setTimeout(() => advanceTurn(), 1500);
//       return;
//     }
    
//     setSelectedAction('magic');
//     setShowMagicMenu(false);

//     const targetIndex = validateTarget();
//     const targetEnemy = enemies[targetIndex];
//     if (!targetEnemy || targetEnemy.currentHP <= 0) return;

//     const spellStat = getSpellcastingStat();
//     let hitBonus = 0;
//     let damageBonus = 0;
//     let damageDice = { count: 2, sides: 6 };
    
//     if (spellType === 'light') { hitBonus = 2; damageBonus = -1; damageDice = { count: 2, sides: 4 }; }
//     else if (spellType === 'heavy') { hitBonus = -2; damageBonus = 3; damageDice = { count: 3, sides: 6 }; }
    
//     const stanceDamageBonus = playerStance === 'aggressive' ? 2 : 0;
//     const roll = await rollDice(20);
    
//     if (roll === 1) {
//       addLog(`FUMBLE! Spell backfires! Lose next turn.`, 'fail');
//       setPlayerMissNextTurn(true);
//       setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
//       return;
//     }
    
//     const total = roll + spellStat.mod + hitBonus;
//     addLog(`CAST SPELL at ${targetEnemy.name}: ${roll} + ${spellStat.mod} = ${total}`, 'roll');

//     if (total >= targetEnemy.ac || roll === 20) {
//       const baseDamage = await calculateDamage(damageDice.count, damageDice.sides);
//       let totalDamage = Math.max(1, baseDamage + spellStat.mod + damageBonus + stanceDamageBonus);
//       if (roll === 20) { totalDamage *= 2; addLog(`CRITICAL HIT!`, 'success'); }
      
//       const newEnemies = [...enemies];
//       newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - totalDamage);
//       setEnemies(newEnemies);
      
//       addLog(`Success! ${totalDamage} magic damage to ${targetEnemy.name}!`, 'success');
//     } else {
//       addLog(`Miss! Spell fizzles against ${targetEnemy.name}.`, 'fail');
//     }

//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn();
//     }, 1500);
//   };

//   const handleEnvironmental = async () => {
//     if (isRolling || !environmentalAction) return;
    
//     const targetIndex = validateTarget();
//     const targetEnemy = enemies[targetIndex];
    
//     setSelectedAction('environmental');
//     const stat = userStats[environmentalAction.stat] || 10;
//     const mod = getModifier(stat);
//     const roll = await rollDice(20);
    
//     if (roll === 1) {
//       addLog(`FUMBLE! Environmental action failed badly!`, 'fail');
//       setPlayerMissNextTurn(true);
//       await markEnvironmentalActionUsed(userId, pageId);
//       setEnvironmentalActionUsed(true);
//       setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
//       return;
//     }
    
//     const total = roll + mod;
//     addLog(`Attempting ${environmentalAction.name}... Roll: ${roll} + ${mod} = ${total}`, 'roll');

//     if (total >= environmentalAction.dc || roll === 20) {
//       let damage = await calculateDamage(environmentalAction.damage.dice, environmentalAction.damage.sides);
//       if (roll === 20) damage *= 2;
      
//       const newEnemies = [...enemies];
//       newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - damage);
//       setEnemies(newEnemies);

//       addLog(`Success! ${environmentalAction.name} deals ${damage} damage to ${targetEnemy.name}!`, 'success');
//       if (environmentalAction.effect) addLog(environmentalAction.effect, 'success');
//     } else {
//       addLog(`Failed! ${environmentalAction.name} misses!`, 'fail');
//     }

//     await markEnvironmentalActionUsed(userId, pageId);
//     setEnvironmentalActionUsed(true);
//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn();
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
//         setPlayerHP(newHP);
//         setMaxHP(Math.max(maxHP, newHP));
//         addLog(`Used ${item.name}, restored ${healAmount} HP!`, 'heal');
//       } else if (item.id === 'environment_potion') {
//         await recordTookEnvironmentalPotion(userId);
//         addLog(`Drank ${item.name}. Effects negated!`, 'heal');
//       }
//       const result = await useConsumable(userId, item.id);
//       if (result.success && result.consumed) {
//         setInventory(prev => prev.filter(i => i.id !== item.id));
//       }
//     } else if (item.type === 'Weapon') {
//       setEquippedWeapon(item);
//       addLog(`Equipped ${item.name}!`, 'success');
//     }

//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn();
//     }, 1500);
//   };

//   // --- TURN SYSTEM LOOP ---

//   useEffect(() => {
//     if (battleEnded || turnOrder.length === 0) return;

//     const currentTurn = turnOrder[currentTurnIndex];
//     if (!currentTurn) return;

//     if (currentTurn.type === 'player') {
//       setIsPlayerTurn(true);
//       turnInProgress.current = false;
//       return;
//     }

//     setIsPlayerTurn(false);
    
//     if (turnInProgress.current) return;
//     turnInProgress.current = true;
    
//     const executeTurn = async () => {
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       if (battleEnded) return;

//       if (currentTurn.type === 'ally') {
//         const ally = allies.find(a => a.id === currentTurn.id);
//         if (ally && ally.currentHP > 0) {
//           const livingEnemies = enemies.filter(e => e.currentHP > 0);
//           if (livingEnemies.length > 0) {
//             const target = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
//             await performAllyTurn(ally, target);
//           } else {
//              addLog(`${ally.name} looks around...`, 'normal');
//           }
//         }
//       } 
//       else if (currentTurn.type === 'enemy') {
//         const enemy = enemies.find(e => e.id === currentTurn.id);
//         if (enemy && enemy.currentHP > 0) {
//           await performEnemyTurn(enemy);
//         }
//       }
      
//       await new Promise(resolve => setTimeout(resolve, 800));
//       turnInProgress.current = false;
//       advanceTurn();
//     };
    
//     executeTurn();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentTurnIndex, battleEnded, turnOrder]); 

//   const performAllyTurn = async (ally, target) => {
//     const attackStat = Math.floor((ally.athletics - 10) / 2);
//     const roll = await rollDice(20);
//     const total = roll + attackStat;
    
//     addLog(`${ally.name} attacks ${target.name}: ${roll} + ${attackStat} = ${total}`, 'success');
    
//     if (total >= target.ac || roll === 20) {
//       let damage = await calculateDamage(1, 8) + attackStat;
//       if (roll === 20) { damage *= 2; addLog(`${ally.name} CRITICAL HIT!`, 'success'); }
      
//       setEnemies(prev => {
//         const newEnemies = [...prev];
//         const idx = newEnemies.findIndex(e => e.id === target.id);
//         if (idx >= 0) {
//           newEnemies[idx].currentHP = Math.max(0, newEnemies[idx].currentHP - damage);
//         }
//         return newEnemies;
//       });
//       addLog(`${ally.name} hits ${target.name} for ${damage}!`, 'success');
//     } else {
//       addLog(`${ally.name} misses ${target.name}.`, 'fail');
//     }
//   };

//   const performEnemyTurn = async (enemy) => {
//     const livingAllies = allies.filter(a => a.currentHP > 0);
//     const hasAllies = livingAllies.length > 0;
    
//     //50% chance to hit player
//     let target = 'player';
//     if (hasAllies && Math.random() > 0.5) {
//       target = livingAllies[Math.floor(Math.random() * livingAllies.length)];
//     }

//     const roll = await rollDice(20);
//     const total = roll + (enemy.attack || 0);

//     if (target === 'player') {
//       const currentPlayerAC = 10 + Math.floor(((userStats?.Athletics || 10) - 10) / 2) + 
//         (playerStance === 'defensive' ? 2 : playerStance === 'aggressive' ? -2 : 0);
      
//       addLog(`${enemy.name} attacks YOU: ${roll} + ${enemy.attack} = ${total}`, 'enemy');
      
//       if (total >= currentPlayerAC || roll === 20) {
//         let damage = await calculateDamage(1, 6) + (enemy.attack || 0);
//         if (roll === 20) { damage *= 2; addLog(`Enemy CRITICAL HIT!`, 'damage'); }
        
//         setPlayerHP(prev => Math.max(0, prev - damage));
//         addLog(`${enemy.name} hits you for ${damage} damage!`, 'damage');
//       } else {
//         addLog(`${enemy.name} misses you!`, 'success');
//       }
//     } else {
//       addLog(`${enemy.name} attacks ${target.name}: ${roll} + ${enemy.attack} = ${total}`, 'enemy');
//       if (total >= target.ac || roll === 20) {
//         let damage = await calculateDamage(1, 6) + (enemy.attack || 0);
        
//         setAllies(prev => {
//           const newAllies = [...prev];
//           const idx = newAllies.findIndex(a => a.id === target.id);
//           if (idx >= 0) {
//             newAllies[idx].currentHP = Math.max(0, newAllies[idx].currentHP - damage);
//           }
//           return newAllies;
//         });
        
//         addLog(`${enemy.name} hits ${target.name} for ${damage}!`, 'damage');
//       } else {
//         addLog(`${enemy.name} misses ${target.name}!`, 'success');
//       }
//     }
//   };

//   // --- VICTORY / DEFEAT ---

//   useEffect(() => {
//     const checkBattleEnd = async () => {
//       if (userId) await updatePlayerHP(userId, playerHP, maxHP);
      
//       if (playerHP <= 0 && !battleEnded) {
//         setBattleEnded(true);
//         addLog('You have been defeated...', 'fail');
//         await saveAllyStatus();
//         setTimeout(() => { if (page.fail) router.push(`/adventure/${page.fail}`); }, 3000);
//       } 
//       else if (enemies.length > 0 && enemies.every(e => e.currentHP <= 0) && !battleEnded) {
//         setBattleEnded(true);
//         addLog('Victory! All enemies defeated!', 'success');
//         await saveAllyStatus();
        
//         if (userId) {
//           const totalBP = enemies.reduce((sum, enemy) => sum + (enemy.bp || 5), 0);
//           const result = await awardBreakerPoints(userId, totalBP, `defeated ${enemies.length} enemies`);
//           if (result) {
//             setBPResult(result);
//             setShowBPNotification(true);
//             setTimeout(() => setShowBPNotification(false), result.leveledUp ? 10000 : 6000);
//           }
//         }
//         setTimeout(() => { if (page.next) router.push(`/adventure/${page.next}`); }, 8000);
//       }
//     };
//     checkBattleEnd();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [playerHP, enemies, battleEnded]);

//   const saveAllyStatus = async () => {
//     if (!userId || allies.length === 0) return;
//     for (const ally of allies) {
//       await updateNPCCombatHP(userId, ally.name, ally.currentHP);
//     }
//   };

//   const HPBar = ({ current, max, color, label }) => {
//     const percentage = Math.max(0, (current / max) * 100);
//     return (
//       <div className="w-full">
//          <div className="flex justify-between text-[10px] text-gray-400 mb-0.5 px-1">
//           <span>{label}</span>
//           <span>{current}/{max}</span>
//         </div>
//         <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden border border-gray-600">
//           <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
//         </div>
//       </div>
//     );
//   };

//   const consumables = inventory.filter(item => item.type === 'Consumable');
//   const weapons = inventory.filter(item => item.type === 'Weapon');
  
//   const currentTurnType = turnOrder[currentTurnIndex]?.type || 'player';

//   return (
//     <>
//       {/* CSS Injection to force Dice Box Canvas to fit correctly */}
//       <style jsx global>{`
//         #dice-box canvas {
//           width: 100% !important;
//           height: 100% !important;
//           object-fit: contain;
//         }
//       `}</style>

//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 lg:p-16 pointer-events-none">
//         <div className="display h-auto w-full max-w-md md:max-w-5xl h-[100dvh] md:h-full md:max-h-[90vh] flex flex-col bg-slate-950/95 md:bg-slate-950/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden pointer-events-auto rounded-none md:rounded-lg">
          
//           {/* Header */}
//           <header className="bg-slate-900/50 border-b border-slate-700/50 p-2 md:p-3 shrink-0 flex justify-between items-center">
//             <h1 className="text-sm md:text-lg font-bold text-slate-100 shadow-black drop-shadow-md truncate max-w-[50%]">{page.title}</h1>
//             <div className="flex items-center gap-1 md:gap-2">
//               <div className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
//                 playerStance === 'defensive' ? 'bg-blue-900/60 border-blue-500 text-blue-200' :
//                 playerStance === 'aggressive' ? 'bg-red-900/60 border-red-500 text-red-200' :
//                 'bg-gray-900/60 border-gray-500 text-gray-200'
//               }`}>
//                 {playerStance === 'defensive' ? 'DEF' : playerStance === 'aggressive' ? 'AGG' : 'NOR'}
//               </div>
              
//               <div className={`px-2 md:px-3 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
//                 battleEnded 
//                   ? (playerHP > 0 ? "bg-green-900/60 border-green-600 text-green-200" : "bg-red-900/60 border-red-600 text-red-200")
//                   : (currentTurnType === 'player' 
//                       ? "bg-blue-900/60 border-blue-500 text-blue-200 animate-pulse" 
//                       : currentTurnType === 'ally'
//                       ? "bg-teal-900/60 border-teal-500 text-teal-200"
//                       : "bg-orange-900/60 border-orange-500 text-orange-200")
//               }`}>
//                 {battleEnded 
//                   ? (playerHP > 0 ? "Victory" : "Defeat") 
//                   : (currentTurnType === 'player' ? "Your Turn" : currentTurnType === 'ally' ? "Ally Turn" : "Enemy Turn")}
//               </div>
//             </div>
//           </header>

//           {/* Main Content */}
//           <div className="flex-1 overflow-y-auto p-2 md:p-5 space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 max-h-fit">
            
//             {/* LEFT COLUMN: Stats, Allies, Dice */}
//             <div className="flex flex-col gap-2 md:gap-3 shrink-0">
//               {/* Player Card */}
//               <div className="bg-slate-900/60 p-2 md:p-3 border border-blue-500/30">
//                 <div className="flex justify-between items-center mb-1">
//                   <div className="flex items-center gap-2 font-bold text-sm text-blue-100">
//                     <User className="w-3 h-3 md:w-4 md:h-4 text-blue-400" /> {player.name}
//                   </div>
//                   <span className="text-[10px] md:text-xs text-slate-400 bg-slate-800 px-2 py-0.5 border border-slate-700">AC: {player.AC}</span>
//                 </div>
//                 <HPBar current={playerHP} max={maxHP} color="bg-green-600" label="LP" />
//                 {equippedWeapon && (
//                   <div className="mt-1 text-[10px] md:text-xs flex items-center gap-1 text-green-400">
//                     <Sword size={10} /> {equippedWeapon.name} <span className="text-slate-500">({equippedWeapon.stats?.damage})</span>
//                   </div>
//                 )}
//               </div>

//               {/* Allies - NOW HORIZONTAL SCROLL ON DESKTOP TOO */}
//               {allies.length > 0 && (
//                 <div className="relative">
//                   <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
//                       <Users size={10} /> Allies ({allies.filter(a=>a.currentHP>0).length})
//                   </div>
//                   <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
//                     {allies.map(ally => (
//                       <div key={ally.id} className={`flex-none w-[140px] md:w-[160px] p-2 border snap-start ${ally.currentHP > 0 ? 'bg-slate-900/40 border-slate-700' : 'bg-red-900/20 border-red-900 opacity-60'}`}>
//                         <div className="flex justify-between text-[10px] md:text-xs text-slate-300 mb-1">
//                           <span className="font-bold truncate">{ally.name}</span>
//                           <span>AC: {ally.ac}</span>
//                         </div>
//                         <HPBar current={ally.currentHP} max={ally.maxHP} color="bg-teal-600" label="LP" />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Dice Box */}
//               <div className="h-28 md:h-48 w-full bg-slate-900/40 border-2 border-dashed border-slate-700/50 relative overflow-hidden shrink-0">
//                 <div id="dice-box" ref={containerRef} className="w-full h-full p-1" />
//               </div>

//               {/* Stance Buttons */}
//               <div className="grid grid-cols-3 gap-1 md:gap-2">
//                 {['defensive', 'normal', 'aggressive'].map((stance) => (
//                   <button
//                     key={stance}
//                     onClick={() => setPlayerStance(stance)}
//                     disabled={!isPlayerTurn || battleEnded}
//                     className={`px-1 py-2 md:px-2 md:py-3 text-[10px] md:text-xs font-bold transition-all ${
//                       playerStance === stance
//                         ? (stance === 'defensive' ? 'bg-blue-700 border-blue-500' : stance === 'aggressive' ? 'bg-red-700 border-red-500' : 'bg-gray-600 border-gray-400') + ' text-white border-2'
//                         : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
//                     } disabled:opacity-50`}
//                   >
//                     {stance.charAt(0).toUpperCase() + stance.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* RIGHT COLUMN: Enemies, Text, Log */}
//             <div className="flex flex-col gap-2 md:gap-3 min-h-0 flex-1">
              
//               {/* Enemy List */}
//               <div className="bg-slate-900/60 border border-red-900/30 p-2 max-h-32 md:max-h-48 overflow-y-auto shrink-0">
//                 <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between sticky top-0 bg-slate-900/90 z-10">
//                   <span>Enemies ({enemies.filter(e => e.currentHP > 0).length} Alive)</span>
//                   {enemies.length > 1 && <span className="text-[9px]">Click to target</span>}
//                 </div>
                
//                 <div className="space-y-1 md:space-y-2">
//                   {enemies.map((enemy, idx) => (
//                     <button
//                       key={enemy.id}
//                       onClick={() => enemy.currentHP > 0 && setCurrentEnemyIndex(idx)}
//                       disabled={enemy.currentHP <= 0}
//                       className={`w-full text-left p-1.5 md:p-2 flex items-center justify-between border transition-all ${
//                         idx === currentEnemyIndex 
//                           ? 'bg-red-900/30 border-red-500 ring-1 ring-red-500/50' 
//                           : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
//                       } ${enemy.currentHP <= 0 ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
//                     >
//                       <div className="flex-1">
//                         <div className="flex justify-between items-center mb-0.5">
//                           <span className={`text-xs md:text-sm font-bold ${idx === currentEnemyIndex ? 'text-red-200' : 'text-slate-300'}`}>
//                             {idx === currentEnemyIndex && <Target className="inline w-3 h-3 mr-1 text-red-500"/>}
//                             {enemy.name}
//                           </span>
//                           <span className="text-[9px] md:text-[10px] text-slate-500">AC: {enemy.ac}</span>
//                         </div>
//                         <div className="w-full bg-gray-800 rounded-full h-1 md:h-1.5">
//                           <div className="bg-red-600 h-1 md:h-1.5 rounded-full transition-all" style={{ width: `${(enemy.currentHP / enemy.maxHP) * 100}%` }} />
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Story Text */}
//               {/* <div className="bg-slate-800/30 p-2 text-xs md:text-sm text-slate-300 border border-white/5 rounded shrink-0">
//                 <p className="line-clamp-2 md:line-clamp-none italic text-slate-400">{page.text}</p>
//               </div> */}

//               {/* Battle Log - UPDATED: flex-1 allows it to fill the gap on mobile */}
//               <div className="battle-log h-24 md:h-auto md:flex-1 md:min-h-[150px] bg-black/40 border border-slate-700/50 p-2 flex flex-col relative overflow-hidden">
//               {/* <div className="battle-log flex-1 min-h-[100px] bg-black/40 border border-slate-700/50 rounded p-2 flex flex-col relative overflow-hidden"> */}
//                 <span className="text-[9px] md:text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider sticky top-0 bg-black/20 w-full">Combat Log</span>
//                 <div className="overflow-y-auto space-y-0.5 md:space-y-1 pr-1 flex-1">
//                   {gameLog.slice().reverse().map((log) => (
//                     <div key={log.id} className={`text-[10px] md:text-[11px] p-1 md:p-1.5 border-l-2 ${
//                       log.type === 'success' ? 'border-green-500 text-green-300 bg-green-900/10' :
//                       log.type === 'fail' ? 'border-red-500 text-red-300 bg-red-900/10' :
//                       log.type === 'damage' ? 'border-orange-500 text-orange-300 bg-orange-900/10' :
//                       log.type === 'heal' ? 'border-blue-500 text-blue-300 bg-blue-900/10' :
//                       log.type === 'enemy' ? 'border-yellow-500 text-yellow-300 bg-yellow-900/10' :
//                       log.type === 'roll' ? 'border-purple-500 text-purple-300 bg-purple-900/10' :
//                       'border-slate-600 text-slate-400'
//                     }`}>
//                       {log.message}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer Actions */}
//           <div className={`p-2 md:p-3 bg-slate-900/90 border-t border-slate-700/50 grid ${environmentalAction && !environmentalActionUsed ? 'grid-cols-4' : 'grid-cols-3'} gap-2 shrink-0 z-20`}>
//             <div className="relative group">
//               <button
//                 onClick={() => setShowAttackMenu(!showAttackMenu)}
//                 disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//                 className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-red-900 active:border-b-0 active:scale-95 transition-all"
//               >
//                 <Swords className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />
//                 <span className="text-[10px] md:text-xs">ATTACK</span>
//               </button>
              
//               {showAttackMenu && isPlayerTurn && !battleEnded && (
//                 <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 border border-orange-500 shadow-xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2">
//                   <button onClick={() => handleAttack('light')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-green-300 border-b border-white/10">Light (+2 Hit, -2 Dmg)</button>
//                   <button onClick={() => handleAttack('normal')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-white border-b border-white/10">Normal</button>
//                   <button onClick={() => handleAttack('heavy')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-red-300">Heavy (-2 Hit, +4 Dmg)</button>
//                 </div>
//               )}
//             </div>

//             <div className="relative group">
//               <button
//                 onClick={() => setShowMagicMenu(!showMagicMenu)}
//                 disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//                 className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-purple-900 active:border-b-0 active:scale-95 transition-all"
//               >
//                 <Sparkles className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />
//                 <span className="text-[10px] md:text-xs">MAGIC</span>
//               </button>

//               {showMagicMenu && isPlayerTurn && !battleEnded && (
//                 <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 border border-purple-500 shadow-xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2">
//                   <button onClick={() => handleMagic('light')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-cyan-300 border-b border-white/10">Minor (+2 Hit)</button>
//                   <button onClick={() => handleMagic('normal')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-white border-b border-white/10">Standard</button>
//                   <button onClick={() => handleMagic('heavy')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-purple-300">Powerful (-2 Hit)</button>
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={() => setShowInventory(true)}
//               disabled={!isPlayerTurn || battleEnded || selectedAction || consumables.length === 0}
//               className="flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-green-900 active:border-b-0 active:scale-95 transition-all"
//             >
//               <Package className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />
//               <span className="text-[10px] md:text-xs">ITEMS</span>
//             </button>

//             {environmentalAction && !environmentalActionUsed && (
//               <button
//                 onClick={handleEnvironmental}
//                 disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//                 className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 px-1 font-bold shadow-lg border-b-4 border-emerald-900 active:border-b-0 active:scale-95 transition-all"
//                 title={environmentalAction.description}
//               >
//                 <span className="text-base md:text-xl mb-0.5 md:mb-1">{environmentalAction.icon}</span>
//                 <span className="text-[8px] md:text-[10px] leading-tight truncate w-full text-center">{environmentalAction.name.split(' ')[0]}</span>
//               </button>
//             )}
//           </div>
//         </div>

//         <AnimatePresence>
//           {showInventory && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 pointer-events-auto backdrop-blur-sm"
//               onClick={() => setShowInventory(false)}
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 onClick={(e) => e.stopPropagation()}
//                 className="bg-slate-900 border-2 border-slate-700 p-4 max-w-md w-full mx-4 shadow-2xl"
//               >
//                 <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
//                   <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                     <Package size={20} /> Inventory
//                   </h3>
//                   <button onClick={() => setShowInventory(false)}>
//                     <X className="text-gray-400 hover:text-white" size={24} />
//                   </button>
//                 </div>

//                 <div className="space-y-2 max-h-[60vh] overflow-y-auto">
//                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Consumables</div>
//                   {consumables.length === 0 && <p className="text-slate-600 italic text-sm">No consumables.</p>}
                  
//                   {consumables.map(item => (
//                     <button
//                       key={item.id}
//                       onClick={() => handleUseItem(item)}
//                       className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors flex items-center gap-3 group"
//                     >
//                       <div className="bg-slate-900 p-2 group-hover:bg-slate-800">
//                         {item.icon ? <item.icon className="text-green-400" size={16} /> : <Heart className="text-green-400" size={16} />}
//                       </div>
//                       <div>
//                         <div className="font-bold text-white text-sm">{item.name}</div>
//                         <div className="text-xs text-gray-400">{item.description}</div>
//                       </div>
//                     </button>
//                   ))}

//                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2">Weapons</div>
//                   {weapons.map(item => (
//                     <button
//                       key={item.id}
//                       onClick={() => handleUseItem(item)}
//                       className={`w-full text-left p-3 border transition-colors flex items-center gap-3 ${
//                         equippedWeapon?.id === item.id
//                           ? 'bg-blue-900/30 border-blue-500'
//                           : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
//                       }`}
//                     >
//                        <div className="bg-slate-900 p-2">
//                         <Sword className="text-orange-400" size={16} />
//                       </div>
//                       <div className="flex-1">
//                         <div className="font-bold text-white text-sm flex justify-between">
//                           {item.name}
//                           {equippedWeapon?.id === item.id && <span className="text-[10px] bg-blue-600 px-1.5 flex items-center">EQUIPPED</span>}
//                         </div>
//                         <div className="text-xs text-gray-400">Damage: {item.stats?.damage || '1d8'}</div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//           {showBPNotification && bpResult && (
//             <BPNotification
//               result={bpResult}
//               onClose={() => setShowBPNotification(false)}
//             />
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// };

// export default BattleSystem;











// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { Sword, Sparkles, Package, Heart, Shield, X, Swords, Target, Skull, User, Users } from 'lucide-react';
// import DiceBox from "@3d-dice/dice-box";
// import { useRouter } from "next/navigation";
// import { updatePlayerHP } from '../lib/hpModifier';
// import { getUnlockedEquipment, useConsumable } from '../components/Equipment';
// import { awardBreakerPoints } from '../lib/breakerPointsService';
// import { BPNotification } from '../components/BPNotification';
// import { motion, AnimatePresence } from 'framer-motion';
// import { environmentalActions } from '../lib/environmentalActions';
// import { hasUsedEnvironmentalAction, markEnvironmentalActionUsed } from '../lib/environmentalService';
// import { recordTookEnvironmentalPotion } from '../lib/progressService';
// import { getNPCCombatStats, updateNPCCombatHP } from "../lib/npcCombatService";

// // ADDED: playerName prop
// const BattleSystem = ({ userStats, playerName, page, userId, pageId }) => {
//   const diceBoxRef = useRef(null);
//   const containerRef = useRef(null);
//   const router = useRouter();
  
//   // Ref to prevent double-execution of NPC turns
//   const turnInProgress = useRef(false);

//   const [gameLog, setGameLog] = useState([]);
  
//   // Player Stats
//   const [playerHP, setPlayerHP] = useState(userStats?.HP || 20);
//   const [maxHP, setMaxHP] = useState(userStats?.MaxHP || 20);
//   const [playerStance, setPlayerStance] = useState('normal'); 
//   const [playerMissNextTurn, setPlayerMissNextTurn] = useState(false);

//   // Combat State
//   const [enemies, setEnemies] = useState([]);
//   const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
//   const [allies, setAllies] = useState([]);
//   const [turnOrder, setTurnOrder] = useState([]);
//   const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  
//   // UI State
//   const [isPlayerTurn, setIsPlayerTurn] = useState(false); 
//   const [battleEnded, setBattleEnded] = useState(false);
//   const [selectedAction, setSelectedAction] = useState(null);
//   const [isRolling, setIsRolling] = useState(false);
  
//   // Menus & Items
//   const [inventory, setInventory] = useState([]);
//   const [showInventory, setShowInventory] = useState(false);
//   const [equippedWeapon, setEquippedWeapon] = useState(null);
//   const [showAttackMenu, setShowAttackMenu] = useState(false);
//   const [showMagicMenu, setShowMagicMenu] = useState(false);
  
//   // Environmental & Rewards
//   const [bpResult, setBPResult] = useState(null);
//   const [showBPNotification, setShowBPNotification] = useState(false);
//   const [environmentalActionUsed, setEnvironmentalActionUsed] = useState(false);
//   const [environmentalAction, setEnvironmentalAction] = useState(null);

//   // --- HELPERS ---

//   const getModifier = (stat) => Math.floor((stat - 10) / 2);
//   const rollSimple = (sides = 20) => Math.floor(Math.random() * sides) + 1;

//   // Function to move to the next turn index
//   const advanceTurn = () => {
//     setTurnOrder(prevOrder => {
//       if (prevOrder.length === 0) return prevOrder;
//       const nextIndex = (currentTurnIndex + 1) % prevOrder.length;
//       setCurrentTurnIndex(nextIndex);
//       return prevOrder;
//     });
//   };

//   // --- INITIALIZATION ---

//   useEffect(() => {
//     const loadEnvironmental = async () => {
//       if (userId && page.environment) {
//         const used = await hasUsedEnvironmentalAction(userId, pageId);
//         setEnvironmentalActionUsed(used);
//         setEnvironmentalAction(environmentalActions[page.environment]);
//       }
//     };
//     loadEnvironmental();
//   }, [userId, page.environment, pageId]);

//   useEffect(() => {
//     const initializeCombat = async () => {
//       // 1. Initialize Enemies
//       let enemyList = [];
//       if (page.enemies) {
//         if (page.enemies.count && page.enemies.template) {
//           for (let i = 0; i < page.enemies.count; i++) {
//             enemyList.push({
//               ...page.enemies.template,
//               id: `enemy_${i}`,
//               name: `${page.enemies.template.name} ${i + 1}`,
//               currentHP: page.enemies.template.maxHP,
//               isAlive: true
//             });
//           }
//         } else if (Array.isArray(page.enemies)) {
//           enemyList = page.enemies.map((enemy, i) => ({
//             ...enemy,
//             id: `enemy_${i}`,
//             currentHP: enemy.maxHP,
//             isAlive: true
//           }));
//         }
//       } else if (page.enemy) {
//         enemyList = [{
//           ...page.enemy,
//           id: 'enemy_0',
//           currentHP: page.enemy.maxHP,
//           isAlive: true
//         }];
//       }
//       setEnemies(enemyList);
      
//       // 2. Initialize Allies
//       const allyList = [];
//       if (userId && page.allies && Array.isArray(page.allies)) {
//         for (const allyName of page.allies) {
//           const allyStats = await getNPCCombatStats(userId, allyName);
//           if (allyStats && allyStats.alive) {
//             allyList.push({ ...allyStats, id: `ally_${allyName}`, isAlly: true });
//           }
//         }
//         setAllies(allyList);
//       }
      
//       // 3. Initiative
//       let participants = [];
//       const playerAthletics = userStats?.Athletics || 10;
//       let playerInit = rollSimple(20) + getModifier(playerAthletics);
      
//       if (page.initiative === 'player') playerInit += 1000;
//       if (page.initiative === 'enemy') playerInit -= 1000;
      
//       // UPDATED: Use playerName prop
//       participants.push({ type: 'player', id: 'player', val: playerInit, name: playerName || "You" });

//       allyList.forEach(ally => {
//         const score = rollSimple(20) + getModifier(ally.athletics || 10);
//         participants.push({ type: 'ally', id: ally.id, val: score, name: ally.name });
//       });

//       enemyList.forEach(enemy => {
//         let score = (typeof enemy.initiative === 'number') ? enemy.initiative : rollSimple(20) + (enemy.initiativeMod || 0);
//         participants.push({ type: 'enemy', id: enemy.id, val: score, name: enemy.name });
//       });

//       participants.sort((a, b) => b.val - a.val);
//       setTurnOrder(participants);
//       setCurrentTurnIndex(0);
      
//       // Set initial state based on winner
//       if (participants.length > 0 && participants[0].type === 'player') {
//         setIsPlayerTurn(true);
//       } else {
//         setIsPlayerTurn(false);
//       }
//     };
    
//     initializeCombat();
//   }, [userId, page, userStats, playerName]); // Added playerName to deps

//   useEffect(() => {
//     const loadInventory = async () => {
//       if (userId) {
//         const items = await getUnlockedEquipment(userId);
//         setInventory(items);
//         const weapon = items.find(item => item.type === 'Weapon');
//         if (weapon) setEquippedWeapon(weapon);
//       }
//     };
//     loadInventory();
//   }, [userId]);

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const dice = new DiceBox("#dice-box", {
//       assetPath: "/dice-box-assets/",
//       scale: 16,
//       size: 6,
//       gravity: 11,
//       lightIntensity: 1,
//       perspective: true,
//       theme: "smooth",
//       themeColor: "#a60d0d",
//       shadowOpacity: 1,
//       throwForce: 0.02,
//     });
//     dice.init().then(() => diceBoxRef.current = dice);
//   }, []);

//   // --- STAT HELPERS ---

//   const player = {
//     name: playerName || "My Guy", // Fallback if prop missing
//     maxHP: maxHP,
//     athletics: userStats?.Athletics || 10,
//     essence: userStats?.Essence || 10,
//     thought: userStats?.Thought || 10,
//     fellowship: userStats?.Fellowship || 10,
//     AC: 10 + Math.floor(( (userStats?.Athletics || 10) - 10) / 2) + (playerStance === 'defensive' ? 2 : playerStance === 'aggressive' ? -2 : 0)
//   };

//   const getAttackStat = () => ({ name: 'ATH', value: player.athletics, mod: getModifier(player.athletics) });

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
//     if (!diceBoxRef.current) return Math.floor(Math.random() * sides) + 1;
//     diceBoxRef.current.clear();
//     setIsRolling(true);
//     const roll = await diceBoxRef.current.roll(`1d${sides}`);
//     setIsRolling(false);
//     return roll[0]?.value ?? 1;
//   };

//   const calculateDamage = async (diceCount, diceSides) => {
//     if (!diceBoxRef.current) return Math.floor(Math.random() * (diceCount * diceSides)) + diceCount;
//     diceBoxRef.current.clear();
//     const roll = await diceBoxRef.current.roll(`${diceCount}d${diceSides}`);
//     return roll.reduce((sum, die) => sum + die.value, 0);
//   };

//   const validateTarget = () => {
//     // If current target is dead, find next alive one
//     if (enemies[currentEnemyIndex]?.currentHP <= 0) {
//       const nextAliveIndex = enemies.findIndex(e => e.currentHP > 0);
//       if (nextAliveIndex !== -1) {
//         setCurrentEnemyIndex(nextAliveIndex);
//         return nextAliveIndex;
//       }
//     }
//     return currentEnemyIndex;
//   };

//   // --- PLAYER ACTIONS ---

//   const handleAttack = async (attackType = 'normal') => {
//     if (isRolling) return;
    
//     // Fumble check logic
//     if (playerMissNextTurn) {
//       addLog('You are recovering from a fumble! Turn skipped.', 'fail');
//       setPlayerMissNextTurn(false);
//       setTimeout(() => advanceTurn(), 1500); // FIX: Explicitly advance turn
//       return;
//     }
    
//     setSelectedAction('attack');
//     setShowAttackMenu(false);
    
//     const targetIndex = validateTarget();
//     const targetEnemy = enemies[targetIndex];
//     if (!targetEnemy || targetEnemy.currentHP <= 0) return;

//     const attackStat = getAttackStat();
//     const weaponBonus = equippedWeapon?.stats?.damage ? parseInt(equippedWeapon.stats.damage.replace(/\D/g, '')) || 0 : 0;
    
//     let hitBonus = 0;
//     let damageBonus = 0;
//     let damageDice = { count: 1, sides: 8 };
//     let attackLabel = "attack";
    
//     if (attackType === 'light') { hitBonus = 2; damageBonus = -2; damageDice = { count: 1, sides: 6 }; attackLabel = "light attack"; }
//     else if (attackType === 'heavy') { hitBonus = -2; damageBonus = 4; damageDice = { count: 1, sides: 10 }; attackLabel = "heavy attack"; }
    
//     const stanceDamageBonus = playerStance === 'aggressive' ? 2 : 0;
//     const roll = await rollDice(20);
    
//     if (roll === 1) {
//       addLog(`FUMBLE! Natural 1! You lose your next turn.`, 'fail');
//       setPlayerMissNextTurn(true);
//       setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
//       return;
//     }
    
//     const total = roll + attackStat.mod + weaponBonus + hitBonus;
//     addLog(`${attackLabel.toUpperCase()} vs ${targetEnemy.name}: ${roll} + ${attackStat.mod} + ${weaponBonus} = ${total}`, 'roll');

//     if (total >= targetEnemy.ac || roll === 20) {
//       const baseDamage = await calculateDamage(damageDice.count, damageDice.sides);
//       let totalDamage = Math.max(1, baseDamage + attackStat.mod + weaponBonus + damageBonus + stanceDamageBonus);
//       if (roll === 20) { totalDamage *= 2; addLog(`CRITICAL HIT!`, 'success'); }
      
//       const newEnemies = [...enemies];
//       newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - totalDamage);
//       setEnemies(newEnemies);
      
//       addLog(`Hit! Dealt ${totalDamage} damage to ${targetEnemy.name}!`, 'success');
//       if (newEnemies[targetIndex].currentHP === 0) {
//         addLog(`${targetEnemy.name} has been defeated!`, 'success');
//       }
//     } else {
//       addLog(`Miss! Attack against ${targetEnemy.name} failed.`, 'fail');
//     }

//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn(); // FIX: Explicitly advance turn
//     }, 1500);
//   };

//   const handleMagic = async (spellType = 'normal') => {
//     if (isRolling) return;
//     if (playerMissNextTurn) {
//       addLog('Turn skipped due to fumble.', 'fail');
//       setPlayerMissNextTurn(false);
//       setTimeout(() => advanceTurn(), 1500);
//       return;
//     }
    
//     setSelectedAction('magic');
//     setShowMagicMenu(false);

//     const targetIndex = validateTarget();
//     const targetEnemy = enemies[targetIndex];
//     if (!targetEnemy || targetEnemy.currentHP <= 0) return;

//     const spellStat = getSpellcastingStat();
//     let hitBonus = 0;
//     let damageBonus = 0;
//     let damageDice = { count: 2, sides: 6 };
//     let spellLabel = "spell";
    
//     if (spellType === 'light') { hitBonus = 2; damageBonus = -1; damageDice = { count: 2, sides: 4 }; spellLabel = "minor spell"; }
//     else if (spellType === 'heavy') { hitBonus = -2; damageBonus = 3; damageDice = { count: 3, sides: 6 }; spellLabel = "powerful spell"; }
    
//     const stanceDamageBonus = playerStance === 'aggressive' ? 2 : 0;
//     const roll = await rollDice(20);
    
//     if (roll === 1) {
//       addLog(`FUMBLE! Spell backfires! Lose next turn.`, 'fail');
//       setPlayerMissNextTurn(true);
//       setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
//       return;
//     }
    
//     const total = roll + spellStat.mod + hitBonus;
//     addLog(`CAST ${spellLabel.toUpperCase()} at ${targetEnemy.name}: ${roll} + ${spellStat.mod} = ${total}`, 'roll');

//     if (total >= targetEnemy.ac || roll === 20) {
//       const baseDamage = await calculateDamage(damageDice.count, damageDice.sides);
//       let totalDamage = Math.max(1, baseDamage + spellStat.mod + damageBonus + stanceDamageBonus);
//       if (roll === 20) { totalDamage *= 2; addLog(`CRITICAL HIT!`, 'success'); }
      
//       const newEnemies = [...enemies];
//       newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - totalDamage);
//       setEnemies(newEnemies);
      
//       addLog(`Success! ${totalDamage} magic damage to ${targetEnemy.name}!`, 'success');
//     } else {
//       addLog(`Miss! Spell fizzles against ${targetEnemy.name}.`, 'fail');
//     }

//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn(); // FIX: Explicitly advance turn
//     }, 1500);
//   };

//   const handleEnvironmental = async () => {
//     if (isRolling || !environmentalAction) return;
    
//     const targetIndex = validateTarget();
//     const targetEnemy = enemies[targetIndex];
    
//     setSelectedAction('environmental');
//     const stat = userStats[environmentalAction.stat] || 10;
//     const mod = getModifier(stat);
//     const roll = await rollDice(20);
    
//     if (roll === 1) {
//       addLog(`FUMBLE! Environmental action failed badly!`, 'fail');
//       setPlayerMissNextTurn(true);
//       await markEnvironmentalActionUsed(userId, pageId);
//       setEnvironmentalActionUsed(true);
//       setTimeout(() => { setSelectedAction(null); advanceTurn(); }, 1500);
//       return;
//     }
    
//     const total = roll + mod;
//     addLog(`Attempting ${environmentalAction.name}... Roll: ${roll} + ${mod} = ${total}`, 'roll');

//     if (total >= environmentalAction.dc || roll === 20) {
//       let damage = await calculateDamage(environmentalAction.damage.dice, environmentalAction.damage.sides);
//       if (roll === 20) damage *= 2;
      
//       const newEnemies = [...enemies];
//       newEnemies[targetIndex].currentHP = Math.max(0, targetEnemy.currentHP - damage);
//       setEnemies(newEnemies);

//       addLog(`Success! ${environmentalAction.name} deals ${damage} damage to ${targetEnemy.name}!`, 'success');
//       if (environmentalAction.effect) addLog(environmentalAction.effect, 'success');
//     } else {
//       addLog(`Failed! ${environmentalAction.name} misses!`, 'fail');
//     }

//     await markEnvironmentalActionUsed(userId, pageId);
//     setEnvironmentalActionUsed(true);
//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn(); // FIX: Explicitly advance turn
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
//         setPlayerHP(newHP);
//         setMaxHP(Math.max(maxHP, newHP));
//         addLog(`Used ${item.name}, restored ${healAmount} HP!`, 'heal');
//       } else if (item.id === 'environment_potion') {
//         await recordTookEnvironmentalPotion(userId);
//         addLog(`Drank ${item.name}. Effects negated!`, 'heal');
//       }
//       const result = await useConsumable(userId, item.id);
//       if (result.success && result.consumed) {
//         setInventory(prev => prev.filter(i => i.id !== item.id));
//       }
//     } else if (item.type === 'Weapon') {
//       setEquippedWeapon(item);
//       addLog(`Equipped ${item.name}!`, 'success');
//     }

//     setTimeout(() => { 
//       setSelectedAction(null); 
//       advanceTurn(); // FIX: Explicitly advance turn
//     }, 1500);
//   };

//   // --- TURN SYSTEM LOOP ---

//   useEffect(() => {
//     // This Effect strictly handles NPC turn execution
//     // It runs whenever the turn index changes
    
//     if (battleEnded || turnOrder.length === 0) return;

//     const currentTurn = turnOrder[currentTurnIndex];
//     if (!currentTurn) return;

//     // IF PLAYER: Just unlock UI
//     if (currentTurn.type === 'player') {
//       setIsPlayerTurn(true);
//       turnInProgress.current = false;
//       return;
//     }

//     // IF NPC: Lock UI and Execute
//     setIsPlayerTurn(false);
    
//     // Prevent double execution using ref
//     if (turnInProgress.current) return;
//     turnInProgress.current = true;
    
//     const executeTurn = async () => {
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Check if battle ended mid-wait
//       if (battleEnded) return;

//       if (currentTurn.type === 'ally') {
//         const ally = allies.find(a => a.id === currentTurn.id);
//         if (ally && ally.currentHP > 0) {
//           const livingEnemies = enemies.filter(e => e.currentHP > 0);
//           if (livingEnemies.length > 0) {
//             const target = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
//             await performAllyTurn(ally, target);
//           } else {
//              addLog(`${ally.name} looks around...`, 'normal');
//           }
//         }
//       } 
//       else if (currentTurn.type === 'enemy') {
//         const enemy = enemies.find(e => e.id === currentTurn.id);
//         if (enemy && enemy.currentHP > 0) {
//           await performEnemyTurn(enemy);
//         }
//       }
      
//       // Advance to next turn automatically
//       await new Promise(resolve => setTimeout(resolve, 800));
//       turnInProgress.current = false; // Reset lock before state change
//       advanceTurn();
//     };
    
//     executeTurn();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentTurnIndex, battleEnded, turnOrder]); 
//   // IMPORTANT: Removed 'enemies' and 'allies' from deps to prevent re-execution on damage

//   const performAllyTurn = async (ally, target) => {
//     const attackStat = Math.floor((ally.athletics - 10) / 2);
//     const roll = await rollDice(20);
//     const total = roll + attackStat;
    
//     addLog(`${ally.name} attacks ${target.name}: ${roll} + ${attackStat} = ${total}`, 'success');
    
//     if (total >= target.ac || roll === 20) {
//       let damage = await calculateDamage(1, 8) + attackStat;
//       if (roll === 20) { damage *= 2; addLog(`${ally.name} CRITICAL HIT!`, 'success'); }
      
//       // Functional state update to ensure we have latest enemies list without adding to deps
//       setEnemies(prev => {
//         const newEnemies = [...prev];
//         const idx = newEnemies.findIndex(e => e.id === target.id);
//         if (idx >= 0) {
//           newEnemies[idx].currentHP = Math.max(0, newEnemies[idx].currentHP - damage);
//         }
//         return newEnemies;
//       });
//       addLog(`${ally.name} hits ${target.name} for ${damage}!`, 'success');
//     } else {
//       addLog(`${ally.name} misses ${target.name}.`, 'fail');
//     }
//   };

//   const performEnemyTurn = async (enemy) => {
//     // Note: accessing 'allies' state directly here works because it's a ref in closure 
//     // or we can use functional updates if strictly needed, but reading current state is usually okay here
//     const livingAllies = allies.filter(a => a.currentHP > 0);
//     const hasAllies = livingAllies.length > 0;
    
//     let target = 'player';
//     // 30% chance to attack ally if present
//     if (hasAllies && Math.random() > 0.7) {
//       target = livingAllies[Math.floor(Math.random() * livingAllies.length)];
//     }

//     const roll = await rollDice(20);
//     const total = roll + (enemy.attack || 0);

//     if (target === 'player') {
//       const currentPlayerAC = 10 + Math.floor(((userStats?.Athletics || 10) - 10) / 2) + 
//         (playerStance === 'defensive' ? 2 : playerStance === 'aggressive' ? -2 : 0);
      
//       addLog(`${enemy.name} attacks YOU: ${roll} + ${enemy.attack} = ${total}`, 'enemy');
      
//       if (total >= currentPlayerAC || roll === 20) {
//         let damage = await calculateDamage(1, 6) + (enemy.attack || 0);
//         if (roll === 20) { damage *= 2; addLog(`Enemy CRITICAL HIT!`, 'damage'); }
        
//         setPlayerHP(prev => Math.max(0, prev - damage));
//         addLog(`${enemy.name} hits you for ${damage} damage!`, 'damage');
//       } else {
//         addLog(`${enemy.name} misses you!`, 'success');
//       }
//     } else {
//       addLog(`${enemy.name} attacks ${target.name}: ${roll} + ${enemy.attack} = ${total}`, 'enemy');
//       if (total >= target.ac || roll === 20) {
//         let damage = await calculateDamage(1, 6) + (enemy.attack || 0);
        
//         setAllies(prev => {
//           const newAllies = [...prev];
//           const idx = newAllies.findIndex(a => a.id === target.id);
//           if (idx >= 0) {
//             newAllies[idx].currentHP = Math.max(0, newAllies[idx].currentHP - damage);
//           }
//           return newAllies;
//         });
        
//         addLog(`${enemy.name} hits ${target.name} for ${damage}!`, 'damage');
//       } else {
//         addLog(`${enemy.name} misses ${target.name}!`, 'success');
//       }
//     }
//   };

//   // --- VICTORY / DEFEAT ---

//   useEffect(() => {
//     const checkBattleEnd = async () => {
//       // Save Player HP
//       if (userId) await updatePlayerHP(userId, playerHP, maxHP);
      
//       // Defeat
//       if (playerHP <= 0 && !battleEnded) {
//         setBattleEnded(true);
//         addLog('You have been defeated...', 'fail');
//         await saveAllyStatus();
//         setTimeout(() => { if (page.fail) router.push(`/adventure/${page.fail}`); }, 3000);
//       } 
//       // Victory
//       else if (enemies.length > 0 && enemies.every(e => e.currentHP <= 0) && !battleEnded) {
//         setBattleEnded(true);
//         addLog('Victory! All enemies defeated!', 'success');
//         await saveAllyStatus();
        
//         if (userId) {
//           const totalBP = enemies.reduce((sum, enemy) => sum + (enemy.bp || 5), 0);
//           const result = await awardBreakerPoints(userId, totalBP, `defeated ${enemies.length} enemies`);
//           if (result) {
//             setBPResult(result);
//             setShowBPNotification(true);
//             setTimeout(() => setShowBPNotification(false), result.leveledUp ? 10000 : 6000);
//           }
//         }
//         setTimeout(() => { if (page.next) router.push(`/adventure/${page.next}`); }, 8000);
//       }
//     };
//     checkBattleEnd();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [playerHP, enemies, battleEnded]);

//   const saveAllyStatus = async () => {
//     if (!userId || allies.length === 0) return;
//     for (const ally of allies) {
//       await updateNPCCombatHP(userId, ally.name, ally.currentHP);
//     }
//   };

//   // --- RENDER ---
  
//   const HPBar = ({ current, max, color, label }) => {
//     const percentage = Math.max(0, (current / max) * 100);
//     return (
//       <div className="w-full">
//          <div className="flex justify-between text-[10px] text-gray-400 mb-0.5 px-1">
//           <span>{label}</span>
//           <span>{current}/{max}</span>
//         </div>
//         <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden border border-gray-600">
//           <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
//         </div>
//       </div>
//     );
//   };

//   const consumables = inventory.filter(item => item.type === 'Consumable');
//   const weapons = inventory.filter(item => item.type === 'Weapon');
  
//   // Logic to determine what to show in the Turn Header
//   const currentTurnType = turnOrder[currentTurnIndex]?.type || 'player';

//   return (
//     // UPDATED: Reduced padding (p-2 on mobile), increased Z-index, fixed dVH issues
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-12 lg:p-16 pointer-events-none" style={{zIndex:'1'}}>
//       <div className="display w-full max-w-md md:max-w-5xl h-[100dvh] md:h-full md:max-h-[90vh] flex flex-col bg-slate-950/95 md:bg-slate-950/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden pointer-events-auto rounded-none md:rounded-lg">
        
//         {/* Header */}
//         <header className="bg-slate-900/50 border-b border-slate-700/50 p-2 md:p-3 shrink-0 flex justify-between items-center">
//           <h1 className="text-sm md:text-lg font-bold text-slate-100 shadow-black drop-shadow-md truncate max-w-[50%]">{page.title}</h1>
//           <div className="flex items-center gap-1 md:gap-2">
//             <div className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
//               playerStance === 'defensive' ? 'bg-blue-900/60 border-blue-500 text-blue-200' :
//               playerStance === 'aggressive' ? 'bg-red-900/60 border-red-500 text-red-200' :
//               'bg-gray-900/60 border-gray-500 text-gray-200'
//             }`}>
//               {playerStance === 'defensive' ? 'DEF' : playerStance === 'aggressive' ? 'AGG' : 'NOR'}
//             </div>
            
//             <div className={`px-2 md:px-3 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
//               battleEnded 
//                 ? (playerHP > 0 ? "bg-green-900/60 border-green-600 text-green-200" : "bg-red-900/60 border-red-600 text-red-200")
//                 : (currentTurnType === 'player' 
//                     ? "bg-blue-900/60 border-blue-500 text-blue-200 animate-pulse" 
//                     : currentTurnType === 'ally'
//                     ? "bg-teal-900/60 border-teal-500 text-teal-200"
//                     : "bg-orange-900/60 border-orange-500 text-orange-200")
//             }`}>
//               {battleEnded 
//                 ? (playerHP > 0 ? "Victory" : "Defeat") 
//                 : (currentTurnType === 'player' ? "Your Turn" : currentTurnType === 'ally' ? "Ally Turn" : "Enemy Turn")}
//             </div>
//           </div>
//         </header>

//         {/* Main Content - Flex Col for Mobile, Grid for Desktop */}
//         <div className="flex-1 overflow-y-auto p-2 md:p-5 space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          
//           {/* LEFT COLUMN: Stats, Allies, Dice */}
//           <div className="flex flex-col gap-2 md:gap-3 shrink-0">
//             {/* Player Card */}
//             <div className="bg-slate-900/60 p-2 md:p-3 border border-blue-500/30 rounded-lg">
//               <div className="flex justify-between items-center mb-1">
//                 <div className="flex items-center gap-2 font-bold text-sm text-blue-100">
//                   <User className="w-3 h-3 md:w-4 md:h-4 text-blue-400" /> {player.name}
//                 </div>
//                 <span className="text-[10px] md:text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">AC: {player.AC}</span>
//               </div>
//               <HPBar current={playerHP} max={maxHP} color="bg-green-600" label="LP" />
//               {equippedWeapon && (
//                 <div className="mt-1 text-[10px] md:text-xs flex items-center gap-1 text-green-400">
//                   <Sword size={10} /> {equippedWeapon.name} <span className="text-slate-500">({equippedWeapon.stats?.damage})</span>
//                 </div>
//               )}
//             </div>

//             {/* Allies - UPDATED: Horizontal Scroll on Mobile to save vertical space */}
//             {allies.length > 0 && (
//               <div className="relative">
//                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
//                     <Users size={10} /> Allies ({allies.filter(a=>a.currentHP>0).length})
//                  </div>
//                  {/* This wrapper enables horizontal scrolling for allies instead of stacking them */}
//                  <div className="flex md:grid md:grid-cols-2 gap-2 overflow-x-auto pb-2 md:pb-0 snap-x">
//                   {allies.map(ally => (
//                     <div key={ally.id} className={`flex-none w-[140px] md:w-auto p-2 rounded border snap-start ${ally.currentHP > 0 ? 'bg-slate-900/40 border-slate-700' : 'bg-red-900/20 border-red-900 opacity-60'}`}>
//                       <div className="flex justify-between text-[10px] md:text-xs text-slate-300 mb-1">
//                         <span className="font-bold truncate">{ally.name}</span>
//                         <span>AC: {ally.ac}</span>
//                       </div>
//                       <HPBar current={ally.currentHP} max={ally.maxHP} color="bg-teal-600" label="HP" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Dice Box - Smaller on mobile */}
//             <div className="h-24 md:h-48 w-full bg-slate-900/40 border-2 border-dashed border-slate-700/50 relative rounded-lg overflow-hidden shrink-0">
//               <div id="dice-box" ref={containerRef} className="w-full h-full" />
//             </div>

//             {/* Stance Buttons */}
//             <div className="grid grid-cols-3 gap-1 md:gap-2">
//               {['defensive', 'normal', 'aggressive'].map((stance) => (
//                 <button
//                   key={stance}
//                   onClick={() => setPlayerStance(stance)}
//                   disabled={!isPlayerTurn || battleEnded}
//                   className={`px-1 py-1.5 md:px-2 md:py-2 text-[10px] md:text-xs font-bold transition-all rounded ${
//                     playerStance === stance
//                       ? (stance === 'defensive' ? 'bg-blue-700 border-blue-500' : stance === 'aggressive' ? 'bg-red-700 border-red-500' : 'bg-gray-600 border-gray-400') + ' text-white border-2'
//                       : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
//                   } disabled:opacity-50`}
//                 >
//                   {stance.charAt(0).toUpperCase() + stance.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT COLUMN: Enemies, Text, Log */}
//           <div className="flex flex-col gap-2 md:gap-3 min-h-0 flex-1">
            
//             {/* Enemy List - UPDATED: Constrained Max Height on Mobile */}
//             <div className="bg-slate-900/60 border border-red-900/30 rounded-lg p-2 max-h-32 md:max-h-48 overflow-y-auto">
//               <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between sticky top-0 bg-slate-900/90 z-10">
//                 <span>Enemies ({enemies.filter(e => e.currentHP > 0).length} Alive)</span>
//                 {enemies.length > 1 && <span className="text-[9px]">Click to target</span>}
//               </div>
              
//               <div className="space-y-1 md:space-y-2">
//                 {enemies.map((enemy, idx) => (
//                   <button
//                     key={enemy.id}
//                     onClick={() => enemy.currentHP > 0 && setCurrentEnemyIndex(idx)}
//                     disabled={enemy.currentHP <= 0}
//                     className={`w-full text-left p-1.5 md:p-2 rounded flex items-center justify-between border transition-all ${
//                       idx === currentEnemyIndex 
//                         ? 'bg-red-900/30 border-red-500 ring-1 ring-red-500/50' 
//                         : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
//                     } ${enemy.currentHP <= 0 ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
//                   >
//                     <div className="flex-1">
//                       <div className="flex justify-between items-center mb-0.5">
//                         <span className={`text-xs md:text-sm font-bold ${idx === currentEnemyIndex ? 'text-red-200' : 'text-slate-300'}`}>
//                           {idx === currentEnemyIndex && <Target className="inline w-3 h-3 mr-1 text-red-500"/>}
//                           {enemy.name}
//                         </span>
//                         <span className="text-[9px] md:text-[10px] text-slate-500">AC: {enemy.ac}</span>
//                       </div>
//                       <div className="w-full bg-gray-800 rounded-full h-1 md:h-1.5">
//                         <div className="bg-red-600 h-1 md:h-1.5 rounded-full transition-all" style={{ width: `${(enemy.currentHP / enemy.maxHP) * 100}%` }} />
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Story Text */}
//             <div className="bg-slate-800/30 p-2 text-xs md:text-sm text-slate-300 border border-white/5 rounded">
//               <p className="line-clamp-2 md:line-clamp-none italic text-slate-400">{page.text}</p>
//             </div>

//             {/* Battle Log */}
//             <div className="battle-log h-24 md:h-auto md:flex-1 md:min-h-[150px] bg-black/40 border border-slate-700/50 rounded p-2 flex flex-col relative overflow-hidden">
//               <span className="text-[9px] md:text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider sticky top-0 bg-black/20 w-full">Combat Log</span>
//               <div className="overflow-y-auto space-y-0.5 md:space-y-1 pr-1 flex-1">
//                 {gameLog.slice().reverse().map((log) => (
//                   <div key={log.id} className={`text-[10px] md:text-[11px] p-1 md:p-1.5 rounded border-l-2 ${
//                     log.type === 'success' ? 'border-green-500 text-green-300 bg-green-900/10' :
//                     log.type === 'fail' ? 'border-red-500 text-red-300 bg-red-900/10' :
//                     log.type === 'damage' ? 'border-orange-500 text-orange-300 bg-orange-900/10' :
//                     log.type === 'heal' ? 'border-blue-500 text-blue-300 bg-blue-900/10' :
//                     log.type === 'enemy' ? 'border-yellow-500 text-yellow-300 bg-yellow-900/10' :
//                     log.type === 'roll' ? 'border-purple-500 text-purple-300 bg-purple-900/10' :
//                     'border-slate-600 text-slate-400'
//                   }`}>
//                     {log.message}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Actions - Sticky Bottom */}
//         <div className={`p-2 md:p-3 bg-slate-900/90 border-t border-slate-700/50 grid ${environmentalAction && !environmentalActionUsed ? 'grid-cols-4' : 'grid-cols-3'} gap-2 shrink-0 z-20`}>
//           <div className="relative group">
//             <button
//               onClick={() => setShowAttackMenu(!showAttackMenu)}
//               disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//               className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-red-900 active:border-b-0 active:scale-95 transition-all rounded"
//             >
//               <Swords className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />
//               <span className="text-[10px] md:text-xs">ATTACK</span>
//             </button>
            
//             {showAttackMenu && isPlayerTurn && !battleEnded && (
//               <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 border border-orange-500 rounded shadow-xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2">
//                 <button onClick={() => handleAttack('light')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-green-300 border-b border-white/10">Light (+2 Hit, -2 Dmg)</button>
//                 <button onClick={() => handleAttack('normal')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-white border-b border-white/10">Normal</button>
//                 <button onClick={() => handleAttack('heavy')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-red-300">Heavy (-2 Hit, +4 Dmg)</button>
//               </div>
//             )}
//           </div>

//           <div className="relative group">
//             <button
//               onClick={() => setShowMagicMenu(!showMagicMenu)}
//               disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//               className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-purple-900 active:border-b-0 active:scale-95 transition-all rounded"
//             >
//               <Sparkles className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />
//               <span className="text-[10px] md:text-xs">MAGIC</span>
//             </button>

//             {showMagicMenu && isPlayerTurn && !battleEnded && (
//               <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 border border-purple-500 rounded shadow-xl z-30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2">
//                 <button onClick={() => handleMagic('light')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-cyan-300 border-b border-white/10">Minor (+2 Hit)</button>
//                 <button onClick={() => handleMagic('normal')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-white border-b border-white/10">Standard</button>
//                 <button onClick={() => handleMagic('heavy')} className="p-2 md:p-3 text-left hover:bg-white/10 text-xs font-bold text-purple-300">Powerful (-2 Hit)</button>
//               </div>
//             )}
//           </div>

//           <button
//             onClick={() => setShowInventory(true)}
//             disabled={!isPlayerTurn || battleEnded || selectedAction || consumables.length === 0}
//             className="flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 font-bold shadow-lg border-b-4 border-green-900 active:border-b-0 active:scale-95 transition-all rounded"
//           >
//             <Package className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" />
//             <span className="text-[10px] md:text-xs">ITEMS</span>
//           </button>

//           {environmentalAction && !environmentalActionUsed && (
//             <button
//               onClick={handleEnvironmental}
//               disabled={!isPlayerTurn || battleEnded || selectedAction || isRolling}
//               className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed py-2 md:py-3 px-1 font-bold shadow-lg border-b-4 border-emerald-900 active:border-b-0 active:scale-95 transition-all rounded"
//               title={environmentalAction.description}
//             >
//               <span className="text-base md:text-xl mb-0.5 md:mb-1">{environmentalAction.icon}</span>
//               <span className="text-[8px] md:text-[10px] leading-tight truncate w-full text-center">{environmentalAction.name.split(' ')[0]}</span>
//             </button>
//           )}
//         </div>
//       </div>

//       <AnimatePresence>
//         {showInventory && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 pointer-events-auto backdrop-blur-sm"
//             onClick={() => setShowInventory(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-slate-900 border-2 border-slate-700 p-4 max-w-md w-full mx-4 shadow-2xl rounded-lg"
//             >
//               <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
//                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                   <Package size={20} /> Inventory
//                 </h3>
//                 <button onClick={() => setShowInventory(false)}>
//                   <X className="text-gray-400 hover:text-white" size={24} />
//                 </button>
//               </div>

//               <div className="space-y-2 max-h-[60vh] overflow-y-auto">
//                 <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Consumables</div>
//                 {consumables.length === 0 && <p className="text-slate-600 italic text-sm">No consumables.</p>}
                
//                 {consumables.map(item => (
//                   <button
//                     key={item.id}
//                     onClick={() => handleUseItem(item)}
//                     className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors flex items-center gap-3 group rounded"
//                   >
//                     <div className="bg-slate-900 p-2 group-hover:bg-slate-800 rounded">
//                       {item.icon ? <item.icon className="text-green-400" size={16} /> : <Heart className="text-green-400" size={16} />}
//                     </div>
//                     <div>
//                       <div className="font-bold text-white text-sm">{item.name}</div>
//                       <div className="text-xs text-gray-400">{item.description}</div>
//                     </div>
//                   </button>
//                 ))}

//                 <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2">Weapons</div>
//                 {weapons.map(item => (
//                   <button
//                     key={item.id}
//                     onClick={() => handleUseItem(item)}
//                     className={`w-full text-left p-3 border transition-colors flex items-center gap-3 rounded ${
//                       equippedWeapon?.id === item.id
//                         ? 'bg-blue-900/30 border-blue-500'
//                         : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
//                     }`}
//                   >
//                      <div className="bg-slate-900 p-2 rounded">
//                       <Sword className="text-orange-400" size={16} />
//                     </div>
//                     <div className="flex-1">
//                       <div className="font-bold text-white text-sm flex justify-between">
//                         {item.name}
//                         {equippedWeapon?.id === item.id && <span className="text-[10px] bg-blue-600 px-1.5 rounded flex items-center">EQUIPPED</span>}
//                       </div>
//                       <div className="text-xs text-gray-400">Damage: {item.stats?.damage || '1d8'}</div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

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