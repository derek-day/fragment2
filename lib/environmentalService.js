import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function hasUsedEnvironmentalAction(userId, pageId) {
  if (!userId || !pageId) return false;
  
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  
  if (!snap.exists()) return false;
  
  const usedActions = snap.data().usedEnvironmentalActions || [];
  return usedActions.includes(pageId);
}

export async function markEnvironmentalActionUsed(userId, pageId) {
  if (!userId || !pageId) {
    console.error("Missing userId or pageId");
    return;
  }
  
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  
  if (!snap.exists()) {
    console.error("User document does not exist");
    return;
  }
  
  const usedActions = snap.data().usedEnvironmentalActions || [];
  
  if (!usedActions.includes(pageId)) {
    usedActions.push(pageId);
    await updateDoc(ref, { 
      usedEnvironmentalActions: usedActions 
    });
    console.log(`✅ Environmental action marked as used for page: ${pageId}`);
  }
}