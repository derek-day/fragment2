"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Database, ChevronRight } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Data packet definitions
export const DATA_PACKETS = {
  world_state: {
    id: 'world_state',
    title: 'The State of the World',
    category: 'Lore',
    content: `The world as you knew it ended three years ago. The Gates appeared without warning, tearing through reality itself. Now, humanity huddles in fortified cities while the wilderness between has become unpredictable and dangerous.`,
    unlocksOnPage: 'page_1',
    updates: [] // Can have multiple updates
  },
  the_gates: {
    id: 'the_gates',
    title: 'The Gates',
    category: 'Lore',
    content: `Massive rifts in space-time that connect our world to... elsewhere. They pulse with an otherworldly energy, and those who venture too close report hearing whispers in languages that shouldn't exist.`,
    unlocksOnPage: 'inspect_edges'
  },
  portal_basics: {
    id: 'portal_basics',
    title: 'Portal Classifications',
    category: 'Technology',
    content: `Portals are ranked from E-Class (safest) to S-Class (catastrophic). Gold portals typically indicate treasure opportunities. The color, shape, and energy signature all provide clues about what awaits inside.`,
    unlocksOnPage: 'edges_continued'
  },
  the_protocol: {
    id: 'the_protocol',
    title: 'The Protocol',
    category: 'Lore',
    content: `A mysterious entity that bridges the gap between humanity and supernatural power. Accessed through the Halcyon AI in Activation Chambers, the Protocol grants abilities beyond normal human capacity. Its true nature and intentions remain unknown.`,
    unlocksOnPage: 'protocol_intro'
  },
  activation_chamber: {
    id: 'activation_chamber',
    title: 'Activation Chamber',
    category: 'Technology',
    content: `The place where potential Breakers interface with the Protocol through the Halcyon AI. Success grants supernatural abilities and AR displays. Failure means relying on digital readers and hoping activation occurs in the field.`,
    unlocksOnPage: 'failed_to_connect'
  },
  breaker_stats: {
    id: 'breaker_stats',
    title: 'Breaker Statistics',
    category: 'Game Mechanics',
    content: `Breakers develop across four core attributes: Fellowship (social influence), Athletics (physical prowess), Thought (mental acuity), and Essence (magical affinity). Your stat distribution determines your class specialization and combat effectiveness.`,
    unlocksOnPage: 'stat_intro'
  },
  character_akemi: {
    id: 'character_akemi',
    title: 'Akemi',
    category: 'Characters',
    content: `A friendly and optimistic Breaker-in-training from Ramsey Academy. She dreams of starting her own guild someday and seems genuinely interested in making connections with fellow Breakers.`,
    unlocksOnPage: 'akemi_intro',
    updates: [
      {
        id: 'akemi_update_1',
        title: 'Guild Ambitions',
        content: `Akemi revealed her serious plans to start her own guild once she's strong enough. She's already thinking about recruitment and seems to see potential in you as a founding member.`,
        unlocksOnPage: 'guild_thomur_guild' // or wherever she mentions this
      },
      {
        id: 'akemi_update_2',
        title: 'Combat Style',
        content: `During the battle, you noticed Akemi favors a versatile fighting style. She doesn't seem to want to lock herself into a single specialization, preferring adaptability over raw power.`,
        unlocksOnPage: 'team_portal_battle' // or relevant battle page
      }
    ]
  },
  character_threx: {
    id: 'character_threx',
    title: 'Threx',
    category: 'Characters',
    content: `C-Class Breaker and your party leader. Experienced, powerful, and no-nonsense. He takes his role seriously and expects the same from his team members.`,
    unlocksOnPage: 'threx_brief'
  },
  character_ronin: {
    id: 'character_ronin',
    title: 'Ronin',
    category: 'Characters',
    content: `A fellow freelance Breaker who harbors strong negative feelings toward you. He wields mechanical knives from the Epoch Corporation and aspires to join their ranks.`,
    unlocksOnPage: 'ronin_intro'
  },
  character_harla: {
    id: 'character_harla',
    title: 'Harla',
    category: 'Characters',
    content: `The team's healer and a formidable fighter in her own right. Her dented armor tells the story of someone who can both take and heal from serious hits. She has a taste for gossip.`,
    unlocksOnPage: 'team_intro1'
  },
  character_kaelion: {
    id: 'character_kaelion',
    title: 'Kaelion Virehart',
    category: 'Characters',
    content: `A warrior in exceptionally expensive armor who speaks like a knight from old tales. His handlebar mustache and formal manner of speaking make him memorable, if somewhat anachronistic.`,
    unlocksOnPage: 'team_intro2'
  },
  character_sheemie: {
    id: 'character_sheemie',
    title: 'Sheemie',
    category: 'Characters',
    content: `An energetic mage specializing in plant-based abilities. He dreams of joining the Thomur Guild and has an infectious enthusiasm that borders on overwhelming.`,
    unlocksOnPage: 'team_intro3'
  },
  character_mitzi: {
    id: 'character_mitzi',
    title: 'Mitzi',
    category: 'Characters',
    content: `A quiet, deadpan mage dressed in skin-tight black leather. She's interested in joining either The Silhouettes or Protocol Null, organizations that question the nature of the Protocol itself.`,
    unlocksOnPage: 'team_intro4'
  },
  character_aleth: {
    id: 'character_aleth',
    title: 'Aleth',
    category: 'Characters',
    content: `An unactivated samurai with keen instincts. He often senses when something is wrong and prefers to remain freelance. Despite not being connected to the Protocol, he's proven himself capable.`,
    unlocksOnPage: 'team_intro5'
  },
  guild_gpa: {
    id: 'guild_gpa',
    title: 'Global Protocol Authority',
    category: 'Factions',
    content: `The largest and most established organization of Breakers. They maintain order, fund academies, and get priority access to new gates. Seen as the closest thing to pre-gate government structure.`,
    unlocksOnPage: 'guild_gpa'
  },
  guild_epoch: {
    id: 'guild_epoch',
    title: 'Epoch Corporation',
    category: 'Factions',
    content: `A tech-focused guild that creates cutting-edge equipment like Gate Stabilizers and mechanical weapons. They value ingenuity and originality above all else.`,
    unlocksOnPage: 'guild_epoch'
  },
  guild_silhouettes: {
    id: 'guild_silhouettes',
    title: 'The Silhouettes',
    category: 'Factions',
    content: `A breakaway faction seen as dangerous by outsiders. They question the nature of the Protocol and seek deeper understanding. Strongest presence in Blackspire and Halcyon Refract.`,
    unlocksOnPage: 'guild_silhouette'
  },
  guild_protocol_null: {
    id: 'guild_protocol_null',
    title: 'Protocol Null',
    category: 'Factions',
    content: `The most radical faction, with the motto "Unlink yourself." They believe in transcending the Protocol rather than serving it. Members seek to understand and potentially break free from the system.`,
    unlocksOnPage: 'guild_protocol_null'
  },
  guild_veil_cult: {
    id: 'guild_veil_cult',
    title: 'The Veil Cult (The Scribes)',
    category: 'Factions',
    content: `A spiritual organization that views the gates as divine. Members (who call themselves Scribes) find religious significance in the Protocol and the portals. Often subject to ridicule from other Breakers.`,
    unlocksOnPage: 'guild_veil_cult'
  },
  guild_silk_road: {
    id: 'guild_silk_road',
    title: 'The Silk Road',
    category: 'Factions',
    content: `The wealthiest guild, specializing in trade and commerce. Membership comes with exceptional financial benefits and opportunities. Known for their sharp uniforms and business acumen.`,
    unlocksOnPage: 'guild_silk_road'
  },
  guild_thomur: {
    id: 'guild_thomur',
    title: 'Thomur Guild',
    category: 'Factions',
    content: `A rising guild that specializes in niche markets and hyper-specialized abilities. Their rapid rise to prominence this year has made them an attractive option for Breakers looking to grow with an organization.`,
    unlocksOnPage: 'guild_thomur_guild'
  },
  gate_stabilizer: {
    id: 'gate_stabilizer',
    title: 'Gate Stabilizer',
    category: 'Technology',
    content: `An Epoch Corporation device that locks portals open after the Tethered Being is defeated. Without one, Breakers have only 10 minutes to exit before being trapped forever.`,
    unlocksOnPage: 'gate_stabilizer_check'
  },
  tethered_beings: {
    id: 'tethered_beings',
    title: 'Tethered Beings',
    category: 'Lore',
    content: `The entities connected to each gate. Defeating them destabilizes the portal unless a Gate Stabilizer is deployed. They represent the core threat that must be eliminated to clear a gate.`,
    unlocksOnPage: 'forest_shack'
  },
  campers: {
    id: 'campers',
    title: 'Campers',
    category: 'Threats',
    content: `Dangerous entities from other worlds that infiltrate low-rank gates to ambush unsuspecting Breakers. They don't register properly on portal threat assessments, making them deadly surprises.`,
    unlocksOnPage: 'speak_to_creature2'
  }
};

// Check and unlock packets based on page
export async function checkAndUnlockPackets(userId, pageId) {
  if (!userId) return [];
  
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return [];
    
    const userData = userSnap.data();
    const unlockedPackets = userData.unlockedDataPackets || [];
    const unlockedUpdates = userData.unlockedDataPacketUpdates || [];
    
    const newlyUnlocked = [];
    
    // Check for new base packets
    Object.values(DATA_PACKETS).forEach(packet => {
      if (packet.unlocksOnPage === pageId && !unlockedPackets.includes(packet.id)) {
        newlyUnlocked.push({
          ...packet,
          isUpdate: false
        });
      }
      
      // Check for packet updates
      if (packet.updates && packet.updates.length > 0) {
        packet.updates.forEach(update => {
          const updateKey = `${packet.id}_${update.id}`;
          if (update.unlocksOnPage === pageId && !unlockedUpdates.includes(updateKey)) {
            newlyUnlocked.push({
              id: packet.id,
              title: `${packet.title}: ${update.title}`,
              category: packet.category,
              content: update.content,
              isUpdate: true,
              updateId: update.id,
              parentPacketId: packet.id
            });
          }
        });
      }
    });
    
    // Update Firestore if there are new items
    if (newlyUnlocked.length > 0) {
      const newPackets = newlyUnlocked.filter(p => !p.isUpdate).map(p => p.id);
      const newUpdates = newlyUnlocked.filter(p => p.isUpdate).map(p => `${p.parentPacketId}_${p.updateId}`);
      
      const updates = {};
      if (newPackets.length > 0) {
        updates.unlockedDataPackets = [...unlockedPackets, ...newPackets];
      }
      if (newUpdates.length > 0) {
        updates.unlockedDataPacketUpdates = [...unlockedUpdates, ...newUpdates];
      }
      
      await updateDoc(userRef, updates);
      
      return newlyUnlocked;
    }
    
    return [];
  } catch (error) {
    console.error("Error checking data packets:", error);
    return [];
  }
}

// Get all unlocked packets for a user
export async function getUnlockedPackets(userId) {
  if (!userId) return [];
  
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return [];
    
    const userData = userSnap.data();
    const unlockedIds = userData.unlockedDataPackets || [];
    const unlockedUpdates = userData.unlockedDataPacketUpdates || [];
    
    const packets = Object.values(DATA_PACKETS)
      .filter(p => unlockedIds.includes(p.id))
      .map(packet => {
        // Add unlocked updates to the packet
        const packetUpdates = packet.updates ? packet.updates.filter(update => {
          const updateKey = `${packet.id}_${update.id}`;
          return unlockedUpdates.includes(updateKey);
        }) : [];
        
        return {
          ...packet,
          unlockedUpdates: packetUpdates
        };
      });
    
    return packets;
  } catch (error) {
    console.error("Error getting unlocked packets:", error);
    return [];
  }
}

// Notification component for new packets
export function DataPacketNotification({ packets, onClose, onOpenPacket }) {
  if (!packets || packets.length === 0) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="display fixed bottom-4 right-4 bg-gray-800 border border-blue-500 shadow-2xl max-w-sm z-50"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="text-blue-400 font-bold text-lg">
            {packets.some(p => p.isUpdate) ? 'Data Packet Updated' : 'Data Packet Received'}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {packets.map(packet => (
            <motion.button
              key={packet.isUpdate ? `${packet.parentPacketId}_${packet.updateId}` : packet.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onOpenPacket(packet)}
              className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <span className={packet.isUpdate ? "text-yellow-400" : "text-blue-400"}>
                {packet.isUpdate ? "↻" : "•"}
              </span>
              <span className="text-sm">{packet.title}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Main Data Packet Browser component
export default function DataPacketBrowser({ isOpen, onClose, userId }) {
  const [unlockedPackets, setUnlockedPackets] = useState([]);
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      loadPackets();
    }
  }, [isOpen, userId]);

  const loadPackets = async () => {
    setLoading(true);
    const packets = await getUnlockedPackets(userId);
    setUnlockedPackets(packets);
    setLoading(false);
  };

  const groupPacketsByCategory = () => {
    const grouped = {};
    unlockedPackets.forEach(packet => {
      if (!grouped[packet.category]) {
        grouped[packet.category] = [];
      }
      grouped[packet.category].push(packet);
    });
    return grouped;
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
              <Database className="text-blue-400" size={28} />
              <h2 className="text-2xl font-bold text-blue-400">Data Packets</h2>
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
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : unlockedPackets.length === 0 ? (
              <div className="text-center py-8">
                <Database className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="text-gray-400">
                  No data packets unlocked yet. Continue the story to discover more.
                </p>
              </div>
            ) : selectedPacket ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <button
                  onClick={() => setSelectedPacket(null)}
                  className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2 transition-colors"
                >
                  ← Back to packets
                </button>
                <div className={`bg-gray-900 p-6 border border-gray-700`}>
                  <div className="text-sm text-blue-400 mb-2">{selectedPacket.category}</div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{selectedPacket.title}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {selectedPacket.content}
                      </p>
                    </div>
                    
                    {/* Show unlocked updates */}
                    {selectedPacket.unlockedUpdates && selectedPacket.unlockedUpdates.length > 0 && (
                      <div className="border-t border-gray-700 pt-4 mt-4">
                        <div className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                          <span>↻</span>
                          <span>Additional Information</span>
                        </div>
                        <div className="space-y-3">
                          {selectedPacket.unlockedUpdates.map((update, idx) => (
                            <div key={idx} className="bg-gray-800 p-3 border-l-2 border-yellow-400">
                              <div className="text-sm font-medium text-yellow-400 mb-1">{update.title}</div>
                              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                {update.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupPacketsByCategory()).map(([category, packets]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                      <span className="w- h-1 bg-blue-400"></span>
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {packets.map(packet => (
                        <motion.button
                          key={packet.id}
                          whileHover={{ scale: 1.02, x: 5 }}
                          onClick={() => setSelectedPacket(packet)}
                          className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-white">{packet.title}</span>
                            {packet.unlockedUpdates && packet.unlockedUpdates.length > 0 && (
                              <span className="text-xs bg-yellow-600 text-white px-2 py-0.5">
                                {packet.unlockedUpdates.length} update{packet.unlockedUpdates.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <ChevronRight 
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" 
                            size={20} 
                          />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 bg-gray-900">
            <div className="text-sm text-gray-400 text-center">
              {unlockedPackets.length} / {Object.keys(DATA_PACKETS).length} packets unlocked
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
}











// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Database, ChevronRight } from "lucide-react";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../lib/firebase";

// // Data packet definitions
// export const DATA_PACKETS = {
//   world_state: {
//     id: 'world_state',
//     title: 'The State of the World',
//     category: 'Lore',
//     content: `The world was once familiar. Cities bustled, governments ruled, science pushed forward. Then the Gates appeared — silent, hovering anomalies that defied space and time. Within weeks, the first monsters emerged. Entire continents were wiped out. Conventional weapons could only slow them, only atomics.\n\nIn response, a select few Awakened. They heard the voice of the Protocol, saw invisible text and numbers overlay their vision, and gained abilities beyond explanation. They became known as Breakers, and their existence changed everything.\n\nNow, society exists in a state of permanent tension. Technology continues to advance, but resources are funneled into defense. Massive Gate Zones have been walled off. Cities operate in shifts depending on nearby anomalies. Militaries have been replaced with Guilds. The old world is gone — replaced by survival, structure, and secrets.`,
//     unlocksOnPage: 'page_1'
//   },
//   the_gates: {
//     id: 'the_gates',
//     title: 'The Gates',
//     category: 'Lore',
//     content: `Each is a breach between dimensions — their origin unknown. Some believe they lead to alternate realities; others say they are fragments of a decaying multiverse.\n\nFailure to clear a Gate in time results in a Rift, releasing its contents into the world.`,
//     unlocksOnPage: 'page_1'
//   },
//   portal_basics: {
//     id: 'portal_basics',
//     title: 'Portal Classifications',
//     category: 'Technology',
//     content: `Portals are ranked from E-Class (safest) to S-Class (catastrophic). Gold portals typically indicate treasure opportunities. The color, shape, and energy signature all provide clues about what awaits inside.`,
//     unlocksOnPage: 'page_1'
//   },
//   the_protocol: {
//     id: 'the_protocol',
//     title: 'The Protocol',
//     category: 'Lore',
//     content: `No one truly understands the Gatebreaker Protocol. It appears to be an adaptive, possibly sentient force that connects Awakened individuals across the globe. Some believe it is alien. Others, divine. A few claim it is humanity's own future leaking back through time.Every Hunter is bound to the Gatebreaker Protocol, granting them access to:\n\nEssence – Energy used to cast spells and activate abilities\n\nLife Points (LP) – Your endurance in battle\n\nBreaker Points (HP) – Experience used to unlock and upgrade abilities\n\nThe Skill Tree System – Choose your Path and build your power`,
//     unlocksOnPage: 'page_1'
//   },
//   activation_chamber: {
//     id: 'activation_chamber',
//     title: 'Activation Chamber',
//     category: 'Technology',
//     content: `The place where potential Breakers interface with the Protocol through the Halcyon AI. Success grants supernatural abilities and AR displays. Failure means relying on digital readers and hoping activation occurs in the field.`,
//     unlocksOnPage: 'failed_to_connect'
//   },
//   breaker_stats: {
//     id: 'breaker_stats',
//     title: 'Breaker Statistics',
//     category: 'Game Mechanics',
//     content: `Breakers develop across four core attributes: Fellowship (social influence), Athletics (physical prowess), Thought (mental acuity), and Essence (magical affinity). Your stat distribution determines your class specialization and combat effectiveness.`,
//     unlocksOnPage: 'stat_intro'
//   },
//   character_akemi: {
//     id: 'character_akemi',
//     title: 'Akemi',
//     category: 'Characters',
//     content: `A friendly and optimistic Breaker-in-training from Ramsey Academy. She dreams of starting her own guild someday and seems genuinely interested in making connections with fellow Breakers.`,
//     unlocksOnPage: 'akemi_intro'
//   },
//   character_threx: {
//     id: 'character_threx',
//     title: 'Threx',
//     category: 'Characters',
//     content: `C-Class Breaker and your party leader. Experienced, powerful, and no-nonsense. He takes his role seriously and expects the same from his team members.`,
//     unlocksOnPage: 'threx_brief'
//   },
//   character_ronin: {
//     id: 'character_ronin',
//     title: 'Ronin',
//     category: 'Characters',
//     content: `A fellow freelance Breaker who harbors strong negative feelings toward you. He wields mechanical knives from the Epoch Corporation and aspires to join their ranks.`,
//     unlocksOnPage: 'ronin_intro'
//   },
//   character_harla: {
//     id: 'character_harla',
//     title: 'Harla',
//     category: 'Characters',
//     content: `The team's healer and a formidable fighter in her own right. Her dented armor tells the story of someone who can both take and heal from serious hits. She has a taste for gossip.`,
//     unlocksOnPage: 'team_intro1'
//   },
//   character_kaelion: {
//     id: 'character_kaelion',
//     title: 'Kaelion Virehart',
//     category: 'Characters',
//     content: `A warrior in exceptionally expensive armor who speaks like a knight from old tales. His handlebar mustache and formal manner of speaking make him memorable, if somewhat anachronistic.`,
//     unlocksOnPage: 'team_intro2'
//   },
//   character_sheemie: {
//     id: 'character_sheemie',
//     title: 'Sheemie',
//     category: 'Characters',
//     content: `An energetic mage specializing in plant-based abilities. He dreams of joining the Thomur Guild and has an infectious enthusiasm that borders on overwhelming.`,
//     unlocksOnPage: 'team_intro3'
//   },
//   character_mitzi: {
//     id: 'character_mitzi',
//     title: 'Mitzi',
//     category: 'Characters',
//     content: `A quiet, deadpan mage dressed in skin-tight black leather. She's interested in joining either The Silhouettes or Protocol Null, organizations that question the nature of the Protocol itself.`,
//     unlocksOnPage: 'team_intro4'
//   },
//   character_aleth: {
//     id: 'character_aleth',
//     title: 'Aleth',
//     category: 'Characters',
//     content: `An unactivated samurai with keen instincts. He often senses when something is wrong and prefers to remain freelance. Despite not being connected to the Protocol, he's proven himself capable.`,
//     unlocksOnPage: 'team_intro5'
//   },
//   guild_gpa: {
//     id: 'guild_gpa',
//     title: 'Global Protocol Authority',
//     category: 'Factions',
//     content: `The largest and most established organization of Breakers. They maintain order, fund academies, and get priority access to new gates. Seen as the closest thing to pre-gate government structure.`,
//     unlocksOnPage: 'guild_gpa'
//   },
//   guild_epoch: {
//     id: 'guild_epoch',
//     title: 'Epoch Corporation',
//     category: 'Factions',
//     content: `A tech-focused guild that creates cutting-edge equipment like Gate Stabilizers and mechanical weapons. They value ingenuity and originality above all else.`,
//     unlocksOnPage: 'guild_epoch'
//   },
//   guild_silhouettes: {
//     id: 'guild_silhouettes',
//     title: 'The Silhouettes',
//     category: 'Factions',
//     content: `A breakaway faction seen as dangerous by outsiders. They question the nature of the Protocol and seek deeper understanding. Strongest presence in Blackspire and Halcyon Refract.`,
//     unlocksOnPage: 'guild_silhouette'
//   },
//   guild_protocol_null: {
//     id: 'guild_protocol_null',
//     title: 'Protocol Null',
//     category: 'Factions',
//     content: `The most radical faction, with the motto "Unlink yourself." They believe in transcending the Protocol rather than serving it. Members seek to understand and potentially break free from the system.`,
//     unlocksOnPage: 'guild_protocol_null'
//   },
//   guild_veil_cult: {
//     id: 'guild_veil_cult',
//     title: 'The Veil Cult (The Scribes)',
//     category: 'Factions',
//     content: `A spiritual organization that views the gates as divine. Members (who call themselves Scribes) find religious significance in the Protocol and the portals. Often subject to ridicule from other Breakers.`,
//     unlocksOnPage: 'guild_veil_cult'
//   },
//   guild_silk_road: {
//     id: 'guild_silk_road',
//     title: 'The Silk Road',
//     category: 'Factions',
//     content: `The wealthiest guild, specializing in trade and commerce. Membership comes with exceptional financial benefits and opportunities. Known for their sharp uniforms and business acumen.`,
//     unlocksOnPage: 'guild_silk_road'
//   },
//   guild_thomur: {
//     id: 'guild_thomur',
//     title: 'Thomur Guild',
//     category: 'Factions',
//     content: `A rising guild that specializes in niche markets and hyper-specialized abilities. Their rapid rise to prominence this year has made them an attractive option for Breakers looking to grow with an organization.`,
//     unlocksOnPage: 'guild_thomur_guild'
//   },
//   gate_stabilizer: {
//     id: 'gate_stabilizer',
//     title: 'Gate Stabilizer',
//     category: 'Technology',
//     content: `An Epoch Corporation device that locks portals open after the Tethered Being is defeated. Without one, Breakers have only 10 minutes to exit before being trapped forever.`,
//     unlocksOnPage: 'gate_stabilizer_check'
//   },
//   tethered_beings: {
//     id: 'tethered_beings',
//     title: 'Tethered Beings',
//     category: 'Lore',
//     content: `The entities connected to each gate. Defeating them destabilizes the portal unless a Gate Stabilizer is deployed. They represent the core threat that must be eliminated to clear a gate.`,
//     unlocksOnPage: 'forest_shack'
//   },
//   campers: {
//     id: 'campers',
//     title: 'Campers',
//     category: 'Threats',
//     content: `Dangerous entities from other worlds that infiltrate low-rank gates to ambush unsuspecting Breakers. They don't register properly on portal threat assessments, making them deadly surprises.`,
//     unlocksOnPage: 'speak_to_creature2'
//   }
// };

// // Check and unlock packets based on page
// export async function checkAndUnlockPackets(userId, pageId) {
//   if (!userId) return [];
  
//   try {
//     const userRef = doc(db, "users", userId);
//     const userSnap = await getDoc(userRef);
    
//     if (!userSnap.exists()) return [];
    
//     const userData = userSnap.data();
//     const unlockedPackets = userData.unlockedDataPackets || [];
    
//     // Find packets that should unlock on this page
//     const newPackets = Object.values(DATA_PACKETS).filter(
//       packet => packet.unlocksOnPage === pageId && !unlockedPackets.includes(packet.id)
//     );
    
//     // Update Firestore if there are new packets
//     if (newPackets.length > 0) {
//       const updatedUnlocked = [...unlockedPackets, ...newPackets.map(p => p.id)];
//       await updateDoc(userRef, {
//         unlockedDataPackets: updatedUnlocked
//       });
      
//       return newPackets;
//     }
    
//     return [];
//   } catch (error) {
//     console.error("Error checking data packets:", error);
//     return [];
//   }
// }

// // Get all unlocked packets for a user
// export async function getUnlockedPackets(userId) {
//   if (!userId) return [];
  
//   try {
//     const userRef = doc(db, "users", userId);
//     const userSnap = await getDoc(userRef);
    
//     if (!userSnap.exists()) return [];
    
//     const userData = userSnap.data();
//     const unlockedIds = userData.unlockedDataPackets || [];
    
//     return Object.values(DATA_PACKETS).filter(p => unlockedIds.includes(p.id));
//   } catch (error) {
//     console.error("Error getting unlocked packets:", error);
//     return [];
//   }
// }

// // Notification component for new packets
// export function DataPacketNotification({ packets, onClose, onOpenPacket }) {
//   if (!packets || packets.length === 0) return null;

//   return (
//     <motion.div
//       initial={{ x: 400, opacity: 0 }}
//       animate={{ x: 0, opacity: 1 }}
//       exit={{ x: 400, opacity: 0 }}
//       transition={{ duration: 0.3 }}
//       className="fixed bottom-4 right-4 bg-gray-800 border-2 border-blue-500 shadow-2xl max-w-sm z-50"
//     >
//       <div className="p-4">
//         <div className="flex justify-between items-start mb-3">
//           <div className="text-blue-400 font-bold text-lg">Data Packet Received</div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-200 transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <div className="space-y-2">
//           {packets.map(packet => (
//             <motion.button
//               key={packet.id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               whileHover={{ scale: 1.02 }}
//               onClick={() => onOpenPacket(packet)}
//               className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 transition-colors flex items-center gap-2"
//             >
//               <span className="text-blue-400">•</span>
//               <span className="text-sm">{packet.title}</span>
//             </motion.button>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // Main Data Packet Browser component
// export default function DataPacketBrowser({ isOpen, onClose, userId }) {
//   const [unlockedPackets, setUnlockedPackets] = useState([]);
//   const [selectedPacket, setSelectedPacket] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (isOpen && userId) {
//       loadPackets();
//     }
//   }, [isOpen, userId]);

//   const loadPackets = async () => {
//     setLoading(true);
//     const packets = await getUnlockedPackets(userId);
//     setUnlockedPackets(packets);
//     setLoading(false);
//   };

//   const groupPacketsByCategory = () => {
//     const grouped = {};
//     unlockedPackets.forEach(packet => {
//       if (!grouped[packet.category]) {
//         grouped[packet.category] = [];
//       }
//       grouped[packet.category].push(packet);
//     });
//     return grouped;
//   };

//   if (!isOpen) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
//         onClick={onClose}
//       >
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.9, opacity: 0 }}
//           onClick={(e) => e.stopPropagation()}
//           className="bg-gray-800 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border-2 border-gray-700"
//         >
//           {/* Header */}
//           <div className="flex justify-between items-center p-6 border-b border-gray-700">
//             <div className="flex items-center gap-3">
//               <Database className="text-blue-400" size={28} />
//               <h2 className="text-2xl font-bold text-blue-400">Data Packets</h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-200 transition-colors"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {loading ? (
//               <div className="text-center py-8 text-gray-400">Loading...</div>
//             ) : unlockedPackets.length === 0 ? (
//               <div className="text-center py-8">
//                 <Database className="mx-auto mb-4 text-gray-600" size={48} />
//                 <p className="text-gray-400">
//                   No data packets unlocked yet. Continue the story to discover more.
//                 </p>
//               </div>
//             ) : selectedPacket ? (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//               >
//                 <button
//                   onClick={() => setSelectedPacket(null)}
//                   className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2 transition-colors"
//                 >
//                   ← Back to list
//                 </button>
//                 <div className="bg-gray-900 p-6 border border-gray-700">
//                   <div className="text-sm text-blue-400 mb-2">{selectedPacket.category}</div>
//                   <h3 className="text-2xl font-bold mb-4 text-white">{selectedPacket.title}</h3>
//                   <p className="text-gray-300 leading-relaxed whitespace-pre-line">
//                     {selectedPacket.content}
//                   </p>
//                 </div>
//               </motion.div>
//             ) : (
//               <div className="space-y-6">
//                 {Object.entries(groupPacketsByCategory()).map(([category, packets]) => (
//                   <motion.div
//                     key={category}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                   >
//                     <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
//                       <span className="w-2 h-2 bg-blue-400"></span>
//                       {category}
//                     </h3>
//                     <div className="space-y-2">
//                       {packets.map(packet => (
//                         <motion.button
//                           key={packet.id}
//                           whileHover={{ scale: 1.02, x: 5 }}
//                           onClick={() => setSelectedPacket(packet)}
//                           className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-between group"
//                         >
//                           <span className="text-white">{packet.title}</span>
//                           <ChevronRight 
//                             className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" 
//                             size={20} 
//                           />
//                         </motion.button>
//                       ))}
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="p-4 border-t border-gray-700 bg-gray-900">
//             <div className="text-sm text-gray-400 text-center">
//               {unlockedPackets.length} / {Object.keys(DATA_PACKETS).length} packets unlocked
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }