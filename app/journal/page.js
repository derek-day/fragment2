"use client";

import { useEffect, useState } from 'react';
import { getPlayerProgress } from '../../lib/progressService';
import { auth } from '../../lib/firebase';

export default function PlayerJournal() {
  const [progress, setProgress] = useState(null);
  
  useEffect(() => {
    const loadProgress = async () => {
      const user = auth.currentUser;
      if (user) {
        const data = await getPlayerProgress(user.uid);
        setProgress(data);
      }
    };
    loadProgress();
  }, []);
  
  if (!progress) return <div>Loading...</div>;
  
  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Journey</h2>
      
      <div className="space-y-4">
        {/* Deaths */}
        <div>
          <h3 className="font-bold">Deaths: {progress.deaths || 0}</h3>
          <p className="text-sm text-gray-400">Revivals: {progress.revivals || 0}</p>
        </div>
        
        {/* NPCs Met */}
        <div>
          <h3 className="font-bold">NPCs Met ({progress.metNPCs?.length || 0}):</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {progress.metNPCs?.map(npc => (
              <span key={npc} className="bg-blue-900 px-2 py-1 rounded text-sm">
                {npc}
              </span>
            ))}
          </div>
        </div>
        
        {/* Dead NPCs */}
        {progress.deadNPCs && progress.deadNPCs.length > 0 && (
          <div>
            <h3 className="font-bold text-red-400">Casualties ({progress.deadNPCs.length}):</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {progress.deadNPCs.map(npc => (
                <span key={npc} className="bg-red-900 px-2 py-1 rounded text-sm">
                  💀 {npc}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Failed Combats */}
        <div>
          <h3 className="font-bold">Failed Battles: {progress.failedCombats?.length || 0}</h3>
        </div>
        
        {/* Special Choices */}
        {progress.wentAlone && (
          <div className="bg-purple-900 p-3 rounded">
            <p>🚶 You chose to venture alone as {progress.characterName}</p>
          </div>
        )}
        
        {progress.toldTeamAbout && progress.toldTeamAbout.length > 0 && (
          <div>
            <h3 className="font-bold">Revealed to Team:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {progress.toldTeamAbout.map(npc => (
                <span key={npc} className="bg-green-900 px-2 py-1 rounded text-sm">
                  {npc}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}