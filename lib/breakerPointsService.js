// lib/breakerPointsService.js

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * XP required for each level (exponential growth)
 */
export function getXPForLevel(level) {
  // Formula: 100 * (level^1.5)
  // Level 1→2: 100 BP
  // Level 2→3: 283 BP
  // Level 3→4: 520 BP
  // Level 4→5: 800 BP
  // Level 5→6: 1118 BP
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate total XP needed to reach a level
 */
export function getTotalXPForLevel(level) {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

/**
 * Award Breaker Points and handle leveling
 */
export async function awardBreakerPoints(userId, bpAmount, source = "combat") {
  if (!userId || !bpAmount) return null;

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return null;
    
    const userData = userSnap.data();
    const currentBP = userData.stats?.BP || 0;
    const currentLevel = userData.stats?.Level || 1;
    const currentHP = userData.stats?.HP || 20;
    const currentMaxHP = userData.stats?.MaxHP || 20;
    
    const newBP = currentBP + bpAmount;
    let newLevel = currentLevel;
    let leveledUp = false;
    let levelsGained = 0;
    let statIncrease = {};
    
    // Check for level ups
    while (newBP >= getTotalXPForLevel(newLevel + 1)) {
      newLevel++;
      levelsGained++;
      leveledUp = true;
    }
    
    // Calculate stat increases per level
    if (leveledUp) {
      const hpIncrease = levelsGained * 5; // +5 HP per level
      const statPoints = levelsGained * 2; // +2 stat points per level to distribute
      
      statIncrease = {
        HP: currentHP + hpIncrease,
        MaxHP: currentMaxHP + hpIncrease,
        statPointsToAllocate: (userData.statPointsToAllocate || 0) + statPoints
      };
    }
    
    // Update Firestore
    const updates = {
      'stats.BP': newBP,
      'stats.Level': newLevel,
      lastBPSource: source,
      lastBPAmount: bpAmount,
      lastBPTime: new Date()
    };
    
    if (leveledUp) {
      updates['stats.HP'] = statIncrease.HP;
      updates['stats.MaxHP'] = statIncrease.MaxHP;
      updates['statPointsToAllocate'] = statIncrease.statPointsToAllocate;
    }
    
    await updateDoc(userRef, updates);
    
    return {
      success: true,
      bpAwarded: bpAmount,
      newBP,
      currentLevel: newLevel,
      leveledUp,
      levelsGained,
      bpToNextLevel: getTotalXPForLevel(newLevel + 1) - newBP,
      statIncrease,
      source
    };
  } catch (error) {
    console.error("Error awarding BP:", error);
    return null;
  }
}

/**
 * Get current BP progress
 */
export async function getBPProgress(userId) {
  if (!userId) return null;
  
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return null;
    
    const userData = userSnap.data();
    const currentBP = userData.stats?.BP || 0;
    const currentLevel = userData.stats?.Level || 1;
    
    const xpForCurrentLevel = getTotalXPForLevel(currentLevel);
    const xpForNextLevel = getTotalXPForLevel(currentLevel + 1);
    const xpNeededForNext = xpForNextLevel - currentBP;
    const xpInCurrentLevel = currentBP - xpForCurrentLevel;
    const xpRequiredForCurrentLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercent = (xpInCurrentLevel / xpRequiredForCurrentLevel) * 100;
    
    return {
      currentBP,
      currentLevel,
      xpInCurrentLevel,
      xpRequiredForCurrentLevel,
      xpNeededForNext,
      progressPercent: Math.max(0, Math.min(100, progressPercent))
    };
  } catch (error) {
    console.error("Error getting BP progress:", error);
    return null;
  }
}

/**
 * Award BP for completing a page/event
 */
export async function awardPageBP(userId, pageId, bpAmount) {
  // Check if already awarded for this page
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return null;
  
  const bpAwardedPages = userSnap.data().bpAwardedPages || [];
  
  if (bpAwardedPages.includes(pageId)) {
    return { success: false, message: "BP already awarded for this page" };
  }
  
  // Award BP
  const result = await awardBreakerPoints(userId, bpAmount, `page:${pageId}`);
  
  // Mark page as awarded
  await updateDoc(userRef, {
    bpAwardedPages: [...bpAwardedPages, pageId]
  });
  
  return result;
}

/**
 * Calculate BP for enemy difficulty
 */
export function calculateEnemyBP(enemy) {
  // Base BP from enemy stats
  const hpFactor = enemy.maxHP / 10;
  const acFactor = enemy.ac / 2;
  const attackFactor = (enemy.attack || 0) * 2;
  const magicFactor = (enemy.magic || 0) * 2;
  
  const calculatedBP = Math.floor(hpFactor + acFactor + attackFactor + magicFactor);
  
  // Use enemy's specified BP or calculated
  return enemy.bp || Math.max(5, calculatedBP);
}