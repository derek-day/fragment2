import { 
  getPlayerProgress, 
  isNPCAlive, 
  getPlayerGuild, 
  isInterestedInGuild,
  hasSacrificed,
  getCurrentRoute
} from './progressService';

export async function checkPageCondition(userId: string, condition: any): Promise<boolean> {
  if (!condition) return true;
  
  const progress = await getPlayerProgress(userId);
  
  switch (condition.type) {
    case 'npc_alive':
      return await isNPCAlive(userId, condition.npc);
    
    case 'npc_dead':
      return !await isNPCAlive(userId, condition.npc);
    
    case 'told_team':
      return progress.toldTeamAbout?.includes(condition.npc) || false;
    
    case 'went_alone':
      return progress.wentAlone === true;

    case 'nice_to_akemi':
      return progress.niceToAkemi === true;

    case 'gave_to_cale':
      return progress.gaveToCale === true;
    
    case 'took_environment_potion':
      return progress.tookEnvironmentPotion === true;

    case 'died_before':
      return (progress.deaths || 0) > 0;
    
    case 'met_npc':
      return progress.metNPCs?.some(npc => npc.name === condition.npc) || false;
    
    // Guild conditions
    case 'has_guild':
      const playerGuild = await getPlayerGuild(userId);
      return playerGuild === condition.guild;
    
    case 'interested_in_guild':
      return await isInterestedInGuild(userId, condition.guild);
    
    case 'no_guild':
      const hasGuild = await getPlayerGuild(userId);
      return !hasGuild;

    case 'sacrificed':
      return await hasSacrificed(userId);
    
    case 'did_not_sacrifice':
      return !await hasSacrificed(userId);
    
    case 'went_with_team':
      const route = await getCurrentRoute(userId);
      return route === 'team';
    
    case 'route':
      const currentRoute = await getCurrentRoute(userId);
      return currentRoute === condition.route;
    
    default:
      return true;
  }
}

// Get the correct next page based on conditions
export async function getConditionalNextPage(userId: string, page: any): Promise<string | null> {
  // No conditional branches - return default next
  if (!page.conditionalNext || page.conditionalNext.length === 0) {
    return page.next;
  }
  
  // Check each conditional branch in order
  for (const branch of page.conditionalNext) {
    // Check all conditions for this branch
    let allConditionsMet = true;
    
    for (const condition of (branch.conditions || [])) {
      const met = await checkPageCondition(userId, condition);
      if (!met) {
        allConditionsMet = false;
        break;
      }
    }
    
    if (allConditionsMet) {
      return branch.next;
    }
  }
  
  // Fallback to default next
  return page.next;
}// Add this at the END of conditionService.ts (not in pageClient.js)









// // import { getPlayerProgress, areAllMinionsDead, isNPCAlive } from './progressService';
// import { getPlayerProgress, isNPCAlive } from './progressService';


// export async function checkPageCondition(userId: string, condition: any): Promise<boolean> {
//   if (!condition) return true;
  
//   const progress = await getPlayerProgress(userId);
  
//   switch (condition.type) {
//     // case 'all_minions_dead':
//     // //   return await areAllMinionsDead(userId, condition.minions || []);
//     //     const allDead = (condition.minions || []).every((minion: string) =>
//     //     progress.deadNPCs?.includes(minion)
//     //   );
//     //   return allDead;

    
//     // case 'minions_dead_count':
//     //   const deadCount = (condition.minions || []).filter((minion: string) =>
//     //     progress.deadNPCs?.includes(minion)
//     //   ).length;
//     //   return deadCount >= (condition.minimum || 1);
    
//     case 'npc_alive':
//       return await isNPCAlive(userId, condition.npc);
    
//     case 'npc_dead':
//       return !await isNPCAlive(userId, condition.npc);
    
//     case 'told_team':
//       return progress.toldTeamAbout?.includes(condition.npc) || false;
    
//     case 'went_alone':
//       return progress.wentAlone === true;
    
//     case 'died_before':
//       return (progress.deaths || 0) > 0;
    
//     case 'met_npc':
//       return progress.metNPCs?.includes(condition.npc) || false;
//     //   return progress.metNPCs?.some(npc => npc.name === condition.npc) || false;
    
//     // case 'has_class':
//     //   return progress.className === condition.className;

    
//     default:
//       return true;
//   }
// }

// // Get the correct next page based on conditions
// export async function getConditionalNextPage(userId: string, page: any): Promise<string | null> {
//   // No conditional branches - return default next
//   if (!page.conditionalNext || page.conditionalNext.length === 0) {
//     return page.next;
//   }
  
//   // Check each conditional branch in order
//   for (const branch of page.conditionalNext) {
//     // Check all conditions for this branch
//     let allConditionsMet = true;
    
//     for (const condition of (branch.conditions || [])) {
//       const met = await checkPageCondition(userId, condition);
//       if (!met) {
//         allConditionsMet = false;
//         break;
//       }
//     }
    
//     if (allConditionsMet) {
//       return branch.next;
//     }
//   }
  
//   // Fallback to default next
//   return page.next;
// }
