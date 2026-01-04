"use client";

import { useEffect, useState } from 'react';
import { getPlayerProgress } from '../lib/progressService';
import { auth } from '../lib/firebase';
import { Book, Users, Skull, AlertCircle, Award } from 'lucide-react';

export default function Journal() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = auth.currentUser;
        if (!user) {
          setError("Please log in to view your journal");
          setLoading(false);
          return;
        }
        
        const data = await getPlayerProgress(user.uid);
        console.log("Loaded progress:", data);
        setProgress(data);
      } catch (err) {
        console.error("Error loading progress:", err);
        setError("Failed to load journal data");
      } finally {
        setLoading(false);
      }
    };
    
    loadProgress();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading journal...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="bg-red-900 p-6 rounded-lg border-2 border-red-600">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!progress) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-600">
          <p className="text-lg">No progress data found.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Book className="w-8 h-8" />
          <h1 className="text-4xl font-bold">Your Journey</h1>
        </div>

        {/* Character Info */}
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Character</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-400">Name:</span> 
              <span className="ml-2 font-bold">{progress.characterName || 'Yib'}</span>
            </div>
            <div>
              <span className="text-gray-400">Class:</span> 
              <span className="ml-2 font-bold">{progress.className || 'Undecided'}</span>
            </div>
            <div>
              <span className="text-gray-400">Route:</span> 
              <span className="ml-2 font-bold">{progress.route || 'Team'}</span>
            </div>
            <div>
              <span className="text-gray-400">Deaths:</span> 
              <span className="ml-2 font-bold text-red-400">{progress.deaths || 0}</span>
            </div>
          </div>
        </div>

        {/* Guild Information */}
        {(progress.joinedGuild || progress.interestedGuilds?.length > 0 || progress.guildOpinions?.length > 0) && (
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Guild Status</h2>
            </div>
            
            {progress.joinedGuild && (
              <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg mb-4 border border-green-700">
                <div className="text-sm text-gray-400">Current Guild</div>
                <div className="text-2xl font-bold text-green-400">{progress.joinedGuild}</div>
                {progress.guildJoinDate && (
                  <div className="text-xs text-gray-500 mt-1">
                    Joined: {new Date(progress.guildJoinDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
            
            {progress.interestedGuilds && progress.interestedGuilds.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Interested In:</div>
                <div className="flex flex-wrap gap-2">
                  {progress.interestedGuilds.map((guild, idx) => (
                    <span key={idx} className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded text-sm border border-blue-700">
                      ⭐ {guild}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {progress.guildOpinions && progress.guildOpinions.length > 0 && (
              <div>
                <div className="text-sm text-gray-400 mb-2">Guild Opinions:</div>
                <div className="space-y-2">
                  {progress.guildOpinions.map((opinion, idx) => (
                    <div key={idx} className="bg-gray-900 p-3 rounded flex justify-between items-center">
                      <span className="font-semibold">{opinion.guildName}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        opinion.opinion === 'positive' ? 'bg-green-900 text-green-300' :
                        opinion.opinion === 'interested' ? 'bg-blue-900 text-blue-300' :
                        opinion.opinion === 'negative' ? 'bg-red-900 text-red-300' :
                        opinion.opinion === 'dismissed' ? 'bg-gray-700 text-gray-400' :
                        'bg-gray-800 text-gray-300'
                      }`}>
                        {opinion.opinion === 'positive' ? '👍 Positive' :
                         opinion.opinion === 'interested' ? '⭐ Interested' :
                         opinion.opinion === 'negative' ? '👎 Negative' :
                         opinion.opinion === 'dismissed' ? '❌ Dismissed' :
                         '😐 Neutral'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* NPCs Met */}
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6" />
            <h2 className="text-2xl font-bold">People You've Met ({progress.metNPCs?.length || 0})</h2>
          </div>
          
          {progress.metNPCs && progress.metNPCs.length > 0 ? (
            <div className="space-y-4">
              {progress.metNPCs.map((npc, idx) => {
                // Handle both old format (string) and new format (object)
                const npcName = typeof npc === 'string' ? npc : npc.name;
                const npcDescription = typeof npc === 'object' ? npc.description : null;
                const npcLocation = typeof npc === 'object' ? npc.location : null;
                const isDead = typeof npc === 'object' ? npc.isDead : progress.deadNPCs?.includes(npcName);
                const currentHP = typeof npc === 'object' ? npc.currentHP : null;
                const maxHP = typeof npc === 'object' ? npc.maxHP : null;
                const injuryCount = typeof npc === 'object' ? npc.injuryCount : 0;
                
                return (
                  <div key={idx} className={`bg-gray-900 p-4 rounded-lg border-2 ${
                    isDead ? 'border-red-800 opacity-75' : 'border-gray-700'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{npcName}</h3>
                      <div className="flex gap-2 items-center">
                        {isDead && (
                          <span className="text-red-400 text-sm flex items-center gap-1">
                            <Skull className="w-4 h-4" />
                            Deceased
                          </span>
                        )}
                        {!isDead && typeof npc === 'object' && npc.isAlive && (
                          <span className="text-green-400 text-sm">
                            ✓ Alive
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {npcDescription && (
                      <p className="text-gray-400 text-sm mb-2">{npcDescription}</p>
                    )}
                    
                    {/* NPC Stats */}
                    {typeof npc === 'object' && (currentHP !== null || maxHP !== null) && (
                      <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                        {currentHP !== null && maxHP !== null && (
                          <div className="bg-gray-800 p-2 rounded">
                            <div className="text-gray-500">HP</div>
                            <div className={`font-bold ${
                              isDead ? 'text-red-400' :
                              currentHP < maxHP * 0.3 ? 'text-orange-400' :
                              currentHP < maxHP * 0.7 ? 'text-yellow-400' :
                              'text-green-400'
                            }`}>
                              {currentHP}/{maxHP}
                            </div>
                          </div>
                        )}
                        {npc.ac && (
                          <div className="bg-gray-800 p-2 rounded">
                            <div className="text-gray-500">AC</div>
                            <div className="font-bold text-blue-400">{npc.ac}</div>
                          </div>
                        )}
                        {injuryCount > 0 && (
                          <div className="bg-gray-800 p-2 rounded">
                            <div className="text-gray-500">Injuries</div>
                            <div className="font-bold text-orange-400">{injuryCount}</div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {npcLocation && (
                      <p className="text-gray-500 text-xs mt-2">Met at: {npcLocation}</p>
                    )}
                    
                    {typeof npc === 'object' && npc.deathLocation && (
                      <p className="text-red-500 text-xs mt-2">
                        Died at: {npc.deathLocation}
                        {npc.deathTime && ` (${new Date(npc.deathTime).toLocaleDateString()})`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">You haven't met anyone yet.</p>
          )}
        </div>

        {/* Revealed Secrets */}
        {progress.toldTeamAbout && progress.toldTeamAbout.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Revealed to Team</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {progress.toldTeamAbout.map((npc, idx) => (
                <span key={idx} className="bg-green-900 px-3 py-1 rounded text-sm">
                  🗣️ {npc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Combat Record */}
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Combat Record</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-red-400">{progress.failedCombats?.length || 0}</div>
              <div className="text-sm text-gray-400">Failed Battles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">{progress.failedRolls?.length || 0}</div>
              <div className="text-sm text-gray-400">Failed Rolls</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">{progress.revivals || 0}</div>
              <div className="text-sm text-gray-400">Revivals</div>
            </div>
          </div>
          
          {/* Minion tracking */}
          {progress.minionGroups && Object.keys(progress.minionGroups).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3 text-gray-300">Enemies Defeated</h3>
              <div className="space-y-3">
                {Object.entries(progress.minionGroups).map(([groupName, group]) => (
                  <div key={groupName} className="bg-gray-900 p-3 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold capitalize">{groupName.replace(/_/g, ' ')}</span>
                      <span className="text-yellow-400 font-bold">
                        {group.totalKilled || group.dead?.length || 0} defeated
                      </span>
                    </div>
                    {group.dead && group.dead.length > 0 && (
                      <div className="text-xs text-gray-400">
                        Killed: {group.dead.join(', ')}
                      </div>
                    )}
                    {group.alive && group.alive.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Remaining: {group.alive.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Special Status */}
        {progress.wentAlone && (
          <div className="bg-purple-900 p-4 rounded-lg border-2 border-purple-600">
            <p className="font-bold">Lone Wolf</p>
            <p className="text-sm text-gray-300">You ventured into the portal alone.</p>
          </div>
        )}
      </div>
    </div>
  );
}









// "use client";

// import { useEffect, useState } from 'react';
// import { getPlayerProgress } from '../lib/progressService';
// import { auth } from '../lib/firebase';
// import { Book, Users, Skull, AlertCircle, Award } from 'lucide-react';

// export default function Journal() {
//   const [progress, setProgress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     const loadProgress = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const user = auth.currentUser;
//         if (!user) {
//           setError("Please log in to view your journal");
//           setLoading(false);
//           return;
//         }
        
//         const data = await getPlayerProgress(user.uid);
//         console.log("Loaded progress:", data);
//         setProgress(data);
//       } catch (err) {
//         console.error("Error loading progress:", err);
//         setError("Failed to load journal data");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadProgress();
//   }, []);
  
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p className="text-lg">Loading journal...</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
//         <div className="bg-red-900 p-6 rounded-lg border-2 border-red-600">
//           <p className="text-lg">{error}</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (!progress) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
//         <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-600">
//           <p className="text-lg">No progress data found.</p>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-4xl mx-auto space-y-6">
//         <div className="flex items-center gap-3 mb-8">
//           <Book className="w-8 h-8" />
//           <h1 className="text-4xl font-bold">Your Journey</h1>
//         </div>

//         {/* Character Info */}
//         <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
//           <h2 className="text-2xl font-bold mb-4">Character</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <span className="text-gray-400">Name:</span> 
//               <span className="ml-2 font-bold">{progress.characterName || 'Yib'}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">Class:</span> 
//               <span className="ml-2 font-bold">{progress.className || 'Undecided'}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">Route:</span> 
//               <span className="ml-2 font-bold">{progress.route || 'Team'}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">Deaths:</span> 
//               <span className="ml-2 font-bold text-red-400">{progress.deaths || 0}</span>
//             </div>
//           </div>
//         </div>

//         {/* NPCs Met */}
//         <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
//           <div className="flex items-center gap-2 mb-4">
//             <Users className="w-6 h-6" />
//             <h2 className="text-2xl font-bold">People You've Met ({progress.metNPCs?.length || 0})</h2>
//           </div>
          
//           {progress.metNPCs && progress.metNPCs.length > 0 ? (
//             <div className="space-y-4">
//               {progress.metNPCs.map((npc, idx) => {
//                 // Handle both old format (string) and new format (object)
//                 const npcName = typeof npc === 'string' ? npc : npc.name;
//                 const npcDescription = typeof npc === 'object' ? npc.description : null;
//                 const npcLocation = typeof npc === 'object' ? npc.location : null;
                
//                 return (
//                   <div key={idx} className="bg-gray-900 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-bold text-lg">{npcName}</h3>
//                       {progress.deadNPCs?.includes(npcName) && (
//                         <span className="text-red-400 text-sm flex items-center gap-1">
//                           <Skull className="w-4 h-4" />
//                           Deceased
//                         </span>
//                       )}
//                     </div>
//                     {npcDescription && (
//                       <p className="text-gray-400 text-sm">{npcDescription}</p>
//                     )}
//                     {npcLocation && (
//                       <p className="text-gray-500 text-xs mt-2">Met at: {npcLocation}</p>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <p className="text-gray-500">You haven't met anyone yet.</p>
//           )}
//         </div>

//         {/* Revealed Secrets */}
//         {progress.toldTeamAbout && progress.toldTeamAbout.length > 0 && (
//           <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
//             <div className="flex items-center gap-2 mb-4">
//               <AlertCircle className="w-6 h-6" />
//               <h2 className="text-2xl font-bold">Revealed to Team</h2>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {progress.toldTeamAbout.map((npc, idx) => (
//                 <span key={idx} className="bg-green-900 px-3 py-1 rounded text-sm">
//                   🗣️ {npc}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Combat Record */}
//         <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
//           <div className="flex items-center gap-2 mb-4">
//             <Award className="w-6 h-6" />
//             <h2 className="text-2xl font-bold">Combat Record</h2>
//           </div>
//           <div className="grid grid-cols-3 gap-4 text-center">
//             <div>
//               <div className="text-3xl font-bold text-red-400">{progress.failedCombats?.length || 0}</div>
//               <div className="text-sm text-gray-400">Failed Battles</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-orange-400">{progress.failedRolls?.length || 0}</div>
//               <div className="text-sm text-gray-400">Failed Rolls</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-purple-400">{progress.revivals || 0}</div>
//               <div className="text-sm text-gray-400">Revivals</div>
//             </div>
//           </div>
          
//           {/* Minion tracking */}
//           {progress.minionGroups && Object.keys(progress.minionGroups).length > 0 && (
//             <div className="mt-6">
//               <h3 className="text-lg font-bold mb-3 text-gray-300">Enemies Defeated</h3>
//               <div className="space-y-3">
//                 {Object.entries(progress.minionGroups).map(([groupName, group]) => (
//                   <div key={groupName} className="bg-gray-900 p-3 rounded">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="font-bold capitalize">{groupName.replace(/_/g, ' ')}</span>
//                       <span className="text-yellow-400 font-bold">
//                         {group.totalKilled || group.dead?.length || 0} defeated
//                       </span>
//                     </div>
//                     {group.dead && group.dead.length > 0 && (
//                       <div className="text-xs text-gray-400">
//                         Killed: {group.dead.join(', ')}
//                       </div>
//                     )}
//                     {group.alive && group.alive.length > 0 && (
//                       <div className="text-xs text-gray-500">
//                         Remaining: {group.alive.join(', ')}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Special Status */}
//         {progress.wentAlone && (
//           <div className="bg-purple-900 p-4 rounded-lg border-2 border-purple-600">
//             <p className="font-bold">Lone Wolf</p>
//             <p className="text-sm text-gray-300">You ventured into the portal alone.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }