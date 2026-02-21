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
    content: `The world as you knew it ended over a decade ago. The Gates appeared without warning, tearing through reality itself. Now, humanity huddles in fortified cities while the wilderness between has become unpredictable and dangerous.`,
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
  breaker_stats: {
    id: 'breaker_stats',
    title: 'Breaker Statistics',
    category: 'Game Mechanics',
    content: `Breakers develop across four core attributes: Fellowship (social influence), Athletics (physical prowess), Thought (mental acuity), and Essence (magical affinity). Your stat distribution determines your class specialization and combat effectiveness.`,
    unlocksOnPage: 'stat_intro'
  },
  character_akemi: {
    id: 'character_akemi',
    title: 'Akemi Sato',
    category: 'Characters',
    content: `Friendly. Natural leader. Wants to start her own guild. Could be good relationship material. Parents were refugees from Japan during the Fracture Event.\n\nBreaker ID: 102-345-697\n\nBreaker Class: D-Class\n\nAssociation: Ramsey Academy\n\nPath: Undeclared\n\nPrimary Weapon: No Primary Weapon/Alternates`,
    unlocksOnPages: ['akemi_intro', 'wait_others5', 'welcome_back2', 'forest_deeper2'],    
  },
  character_threx: {
    id: 'character_threx',
    title: 'Threx Muller',
    category: 'Characters',
    content: `Leader of your first party. Strong, serious, and genuinly interested in the safety of the Breakers he manages. Used to break gates solo, but decided that parties are the better route after getting rescued in a break gone bad. Large, muscular, high-and-tight haircut, clean shaven.\n\nBreaker ID: 742-137-094\n\nBreaker Class: C-Class\n\nAssociation: Global Protocol Authority\n\nPath: Warrior\n\nPrimary Weapon: Battleaxe`,
    unlocksOnPages: ['threx_brief', 'wait_others5', 'welcome_back2', 'forest_deeper2'],    
    updates: [
      {
        id: 'threx_pass',
        title: 'Deceased',
        content: `Passed during the battle with the Camper.`,
        unlocksOnPage: 'solo_didnt_sacrifice',
        unlocksOnPage: 'together_didnt_sacrifice2'
      },
    ]
  },
  character_ronin: {
    id: 'character_ronin',
    title: 'Ronin Balore',
    category: 'Characters',
    content: `Like you, an orphan. Your former friend and current rival. Blames you for something he's never explained. Obsessed with the Epoch Corporation. Spiky black hair, trim build, Japanese and Irish parentage.\n\nBreaker ID: 301-246-879\n\nBreaker Class: D-Class\n\nAssociation: Unaffiliated\n\nPath: Mixed\n\nPrimary Weapon: E-Corp Self-Oscellating Blade`,
    unlocksOnPages: ['ronin_intro', 'wait_others5', 'welcome_back2', 'forest_deeper2'],    
  },
  character_harla: {
    id: 'character_harla',
    title: 'Harla Freeman',
    category: 'Characters',
    content: `Healer. Into gossip. Harla wears old, dented armor, hinting that she's taken many hits in her life. Middle-aged, dark complected, black hair in a bun.\n\nBreaker ID: 966-931-878\n\nBreaker Class: D-Class\n\nAssociation: Ramsey Academy/ Global Protocol Authority\n\nPath: Mage (Healer)\n\nPrimary Weapon: Assorted Magic`,
    unlocksOnPages: ['team_intro1', 'wait_others5', 'welcome_back2', 'forest_deeper2'],    
    updates: [
      {
        id: 'harla_pass',
        title: 'Deceased',
        content: `Passed during the battle with the Camper.`,
        unlocksOnPage: 'solo_didnt_sacrifice',
        unlocksOnPage: 'together_didnt_sacrifice2'
      },
    ]
  },
  character_kaelion: {
    id: 'character_kaelion',
    title: 'Kaelion Virehart',
    category: 'Characters',
    content: `Acts like a knight. Wears expensive-looking armor and speaks like he belongs in an old romance novel. Cool mustache.\n\nBreaker ID: 825-629-126\n\nBreaker Class: E-Class\n\nAssociation: Ramsey Academy\n\nPath: Warrior\n\nPrimary Weapon: Longsword`,
    unlocksOnPages: ['team_intro2', 'wait_others5', 'welcome_back2', 'forest_deeper2'],
    updates: [
      {
        id: 'kaelion_pass',
        title: 'Deceased',
        content: `Passed during the battle with the Camper.`,
        unlocksOnPage: 'solo_didnt_sacrifice',
        unlocksOnPage: 'together_didnt_sacrifice2'
      },
    ]
  },
  character_sheemie: {
    id: 'character_sheemie',
    title: 'Sheemie Bauer',
    category: 'Characters',
    content: `An energetic mage specializing in plant-based abilities. Friendly. Dorky. Obssesed with trees. Sheemie is short, skinny, and his perpetually-smiling face is pitted with acne scars. Wearing green wizard robes.\n\nBreaker ID: 204-847-186\n\nBreaker Class: E-Class\n\nAssociation: Ramsey Academy\n\nPath: Mage\n\nPrimary Weapon: Tree-themed Magic`,
    unlocksOnPages: ['team_intro3', 'wait_others5', 'welcome_back2', 'forest_deeper2'],    
    updates: [
      {
        id: 'sheemie_pass',
        title: 'Deceased',
        content: `Passed during the battle with the Camper.`,
        unlocksOnPage: 'solo_didnt_sacrifice',
        unlocksOnPage: 'together_didnt_sacrifice2'
      },
    ]
  },
  character_mitzi: {
    id: 'character_mitzi',
    title: 'Mitzi',
    category: 'Characters',
    content: `Dark and edgy. Wears skin-tight black leather. Mitzi is a woman of few words. The words she uses, however, make most people wish she spoke even less. Interested in eventually joining either the Silhouette or Protocol Null.\n\nBreaker ID: 373-179-628\n\nBreaker Class: E-Class\n\nAssociation: Ramsey Academy\n\nPath: Summoner\n\nPrimary Weapon: Creepy Summoning Magic`,
    unlocksOnPages: ['team_intro4', 'wait_others5', 'welcome_back2', 'forest_deeper2'],    
    updates: [
      {
        id: 'mitzi_pass',
        title: 'Deceased',
        content: `Passed during the battle with the Camper.`,
        unlocksOnPage: 'solo_didnt_sacrifice',
        unlocksOnPage: 'together_didnt_sacrifice2'
      },
    ]
  },
  character_aleth: {
    id: 'character_aleth',
    title: 'Aleth Achen',
    category: 'Characters',
    content: `Calm, quiet, and always seeming to notice more than most people. Aleth is skinny, average height, and overtly unactivated. He also perpetually seems to believe that "something is wrong." Unkempt blonde hair. Short, scruffy facial hair, always wearing blue jeans and a white T-shirt.\n\nBreaker ID: 401-236-879\n\nBreaker Class: No Record\n\nAssociation: Ramsey Academy\n\nPath: No Record\n\nPrimary Weapon: Throwing Knives`,
    unlocksOnPages: ['team_intro5', 'wait_others5', 'welcome_back2', 'forest_deeper2'],    
  },
  guild_gpa: {
    id: 'guild_gpa',
    title: 'Global Protocol Authority (GPA)',
    category: 'Factions and Guilds',
    content: `Motto: "Balance Through Strength."\n\nFocus: Regulation, Rankings, Mission Assignment\n\nPresence: Global; HQ in The Association\n\nRole: Oversees Hunter licensing, missions, and Rank progression. Officially neutral, but often tied to Epoch Corp funding.\n\nRumors: May be suppressing knowledge of higher Gate classifications or S+ Awakenings.`,
    // content: `The largest and most established organization of Breakers. They maintain order, fund academies, and get priority access to new gates. Seen as the closest thing to pre-gate government structure.`,
    unlocksOnPages: ['team_portal_victory5', 'forest_deeper', 'agree_threx7'],
  },
  guild_epoch: {
    id: 'guild_epoch',
    title: 'Epoch Corporation',
    category: 'Factions and Guilds',
    content: `Motto: "The Future Must Be Engineered."\n\nFocus: Essence research, artificial Awakening, gear innovation\n\nPresence: Global, with hubs in Zariel's Spine and Halcyon Refract\n\nRole: Manufactures weapons, relics, and experimental mods. Recruits Hunters for research-driven black ops.\n\nRumors: May have triggered early Break Events during failed containment trials.`,
    // content: `A tech-focused guild that creates cutting-edge equipment like Gate Stabilizers and mechanical weapons. They value ingenuity and originality above all else.`,
    unlocksOnPages: ['team_portal_victory5', 'forest_deeper', 'agree_threx7'],
  },
  guild_silhouettes: {
    id: 'guild_silhouettes',
    title: 'The Silhouettes',
    category: 'Factions and Guilds',
    content: `Motto: "Power Without Chains.”\n\nFocus: Rogue Hunters, Gate manipulation, anti-Protocol agenda\n\nPresence: Shadow networks in Vanta Reach, Cinderwake Expanse\n\nRole: Operates as a resistance movement or terror network, depending on your source. Skilled in Gate subversion and illegal Awakening rerolls.\n\nRumors: May have discovered a method to hijack Protocol fragments.`,
    // content: `A breakaway faction seen as dangerous by outsiders. They question the nature of the Protocol and seek deeper understanding. Strongest presence in Blackspire and Halcyon Refract.`,
    unlocksOnPages: ['team_portal_victory5', 'forest_deeper', 'agree_threx7'],
  },
  guild_protocol_null: {
    id: 'guild_protocol_null',
    title: 'Protocol Null',
    category: 'Factions and Guilds',
    content: `Motto: "Unlink Yourself."\n\nFocus: Breaking the System, spiritual Gate transcendence\n\nPresence: Fragmented enclaves across the world\n\nRole: Former Hunters who rejected their Awakening. Believe the Protocol is a lie — a parasitic control algorithm.\n\nRumors: Some have regained full power without using Essence… or LP.`,
    // content: `The most radical faction, with the motto "Unlink yourself." They believe in transcending the Protocol rather than serving it. Members seek to understand and potentially break free from the system.`,
    unlocksOnPages: ['team_portal_victory5', 'forest_deeper', 'agree_threx7'],
  },
  guild_veil_cult: {
    id: 'guild_veil_cult',
    title: 'The Veil Cult',
    category: 'Factions and Guilds',
    content: `Motto: "All Hail the Protocol."\n\nFocus: Gate worship, resistance to Hunter interference\n\nPresence: Hidden temples, high-level infiltrators in Halcyon Refract\n\nRole: Treats Gates as divine, living beings. Disrupting a Gate is heresy. Known to infiltrate guilds and whisper Gate-lore to low-Rank Hunters.\n\nRumors: May be communicating directly with the Gates — or worse, merging with them.`,
    // content: `A spiritual organization that views the gates as divine. Members (who call themselves Scribes) find religious significance in the Protocol and the portals. Often subject to ridicule from other Breakers.`,
    unlocksOnPages: ['team_portal_victory5', 'forest_deeper', 'agree_threx7'],
  },
  guild_silk_road: {
    id: 'guild_silk_road',
    title: 'The Silk Road',
    category: 'Factions and Guilds',
    content: `Motto: \n\nFocus: \n\nPresence: \n\nRole: \n\nRumors: `,
    // content: `The wealthiest guild, specializing in trade and commerce. Membership comes with exceptional financial benefits and opportunities. Known for their sharp uniforms and business acumen.`,
    unlocksOnPages: ['team_portal_victory5', 'forest_deeper', 'agree_threx7'],
  },
  guild_thomur: {
    id: 'guild_thomur',
    title: 'Thomur Guild',
    category: 'Factions and Guilds',
    content: `Motto: \n\nFocus: \n\nPresence: \n\nRole: \n\nRumors: `,
    // content: `A rising guild that specializes in niche markets and hyper-specialized abilities. Their rapid rise to prominence this year has made them an attractive option for Breakers looking to grow with an organization.`,
    unlocksOnPages: ['team_portal_victory5', 'forest_deeper', 'agree_threx7'],
  },
  gate_stabilizer: {
    id: 'gate_stabilizer',
    title: 'Gate Stabilizer',
    category: 'Technology',
    // content: `An Epoch Corporation device that locks portals open after the Tethered Being is defeated. Without one, Breakers have only 10 minutes to exit before being trapped forever.`,
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
  },
  city_states: {
    id: 'city_states',
    title: 'City States',
    category: 'Lore',
    content: `The collapse of global governments led to the rise of fortified city-states and mobile command zones, built around or near active Gates. These regions represent humanity’s desperate attempts to survive, weaponize, and regulate the phenomenon of dimensional incursion.\n\nEach city-state operates independently, often controlled by factions, corporate alliances, or rogue guild coalitions. Gates warp the terrain around them — altering climate, biology, and time in subtle or extreme ways. As a result, each region has a unique flavor, threat ecosystem, and Protocol fingerprint.`,
    unlocksOnPage: 'chapter1_end_card',
    updates: [] // Can have multiple updates
  },
  vanta_reach: {
    id: 'vanta_reach',
    title: 'Vanta Reach',
    category: 'Regions',
    content: `Location: Arctic perimeter near collapsed Icelandic Gate\n\nControlled by: None (officially). Rumored Silhouette activity.\n\nFrozen overrun ruins of a former global research outpost\n\nSmall outpost called Blackspire operates as a forward base for Hunter raids and survivalist guilds`,
    unlocksOnPage: 'chapter1_end_card',
    updates: [] // Can have multiple updates
  },
  zariels_spine: {
    id: 'zariels_spine',
    title: 'Zariel\'s Spine',
    category: 'Regions',
    content: `Location: Cracked mountain chain along South America’s equator\n\nControlled by: Epoch Corp and the World Hunter Association\n\nWalled megacity Aethervault, built into the mountain itself\n\nHome to elite Hunters, gear forges, and Protocol-linked research lab`,
    unlocksOnPage: 'chapter1_end_card',
    updates: [] // Can have multiple updates
  },
  cinderwake_expanse: {
    id: 'cinderwake_expanse',
    title: 'Cinderwake Expanse',
    category: 'Regions',
    content: `Location: Desertified ruins of central Africa\n\nControlled by: No central authority; local guilds rule by force\n\nScavenger stronghold Hollowpoint, built from repurposed drones and salvaged vehicles\n\nKnown for trading relics, illegal tech, and bio-mods`,
    unlocksOnPage: 'chapter1_end_card',
    updates: [] // Can have multiple updates
  },
  nimbus_verge: {
    id: 'nimbus_verge',
    title: 'Nimbus Verge',
    category: 'Regions',
    content: `Location: Floating urban arcology over collapsed sea Gates in the Pacific\n\nControlled by: The Veil Cult (covertly), with surface operations run by Association proxies\n\nUrban platform city known as Halcyon Refract, famed for luxury, paranoia, and sudden disappearances. Used to be Silicon Valley`,
    unlocksOnPage: 'chapter1_end_card',
    updates: [] // Can have multiple updates
  },

};

// Check and unlock data packets based on page
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
      // Support both single page (unlocksOnPage) and multiple pages (unlocksOnPages)
      const unlockPages = Array.isArray(packet.unlocksOnPages) 
        ? packet.unlocksOnPages 
        : packet.unlocksOnPage 
          ? [packet.unlocksOnPage] 
          : [];
      
      if (unlockPages.includes(pageId) && !unlockedPackets.includes(packet.id)) {
        newlyUnlocked.push({
          ...packet,
          isUpdate: false
        });
      }
      
      // Check for packet updates
      if (packet.updates && packet.updates.length > 0) {
        packet.updates.forEach(update => {
          const updateKey = `${packet.id}_${update.id}`;
          
          // Support both single and multiple unlock pages for updates
          const updateUnlockPages = Array.isArray(update.unlocksOnPages)
            ? update.unlocksOnPages
            : update.unlocksOnPage
              ? [update.unlocksOnPage]
              : [];
          
          if (updateUnlockPages.includes(pageId) && !unlockedUpdates.includes(updateKey)) {
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
      
      console.log(`Unlocked ${newlyUnlocked.length} data packet(s) on page: ${pageId}`);
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
          <div className="text-blue-400 font-semibold text-lg presto-text">
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
              <h2 className="text-2xl font-bold text-blue-400 presto-text">Data Packets</h2>
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
            ) : unlockedPackets.length === 0 ? (
              <div className="text-center py-8">
                <Database className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="text-gray-400 presto-text">
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
                  className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2 transition-colors presto-text"
                >
                  ← Back to packets
                </button>
                <div className={`bg-gray-900 p-6 border border-gray-700`}>
                  <div className="text-sm text-blue-400 mb-2 cinzel-text">{selectedPacket.category}</div>
                  <h3 className="text-xl font-bold mb-4 text-white presto-text">{selectedPacket.title}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line presto-text text-sm">
                        {selectedPacket.content}
                      </p>
                    </div>
                    
                    {/* Show unlocked updates */}
                    {selectedPacket.unlockedUpdates && selectedPacket.unlockedUpdates.length > 0 && (
                      <div className="border-t border-gray-700 pt-4 mt-4">
                        <div className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2 presto-text">
                          <span>↻</span>
                          <span>Additional Information</span>
                        </div>
                        <div className="space-y-3">
                          {selectedPacket.unlockedUpdates.map((update, idx) => (
                            <div key={idx} className="bg-gray-800 p-3 border-l-2 border-yellow-400">
                              <div className="text-sm font-medium text-yellow-400 mb-1 presto-text">{update.title}</div>
                              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line presto-text">
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
                    <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2 cinzel-text">
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
                            <span className="text-white presto-text">{packet.title}</span>
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
            <div className="text-sm text-gray-400 text-center presto-text">
              {unlockedPackets.length} / {Object.keys(DATA_PACKETS).length} packets unlocked
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
}