import { 
  getPlayerProgress, 
  isNPCAlive, 
  getPlayerGuild, 
  isInterestedInGuild,
  hasSacrificed,
  hasFailed,
  wasNiceToAkemi,
  wasAkemiInterested,
  hasGivenToCale,
  hasTakenEnvironmentalPotion,
  hasTakenHospitalNote,
  hasRemovedCamperMinions,
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

    case 'failure':
      return progress.hasFailed === true;

    case 'did_not_fail':
      return progress.hasFailed !== true;

    case 'told_team_or_went_alone':
      const toldAboutRonin = progress.toldTeamAbout?.includes('Ronin') || false;
      const wentAlone = progress.wentAlone === true;
      return toldAboutRonin || wentAlone;

    case 'went_alone_or_no_note':
      const routeCheck = await getCurrentRoute(userId);
      const tookNote = await hasTakenHospitalNote(userId);
      return routeCheck === 'alone' || !tookNote;

    case 'nice_to_akemi':
      return progress.niceToAkemi === true;

    case 'akemi_interested':
      return progress.akemiInterested === true;

    case 'gave_to_cale':
      return progress.gaveToCale === true;

    case 'removed_minions':
      return progress.removedCamperMinions === true;
    
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

    case 'nice_to_akemi':
      return await wasNiceToAkemi(userId);
    
    case 'not_nice_to_akemi':
      return !await wasNiceToAkemi(userId);

    case 'akemi_interested':
      return await wasAkemiInterested(userId);

    case 'not_akemi_interested':
      return !await wasAkemiInterested(userId);

    case 'gave_to_cale':
      return await hasGivenToCale(userId);
    
    case 'did_not_give_to_cale':
      return !await hasGivenToCale(userId);

    case 'removed_minions':
      return await hasRemovedCamperMinions(userId);
    
    case 'did_not_removed_minions':
      return !await hasRemovedCamperMinions(userId);

    // Environment potion (removed duplicate)
    case 'took_environment_potion':
      return await hasTakenEnvironmentalPotion(userId);
    
    case 'did_not_take_environment_potion':
      return !await hasTakenEnvironmentalPotion(userId);

    case 'took_hospital_note':
      return await hasTakenHospitalNote(userId);
    
    case 'did_not_take_hospital_note':
      return !await hasTakenHospitalNote(userId);

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

export async function getConditionalNextPage(userId: string, page: any): Promise<string | null> {
  if (!page.conditionalNext || page.conditionalNext.length === 0) {
    return page.next;
  }
  
  for (const branch of page.conditionalNext) {
    let allConditionsMet = true;
    
    for (const condition of (branch.conditions || [])) {
      const met = await checkPageCondition(userId, condition);
      if (!met) {
        allConditionsMet = false;
        break;
      }
    }
    
    if (allConditionsMet) {
      console.log(`Conditional branch met, redirecting to: ${branch.next}`);
      return branch.next;
    }
  }
  
  return page.next;
}









// import { 
//   getPlayerProgress, 
//   isNPCAlive, 
//   getPlayerGuild, 
//   isInterestedInGuild,
//   hasSacrificed,
//   wasNiceToAkemi,
//   hasGivenToCale,
//   hasTakenEnvironmentalPotion,
//   hasTakenHospitalNote,
//   getCurrentRoute
// } from './progressService';

// export async function checkPageCondition(userId: string, condition: any): Promise<boolean> {
//   if (!condition) return true;
  
//   const progress = await getPlayerProgress(userId);
  
//   switch (condition.type) {
//     case 'npc_alive':
//       return await isNPCAlive(userId, condition.npc);
    
//     case 'npc_dead':
//       return !await isNPCAlive(userId, condition.npc);
    
//     case 'told_team':
//       return progress.toldTeamAbout?.includes(condition.npc) || false;
    
//     case 'went_alone':
//       return progress.wentAlone === true;

//     case 'nice_to_akemi':
//       return progress.niceToAkemi === true;

//     case 'gave_to_cale':
//       return progress.gaveToCale === true;
    
//     case 'took_environment_potion':
//       return progress.tookEnvironmentPotion === true;

//     case 'died_before':
//       return (progress.deaths || 0) > 0;
    
//     case 'met_npc':
//       return progress.metNPCs?.some(npc => npc.name === condition.npc) || false;
    
//     // Guild conditions
//     case 'has_guild':
//       const playerGuild = await getPlayerGuild(userId);
//       return playerGuild === condition.guild;
    
//     case 'interested_in_guild':
//       return await isInterestedInGuild(userId, condition.guild);
    
//     case 'no_guild':
//       const hasGuild = await getPlayerGuild(userId);
//       return !hasGuild;

//     case 'sacrificed':
//       return await hasSacrificed(userId);
    
//     case 'did_not_sacrifice':
//       return !await hasSacrificed(userId);

//     case 'nice_to_akemi':
//       return await wasNiceToAkemi(userId);
    
//     case 'not_nice_to_akemi':
//       return !await wasNiceToAkemi(userId);

//     case 'gave_to_cale':
//       return await hasGivenToCale(userId);
    
//     case 'did_not_give_to_cale':
//       return !await hasGivenToCale(userId);

//     case 'took_environment_potion':
//       return await hasTakenEnvironmentalPotion(userId);
    
//     case 'did_not_take_environment_potion':
//       return !await hasTakenEnvironmentalPotion(userId);

//     case 'took_hospital_note':
//       return await hasTakenHospitalNote(userId);
    
//     case 'did_not_take_hospital_note':
//       return !await hasTakenHospitalNote(userId);

//     case 'went_with_team':
//       const route = await getCurrentRoute(userId);
//       return route === 'team';
    
//     case 'route':
//       const currentRoute = await getCurrentRoute(userId);
//       return currentRoute === condition.route;
    
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
// }// Add this at the END of conditionService.ts (not in pageClient.js)