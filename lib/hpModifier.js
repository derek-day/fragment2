// lib/hpModifier.js

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Update player HP directly (used in Battle System)
 * @param {string} userId - User ID
 * @param {number} currentHP - Current HP value
 * @param {number} maxHP - Maximum HP value
 * @returns {Promise<boolean>} Success status
 */
export async function updatePlayerHP(userId, currentHP, maxHP) {
  if (!userId) return false;

  try {
    const userRef = doc(db, "users", userId);
    
    // Create the update object
    const updates = {
      'stats.HP': currentHP
    };

    // If maxHP is provided, update that as well (to account for healing beyond original max or level ups)
    if (maxHP !== undefined && maxHP !== null) {
      updates['stats.MaxHP'] = maxHP;
    }

    await updateDoc(userRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating player HP:", error);
    return false;
  }
}

/**
 * Apply HP modification on a page (Event based)
 * @param {string} userId - User ID
 * @param {object} modification - HP modification config
 * @returns {Promise<object>} Result with old and new HP values
 */
export async function applyPageHPModification(userId, modification) {
  if (!userId || !modification) return null;

  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return null;
    
    const userData = userSnap.data();
    const currentHP = userData.stats?.HP || 20;
    const maxHP = userData.stats?.MaxHP || 20;
    let newHP = currentHP;
    let message = "";

    switch (modification.type) {
      case 'halve':
        newHP = Math.floor(currentHP / 2);
        message = `Your HP has been halved! (${currentHP} → ${newHP})`;
        break;
        
      case 'subtract':
        newHP = currentHP - modification.amount;
        message = `You lost ${modification.amount} HP! (${currentHP} → ${newHP})`;
        break;
        
      case 'add':
        newHP = Math.min(currentHP + modification.amount, maxHP);
        message = `You gained ${modification.amount} HP! (${currentHP} → ${newHP})`;
        break;
        
      case 'set':
        newHP = modification.amount;
        message = `Your HP is now ${newHP}`;
        break;
        
      case 'percentage':
        newHP = Math.floor(maxHP * (modification.percent / 100));
        message = `Your HP is now ${modification.percent}% of maximum (${newHP})`;
        break;
        
      default:
        return null;
    }

    // Ensure HP doesn't go below 0 or above max (Battle system allows 0 for death logic, but map events usually cap at 1 unless fatal)
    // Modified here to allow 0 if that's the intention, otherwise stick to standard clamping
    newHP = Math.max(0, Math.min(newHP, maxHP));

    await updateDoc(userRef, {
      'stats.HP': newHP
    });

    return {
      success: true,
      oldHP: currentHP,
      newHP,
      maxHP,
      message
    };
  } catch (error) {
    console.error("Error applying HP modification:", error);
    return null;
  }
}

/**
 * Check if page has been visited (to avoid re-applying HP mods)
 * @param {string} userId - User ID
 * @param {string} pageId - Page ID
 * @returns {Promise<boolean>}
 */
export async function hasVisitedPage(userId, pageId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return false;
    
    const visitedPages = userSnap.data().visitedPages || [];
    return visitedPages.includes(pageId);
  } catch (error) {
    console.error("Error checking visited pages:", error);
    return false;
  }
}

/**
 * Mark page as visited
 * @param {string} userId - User ID
 * @param {string} pageId - Page ID
 */
export async function markPageVisited(userId, pageId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return;
    
    const visitedPages = userSnap.data().visitedPages || [];
    if (!visitedPages.includes(pageId)) {
      await updateDoc(userRef, {
        visitedPages: [...visitedPages, pageId]
      });
    }
  } catch (error) {
    console.error("Error marking page visited:", error);
  }
}