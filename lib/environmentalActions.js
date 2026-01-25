export const environmentalActions = {
  forest: {
    id: "falling_tree",
    name: "Topple Tree",
    description: "Knock over a dead tree onto the critter",
    // icon: "🌲",
    stat: "Athletics", // Which stat to use for the roll
    dc: 12, // Difficulty class
    damage: { dice: 2, sides: 8 }, // 2d8 damage
    // effect: "Target must succeed DC 13 save or be stunned for 1 turn",
    oneTimeUse: true
  },
  
  ruins: {
    id: "collapse_pillar",
    name: "Collapse Pillar",
    description: "Bring down a crumbling stone pillar",
    icon: "🏛️",
    stat: "Thought",
    dc: 14,
    damage: { dice: 3, sides: 6 },
    effect: "Creates difficult terrain",
    oneTimeUse: true
  },
  
  cave: {
    id: "stalactites",
    name: "Drop Stalactites",
    description: "Dislodge hanging stalactites",
    icon: "🪨",
    stat: "Essence",
    dc: 13,
    damage: { dice: 2, sides: 10 },
    effect: "Enemy AC reduced by 2 for rest of combat",
    oneTimeUse: true
  },
  
  water: {
    id: "tidal_wave",
    name: "Create Wave",
    description: "Manipulate water into a crushing wave",
    icon: "🌊",
    stat: "Essence",
    dc: 15,
    damage: { dice: 3, sides: 8 },
    effect: "Enemy attacks at disadvantage next turn",
    oneTimeUse: true
  },
  
  city: {
    id: "debris",
    name: "Hurl Debris",
    description: "Use urban rubble as a weapon",
    icon: "🧱",
    stat: "Athletics",
    dc: 11,
    damage: { dice: 2, sides: 6 },
    effect: "No additional effect",
    oneTimeUse: true
  }
};