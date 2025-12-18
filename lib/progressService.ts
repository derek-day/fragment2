import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Types
interface PlayerProgress {
  // Combat tracking
  failedCombats?: string[];  // Array of battle page IDs
  failedRolls?: string[];    // Array of roll page IDs
  
  // NPC tracking
  deadNPCs?: string[];       // Array of NPC names
  metNPCs?: string[];        // Array of NPC names player has met
  npcRelationships?: {       // NPC relationship scores
    [npcName: string]: number;
  };
  
  // Player choices
  wentAlone?: boolean;       // Entered area without team
  characterName?: string;    // Character they're playing as
  toldTeamAbout?: string[];  // Names mentioned to team
  
  // Death tracking
  deaths?: number;           // Number of times died
  revivals?: number;         // Number of times revived
  deathLocations?: string[]; // Where they died
  
  // Route tracking
  route?: string;            // Current route (alone, team, etc.)
  completedRoutes?: string[]; // All routes completed
  
  // General progress
  currentPage?: string;      // Last page visited
  visitedPages?: string[];   // All pages visited
  lastUpdated?: Date;
}

// Initialize or get player progress
export async function getPlayerProgress(userId: string): Promise<PlayerProgress> {
  try {
    const progressRef = doc(db, 'users', userId);
    const progressSnap = await getDoc(progressRef);
    
    if (progressSnap.exists()) {
      return progressSnap.data() as PlayerProgress;
    }
    
    // Initialize new progress
    const initialProgress: PlayerProgress = {
      failedCombats: [],
      failedRolls: [],
      deadNPCs: [],
      metNPCs: [],
      npcRelationships: {},
      toldTeamAbout: [],
      deaths: 0,
      revivals: 0,
      deathLocations: [],
      completedRoutes: [],
      visitedPages: [],
      wentAlone: false,
      lastUpdated: new Date()
    };
    
    await setDoc(progressRef, initialProgress);
    return initialProgress;
  } catch (error) {
    console.error('Error getting player progress:', error);
    throw error;
  }
}

// Track combat failure
export async function recordCombatFailure(userId: string, battlePageId: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  await updateDoc(ref, {
    failedCombats: [...(progress.failedCombats || []), battlePageId],
    lastUpdated: new Date()
  });
  
  console.log(`📉 Recorded combat failure at ${battlePageId}`);
}

// Track roll failure
export async function recordRollFailure(userId: string, rollPageId: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  await updateDoc(ref, {
    failedRolls: [...(progress.failedRolls || []), rollPageId],
    lastUpdated: new Date()
  });
  
  console.log(`🎲 Recorded roll failure at ${rollPageId}`);
}

// Track NPC death
export async function recordNPCDeath(userId: string, npcName: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  // Only add if not already dead
  if (!progress.deadNPCs?.includes(npcName)) {
    await updateDoc(ref, {
      deadNPCs: [...(progress.deadNPCs || []), npcName],
      lastUpdated: new Date()
    });
    
    console.log(`💀 ${npcName} has died`);
  }
}

// Track NPC meeting
export async function recordNPCMeeting(userId: string, npcName: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  // Only add if not already met
  if (!progress.metNPCs?.includes(npcName)) {
    await updateDoc(ref, {
      metNPCs: [...(progress.metNPCs || []), npcName],
      lastUpdated: new Date()
    });
    
    console.log(`👋 Met ${npcName}`);
  }
}

// Track telling team about someone
export async function recordToldTeam(userId: string, npcName: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  // Only add if not already told
  if (!progress.toldTeamAbout?.includes(npcName)) {
    await updateDoc(ref, {
      toldTeamAbout: [...(progress.toldTeamAbout || []), npcName],
      lastUpdated: new Date()
    });
    
    console.log(`🗣️ Told team about ${npcName}`);
  }
}

// Track player death
export async function recordDeath(userId: string, deathLocation: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  await updateDoc(ref, {
    deaths: (progress.deaths || 0) + 1,
    deathLocations: [...(progress.deathLocations || []), deathLocation],
    lastUpdated: new Date()
  });
  
  console.log(`☠️ Player died at ${deathLocation}. Total deaths: ${(progress.deaths || 0) + 1}`);
}

// Track revival
export async function recordRevival(userId: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  await updateDoc(ref, {
    revivals: (progress.revivals || 0) + 1,
    lastUpdated: new Date()
  });
  
  console.log(`✨ Player revived. Total revivals: ${(progress.revivals || 0) + 1}`);
}

// Track going alone
export async function recordWentAlone(userId: string, characterName?: string) {
  const ref = doc(db, 'users', userId);
  
  const updates: any = {
    wentAlone: true,
    route: 'alone',
    lastUpdated: new Date()
  };
  
  if (characterName) {
    updates.characterName = characterName;
  }
  
  await updateDoc(ref, updates);
  
  console.log(`🚶 Player went alone${characterName ? ` as ${characterName}` : ''}`);
}

// Track route completion
export async function recordRouteCompletion(userId: string, routeName: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  if (!progress.completedRoutes?.includes(routeName)) {
    await updateDoc(ref, {
      completedRoutes: [...(progress.completedRoutes || []), routeName],
      route: routeName,
      lastUpdated: new Date()
    });
    
    console.log(`🎯 Completed route: ${routeName}`);
  }
}

// Track page visit
export async function recordPageVisit(userId: string, pageId: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  await updateDoc(ref, {
    currentPage: pageId,
    visitedPages: Array.from(new Set([...(progress.visitedPages || []), pageId])),
    lastUpdated: new Date()
  });
}

// Check if player has met certain conditions
export async function hasPlayerMetCondition(userId: string, condition: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  
  switch (condition) {
    case 'went_alone':
      return progress.wentAlone === true;
    case 'died_before':
      return (progress.deaths || 0) > 0;
    case 'been_revived':
      return (progress.revivals || 0) > 0;
    default:
      return false;
  }
}

// Check if NPC is alive
export async function isNPCAlive(userId: string, npcName: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return !progress.deadNPCs?.includes(npcName);
}

// Check if player has met NPC
export async function hasMetNPC(userId: string, npcName: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return progress.metNPCs?.includes(npcName) || false;
}

// Check if player told team about NPC
export async function hasToldTeamAbout(userId: string, npcName: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return progress.toldTeamAbout?.includes(npcName) || false;
}
