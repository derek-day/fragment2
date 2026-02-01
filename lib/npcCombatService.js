import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getNPCCombatStats(userId, npcName) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  
  if (!snap.exists()) return null;
  
  const metNPCs = snap.data().metNPCs || [];
  const npc = metNPCs.find(n => n.name === npcName);
  
  if (!npc) return null;
  
  return {
    name: npc.name,
    maxHP: npc.stats?.maxHP || 100,
    currentHP: npc.stats?.currentHP || npc.stats?.maxHP || 100,
    ac: npc.stats?.ac || 12,
    athletics: npc.stats?.athletics || 10,
    essence: npc.stats?.essence || 10,
    thought: npc.stats?.thought || 10,
    fellowship: npc.stats?.fellowship || 10,
    alive: npc.alive !== false
  };
}

export async function updateNPCCombatHP(userId, npcName, newHP) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  
  if (!snap.exists()) return;
  
  const metNPCs = snap.data().metNPCs || [];
  const updatedNPCs = metNPCs.map(npc => {
    if (npc.name === npcName) {
      return {
        ...npc,
        stats: {
          ...npc.stats,
          currentHP: newHP,
          alive: newHP > 0
        },
        alive: newHP > 0
      };
    }
    return npc;
  });
  
  await updateDoc(ref, { metNPCs: updatedNPCs });
}