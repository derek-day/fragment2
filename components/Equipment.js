"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, ChevronRight, Sword, Shield, Zap, Scroll, BowArrow } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Equipment definitions
export const EQUIPMENT_ITEMS = {
  // basic_sword: {
  //   id: 'basic_sword',
  //   name: 'Iron Sword',
  //   type: 'Weapon',
  //   rarity: 'Common',
  //   description: 'A standard iron blade. Nothing fancy, but it gets the job done.',
  //   stats: {
  //     damage: '+2',
  //     athletics: '+1'
  //   },
  //   unlocksOnPage: 'page_1',
  //   icon: Sword
  // },
  // basic_armor: {
  //   id: 'basic_armor',
  //   name: 'Leather Armor',
  //   type: 'Armor',
  //   rarity: 'Common',
  //   description: 'Light leather armor that provides basic protection without hampering movement.',
  //   stats: {
  //     ac: '+1',
  //     maxHP: '+5'
  //   },
  //   unlocksOnPage: 'team_equipment',
  //   icon: Shield
  // },
  companion_note: {
    id: 'companion_note',
    name: 'Note from Companions',
    type: 'Item',
    rarity: 'Common',
    description: 'A note from your companions after your encounter with the Camper.',
    unlocksOnPage: 'nurse_keep',
    icon: Scroll
  },
  epoch_design: {
    id: 'epoch_design',
    name: 'Epoch Corporation Designs',
    type: 'Item',
    rarity: 'Common',
    description: 'Important design notes from the Epoch Corporation.',
    unlocksOnPage: 'take_desk',
    icon: Scroll
  },
  crossbow: {
    id: 'crossbow',
    name: 'Nullbite',
    type: 'Weapon',
    rarity: 'Unique',
    description: 'A crossbow that can be used to shoot arrows.',
    stats: {
      damage: '+2'
    },
    unlocksOnPage: 'study_defense',
    icon: BowArrow
  },
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    type: 'Consumable',
    rarity: 'Common',
    description: 'Restores health immediately upon use. The effects last until you take damage again.',
    stats: {
      healing: '10 HP'
    },
    unlocksOnPages: ['very_dumb', 'very_dumb_fail'],
    icon: Package
  },
  environment_potion: {
    id: 'environment_potion',
    name: 'Environmental Resistance Potion',
    type: 'Consumable',
    rarity: 'Uncommon',
    description: 'A caustic purple liquid that fortifies you against harsh environmental effects for several hours.',
    stats: {
      effect: 'Prevents environmental damage and disorientation'
    },
    unlocksOnPages: ['hold_vial', 'wait_hold', 'akemi_hold'],
    icon: Zap
  },
};

// Check and unlock equipment based on page
export async function checkAndUnlockEquipment(userId, pageId) {
  if (!userId) return [];
  
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return [];
    
    const userData = userSnap.data();
    const unlockedEquipment = userData.unlockedEquipment || [];
    
    // Find equipment that should unlock on this page
    // Support both single page (unlocksOnPage) and multiple pages (unlocksOnPages)
    const newEquipment = Object.values(EQUIPMENT_ITEMS).filter(item => {
      const unlockPages = Array.isArray(item.unlocksOnPages)
        ? item.unlocksOnPages
        : item.unlocksOnPage
          ? [item.unlocksOnPage]
          : [];
      
      return unlockPages.includes(pageId) && !unlockedEquipment.includes(item.id);
    });
    
    // Update Firestore if there is new equipment
    if (newEquipment.length > 0) {
      const updatedUnlocked = [...unlockedEquipment, ...newEquipment.map(e => e.id)];
      await updateDoc(userRef, {
        unlockedEquipment: updatedUnlocked
      });
      
      console.log(`Unlocked ${newEquipment.length} equipment item(s) on page: ${pageId}`);
      return newEquipment;
    }
    
    return [];
  } catch (error) {
    console.error("Error checking equipment:", error);
    return [];
  }
}

// Get all unlocked equipment for a user
export async function getUnlockedEquipment(userId) {
  if (!userId) return [];
  
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return [];
    
    const userData = userSnap.data();
    const unlockedIds = userData.unlockedEquipment || [];
    
    return Object.values(EQUIPMENT_ITEMS).filter(e => unlockedIds.includes(e.id));
  } catch (error) {
    console.error("Error getting unlocked equipment:", error);
    return [];
  }
}

// Use a consumable item
export async function useConsumable(userId, itemId) {
  if (!userId || !itemId) return { success: false, message: "Invalid parameters" };
  
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return { success: false, message: "User not found" };
    
    const userData = userSnap.data();
    const item = EQUIPMENT_ITEMS[itemId];
    
    if (!item) return { success: false, message: "Item not found" };
    if (item.type !== 'Consumable') return { success: false, message: "Item is not consumable" };
    
    // Check if user has the item
    const unlockedEquipment = userData.unlockedEquipment || [];
    if (!unlockedEquipment.includes(itemId)) {
      return { success: false, message: "You don't have this item" };
    }
    
    // Apply item effect based on item ID
    let updates = {};
    let message = "";
    
    if (itemId === 'health_potion') {
      const currentHP = userData.stats?.HP || 0;
      const maxHP = userData.stats?.MaxHP || 20;
      const newHP = Math.min(currentHP + 10, maxHP + 10); // Can overheal by 10
      const newMaxHP = Math.max(maxHP, newHP); // Increase max if needed
      
      updates = {
        'stats.HP': newHP,
        'stats.MaxHP': newMaxHP
      };
      message = `Restored 10 HP! (${currentHP} → ${newHP})`;
    } else if (itemId === 'environment_potion') {
      message = `Environmental effects negated!`;
      // return { success: true, message: "Environmental resistance active!", consumed: false };
      await recordTookEnvironmentalPotion(userId);
            
      // Remove from inventory
      // const result = await useConsumable(userId, item.id);
      // if (result.success && result.consumed) {
      //   setInventory(prev => prev.filter(i => i.id !== item.id));
      // }

    } else {
      // Generic consumable
      message = `Used ${item.name}`;
    }
    
    // Remove item from inventory (consumables are one-time use)
    const updatedEquipment = unlockedEquipment.filter(id => id !== itemId);
    updates.unlockedEquipment = updatedEquipment;
    
    await updateDoc(userRef, updates);
    
    return { success: true, message, consumed: true };
  } catch (error) {
    console.error("Error using consumable:", error);
    return { success: false, message: "Failed to use item" };
  }
}

// Update HP after battle or event
export async function updatePlayerHP(userId, newHP, maxHP = null) {
  if (!userId) return false;
  
  try {
    const userRef = doc(db, "users", userId);
    const updates = { 'stats.HP': Math.max(0, newHP) }; // Don't go below 0
    
    if (maxHP !== null) {
      updates['stats.MaxHP'] = maxHP;
    }
    
    await updateDoc(userRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating HP:", error);
    return false;
  }
}

// Halve player HP
export async function halvePlayerHP(userId) {
  if (!userId) return false;
  
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return false;
    
    const currentHP = userSnap.data().stats?.HP || 0;
    const halvedHP = Math.floor(currentHP / 2);
    
    await updateDoc(userRef, {
      'stats.HP': Math.max(1, halvedHP) // Keep at least 1 HP
    });
    
    return true;
  } catch (error) {
    console.error("Error halving HP:", error);
    return false;
  }
}

// Notification component for new equipment
export function EquipmentNotification({ items, onClose, onOpenItem }) {
  if (!items || items.length === 0) return null;

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'Common': return 'text-gray-400';
      case 'Uncommon': return 'text-green-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 bg-gray-800 border-2 border-green-500 shadow-2xl max-w-sm z-50"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="text-green-400 font-bold text-lg presto-text">Item Acquired</div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {items.map(item => {
            const Icon = item.icon || Package;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => onOpenItem(item)}
                className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-green-400" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className={`text-xs ${getRarityColor(item.rarity)}`}>{item.rarity} {item.type}</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// Main Equipment Browser component
export default function EquipmentBrowser({ isOpen, onClose, userId }) {
  const [unlockedEquipment, setUnlockedEquipment] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useMessage, setUseMessage] = useState("");
  const [isUsing, setIsUsing] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadEquipment();
    }
  }, [isOpen, userId]);

  const loadEquipment = async () => {
    setLoading(true);
    const equipment = await getUnlockedEquipment(userId);
    setUnlockedEquipment(equipment);
    setLoading(false);
  };

  const handleUseItem = async (item) => {
    if (item.type !== 'Consumable') {
      setUseMessage("This item cannot be used from here");
      setTimeout(() => setUseMessage(""), 2000);
      return;
    }

    setIsUsing(true);
    const result = await useConsumable(userId, item.id);
    
    setUseMessage(result.message);
    setTimeout(() => setUseMessage(""), 3000);
    
    if (result.success && result.consumed) {
      // Reload equipment to reflect consumed item
      await loadEquipment();
      setSelectedItem(null); // Close detail view
    }
    
    setIsUsing(false);
  };

  const groupEquipmentByType = () => {
    const grouped = {};
    unlockedEquipment.forEach(item => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push(item);
    });
    return grouped;
  };

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'Common': return 'text-gray-400';
      case 'Uncommon': return 'text-green-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-orange-400';
      case 'Unique': return 'text-white-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBorder = (rarity) => {
    switch(rarity) {
      case 'Common': return 'border-gray-600';
      case 'Uncommon': return 'border-green-600';
      case 'Rare': return 'border-blue-600';
      case 'Epic': return 'border-purple-600';
      case 'Legendary': return 'border-orange-600';
      case 'Unique': return 'border-white-600';
      default: return 'border-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="display bg-gray-800 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border-2 border-gray-700"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Package className="text-green-400" size={28} />
            <h2 className="text-2xl font-bold text-green-400 presto-text">Inventory</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-400 presto-text">Loading...</div>
          ) : unlockedEquipment.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto mb-4 text-gray-600 presto-text" size={48} />
              <p className="text-gray-400 presto-text">
                No equipment unlocked yet. Continue the story to find gear.
              </p>
            </div>
          ) : selectedItem ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="text-green-400 hover:text-green-300 mb-4 flex items-center gap-2 transition-colors presto-text"
              >
                ← Back to list
              </button>
              <div className={`bg-gray-900 p-6 border-2 ${getRarityBorder(selectedItem.rarity)}`}>
                <div className="flex items-start gap-4 mb-4">
                  {selectedItem.icon && <selectedItem.icon size={36} className="text-green-400" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white presto-text">{selectedItem.name}</h3>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <span className={`presto-text ${getRarityColor(selectedItem.rarity)}`}>{selectedItem.rarity}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-blue-400 presto-text">{selectedItem.type}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-4 presto-text text-sm">
                  {selectedItem.description}
                </p>

                {selectedItem.stats && (
                  <div className="bg-gray-800 p-4 border border-gray-700 mb-4">
                    <div className="text-sm font-semibold text-green-400 mb-2 cinzel-text">Stats:</div>
                    <div className="space-y-1">
                      {Object.entries(selectedItem.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-400 capitalize cinzel-text">{key}:</span>
                          <span className="text-white font-medium presto-text">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Use Item Button for Consumables */}
                {selectedItem.type === 'Consumable' && (
                  <div>
                    <button
                      onClick={() => handleUseItem(selectedItem)}
                      disabled={isUsing}
                      className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold transition-colors mb-2 presto-text"
                    >
                      {isUsing ? "Using..." : "Use Item"}
                    </button>
                    {useMessage && (
                      <div className="text-center text-sm text-green-400 bg-gray-800 p-2 presto-text">
                        {useMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupEquipmentByType()).map(([type, items]) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2 presto-text">
                    <span className="w- h-1 bg-blue-400 presto-text"></span>
                    {type}
                  </h3>
                  <div className="space-y-2">
                    {items.map(item => {
                      const Icon = item.icon || Package;
                      return (
                        <motion.button
                          key={item.id}
                          whileHover={{ scale: 1.02, x: 5 }}
                          onClick={() => setSelectedItem(item)}
                          className={`w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 transition-colors border-l-4 ${getRarityBorder(item.rarity)}`}
                        >
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <Icon size={20} className="text-green-400" />
                              <div>
                                <div className="text-white font-medium presto-text">{item.name}</div>
                                <div className={`text-xs presto-text ${getRarityColor(item.rarity)}`}>{item.rarity}</div>
                              </div>
                            </div>
                            <ChevronRight 
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-green-400" 
                              size={20} 
                            />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <div className="text-sm text-gray-400 text-center presto-text">
            {/* {unlockedEquipment.length} / {Object.keys(EQUIPMENT_ITEMS).length} items collected */}
            {unlockedEquipment.length} items collected
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}