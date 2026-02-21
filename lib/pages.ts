import { m } from "framer-motion";

export const pages = {
  page_1: {
    title: "My First Raid",
    src: "../assets/portal.webp",
    type: "choice",
    text: "You stand at the edge of the golden portal. It churns like liquid glass, flickering with eerie light. Behind you, the city is still.\n\nYour orders were clear: breach the portal, eliminate the threat, and clear the way for the mining team.",
    choices: [
      { label: "Step into the portal", next: "step_into_portal" },
      { label: "Inspect the edges", next: "inspect_edges" },
      { label: "Return to the entrance", next: "return_to_entrance" },
    ],
  },
  step_into_portal: {
    title: "Step into the Portal",
    src: "../assets/portal.webp",
    type: "choice",
    text: "A strong hand grabs your wrist.\n\n\"What are you doing!?\" Threx, the leader of your party, yells. \"We haven't even gone over the game plan yet! Get back with the others!\"",
    choices: [
      { label: "Return to the entrance", next: "return_to_entrance" },
      { label: "Pull away and enter the portal on your own", next: "pull_away_portal" },
    ],
  },
  pull_away_portal: {
    title: "Enter the Portal",
    src: "../assets/portal.webp",
    type: "route",
    route: "alone",
    text: "\"Dumbass,\" Threx hisses as you pull free and enter the portal anyway.",
    next: "portal_entrance",
  },
  portal_entrance: {
    title: "Portal Entrance",
    src: "../assets/forest.webp",
    type: "text",
    text: "You emerge on the other side, in another world. The rules are different here. The gravity is heavier; the air, thinner. Its sweet and sour aroma makes your mouth water and your head spin in equal measure.\n\nWorst of all is the vertigo.",
    next: "portal_view",
  },
  portal_view: {
    title: "Portal View",
    src: "../assets/forest.webp",
    type: "text",
    text: "The land stretches out and up, culminating in an inverted sphere fifty miles across. Spindly purple flora obscures most of the ground itself... and whatever creatures lurk beneath. Crystal clear streams vein between the overgrowth, reflecting the ground above in a muted kaleidoscope.\n\nYou take a moment to center yourself and index your gear, hoping you haven't just made the worst mistake of your life.\n\nThe thought leads you to a memory--  your experience in the Activation Chamber at the GPA. It... wasn't exactly what you were expecting...",
    next: "protocol_intro",
  },
  inspect_edges: {
    title: "Inspect the Edges",
    type: "text",
    src: "../assets/portal.webp",
    text: "You trace your eyes along the portal's circumference. This is the first time you've seen one up close. It's smaller than you imagined.... and noisier.\n\nThe thing sloshes, buzzes, and whispers. It sounds like a beach, a server farm, and a distant train station all in one.",
    next: "edges_continued",
  },
  edges_continued: {
    title: "The First Gate",
    type: "choice",
    src: "../assets/portal.webp",
    text: "There are all kinds of gates, and each hints at the dangers waiting on the other side. Some appear as buildings. Others as holes or spheres. Sometimes, their color gives away the creatures hiding inside. Other times, the color may be an intentional trap.\n\nGold portals usually indicate treasure, and the drones of the Global Protocol Authority have already measured this one to be E-Class, the easiest there is.",
    choices: [
      { label: "Step into the portal", next: "step_into_portal" },
      { label: "Return to the entrance", next: "return_to_entrance" },
    ],
  },
  return_to_entrance: {
    title: "Return to the Entrance",
    type: "route",
    route: "team",
    src: "../assets/portal.webp",
    text: "Your companions welcome you back. A few smile as you approach. Others watch the portal with nervous or excited expressions.\n\nOne sneers at you. He's the only person you know here, and he hates your guts.",
    next: "team_intro",
  },
  team_intro: {
    title: "Meet Your Team",
    type: "text",
    src: "../assets/portal.webp",
    text: "\"Scared to enter on your own, huh?\" Ronin teases. \"It would have been better if you did. At least then it would spare the rest of us the liability of having you on the team.\"\n\n\"That's not very nice,\" a woman says from behind him. She steps forward and extends a hand in greeting. \"I'm Akemi, and apparently *he's* an asshole.\"",
    next: "choose_name",
  },
  choose_name: {
    title: "Who Are You?",
    src: "../assets/portal.webp",
    text: "Before you can proceed, you need to choose a name for yourself. This will be your identity in the game world.",
    type: "input",
    input: {
      field: "characterName", 
      label: "Who are you?",
      next: "akemi_intro"
    }
  },
  akemi_intro: {
    title: "Meet Akemi",
    type: "text",
    src: "../assets/portal.webp",
    text: "\"Nice to meet you, {{characterName}}.\" Akemi smiles. \"The rest of us went to the Ramsey Training Academy together. I'll introduce you.\" She pushes past Ronin and gestures for the others to gather around.\n\n\"What's your class and ranking?\" she whispers. \"I don't remember seeing your name on the docket for today.\"\n\nYou nod. She wouldn't have. You signed up for this break last minute and only after long days of soul-searching.\n\nThe question makes you think back to your experience in the Activation Chamber at the GPA. Your time there wasn't exactly what you were expecting...",
    next: "protocol_intro",
    npcPresent: "Akemi",
    npcDescription: "Akemi",
    action: "meet_npc",
    npcStats: {
        maxHP: 150,
        currentHP: 150,
        ac: 16,
        fellowship: 10,
        athletics: 10,
        thought: 10,
        essence: 10
    },
  },
  protocol_intro: {
    title: "Meet the Protocol",
    type: "text",
    src: "../assets/lab.webp",
    text: "\"Please don't be alarmed,\" the androgenous voice of the Halcyon AI intones. From where you stand in the vertical MRI machine, a dozen needles point your way.\n\nBeyond them stand a half-dozen technicians and essence analysts of the Global Protocol Authority (GPA), their faces lit by computer screens and flashing medical equipment. You had followed a line of other potential breakers in here, and most had run out screaming.\n\n*Sure,* you think, *nothing to be alarmed about here.*",
    next: "failed_to_connect",
  },
  failed_to_connect: {
    title: "Failed to Connect",
    src: "../assets/lab.webp",
    type: "text",
    text: "The needles plunge into you. The machine whirs to life. The technicians and analysts take their readings.\n\nThis moment is supposed to be when the AI bridges the gap, and the Protocol activates most breakers. This is when the mysterious augmented-reality messages are meant to appear. This is where the hero's journey is supposed to begin.\n\nThis is where yours does not.\n\n\"The Protocol has failed to connect,\" the AI tells you, winding down.",
    next: "not_over_yet",
  },
  not_over_yet: {
    title: "Not Over Yet",
    src: "../assets/lab.webp",
    type: "text",
    text: "An analyst hands your clothes back to you and escorts you back outside. A digital reader replaced the AR display you were hoping for, tailored to your time in the chamber. It's make-believe, a cosplay of the version of yourself you had just been denied.\n\nSome breakers are insane enough to brave gates without being activated. Their hope-- before their skulls were usually crushed by whatever beasts waited inside-- was that the Protocol would change its mind.\n\nYou, apparently, are one of the insane ones, because you entered your wishful stats anyway, hoping it would be made real.",
    next: "stat_intro",
  },
  stat_intro: {
    id: "stat-allocation",
    type: "stats",
    src: "../assets/lab.webp",
    text: "Distribute your stat points. Choose wisely, as your future depends on it.",
    stats: {
      HP: 20,
      Fellowship: 10,
      Athletics: 10,
      Thought: 10,
      Essence: 10,
      points: 6
    },
    //may need to change next depending on if alone or with team
    next: "class_confirmation",
  },
  class_confirmation: {
    id: "class-confirmation",
    type: "classRedirect",
    src: "../assets/lab.webp",
    //need to change the text based on if alone or with team
    text: "You check your digital readout. Your path is set to {{className}}. Breaker status is still unranked.\n\nYou sigh. At least you made it this far.",
    classNext: {
      Warrior: {
        team: "team_Warrior",
        // alone: "alone_equipment",
        alone: "portal_spot",
      },
      Mage: {
        team: "team_Mage",
        // alone: "alone_equipment",
        alone: "portal_spot",
      },
      Summoner: {
        team: "team_Summoner",
        // alone: "alone_equipment",
        alone: "portal_spot",
      },
      Undecided: {
        team: "team_Undecided",
        // alone: "alone_equipment",
        alone: "portal_spot",
      },
      Mixed: {
        team: "team_Mixed",
        // alone: "alone_equipment",
        alone: "portal_spot",
      },
      "Undecided / Mixed": {
        team: "team_Mixed",
        // alone: "alone_equipment",
        alone: "portal_spot",
      },
    },
  },
  alone_equipment: {
    title: "Equipment",
    // type: "equipment",
    type: "text",
    text: "",
    next: "portal_spot",
  },
  portal_spot: {
    title: "Portal Spot",
    src: "../assets/forest.webp",
    type: "text",
    next: "portal_encounter",
    text: "Something small and quick darts at you from the nearest tuft of flora, pulling you from the past. You try to react, but the strain of this place makes you sluggish.\n\nYou raise your weapon just in time to defend yourself, but you already know this fight will be more challenging than you hoped.",
  },
  portal_encounter: {
    title: "First Battle",
    src: "../assets/forest.webp",
    type: "battle",
    environment: "forest",
    enemy: {
      name: "Critter",
      maxHP: 10,      // Enemy health
      ac: 10,          // Armor Class (difficulty to hit)
      attack: 2,      // Attack bonus
      magic: 1,        // Magic attack bonus
      bp: 5
    },
    text: "",
    fail: "critter_death",
    next: "portal_victory",
  },
  portal_victory: {
    title: "Win!",
    type: "choice",
    src: "../assets/forest.webp",
    text: "It feels great to have the first notch in your belt (and to know that regular humans aren't hopeless against E-ranked creatures).\n\nStill, that thing was a lot stronger than you anticipated. You wonder whether it would be safer waiting for the others...",
    choices: [
      { label: "Wait for the others", next: "wait_others" },
      { label: "Keep moving", next: "keep_moving_alone" },
    ],
  },
  wait_others: {
    title: "Wait for the Others",
    type: "route",
    src: "../assets/forest.webp",
    route: "team",
    text: "Your companions arrive ten minutes later. Threx is the first inside, and he glares at you before taking stock of your surroundings.\n\nRonin emerges next. Out of everyone you were meant to clear this world with, he is the only one you know, and he hates your guts.\n\n\"Damn,\" he says when he sees you. \"I was hoping this place would have taken care of you by now.\"\n\n\"What an unkind thing to say!\" The woman who emerged behind Ronin pushes past him and offers you a hand. \"I, for one, am glad you're still in one piece. I'm Akemi.\"",
    next: "wait_others2"
  },
  wait_others2: {
    title: "Wait for the Others",
    type: "input",
    src: "../assets/forest.webp",
    text: "Before you can proceed, you need to choose a name for yourself. This will be your identity in the game world.",
    input: {
      field: "characterName", 
      label: "Who are you?",
      next: "wait_others3"
    }
  },
  wait_others3: {
    title: "Wait for the Others",
    type: "text",
    src: "../assets/forest.webp",
    text: "\"It's very nice to meet you, {{characterName}}. I think it was very brave of you to rush into things. Though, maybe you can hold off in the future? We are a team, after all, right?\"\n\n\"I'm also glad you're in one piece,\" says a black woman in dented armor. She had emerged just in time to catch Akemi's comment. \"Otherwise, I would have had to save your sorry ass.\" She pauses. \"Which probably would have been a record.\"\n\n\"Don't be rude, Harla!\" Akemi says. \"He was just a little overzealous. We've all been there. At least he waited for us, right? He could have been deep in the woods by now.\"",
    next: "wait_others4"
  },
  wait_others4: {
    title: "Wait for the Others",
    type: "text",
    src: "../assets/forest.webp",
    text: "Ronin chuckles and nudges the creature you killed with his boot. \"He's probably just scared. Realized these things might be too much for him.\"\n\nAs he speaks, four others emerge from the portal. You consult the data packets in your digital readout for quick blurbs on each.\n\nThe mustachioed man in fine armor is Kaelion Virehart, an E-Class warrior.\n\nThe girl in skin-tight leather is Mitzi, an E-Class summoner.\n\nThe dorky one in wizard's robes is Sheemie Bauer, an E-Class mage.",
    next: "wait_others5"
  },
  wait_others5: {
    title: "Wait for the Others",
    type: "text",
    src: "../assets/forest.webp",
    text: "You've met the others.\n\nThrex, a C-Class warrior\n\nAkemi, an E-Class undeclared\n\nHarla, a D-Class healer\n\nRonin, the —you do a double take —*D-Class* mixed.\n\n*How is he D-Class already?* you wonder, thinking back on all the scrapes you two got into growing up.\n\nYou look up at Ronin, and instead lock eyes with a member of the party you hadn't noticed before.",
    npcsPresent: [
      {
        name: "Ronin",
        description: "A mysterious warrior with a hidden past",
        stats: {
          maxHP: 150,
          currentHP: 150,
          ac: 16,
          fellowship: 10,
          athletics: 14,
          thought: 10,
          essence: 8
        }
      },
      {
        name: "Aleth",
        description: "A similar unranked member",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Threx",
        description: "A massive fighter",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Kaelion",
        description: "A cultured warrior",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Harla",
        description: "A healer",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Mitzi",
        description: "A diminutive mage",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Sheemie",
        description: "A summoner",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Akemi",
        description: "The nicest member",
        stats: {
          maxHP: 80,
          currentHP: 80,
          ac: 12,
          fellowship: 12,
          athletics: 8,
          thought: 16,
          essence: 14
        }
      }
    ],
    next: "wait_others6"
  },
  wait_others6: {
    title: "Wait for the Others",
    type: "choice",
    src: "../assets/forest.webp",
    text: "He had been watching you intently and doesn't look away now that you've noticed him.\n\nIt's creepy.\n\n\"Aleth Achen,\" reads your digital readout when you scroll to the final entry. \"Unactivated.\"\n\nJust like you.\n\n\"Here,\" Akemi says, handing you a vial of caustic purple liquid. \"It'll fortify you against the environment for the next few hours.\"",
    choices: [
      { label: "Take the vial", next: "wait_take" },
      { label: "Hold off for now", next: "wait_hold" },
    ],
  },
  wait_take: {
    title: "Wait for the Others",
    type: "text",
    src: "../assets/forest.webp",
    action: "took_environment_potion",
    text: "You drain the vial, and the ill effects of this world immediately dull.\n\n\"All potions work the same way,\" Akemi tells you. \"The effect is immediate, and it'll last for however long it is advertised! The only exception is health potions; those will heal you right up and keep you that way unless you get hurt again!\"\n\n\"And poison,\" Mitzi says, deadpan. \"That's permanent, too.\"",
    next: "threx_impress",
  },
  wait_hold: {
    title: "Wait for the Others",
    type: "text",
    src: "../assets/forest.webp",
    text: "You thank Akemi and pocket the potion for later. This place is brutal, but it's nothing you can't handle.\n\nBetter to hold on to it until you actually need it.",
    next: "threx_impress",
  },
  threx_impress: {
    title: "Threx Impressed",
    type: "choice",
    src: "../assets/forest.webp",
    text: "\"Alright!\" Threx yells. \"Let's get moving. Newbie,\" he pauses to address you directly. \"I'm... impressed you managed to take on that thing yourself. I'd like you to be up front with me so I can watch your style directly.\"",
    choices: [
      { label: "Agree (talk with Threx)", next: "agree_threx" },
      { label: "Disagree (talk with the others)", next: "disagree_threx" },
    ],
  },
  agree_threx: {
    title: "Agree with Threx",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"I'm all yours,\" you tell him.\n\nYou move to the front and lead the group into the alien forest alongside Threx.\n\nBehind you, Akemi asks Ronin, \"What guild are you hoping to get into?\"\n\n\"Epoch Corporation,\" he replies.\"They have the coolest tech, best weapons, and I feel like they really get it, yaknow?\" He pauses before adding, \"What about you?\"\n\nAkemi blushes. \"I actually want to start a guild of my own one day. I know it's silly, but it's always been a dream of mine.\"",
    next: "agree_threx2"
  },
  agree_threx2: {
    title: "Agree with Threx",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"I don't think that's silly at all.\" Ronin smiles, and you wonder whether you're watching these two flirt right now.\n\nHis next words confirm it.\n\n\"Dreams are what make us who we are, and, well, yours seems really special.\"\n\nAkemi's blush darkens, and you roll your eyes.\n\nStrange love in a strange land.",
    next: "agree_threx3"
  },
  agree_threx3: {
    title: "Agree with Threx",
    type: "text",
    src: "../assets/deeper.webp",
    text: "The rest of the party joins the conversation about guilds and factions. From your position at the front, you get to hear the entire exchange.\n\n\"I can't wait to start investing my points into Mage abilities!\" Sheemie exclaims. \"I'd love to specialize in something plant-based.\"\n\n\"Poor kid never left his treehouse,\" Mitzi says in a stage whisper.",
    next: "agree_threx4"
  },
  agree_threx4: {
    title: "Agree with Threx",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"Who *doesn't* love a good treehouse?\" Sheemie laughs. \"Nah, I just really wanna get into the Thomur Guild. I heard they have a penchant for recruits who hyper-specialize in things most people don't think about.\"\n\n\"But...plants?\"\n\n\"Oh, please,\" Harla cuts in. \"Like you're one to talk, Mitzi. Don't you plan to join the *Silhouette* once you're strong enough? Those people are weirder than some tiny guild no one has heard about.\"",
    next: "agree_threx5"
  },
  agree_threx5: {
    title: "Agree with Threx",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"Hey!\" Sheemie exclaims in his high-pitched way.\n\nMitzi ignores the outburst. \"Them or *Protocol Null*.\" She doesn't elaborate. She doesn't need to. Everyone knows about the two major breakaway factions.\n\n\"How can one be so ambivalent toward the Protocol?\" Kaelion asks. \"You used the Activation Chamber like the rest of us. You've embarked upon this quest like the rest of us, too. Do you surely intend to use the Protocol to evolve... so that you can destroy the Protocol?\"",
    next: "agree_threx6"
  },
  agree_threx6: {
    title: "Agree with Threx",
    type: "text",
    src: "../assets/deeper.webp",
    text: "Mitzi shrugs. \"I'd settle for understanding it. It seems to me like no one else is questioning what this thing is. I mean, what does it want? Is it really on our side? If the *Silhouette* or *Protocol Null* get me closer to the truth, then that's where I'm heading.\"\n\n\"You could always join the *Veil Cult*,\" Harla offers. \"They claim to know all the answers.\"\n\nAkemi says something, but her words disappear behind Threx's. The party leader clears his throat.",
    next: "agree_threx7"
  },
  agree_threx7: {
    title: "Agree with Threx",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"I entered my first gate solo, too,\" he explains, eyes still trained on the surrounding foliage. \"Showed up thirty minutes early and was almost finished with its Tethered Being before the rest of my party showed up.\"\n\nYou raise an eyebrow, surprised.\n\n\"I did the same thing with my second gate. And the third. I grinded enough Breaker Points while solo that I earned my Class-C license without fighting alongside a single person.\" He sighs, then chuckles. \"I thought I would be the next Silas Knorr or Ember Naes.\"",
    next: "agree_threx8"
  },
  agree_threx8: {
    title: "Agree with Threx",
    type: "choice",
    src: "../assets/deeper.webp",
    text: "\"But my hubris almost killed me. I... appreciate that you took the chance you did, truly, but what truly impresses me is that you're walking alongside us now.\"\n\n\"No man is an island, {{characterName}}. The Silas Knorrs and Ember Naes of the world are outliers. The best way for the rest of us to survive this world is to take it on together.\" Threx turns to you and smiles. \"Do you understand what I'm saying?\"",
    choices: [
      { label: "\"Yes\"", next: "yes_threx" },
      { label: "\"No\"", next: "no_threx" },
    ],
  },
  yes_threx: {
    title: "Yes",
    type: "text",
    src: "../assets/deeper.webp",
    text: "Threx nods. \"Good. If the rest of today goes well, maybe I'll see about you getting a more permanent spot on this team.\"",
    next: "eyes_threx"
  },
  no_threx: {
    title: "No",
    type: "text",
    src: "../assets/deeper.webp",
    text: "Threx's smile inverts itself. \"Well, perhaps one day you will. For your sake, I hope it's sooner rather than too late.\"",
    next: "eyes_threx"
  },
  eyes_threx: {
    title: "Eyes Up",
    type: "text",
    src: "../assets/deeper.webp",
    text: "Threx turns from you. \"Eyes up!\" He booms to the group. \"We're here to clear the place, not socialize!\"\n\nThe others lock in. You do the same, surveying the surrounding tree-things.",
    next: "alien_forest"
  },
  disagree_threx: {
    title: "Disagree with Threx",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"I'd like to chat with the others first, if that's okay with you.\" You shrug. \"Maybe offer some apologies for going off on my own. We should be a team, right?\"\n\nThrex looks at you for a long moment, then nods.\n\n\"Good idea. Maybe we'll talk more later.\"\n\nYou lag back for a moment, waiting on the others to catch up.",
    next: "team_portal_victory"
  },
  keep_moving_alone: {
    title: "Keep Moving",
    type: "text",
    src: "../assets/forest.webp",
    text: "...but you've come too far to wuss out now.",
    action: "not_nice_to_akemi",
    next: "forest_deeper"
  },
  forest_deeper: {
    title: "Deeper In",
    type: "text",
    src: "../assets/deeper.webp",
    text: "So, alone, you enter the alien forest, and the big picture of the place disappears behind the purple tree-things.\n\nThey smell like sour milk and groan against an invisible breeze. Their tubes resemble scales more than bark, and intricate patterns adorn them. No two are alike.\n\nAs you walk, you revel in the knowledge that you are the first person to tread this path. You think, too, of the stranglehold that the various guilds and factions have on the worlds inside the gates. The Global Protocol Authority, the Sihlouette, Protocol Null, the Veil Cult, the Silk Road-- each takes as much as they can, leaving less for freelancers like yourself.",
    next: "forest_deeper2"
  },
  forest_deeper2: {
    title: "Deeper In",
    type: "choice",
    src: "../assets/deeper.webp",
    text: "If you hadn't come here under the auspices of being with a group, you'd have had trouble getting within five hundred feet of the place.\n\nYou look again at the carvings on the trees. They remind you of advertisements you've seen for the Thomur Guild, an up-and-coming faction in Arclight Haven, your home. Unlike the others, the Thomur Guild specializes in abilities that most breakers tend to ignore —speaking to animals, breathing underwater, living without sleep, etc. —and they've recently taken an interest in botany. If Threx and his crew hadn't gotten the bid first, they'd be here instead.\n\nThey'd be obsessed with this stuff.",
    choices: [
      { label: "Inspect the carvings", next: "inspect_alone" },
      { label: "Keep moving", next: "keep_moving_alone_carvings" },
    ],
  },
  keep_moving_alone_carvings: {
    title: "Keep Moving",
    type: "roll",
    src: "../assets/deeper.webp",
    // text: "This place is dangerous. It's more important to keep an eye open for threats than to admire the scenery.",
    roll: {
      stat: "Thought",
      dc: 15,
      successText: "You pull your eyes from the carvings and take in the forest beyond the trees. There is a layout to the woods themselves, as though it's been painstakingly designed.",
      failText: "This place is strange, but it doesn't feel threatening. You look for movement beyond the trees, but find nothing.",
      nextSuccess: "keep_moving_alone_success",
      nextFail: "carving_alone_fail",
    },
  },
  keep_moving_alone_success: {
    title: "Keep Moving",
    type: "choice",
    src: "../assets/deeper.webp",
    text: "Following the converging lines of the purple tree-things, you notice a shimmer in the distance.\n\nIt's only there for a moment, then disappears.",
    choices: [
      { label: "Get off the path and use the environment as cover", next: "cover_alone" },
      { label: "Ignore it", next: "ignore_it" },
    ],
  },
  cover_alone: {
    title: "Use Cover",
    type: "text",
    src: "../assets/ridge.webp",
    text: "You exit the well-defined footpath and move along a slight ridge running parallel to it.\n\nThe going is slower along this route, but you're more protected.\n\nEventually, the path leads into a clearing. It would have been a perfect place for an ambush.\n\nInstead, when the creatures inevitably come, the ridge protects your flank.\n\nOne by one, they come for you.\n\nThere are twelve.",
    next: "ridge_ambush"
  },
  ridge_ambush: {
    title: "Ridge Battle",
    type: "battle",
    src: "../assets/ridge.webp",
    enemies: {
      count: 12,
      template: {
        name: "Cotton Candy Beast",
        maxHP: 10,
        ac: 10,
        attack: 2,
        magic: 2,
        bp: 3
      }
    },
    text: "",
    fail: "ridge_ambush_fail",
    next: "ridge_ambush_success",
  },
  ridge_ambush_fail: {
    title: "Ridge Battle Lost",
    type: "text",
    useCustomBackground: true,
    action: "failure",
    text: "The viciousness of these things is too much for you to handle. Their sharp teeth tear into your flesh, and their muscular necks ragdoll you back and forth.\n\nYour arm is disabled first, then a leg. Chunks are ripped from you, and the world goes from purple to red.\n\nYou scream, but blood fills your throat.\n\nYou feel a powerful set of jaws close around your neck.\n\nThis is it.\n\nThe jaws close, and the red goes to black.",
    next: "ridge_ambush_fail2"
  },
  ridge_ambush_fail2: {
    title: "Ridge Battle Lost",
    //no src, black background
    type: "text",
    useCustomBackground: true,
    text: "You float in this dark ocean for a moment... and an eternity.\n\n\"Go back,\" a soft voice whispers. It sounds so familiar. \"I'm not ready for you yet.\"\n\nThe darkness recedes, and the silhouettes of seven figures appear above you. You know them at once, and the realization burns your face with embarrassment.\n\n\"Dumbass,\" Threx says. \"You should have gone home.\"\n\n\"I told you so,\" Ronin adds.\n\n\"Oh, {{characterName}},\" says one of the women, shaking her head.",
    next: "ridge_ambush_fail3"
  },
  ridge_ambush_fail3: {
    title: "Ridge Battle Lost",
    type: "text",
    src: "../assets/deeper.webp",
    hpModification: {
      type: 'add',
      amount: 20,
      message: "You are brought back to life.",
    },
    text: "When you open your eyes, the group you were supposed to break the gate with is staring down at you. They've carried you to a rock at the center of the clearing, and the rest of the gate's creatures lie broken atop yellow flowers.\n\n\"We're not wasting our time taking you to the exit,\" Threx says. \"But you better not get in our way. Consult that digital readout of yours to learn more about the others while we move. We've saved your ass, after all.\"",
    next: "ridge_ambush_fail4"
  },
  ridge_ambush_fail4: {
    title: "Ridge Battle Lost",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"*Digital readout?*\" a mustachioed man in fine armor asks. He speaks like a character in a medieval period piece. \"Doth thou claim this rube isn't activated?\"\n\nNext to him, a girl in skin-tight black leather rolls her eyes and adds, \"No mystery there. That explains why we had to rescue him.\"\n\nYour digital readout gives you the names and portfolios of your companions. The man is Kaelion Virehart, an E-Class warrior. The woman, a summoner, is \"Mitzi.\" Also E-Class.",
    next: "ridge_ambush_fail5"
  },
  ridge_ambush_fail5: {
    title: "Ridge Battle Lost",
    type: "text",
    src: "../assets/deeper.webp",
    text: "There's also Sheemie Bauer, a dorky-looking E-Class mage.\n\nAnd Harla, a D-Class Healer in heavily-dented armor. She must have been the one to bring you back.\n\nThere's Akemi, an undeclared E-Class who watches you with the prettiest eyes you've ever seen.\n\nThere's Aleth, who, like you, is unactivated. He nods at you with a smirk.",
    next: "ridge_ambush_fail6"
  },
  ridge_ambush_fail6: {
    title: "Ridge Battle Lost",
    type: "text",
    src: "../assets/deeper.webp",
    text: "Last is Ronin, your former best friend. He's a— you do a double take— mixed *D-Class*.\n\n*How is he D-Class already?* you wonder, thinking back on all the scrapes you two got into growing up.\n\n\"Sheemie,\" Threx says, \"is the Gate Stabilizer still intact after that skirmish?\"\n\nThe dorky one pulls a gray sphere from his robe. The Epoch Corporation logo is clearly visible across it.",
    next: "gate_stabilizer_check"
  },
  ridge_ambush_success: {
    title: "Ridge Battle Won",
    type: "text",
    src: "../assets/ridge.webp",
    text: "You stand amidst a pile of fresh corpses, out of breath and bleeding from a hundred cuts. Despite the odds, you've somehow survived the counter.\n\n\"That... just leaves the Tethered Being,\" you say aloud.\n\n\"Holy... crap.\"\n\nYou reel to face the unexpected voice and discover seven sets of wide eyes looking back at you.\n\n\"You killed all of these things?\" Threx asks. \"I'm... actually impressed.\"",
    next: "ridge_ambush_success2"
  },
  ridge_ambush_success2: {
    title: "Ridge Battle Won",
    type: "text",
    src: "../assets/ridge.webp",
    text: "You scan the faces of the others, vaguely remembering their portfolios from your time investigating the break.\n\nThere's Kaelion Virehart, an E-Class warrior with a handlebar mustache and fine armor.\n\nThere's Mitzi, an E-Class summoner, wearing skin-tight black leather.\n\nThere's Sheemie Bauer, a dorky-looking E-Class mage.\n\nThere's Harla, a D-Class Healer in heavily-dented armor.",
    next: "ridge_ambush_success3"
  },
  ridge_ambush_success3: {
    title: "Ridge Battle Won",
    type: "text",
    src: "../assets/ridge.webp",
    text: "There's Akemi, an undeclared E-Class who watches you with the prettiest eyes you've ever seen.\n\nThere's Aleth, who, like you, is unactivated. He nods at you with a smirk.\n\nThere's Ronin Balore... your former best friend.\n\n\"This is...amazing,\" he mutters.\n\nYou shake your head, fighting wooziness. \"I'm breaking this gate alone. Stay out of my way.\"",
    next: "ridge_ambush_success4"
  },
  ridge_ambush_success4: {
    title: "Ridge Battle Won",
    type: "choice",
    src: "../assets/ridge.webp",
    text: "Harla snorts. \"Fat chance. You're in no shape to take on the boss by yourself.\" She raises a glowing hand. \"But I can heal you... if you're not too proud to let me.\"",
    choices: [
      { label: "Accept", next: "harla_accept" },
      { label: "Decline", next: "harla_decline" },
    ],
  },
  harla_accept: {
    //health is restored
    title: "Accept Healing",
    type: "text",
    src: "../assets/ridge.webp",
    text: "You sigh and offer a weak nod. The effect is immediate.\n\n\"Sheemie,\" Threx says. \"Is the Gate Stabilizer okay after our run here?\"\n\nThe dorky one pulls a gray sphere from his robe. The Epoch Corporation logo is clearly visible across it.",
    hpModification: {
      type: 'add',
      amount: 20,
      message: "Harla's magic fully restores you.",
    },
    next: "gate_stabilizer_check"
  },
  harla_decline: {
    title: "Decline Healing",
    type: "text",
    src: "../assets/ridge.webp",
    text: "\"No,\" you manage. \"I've already made it this far. I'll see this through myself.\"\n\n\"Too bad,\" Threx says. \"We're coming along anyway. This was impressive, but you still need us. Sheemie, is the Gate Stabilizer okay after our run here?\"\n\nThe dorky one pulls a gray sphere from his robe. The Epoch Corporation logo is clearly visible across it.",
    next: "gate_stabilizer_check"
  },
  ignore_it: {
    title: "Ignore It",
    type: "text",
    src: "../assets/deeper.webp",
    text: "This world is weird and behaves in ways you'll nevestand. Better to avoid jumping at every little thing.\n\nYou shrug and continue moving.",
    next: "carving_alone_fail"
  },
  inspect_alone: {
    title: "Inspect The Carvings",
    type: "roll",
    src: "../assets/carving.webp",
    text: "You might not have an interest in joining the Thomur Guild, but you admire the beauty of the trees anyway.\n\nThe carvings are deep and no wider than the width of your pinky. Did a creature create these, or are they beautifully natural, like snowflakes?",
    roll: {
      stat: "Thought",
      dc: 10,
      successText: "You peer closer, and the pattern beneath the patterns assembles itself. Though each carving is different from the rest, you recognize a distinction between groups of them.",
      failText: "It's difficult to tell.\n\nYou stare at the carvings a moment longer, simply admiring their beauty before continuing on.",
      nextSuccess: "carving_alone_success",
      nextFail: "carving_alone_fail",
    },
  },
  carving_alone_fail: {
    title: "Carving Failed",
    type: "text",
    src: "../assets/ridge.webp",
    action: "failure",
    text: "At last, the path leads into a clearing. For the first time since entering this place, you see a color other than purple.\n\nThe yellow pattern is comprised of neither rock nor flower, yet, the material carries properties of both. It smells better than the trees, too. Instead of sour milk, the clearing smells almost like lilacs and chocolate.\n\nYou feel mollified. Content. You're not worrying about your family, or your need to prove yourself, or even how dangerous this world may be. For a moment, there is only this moment.",
    next: "carving_alone_fail2"
  },
  carving_alone_fail2: {
    title: "Carving Failed",
    type: "text",
    src: "../assets/critters.webp",
    text: "Unfortunately, reality returns all too quickly.\n\nTwelve creatures emerge from the underbrush and charge at you. They are cotton candy colored, just like the trees, and larger than the one you faced near the gate.\n\nYou walked right into an ambush.",
    next: "ambush_alone"
  },
  ambush_alone: {
    title: "Ambush",
    src: "../assets/critters.webp",
    type: "battle",
    enemies: {
      count: 12,
      template: {
        name: "Cotton Candy Beast",
        maxHP: 10,
        ac: 12,
        attack: 4,
        magic: 4,
        bp: 3
      }
    },
    text: "",
    fail: "ridge_ambush_fail",
    next: "ridge_ambush_success",
  },
  carving_alone_success: {
    title: "Carving Patterns",
    type: "text",
    src: "../assets/carving.webp",
    text: "There are many with curved edges. These are the tree-things.\n\nThere are several longer, squigly ones. These are the streams.\n\nThere are a few jagged ones. You're not sure what they are, but most are congregated in two locations across these various tapestries.\n\nMovement catches your eye amongst a grouping of seven small dots. Those must be the breakers you were supposed to enter with.",
    next: "carving_alone_success2"
  },
  carving_alone_success2: {
    title: "Carving Patterns",
    type: "text",
    src: "../assets/carving.webp",
    text: "You scour the map for familiar landmarks, eventually landing on an eighth dot surrounded by the ones with curved endings. It moves, then stops near one of the tree-thing symbols.\n\nYou take two big steps back, and the dot moves a moment later. You return to the tree, and it does the same.\n\n\"And that's me,\" you whisper.\n\nYou look back at the jagged carvings. There are twelve of them. If you continue the way you're going, you'll walk into an area where they'll surround you.\n\n*An ambush.*",
    next: "carving_alone_success3"
  },
  carving_alone_success3: {
    title: "Ambush",
    type: "choice",
    src: "../assets/carving.webp",
    text: "You scan the rest of the living map and discover a single symbol sitting away from the jagged ones.\n\n\"And that's gotta be the Tethered Being,\" you say, speaking of the entity the gate entrance is tied to. You don't have the necessary Gate Stabilizer to keep the gate open once the being is defeated, but the others are definitely carrying one.\n\nThey'd have ten minutes to reach the corpse before the gate closes to keep things open for the mining team. Surely that's enough time for intrepid heroes like them.\n\nYou look between the two kinds of shapes, forced to make a decision.",
    choices: [
      { label: "Counter-attack the minions", next: "counter_attack_alone" },
      { label: "Thin the herd from the surrounding ridge", next: "ridge_alone" },
      { label: "Move for the Tethered-Being", next: "tethered_lair_alone" },
    ],
  },
  tethered_alone: {
    title: "Approach The Tethered-Being",
    type: "text",
    src: "../assets/carving.webp",
    text: "Taking the minions on alone risks getting swarmed. The Tethered Being is alone right now-- fresh for the slaying. You'll just have to be sure to end the thing quickly; the longer things take, the greater the risk of having the minions attack you from behind.",
    next: "tethered_lair_alone",
  },
  tethered_lair_alone: {
    title: "Tethered Lair",
    type: "text",
    src: "../assets/shack.webp",
    text: "It doesn't take long to reach the lair. The tracks of the boss's minions take you right to it.\n\nIt... isn't what you expected.\n\nThe shack stands in sharp contrast to the surrounding purple. Its walls are tiled with amber, gold, and sapphire. It isn't large, but it holds enough material to justify the gate's golden appearance.\n\nThere is a faint *hmm* from the porch. When you see the source, you shudder.",
    next: "tethered_lair_alone2"
  },
  tethered_lair_alone2: {
    title: "Tethered Lair",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"I was hoping to give my pets a snack today,\"  the alien-thing says in a voice like sandpaper, \"but it seems you were keen to meet me first. No matter... They'll be dining on you soon enough.\"",
    next: "tethered_lair_alone3",
  },
  tethered_lair_alone3: {
    title: "Tethered Lair",
    type: "choice",
    src: "../assets/shack.webp",
    text: "You blink, confused. Plenty of creatures inside the gates can talk, but not many are E-Class. You've heard stories about beings-- *Campers*-- that hide themselves in worlds they don't belong to. They aren't connected to the world itself, which often means gates don't register a higher threat level.\n\nThey wait in these places for the purpose of ambushing lower-level explorers.\n\nExplorers like you.\n\nOn a tree next to you, eight symbols like yours mix with the jagged ones representing the minions-- this thing's *pets*.\n\nThe party you were meant to enter with is fighting them.",
    choices: [
      { label: "Speak to the creature", next: "speak_camper_alone" },
      { label: "Attack the creature", next: "attack_camper_alone" },
      { label: "Remain silent", next: "remain_silent_alone" },
    ],
  },
  speak_camper_alone: {
    title: "Speak To Camper",
    type: "choice",
    src: "../assets/shack.webp",
    text: "\"I wouldn't be too sure about the kibble thing,\" you say. \"In a few minutes, I doubt you'll have any pets left to feed.\"\n\nThe thing cocks its head. \"Hmm, I suppose you're right. You creatures possess such little power that you're nearly invisible to me at a distance. Take you, for instance. I hardly sense a thing. It's almost as if... you are nothing.\"",
    choices: [
      { label: "Keep talking", next: "keep_talking_alone" },
      { label: "Attack", next: "attack_camper_alone" },
    ],
  },
  keep_talking_alone: {
    title: "Keep Talking",
    type: "choice",
    src: "../assets/shack.webp",
    text: "You step forward.\n\n\"I want to know more about you,\" you say. \"Where are you from, originally? How long have you been here?\"\n\nThe thing cocks its head, amused.\n\n\"I know some things about the world you come from. Tell me: does a human converse with an insect before stepping on it?\"",
    choices: [
      { label: "Sometimes", next: "sometimes_alone" },
      { label: "No (prepare to fight)", next: "no_alone" },
    ],
  },
  no_alone: {
    title: "Uh Oh",
    type: "text",
    src: "../assets/shack.webp",
    text: "You take a step back, realizing your folly in trying to reason with this thing.\n\n*Dumbass*, you think.",
    next: "attack_camper_alone"
  },
  sometimes_alone: {
    title: "Shrug",
    type: "text",
    src: "../assets/shack.webp",
    text: "You shrug. \"That depends on the human, I guess. Some people are lonelier than others.\"\n\nThere's a blur across the porch, and the creature is suddenly standing at the top of the stairs.\n\nYou see it in its full glory now... and shudder.",
    next: "sometimes_alone2",
  },
  sometimes_alone2: {
    title: "Camper Appearance",
    type: "text",
    src: "../assets/shack.webp",
    text: "The thing is two heads taller than you and sports golden armor that is one part duster and one part hooded cloak. A black katana hangs from its hip. Its mouth is curled into a permanent snarl, and its shiny pink skin gives it the appearance of a burn victim.\n\nAnd the scars... There are too many to count.",
    next: "sometimes_alone3",
  },
  sometimes_alone3: {
    title: "Camper Appearance",
    type: "text",
    src: "../assets/shack.webp",
    text: "Worst of all is the *other* thing it's wearing. Fresh blood coats the creature like a crimson robe. It drips onto the decadent porch, adding faux-ruby to the amber, gold, and sapphire below.\n\n*Your* blood.",
    next: "sometimes_alone4",
  },
  sometimes_alone4: {
    title: "Camper Attack",
    type: "text",
    src: "../assets/shack.webp",
    text: "You feel the wound an instant later, a burning across your left side. The Camper has only nicked you, but the attack has served its purpose. It licks your blood from its katana, then frowns.\n\n\"Disappointing. I was hoping for a more worthy adversary.\" The Camper returns its weapon to its sheath, then lays it on the porch with its armor. Its body is scarred and burned, aged, but also incredibly muscular.",
    next: "sometimes_alone5",
    hpModification: {
      type: 'halve',
      message: 'Sliced by the Camper\'s katana, your life force is severely diminished.',
      // oneTime: true
    }
  },
  sometimes_alone5: {
    title: "Camper Attack",
    type: "choice",
    src: "../assets/shack.webp",
    text: "It places its dominant arm behind its back next, then balances itself on one leg.\n\n\"I'm afraid stooping myself any more to your level requires a permanent handicap. This will have to suffice.\"\n\nOn a tree next to you, the final jagged symbol disappears. Eight dots like yours are moving your way now.\n\nQuickly.",
    choices: [
      { label: "Keep talking", next: "keep_talking_camper_alone" },
      { label: "Attack", next: "sometimes_attack_alone" },
    ],
  },
  keep_talking_camper_alone: {
    title: "Keep Talking",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"Yeah,\" you manage, tasting blood. \"Definitely... lonely.\"\n\nYou take in the palace-like cabin once again, trying to understand the rationale of a creature this powerful. Why is it here? Why does it lure and prey on creatures it knows it can easily defeat?\n\nWhy is it alone?You imagine the path you had taken to get here, solitary, with a group of seven at your back, and a theory comes to you.",
    next: "keep_talking_camper_alone2"
  },
  keep_talking_camper_alone2: {
    title: "Keep Talking",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"I think... you're lonely...\" you say again, \"but I also... think you're afraid.\"\n\n\"Afraid!?\" The Camper rasps a grating laugh. \"I am more powerful than you can imagine! Hundreds of creatures have fallen to my blades. What could I possibly be afraid of?\"\n\n\"You're afraid... of something out there... that's even stronger... than you are. That's why you're hiding... behind an E-Class gate.\"\n\nThere's another flash of movement, and a soft thump on the ground next to you.",
    next: "keep_talking_camper_alone3"
    //life points halved again
  },
  keep_talking_camper_alone3: {
    title: "Keep Talking",
    type: "text",
    src: "../assets/shack.webp",
    text: "You feel a numbness in the fingertips of your right arm, and then an excruciating pain halfway down your bicep.\n\nYour arm is no longer attached.",
    next: "party_arrives_alone",
    hpModification: {
      type: 'halve',
      message: 'The Camper severs your arm, leaving you grievously wounded.',
      // oneTime: true
    }
  },
  party_arrives_alone: {
    title: "Party Arrives",
    type: "choice",
    src: "../assets/shack.webp",
    text: "The rest of your party arrives, out of breath and covered in gore. They freeze when they see the state of you; you despise the pity in their eyes. All of them-- even Ronin, an old friend who can no longer stand you-- steel themselves to come to your aid.\n\nTears sting your eyes. Things weren't supposed to go like this. You were meant to prove yourself here, yet the only thing you've proven is how weak you are.\n\nThrough your pain and frustration, a follow-up thought arrives on the heels of the one you just verbalized.",
    choices: [
      { label: "Tell the others to stop, and keep talking", next: "party_stop_alone" },
      { label: "Let the others enter the fight", next: "party_fight_alone" },
    ],
  },
  party_stop_alone: {
    title: "Keep Talking",
    type: "choice",
    src: "../assets/shack.webp",
    text: "\"You're... hiding. Afraid... of the alternative... to being alone. I know... because I'm the same way.\"\n\nThere's a third flash, and you're suddenly looking up. Both of your legs, no longer connected to anything, topple beside you.",
    choices: [
      { label: "Let the others fight", next: "party_fight_alone" },
      { label: "Prop yourself on your good arm and face down your killer", next: "face_camper_alone", action: 'sacrifice', sacrificeLocation: 'camper_encounter'},
    ],
  },
  face_camper_alone: {
    title: "Face Camper",
    type: "choice",
    src: "../assets/shack.webp",
    text: "The thing is right in front of you now, so close that you can smell the rot of its breath.",
    choices: [
      { label: "Strike it", next: "strike_alone" },
      { label: "Maintain eye contact and prepare for death", next: "maintain_alone" },
    ],
  },
  strike_alone: {
    title: "Strike Camper",
    type: "text",
    src: "../assets/shack.webp",
    text: "You lash out, refusing to go down without a fight.\n\nThe Camper smiles and leans into it. You deal a direct blow, drawing a small trickle of blood.\n\n\"Good,\" it rasps, before hitting you so hard your vision explodes.\n\nIn the flash of pain, you see a car crash. You see exploding windows and bodies thrown around the cabin as it rolls downhill.",
    next: "memory_alone"
  },
  maintain_alone: {
    title: "Maintain Contact",
    type: "text",
    src: "../assets/shack.webp",
    text: "Like everyone else, you've heard stories about near-death experiences. You've heard about people's lives flashing before their eyes.\n\nYou don't get that.",
    next: "maintain_alone2"
  },
  maintain_alone2: {
    title: "Maintain Contact",
    type: "text",
    src: "../assets/shack.webp",
    text: "Instead, you are only gifted with a memory of a single moment-- a curse, really. You immediately place it, because it's one you've revisited often.\n\nThis was years before the arrival of the first gate, but the two events can be likened by how time can be measured before and after.\n\nYou see exploding windows and bodies thrown around the inside of the rolling car.",
    next: "memory_alone"
  },
  memory_alone: {
    title: "Remember",
    type: "text",
    src: "../assets/shack.webp",
    text: "Somehow, you, Crixon, and an infant Ryke had emerged with only cuts. Your parents died on the scene.\n\nYour older brother Cale had been in intensive care for months, fostering an addiction that still haunts him.\n\nYou had always believed you and your siblings had been spared for a reason. Now, you know the truth.There is no reason in mad worlds like these.",
    next: "memory_alone2"
  },
  memory_alone2: {
    title: "Siblings",
    type: "text",
    src: "../assets/shack.webp",
    text: "The fear and the pain fade to a dull roar, leaving only anger and disappointment behind.\n\n\"Do it!\" you scream. \"Get it over with!\"\n\nThe Camper looks at you, a hint of admiration in its eyes.\n\n\"You have entertained me,\" the creature rasps. \"I have not had that in a long time. Consider your sacrifice... worth it. Because of you, I shall let the others go free.\"\n\nThe Camper's jaw widens, unhinges, and prepares to swallow your face.",
    next: "memory_alone3"
  },
  memory_alone3: {
    title: "Camper Attack?",
    type: "roll",
    src: "../assets/shack.webp",
    text: "Then, it freezes.\n\nLike an animal catching the sudden scent of a predator, the Camper sniffs at the air and bristles.",
    roll: {
      stat: "Thought",
      dc: 12,
      successText: "You feel it, too-- a sudden shift in the air. Something powerful has just entered the area.",
      failText: "You don't get a sense on what the Camper has noticed",
      nextSuccess: "something_nearby",
      nextFail: "something_nearby",
    },
  },
  something_nearby: {
    title: "Something Is Here",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"Who else is with you?\" the Camper rasps. It steps away from you, looking scared for the first time. \"This... isn't possible. How can one of you move so quickly?\"\n\nThere's a blur to your left, and a figure in a gray throbe appears between you and the creature far more powerful than you.\n\nThis one-- more powerful still-- throws the Camper backward with a strike you hardly register. The creature that had just seemed unstoppable crashes into its cabin, blowing the fine materials into bits.",
    next: "something_nearby2"
  },
  something_nearby2: {
    title: "A Savior Arrives",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"It's okay,\" your savior tells you. \"I'll handle it from here. You rest.\" He pauses to take in the others. \"I'm... sorry I'm late.\"\n\nBefore darkness takes you, you register something else about the stranger's clothing. Yes, it is styled in the way common to those in the Middle East, but it is clearly westernized, too.\n\nPerfectly fitted, like a business suit.",
    next: "something_nearby3"
  },
  something_nearby3: {
    title: "A Savior Arrives",
    type: "text",
    src: "../assets/shack.webp",
    text: "Your savior-- who must be a S-Class breaker-- is a member of the Silk Road guild.\n\nThen, the darkness finds you at last."
  }, 
  party_fight_alone: {
    title: "Party Fight",
    type: "text",
    src: "../assets/shack.webp",
    text: "You collapse, defeated, and the party you abandoned rushes to help you.\n\n\"Good,\" the Camper says, revealing his hidden arm and leg before swatting the party leader away like a bug. \"Maybe one of these will actually entertain me.\"",
    next: "party_fight_alone2",
  },
  party_fight_alone2: {
    title: "Party Fight",
    type: "text",
    src: "../assets/shack.webp",
    text: "A mustachioed man in fine armor and a woman in skin-tight black leather are reduced to slabs of meat without a second glance.\n\nThe creature frowns. \"Then again, perhaps not.\"\n\nAs it turns its bloodlust to the others, darkness finally finds you.\n\nIt comes as a mercy. This way, at least, you don't have to hear the screams.",
    next: "camper_finish"
  },
  sometimes_attack_alone: {
    title: "Time To Charge",
    type: "text",
    src: "../assets/shack.webp",
    text: "Talking was a mistake. You're half dead now and have nothing to show for it!\n\nYou grit your teeth and do what you should have done right away.",
    next: "camper_encounter_alone"
  },
  attack_camper_alone: {
    title: "Camper Charge",
    type: "text",
    src: "../assets/shack.webp",
    text: "Sensing your intent, the corner of the thing's mouth curls into a sick grin.\n\n\"Good,\" the Camper rasps. \"I was hoping for lively sport today.\"",
    next: "camper_blur_alone"
  },
  remain_silent_alone: {
    title: "Remain Silent",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"Not what you were expecting, hmm?\" The thing croaks a chuckle. \"There are several heads on my mantle of creatures who felt the same way. You'll be in good company.\"",
    next: "camper_blur_alone"
  },
  camper_blur_alone: {
    title: "Shouldn't Be Here",
    type: "text",
    src: "../assets/shack.webp",
    text: "There's a blur across the porch, and the creature is suddenly standing at the top of the stairs.\n\nYou see it in its full glory now... and shudder.\n\nThe thing is two heads taller than you and sports golden armor that is one part duster and one part hooded cloak. A black katana hangs from its hip. Its mouth is curled into a permanent snarl, and its shiny pink skin gives it the appearance of a burn victim.\n\nAnd the scars... There are too many to count.",
    next: "camper_blur_alone2"
  },
  camper_blur_alone2: {
    title: "Camper Appearance",
    type: "text",
    src: "../assets/shack.webp",
    text: "Worst of all is the *other* thing it's wearing. Fresh blood coats the creature like a crimson robe. It drips onto the decadent porch, adding faux-ruby to the amber, gold, and sapphire below.\n\n*Your* blood.\n\nYou feel the wound an instant later, a burning across your left side. The Camper has only nicked you, but the attack has served its purpose. It licks your blood from its katana, then frowns.\n\n\"Disappointing. I was hoping for a more worthy adversary.\"",
    next: "camper_blur_alone3",
    //life points need halved
  },
  camper_blur_alone3: {
    title: "Camper Attack",
    type: "text",
    src: "../assets/shack.webp",
    text: "The Camper returns its weapon to its sheath, then lays it on the porch with its armor. Its body is scarred and burned, aged, but also incredibly muscular.\n\nIt places its dominant arm behind its back next, then balances itself on one leg.\n\n\"I'm afraid stooping myself any more to your level requires a permanent handicap. This will have to suffice.\"",
    next: "camper_blur_alone4"
  },
  camper_blur_alone4: {
    title: "Camper Attack",
    type: "text",
    src: "../assets/shack.webp",
    text: "On a tree next to you, the final jagged symbol disappears. Eight dots like yours are moving your way now.\n\nQuickly.\n\nYou scoff and charge, looking forward to evening the scales.",
    next: "camper_encounter_alone"
  },
  camper_encounter_alone: {
    title: "Camper Encounter",
    type: "battle",
    src: "../assets/shack.webp",
    text: "",
    //players loses their right arm and both legs
    //ends in a failure no matter what
    enemies: {
      count: 1,
      template: {
        name: "Camper",
        maxHP: 1000,
        ac: 18,
        attack: 5,
        magic: 5,
        bp: 50
      }
    },
    fail: "camper_fail_alone",
    next: "camper_fail_alone",
  },
  camper_fail_alone: {
    title: "Inevitable",
    type: "choice",
    src: "../assets/shack.webp",
    action: "failure",
    text: "The Camper slices your right arm and both legs clean off.\n\nFailure is inevitable, but you are faced with a small choice in your final moments.",
    choices: [
      { label: "Engage", next: "camper_engage_alone" },
      { label: "Retreat", next: "camper_engage_retreat" },
    ],
  },
  camper_engage_alone: {
    title: "Engage",
    type: "text",
    src: "../assets/shack.webp",
    text: "The Camper smiles and leans into your punch. You deal a direct blow, drawing a small trickle of blood.\n\n\"Good,\" it rasps before hitting you so hard your vision explodes.\n\nIn the flash of pain, you see a car crash. You see exploding windows and bodies thrown around the cabin as it rolls downhill.",
    next: "camper_engage_alone2"
  },
  camper_engage_alone2: {
    title: "Engage",
    type: "text",
    src: "../assets/shack.webp",
    text: "Somehow, you, Crixon, and an infant Ryke had emerged with only cuts. Your parents died on the scene.\n\nYour older brother Cale had been in intensive care for months, fostering an addiction that still haunts him.\n\nYou had always believed you and your siblings had been spared for a reason. Now, you know the truth.\n\nThere is no reason in mad worlds like these.",
    next: "camper_engage_alone3"
  },
  camper_engage_alone3: {
    title: "Engage",
    type: "text",
    src: "../assets/shack.webp",
    text: "The fear and the pain fade to a dull roar, leaving only anger and disappointment behind.\n\n\"Do it!\" you scream. \"Get it over with!\"\n\nThe Camper looks at you, a hint of admiration in its eyes.\n\n\"You have entertained me, after all. That will not save you, but it will save *them*. I wouldn't want to... overindulge.\"\n\nYou follow the Camper's comment to where the rest of the party stands frozen at the treeline.",
    next: "camper_engage_alone4"
  },
  camper_engage_alone4: {
    title: "Engage",
    type: "text",
    src: "../assets/shack.webp",
    text: "All of them-- even Ronin, the only one you actually know and who can't stand you-- steel themselves to come to your aid.\n\nYou lock eyes with the leader, Threx, and shake your head.\n\nPerhaps sensing the power of the creature you're up against, the C-Class breaker orders the others to stand down.\n\nAs content as you can be, you turn back to the Camper.\n\n\"Get it... over with,\" you repeat.\n\nThen, darkness.",
    action: "sacrifice", 
    sacrificeLocation: "camper_encounter",
    next: "camper_finish"
  },
  camper_engage_retreat: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "You back away from the creature, hellbent on prolonging your life as long as possible.\n\nRyke, Crixon, Cale-- what will they do without you?\n\nThe Camper closes on you slowly, savoring the fear of your final moments.\n\nYou crawl over body parts and fallen weapons, neither noticing nor caring. \"N-no,\" you beg. \"Please. I- I'm not supposed to go like this.\"",
    next: "camper_engage_retreat2"
  },
  camper_engage_retreat2: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"Pitiful,\" your killer says. \"Perhaps the next world I open mine to will send creatures who entertain me better than yours has.\"\n\nThe thing stomps on your ankle to keep you from retreating. The bone shatters.\n\nIn the flash of pain, you see a car crash. You see exploding windows and bodies thrown around the cabin as it rolls downhill.\n\nSomehow, you, Crixon, and an infant Ryke had emerged with only cuts. Your parents died on the scene.",
    next: "camper_engage_retreat3"
  },
  camper_engage_retreat3: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "Your older brother Cale had been in intensive care for months, fostering an addiction that still haunts him.\n\nYou had always believed you and your siblings had been spared for a reason. Now, you know the truth.\n\nThere is no reason in mad worlds like these.\n\nYou collapse into a puddle of tears, not caring that the rest of the party arrived just in time to witness it. They freeze when they see the state of you; you despise the pity in their eyes.",
    next: "camper_engage_retreat4"
  },
  camper_engage_retreat4: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "All of them-- even Ronin, the only one you actually know and who can't stand you-steel themselves to come to your aid.\n\nTears sting your eyes. Things weren't supposed to go like this. You were meant to prove yourself here, but the only thing you've proven is how weak you are.\n\nYou collapse, defeated, and the party you abandoned rushes to help you.\n\n\"Good,\" the Camper says, revealing his hidden arm and leg before swatting the its C-Class leader away like a bug. \"Maybe one of these ones will actually entertain me.\"",
    next: "camper_engage_retreat5"
  },
  camper_engage_retreat5: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "A mustachioed man in fine armor and a woman in skin-tight black leather are reduced to slabs of meat without a second glance.\n\nThe creature frowns. \"Then again, perhaps not.\"\n\nAs it turns its bloodlust to the remaining five, darkness finally finds you.\n\nIt comes as a mercy.",
    next: "camper_finish"
  },
  ridge_alone: {
    title: "Thin The Herd",
    type: "text",
    src: "../assets/ridge.webp",
    text: "There's a wide and well-defined footpath next to you, but you follow the slight ridge running parallel to it instead. Eventually, the path leads into a clearing that would have been ideal for an ambush. Instead, when the creatures inevitably come for you, the ridge protects your flank.\n\nThe beasts of this world are cotton candy colored, just like the trees, and are larger than the one you faced near the gate.\n\nYou count twelve heading your way.",
    next: "herd_battle",
  },
  herd_battle: {
    title: "Thin The Herd",
    type: "battle",
    src: "../assets/critters.webp",
    enemies: {
      count: 3,
      template: {
        name: "Cotton Candy Beast",
        maxHP: 10,
        ac: 12,
        attack: 2,
        magic: 2,
        bp: 3
      }
    },
    text: "",
    fail: "ridge_ambush_fail",
    next: "herd_success",
  },
  herd_success: {
    title: "That's It?",
    type: "text",
    src: "../assets/critters.webp",
    text: "When the third beast collapses, you brace for your next attacker. It doesn't come. Looking beyond the trio of corpses, you realize that the remaining seven have returned to the woods.\n\nThe rest of the group must have been spotted. Now's your chance to reach the Tethered Being unmolested.",
    next: "tethered_lair_alone"
  },
  counter_attack_alone: {
    title: "Counter Attack",
    type: "text",
    src: "../assets/critters.webp",
    text: "When you arrive at the clearing, you see a color other than purple. The yellow pattern is comprised of neither rock nor flower, yet, the material carries properties of both. It smells better than the trees, too. Instead of sour milk, the clearing smells almost like lilacs and chocolate.\n\nIt's also a trap.",
    next: "counter_attack_alone2"
  },
  counter_attack_alone2: {
    title: "Counter Attack",
    type: "text",
    src: "../assets/critters.webp",
    text: "You decapitate one yellow flower, then another. Two geysers of blood follow, as the creatures beneath them howl in anguish.\n\nTwo of your enemies are already out of the fight, but ten more creatures emerge from the underbrush and charge you. They are cotton candy colored, just like the trees, and larger than the one you faced near the gate.\n\nYou smile and charge them back.\n\nThe Protocol will *have* to activate you after today.",
    next: "counter_attack_battle"
  },
  counter_attack_battle: {
    title: "Counter Attack",
    type: "battle",
    src: "../assets/critters.webp",
    text: "",
    enemies: {
      count: 10,
      template: {
        name: "Cotton Candy Beast",
        maxHP: 10,
        ac: 10,
        attack: 2,
        magic: 2,
        bp: 3
      }
    },
    fail: "ridge_ambush_fail",
    next: "ridge_ambush_success",
  },
  critter_death: {
    title: "---",
    useCustomBackground: true,
    type: "text",
    action: "failure",
    text: "Your world goes black, but there is a single light in the darkness...\n\nYou approach it, and it feels... good. Comforting...\n\nYou reach for it, but rough hands pull you back...",
    next: "welcome_back"
  },
  welcome_back: {
    title: "Welcome Back",
    src: "../assets/forest.webp",
    type: "text",
    hpModification: {
      type: 'add',
      amount: 20,
      message: "You are brought back to life.",
    },
    text: "\"Welcome back to the world of the living, dumbass.\"\n\nThrex and seven others are standing around you, unimpressed.\n\n\"You're lucky we have a healer,\" Ronin says from the back. He's the only person you know from this group, and he hates your guts.",
    next: "welcome_back2"
  },
  welcome_back2: {
    title: "Welcome Back",
    src: "../assets/forest.webp",
    type: "choice",
    text: "Standing from where she had been kneeling over your corpse, a large black woman in dented armor wipes her hands.\n\n\"That might be a record,\" she says. \"I don't think I ever had to heal someone mere seconds after entering a gate before.\"\n\n\"Don't be rude, Harla!\" chastises a woman next to her. \"He was just a little overzealous. We've all been there.\" She steps forward and offers you a hand up. \"I'm Akemi.\"",
    npcsPresent: [
      {
        name: "Ronin",
        description: "A mysterious warrior with a hidden past",
        stats: {
          maxHP: 150,
          currentHP: 150,
          ac: 16,
          fellowship: 10,
          athletics: 14,
          thought: 10,
          essence: 8
        }
      },
      {
        name: "Aleth",
        description: "A similar unranked member",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Threx",
        description: "A massive fighter",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Kaelion",
        description: "A cultured warrior",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Harla",
        description: "A healer",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Mitzi",
        description: "A diminutive mage",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Sheemie",
        description: "A summoner",
        stats: {
          maxHP: 200,
          currentHP: 200,
          ac: 18,
          fellowship: 8,
          athletics: 16,
          thought: 6,
          essence: 6
        }
      },
      {
        name: "Akemi",
        description: "The nicest member",
        stats: {
          maxHP: 80,
          currentHP: 80,
          ac: 12,
          fellowship: 12,
          athletics: 8,
          thought: 16,
          essence: 14
        }
      }
    ],
    choices: [
      { label: "Take hand and offer name", next: "friendly_return" },
      { label: "Stand on your own and offer your name", next: "neutral_return" },
      { label: "Ignore the hand and stand up", next: "bad_return" },
    ],
  },
  friendly_return: {
    title: "Take Hand",
    src: "../assets/forest.webp",
    type: "text",
    text: "You take the hand being offered to you, a little embarrassed. You had seen things going a little differently here.",
    action: "nice_to_akemi",
    next: "good_name"
  },
  good_name: {
    title: "Who Are You?",
    src: "../assets/forest.webp",
    text: "Before you can proceed, you need to choose a name for yourself. This name will be your identity in the game world.",
    type: "input",
    input: {
      field: "characterName", 
      label: "Enter your name:",
      next: "good_intro"
    }
  },
  good_intro: {
    title: "Akemi Intro",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"Well, I think it's very nice to meet you {{characterName}}. I think it was very brave of you to rush right in here... Though, maybe you can hold off in the future? We are a team, after all, right?\"",
    next: "threx_collar"
  },
  neutral_return: {
    title: "Stand Up",
    type: "text",
    src: "../assets/forest.webp",
    text: "You ignore the hand and struggle to your feet.",
    action: "nice_to_akemi",
    next: "bad_name"
  },
  bad_name: {
    title: "Who Are You?",
    src: "../assets/forest.webp",
    text: "Before you can proceed, you need to choose a name for yourself. This name will be your identity in the game world.",
    type: "input",
    input: {
      field: "characterName", 
      label: "Enter your name:",
      next: "bad_intro"
    }
  },
  bad_intro: {
    title: "Akemi Intro",
    type: "text",
    src: "../assets/forest.webp",
    text: "\"Well, I think it's very nice to meet you {{characterName}},\" Akemi says, trying to ignore the slight. \"I also think it was very brave of you to rush right in here... Though, maybe you can hold off in the future? We are a team, after all, right?\"",
    next: "threx_collar"
  },
  bad_return: {
    title: "Ignored",
    type: "text",
    src: "../assets/forest.webp",
    text: "You ignore both the hand and the question, returning to your feet on your own terms.\n\nAkemi gafaws.\n\n\"I told you, Ronin says. \"{{characterName}} is an asshole.\"\n\nBefore you can reply, strong hands grab the collar of your shirt.\n\n\"Asshole or not,\" Threx says, \"you're going to listen to me now. You have a choice, newbie. You can either do as I say the rest of the time we're in here, or you can head right back through this portal and find yourself a new career.\"",
    // action: "add_name",
    action: "not_nice_to_akemi",
    next: "what_going_be",
  },
  threx_collar: {
    title: "Threx Collar",
    type: "text",
    src: "../assets/forest.webp",
    next: "what_going_be",
    text: "Before you can answer, strong hands grab the collar of your shirt.\n\n\"She's right,\" Threx hisses. \"And you need to realize your place on that team. You have a choice, newbie. You can either do as I say the rest of the time we're in here, or you can head right back through this portal and find yourself a new career.\"",
  },
  what_going_be: {
    title: "What's it going to be?",
    type: "choice",
    src: "../assets/forest.webp",
    text: "What's it going to be?",
    choices: [
      { label: "Stay and listen", next: "stay" },
      { label: "Leave", next: "leave" },
      { label: "Leave, then sneak back in", next: "leave_sneak" },
    ]
  },
  stay: {
    title: "Stay",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"I...I'll listen,\" you stammer, realizing this is the only way forward. \"I'm sorry for entering alone. I... thought I was stronger.\"\n\nRonin chuckles at your expense, but your words find their mark.\n\n\"Good,\" Threx says. \"In that case, we're moving on. Consult that digital readout of yours to learn more about the others while we move. Knowing who you're fighting beside might save your life today.\"",
    next: "stay2"
  },
  stay2: {
    title: "Stay",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"*Digital* readout?\" a mustachioed man in fine armor asks. He speaks like a character in a medieval period piece. \"Doth thou claim this rube isn't activated?\"\n\nNext to him, a girl in skin-tight black leather rolls her eyes and adds, \"As if we weren't worried about him already.\"\n\nYour digital readout gives you the names and portfolios of your companions. The man is Kaelion Virehart, an E-Class warrior. The woman, a summoner, is \"Mitzi.\" Also E-Class.",
    next: "stay3"
  },
  stay3: {
    title: "Stay",
    src: "../assets/forest.webp",
    type: "text",
    text: "Admiring the purple tree-things is Sheemie Bauer, a dorky-looking E-Class mage.\n\nYou've met the others.\n\nThrex, the C-Class warrior\n\nAkemi, the E-Class undeclared\n\nHarla, the D-Class healer\n\nRonin, the— you do a double take— *D-Class* mixed.\n\n*How is he D-Class already?* you wonder, thinking back on all the scrapes you two got into growing up.",
    next: "stay4"
  },
  stay4: {
    title: "Stay",
    src: "../assets/forest.webp",
    type: "text",
    text: "You look up at Ronin, and instead lock eyes with a member of the party you hadn't noticed before.\n\nThe final member of the party had been watching you intently, and he doesn't look away now that you've noticed him.\n\nIt's creepy.\n\n\"Aleth Achen,\" reads your digital readout when you scroll to the final entry. \"Unactivated.\"\n\n*He's like me,* you realize.",
    //next depends on if they were nice to akemi (takes hand)
    conditionalNext: {
    conditions: [
      {
        type: 'nice_to_akemi',
        value: true,
        next: 'akemi_nice'
      }
    ],
    default: 'threx_newbie'
    },
    next: "threx_newbie",
  },
  akemi_nice: {
    title: "Nice to Akemi",
    type: "choice",
    src: "../assets/forest.webp",
    text: "\"Here,\" Akemi says, handing you a vial of caustic purple liquid. \"It'll fortify you against the environment for the next few hours.\"",
    choices: [
      { label: "Take the vial", next: "akemi_take" },
      { label: "Hold the vial", next: "akemi_hold" },
    ]
  },
  akemi_take: {
    title: "Take potion",
    action: "took_environment_potion",
    src: "../assets/forest.webp",
    type: "text",
    text: "You drain the vial, and the ill effects of this world immediately dull.\n\n\"All potions work the same way,\" Akemi tells you. \"The effect is immediate, and it'll last for however long it is advertised! The only exception is health potions; those will heal you right up and keep you that way unless you get hurt again!\"\n\n\"And poison,\" Mitzi says, deadpan. \"That's permanent, too.\"",
    next: "threx_question"
  },
  akemi_hold: {
    title: "Hold potion",
    type: "text",
    src: "../assets/forest.webp",
    text: "You thank Akemi and pocket the potion for later. This place is brutal, but it's nothing you can't handle.\n\nBetter to hold on to it until you actually need it.",
    next: "threx_question"
  },
  threx_question: {
    title: "Threx",
    type: "choice",
    src: "../assets/forest.webp",
    text: "\"Alright!\" Threx yells. \"Let's get moving. Newbie,\" he pauses to address you directly. \"I'm... impressed you managed to take on that thing yourself. I'd like you to be up front with me so I can watch your style directly.\"",
    choices: [
      { label: "Agree (talk with Threx)", next: "agree_threx" },
      { label: "Disagree (talk with the others)", next: "disagree_threx" },
    ]
  },
  threx_newbie: {
    title: "Threx Newbie",
    type: "text",
    src: "../assets/forest.webp",
    text: "\"Alright!\" Threx yells. \"Let's get moving. Newbie,\" he pauses to address you directly. \"You're up front with me.\"\n\n\"Great,\" you mutter, wondering how this conversation could work to your advantage.",
    next: "agree_threx"
  },
  leave: {
    title: "Leave",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"I...I...\" Tears overrule your objection. Who are you kidding? You were dead only minutes ago.",
    next: "go_home"
  },
  leave_sneak: {
    title: "Leave, then Sneak Back In",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"Fine,\" you hiss, pulling yourself away from the Class-C breaker. You don't need him, anyway. You don't need any of them.\n\nRonin is laughing as you exit the portal, but that's okay. The joke will be on him soon enough.\n\nFor a brief moment, you're looking back at your city again. Arclight Haven is only just waking up, and the hum of traffic is still faint. You look at the obelisk at the edge of the city, thinking of your family and the promise you made to keep them safe.\n\nYou *can't* pick another career. There is too much riding on this one. You count to a hundred fifteen times, giving your ex-companions time to move on, then re-enter.",
    next: "forest_deeper",
  },
  team_Warrior: {
    title: "Warrior",
    type: "text",
    src: "../assets/portal.webp",
    next: "team_intro1",
    text: "You tell the others what your selection was, careful not to mention your unranked status or that you're not activated. That should be apparent to anyone who bothers looking you up on their AR display.\n\n\"You and Kaelion will get along great then,\" Akemi says, gesturing to a man in armor so fancy it could have supported your family for a month.\n\nYou doubt her assumption.",
  },
  team_Mage: {
    title: "Mage",
    type: "text",
    src: "../assets/portal.webp",
    next: "team_intro1",
    text: "You tell the others what your selection was, careful not to mention your unranked status or that you're not activated. That should be apparent to anyone who bothers looking you up on their AR display.\n\nAkemi smiles. \"I'm sure you and Sheemie will have plenty to talk about.\" She leans in, and you detect a hint of lavender and sandalwood. \"Just don't get him started on ecology.\"\n\nYou cock your head, unsure of how to take the advice.",
  },
  team_Summoner: {
    title: "Summoner",
    type: "text",
    src: "../assets/portal.webp",
    next: "team_intro1",
    text: "You tell the others what your selection was, careful not to mention your unranked status or that you're not activated. That should be apparent to anyone who bothers looking you up on their AR display.\n\nAkemi smirks. \"As long as your goal isn't to summon the creepy things Mitzi talks about, I think we'll still get along fine!\"\n\nYou consider asking for specifics, but decide now might not be the time.",
  },
  team_Undecided: {
    title: "Undecided",
    type: "text",
    src: "../assets/portal.webp",
    next: "team_intro1",
    text: "You tell the others what your selection was, careful not to mention your unranked status or that you're not activated. That should be apparent to anyone who bothers looking you up on their AR display.\n\n\"Same here!\" Akemi exclaims. \"Well, kinda. I just don't wanna get stuck with a specific skillset, yaknow?\"\n\nYou nod, knowing exactly how she feels. If you ever do get activated, there would be a million different paths to take. How could anyone ever decide on just one?",
  },
  team_Mixed: {
    title: "Mixed",
    type: "text",
    src: "../assets/portal.webp",
    next: "team_intro1",
    text: "You tell the others what your selection was, careful not to mention your unranked status or that you're not activated. That should be apparent to anyone who bothers looking you up on their AR display.\n\n\"Same here!\" Akemi exclaims. \"Well, kinda. I just don't wanna get stuck with a specific skillset, yaknow?\"\n\nYou nod, knowing exactly how she feels. If you ever do get activated, there would be a million different paths to take. How could anyone ever decide on just one?",
  },
  team_intro1: {
    title: "Harla",
    type: "text",
    src: "../assets/portal.webp",
    text: "Akemi turns back to the others.\n\n\"Well, don't be afraid, guys! Introduce yourselves to our new friend!\"\n\nA large black woman is the first to raise her hand in greeting. She is wearing armor that looks like it's already seen quite a bit of fighting. \"I'm Harla,\" she says, \"the closest thing this group has to a healer. I can take hits,\" she pauses to address the armor, \"but I would rather not.\"",
    next: "team_intro2",
    npcPresent: "Harla",
    npcDescription: "Healer",
    action: "meet_npc",
    npcStats: {
        maxHP: 150,
        currentHP: 150,
        ac: 16,
        fellowship: 10,
        athletics: 10,
        thought: 10,
        essence: 10
    },
  },
  team_intro2: {
    title: "Kaelion",
    type: "text",
    src: "../assets/portal.webp",
    text: "\"Kaelion Virehart,\" says the man in fancy armor next to her. It's difficult to pay attention to anything about him besides that and the handlebar moustache.\n\nAnd his choice of words. He sounds like a knight in the stories your mom used to read you before bed.\n\n\"I await our shared endeavor ahead. May the wind be forever at our backs!\"",
    next: "team_intro3",
    npcPresent: "Kaelion",
    npcDescription: "Warrior",
    action: "meet_npc",
    npcStats: {
        maxHP: 150,
        currentHP: 150,
        ac: 16,
        fellowship: 10,
        athletics: 10,
        thought: 10,
        essence: 10
    },
  },
  team_intro3: {
    title: "Team Intro",
    type: "text",
    src: "../assets/portal.webp",
    text: "\"Sheemie!\" the short boy yells from next to him. The greeting is piercing and immediately makes you forget about the knight.\n\nHe literally says nothing else. He just shouts his name and stares.\n\nYou nod back.",
    next: "team_intro4",
    npcPresent: "Sheemie",
    npcDescription: "Mage",
    action: "meet_npc",
    npcStats: {
        maxHP: 150,
        currentHP: 150,
        ac: 16,
        fellowship: 10,
        athletics: 10,
        thought: 10,
        essence: 10
    },
  },
  team_intro4: {
    title: "Team Intro",
    type: "text",
    src: "../assets/portal.webp",
    text: "Rivaling his energy in the opposite direction, a girl in skin-tight black leather says, simply, \"Mitzi\"\n\nShe also says nothing else.\n\nYou're okay with that.",
    next: "team_intro5",
    npcPresent: "Mitzi",
    npcDescription: "Mage",
    action: "meet_npc",
    npcStats: {
        maxHP: 150,
        currentHP: 150,
        ac: 16,
        fellowship: 10,
        athletics: 10,
        thought: 10,
        essence: 10
    },
  },
  team_intro5: {
    title: "Aleth",
    type: "text",
    src: "../assets/portal.webp",
    text: "Akemi sighs and nods at the final member of the group. He has been close enough to listen to your conversation, but remains transfixed on the portal.\n\n\"And that's Aleth,\" she says. \"Don't let his anti-social behavior fool you; he's a real sweetheart.\"\n\n\"Something about this doesn't feel right,\" Aleth whispers.\n\nAkemi frowns. \"He says stuff like that a lot. You'll get used to it.\"",
    next: "ronin_intro",
    npcPresent: "Aleth",
    npcDescription: "Samurai",
    action: "meet_npc",
    npcStats: {
        maxHP: 150,
        currentHP: 150,
        ac: 16,
        fellowship: 10,
        athletics: 10,
        thought: 10,
        essence: 10
    },
  },
  ronin_intro: {
    title: "Ronin",
    type: "choice",
    npcPresent: "Ronin",
    npcDescription: "Ronin",
    action: "meet_npc",
    npcStats: {
        maxHP: 150,
        currentHP: 150,
        ac: 16,
        fellowship: 10,
        athletics: 10,
        thought: 10,
        essence: 10
    },
    src: "../assets/portal.webp",
    text: "You look at Ronin, who has distanced himself from the others. Like Aleth, the breaker-in-training has his attention firmly on the portal. Unlike Aleth, it seems he is doing it to avoid you and the others.",
    choices: [
      { label: "Introduce Ronin to the others", action: "tell_team", npcName: "Ronin", next: "introduce_ronin" },
      { label: "Say nothing", next: "nothing_ronin" },
    ],
  },
  introduce_ronin: {
    title: "Introduce Ronin",
    type: "text",
    src: "../assets/portal.webp",
    text: "\"That's Ronin,\" you say. \"He's usually a lot friendlier than this. He just *really* doesn't like me.\"\n\n\"Why doesn't he like you?\" Harla asks. She is leaning forward, hungry for gossip.\n\nYou open your mouth to reply, but a yell from your party leader stops you short.",
    next: "threx_brief",
  },
  nothing_ronin: {
    title: "Say Nothing",
    type: "text",
    src: "../assets/portal.webp",
    text: "You keep quiet. Ronin had his chance to make a good first impression. It isn't your fault he's a jerk.",
    next: "threx_brief",
  },
  threx_brief: {
    title: "Threx Briefing",
    type: "choice",
    npcPresent: "Threx",
    action: "meet_npc",
    npcDescription: "C-Class Breaker, party leader",
    npcStats: {
        maxHP: 150,
        currentHP: 150,
        ac: 16,
        fellowship: 10,
        athletics: 10,
        thought: 10,
        essence: 10
      },
    src: "../assets/portal.webp",
    text: "\"Alright!\" Threx yells. \"It's about time to head in. Gather around for the pre-raid briefing.\"\n\nThere are grumbled affirmatives from most of the group, but you feel differently.\n\nYou feel...",
    choices: [
      { label: "Excited", next: "excited" },
      { label: "Nervous", next: "nervous" },
      { label: "Like this is a waste of time", next: "waste" },
    ],
  },
  excited: {
    title: "Excited",
    type: "text",
    src: "../assets/portal.webp",
    text: "You sway from one foot to another, excited to take this first step toward activating and realizing your true potential.\n\nBy the time you clear this gate, the Protocol will want you.",
    next: "excited2",
  },
  excited2: {
    title: "Excited",
    chapter: "chapter1",
    section: "section1",
    src: "../assets/portal.webp",
    type: "text",
    text: "\"These gates appeared three years ago,\" the party leader begins, citing common knowledge. \"They can lead us anywhere, and can lead anything to us. If a gate isn't cleared in time, it opens a rift in our world. We do not want a rift.\"",
    next: "excited3",
  },
  excited3: {
    title: "Excited",
    chapter: "chapter1",
    section: "section1",
    src: "../assets/portal.webp",
    type: "text",
    text: "\"The world before this one was complacent. We cannot be complacent.\n\nThe world before this one failed. We cannot fail.\n\nWe have two things the old world did not. The first is the Protocol. Without it, we would be the weak, biologically-damned beings of our ancestors. Without it, we'd be no match for most of what's in these gates.\n\nThe second things is each other.\n\nNow, let's check our gear a final time and then kick some ass.\"",
    next: "threx_brief2",
  },
  nervous: {
    title: "Nervous",
    type: "text",
    src: "../assets/portal.webp",
    text: "You sway from one foot to another, nervous to take this first step into a world that can kill you.\n\nWhat if, after everything you face in there, the Protocol *still* doesn't activate you?",
    next: "threx_brief2",
  },
  threx_brief2: {
    title: "Threx Briefing",
    type: "text",
    chapter: "chapter1",
    section: "section1",
    src: "../assets/portal.webp",
    text: "\"These gates appeared three years ago,\" the party leader begins, citing common knowledge. \"They can lead us anywhere, and can lead anything to us. If a gate isn't cleared in time, it opens a rift in our world. We do *not* want a rift.\"",
    next: "threx_brief3",
  },
  threx_brief3: {
    title: "Threx Briefing",
    type: "text",
    src: "../assets/portal.webp",
    text: "\"The world before this one failed. We cannot fail.\n\nWe have two things the old world did not. The first is the Protocol. Without it, we would be the weak, biologically-damned beings that our ancestors were. Without it, we'd be no match for most of what's in these gates. Halcyon has connected us to that entity, and we're stronger now because of it.\n\nThe second things is each other.\n\nNow, let's check our gear a final time and then kick some ass!\"",
    // next: "team_equipment",
    next: "team_portal_entry",
  },
  waste: {
    title: "Waste of Time",
    type: "text",
    src: "../assets/portal.webp",
    text: "\"These gates appeared three years ago,\" the party leader begins, citing common knowledge. \"They can lead us anywhere, and can lead anything to us. If a gate isn't cleared in time, it opens a rift in our world. We do *not* want a rift.\"",
    next: "waste2",
  },
  waste2: {
    title: "Waste of Time",
    type: "text",
    src: "../assets/portal.webp",
    text: "Threx talks about the fall of the world that existed before the gates. He talks about the arrival of the Protocol, and how the Halcyon AI bridged the gap between it and humanity. He talks about the importance of staying together as a species.\n\nYou tune most of it out.\n\nAt least, up until the moment the big man claps his hands in your face.",
    next: "waste3",
  },
  waste3: {
    title: "Waste of Time",
    type: "text",
    src: "../assets/portal.webp",
    text: "\"I'm sorry, am I boring you?\" He looks between you and Ronin. \"I was worried about you two freelancers before, but now I'm *concerned*.\"\n\n\"Don't lump me in with him!\" Ronin snaps. \"I'm paying attention. I have my gear. I'm ready to do this thing. Besides,\" he squares up with the C-Class breaker, \"Silas Knorrs is freelance. Ember Naes, too. Give us more credit!\"",
    next: "waste4",
  },
  waste4: {
    title: "Waste of Time",
    type: "choice",
    src: "../assets/portal.webp",
    text: "\"That's true. Half of our top breakers *are* freelance.\" Threx leans forward. \"But so are three-quarters of the bodies we bring back. Are you sure you wanna do this?\"\n\nRonin turns back to the portal, and Threx's attention turns to you.\n\n\"What about you? It isn't too late to back out, kid.\"",
    choices: [
      { label: "Go home", next: "go_home" },
      { label: "Punch Threx in the face", next: "punch_threx" },
      { label: "\"I can handle this.\"", next: "handle_this" },
    ],
  },
  go_home: {
    title: "Go Home",
    type: "end",
    src: "../assets/portal.webp",
    text: "This was a mistake. Gatebreaking isn't for you. That's okay; maybe you'll have better luck working retail or something.\n\nRonin laughs as you walk off, but that's okay. Let him have his glory.\n\nAt least you have your life.\n\nThe End.",
    next: "home_end",
  },
  handle_this: {
    title: "I Can Handle This",
    type: "text",
    src: "../assets/portal.webp",
    text: "\"Fair enough, but don't come crying to me if you get in above your head out there.\"\n\nThrex gives you and Ronin a final piercing look before turning back to others. \"Let's do a final gear check before leading these two to their deaths.\"",
    // next: "team_equipment",
    next: "team_portal_entry",
  },
  punch_threx: {
    title: "Punch Threx In The Face",
    type: "roll",
    src: "../assets/portal.webp",
    text: "You could argue your point, but it's easier to show than to tell. This'll teach him to doubt a freelance breaker!",
    roll: {
      stat: "Athletics",
      dc: 12,
      successText: "Your strike is quick, powerful, and straight to the point. It hits Threx clean across the face, eliciting a grunt from the big man and a gasp from the others. Even Ronin seems impressed.",
      failText: "Threx has been fighting for a long time, and against creatures far more powerful than you. He easily ducks your fist and retorts with a strike of his own.\n\nA moment later, you're looking up at the man who hit you.",
      nextSuccess: "threx_hits",
      nextFail: "very_dumb_fail",
    },
  },
  threx_hits: {
    title: "Threx Hits Back",
    type: "text",
    src: "../assets/portal.webp",
    text: "Any celebration is short-lived, though. Threx quickly shrugs off the strike, and returns with an attack of his own.",
    next: "threx_hits_battle"
  },
  threx_hits_battle: {
    title: "Threx Hits Back",
    type: "battle",
    src: "../assets/portal.webp",
    text: "",
    enemies: {
      count: 1,
      template: {
        name: "Threx Muller",
        maxHP: 100,
        ac: 16,
        attack: 5,
        magic: 5,
        bp: 5
      }
    },
    // enemies: [
    // {
    //   name: "Alpha Critter", 
    //   maxHP: 20, 
    //   ac: 12, 
    //   attack: 4, 
    //   magic: 2, 
    //   bp: 10 
    // }, 
    // { 
    //   name: "Critter Scout", 
    //   maxHP: 8, 
    //   ac: 11, 
    //   attack: 1, 
    //   magic: 0, 
    //   bp: 3 
    // }, ],
    // allies: ["Ronin", "Threx", "Akemi"], 
    // enemy: {
    //   name: "Threx Muller",
    //   maxHP: 1000,      
    //   ac: 16,          
    //   attack: 5,      
    //   magic: 5,
    //   // initiative: 15
    // },
    // initiative: "player",
    // initiative: "enemy",
    fail: "very_dumb",
    next: "very_dumb",
  },
  very_dumb_fail: {
    title: "Very Dumb",
    type: "text",
    src: "../assets/portal.webp",
    action: "failure",
    text: "\n\nThrex wipes the floor with you immediately, showcasing the power disparity between class E and C.\n\n\"That was very dumb of you... but I appreciate your gusto. Here...\"\n\nYour digital readout dings with a notification.\n\nHealth potion added.",
    next: "now_what",
    hpModification: {
      type: 'subtract',
      amount: 10,
      message: 'Threx knocks you out cold, dealing 10 damage.',
    }
  },
  very_dumb: {
    title: "Very Dumb",
    type: "text",
    src: "../assets/portal.webp",
    text: "\n\nThrex wipes the floor with you immediately, showcasing the power disparity between class E and C.\n\n\"That was very dumb of you... but I appreciate your gusto. Here...\"\n\nYour digital readout dings with a notification.\n\nHealth potion added.",
    next: "now_what",
    hpModification: {
      type: 'add',
      amount: 5,
      message: 'Threx pulls you back up before you pass out.',
    }
  },
  now_what: {
    title: "Now What?",
    type: "choice",
    src: "../assets/portal.webp",
    text: "\"Now, are you backing out of this thing, or what?\"",
    choices: [
      { label: "Go home", next: "go_home" },
      { label: "\"I can handle this.\"", next: "handle_this" },
    ],
  },
  team_equipment: {
    title: "Equipment",
    // type: "equipment",
    type: "text",
    text: "",
    next: "team_portal_entry",
  },
  team_portal_entry: {
    title: "Team Portal Entry",
    src: "../assets/portal.webp",
    type: "text",
    action: "nice_to_akemi",
    text: "With your gear checked and your role in the party understood as best it can be, you follow the others to the portal.\n\nIt crackles, sloshes, and whispers at your approach, speaking in a language even its denizens fail to understand. Its surface runs like quicksilver. Its golden facade sparkles against the sun. It's the most beautiful thing you've ever seen.\n\nAnd also the most terrifying.\n\nYou enter... and all you've ever known disappears behind you.",
    next: "team_portal_inside",
  },
  team_portal_inside: {
    title: "Team Portal Inside",
    src: "../assets/forest.webp",
    type: "choice",
    text: "You emerge on the other side, in another world. The rules are different here. The gravity is heavier; the air, thinner. Its sweet and sour aroma makes your mouth water and your head spin in equal measure.\n\nWorst of all is the vertigo.\n\nThe land stretches out and up, culminating in an inverted sphere fifty miles across. Spindly purple flora obscures most of the ground itself... and whatever creatures lurk beneath. Crystal clear streams vein between the overgrowth, reflecting the ground above in a muted kaleidoscope.\n\n\"Here,\" Akemi says, handing you a vial of caustic purple liquid. \"It'll fortify you against the environment for the next few hours.\"",
    choices: [
      { label: "Take the vial", next: "take_vial" },
      { label: "Hold off for now", next: "hold_vial" },
    ],
  },
  take_vial: {
    title: "Take the Vial",
    type: "text",
    action: "took_environment_potion",
    src: "../assets/forest.webp",
    text: "You drain the vial, and the ill effects of this world immediately dull.\n\n\"All potions work the same way,\" Akemi explains. \"The effect is immediate, and it'll last for however long it is advertised! The only exception is health potions; those will heal you right up and keep you that way unless you get hurt again!\"\n\n\"And poison,\" Mitzi says, deadpan. \"That's permanent, too.\"",
    next: "team_portal_encounter_take"
  },
  hold_vial: {
    title: "Hold Off For Now",
    type: "text",
    src: "../assets/forest.webp",
    text: "You thank Akemi and pocket the potion for later. This place is brutal, but it's nothing you can't handle.\n\nBetter to hold on to it until you actually need it.\n\nItem Added to Inventory",
    next: "team_portal_encounter_hold"
  },
  team_portal_view_take: {
    title: "Team Portal View",
    src: "../assets/forest.webp",
    type: "text",
    text: "You marvel at your new surroundings. Not only are the physical laws here different from what you're used to, but its sensory qualities also assault you. The sweet aroma makes your mouth water, and the visual cues induce vertigo.\n\nThe land stretches out and up, culminating in an inverted sphere fifty miles across. Spindly purple flora obscures most of the ground itself... and whatever creatures lurk beneath. Crystal clear streams vein between the overgrowth, breaking it up into a patchwork of assorted purples. The liquid reflects the ground opposite it, where more streams do the same.\n\nThe result is a muted kaleidoscope. It's beautiful, but it can also be brain-breaking.\n\nAll of it, when combined, also creates an unfortunate distraction.",
    next: "team_portal_encounter_take",
  },
  team_portal_view_hold: {
    title: "Team Portal View",
    src: "../assets/forest.webp",
    type: "text",
    text: "You marvel at your new surroundings. Not only are the physical laws here different from what you're used to, but its sensory qualities also assault you. The sweet aroma makes your mouth water, and the visual cues induce vertigo.\n\nThe land stretches out and up, culminating in an inverted sphere fifty miles across. Spindly purple flora obscures most of the ground itself... and whatever creatures lurk beneath. Crystal clear streams vein between the overgrowth, breaking it up into a patchwork of assorted purples. The liquid reflects the ground opposite it, where more streams do the same.\n\nThe result is a muted kaleidoscope. It's beautiful, but it can also be brain-breaking.\n\nAll of it, when combined, also creates an unfortunate distraction.",
    conditionalNext: [
      {
        conditions: [
          { type: 'took_environment_potion' }
        ],
        next: 'team_portal_encounter_take'
      }
    ],
    next: "team_portal_encounter_hold"
  },
  team_portal_encounter_take: {
    title: "What Is That?",
    src: "../assets/forest.webp",
    type: "choice",
    text: "Something small and quick darts at you from the nearest tuft of flora. You react quickly to the threat, beating your companions to the punch.",
    choices: [
      { label: "Eliminate the threat", next: "team_portal_battle" },
      { label: "Dive for cover", next: "team_portal_dive" },
    ],
  },
  team_portal_battle: {
    title: "First Battle",
    src: "../assets/forest.webp",
    type: "battle",
    environment: "forest",
    enemies: {
      count: 1,
      template: {
        name: "Critter",
        maxHP: 10,
        ac: 10,
        attack: 2,
        magic: 1,
        bp: 5
      }
    },
    text: "",
    fail: "team_portal_battle_fail",
    next: "team_portal_battle_success",
  },
  // team_portal_battle: {
  //   title: "First Battle",
  //   src: "../assets/forest.webp",
  //   type: "battle",
  //   enemy: {
  //     name: "Critter",
  //     maxHP: 10,      // Enemy health
  //     ac: 10,          // Armor Class (difficulty to hit)
  //     attack: 2,      // Attack bonus
  //     magic: 1,
  //     points: 5,
  //     item: ""        // Magic attack bonus
  //   },
  //   team: [
  //     { name: "Akemi", maxHP: 15, ac: 12, fellowship: 10, athletics: 10, thought: 10, essence: 10 },
  //     { name: "Harla", maxHP: 20, ac: 14, fellowship: 10, athletics: 10, thought: 10, essence: 10 },
  //     { name: "Kaelion", maxHP: 18, ac: 13, fellowship: 10, athletics: 10, thought: 10, essence: 10 },
  //     { name: "Sheemie", maxHP: 12, ac: 11, fellowship: 10, athletics: 10, thought: 10, essence: 10 },
  //     { name: "Mitzi", maxHP: 14, ac: 12, fellowship: 10, athletics: 10, thought: 10, essence: 10 },
  //     { name: "Aleth", maxHP: 16, ac: 13, fellowship: 10, athletics: 10, thought: 10, essence: 10 },
  //   ],
  //   text: "",
  //   fail: "death",
  //   next: "team_portal_battle_finish",
  // },
  team_portal_battle_fail: {
    title: "Fail",
    type: "text",
    src: "../assets/forest.webp",
    action: "failure",
    text: "Despite your best efforts, the creature gets the better of you.\n\nYou fall, and it lunges for your throat.\n\nAleth addresses the threat, stilling it with a throwing knife to the face.",
    next: "team_portal_battle_fail2"
  },
  team_portal_battle_fail2: {
    title: "Fail",
    type: "text",
    src: "../assets/forest.webp",
    text: "\"Not bad for someone who hasn't been activated,\" Threx says, patting him on the back. \"Mark my words: the Protocol will notice you yet!\"\n\nYou stand and nod a \"thank you.\" Aleth nods back.",
    next: "team_portal_battle_finish"
  },
  team_portal_battle_success: {
    title: "Success",
    type: "text",
    src: "../assets/forest.webp",
    text: "It feels nice to have felled your first beast.\n\n\"Not bad for someone who hasn't been activated,\" Threx says, patting you on the back. \"Mark my words: the Protocol will notice you yet!\"",
    next: "team_portal_battle_finish"
  },
  team_portal_dive: {
    title: "Dive For Cover",
    src: "../assets/forest.webp",
    type: "text",
    text: "Aleth addresses the threat, stilling it with a throwing knife to the face.\n\n\"Not bad for someone who hasn't been activated,\" Threx says, patting him on the back. \"Mark my words: the Protocol will notice you yet!\"",
    next: "team_portal_battle_finish",
  },
  team_portal_encounter_hold: {
    title: "What Is That?",
    src: "../assets/forest.webp",
    type: "text",
    text: "Something small and quick darts at you from the nearest tuft of flora. You try to react, but the strain of this place makes you sluggish.\n\nLuckily, you're not here alone. Aleth addresses the threat, stilling it with a throwing knife to the face.\n\n\"Not bad for someone who hasn't been activated,\" Threx says, patting him on the back. \"Mark my words: the Protocol will notice you yet!\"",
    next: "team_portal_battle_finish",
  },
  team_portal_battle_finish: {
    title: "Critter Defeated",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"That's not fair!\" Ronin yells, arriving with his own blade a moment too late. \"Unactivated people only get pretend points. I'm activated, like most of you. Why wasn't it split between us evenly?\"\n\n\"The Protocol registers assists somehow,\" Akemi explains. \"It knows who put the work in. There's nothing 'pretend' about that.\"\n\n\"You just need to be faster, my friend,\" Kaelion says, flashing Ronin a playful grin.",
    next: "team_portal_victory",
  },
  team_portal_victory: {
    title: "Breaker Points?",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"I can't wait to start investing my Breaker Points into Mage abilities!\" Sheemie exclaims. \"I'd love to specialize in something plant-based.\"\n\n\"Poor kid never left his treehouse,\" Mitzi says in a stage whisper.\n\n\"Who *doesn't* love a good treehouse?\" Sheemie laughs. \"Nah, I just really wanna get into the *Thomur Guild*. I heard they have a penchant for recruits who hyper-specialize in things most people don't think about.\"\n\n\"But...plants?\"",
    next: "team_portal_victory2",
  },
  team_portal_victory2: {
    title: "Guilds?",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"Oh, please,\" Harla cuts in. \"Like you're one to talk, Mitzi. Don't you plan to join the *Silhouettes* once you're strong enough? Those people are weirder than some tiny guild no one has heard about.\"\n\n\"Hey!\" Sheemie exclaims in his high-pitched way.\n\nMitzi ignores the outburst. \"Well, yeah. I mean, either the *Silhouette* or *Protocol Null*.\"\n\nShe doesn't elaborate. She doesn't need to. Everyone knows about the two major breakaway factions.",
    next: "team_portal_victory3",
  },
  team_portal_victory3: {
    title: "Destroy The Protocol?",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"How can one be so ambivalent toward the Protocol?\" Kaelion Virehart asks. \"You used the Activation Chamber like the rest of us. You've embarked upon this quest like the rest of us, too. Do you surely intend to use the Protocol to evolve... so that you can destroy the Protocol?\"\n\nMitzi shrugged. \"I'd settle for understanding it. It seems to me like no one else is questioning what this thing is. I mean, what does it want? Is it really on our side? If the Silhouette or Protocol Null get me closer to an answer, then that's where I'm heading.\"",
    next: "team_portal_victory4",
  },
  team_portal_victory4: {
    title: "Guilds and Factions",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"You could always join the *Veil Cult*,\" Harla offers. \"They claim to have all the answers.\"\n\nMitzi rolls her eyes.\n\nAkemi turns to you. \"How about you, {{characterName}}. Are there any factions or guilds you have your eye on?\"",
    next: "team_portal_victory5",
  },
  team_portal_victory5: {
    title: "Guild Opinion",
    src: "../assets/forest.webp",
    type: "choice",
    text: "You've thought about this question a lot. Who hasn't? There are few people alive who haven't fantasized about fighting alongside the heroes of the *Global Protocol Authority (GPA)*, or experimenting with the exciting tech of the *Epoch Corporation*.\n\nBut there are plenty of smaller guilds, too. The *Thomur Guild* specializes in niche markets. The *Silk Road* specializes in trade. You know of at least a dozen guilds that most people would kill to be a member of.\n\nThen again, there's a certain coolness factor of remaining freelance, too.\n\nYou realize Akemi is still staring at you, waiting for an answer.",
    choices: [
      { label: "Global Protocol Authority",
        action: "guild_opinion",
        guildName: "Global Protocol Authority",
        opinion: "interested",
        next: "guild_gpa" 
      },
      { label: "The Epoch Corporation",
        action: "guild_opinion",
        guildName: "The Epoch Corporation",
        opinion: "interested",
        next: "guild_epoch" 
      },
      { label: "The Silhouette", 
        action: "guild_opinion",
        guildName: "The Silhouette",
        opinion: "interested",
        next: "guild_silhouette" 
      },
      { label: "Protocol Null", 
        action: "guild_opinion",
        guildName: "Protocol Null",
        opinion: "interested",
        next: "guild_protocol_null" 

      },
      { label: "The Veil Cult", 
        action: "guild_opinion",
        guildName: "The Veil Cult",
        opinion: "interested",
        next: "guild_veil_cult" 

      },
      { label: "The Silk Road", 
        action: "guild_opinion",
        guildName: "The Silk Road",
        opinion: "interested",
        next: "guild_silk_road" 

      },
      { label: "The Thomur Guild", 
        action: "guild_opinion",
        guildName: "The Thomur Guild",
        opinion: "interested",
        next: "guild_thomur_guild" 

      },
      { label: "Freelance", 
        action: "guild_opinion",
        guildName: "Freelance",
        opinion: "interested",
        next: "guild_freelance" 

      },
      { label: "You haven't decided", 
        action: "guild_opinion",
        guildName: "No Preference",
        opinion: "interested",
        next: "guild_no_preference" 

      },
    ],
  },
  guild_gpa: {
    title: "Global Protocol Authority",
    type: "text",
    src: "../assets/forest.webp",
    text: "You shrug. \"The GPA, probably. There's a global element there, and they tend to get priority with breaks.\" You pause before adding, \"Plus, they're the closest thing we have to what existed before the gates.\"\n\n\"That's understandable,\" Akemi says. \"The Ramsey Academy pushed most of us to go that way, too. It makes sense, seeing as they fund the place and everything.\" With a wink, she adds, \"You'd fit in nicely there; they always get the cutest breakers.\"\n\nYou're not sure if she's joking, but you chuckle just to be safe.",
    next: "keep_moving",
  },
  guild_epoch: {
    title: "Epoch Corporation",
    type: "text",
    src: "../assets/forest.webp",
    text: "\"Probably the Epoch Corporation,\" you say, thinking of the countless advancements they have given the world since their inception.\n\nAkemi opens her mouth to respond, but Ronin beats her to it.\n\n\"Ha! Like E-Corp would want anything to do with you! They worship ingenuity and originality above all else. What would they want with someone as morally bankrupt as you!\"\n\n\"What's he talking about?\" Akemi asks.\n\nYou notice Harla leaning in, too, anxious for potential drama. The others look on, even though they've clearly heard the slight. You're not sure what Ronin is talking about, but you remember that he also wanted to join the Epoch Corporation.\n\nIs he worried you might keep him from that goal?",
    next: "keep_moving",
  },
  guild_silhouette: {
    title: "The Silhouette",
    type: "text",
    src: "../assets/forest.webp",
    text: "You look at Mitzi, who is using a purple stick to make the dead creature smile. You say, \"I want to join the Silhouette, actually.\"\n\n\"A bad boy, huh?\" Akemi is smiling, but you sense genuine interest behind her words. She also seems a little disappointed. \"I guess you don't intend to stick around then.\"\n\nYou shrug. In truth, you hadn't really thought that far ahead. Your priority is to the people back home-- Cale, Crixon, Ryke.\n\nYour siblings need you to come through for them, and being accepted into any guild or any faction would come with an impressive salary. That included the *Silhouette*, even though the group is often seen as dangerous by those outside it.\n\nUntil now, you hadn't imagined what actual membership would look like. Neither Blackspire nor Halcyon Refract-- where they are strongest-- is close to home.",
    next: "keep_moving",
  },
  guild_protocol_null: {
    title: "Protocol Null",
    type: "text",
    src: "../assets/forest.webp",
    text: "You whisper the motto of the most interesting faction there is.\n\n\"Unlink yourself.\"\n\nAkemi's eyes go wide. \"Protocol Null? For real?\"\n\nYou shrug, trying to play it cool. \"Yeah, they just feel like the most serious option. Everyone else is content with playing the game; Protocol Null is the only group interested in transcending it.\"\n\n\"Why are you and Mitzi here, then?\" she asks. \"If you don't trust the gates or the Protocol, why risk your lives?\"\n\n\"It's the easiest way to get stronger. How else can we level up enough to catch Protocol Null's attention?\"\n\nAkemi studies you, and you study her back. Could she be interested in joining Protocol Null one day, too?\n\n\"We should talk about it sometime,\" she says at last.",
    next: "keep_moving",
  },
  guild_veil_cult: {
    title: "The Veil Cult",
    type: "text",
    src: "../assets/forest.webp",
    text: "To admit interest in the Veil Cult could make you a target of ridicule for most people. Akemi doesn't seem like the judgmental sort, though.\n\n\"I... think these gates are the most beautiful thing to ever grace humanity.\" You look around, taking this world in again. \"It's...*divine*, even.\"\n\n\"Yeah, I...Oh!\" Akemi grasps your meaning and stumbles through a response. \"I actually haven't, uh, met any members of the...\" she pauses. \"Is it offensive to use the name? I mean, do *you*--\"\n\n\"They call themselves the Scribes,\" you say, smiling. \"But, honestly, I haven't even met any of them yet. Maybe one day, though.\"\n\n \"That's fascinating. I think a lot of people find divinity in the gates and the Protocol; I wish they talked about it more.\"\n\n\"Yes!\" you exclaim. That was your thought exactly.\n\n*She gets it.*",
    next: "keep_moving",
  },
  guild_silk_road: {
    title: "The Silk Road",
    type: "text",
    src: "../assets/forest.webp",
    text: "\"I'm thinking the Silk Road, actually.\"\n\nOf all the guilds, the Silk Road is, by far, the wealthiest. If they recruited you, Cale, Crixon, and Ryke wouldn't want for a single thing again. Your siblings would suddenly have every opportunity in the world.\n\nWith the Silk Road, Cale might even get the help he needs.\n\n\"That's cool!\" Akemi exclaims. \"We had a few members of the Silk Road come speak to us at the Ramsey Academy. They seemed really strong. Cool uniforms, too.\"",
    next: "keep_moving",
  },
  guild_thomur_guild: {
    title: "The Thomur Guild",
    type: "choice",
    src: "../assets/forest.webp",
    text: "\"I think Sheemie has the right idea. I'd love to get into a guild that isn't established yet. Grow with it, ya know?\"\n\nAkemi's eyes flash with understanding. In a measured tone, she asks, \"Is it the Thomur Guild specifically, or just the prospect of getting in on the ground floor of 'the next big thing?'\"",
    choices: [
      { label: "Thomur", next: "thomur_choice" },
      { label: "Anything new, if it has promise", next: "anything_new_choice" },
    ],
  },
  thomur_choice: {
    title: "Thomur",
    type: "text",
    src: "../assets/forest.webp",
    text: "\"Probably Thomur,\" you reply. \"Their rise to prominence  this year has been inspiring. I really think they might be a top-five guild one day.\"\n\n\"Boo!\" Akemi says with a playful pout. \"And here I was about to invite you into the one I'll be starting.\"\n\nYou perk up at this. Starting one's own guild is probably even harder than being a breaker.",
    next: "keep_moving",
  },
  anything_new_choice: {
    title: "Anything New",
    type: "text",
    src: "../assets/forest.webp",
    text: "\"I'm willing to consider anything I feel has promise,\" you reply. \"Though... I have a long way to go before I'll need to think about it.\"\n\n \"I plan to start a guild of my own once I'm strong enough. Maybe you can be my first member.\" She winks. \"*If* you see promise in it.\"",
    next: "keep_moving",
  },
  guild_freelance: {
    title: "Freelance",
    src: "../assets/forest.webp",
    type: "text",
    text: "\"I'm freelance all the way.\"\n\nAkemi laughs. \"I figured as much based on how you approached today's gate. Plenty of breakers have made a name for themselves by going freelance. Who knows, maybe you'll  be one of them!\"\n\nYou doubt it, but appreciate the positivity. In truth, joining a guild always felt like a pipe dream. One has to be C-Class just to apply, and even then, it doesn't guarantee anything.\n\n\"Maybe,\" you say instead, feigning her same positivity.\n\n\"Well, if you ever decide not to do this solo, keep me in mind. It won't be for a while yet, but I plan to start my own guild one day.\"\n\nYou perk up at this. Starting one's own guild is probably harder than being a successful freelancer.\n\n\"Did you have a name in mind?\" you ask.\n\nBefore Akemi can respond, a stern voice calls out from ahead of you.",
    next: "keep_moving",
  },  
  guild_no_preference: {
    title: "No Preference",
    src: "../assets/forest.webp",
    type: "text",
    text: "You give an exaggerated shrug. \"My priority right now is staying alive. I'll worry about the next step when I'm ready to leave this one.\"\n\nAkemi laughs, and a part of you thinks you'd like to hear more of that sound. The other part can't figure out whether or not she's making fun of you.\n\n\"You're either brave or crazy,\" she says at last. \"I can't imagine entering one of these things without knowing the Protocol had my back.\" She pauses to look at Aleth. \"He isn't activated, either.",
    next: "guild_no_preference2",
  },
  guild_no_preference2: {
    title: "No Preference",
    type: "text",
    src: "../assets/forest.webp",
    text: "You do know most people never activate, right?\" Harla says, clear eavesdropping. \"You're subjecting yourself to more danger than the rest of us by being here. We at least know Aleth can take care of himself.\n\nYou remain silent. Cale, Crixon, and Ryke need you to succeed. For the sake of your siblings, the risks are worth it.\n\n\"Well,\" Akemi says after flashing Harla a death stare, \"when you activate, I'd love to tell you about the guild I plan to start. Maybe you can be the first member!\"\n\nBefore you can ask about it, a stern voice calls out from ahead of you.",
    next: "keep_moving",
  },
  keep_moving: {
    title: "Keep Moving",
    type: "text",
    src: "../assets/forest.webp",
    text: "\"We need to keep moving,\" Threx says. He's already several paces ahead of the group.\n\nTogether, you enter the alien forest, and the big picture of the place disappears beneath the purple tree-things.",
    next: "alien_forest",
  },
  alien_forest: {
    title: "Alien Forest",
    src: "../assets/deeper.webp",
    type: "choice",
    text: "They smell like sour milk and groan against an invisible breeze. Their tubes resemble scales more than bark, and intricate patterns cover their surfaces in natural hieroglyphics. No two are alike.",
    choices: [
      { label: "Inspect the carvings", next: "tree_inspect" },
      { label: "Keep moving", next: "forest_keep_moving" },
    ],
  },
  forest_keep_moving: {
    title: "Keep Moving",
    type: "roll",
    src: "../assets/deeper.webp",
    text: "This place is dangerous. It's more important to keep an eye open for threats than to admire the scenery.",
    roll: {
      stat: "Thought",
      dc: 14,
      successText: "You pull your eyes from the carvings and take in the forest beyond the trees. There is a layout to the woods themselves, as though it's been painstakingly designed.Following the converging lines of the purple tree-things, you notice a shimmer in the distance.\n\nIt's only there for a moment, then it disappears.",
      failText: "This place is strange, but it doesn't feel threatening. You look for movement beyond the trees, but find nothing.\n\n\"Have you ever told us which guild you'd be interested in?\" Akemi asks Aleth.\n\nHis answer comes quickly.\n\n\"Freelance. Especially if I don't activate. The Ramsey Academy credentials are just to get me access to more gates.\"",
      nextSuccess: "moving_success",
      nextFail: "forest_deeper_together",
    },
  },
  moving_success: {
    title: "Keep Moving Success",
    type: "choice",
    src: "../assets/deeper.webp",
    text: "\"Have you ever told us which guild you'd be interested in?\" Akemi asks Aleth.\n\nHis answer comes quickly.\n\n\"Freelance. Especially if I don't activate. The Ramsey Academy credentials are just to get me access to more gates.\"",
    choices: [
      { label: "Warn the group about the shimmer", next: "warn_shimmer" }, 
      { label: "Keep it to yourself and keep your guard up", next: "keep_guard" },]
  },
  warn_shimmer: {
    title: "Warn The Group",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"I saw something moving behind us,\" you report.\n\nThe group stops.\n\n\"Where?\" Threx asks.\n\nYou point to your rear and describe the shimmering.\n\n\"He's always been skittish,\" Ronin teases. \"It was probably just a tree or an eye floater or something.\"\n\nThrex looks at you a moment longer.",
    //conditional. if failed previous encounters, move onto a page. if succeeded, move to another page. if succeeded and either told the team about ronin's name, or entered the portal alone go to another page
    conditionalNext: [
      {
        // First check: Failed previous encounters
        conditions: [
          { type: 'failure' }
        ],
        next: 'warn_shimmer_failed' // Page for failed encounters
      },
      {
        // Second check: Succeeded AND (told team about Ronin OR went alone)
        conditions: [
          { type: 'did_not_fail' },
          { type: 'told_team_or_went_alone' }
        ],
        next: 'warn_shimmer_success_warned' // Page for success + warned/alone
      },
      {
        // Third check: Succeeded but didn't warn/go alone
        conditions: [
          { type: 'did_not_fail' }
        ],
        next: 'warn_shimmer_success' // Page for basic success
      }
    ],
    next: "warn_shimmer_success" // Fallback
  },
  warn_shimmer_failed: {
    title: "Failed to Warn",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"The lightsource in this place is different from what you're used to.\" He says at last. \"You're probably just jumping at your own shadow.\"\n\nRonin chortles. \"Ha! Maybe you can take up the rear though, just in case.\"\n\nThe rest of the group exchanges a quick laugh, except for Akemi, who looks at you with pity.\n\nAs you continue moving, Aleth joins you at the rear.\n\n\"I feel it too. Something isn't right.\"",
    next: "forest_deeper_together"
  },
  warn_shimmer_success_warned: {
    title: "Tighten Up",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"Everyone, tighten up. Aleth, cover our rear with {{characterName}}. Roland, I want you and Akemi on the right flank. Mitzi, you and Ronin take the left.\"",
    next: "forest_encounter_prepare2"
  },
  warn_shimmer_success: {
    title: "Tighten Up",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"Everyone, tighten up. Aleth, cover our rear with {{characterName}}. Roland, I want you and Akemi on the right flank. Mitzi, you and,\" he pauses when he looks at Ronin, \"*this* guy take the left.\"\n\n\"Ronin,\" your old friend whispers. \"My name is Ronin.\"",
    next: "forest_encounter_prepare2"
  },
  keep_guard: {
    title: "Keep Your Guard Up",
    type: "text",
    src: "../assets/deeper.webp",
    text: "The others already think you're a weak link for not attending the academy with them. You don't want them to think you're scared of every eye floater or shifting tree-thing.",
    next: "forest_deeper_together",
  },
  moving_fail: {
    title: "Keep Moving Fail",
    type: "text",
    action: "failure",
    src: "../assets/deeper.webp",
    text: "The others already think you're a weak link for not attending the academy with them. You don't want them to think you're scared of every eye floater or shifting tree-thing.",
    next: "inspect_fail",
  },
  tree_inspect: {
    title: "Inspect the Carvings",
    type: "roll",
    src: "../assets/carving.webp",
    text: "You take a moment to admire them. They are deep and no wider than the width of your pinky. Did a creature create these, or are they beautifully natural, like snowflakes? ",
    roll: {
      stat: "Thought",
      dc: 14,
      successText: "You peer closer, and the pattern beneath the patterns assembles itself. Though each carving is different from the rest, you recognize a distinction between groups of them.\n\nThere are many with curved edges. These are the tree-things.\n\nThere are several longer, squigly ones. These are the streams.\n\nThere are a few jagged ones. You're not sure what they are, but most are congregated in two locations across these various tapestries.\n\nMovement catches your eye amongst a grouping of eight small dots. Seven of them are... moving.",
      failText: "It's difficult to tell.\n\nYou stare at the carvings a moment longer, admiring their beauty before continuing on.",
      nextSuccess: "inspect_success",
      nextFail: "inspect_fail",
    },
  },
  inspect_fail: {
    title: "Inspect Fail",
    type: "text",
    action: "failure",
    src: "../assets/carving.webp",
    text: "\"Have you ever told us which guild you'd be interested in?\" Akemi asks Aleth.\n\nHis answer comes quickly.\n\n\"Freelance. Especially if I don't activate. The Ramsey Academy credentials are just to get me access to more gates.\"",
    next: "forest_deeper_together",
  },
  forest_deeper_together: {
    title: "Deeper In The Forest",
    type: "text",
    src: "../assets/ridge.webp",
    text: "Threx leads you deeper into the forest, following a wide and well-defined footpath.\n\n\"It's weird nothing else has tried to kill us,\" Mitzi says.\n\n The party leader nods. \"I agree. This place isn't very large, and we definitely stand out against all the purple.\"\n\n\"I hate purple.\"\n\n\"You hate everything.\"\n\nMitzi smirks. \"True.\"\n\nAt last, the path leads into a clearing. For the first time since entering the gate, you see a color other than purple.\n\n\"It's beautiful!\" Akemi exclaims. Others echo the same sentiment, and you have to agree.\n\nThe yellow pattern is comprised of neither rock nor flower, yet, the material carries properties of both. It smells better than the trees, too. Instead of sour milk, the clearing smells almost like lilacs and chocolate.",
    next: "forest_clearing",
  },
  forest_clearing: {
    title: "Forest Clearing",
    src: "../assets/ridge.webp",
    type: "text",
    text: "You feel mollified. Content. You're not worrying about your family, or your need to prove yourself, or even how dangerous this world may be. For a moment, there is only this moment.\n\n\"It's like something out of a fantasy,\" Mitzi says, smiling. \"I... don't hate this.\"\n\nUnfortunately, reality returns all too quickly.\n\nTwelve creatures emerge from the underbrush and charge you and your companions.\n\nThe beasts of this world are cotton candy colored, just like the trees, and are larger than the one you faced near the gate.\n\n\"Shit!\" Threx yells, drawing his warhammer. \"We walked right into an ambush! Everyone, form up on me!\"",
    next: "forest_clearing_encounter",
  },
  forest_clearing_encounter: {
    title: "Forest Clearing Encounter",
    src: "../assets/critters.webp",
    type: "battle",
    enemies: {
      count: 12,
      template: {
        name: "Cotton Candy Beast",
        maxHP: 10,
        ac: 12,
        attack: 3,
        magic: 3,
        bp: 3
      }
    },
    allies: ["Ronin", "Threx", "Akemi", "Mitzi", "Kaelion", "Aleth", "Harla", "Sheemie"], 
    action: "removed_minions",
    text: "",
    fail: "forest_clearing_encounter_fail",
    next: "forest_encounter_success",
  },
  forest_clearing_encounter_fail: {
    title: "Forest Encounter Defeat",
    type: "text",
    action: "failure",
    useCustomBackground: true,
    text: "The viciousness of these things is too much for you to handle. Their sharp teeth tear into your flesh, and their muscular necks rag you back and forth. Your arm is disabled first, then a leg. Chunks are ripped from you, and the world goes from purple to red.\n\nYou scream, but blood fills your throat.\n\nYou feel a powerful set of jaws close around your neck.\n\nThis is it.\n\nThe jaws close, and the red goes to black.",
    next: "forest_clearing_encounter_fail2",
  },
  forest_clearing_encounter_fail2: {
    title: "---",
    type: "text",
    useCustomBackground: true,
    customBackgroundComponent: "LightRays",
    text: "\"Go back,\" a voice says. \"I'm not ready for you yet.\"",
    next: "forest_clearing_encounter_fail3",
  },
  forest_clearing_encounter_fail3: {
    title: "!!!",
    type: "text",
    src: "../assets/critters.webp",
    hpModification: {
      type: 'add',
      amount: 20,
      message: "You are brought back to life.",
    },
    text: "You scream and realize your vocal cords are once again intact. You grasp your throat; the flesh has regrown.",
    next: "forest_clearing_encounter_fail4",
  },
  forest_clearing_encounter_fail4: {
    title: "Revived",
    type: "text",
    src: "../assets/critters.webp",
    text: "\"You're okay,\" Harla whispers.\n\nDead beasts litter the ground around you, and your companions appear battered but standing.\n\n\"Can't believe you went down,\" Ronin huffs. His armor and mechanical knife are covered in viscera.\n\n\"Don't feel bad,\" Sheemi offers, nursing his arm. \"Mitzi and I got injured, too. That's why we have such a great healer!\"\n\nHarla shrugs. \"I am pretty great, aren't I?\"\n\n\"Sheemie,\" Threx says. \"Is the gate stabilizer still intact after that hit you took?\"\n\nAlready back to full strength, the plant aficionado pulls a grey sphere from his robe. The Epoch Corporation logo is clearly visible across it.",
    next: "gate_stabilizer_check",
  },
  inspect_success: {
    title: "Inspect Success",
    type: "choice",
    src: "../assets/carving.webp",
    text: "Oblivious, the rest of the group trudges on. You see their movements echoed on the maps.\n\n\"Have you ever told us which guild you'd be interested in?\" Akemi asks Aleth.\n\nYou watch the carvings. If you continue the way Threx is leading, you will walk into an area surrounded by the jagged symbols.\n\nAleth's answer comes quickly.\n\n\"Freelance. Especially if I don't activate. The Ramsey Academy credentials are just to get me access to more gates.\"\n\n\"We're walking into an ambush,\" you whisper.",
    choices: [
      { label: "Warn the others", next: "alert_team" }, 
      { label: "Keep it to yourself", next: "keep_to_yourself" },]
  },
  alert_team: {
    title: "Alert The Team",
    type: "text",
    src: "../assets/carving.webp",
    text: "\"Hold up,\" you tell the others. \"We can learn something from the trees. I... think we're walking into an ambush.\"\n\nRonin snorts in derision. To you, he whispers, \"Maybe you and the plant weirdo can join the Thomur Guild together.\"\n\nThrex doubles back to reach you. \"This better be good, {{characterName}}. We can't afford to waste any more time here.\"\n\n\"No, he's definitely onto something.\" Aleth stands near a tree of his own now, looking over the symbols. \"I think this is a map.\" \n\nAfter a moment to see for himself, the party leader nods.\n\n\"There's a symbol on this tree that looks different from all the others,\" Threx says. \"That must be the being the portal is tied to.\"",
    next: "alert_team2",
  },
  alert_team2: {
    title: "Alert The Team",
    type: "choice",
    src: "../assets/carving.webp",
    text: "\"We could skip all its minions and head right for it,\" Harla offers. \"I bet all those squiggles around it are its horde.\"\n\n\"And then what?\" Kaelion Virehart retorts. \"We must dispense with the minions so the mining crew has sanctuary for their work.\"\n\n\"The minions will have less cause to fight if we slay their leader first,\" Ronin offers. \"Look at how many are up there waiting for us; we could use that to our advantage.\"\n\nAkemi shakes her head. \"Or we can step into the ambush prepared. If we head to the boss first, and it proves powerful enough to stall us, that risks us getting flanked by the minions.\"\n\n\"True,\" Mitzi agrees. \"They'd see us changing course. We have no idea how fast they are, either.\"\n\nThe group looks to Threx for an answer. The C-Class breaker mulls over his options.\n\nNow's your chance to voice your own two cents.",
    choices: [
      { label: "Go after the boss first", next: "head_to_boss" },
      { label: "Clear the minions first", next: "clear_minions" },
      { label: "See what Threx decides", next: "threx_decides" },
    ],
  },
  head_to_boss: {
    title: "Head To The Boss",
    type: "text",
    src: "../assets/carving.webp",
    text: "\"I think we should cut the head off first,\" you venture. \"Better to face it while we're at full strength. The rest will be mop up.\"",
    conditionalNext: [
      {
        // First check: Failed previous encounters
        conditions: [
          { type: 'failure' }
        ],
        next: 'head_to_boss_fail' // Page for failed encounters
      },
      {
        conditions: [
          { type: 'did_not_fail' },
        ],
        next: 'head_to_boss_success' // Page for success
      }
    ],
    next: "head_to_boss_fail" // Fallback
  },
  head_to_boss_fail: {
    title: "Can't convince",
    type: "text",
    src: "../assets/deeper.webp",
    text: "Threx appraises you a moment, then shakes his head.\n\n\"We face the threat we know first, then face what we don't. Mitzi, Akemi, and Kaelion, we're going with your plan.\"",
    next: "warn_shimmer_success_warned"
  },
  head_to_boss_success: {
    title: "Head to boss",
    type: "text",
    src: "../assets/deeper.webp",
    text: "Threx appraies you a moment, then nods.\n\n\"Let's follow the Freelancers' plan. I'll cover the rear in case the minions show up early; the rest of you can face the Tethered-Being together.\"\n\nRonin looks at you and nods. There is too much bad blood between you for this to have meant much, but you feel like it meant something. You *had* been friends once, after all.",
    next: "head_to_boss_success2"
  },
  head_to_boss_success2: {
    title: "Head to boss",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"Sure is, boss! We lodge this thing in the Tethered Being after we kill it, and that portal will be locked open!\"\n\nLike the portal itself, this is the first time you've seen a Gate Stabilizer in person. It's smaller than you imagined, and simpler. Without it, you and your companions would only have ten minutes to exit this place after killing the Tethered Being.\n\nThe alternative was being stuck here forever.",
    next: "head_to_boss_success3"
  },
  head_to_boss_success3: {
    title: "Head to boss",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"Thank God for E-Corp!\" Ronin exclaims. His oscillating knives are built by the same company.\n\nThrex nods. \"Make sure to get that set up right away. If we take the boss down and the minions tie us up, I don't wanna risk getting trapped in here.\"\n\nSheemie returns the nod. \"Yes, sir. You can count on me!\"\n\n\"Good. Now, we need speed and violence if we expect this plan to work. Otherwise, we'll be fighting the Tethered Being *and* its minions at the same time. Let's move.\"",
    next: "head_to_boss_success4"
  },
  head_to_boss_success4: {
    title: "Head to boss",
    type: "text",
    src: "../assets/deeper.webp",
    text: "The C-Class breaker starts jogging toward the location of the Tethered Being. It doesn't take long to reach the lair. The tracks of its minions take you right to it.\n\nIt... isn't what you expected.",
    next: "head_to_boss_success5"
  },
  head_to_boss_success5: {
    title: "Head to boss",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"It's so... gawdy,\" Akemi whispers, scrunching her nose.\n\n\"I think it looks regal!\" Kaelion Virehart argues. \"The creature inside must be a fine specimen!\"\n\n\"I think,\" Aleth says, \"that there is something wrong about this place.\"\n\nYou think he might be right.\n\nThe shack stands in sharp contrast to the surrounding purple. Its walls are tiled with amber, gold, and sapphire. It isn't large, but it holds enough material to justify the gate's golden appearance.",
    next: "head_to_boss_success6"
  },
  head_to_boss_success6: {
    title: "Head to boss",
    type: "text",
    src: "../assets/shack.webp",
    text: "Threx grunts. \"I don't think this place belongs to the creature we're looking for. I... think it's just being kept here... as bait.\"\n\nThere is a faint *hmm* from the porch. When you see the source, you shudder.",
    next: "head_to_boss_success7"
  },
  head_to_boss_success7: {
    title: "Shack",
    type: "choice",
    src: "../assets/shack.webp",
    text: "\"I was hoping to give my pets a snack today,\"  the alien-thing says in a voice like sandpaper, \"but it seems you were keen to meet me first. No matter... They'll be dining on you soon enough.\"\n\nYour companions trade worried glances. Plenty of creatures inside the gates can talk, but none that are E-Class.\n\nOn a tree next to you, the jagged shapes move.\n\nThis thing's *pets* are coming your way.",
    choices: [
      { label: "Speak to the creature", next: "speak_together" },
      { label: "Send a runner back through the gate for help ", next: "send_a_runner" },
      { label: "Remain silent", next: "remain_silent" },
    ],
  },
  speak_together: {
    title: "Speak",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"We thought we'd spare them,\" you say. \"Why go for the limbs when you can go for the head?\"\n\n\"Why, indeed,\" the thing replies. The corner of its mouth twists into a smile.",
    next: "speak_to_creature2"
  },
  clear_minions: {
    title: "Clear The Minions",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"I agree with Kaelion and Mitzi,\" you say. \"Better to face what we know before facing what we don't.\"",
    next: "warn_shimmer_success_warned",
  },
  threx_decides: {
    title: "Threx Decides",
    type: "text",
    src: "../assets/deeper.webp",
    text: "After taking a moment to reflect, Threx says, \"I agree with Mitzi and Ronin. We already know we can face the minions easily enough; better to do it early.\"",
    next: "warn_shimmer_success_warned",
  },
  forest_encounter_prepare: {
    title: "Forest Encounter Preparation",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"Everyone, tighten up. Aleth, cover our rear with {{characterName}}. Roland, I want you and Akemi on the right flank. Mitzi, you and Ronin take the left.\"",
    next: "forest_encounter_prepare2",
  },
  forest_encounter_prepare2: {
    title: "Forest Encounter Preparation",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"Harla, you're in the center. Keep an eye open for whoever might need healing.\" The C-Class breaker draws his warhammer. \"And I'll strike down anything stupid enough to come at us head-on.\"\n\nThe forest is silent in the wake of this formation, sans the occasional groan of a tree-thing.\n\n\"I told you so,\" Ronin offers meekly. \"{{characterName}} is afraid of his own shadow.\"\n\nThrex ignores him. \"We're moving. Keep your guard up.\"",
    next: "forest_encounter_prepare3",
  },
  forest_encounter_prepare3: {
    title: "Forest Encounter Preparation",
    type: "text",
    src: "../assets/ridge.webp",
    text: "He leads you through the forest. There's a wide and well-defined footpath next to you, but he takes you along a slight ridge running parallel to it instead. Eventually, the path leads into a clearing that would have been ideal for an ambush. Instead, when the creatures inevitably come, the ridge protects your flank.\n\n\"Good call, freelancer,\" Threx yells as the horde of creatures screams your way. \"We would have been surrounded if you hadn't said something.\"\n\nThe beasts of this world are cotton candy colored, just like the trees, and are larger than the one you faced near the gate.\n\n\"Reverse phalanx!\" Threx commands.",
    next: "forest_encounter_prepare4",
  },
  forest_encounter_prepare4: {
    title: "Forest Encounter Preparation",
    type: "text",
    src: "../assets/ridge.webp",
    text: "The graduates of the Ramsey Academy loosen their grouping and quickly form a reverse V. You and Ronin trade a confused glance, then form up where there's room.\n\nThe creatures are funneled to the group's strongest member. Threx bats three of them aside with ease.\n\nRealizing their mistake too late, the beasts panic. With the deadliest threat at their front and more of their ilk pushing at their rear, they desperately lash out wherever they can.\n\nTwo come after you.",
    next: "forest_prepare_encounter",
  },
    forest_prepare_encounter: {
    title: "Forest Encounter",
    src: "../assets/critters.webp",
    type: "battle",
    enemies: {
      count: 2,
      template: {
        name: "Cotton Candy Beast",
        maxHP: 10,
        ac: 12,
        attack: 3,
        magic: 3,
        bp: 3
      }
    },
    text: "",
    action: "removed_minions",
    fail: "forest_encounter_fail",
    next: "forest_prepare_encounter_success",
  },
  forest_prepare_encounter_success: {
    title: "Forest Encounter Success",
    type: "text",
    src: "../assets/critters.webp",
    text: "Both beasts fall into pieces. Around you, the rest are similarly dispatched. Sheemie and Mitzi are injured, but Harla quickly sets them right with her healing magic. The healer also has one or two new dents in her armor.\n\n\"Good call, {{characterName}},\" Threx says again. \"One of us could have gone down if these things had ambushed us.\"",
    next: "threx_sweat",
  },
  keep_to_yourself: {
    title: "Keep It To Yourself",
    type: "text",
    src: "../assets/deeper.webp",
    text: "Most of your companions are graduates of the prestigious Ramsey Academy. Surely they can take care of themselves.\n\nWhen you arrive at the clearing, you see a color other than purple. The yellow pattern is comprised of neither rock nor flower, yet, the material carries properties of both. It smells better than the trees, too. Instead of sour milk, the clearing smells almost like lilacs and chocolate.\n\n\"It's beautiful!\" Akemi exclaims. Others echo the same sentiment.\n\nYou don't have time to marvel at the scenery. Your attackers are already moving, using the breathtaking sight to mask their movements. You decapitate one yellow flower, then another.\n\n\"What are you doing!?\" Harla cries.",
    next: "keep_to_yourself2",
  },
  keep_to_yourself2: {
    title: "Keep It To Yourself",
    type: "text",
    src: "../assets/critters.webp",
    text: "Two geysers of blood answer her as the creatures beneath the flowers howl in anguish. Already, two of your enemies are out of the fight.\n\nTen more creatures emerge from the underbrush and charge you and your companions.\n\nThe beasts of this world are cotton candy colored, just like the trees, and are larger than the one you faced near the gate.\n\n\"Shit!\" Threx yells, drawing his warhammer. \"We walked right into an ambush! Everyone, form up on me!\"\n\nYou smile, already charging into the fight. While the others take their time to regroup, you prepare to add more notches to your belt.\n\nThe Protocol will *have* to activate you after today.",
    next: "forest_encounter",
  },
  forest_encounter: {
    title: "Forest Encounter",
    src: "../assets/critters.webp",
    type: "battle",
    enemies: {
      count: 10,
      template: {
        name: "Cotton Candy Beast",
        maxHP: 10,
        ac: 12,
        attack: 3,
        magic: 3,
        bp: 3
      }
    },
    action: "removed_minions",
    allies: ["Ronin", "Threx", "Akemi", "Mitzi", "Kaelion", "Aleth", "Harla", "Sheemie"], 
    text: "",
    fail: "forest_encounter_fail",
    next: "forest_encounter_success",
  },
  forest_encounter_fail: {
    title: "Forest Encounter Defeat",
    type: "text",
    action: "failure",
    useCustomBackground: true,
    text: "The viciousness of these things is too much for you to handle. Their sharp teeth tear into your flesh, and their muscular necks ragdoll you back and forth. Your arm is disabled first, then a leg. Chunks are ripped from you, and the world goes from purple to red.\n\nYou scream, but blood fills your throat.\n\nYou feel a powerful set of jaws close around your neck.\n\nThis is it.\n\nThe jaws close, and the red goes to black.",
    next: "forest_encounter_fail2",
  },
  forest_encounter_fail2: {
    title: "---",
    type: "text",
    useCustomBackground: true,
    customBackgroundComponent: "LightRays",
    text: "\"Go back,\" a soft voice tells you. It sounds so familiar. \"I'm not ready for you yet.\"",
    next: "forest_encounter_fail3",
  },
  forest_encounter_fail3: {
    title: "!!!",
    type: "text",
    src: "../assets/critters.webp",
    hpModification: {
      type: 'add',
      amount: 20,
      message: "You are brought back to life.",
    },
    text: "You scream and realize your vocal cords are once again intact. You grasp your throat; the flesh has regrown.",
    next: "forest_encounter_fail4",
  },
  forest_encounter_fail4: {
    title: "Revieved",
    type: "text",
    src: "../assets/critters.webp",
    text: "\"You're okay,\" Harla whispers.\n\nDead beasts litter the ground around you, and your companions appear battered but standing.\n\n\"Can't believe you went down,\" Ronin huffs. His armor and mechanical knife are covered in viscera.\n\n\"Don't feel bad,\" Sheemi offers, nursing his arm. \"Mitzi and I got injured, too. That's why we have such a great healer!\"\n\nHarla shrugs. \"I am pretty great, aren't I?\"\n\nA strong hand grabs your shoulder.\n\n\"You did good with that warning,\" Threx says. \"We would have lost more people if we had walked into that ambush. Maybe permanently.\"",
    next: "threx_sweat",
  },
  threx_sweat: {
    title: "Agreed",
    type: "text",
    src: "../assets/critters.webp",
    text: "You nod. Though that may have been true, you know Threx would have done just fine.\n\nHe hasn't even broken a sweat.",
    next: "forest_encounter_success2",
  },
  forest_encounter_success: {
    title: "Forest Encounter Success",
    type: "text",
    src: "../assets/critters.webp",
    text: "The final beast collapses at your feet.\n\n\"That... sucked,\" Ronin pants while cleaning off his mechanical knife.\n\nBehind him, Harla regrows the flesh on Mitzi's arm and resets Sheemie's broken leg. The healer also has one or two new dents in her armor.",
    next: "forest_encounter_success2",
  },
  forest_encounter_success2: {
    title: "Forest Encounter Success",
    type: "text",
    src: "../assets/critters.webp",
    text: "\"Haza!\" Kaelion exclaims. \"We have bested the beasts! Surely they've just thrown everything they had at us?\"\n\nAleth nudges one of the dead creatures with his foot. Like Threx, he doesn't even seem winded. \"None of these feels like their leader.\"\n\n\"Aleth's right,\" Akemi says. \"I haven't gotten any messages from the Protocol that the gate's losing stability. Has anyone else?\"\n\nThe rest of the group consults their augmented-reality displays, then shakes their heads. You hold off on checking your handheld digital reader. It would only remind the others that you haven't actually been activated yet.\n\nRonin wipes off his blade. \"Well, we already killed its bodyguards. Finding their trail home shouldn't be too difficult.\"\n\nThrex nods. \"Sheemie, is the Gate Stabilizer still intact after that skirmish?\"\n\nThe plant aficionado pulls a gray sphere from his robe. The Epoch Corporation logo is clearly visible across it.",
    next: "gate_stabilizer_check",
  },
  gate_stabilizer_check: {
    title: "Gate Stabilizer Check",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"Sure is, boss! We lodge this thing in the Tethered Being after we kill it, and that portal will be locked open!\"\n\nLike the portal itself, this is the first time you've seen a Gate Stabilizer in person. It's smaller than you imagined, and simpler. Without it, you and your companions would only have ten minutes to exit this place after killing the Tethered Being.\n\nThe alternative was being stuck here forever.\n\n\"Thank God for E-Corp!\" Ronin exclaims. His oscillating knives are built by the same company.\n\nSheemie puts the Gate Stabilizer away. \"I'm excited to stick around a bit after we clear this place,\" he says, inspecting a nearby tree. \"I'd love some time to inspect these carvings.\"\n\nMitzi sighs and whispers, \"Tree guy.\"",
    next: "gate_stabilizer_check2",
  },
  gate_stabilizer_check2: {
    title: "Gate Stabilizer Check",
    type: "text",
    src: "../assets/deeper.webp",
    text: "\"*After,*\" Threx says, already following the most well-defined path of the creatures. \"We can't afford to let our guards down yet.\"\n\nIt doesn't take long to reach the lair of the gate's Tethered Being. The tracks of your former attackers take you along the path of least resistance.\n\n\"It's so... gawdy,\" Akemi whispers, scrunching her nose.\n\n\"I think it looks regal!\" Kaelion Virehart argues. \"The creature inside must be a fine specimen!\"\n\n\"I think,\" Aleth says, \"that there is something wrong about this place.\"\n\nYou think he might be right.",
    next: "forest_shack",
  },
  forest_shack: {
    title: "Forest Shack",
    type: "choice",
    src: "../assets/shack.webp",
    text: "The shack stands in sharp contrast to the surrounding purple. Its walls are tiled with amber, gold, and sapphire. It isn't large, but it holds enough material to justify the gate's golden appearance.\n\nThrex grunts. \"I don't think this place belongs to the creature we're looking for. I... think it's just being kept here... as bait.\"\n\nThere is a faint *tsk tsk tsk* comes from the porch. When you see the source, you shudder.\n\n\"You killed my pets,\" the alien-thing says in a voice like sandpaper.\n\nYour companions trade worried glances. Plenty of creatures inside of gates can talk, but none that are E-Class.",
    choices: [
      { label: "Speak to the creature", next: "speak_to_creature" },
      { label: "Send a runner back through the gate for help", next: "send_a_runner" },
      { label: "Remain silent", next: "remain_silent" },
    ],
  },
  remain_silent: {
    title: "Remain Silent",
    type: "text",
    src: "../assets/shack.webp",
    text: "You keep quiet, unsure how to talk to Tethered Beings.\n\n\"Kaelion,\" Threx hisses, \"down your armor and get back to the gate. Tell the GPA that our Tethered Being is a Camper.\"\n\n\"Yessir!\" the wannabee knight yells, dropping his chest plate.\n\n\"The rest of you,\" Threx takes a step forward and angles his warhammer sideways, \"get behind me.\"\n\n\"We have a better chance fighting this thing together!\" Ronin protests. \"I--\"\n\n\"Now!\"\n\nThe C-Class breaker reveals his full strength for the first time. It dwarfs the rest of you. Ronin stops arguing and files behind Threx with you and the others. Behind all of you, Kaelion drops the last of his armor and begins his sprint to the exit.",
    next: "camper_hunt",
  },
  camper_hunt: {
    title: "Camper Hunt",
    src: "../assets/shack.webp",
    type: "text",
    text: "\"Good,\" the Camper rasps. \"I was hoping for lively sport today.\"\n\nThere's a blur across the porch, and the creature is suddenly standing at the top of the stairs.\n\nYou see it in its full glory now... and shudder.\n\nThe thing is a head taller than Threx and sports golden armor that is one part duster and one part hooded cloak. A black katana hangs from its hip. Its mouth is curled into a permanent snarl, and its shiny pink skin gives it the appearance of a burn victim.\n\nAnd the scars... There are too many to count.\n\nWorst of all is the *other* thing it's wearing. Fresh blood coats the creature like a crimson robe. It drips onto the decadent porch, adding faux-ruby to the amber, gold, and sapphire.\n\n\"Kael!\" Harla screams.\n\nThe knight collapses into chunks of butchered meat. He doesn't even have time to scream.",
    //if they haven't cleared out the previous minions, there is another page before the battle
    conditionalNext: [
      {
        conditions: [
          { type: 'removed_minions' }
        ],
        next: 'camper_hunt2'
      }
    ],
    next: "camper_hunt_not_removed"
  },
  camper_hunt_not_removed: {
    title: "Camper Hunt",
    src: "../assets/shack.webp",
    type: "text",
    text: "Red eyes stare out from the surrounding tree-things. The Tethered Being's pets have arrived. You sense their hunger and realize they intend to eat your fallen companion.\n\n*Us too,* you realize, *if we fail.*",
    next: "camper_hunt2",
  },
  camper_hunt2: {
    title: "Camper Hunt",
    src: "../assets/shack.webp",
    type: "text",
    text: "\"H-how...\" Ronin stammers.\n\n\"Impossible! Akemi adds. \"K-Kaelion was a hundred feet away, and that happened in the blink of an eye. Nothing is that fast!\"\n\nAleth grunts and nods at your blood-soaked host. \"*He* is.\"\n\nThe Camper smiles through black and jagged teeth.\n\n\"Now comes my favorite part!\"",
    next: "camper_together_battle_kael",
  },
  camper_together_battle_kael: {
    title: "Camper Battle",
    src: "../assets/shack.webp",
    type: "battle",
    enemies: {
      count: 1,
      template: {
        name: "Camper",
        maxHP: 1000,
        ac: 18,
        attack: 5,
        magic: 5,
        bp: 50
      }
    },
    allies: ["Ronin", "Threx", "Akemi", "Mitzi", "Aleth", "Harla", "Sheemie"], 
    text: "",
    fail: "camper_together_after_kael",
    next: "camper_together_after_kael"
  },
  camper_together_after_kael: {
    title: "Camper Battle",
    src: "../assets/shack.webp",
    type: "text",
    text: "Your team is massacred.\n\nYou look around and see Threx torn to shreds.\n\nHarla is crushed inside of her dented armor.\n\nMitzi has been decapitated.\n\nRonin has lost his right arm.\n\nSheemie is impaled on a nearby tree.\n\nAkemi's legs are shattered.\n\nAleth is ragdolled, thrown a hundred feet away.",
    next: "camper_together_after"
  },
  send_a_runner: {
    title: "Send A Runner",
    src: "../assets/shack.webp",
    type: "text",
    text: "\"Mitzi,\" you whisper. \"Run back to the gate and get us some help. Aleth is right; something about this feels off.\"\n\nThe woman blinks at you. \"Excuse me? If you're so worried about it, why don't you go? I'm here to get stronger. I can't do that if I'm running away, can I?\"\n\n\"Mitzi,\" Threx hisses. \"Do what he's telling you. Inform the GPA that our Tethered Being is a Camper.\"\n\n\"A what?\" Mitzi is incredulous. \"No way! I'm not going anywhere.\"\n\n\"Now!\"",
    next: "send_a_runner2",
  },
  send_a_runner2: {
    title: "Send A Runner",
    src: "../assets/shack.webp",
    type: "text",
    text: "The C-Class breaker reveals his full strength for the first time. It dwarfs the rest of you. Mitzi stops arguing and spins around. She's moving at a full sprint before the creature speaks again.\n\n\"Good,\" it rasps. \"I was hoping for lively sport today.\"\n\nThere's a blur across the porch, and the creature is suddenly standing at the top of the stairs.\n\nYou see it in its full glory now... and shudder.",
    next: "send_a_runner3",
  },
  send_a_runner3: {
    title: "Send A Runner",
    src: "../assets/shack.webp",
    type: "text",
    text: "The thing is a head taller than Threx and sports golden armor that is one part duster and one part hooded cloak. A black katana hangs from its hip. Its mouth is curled into a permanent snarl, and its shiny pink skin gives it the appearance of a burn victim.\n\nAnd the scars... There are too many to count.\n\nWorst of all is the other thing it's wearing. Fresh blood coats the creature like a crimson robe. It drips onto the decadent porch, adding faux-ruby to the amber, gold, and sapphire.\n\n\"Mitzi!\" Akemi screams.\n\nThe girl with hopes of joining Protocol Null has *become* null. She collapses into chunks of butchered meat.\n\nShe didn't even have time to scream.",
    //if they haven't cleared out the previous minions, there is another page before the battle
    conditionalNext: [
      {
        conditions: [
          { type: 'removed_minions' }
        ],
        next: 'send_a_runner4'
      }
    ],
    next: "camper_not_removed"
  },
  camper_not_removed: {
    title: "Camper Hunt",
    src: "../assets/shack.webp",
    type: "text",
    text: "Red eyes stare out from the surrounding tree-things. The Tethered Being's pets have arrived. You sense their hunger and realize they intend to eat your fallen companion.\n\n*Us too,* you realize, *if we fail.*",
    next: "send_a_runner4",
  },
  send_a_runner4: {
    title: "Send A Runner",
    src: "../assets/shack.webp",
    type: "text",
    text: "\"H-how...\" Ronin stammers.\n\n\"Impossible! Akemi exclaims. \"Mitzi was a hundred feet away, and that happened in the blink of an eye. Nothing is that fast!\"\n\nAleth grunts and nods at your blood-soaked host. \"*He* is.\"\n\nThe Camper smiles through black and jagged teeth.\n\n\"Now comes my favorite part!\"",
    next: "camper_together_battle_mitzi"
  },
  camper_together_battle_mitzi: {
    title: "Camper Battle",
    src: "../assets/shack.webp",
    type: "battle",
    enemies: {
      count: 1,
      template: {
        name: "Camper",
        maxHP: 1000,
        ac: 18,
        attack: 5,
        magic: 5,
        bp: 50
      }
    },
    allies: ["Ronin", "Threx", "Akemi", "Kaelion", "Aleth", "Harla", "Sheemie"], 
    text: "",
    fail: "camper_together_after_mitzi",
    next: "camper_together_after_mitzi"
  },
  camper_together_after_mitzi: {
    title: "Camper Battle",
    src: "../assets/shack.webp",
    type: "text",
    text: "Your team is massacred.\n\nYou look around and see Threx torn to shreds.\n\nHarla is crushed inside of her dented armor.\n\nKaelion's expensive armor is shattered with him inside.\n\nRonin has lost his right arm.\n\nSheemie is impaled on a nearby tree.\n\nAkemi's legs are shattered.\n\nAleth is ragdolled, thrown a hundred feet away.",
    next: "camper_together_after"
  },
  camper_together_after: {
    title: "Finished",
    src: "../assets/shack.webp",
    type: "choice",
    text: "The Camper toys with you.\n\nYou can do nothing but watch. Not only because of the shock, but also due to the Camper slicing off your left arm and right leg.\n\nFailure is inevitable, but you are faced with a small choice in your final moments.",
    choices: [
      { label: "Engage", next: "together_engage" },
      { label: "Retreat", next: "together_retreat" },
    ],
  },
  together_engage: {
    title: "Engage",
    type: "text",
    src: "../assets/shack.webp",
    text: "You lash out, refusing to go down without a fight.\n\nThe Camper smiles and leans into it. You deal a direct blow, drawing a small trickle of blood.\n\n\"Good,\" it rasps.\n\nThen, it hits you so hard your vision explodes.\n\nIn the flash of pain, you see a car crash. You see exploding windows and bodies thrown around the cabin as it rolls downhill.",
    next: "together_engage2"
  },
  together_engage2: {
    title: "Engage",
    type: "text",
    src: "../assets/shack.webp",
    text: "Somehow, you, Crixon, and an infant Ryke had emerged with only cuts. Your parents died on the scene.\n\nYour older brother Cale had been in intensive care for months, fostering an addiction that still haunts him.\n\nYou had always believed you and your siblings had been spared for a reason. Now, you know the truth.\n\nThere is no reason in mad worlds like these.",
    next: "together_engage3"
  },
  together_engage3: {
    title: "Engage",
    type: "text",
    src: "../assets/shack.webp",
    text: "The fear and the pain fade to a dull roar, leaving only anger and disappointment behind.\n\n\"Do it!\" you scream. \"Get it over with!\"\n\nThe Camper looks at you, a hint of admiration in its eyes.\n\nThen, it fulfills your request.\n\nThe last thing you see is darkness.",
    next: "camper_finish"
  },
  together_retreat: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "You back away from the creature, hellbent on prolonging your life as long as possible.\n\nRyke, Crixon, Cale-- what will they do without you?\n\nThe Camper closes on you slowly, savoring the fear of your final moments.\n\nYou crawl over body parts and fallen weapons, neither noticing nor caring.\n\n\"N-no,\" you beg. \"Please. I- I'm not supposed to go like this.\"",
    conditionalNext: [
      {
        conditions: [
          { type: 'removed_minions' }
        ],
        next: 'together_retreat2'
      }
    ],
    next: "together_retreat_minions"
  },
  together_retreat_minions: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "The minions of the Camper close in around you. Some gnaw on the remains of your companions. Other bite and paw at you like a cat playing with a mouse.",
    next: "together_retreat2"
  },
  together_retreat2: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"Pitiful,\" your killer says. \"Perhaps the next world I open mine to will send creatures who entertain me better than yours has.\"\n\nThe thing stomps on your ankle to keep you from retreating. The bone shatters.\n\nIn the flash of pain, you see a car crash. You see exploding windows and bodies thrown around the cabin as it rolls downhill.",
    next: "together_retreat3"
  },
  together_retreat3: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "Somehow, you, Crixon, and an infant Ryke had emerged with only cuts. Your parents died on the scene.\n\nYour older brother Cale had been in intensive care for months, fostering an addiction that still haunts him.\n\nYou had always believed you and your siblings had been spared for a reason. Now, you know the truth.",
    next: "together_retreat4"
  },
  together_retreat4: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "There is no reason in mad worlds like these.\n\nThe thing opens its mouth, and its jaw unhinges.\n\nThen, it freezes.\n\nLike an animal catching the sudden scent of a predator, the Camper sniffs at the air and bristles.",
    next: "together_retreat5"
  },
  together_retreat5: {
    title: "Retreat",
    type: "roll",
    src: "../assets/shack.webp",
    text: "",
    roll: {
      stat: "Thought",
      dc: 13,
      successText: "\"You feel it, too-- a sudden shift in the air. Something powerful has just entered the area.\"",
      failText: "\"You can't tell what the Camper is perceiving.\"",
      nextSuccess: "together_retreat6",
      nextFail: "together_retreat6",
    },
  },
  together_retreat6: {
    title: "Retreat",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"Who else is with you?\" the Camper rasps.\n\nYou have no idea, but coherent thought is failing you right now anyway.",
    conditionalNext: [
      {
        conditions: [
          { type: 'removed_minions' }
        ],
        next: 'together_hero'
      }
    ],
    next: "together_hero_minions"
  },
  together_hero_minions: {
    title: "Who Is That?",
    type: "text",
    src: "../assets/shack.webp",
    text: "A minion whimpers, then goes silent. Another's growl ends abruptly.\n\nIn a moment, the area around the decadent cabin becomes markedly emptier.\n\nThe minions are all dead.",
    next: "together_hero"
  },
  together_hero: {
    title: "Who Is That?",
    src: "../assets/shack.webp",
    type: "text",
    text: "The Camper steps away from you, looking scared for the first time. \"This... isn't possible. How can one of you move so quickly?\"\n\nThere's a blur to your left, and a figure in a gray throbe appears between you and the creature far more powerful than you.\n\nThis one-- more powerful still-- throws the Camper backward with a strike you hardly register.",
    next: "together_hero2"
  },
  together_hero2: {
    title: "Who Is That?",
    src: "../assets/shack.webp",
    type: "text",
    text: "The creature that had just seemed unstoppable crashes into its cabin, blowing the fine materials into bits.\n\n\"It's okay,\" your savior tells you. \"I'll handle it from here. You rest.\" He pauses to take in the others. \"I'm... sorry I'm late.\"\n\nBefore darkness takes you, you register something else about the stranger's clothing.",
    next: "together_hero3"
  },
  together_hero3: {
    title: "Who Is That?",
    src: "../assets/shack.webp",
    type: "text",
    text: "Yes, it is styled in the way familiar to those from Ashnhold, but it is clearly westernized, too.\n\nPerfectly fitted, like a business suit.\n\nYour savior-- who must be a S-Class breaker-- is a member of the Silk Road.\n\nThen, darkness finds you at last.",
    next: "camper_finish"
  },
  speak_to_creature: {
    title: "Speak To The Creature",
    src: "../assets/shack.webp",
    type: "text",
    text: "\"They tried to kill us first,\" you say. Your companions turn, dumbstruck.",
    next: "speak_to_creature2",
  },
  speak_to_creature2: {
    title: "Speak To The Creature",
    src: "../assets/shack.webp",
    type: "text",
    text: "\"Don't engage with the Camper,\" Threx warns.\n\n\"The *what?*\" asks Akemi.\n\n\"It's a creature that doesn't belong here,\" the C-Class breaker replies. \"It came the same way we did, through some other gate. It isn't connected to the world itself, which is why the portal didn't register a higher threat.\"\n\nAleth says, \"It waits in places like this one... so it can ambush lower-level explorers.\"",
    next: "speak_to_creature3",
  },
  speak_to_creature3: {
    title: "Speak To The Creature",
    src: "../assets/shack.webp",
    type: "choice",
    text: "\"Kaelion,\" Threx hisses, \"down your armor and get back to the gate. Tell the GPA that our Tethered Being is a Camper.\"\n\n\"Yessir!\" Kaelion yells, dropping his chest plate.\n\n\"The rest of you,\" Threx takes a step forward and angles his warhammer sideways, \"get behind me.\"",
    choices: [
      { label: "Keep talking to the Camper", next: "continue_talking" },
      { label: "Get behind Threx", next: "behind_threx" },
    ],
  },
  behind_threx: {
    title: "Get Behind Threx",
    src: "../assets/shack.webp",
    type: "text",
    text: "You file behind the group leader with the others. Threx takes a step forward and angles his warhammer sideways.",
    next: "threx_ahead",
  },
  threx_ahead: {
    title: "Threx Ahead",
    type: "text",
    src: "../assets/shack.webp",
    text: "For the first time since you've met him, the C-Class breaker reveals his full power. It dwarfs the rest of you.\n\nKaelion drops the last of his armor and begins his sprint to the exit.",
    next: "camper_hunt",
  },
  continue_talking: {
    title: "Continue Talking",
    type: "choice",
    src: "../assets/shack.webp",
    text: "You step forward, putting  the group leader at your back.\n\n\"I want to know more about you,\" you say. \"Where are you from, originally? How long have you been here?\"\n\nThe thing cocks its head, amused. \"I know some things about the world you come from. Tell me: does a human converse with an insect before stepping on it?\"",
    choices: [
      { label: "Sometimes", next: "sometimes_camper" },
      { label: "No", next: "no_camper" },
    ],
  },
  sometimes_camper: {
    title: "Sometimes",
    type: "text",
    src: "../assets/shack.webp",
    text: "You shrug. \"That depends on the human, I guess. Some people are lonelier than others.\"\n\nBehind you, Kaelion drops the last of his armor and begins his sprint to the portal.\n\nThere's a blur across the porch, and the creature is suddenly standing at the top of the stairs.\n\nYou see it in its full glory now... and shudder.",
    next: "sometimes_camper2",
  },
  sometimes_camper2: {
    title: "Sometimes",
    src: "../assets/shack.webp",
    type: "text",
    text: "The thing is a head taller than Threx and sports golden armor that is one part duster and one part hooded cloak. A black katana hangs from its hip. Its mouth is curled into a permanent snarl, and its shiny pink skin gives it the appearance of a burn victim.\n\nAnd the scars... There are too many to count.\n\nWorst of all is the other thing it's wearing. Fresh blood coats the creature like a crimson robe. It drips onto the decadent porch, adding faux-ruby to the amber, gold, and sapphire.\n\n\"Kael!\" Harla screams.\n\nThe knight collapses into chunks of butchered meat. He doesn't even have time to scream.",
    conditionalNext: [
      {
        conditions: [
          { type: 'removed_minions' }
        ],
        next: 'sometimes_camper3'
      }
    ],
    next: "sometimes_not_removed"
  },
  sometimes_not_removed: {
    title: "Sometimes",
    type: "text",
    src: "../assets/shack.webp",
    text: "Red eyes stare out from the surrounding tree-things. The Tethered Being's pets have arrived. You sense their hunger and realize they intend to eat your fallen companion.\n\n*Us too,* you realize, *if we fail.*",
    next: "sometimes_camper3"
  },
  sometimes_camper3: {
    title: "Sometimes",
    type: "choice",
    src: "../assets/shack.webp",
    text: "\"H-how...\" Ronin stammers.\n\n\"Impossible! Akemi adds. \"K-Kaelion was a hundred feet away, and that happened in the blink of an eye. Nothing is that fast!\"\n\nAleth grunts and nods at your blood-soaked host. \"He is.\"\n\nThe Camper ignores them. Its only interest right now is you.\n\n\"You think I'm lonely?\" it rasps.",
    choices: [
      { label: "Double down", next: "double_down" },
      { label: "Be silent", next: "be_silent" },
    ],
  },
  double_down: {
    title: "Double Down",
    type: "text",
    src: "../assets/shack.webp",
    text: "You do your best to keep the quiver from your voice.\n\n\"Yes. I don't know what things are like where you come from, but I suspect this is unnatural even there.\"\n\nYou take in the palace-like cabin once again, trying to understand the rationale of a creature this powerful. Why is it here? Why does it lure and prey on creatures it knows it can easily defeat?\n\nWhy is it alone?\n\nA theory comes to you. You have met humans just like this in the crumby part of town where you and your family live, people who are big fish in a small pond.",
    conditionalNext: [
      {
        // Went alone
        conditions: [
          { type: 'went_alone' }
        ],
        next: 'double_down_alone'
      },
      {
        // Interested in Freelance guild
        conditions: [
          { type: 'interested_in_guild', guild: 'Freelance' }
        ],
        next: 'double_down_alone'
      }
    ],
    next: "double_down2"
  },
  double_down_alone: {
    title: "Double Down",
    type: "choice",
    src: "../assets/shack.webp",
    text: "Had today gone differently, or if you proceed with your plan to break gates alone, you will likely go down a path just as solitary.\n\n\"I think you're lonely...\" you say again, \"but I also think you're scared.\"\n\n\"Scared!\" The Camper rasps a grating laugh. \"I am more powerful than you can ever hope to be! Hundreds of creatures have fallen to my blades. What could *I* possibly be afraid of?\"",
    choices: [
      { label: "A bigger fish", next: "bigger_fish" },
      { label: "The rejection of others", next: "rejection" },
    ],
  },
  double_down2: {
    title: "Double Down",
    type: "choice",
    src: "../assets/shack.webp",
    text: "\"I think you're lonely...\" you say again, \"but I also think you're scared.\"\n\n\"Scared!\" The Camper rasps a grating laugh. \"I am more powerful than you can ever hope to be! Hundreds of creatures have fallen to my blades. What could I possibly be afraid of?\"",
    choices: [
      { label: "A bigger fish", next: "bigger_fish" },
      { label: "The rejection of others", next: "rejection" },
    ],
  },
  bigger_fish: {
    title: "Bigger Fish",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"You're afraid of something out there that's even greater than you are. That's why you're hiding behind an E-Class gate.\"\n\nThe thing stops laughing.\n\n\"I'll teach you to doubt my strength.\"",
    //camper encounter
    next: "camper_together_battle_kael"
  },
  rejection: {
    title: "Rejection",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"You've sequestered yourself here, in hiding, because you're afraid of the alternative to being alone. You use violence and treasure as distractions, but it still gnaws at you.\"\n\nThe Camper follows your gaze to the others. Again, it laughs.\n\n\"I had a group like yours once. It was a fickle thing, weaker than I was alone.\"",
    next: "rejection_roll"
  },
  rejection_roll: {
    title: "Rejection",
    type: "roll",
    src: "../assets/shack.webp",
    text: "",
    roll: {
      stat: "Fellowship",
      dc: 13,
      successText: "\"But I like you. That's why I'll give you an option I've never given someone before.\"",
      failText: "\"But your numbers do little to balance your odds of survival.\"",
      nextSuccess: "rejection_success",
      nextFail: "rejection_fail",
    },
  },
  rejection_success: {
    title: "Rejection",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"Get away from him, {{characterName}},\" Threx warns. \"It's a trap.\"\n\n\"Enough!\" the Camper raises a hand and your seven remaining companions freeze in place.\n\nThis creature is even more powerful than you imagined.",
    next: "rejection_success2"
  },
  rejection_success2: {
    title: "Rejection",
    type: "choice",
    src: "../assets/shack.webp",
    text: "\"Here's your option,\" the thing continues, speaking as if the interruption hadn't happened. \"If you fight me, and if I find you entertaining enough, your sacrifice will save your precious companions.\"\n\n\"Or,\" he added with a shrug, \"I'll release them and you can try defeating me together.\"",
    choices: [
      { label: "Save them", next: "save_team" },
      { label: "Fight together", next: "fight_together" },
    ],
  },
  save_team: {
    title: "Save Team",
    type: "battle",
    src: "../assets/shack.webp",
    text: "",
    enemies: {
      count: 1,
      template: {
        name: "Camper",
        maxHP: 1000,
        ac: 18,
        attack: 5,
        magic: 5,
        bp: 50
      }
    },
    fail: "save_team_after",
    next: "save_team_after"
  },
  save_team_after: {
    title: "Save Team",
    type: "text",
    src: "../assets/shack.webp",
    text: "The Camper toys with you.\n\nFirst your right arm is easily cut off.\n\nThen, both of your legs are removed.\n\nThe Camper lifts you into the air and impales you onto a nearby tree.\n\nTaking hit after hit as you are pinned to this tree, your companions are forced to watch.",
    next: "save_team_fail"
  },
  save_team_fail: {
    title: "Failure",
    type: "choice",
    src: "../assets/shack.webp",
    text: "As the light fades from your eyes, you're faced with the last choice you'll ever make.",
    choices: [
      { label: "Keep silent but maintain eye contact with your killer", next: "eye_contact" },
      { label: "Strike out at the creature", next: "strike_out" },
      { label: "Cry out", next: "cry_out" },
    ],
  },
  eye_contact: {
    title: "Eye Contact",
    type: "text",
    src: "../assets/shack.webp",
    text: "Like everyone else, you've heard stories about near-death experiences. You've heard about people's lives flashing before their eyes.\n\nYou don't get that.",
    next: "eye_contact2"
  },
  eye_contact2: {
    title: "Eye Contact",
    type: "text",
    src: "../assets/shack.webp",
    text: "Instead, you are only gifted with a memory of a single moment-- a curse, really. You immediately place it, because it's one you've revisited often.\n\nThis was years before the arrival of the first gate, but the two events can be likened by how time can be measured before and after.\n\nYou see exploding windows and bodies thrown around the inside of the rolling car.",
    next: "do_it"
  },
  strike_out: {
    title: "Strike Out",
    type: "text",
    src: "../assets/shack.webp",
    text: "You lash out, refusing to go down without a fight.\n\nThe Camper smiles and leans into it. You deal a direct blow, drawing a small trickle of blood.\n\n\"Good,\" it rasps.",
    next: "strike_out2"
  },
  strike_out2: {
    title: "Strike Out",
    type: "text",
    src: "../assets/shack.webp",
    text: "Then, it hits you so hard your vision explodes.\n\nIn the flash of pain, you see a car crash. You see exploding windows and bodies thrown around the cabin as it rolls downhill.",
    next: "do_it"
  },
  do_it: {
    title: "Do It",
    type: "text",
    src: "../assets/shack.webp",
    text: "Somehow, you, Crixon, and an infant Ryke had emerged with only cuts. Your parents died on the scene.\n\nYour older brother Cale had been in intensive care for months, fostering an addiction that still haunts him.\n\nYou had always believed you and your siblings had been spared for a reason. Now, you know the truth.\n\nThere is no reason in mad worlds like these.",
    next: "do_it2"
  },
  do_it2: {
    title: "Do It",
    type: "text",
    src: "../assets/shack.webp",
    text: "The fear and the pain fade to a dull roar, leaving only anger and disappointment behind.\n\n\"Do it!\" you scream. \"Get it over with!\"\n\nThe Camper looks at you, a hint of admiration in its eyes.\n\n\"You have entertained me,\" the creature rasps. \"I have not had that in a long time. Consider your sacrifice... worth it. Because of you, I shall let the others go free.\"\n\nThe Camper's jaw widens, unhinges, and swallows your face.",
    next: "do_it3"
  },
  do_it3: {
    title: "Do It",
    type: "text",
    src: "../assets/shack.webp",
    text: "The last thing you see is darkness.",
    next: "camper_finish"
  },
  cry_out: {
    title: "Cry Out",
    type: "text",
    src: "../assets/shack.webp",
    text: "Like everyone else, you've heard stories about near-death experiences. You've heard about people's lives flashing before their eyes.\n\nYou don't get that.\n\nInstead, you are only gifted with a memory of a single moment-- a curse, really. You immediately place it, because it's one you've revisited often.",
    next: "cry_out2"
  },
  cry_out2: {
    title: "Cry Out",
    type: "text",
    src: "../assets/shack.webp",
    text: "This was years before the arrival of the first gate, but the two events can be likened by how time can be measured *before* and *after.*\n\n You see exploding windows and bodies thrown around the inside of the rolling car.\n\nSomehow, you, Crixon, and an infant Ryke had emerged with only cuts. Your parents died on the scene.",
    next: "cry_out3"
  },
  cry_out3: {
    title: "Cry Out",
    type: "text",
    src: "../assets/shack.webp",
    text: "Your older brother Cale had been in intensive care for months, fostering an addiction that still haunts him.\n\nYou had always believed you and your siblings had been spared for a reason. Now, you know the truth.\n\nThere is no reason in mad worlds like these.The pain washes out everything except your scream. All your life, you had hoped to become something greater.",
    next: "cry_out4"
  },
  cry_out4: {
    title: "Cry Out",
    type: "text",
    src: "../assets/shack.webp",
    text: "The camper frowns. \"Pity. You had nearly paid for the lives of the others. But now... you've only bored me.\"\n\nThe thing pauses to look over at the rest of the party. \"Perhaps one of them will be more entertaining.\"\n\nThe Camper's jaw widens, unhinges, and swallows your face.",
    next: "do_it3"
  },
  fight_together: {
    title: "Fight Together",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"I'll take my chances with them,\" you say. \"We might surprise you.\"\n\nThe Camper sucks its teeth, displeased.",
    next: "rejection_fail"
  },
  rejection_fail: {
    title: "Rejection",
    type: "text",
    src: "../assets/shack.webp",
    text: "The Tethered Being spits on the ground, clearly disgusted with having been roped into a conversation.\n\n\"File in with your friends, little one,\" it rasps. \"I'll do you the courtesy of killing you all together.\"",
    //camper battle with team
    next: "camper_together_battle_kael"
  },
  be_silent: {
    title: "Silent",
    type: "text",
    src: "../assets/shack.webp",
    text: "\"That's what I thought,\" it says, smiling at you through black and jagged teeth. \"Now comes my favorite part!\"",
    //camper battle
    next: "camper_together_battle_kael"
  },
  no_camper: {
    src: "../assets/shack.webp",
    title: "No",
    type: "text",
    text: "You take a step back, realizing your folly in trying to reason with this thing. Threx grabs your wrist and pulls you behind him.\n\n\"Dumbass,\" he says.",
    next: "camper_hunt",
  },
  camper_finish: {
    title: "---",
    type: "text",
    useCustomBackground: true,
    text: "*Nothing separates you from the silent, dark, boundless world you find yourself in.*\n\n*You scream, but no words come.*\n\n*You look, but there is only darkness.*\n\n*You struggle to move, but you are formless.*",
    next: "formless"
  },
  formless: {
    title: "---",
    type: "text",
    useCustomBackground: true,
    text: "*Death does not feel how you expected it to. Your parents aren't waiting for you here. Neither are demons hellbent on devouring your immortal soul.*\n\n*There is no heaven, no hell, no time, nor space. You are alone, and you are the absence.*",
    next: "formless2"
  },
  formless2: {
    title: "---",
    type: "text",
    useCustomBackground: true,
    text: "\"Well hooooowwwddyyy!\"",
    next: "formless3"
  },
  formless3: {
    title: "Who?",
    type: "text",
    useCustomBackground: true,
    text: "*That wasn't you, was it?*",
    next: "formless4"
  },
  formless4: {
    title: "Who?",
    type: "text",
    useCustomBackground: true,
    text: "\"Sorry 'bout that, par'ner. Let me get a light for ya.\"",
    next: "formless5"
  },
  formless5: {
    title: "Who?",
    type: "text",
    text: "*A faint speck appears in the middle distance, creating contrast to the endless dark.*\n\n\"That's better.\"",
    next: "formless6",
    useCustomBackground: true,
    customBackgroundComponent: "LightRays"
  },
  formless6: {
    title: "Who?",
    type: "text",
    text: "The voice is calming, yet paradoxically unsettling. You feel safe here, but only in the way one feels safe inside a cage.\n\n\"*Who are you?*\" you try to ask. There are no words, because you have no body.\n\nThe voice replies anyway.",
    next: "formless7",
    useCustomBackground: true,
    customBackgroundComponent: "LightRays"
  },
  formless7: {
    title: "Who?",
    type: "text",
    text: "\"Me? I'm just a Man-with-a-plan. A lot of you folks used to call me God. Nowadays, you call me the \"Protocol.\"\n\n*The Protocol*. Your mind explodes with the revelation. Are you about to be activated? Saved? Is this what it's like for everyone, or are you special somehow?",
    next: "formless8",
    useCustomBackground: true,
    customBackgroundComponent: "LightRays"
  },
  formless8: {
    title: "The Protocol",
    type: "text",
    text: "\"*Shooo*. You're no more special than anyone else,\" the light says in its unique drawl. \"But you are very special indeed. You have a purpose that is yet unfulfilled. For that reason, I reckon I can't allow ya to expire.\"\n\nIt pauses, and when it speaks again, its voice is different. More serious. More common.",
    next: "formless9",
    useCustomBackground: true,
    customBackgroundComponent: "LightRays"
  },
  formless9: {
    title: "The Protocol",
    type: "text",
    text: "\"Keep fighting, {{characterName}}. Keep getting stronger. I'll need you tip-top before the end.\"\n\nYou try to say more, but the light is gone. The darkness is, too.\n\nAgain, there is only you.",
    next: "formless10",
    useCustomBackground: true,
    customBackgroundComponent: "LightRays"
  },
  formless10: {
    title: "---",
    type: "text",
    text: "Then, there is nothing at all.",
    useCustomBackground: true,
    next: "hospital"
  },
  hospital: {
    title: "Awake",
    type: "text",
    useCustomBackground: true,
    text: "You awake in a hospital bed, flanked by a nurse and a healer.\n\n\"He's coming to,\" the healer whispers.\n\n\"Oh, thank God,\" says the nurse. \"His family will be thrilled to see him in one piece.\"\n\n\"Well, I wouldn't go that far.\"",
    next: "hospital1",
    hpModification: {
      type: 'set',
      amount: 20,
      message: 'You are brought back to life.',
      // oneTime: true
    }

  },
  hospital1: {
    title: "Awake",
    type: "text",
    src: "../assets/hospital.webp",
    text: "Your eyes follow the gaze of the healer to the stump of your right arm, then to the open space below your knees.",
    next: "hospital2"
  },
  hospital2: {
    title: "Missing",
    src: "../assets/hospital.webp",
    type: "text",
    //need to check if player sacrificed self
    text: "You're missing three limbs!\n\nRegistering your impending panic, the healer says, \"I'm sorry. If an S-Class healer had reached you right away, they could have brought back all of you.\"",
    conditionalNext: [
      {
        conditions: [
          { type: 'went_alone', value: true },
          { type: 'sacrificed', value: true }
        ],
        next: 'hospital_solo_sacrifice'
      },
      {
        conditions: [
          { type: 'went_alone', value: true },
          { type: 'did_not_sacrifice', value: true }
        ],
        next: 'hospital_solo_didnt_sacrifice'
      },
      {
        conditions: [
          { type: 'went_with_team', value: true },
          { type: 'sacrificed', value: true }
        ],
        next: 'hospital_sacrifice'
      },
      {
        conditions: [
          { type: 'went_with_team', value: true },
          { type: 'did_not_sacrifice', value: true }
        ],
        next: 'hospital_didnt_sacrifice'
      }
    ],
    // Fallback
    next: 'hospital_didnt_sacrifice'
  },
  hospital_solo_sacrifice: {
    title: "Silk Road",
    type: "choice",
    src: "../assets/hospital.webp",
    text: "\"But it took your party's healer time to get to you in the chaos,\" the nurse adds. \"And, though she's very skilled, she lacked the skill to restore limbs.\"\n\n\"Luckily for you,\" the nurse takes over, \"the Silk Road is paying for the best artificial limbs the Epoch Corporation has to offer... which, honestly, might be better than the real thing.\"",
    choices: [
      { label: "I'd prefer my own", next: "hospital_response" },
      { label: "The Silk Road?", next: "hospital_response" },
      { label: "Where are the others?", next: "hospital_response" },
      { label: "Stay silent", next: "hospital_silent" },
      //if alone the entire way
      { label: "...I'm not a member of a party", next: "hospital_response" },
    ],
  },
  hospital_solo_didnt_sacrifice: {
    title: "Silk Road",
    type: "choice",
    src: "../assets/hospital.webp",
    text: "\"But that thing in there really did a number on you guys. If the healer in your party had survived, maybe she...\"\n\n\"Luckily for you,\" the nurse takes over, \"the Silk Road is paying for the best artificial limbs the Epoch Corporation has to offer... which, honestly, might be better than the real thing.\"",
    choices: [
      { label: "I'd prefer my own", next: "hospital_response" },
      { label: "The Silk Road?", next: "hospital_response" },
      { label: "Where are the others?", next: "hospital_response" },
      { label: "Stay silent", next: "hospital_silent" },
      //if alone the entire way
      { label: "...I'm not a member of a party", next: "hospital_response" },
    ],
  },
  hospital_sacrifice: {
    title: "Silk Road",
    type: "choice",
    src: "../assets/hospital.webp",
    text: "\"But it took your party's healer time to get to you in the chaos,\" the nurse adds. \"And, though she's very skilled, she lacked the skill to restore limbs.\"\n\n\"Luckily for you,\" the nurse takes over, \"the Silk Road is paying for the best artificial limbs the Epoch Corporation has to offer... which, honestly, might be better than the real thing.\"",
    choices: [
      { label: "I'd prefer my own", next: "hospital_response" },
      { label: "The Silk Road?", next: "hospital_response" },
      { label: "Where are the others?", next: "hospital_response" },
      { label: "Stay silent", next: "hospital_silent" },
    ],
  },
  hospital_didnt_sacrifice: {
    title: "Silk Road",
    type: "choice",
    src: "../assets/hospital.webp",
    text: "\"But that thing in there really did a number on you guys. If the healer in your party had survived, maybe she...\"\n\n\"Luckily for you,\" the nurse takes over, \"the Silk Road is paying for the best artificial limbs the Epoch Corporation has to offer... which, honestly, might be better than the real thing.\"",
    choices: [
      { label: "I'd prefer my own", next: "hospital_response" },
      { label: "The Silk Road?", next: "hospital_response" },
      { label: "Where are the others?", next: "hospital_response" },
      { label: "Stay silent", next: "hospital_silent" },
    ],
  },
  hospital_response: {
    title: "Try Talking",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Uhhhhnnngggrrraa,\" you say.\n\nThe nurse and healer exchange a look.\n\n\"These damned breakers never listen,\" mutters the latter. \"It doesn't matter whether they are E-Rank like this one, or S like the one who brought them in.\"\n\n\"Oh, you can't blame Veyr for having places to be!\" argues the latter. Her eyes grow wide with admiration. \"I still can't believe we got to see *the* Veyr Singrave in person! Ahh! He's so dreamy!\"",
    next: "veyr"
  },
  hospital_silent: {
    title: "Silence",
    type: "text",
    src: "../assets/hospital.webp",
    text: "The healer continues. \"You're lucky to be alive. If not for that S-Class breaker, you and the others would be dead in that other world.\"\n\nThe nurse squeals. \"I still can't believe we got to see *the* Veyr Singrave in the flesh!\" Her eyes grow wide with admiration. \"He's so dreamy!\"",
    next: "veyr"
  },
  veyr: {
    title: "Veyr Singrave",
    type: "text",
    src: "../assets/hospital.webp",
    text: "You've heard of Veyr Singrave. The S-Class breaker and poster child of the Silk Road is a rising star across the eastern seaboard.\n\nHe's recently broken into the top ten list of breakers registered with the Protocol.\n\nWhat was he doing in that portal?\n\nThankfully, the nurse answers your question before you can struggle to ask it.",
    next: "veyr2"
  },
  veyr2: {
    title: "Veyr Singrave",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"I hate that Veyr has a girlfriend, but she's probably the reason he was in the area. She was in charge of overseeing the mining operation after the gate was cleared.\"\n\nYou dwell a moment longer on the providence of being rescued by someone so strong.\n\nThen, your mind drifts to the other part of what the healer had said.\n\n\"*S-Class who brought THEM in.*\"",
    //depends on if they were solo/together and sacrificed
    conditionalNext: [
    {
      conditions: [
        { type: 'went_alone', value: true },
        { type: 'sacrificed', value: true }
      ],
      next: 'solo_sacrifice'
    },
    {
      conditions: [
        { type: 'went_alone', value: true },
        { type: 'did_not_sacrifice', value: true }
      ],
      next: 'solo_didnt_sacrifice'
    },
    {
      conditions: [
        { type: 'went_with_team', value: true },
        { type: 'sacrificed', value: true }
      ],
      next: 'together_sacrifice'
    },
    {
      conditions: [
        { type: 'went_with_team', value: true },
        { type: 'did_not_sacrifice', value: true }
      ],
      next: 'together_didnt_sacrifice'
    }
  ],
    // Fallback
    next: 'together_didnt_sacrifice'
  },
  solo_sacrifice: {
    title: "Companions",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"Don't stress about your companions, either,\" the healer says. \"They are okay... All of them. From the story we heard, you risked everything to save them.\"\n\n\"They'll be in to see you later,\" the nurse says, \"but we figured you'd want to see your family first.\"\n\n\"I'm not a member of a party!\" you try to say. What you utter instead sounds more like Tongues.",
    next: "family"
  },
  solo_didnt_sacrifice: {
    title: "Companions",
    src: "../assets/hospital.webp",
    type: "text",
    //Akemi Sato, Aleth Achen, and Ronin Balore are the only survivors
    //need to update data journal with deathes
    npcDeaths: ["Threx", "Harla", "Kaelion", "Mitzi", "Sheemie"],
    text: "\"We couldn't save them all,\" the healer says. \"We wish we could. Sometimes, people are too hurt for too long. You probably made it by moments. The others...\" She drifts off before restarting. \"Akemi Sato, Aleth Achen, and Ronin Balore have been stabilized. I'm afraid the others weren't as lucky.\"\n\n\"But at least Akemi will be visiting once she recovers,\" the nurse adds. \"I'm sure the others will, too.\"",
    next: "family"
  },
  together_didnt_sacrifice: {
    title: "Companions",
    type: "text",
    src: "../assets/hospital.webp",
    text: "You aren't the only survivor!\n\nDid Akemi make it out? Did Aleth? Sheemie? Threx and some of the others had been obliterated when you last saw them, but so had you!\n\n\"*Are they nearby?*\" you try to ask. \"*Are they close?*\"\n\nWhat comes out sounds more like, \"Ehhhrrr!\"",
    next: "together_didnt_sacrifice2"
  },
  together_didnt_sacrifice2: {
    title: "Companions",
    src: "../assets/hospital.webp",
    type: "text",
    //Akemi Sato, Aleth Achen, and Ronin Balore are the only survivors
    //need to update data journal with deathes
    npcDeaths: ["Threx", "Harla", "Kaelion", "Mitzi", "Sheemie"],
    text: "\"What's that, hun?\" asks the nurse, shifting from her reverie.\n\nThe healer, perhaps sensing the desperation behind the noise, shushes her.\n\nTo you, she says, \"We couldn't save them all. We wish we could. Sometimes, people are too hurt for too long. You probably made it by moments. The others...\" She drifts off before restarting. \"Akemi Sato, Aleth Achen, and Ronin Balore have been stabilized. I'm afraid the others weren't as lucky.\"\n\n\"But at least Akemi will be visiting once she recovers,\" the nurse adds. \"I'm sure the others will, too.\"",
    next: "family"
  },
  together_sacrifice: {
    title: "Companions",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Don't stress about your companions, either,\" the healer says. \"They are okay... All except the one who went down before you did. From the story we heard, you risked everything to save them.\"\n\nThe words come with relief, but also with a shard of glass. Kaelion Virehart, the brave knight-in-training, wasn't coming back.\n\n\"They'll be in to see you later,\" the nurse says, \"but we figured you'd want to see your family first.\"",
    next: "family"
  },
  family: {
    title: "Family",
    type: "text",
    src: "../assets/hospital.webp",
    text: "Before she can say more, the door to the hospital room flies open, and your five-year-old sister runs inside.\n\n\"{{characterName}}!\"\n\nRyke knocks the nurse aside, and jumps into bed with you.\n\n\"Ahhhhh!\" you scream.\n\nCrixon enters next, smiling widely. \"Thank God! I thought we'd have to start relying on Cale to pay rent!\"",
    next: "family2"
  },
  family2: {
    title: "Family",
    src: "../assets/hospital.webp",
    type: "text",
    text: "Your third sibling enters last. There are dark bags under his eyes, darker than the last time you saw him. His clothes are dirty and hang loosely about him. Cale raises his hand to you in greeting. Even from here, you can see the purple tint of his veins.\n\nHow long has it been since his last injection? A day? Two?\n\nHow long were you out?",
    next: "family3"
  },
  family3: {
    title: "Family",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"Youww so bwave!\" Ryke exclaims, nuzzling up to you. Her eyes look just like your mom's did.\n\n\"Be careful with the patient!\" say the nurse and healer in unison.",
    next: "family4"
  },
  family4: {
    title: "Family",
    src: "../assets/hospital.webp",
    type: "roll",
    text: "\"I can increase your painkiller if you want to visit for a bit,\" the healer offers, gesturing at the IV bag attached to your arm. \"If I were S-Class, you wouldn't need it... But you got what you got.\"",
    roll: {
      stat: "Thought",
      dc: 12,
      successText: "You notice Cale eyeing up the bag of painkillers.\n\nHe's had a problem with this in the past.",
      failText: "It's hard to focus, let alone perceive anything.",
      nextSuccess: "family_decide_success",
      nextFail: "family_decide_fail",
    },
  },
  family_decide_fail: {
    title: "Family",
    src: "../assets/hospital.webp",
    type: "choice",
    action: "failure",
    text: "Visit or rest?",
    choices: [
      { label: "Accept and stay awhile", next: "family_visit" },
      { label: "Decline and get some rest", next: "family_rest" },
    ],
  },
  family_decide_success: {
    title: "Family",
    type: "choice",
    src: "../assets/hospital.webp",
    text: "Visit or rest?",
    choices: [
      { label: "Accept and stay awhile", next: "family_visit" },
      { label: "Decline and get some rest", next: "family_rest" },
      { label: "Accept, but save the painkiller for Cale ", next: "family_painkiller", action: "gave_to_cale", },
      { label: "Accept and address it with Cale", next: "family_address" },
    ],
  },
  family_visit: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Yeeeaahhhh,\" you manage.\n\nThe nurse fiddles with your IV, and a wave of relief washes over you in an instant.\n\nWords finally form on your lips. \"Thank... you.\"\n\n\"Don't get too comfortable,\" she warns. \"It'll only last a few minutes, then you'll need to rest anyway.\"",
    next: "family_visit2"
  },
  family_visit2: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Thank you,\" you say again. The words come easier this time.\n\n\"And *thank you* for keeping the rest of us safe from those gates,\" she replies before leaving the room with the nurse.",
    next: "family_visit3",
  },
  family_visit3: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"How long?\" you ask.\n\nCrixon replies quickly. If he were a little older, you'd have less to worry about with the household. He's responsible. Dependable.\n\n\"Three days.\"\n\nYou sigh. \"Has my pay already been deposited into the account?\"\n\nYour younger brother sneaks a glance at the older one, who looks away.\n\n\"Yeah, it was in there.\"\n\n\"*Was?*\"",
    next: "family_visit4"
  },
  family_visit4: {
    title: "Visit",
    src: "../assets/hospital.webp",
    type: "choice",
    text: "You know what the response is going to be before Crixon opens his mouth, but you need to hear it anyway.\n\nIt's Cale who answers.\n\n\"I left enough for rent... and for some food.\" The twenty-three-year-old pauses to look at you and the two children. \"Christ! Mom and Dad left that account for *all* of us! I... just had some things to pay off, is all.\"\n\nCrixon rolls his eyes. Ryke plays with your blankets.\n\nCale looks at you, expecting a reaction.",
    choices: [
      { label: "Yell at Cale for spending the money", next: "cale_yell" },
      { label: "Ask him where it went", next: "cale_ask" },
      { label: "Stay silent - you know what he *really* spent the money on.", next: "cale_silent" },
    ],
  },
  cale_yell: {
    title: "Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"You didn't earn it!\" you yell, ignoring the discomfort in your chest...and everywhere else. \"You don't get to decide where it goes! Grow the hell up, Cale.\"\n\nYour brother's eyes meet yours. The pain in them is evident, but so is the anger.\n\nWithout another word, he storms from the room, slamming the door behind him.",
    next: "cale_storm"
  },
  cale_ask: {
    title: "Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"Oh yeah?\" Your voice is ice cold. \"And what debts were those, I wonder? Does it have something to do with those purple veins on your arms? Has Travis been hanging around again?\"\n\n\"No! Well... kinda. But it's not what you think!\"\n\nCrixon gives you a look that says, \"*It's exactly what you think.*\"\n\n\"Travis got out a few days ago and is having trouble affording a place. I... just wanted to help.\"",
    next: "cale_transactional"
  },
  cale_silent: {
    title: "Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "You look at your brother and wait. Eventually, he caves under the weight of your silence.\n\n\"It wasn't much! Not really. It's just... Travis got out a few days ago and is having a rough time affording a place. I was just trying to help.\"",
    next: "cale_transactional"
  },
  cale_transactional: {
    title: "Cale",
    src: "../assets/hospital.webp",
    type: "choice",
    text: "\"Was this help transactional?\" you ask. \"Did he give you anything in return?\"\n\nYour brother shrugs, then looks down, further drawing attention to the purple and engorged veins of his arms.\n\nThat's all the answer you need.",
    choices: [
      { label: "Ask Cale to stop using drugs", next: "cale_stop" },
      { label: "Change the subject ", next: "cale_change" },
    ],
  },
  cale_stop: {
    title: "Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"That shit's gonna kill you,\" you say to your brother. \"I know you're hurting, but injecting yourself with that poison doesn't help.\"\n\nYou tell him every time you have a chance to.\n\nThe outcome is always the same.\n\nCale stares you down for a moment, then storms out of the room. The door slams behind him.",
    next: "cale_storm"
  },
  cale_storm: {
    title: "Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"Great,\" Crixon says. \"It was almost a week before he came home the last time he stormed off.\"",
    next: "ryke"
  },
  cale_change: {
    title: "Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "What's the point of starting a fight over something you can't change?\n\nYou look at your brother a moment longer, then shift the conversation elsewhere.\n\n\"What's going on with everyone else?\"\n\nRyke nuzzles up next to you, making you feel just a little better.\n\n\"I gawt an A-pwus on my science pwoject!\" your little sister says.\n\n\"Oh yeah? What was it on?\"",
    next: "ryke_project"
  },
  ryke_project: {
    title: "Ryke",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"The Gates! I had a-- Thewh was a gate that lea to a big cave! I made it out of slime! And then, in that cave, I made anothewh gate that looked like Momma and Dadda's monolith. It was so cool!\"\n\n\"Wow! A gate inside another gate? That is cool.\" You look at Crixon. \"That sounds like a lot of work.\"\n\nYour younger brother nods, and Ryke continues speaking in her stream-of-consciousness kind of way.\n\nYou take it all in and smile. Despite the pain and the bits of you forever lost to your first gate, and the financial drama, and the family drama, you feel content.",
    next: "ryke_project2",
  },
  ryke_project2: {
    title: "Ryke",
    src: "../assets/hospital.webp",
    type: "choice",
    text: "It might just be the painkillers doing their job, but it feels like more than that. You shouldn't have walked away from what happened in there, and yet you have.\n\nThe conversation with your siblings ebbs and flows, just as it always does. Ryke does most of the talking, mainly speaking about nothing at all.\n\nYou and Crixon share looks and laugh often.\n\nWhen the door finally closes behind them, exhaustion ambushes you.\n\nA final thought reaches you before unconsciousness does.",
    choices: [
      { label: "*I do it for them*", next: "hospital_sleep" },
      { label: "*I do it for me*", next: "hospital_sleep" },
      { label: "*I do it for us*", next: "hospital_sleep" },
    ],
  },
  hospital_sleep: {
    title: "---",
    type: "text",
    useCustomBackground: true,
    text: "Then, you sleep.",
    next: "hospital_later"
  },
  family_rest: {
    title: "Rest",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"Mmm-mmm,\" you manage. It's too much even to shake your head.\n\n\"Booo!\" Ryke says.\n\nCrixon, always the pragmatist, says, \"We have school tomorrow. We've already missed three days sitting around the hospital. We probably won't be here when you wake up next.\"\n\n\"Has... my pay...been deposited...yet?\"\n\nYour younger brother sneaks a glance at the older one, who looks away.\n\n\"Yeah, it was in there.\"",
    next: "family_rest2"
  },
  family_rest2: {
    title: "Rest",
    src: "../assets/hospital.webp",
    type: "text",
    text: "You look from one brother to the other, already guessing where it went.\n\nCale, the oldest, remains silent, as he usually does. If you had more energy, you'd address this. Right now, however, the only thing you plan to address is the softness of your pillow.\n\n\"We'll... talk... later.\" You say before struggling out a weak \"I... love... you\" before the darkness returns. You realize, before fading, that there is still no augmented reality mapped atop your own.\n\nEven now, the Protocol has kept you unactivated.\n\nYour sigh becomes a snore.",
    next: "hospital_later"
  },
  family_painkiller: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Yeeeaahhhh,\" you manage.\n\nThe nurse fiddles with your IV, and a wave of relief washes over you in an instant.\n\nWords finally form on your lips. \"Thank... you.\"\n\n\"Don't get too comfortable,\" she warns. \"It'll only last a few minutes, then you'll need to rest anyway.\"",
    next: "family_painkiller2"
  },
  family_painkiller2: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Thank you,\" you say again. The words come easier this time.\n\n\"And *thank you* for keeping the rest of us safe from those gates,\" she replies before leaving the room with the nurse.",
    next: "family_painkiller3",
  },
  family_painkiller3: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Cale first,\" you say, casting a sideways glance at Crixon and Ryke. \"Privately. I... wanna hear about how these ones have been behaving.\"Crixon, too young to be this observant, rolls his eyes at you. You know he knows the meaning behind the request.\n\n\"C'mon, Ry,\" he says, already moving for the door. \"Let's let these two discuss boring grown up things. We can get more of that candy you like from the vending machine.\"",
    next: "family_painkiller4"
  },
  family_painkiller4: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Weally? I thought you werhr all out of money?\"\n\nCrixon shrugs and looks past you to your older brother.\n\n\"I lied.\"\n\nYour little sister is out of bed and across the room before you can register the dull pain she left behind.\n\nOnce they leave, you turn to Cale.",
    next: "family_painkiller5"
  },
  family_painkiller5: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Hit the dial and replace that bag with one of the used ones in the trash. You can take the full one home, in case you need it later.\"\n\n\"You sure?\" he says, looking you over. You can't tell whether the hesitation is genuine, or if he does it because he's expected to.\n\n\"Do it,\" you say. \"We'll just have to save most of the talking until after I'm... discharged.\"\n\nYou realize Cale is already detaching the IV bag. Pain is returning quickly, as is your urge to sleep.",
    next: "family_painkiller6"
  },
  family_painkiller6: {
    title: "Visit",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"How long... have I been here?\" you ask.\n\n\"Three days,\" he replies, using medical tape to reseal the bag. It disappears into his backpack a minute later.\n\n\"Has my pay... been deposited...yet?\"\n\n\"Yeah.\"\n\n\"And...where is it now?\"\n\nYou hear a sniffle and realize your older brother is crying. You repeat the question.",
    next: "family_painkiller7"
  },
  family_painkiller7: {
    title: "Visit",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"I left enough for rent... and for some food.\" The twenty-three-year-old pauses, knowing he isn't giving you the answer you're expecting.\n\n\"Travis,\" he says at last. \"He got out a few days ago. He needed money and I...\" Cale pauses to look at his bag again. \"You know what I need.\"",
    next: "family_painkiller8"
  },
  family_painkiller8: {
    title: "Visit",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"Travis,\" you whisper, preferring not to have heard the name again.\n\nCale says more, but you have trouble registering it. You're so tired.\n\nYou realize, before fading, that there is still no augmented reality mapped atop your own.\n\nEven now, the Protocol has kept you unactivated.\n\nYour sigh becomes a snore.",
    next: "hospital_later"
  },
  family_address: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Yeeeaahhhh,\" you manage.\n\nThe nurse fiddles with your IV, and a wave of relief washes over you in an instant.\n\nWords finally form on your lips. \"Thank... you.\"\n\n\"Don't get too comfortable,\" she warns. \"It'll only last a few minutes, then you'll need to rest anyway.\"",
    next: "family_address2"
  },
  family_address2: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Thank you,\" you say again. The words come easier this time.\n\n\"And *thank you* for keeping the rest of us safe from those gates,\" she replies before leaving the room with the nurse.",
    next: "family_address3",
  },
  family_address3: {
    title: "Visit",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Cale first,\" you say, casting a sideways glance at Crixon and Ryke. \"Privately. I... wanna hear about how these ones have been behaving.\"Crixon, too young to be this observant, rolls his eyes at you. You know he knows the meaning behind the request.\n\n\"C'mon, Ry,\" he says, already moving for the door. \"Let's let these two discuss boring grown up things. We can get more of that candy you like from the vending machine.\"",
    next: "family_address4"
  },
  family_address4: {
    title: "Visit",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"Weally? I thought you werhr all out of money?\"\n\nCrixon shrugs and looks past you to your older brother.\n\n\"I lied.\"\n\nYour little sister is out of bed and across the room before you can register the dull pain she left behind.\n\nOnce they leave, you turn to Cale.",
    next: "family_address5"
  },
  family_address5: {
    title: "Visit",
    src: "../assets/hospital.webp",
    type: "choice",
    text: "\"You okay?\"\n\nYour brother looks up, surprised. His eyes meet yours, then look over the rest of you.\n\n\"*You're* asking *me* that question?\" he says. \"Really?\"\n\nYou try to shrug, but your body doesn't allow you.\n\n\"We gotta look out for each other, right?\"\n\nCale's eyes mist up, and then he looks away.\n\n\"Your pay was deposited into the shared account Mom and Dad left us,\" he whispers. \"I... may have spent some of it.\"",
    choices: [
      { label: "Yell at Cale for spending the money", next: "address_yell" },
      { label: "Ask him where it went", next: "address_ask" },
      { label: "Stay silent - you know what he *really* spent the money on", next: "address_silent" },
    ],
  },
  address_yell: {
    title: "Address Cale",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"You didn't earn it!\" you yell, ignoring the discomfort in your chest...and everywhere else. \"You don't get to decide where it goes! Grow the hell up, Cale.\"\n\nYour brother's eyes meet yours. The pain in them is evident, but so is the anger.\n\nWithout another word, he storms from the room, slamming the door behind him.\n\nCrixon and Ryke return a few minutes later. The younger one had chocolate on her face. Crixon's wore disappointment.\n\n\"The last time Cale left like that, it was almost a week before we saw him again.\"",
    next: "ryke"
  },
  address_ask: {
    title: "Address Cale",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"Oh yeah?\" Your voice is ice cold. \"And what debts were those, I wonder? Does it have something to do with those purple veins on your arms? Has Travis been hanging around again?\"\n\n\"No! Well... kinda. But it's not what you think!\" He pauses, then adds, \"He just needed some help, is all!\"",
    next: "address_transactional"
  },
  address_silent: {
    title: "Address Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "You look at your brother and wait. Eventually, he caves under the weight of your silence.\n\n\"It wasn't much! Not really. It's just... Travis got out a few days ago and is having a rough time affording a place. I was just trying to help.\"",
    next: "address_transactional"
  },
  address_transactional: {
    title: "Address Cale",
    type: "choice",
    src: "../assets/hospital.webp",
    text: "\"Was this help transactional?\" you ask. \"Did he give you anything in return?\"\n\nYour brother shrugs, then looks down, further drawing attention to the purple and engorged veins of his arms.\n\nThat's all the answer you need.",
    choices: [
      { label: "Ask Cale to stop using drugs", next: "address_stop" },
      { label: "Change the subject", next: "address_change" },
      { label: "Ask about Travis", next: "address_travis" },
    ],
  },
  address_stop: {
    title: "Address Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"That shit's gonna kill you,\" you say to your brother. \"I know you're hurting, but injecting yourself with that poison doesn't help.\"\n\nYou tell him every chance you get.\n\nThe outcome is always the same.\n\nCale stares you down, the previous moment of shared tenderness forgotten. Then, he storms out of the room.\n\nCrixon and Ryke return a few minutes later. The younger one had chocolate on her face. Crixon's wore disappointment.\n\n\"The last time Cale left like that, it was almost a week before we saw him again.\"",
    next: "ryke"
  },
  address_change: {
    title: "Address Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "What's the point of starting a fight over something you can't change?\n\nYou look at your brother a moment longer, then shift the conversation elsewhere.\n\n\"Go get the others. I'd like to visit with all of you before I pass out again.\"\n\nHe does, you do, and the monster haunting your brother is nearly forgotten.\n\nNearly.",
    next: "ryke"
  },
  address_travis: {
    title: "Address Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"How was it? Seeing Travis again after, what, five years?\" You whistle. \"I can't believe it's been that long since the Marshalls' place burned down.\"\n\nCale grunts at the painful memory of your old foster home. Beth and Rodney Marshall were deeply unpleasant people, as were many of the adolescents they housed.\n\n\"It was... strange,\" Cale says. \"We've all grown up so much, {{characterName}}. Travis has, too, obviously. You know how the system changes people.\"\n\nHe pauses, as if lost in the recall of a recent memory.\n\n\"But in some ways, it still feels like we're the same old kids, yaknow? There's just... a lot of history between us. A lot of it I'd rather forget, but some of it...\"",
    next: "address_travis2"
  },
  address_travis2: {
    title: "Address Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "You nod, knowing the feeling.\n\n\"Just be careful, alright? I don't want to see you get hurt again.\" You look at his purple veins. \"We could try getting you into rehab again. I've been reading about a really facility in Aethervault. I know it's far, but...\"\n\nCale snorts. \"I'm not going to South America, {{characterName}}. I... don't want to be that far away from you guys.\"\n\n\"But if it helps--\"\n\n\"I'm not going. We can't afford it anyway, especially with you in this condition. I'll,\" he pauses again to deliver an almost-believable cough. \"I'll be fine.\"",
    next: "address_travis3"
  },
  address_travis3: {
    title: "Address Cale",
    type: "text",
    src: "../assets/hospital.webp",
    text: "\"If you need me,\" you say, \"I'm here. You know that.\"\n\nCale nods. \"Enough of this heavy shit, okay? You know I hate hospitals anyway. Can I bring the others back in here?\"\n\nIt's your turn to nod.\n\nYour brother retrieves your other siblings, but the monster haunting him stays fresh on your mind.\n\nRyke nuzzles up next to you, though. That makes you feel just a little better.\n\n\"I gawt an A-pwus on my science pwoject!\" your little sister says.",
    next: "address_travis4"
  },
  address_travis4: {
    title: "Address Cale",
    src: "../assets/hospital.webp",
    type: "text",
    text: "\"Oh yeah?\" you ask. What was it on?\"\n\n\"The Gates! I had a-- Thewh was a gate that lea to a big cave! I made it out of slime! And then, in that cave, I made anothewh gate that looked like Momma and Dadda's monolith. It was so cool!\"\n\n\"Wow! A gate inside another gate? That is cool.\" You look at Crixon. \"That sounds like a lot of work.\"\n\nYour younger brother nods, and Ryke continues speaking in her stream-of-consciousness kind of way.",
    next: "address_travis5"
  },
  address_travis5: {
    title: "Address Cale",
    type: "text",
    src: "../assets/hospital.webp",
    text: "You take it all in and smile. Despite the pain and the bits of you forever lost to your first gate, and the financial drama, and the family drama, you feel content.\n\nIt might just be the painkillers doing their job, but it feels like more than that. You shouldn't have walked away from what happened in there, and yet you have.\n\nThe conversation with your siblings ebbs and flows, just as it always does. Ryke does most of the talking, mainly speaking about nothing at all.\n\nYou and Crixon share looks and laugh often. Sometimes, Cale even joins in. It's almost convincing.",
    next: "address_travis6"
  },
  address_travis6: {
    title: "How Are You Feeling?",
    src: "../assets/hospital.webp",
    type: "choice",
    text: "When the door finally closes behind them, the exhaustion catches up to you. A final thought reaches you before unconsciousness does.",
    choices: [
      { label: "*I do it for them*", next: "hospital_sleep" },
      { label: "*I do it for me*", next: "hospital_sleep" },
      { label: "*I do it for us*", next: "hospital_sleep" },
    ],
  },
  ryke: {
    title: "How Are You Feeling?",
    src: "../assets/hospital.webp",
    type: "text",
    text: "You close your eyes, broken from the last world and already weary of this one.\n\nRyke nuzzles up next to you, though. That makes you feel just a little better.\n\n\"I gawt an A-pwus on my science pwoject!\" your little sister says.\n\nYou take a deep breathe, content to maintain the relationships you do have.\n\n\"Oh yeah? What was it on?\"",
    next: "ryke_project"
  },
  hospital_later: {
    title: "Later...",
    src: "../assets/hospital_later.webp",
    type: "text",
    text: "You wake again, still in the hospital room. It's empty now, but there are hints of other visitors.",
    //if they sacrificed themselves and went alone you go to a page. if they went together there's another page. if they went alone and did not sacrifice, there is another page
    conditionalNext: [
      {
        // Went alone AND sacrificed
        conditions: [
          { type: 'went_alone' },
          { type: 'sacrificed' }
        ],
        next: 'hospital_later_alone_sacrificed'
      },
      {
        // Went alone but did NOT sacrifice
        conditions: [
          { type: 'went_alone' },
          { type: 'did_not_sacrifice' }
        ],
        next: 'hospital_later_alone_no_sacrifice'
      },
      {
        // Went with the team
        conditions: [
          { type: 'went_with_team' }
        ],
        next: 'hospital_later_team'
      }
    ],
    next: "hospital_later_team" // Fallback (defaults to team path)
  },
  hospital_later_alone_sacrificed: {
    title: "Note",
    type: "text",
    src: "../assets/hospital_later.webp",
    text: "There's a letter on the end table next to your bed. It features a picture of the group you had been meant to enter with. Everyone has signed it except Ronin, your former best friend.\n\n\"Thank you for your sacrifice,\" the letter reads. \"Call us if you need anything. Threx.\"",
    next: "hospital_note"
  },
  hospital_later_alone_no_sacrifice: {
    title: "Note",
    type: "text",
    src: "../assets/hospital_later.webp",
    text: "There's a nondescript letter on the end table next to your bed. You open it and find familiar, messy handwriting inside.\n\n\"People died because of you. Those who didn't still lost pieces of ourselves. I'm glad to hear you have, too, even if it wasn't enough. I considered smothering you with your pillow, but I'd rather wait until we're both at full strength.\"\n\n\"Get well soon.\"\n\n- Ronin",
    next: "hospital_note"
  },
  hospital_later_team: {
    title: "Note",
    type: "text",
    src: "../assets/hospital_later.webp",
    action: "akemi_interested",
    text: "There's a note from Akemi, longer than the others. It includes her phone number.\n\n\"Keep in touch,\" the note says.",
    next: "hospital_note"
  },
  hospital_note: {
    title: "Later...",
    src: "../assets/hospital_later.webp",
    type: "choice",
    text: "You press the call button, and a new nurse enters a minute later.",
    choices: [
      { label: "Keep the note", next: "nurse_keep", action: "took_hospital_note" },
      { label: "Leave the note here", next: "nurse_leave", action: "did_not_take_hospital_note" },
    ],
  },
  nurse_keep: {
    title: "Nurse",
    src: "../assets/hospital_later.webp",
    type: "text",
    text: "\"You're looking much better!\" the nurse remarks. \"Right as rain! We'll get you attuned to your new limbs, and then you'll be on your way!\"\n\nThere's a soft pinch as the needle recedes from your arm. You wonder how the hell Cale spends so much time with these things.\n\n\"Doesn't that... take a while?\" you ask, dreading the months of physical therapy ahead of you.\n\n\"Before the gates and the Epoch Corporation, definitely, but it's a different world now. I consider it a small trade compared to everything we lost, but we take the wins when we can, right?\"",
    next: "nurse2"
  },
  nurse_leave: {
    title: "Nurse",
    src: "../assets/hospital_later.webp",
    type: "text",
    text: "\"You're looking much better!\" the nurse remarks. \"Right as rain! We'll get you attuned to your new limbs, and then you'll be on your way!\"\n\nThere's a soft pinch as the needle recedes from your arm. You wonder how the hell Cale spends so much time with these things.\n\n\"Doesn't that... take a while?\" you ask, dreading the months of physical therapy ahead of you.\n\n\"Before the gates and the Epoch Corporation, definitely, but it's a different world now. I consider it a small trade compared to everything we lost, but we take the wins when we can, right?\"",
    next: "nurse2"
  },
  nurse2: {
    title: "Nurse",
    src: "../assets/hospital_later.webp",
    type: "text",
    text: "The nurse leaves your view and returns a moment later with an armful of severed limbs.\n\n\"We already installed the chip for these babies while you were out. It should feel no different from moving your old arms and legs.\"\n\n\"You... did *brain surgery* on me?\"\n\nThe nurse blinks. \"Well, yeah. Didn't your brother tell you already? I was told he and your other siblings came to visit the other day. He *is* your next of kin, after all.\"",
    next: "nurse3"
  },
  nurse3: {
    title: "Nurse",
    src: "../assets/hospital_later.webp",
    type: "text",
    text: "\"No,\" you hiss. \"No one told me.\"\n\nThe nurse looks around, suddenly concerned. \"Well, uh, I'm afraid the process is irreversible. Do you.. still want to learn how to use these things, or...?\"\n\nAfter a long sigh and a brief rub of the temples, you nod.",
    next: "arclight"
  },
  arclight: {
    //background change, old building that looks to have been knocked down. used to be a capital, now buildings no larger than 3 stories with an obelisk memorial
    src: "../assets/arclight.webp",
    title: "Arclight Haven",
    type: "text",
    text: "Fifteen minutes later, you leave the hospital behind and re-enter the city you've always known as home. Your new limbs and rebuilt spine feel odd, but surprisingly natural. Stronger maybe, but certainly different.\n\nJust like your city.\n\nArclight Haven sits on swampland. It sprawls like a rash, and no buildings are taller than three stories. It's as if the whole place had been knocked down once, and it's now too afraid to stand back up.\n\nIn a way, that's true. In another way, it isn't.",
    next: "arclight2"
  },
  arclight2: {
    title: "Arclight Haven",
    src: "../assets/arclight.webp",
    type: "text",
    text: "This place was once the capital of an empire. It saw itself as the helm of the world, the center of the universe.\n\nThe arrival of the gates shattered that hubris.\n\nStill, there is power here. The GPA is here. Two top ten breakers are here. Your family-- and you-- are here, despite all the reasons you shouldn't be.\n\nIn the distance is an old memorial to an even older ideal. The obelisk watches over the city like a sentry, reminding it of better times and promising a renewal.",
    next: "arclight3"
  },
  arclight3: {
    title: "Arclight Haven",
    src: "../assets/arclight.webp",
    type: "text",
    text: "You've spent a lot of time at the obelisk and surrounding memorials. Your parents used to take you and Cale there. After they died, the obelisk became a memorial for them, too.\n\nYou're hobbling, but the longer you walk, the less stiff you feel.\n\nSwamp gas ignites in the distance, beckoning you in the direction of home. Washington, DC, didn't always host these flammable ghosts, but an early rift here injected methane into the soil. Will-o'-the-wisps they were once called. Now, these Arclights give this haven its new name.",
    next: "arclight4"
  },
  arclight4: {
    title: "Arclight Haven",
    type: "choice",
    src: "../assets/arclight.webp",
    text: "You watch a few more ignitions, then sigh. You've been away from the apartment for too long. Has Cale already burned away the last of your paycheck?\n\nYou reach a personal crossroads on your way. One direction will lead you home on foot. The other, quicker direction will lead you to the metro.",
    choices: [
      { label: "Walk", next: "arclight_walk" },
      { label: "Take the train", next: "arclight_train" },
    ],
  },
  arclight_walk: {
    title: "Arclight Walk",
    type: "text",
    src: "../assets/arclight.webp",
    text: "You turn left, content to reach home when your feet get you there. The obelisk watches over you for a few more blocks, then disappears behind a row of townhouses.\n\nIt's midday, and the city is alive with the overlapping chatter of cars, bikes, and pedestrians. You navigate between and around them, and they all ignore you. Such is the way in the big city.",
    next: "arclight_walk2"
  },
  arclight_walk2: {
    title: "Arclight Walk",
    src: "../assets/arclight.webp",
    type: "choice",
    text: "On the corner is the GPA-affiliated bodega you usually visit while walking this route. It's also the same shop you had purchased your dissappointing gatebreaking tools from.",
    choices: [
      { label: "Go inside", next: "arclight_go_inside" },
      { label: "Keep walking", next: "arclight_keep_walking" },
    ],
  },
  arclight_go_inside: {
    title: "Arclight Inside",
    src: "../assets/arclight.webp",
    type: "text",
    text: "You enter the store behind a group of teenagers.\n\nWhen you emerge on the other side of the threshold, the teenagers are gone. The familiar insides of the bodega are, too.",
    next: "arclight_study"
  },
  arclight_keep_walking: {
    title: "Arclight Walk",
    src: "../assets/arclight.webp",
    type: "text",
    text: "For now, at least, you pass by the store. Now that you have the means, walking sounds like too good a thing to give up.\n\nYou travel block after block, tired but content. Before long, you realize your stroll has taken you on a detour. You've reached the memorials of the old National Mall. The recently repaired reflecting pool offers you glimpses of yourself.\n\nYou don't look too bad for someone who has just left the hospital.",
    next: "arclight_keep_walking2"
  },
  arclight_keep_walking2: {
    title: "Arclight Walk",
    src: "../assets/arclight.webp",
    type: "choice",
    text: "You walk through the remains of the memorial on the pool's western side. It resembles the ruins of the Parthenon in ancient Greece— now long gone— and features an empty, broken chair. You remember that the statue of a great leader once sat here, but that history belongs to a country that no longer exists.\n\nYou circle the reflecting pool and approach the obelisk. Surprisingly, it's open today. A line of people is waiting to take an elevator to the top.",
    choices: [
      { label: "Get in line", next: "arclight_get_in_line" },
      { label: "Walk home", next: "arclight_walk_home" },
    ],
  },
  arclight_get_in_line: {
    title: "Get In Line",
    src: "../assets/arclight.webp",
    type: "text",
    text: "You file in with the others and eventually follow them inside the obelisk.\n\nWhen you reach the other side of the threshold, however, the people are gone.",
    next: "arclight_study"
  },
  arclight_walk_home: {
    title: "Walk Home",
    src: "../assets/arclight.webp",
    type: "text",
    text: "Like the corner store, the obelisk passes you by. Your legs feel good now. All of you feels good now.\n\nEventually, you're standing in front of the door to your apartment. You can already sense the emptiness on the other side.\n\nCrixon and Ryke are likely in school right now.\n\nAnd who knows where Cale is.\n\nKnowing the place is likely a mess, you prepare for the worst as you open the door and step inside.\n\nOnly, when you reach the other side, your apartment is nowhere to be found.",
    next: "arclight_study"
  },
  arclight_train: {
    title: "Arclight Train",
    src: "../assets/arclight.webp",
    type: "text",
    text: "You turn right, and the ground swallows you. The roar of the metro echoes through the tunnel like the call of a great beast.\n\nIt's midday, and so a fair-sized crowd has gathered in this space, heading to their own destinations. They all ignore you. Such is the way here.\n\nThe red line arrives its obligatory three minutes late, and people file inside. You wait your turn, then enter behind them.\n\nWhen you emerge on the other side of the threshold, the people are gone. The train car is gone, too.",
    next: "arclight_study"
  },
  arclight_study: {
    src: "../assets/study.webp",
    title: "Arclight Study",
    type: "text",
    text: "Instead, you find yourself standing on the bottom floor of a two-story study. Bookcases stretch out and up from you, spines reflecting the cozy fire that's crackling in the corner hearth.\n\nYou spin and realize the door behind you is gone. You're stuck here, wherever here is. You know that gates can appear as anything, and their insides can contain any manner of world, but you feel a profound sense of displacement here anyway.\n\nA strange vertigo.",
    next: "arclight_study2"
  },
  arclight_study2: {
    title: "Arclight Study",
    type: "choice",
    src: "../assets/study.webp",
    text: "You've *never* heard of a gate that only lets in some people and ignores others. Are there beasts here, or something else?",
    choices: [
      { label: "Call out", next: "study_call" },
      { label: "Explore", next: "study_explore" },
    ],
  },
  study_call: {
    title: "Study Call Out",
    type: "text",
    src: "../assets/study.webp",
    text: "\"Hello?\"\n\nYour voice is quiet in the big room, making you feel very small indeed.\n\n\"Hi.\"",
    next: "study_voice"
  },
  study_explore: {
    title: "Explore Study",
    type: "text",
    src: "../assets/study.webp",
    text: "The sound of your footfalls disappears into your surroundings, allowing you to move quietly to a gnarled desk sitting near the fire. Its surface is covered in papers and drawings.",
    next: "study_bookshelf"
  },
  study_voice: {
    title: "Study Voice",
    type: "choice",
    src: "../assets/study.webp",
    text: "The voice comes from the loft above you. There's a figure standing there, but their features blur against your perception.\n\nThey feel like the being you had seen in that *other* place-- the one between life and death -- but also markedly different.\n\nImmediately, you sense the power of this person. Even if you were back to full strength, the disparity between you two would be even greater than between you and the Camper.",
    choices: [
      { label: "Seek a defense", next: "study_defense" },
      { label: "Ask who they are", next: "study_ask" },
    ],
  },
  study_bookshelf: {
    title: "Study Bookshelf",
    type: "roll",
    src: "../assets/study.webp",
    text: "There is also a bookshelf that stands out from the others. The spines of its books are dark, though the titles themselves sparkle against the uneven light.",
    roll: {
      stat: "Thought",
      dc: 12,
      successText: "You know you're being watched by whoever brought you here, but they are holding off speaking to you right away.\n\nIt's almost as if they *want* you to explore this place first.",
      failText: "It's a lavish study, you are drawn to explore.",
      nextSuccess: "study_room",
      nextFail: "study_room",
    },
  },
  study_room: {
    title: "Study Room",
    type: "choice",
    src: "../assets/study.webp",
    text: "What would you like to search?",
    choices: [
      { label: "Search the desk", next: "search_desk" },
      { label: "Search the bookshelf", next: "search_bookshelf" },
    ],
  },
  search_desk: {
    title: "Study Room",
    type: "choice",
    src: "../assets/study.webp",
    text: "The papers on the desk appear to be Epoch Corporation designs. You can't make out what they depict, but it looks powerful.",
    choices: [
      { label: "Take", next: "take_desk" },
      { label: "Move to bookcase", next: "search_bookshelf" },
    ],
  },
  take_desk: {
    //add study desk papers to inventory/data journal
    title: "Study Room",
    type: "choice",
    src: "../assets/study.webp",
    text: "You snatch the papers from the desk and pocket them.\n\nYou also detect the movements of your mysterious host.",
    choices: [
      { label: "Ignore and go to the bookcase", next: "search_bookshelf" },
      { label: "Call out", next: "study_call" },
    ],
  },
  search_bookshelf: {
    title: "Study Bookshelf",
    type: "text",
    src: "../assets/study.webp",
    text: "You visit the bookcase and pull a few of the titles at random.\n\n\"Solo Leveling,\" reads one.\n\n\"Dungeon Crawler Carl,\" reads another.\n\nYou've never heard of either.\n\n\"I've always had an affinity for literary RPGs,\" your host calls to you. \"There's a certain appeal to playing an active role in the story, wouldn't you agree?\"",
    next: "study_voice"
  },
  study_defense: {
    title: "Study Defense",
    type: "text",
    src: "../assets/study.webp",
    text: "You look around, and your eyes find an ancient suit of armor standing beside a desk near the fireplace. You obviously don't have time to don it, but the suit is holding a crossbow.\n\nYou wrench the weapon free and point it at your host. You can't hope to match him, but at least you'll go down fighting.",
    next: "study_defense2"
  },
  study_defense2: {
    title: "Study Defense",
    src: "../assets/study.webp",
    type: "text",
    text: "\"Can I expect to leave this place, or are you here to hurt me?\"\n\nThey click their tongue, and you sense regret in the words that follow.\n\n\"It is not my intention to hurt you, {{characterName}}, but there will be pain on the path ahead.\"\n\nThe figure nods at your weapon.\"I'll let you keep that. If you manage to find the ammunition for it, maybe it'll transfer some of that pain elsewhere.\"",
    next: "study_ask"
  },
  study_ask: {
    title: "Study Ask",
    src: "../assets/study.webp",
    type: "choice",
    text: "\"Who are you?\" you ask, hating how small you feel.\n\nYou can't see this person's face, but you sense their smile. \"That's the wrong question,\" they reply.\n\n\"And the answer at this point would only confuse you. Though I suppose you may call me an Interloper, since that is what I am.\"",
    choices: [
      { label: "\"What is this place?\"", next: "study_what" },
      { label: "\"What do you want?\"", next: "study_want" },
    ],
  },
  study_what: {
    title: "Study What",
    src: "../assets/study.webp",
    type: "text",
    text: "\"I've never heard of a gate like this one before,\" you say. \"What is this place?\"\n\nThe Interloper points at you. \"Now *that* is the right question!\"\n\nThey begin a slow walk down the stairs toward you, their features still a blur. Their hands sweep wide arcs across the room as they answer.\n\n\"This place-- like me-- is as foreign to your world as it is to all the others. I belong nowhere, and so I am free to exist anywhere. But... it exists because of me, that much is certain. Soon, you will be the same way.\"",
    next: "study_want"
  },
  study_want: {
    //{If the player explored the gate with the group AND collected the note in the hospital, need to go to a page. if alone or if didn't take note go to a different page
    title: "Study Want",
    src: "../assets/study.webp",
    type: "text",
    // type: "choice",
    text: "\"Your fate and mine are connected, {{characterName}}. You might not appreciate that yet, but you will in time.\"",
    conditionalNext: [
      {
        // Went with team AND collected the hospital note
        conditions: [
          { type: 'went_with_team' },
          { type: 'took_hospital_note' }
        ],
        next: 'study_together'
      },
      {
        // Either went alone OR didn't take the note
        conditions: [
          { type: 'went_alone_or_no_note' }
        ],
        next: 'study_alone'
      }
    ],
    next: "study_alone" // Fallback
  },
  study_alone: {
    title: "Study Want",
    src: "../assets/study.webp",
    type: "choice",
    text: "\"Unfortunately, you are still at the very beginning of your journey. There are many more hardships you must face before reaching the level I need you to be. In the meantime, I need you to do what I tell you when I tell you. You will be faced with choices that may lead you from my sight. You *must* not let that happen.\"",
    choices: [
      { label: "\"Why should I trust you?\"", next: "interloper_why" },
      { label: "\"Okay\"", next: "interloper_ok" },
      { label: "\"Okay\" (lie)", next: "interloper_ok_lie" },
    ],
  },
  study_together: {
    title: "Study Want",
    src: "../assets/study.webp",
    type: "choice",
    text: "\"You might not realize it, but you mean a great deal to me.\"\n\n\"Unfortunately, you are still at the very beginning of your journey. There are many more hardships you must face before reaching the level I need you to be. In the meantime, I need you to do what I tell you when I tell you. You will be faced with choices that may lead you from my sight. You *must* not let that happen.\"",
    choices: [
      { label: "\"Why should I trust you?\"", next: "interloper_why" },
      { label: "\"Okay\"", next: "interloper_ok" },
      { label: "\"Okay\" (lie)", next: "interloper_ok_lie" },
    ],
  },
  interloper_why: {
    title: "Why",
    src: "../assets/study.webp",
    type: "choice",
    text: "\"You won't even let me see your face,\" you say. \"Why should I trust that you have my best interests at heart?\"\n\nThe Interloper shrugs. \"I already know the choices you'll make. I already know much of your path. If it helps, I can even tell you a thing or two about your future. Though...\" they pause dramatically, \"some things may be hard to hear.\"",
    choices: [
      { label: "\"Tell me\"", next: "interloper_tell" },
      { label: "Keep it to yourself", next: "interloper_keep" },
    ],
  },
  interloper_ok: {
    title: "Okay",
    type: "text",
    src: "../assets/study.webp",
    text: "\"Fine,\" you say. \"I'll follow what you tell me. Only... I'm not even activated yet. I'm not sure how helpful I'll be if the Protocol hasn't even noticed me.\"\n\n\"I wouldn't be too concerned about that. Changes are coming, my friend.\" They look at you. \"Is there anything else you'd like to discuss?\"\n\nYou pause a moment, knowing your earlier statement is only half true. The Protocol hasn't activated you, but you *did* speak with something in that *other* place.",
    next: "interloper_ok2"
  },
  interloper_ok2: {
    title: "Okay",
    type: "text",
    src: "../assets/study.webp",
    text: "You open your mouth to ask about it, but something holds your tongue, literally keeping the words from leaving you.\n\nYou feel the Interloper narrow their eyes. \"I understand. Unfortunately, you won't be able to talk about me, either. Too much at stake. The Protocol's ways are mysterious, but I always understood why it does that much, at least.\"\n\nYou struggle to say more, but the words still won't come.",
    next: "interloper_intro"
  },
  interloper_ok_lie: {
    title: "Okay (Lying)",
    src: "../assets/study.webp",
    type: "text",
    text: "\"Fine,\" you lie. \"I'll follow what you tell me. Only... I'm not even activated yet. I'm not sure how helpful I'll be if the Protocol hasn't even noticed me.\"\n\nYou feel the Interloper narrow their eyes at you.\n\n\"I suppose time will tell,\" they whisper before turning away. \"As for you not being activated, I wouldn't be too concerned. Changes are coming, my friend.\"",
    next: "interloper_intro"
  },
  interloper_tell: {
    title: "Tell Me",
    src: "../assets/study.webp",
    type: "choice",
    text: "\"If you know what you claim to know, then yes, I want to know my future.\"\n\nThe Interloper laughs, but the sound is welcoming-- not at all like the Camper.\n\n\"In the weeks ahead, you'll be asked to go break a gate in Halcyon Refract. When you're there, you'll learn something interesting about the Gatebreaker Protocol.\"\n\nYou blink. \"I'm... not even an official E-Class. Why would anyone call me in to help with a gate thousands of miles away?\"\n\n\"Because things are about to change for you. If you make the right choices, you will amass enough power to change the world.\"",
    choices: [
      { label: "\"That's great!\"", next: "interloper_great" },
      { label: "\"What about my family?\"", next: "interloper_family" },
    ],
  },
  interloper_great: {
    title: "Great",
    src: "../assets/study.webp",
    type: "text",
    text: "\"That's great!\" you excaim. \"...If it's true.\"\n\n\"Time will prove my words. In the meantime, I only ask that you consider them... and my request.\"",
    next: "interloper_intro"
  },
  interloper_family: {
    title: "Family",
    src: "../assets/study.webp",
    type: "text",
    text: "\"And what of my family?\" you ask. \"Am I allowed to know anything about their futures?\"\n\nThe Interloper shakes their head. \"I can tell you things about the gates because you have some agency over yourself. Knowing-- and trying to change-- the paths that other people walk will only lead you to madness.\"",
    next: "interloper_intro"
  },
  interloper_keep: {
    title: "Keep To Self",
    type: "choice",
    src: "../assets/study.webp",
    text: "You shake your head. \"No person should know their future. Only I control my choices.\"\n\nThe Interloper laughs. \"Very well. I suppose that means you refuse to listen to my recommendations, then?\"",
    choices: [
      { label: "\"Probably not\"", next: "interloper_not" },
      { label: "\"Nah, I'll listen\"", next: "interloper_listen" },
      { label: "\"Nah, I'll listen\" (lie)", next: "interloper_listen_lie" },
    ],
  },
  interloper_not: {
    title: "Probably Not",
    src: "../assets/study.webp",
    type: "text",
    text: "\"I don't know you, and so I can't trust you. I'm happy to hear whatever advice you're willing to send my way, but my choices will remain my own.\"\n\nSurprisingly, your host doesn't seem bothered by your refusal.\n\n\"I figured you'd say that. However, you might change your mind once you see what the future has in store for you.\" They turn away. \"As for you not being activated, I wouldn't be too concerned. Changes are coming, my friend.\"",
    next: "interloper_intro"
  },
  interloper_listen: {
    title: "Listening",
    type: "text",
    src: "../assets/study.webp",
    text: "\"Nah,\" you say. \"I'll listen to what you have to tell me. Only... I'm not even activated yet. I thought the Protocol would acknowledge me after everything that's happened... but it's been silent.\"\n\n\"I wouldn't be too concerned about that. Changes are coming, my friend.\" They look at you. \"Is there anything else you'd like to discuss?\"\n\nYou pause a moment, knowing your earlier statement is only half true. The Protocol hasn't activated you, but you *did* speak with something in that *other* place.",
    next: "interloper_listen2"
  },
  interloper_listen2: {
    title: "Listening",
    src: "../assets/study.webp",
    type: "text",
    text: "You open your mouth to ask about it, but something holds your tongue, literally keeping the words from leaving you.\n\nYou feel the Interloper narrow their eyes. \"I understand. Unfortunately, you won't be able to talk about me, either. Too much at stake. The Gatekeeper's ways are mysterious, but I always understood why it does that much, at least.\"\n\nYou struggle to say more, but the words still won't come.",
    next: "interloper_intro"
  },
  interloper_listen_lie: {
    title: "Listening (Lying)",
    src: "../assets/study.webp",
    type: "text",
    text: "\"Nah,\" you lie. \"I'll listen to what you have to tell me. Only... I'm not even activated yet. I thought the Protocol would acknowledge me after everything that's happened... but it's been silent.\"\n\nYou feel the Interloper narrow their eyes at you.\n\n\"I suppose time will tell,\" they whisper.\n\n\"As for you not being activated, I wouldn't be too concerned. Changes are coming, my friend.\"",
    next: "interloper_intro"
  },
  interloper_intro: {
    title: "Interloper Intro",
    src: "../assets/study.webp",
    type: "text",
    text: "\"Anyway,\" The Interloper disappears entirely, and their voice continues from around the room, \"I just wanted to make an introduction, let you know you have someone looking out for you.\"\n\nA door appears in front of you. It looks exactly like the one to your apartment.\n\n\"I'll see you soon. Or maybe I'm mistaken.\"\n\nYou don't see it, but you swear you feel the Interloper wink.\n\n\"I suppose the other players will decide.\"",
    next: "apartment"
  },
  apartment: {
    title: "Your Apartment",
    src: "../assets/apartment.webp",
    type: "text",
    text: "You open the door and step into your apartment. It's empty, but not entirely.\n\nAn image overlays your living room, visible only to you.",
    next: "activated"
  },
  activated: {
    //update breaker class to D
    title: "Activated!",
    src: "../assets/apartment.webp",
    type: "text",
    text: "\"Congratulations! The Protocol has activated you. You may now spend breaker Points, get into more difficult gates, choose a path, and use the system store.\"\n\nYour Rank is D-Class.",
    next: "activated2",
    action: {
      type: "update_class",
      value: "D"
    },
  },
  activated2: {
    title: "Activated!",
    src: "../assets/apartment.webp",
    type: "text",
    text: "\"D-Class?\" You let out a low whistle. You skipped E entirely.\n\nYou look back at your closed apartment door. *Did the Interloper do this?*\n\nYou blink twice, and the augmented reality window disappears. Your shoddy living room returns to focus, looking more dire than ever.",
    next: "activated3"
  },
  activated3: {
    title: "Activated!",
    src: "../assets/apartment.webp",
    type: "text",
    text: "You almost died a few days ago, and your family is no better off because of it.\n\n\"*D-Class,*\" you say again.\n\n*Things will only get harder from here.*",
    next: "chapter1_end_card"
  },
  chapter1_end_card: {
    title: "Thank you",
    type: "endCard",
    useCustomBackground: true,
    customBackgroundComponent: "PrismaticBurst"
  }
};

// if (typeof window !== 'undefined') {
//   // Browser environment - run checks
//   const checkPages = () => {
//     console.log('🔍 Checking critical pages:');
    
//     const criticalPages = ['excited3', 'nervous', 'threx_brief2', 'threx_brief3'];
    
//     criticalPages.forEach(pageId => {
//       const exists = adventurePages.hasOwnProperty(pageId);
//       console.log(`${exists ? '✅' : '❌'} ${pageId}`, exists ? adventurePages[pageId].next : 'MISSING');
//     });
    
//     // Check the chain
//     console.log('\n🔗 Checking navigation chain:');
//     let current = 'excited3';
//     let depth = 0;
//     const maxDepth = 10;
    
//     while (current && depth < maxDepth) {
//       if (!adventurePages[current]) {
//         console.log(`❌ BROKEN: ${current} not found!`);
//         break;
//       }
      
//       const page = adventurePages[current];
//       console.log(`${depth}. ${current} → ${page.next || 'END'}`);
      
//       if (!page.next) break;
//       current = page.next;
//       depth++;
//     }
//   };
  
//   // Run check after a short delay
//   setTimeout(checkPages, 100);
// }
