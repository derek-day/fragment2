import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Types
interface NPCInfo {
  name: string;
  description?: string;
  location?: string;
  metAt?: string;
  // NPC Stats
  maxHP?: number;
  currentHP?: number;
  ac?: number;
  fellowship?: number;
  athletics?: number;
  thought?: number;
  essence?: number;
  // attack?: number;
  // magic?: number;
  // Status
  isAlive: boolean;
  isDead?: boolean;
  injuryCount?: number;
  lastInjury?: string;
  deathLocation?: string;
  deathTime?: string;
  //C-Class A-Class B-Class
  class?: string;
  breakerClass?: string;
  level?: number;
  //need possible unknown class/breaker that could change
}

interface GuildOpinion {
  guildName: string;
  opinion: 'positive' | 'negative' | 'neutral' | 'interested' | 'dismissed';
  timestamp: string;
  pageId?: string;
}

interface PlayerProgress {
  // Combat tracking
  failedCombats?: string[];
  failedRolls?: string[];
  
  // NPC tracking with full stats
  deadNPCs?: string[];
  metNPCs?: NPCInfo[];
  npcRelationships?: {
    [npcName: string]: number;
  };
  
  // Guild tracking
  joinedGuild?: string;
  guildJoinDate?: string;
  guildOpinions?: GuildOpinion[];
  interestedGuilds?: string[];
  
  // Minion tracking by group
  minionGroups?: {
    [groupName: string]: {
      alive: string[];
      dead: string[];
      totalKilled?: number;
    };
  };
  
  // Player choices
  wentAlone?: boolean;
  characterName?: string;
  toldTeamAbout?: string[];
  niceToAkemi?: boolean;
  gaveToCale?: boolean;
  tookEnvironmentPotion?: boolean;
  tookHospitalNote?: boolean;
  
  // Death tracking
  deaths?: number;
  revivals?: number;
  deathLocations?: string[];
  
  // Route tracking
  route?: string;
  completedRoutes?: string[];

  sacrificedForTeam?: boolean;
  sacrificeLocation?: string;
  sacrificeTime?: string;
  
  // General progress
  currentPage?: string;
  visitedPages?: string[];
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
      niceToAkemi: false,
      gaveToCale: false,
      tookEnvironmentPotion: false,
      minionGroups: {},
      joinedGuild: null,
      guildOpinions: [],
      interestedGuilds: [],
      lastUpdated: new Date(),
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

// Track NPC meeting with full stats
export async function recordNPCMeeting(
  userId: string, 
  npcName: string, 
  description?: string,
  location?: string,
  stats?: {
    maxHP?: number;
    currentHP?: number;
    ac?: number;
    fellowship?: number;
    athletics?: number;
    thought?: number;
    essence?: number;
    // attack?: number;
    // magic?: number;
  }
) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  // Check if already met by name
  const alreadyMet = progress.metNPCs?.some(npc => npc.name === npcName);
  
  if (!alreadyMet) {
    const npcInfo: NPCInfo = {
      name: npcName,
      description,
      location,
      metAt: new Date().toISOString(),
      maxHP: stats?.maxHP || 100,
      currentHP: stats?.currentHP || stats?.maxHP || 100,
      ac: stats?.ac || 12,
      fellowship: stats?.fellowship || 10,
      athletics: stats?.athletics || 10,
      thought: stats?.thought || 10,
      essence: stats?.essence || 10,
      // attack: stats?.attack || 3,
      // magic: stats?.magic || 2,
      isAlive: true,
      isDead: false,
      injuryCount: 0
    };
    
    await updateDoc(ref, {
      metNPCs: [...(progress.metNPCs || []), npcInfo],
      lastUpdated: new Date()
    });
    
    console.log(`👋 Met ${npcName}`);
  }
}

// Update NPC HP
export async function updateNPCHP(userId: string, npcName: string, newHP: number) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  const updatedNPCs = progress.metNPCs?.map(npc => {
    if (npc.name === npcName) {
      const wasInjured = newHP < npc.currentHP;
      return {
        ...npc,
        currentHP: Math.max(0, newHP),
        injuryCount: wasInjured ? (npc.injuryCount || 0) + 1 : npc.injuryCount,
        lastInjury: wasInjured ? new Date().toISOString() : npc.lastInjury,
        isAlive: newHP > 0,
        isDead: newHP <= 0
      };
    }
    return npc;
  });
  
  await updateDoc(ref, {
    metNPCs: updatedNPCs,
    lastUpdated: new Date()
  });
  
  console.log(`💊 Updated ${npcName} HP to ${newHP}`);
}

// Get NPC current stats
export async function getNPCStats(userId: string, npcName: string): Promise<NPCInfo | null> {
  const progress = await getPlayerProgress(userId);
  return progress.metNPCs?.find(npc => npc.name === npcName) || null;
}

// Track NPC death with location
export async function recordNPCDeath(userId: string, npcName: string, deathLocation?: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  // Update NPC info to mark as dead
  const updatedNPCs = progress.metNPCs?.map(npc => {
    if (npc.name === npcName) {
      return {
        ...npc,
        isAlive: false,
        isDead: true,
        currentHP: 0,
        deathLocation: deathLocation || 'Unknown',
        deathTime: new Date().toISOString()
      };
    }
    return npc;
  });
  
  // Add to deadNPCs list if not already there
  if (!progress.deadNPCs?.includes(npcName)) {
    await updateDoc(ref, {
      deadNPCs: [...(progress.deadNPCs || []), npcName],
      metNPCs: updatedNPCs,
      lastUpdated: new Date()
    });
    
    console.log(`💀 ${npcName} has died at ${deathLocation || 'unknown location'}`);
  }
}

// Track telling team about someone
export async function recordToldTeam(userId: string, npcName: string) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
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

// Initialize minion group
export async function initializeMinionGroup(userId: string, groupName: string, minions: string[]) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  if (!progress.minionGroups?.[groupName]) {
    await updateDoc(ref, {
      [`minionGroups.${groupName}`]: {
        alive: minions,
        dead: [],
        totalKilled: 0
      },
      lastUpdated: new Date()
    });
    
    console.log(`🎯 Initialized minion group: ${groupName} with ${minions.length} minions`);
  }
}

// Record minion death and return updated count
export async function recordMinionDeath(userId: string, groupName: string, minionName: string): Promise<number> {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  const group = progress.minionGroups?.[groupName];
  if (!group) {
    console.error(`Minion group ${groupName} not found`);
    return 0;
  }
  
  const aliveMinions = group.alive.filter(m => m !== minionName);
  const deadMinions = [...group.dead, minionName];
  const totalKilled = (group.totalKilled || 0) + 1;
  
  await updateDoc(ref, {
    [`minionGroups.${groupName}`]: {
      alive: aliveMinions,
      dead: deadMinions,
      totalKilled
    },
    lastUpdated: new Date()
  });
  
  console.log(`💀 Minion ${minionName} killed. Total in group: ${totalKilled}`);
  return totalKilled;
}

// Get alive minions from a group
export async function getAliveMinions(userId: string, groupName: string): Promise<string[]> {
  const progress = await getPlayerProgress(userId);
  return progress.minionGroups?.[groupName]?.alive || [];
}

// Get total minions killed in a group
export async function getTotalMinionsKilled(userId: string, groupName: string): Promise<number> {
  const progress = await getPlayerProgress(userId);
  return progress.minionGroups?.[groupName]?.totalKilled || 0;
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
  if (!userId || !pageId) {
    console.error('Invalid userId or pageId in recordPageVisit');
    return;
  }
  
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
  return progress.metNPCs?.some(npc => npc.name === npcName) || false;
}

// Check if player told team about NPC
export async function hasToldTeamAbout(userId: string, npcName: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return progress.toldTeamAbout?.includes(npcName) || false;
}

// ==================== GUILD TRACKING ====================

// Record guild opinion
export async function recordGuildOpinion(
  userId: string,
  guildName: string,
  opinion: 'positive' | 'negative' | 'neutral' | 'interested' | 'dismissed',
  pageId?: string
) {
  const ref = doc(db, 'users', userId);
  const progress = await getPlayerProgress(userId);
  
  const guildOpinion: GuildOpinion = {
    guildName,
    opinion,
    timestamp: new Date().toISOString(),
    pageId
  };
  
  // Update or add opinion
  const existingOpinions = progress.guildOpinions || [];
  const updatedOpinions = existingOpinions.filter(g => g.guildName !== guildName);
  updatedOpinions.push(guildOpinion);
  
  // Track interested guilds
  let interestedGuilds = progress.interestedGuilds || [];
  if (opinion === 'interested' && !interestedGuilds.includes(guildName)) {
    interestedGuilds = [...interestedGuilds, guildName];
  } else if (opinion === 'dismissed') {
    interestedGuilds = interestedGuilds.filter(g => g !== guildName);
  }
  
  await updateDoc(ref, {
    guildOpinions: updatedOpinions,
    interestedGuilds,
    lastUpdated: new Date()
  });
  
  console.log(`🏛️ Recorded ${opinion} opinion for ${guildName}`);
}

// Join a guild
export async function joinGuild(userId: string, guildName: string) {
  const ref = doc(db, 'users', userId);
  
  await updateDoc(ref, {
    joinedGuild: guildName,
    guildJoinDate: new Date().toISOString(),
    lastUpdated: new Date()
  });
  
  console.log(`🎉 Joined guild: ${guildName}`);
}

// Get guild opinion
export async function getGuildOpinion(userId: string, guildName: string): Promise<GuildOpinion | null> {
  const progress = await getPlayerProgress(userId);
  return progress.guildOpinions?.find(g => g.guildName === guildName) || null;
}

// Get all guild opinions
export async function getAllGuildOpinions(userId: string): Promise<GuildOpinion[]> {
  const progress = await getPlayerProgress(userId);
  return progress.guildOpinions || [];
}

// Check if player has joined a guild
export async function hasJoinedGuild(userId: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return !!progress.joinedGuild;
}

// Get player's guild
export async function getPlayerGuild(userId: string): Promise<string | null> {
  const progress = await getPlayerProgress(userId);
  return progress.joinedGuild || null;
}

// Check if player is interested in guild
export async function isInterestedInGuild(userId: string, guildName: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return progress.interestedGuilds?.includes(guildName) || false;
}


// ALONE/TOGETHER AND SACRIFICE TRACKING
export async function recordSacrifice(userId: string, location: string) {
  const ref = doc(db, 'users', userId);
  
  await updateDoc(ref, {
    sacrificedForTeam: true,
    sacrificeLocation: location,
    sacrificeTime: new Date().toISOString(),
    lastUpdated: new Date()
  });
  
  console.log(`🛡️ Player sacrificed themselves at ${location}`);
}

// Check if player sacrificed themselves
export async function hasSacrificed(userId: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return progress.sacrificedForTeam === true;
}


export async function recordNiceToAkemi(userId: string) {
  const ref = doc(db, 'users', userId);
  
  await updateDoc(ref, {
    niceToAkemi: true,
    lastUpdated: new Date()
  });

  console.log(`Player was nice to Akemi`);
}

export async function wasNiceToAkemi(userId: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return progress.niceToAkemi === true;
}

export async function recordGaveToCale(userId: string) {
  const ref = doc(db, 'users', userId);
  
  await updateDoc(ref, {
    gaveToCale: true,
    lastUpdated: new Date()
  });

  console.log(`Player gave to Cale`);
}

export async function hasGivenToCale(userId: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return progress.gaveToCale === true;
}

export async function recordTookEnvironmentalPotion(userId: string) {
  const ref = doc(db, 'users', userId);
  
  await updateDoc(ref, {
    tookEnvironmentPotion: true,
    lastUpdated: new Date()
  });

  console.log(`Player took environmental potion`);
}

export async function hasTakenEnvironmentalPotion(userId: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return progress.tookEnvironmentPotion === true;
}

export async function recordTookHospitalNote(userId: string) {
  const ref = doc(db, 'users', userId);
  
  await updateDoc(ref, {
    tookHospitalNote: true,
    lastUpdated: new Date()
  });

  console.log(`Player took hospital note`);
}

export async function hasTakenHospitalNote(userId: string): Promise<boolean> {
  const progress = await getPlayerProgress(userId);
  return progress.tookHospitalNote === true;
}

// Get current route (alone or team)
export async function getCurrentRoute(userId: string): Promise<'alone' | 'team' | null> {
  const progress = await getPlayerProgress(userId);
  if (progress.wentAlone) return 'alone';
  if (progress.route === 'team') return 'team';
  return null;
}

export async function updateBreakerClass(userId, newClass) {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, { 
    breakerClass: newClass,
    classUpdatedAt: new Date().toISOString()
  });
  
  console.log(`Breaker class updated to: ${newClass}`);
  return { success: true, newClass };
}