export const adventurePages = {
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
    type: "text",
    text: "All your life, you longed for adventure, and the moment is finally here. What will it feel like when you step into this shimmering superfluid? Will you emerge on the other side a different person? Will you finally be the hero you always saw yourself as?\n\nYou know the life behind you. Ahead, there is only possibility.\n\nYou step forward, prepared to enter, when a strong hand grabs your wrist.",
    next: "threx_intro",
  },
  threx_intro: {
    title: "What are you doing?",
    src: "../assets/portal.webp",
    type: "choice",
    text: "\"What are you doing!?\" Threx, the highest-ranked Seeker and de facto leader of your party, yells. \"We haven't even gone over the game plan yet. No one here knows a damn thing about you! Get your ass back with the others and tell them why they can trust you with their lives!\"\n\nYou look past him to where the remaining seven members of your party are congregated. Like you, they seem new to this.",
    choices: [
      { label: "Return to the entrance", next: "return_to_entrance" },
      { label: "Pull away and enter the portal on your own", next: "pull_away_portal" },
    ],
  },
  pull_away_portal: {
    title: "Enter the Portal",
    src: "../assets/portal.webp",
    type: "text",
    text: "\"Dumbass,\" Threx hisses as you pull free and enter the portal anyway.\n\nWho is he to stand in the way of your destiny?\n\nYou emerge on the other side, in another world. The rules are different here, like in most portals. Gravity is heavier;  the air has less oxygen.",
    next: "portal_entrance",
  },
  portal_entrance: {
    title: "Portal Entrance",
    src: "../assets/portal.webp",
    type: "text",
    text: "Shit, you think. You had been hoping for a world less punishing than your own; on one of those, you would have felt stronger.  On this one, you must fight for every breath and every step.\n\nOn the bright side, nothing here attacks you right away. That gives you the opportunity to take in your new surroundings.",
    next: "portal_view",
  },
  portal_view: {
    title: "Portal View",
    src: "../assets/portal.webp",
    type: "text",
    text: "Not only are the physical laws here slightly different from what you're used to, the visual cues induce vertigo, too. You have heard that anything is possible inside a portal; the sight before you confirms it.\n\nThe land stretches out and up, culminating in an inverted sphere at least fifty miles in diameter. Spindly purple fauna obscures most of the ground itself... and whatever creatures lurk beneath.",
    next: "portal_streams",
  },
  portal_streams: {
    title: "Portal Streams",
    src: "../assets/portal.webp",
    type: "text",
    text: "Crystal clear streams vein between the fauna, breaking it up into a patchwork of assorted purples. The liquid of the streams reflects the ground opposite it, and streams there do the same.\n\nThe result is a muted kaleidoscope.\n\nIt's beautiful, but it can also be brain breaking.",
    next: "portal_index",
  },
  portal_index: {
    title: "Portal Index",
    type: "text",
    text: "More importantly, the lack of an immediate threat gives you the chance to strategize. You take a moment to index your gear and think back on the training you have done in preparation for this adventure.\n\nIt also makes you think back on your experience in the Awakening Chamber. It was hard to believe it was only a week ago...",
    next: "protocol_intro",
  },
  inspect_edges: {
    title: "Inspect the Edges",
    type: "text",
    text: "Curious, you trace your eyes along the portal's circumference. This is the first time you've seen one up close. It's smaller than you imagined....\n\nAnd noisier.\n\nThe thing sloshes, buzzes, and whispers. It sounds like a beach, a server farm, and a distant train station all in one.\n\nIt also sounds utterly alien.",
    next: "edges_continued",
  },
  edges_continued: {
    title: "The First Gate",
    type: "choice",
    text: "There are all kinds of portals, and each hints at the dangers waiting on the other side.\n\nSome appear as buildings. Others as holes or spheres. Sometimes, their color gives the creatures inside away. Other times, the color may be an intention trap.\n\nGold portals usually indicate treasure, and this one was already measured to be E-rank, the easiest there is.\n\nBehind you, a group of other fresh operatives shuffle from foot to foot, anxious about clearing their first gate.",
    choices: [
      { label: "Step into the portal", next: "step_into_portal" },
      { label: "Return to the entrance", next: "return_to_entrance" },
    ],
  },
  return_to_entrance: {
    title: "Return to the Entrance",
    type: "text",
    text: "Better play it safe. This is your first time being so close to one of these, after all.\n\nYour new companions welcome you back. A few smile as you approach. Others are aloof and watch the portal with nervous or excited expressions.\n\nOne sneers at your arrival. This is the only person you know here. His name is Ronin Balore, and the two of you have never gotten along.",
    next: "team_intro",
  },
  team_intro: {
    title: "Meet Your Team",
    type: "text",
    text: "\"Scared to enter the portal on your own, huh?\" Ronin teases. \"It would have been better if you did; it would spare the rest of us the liability of having you on the team.\"\n\n\"That's not very nice,\" a woman says from behind him. She steps around Ronin and extends a hand in greeting. \"I'm Akemi, and apparently he's an asshole.\"",
    next: "choose_name",
  },
  choose_name: {
    title: "Who Are You?",
    text: "Before you can proceed, you need to choose a name for yourself. This name will be your identity in the game world.",
    type: "input",
    input: {
      field: "characterName", 
      label: "Enter your name:",
      next: "akemi_intro"
    }
  },
  akemi_intro: {
    title: "Meet Akemi",
    type: "text",
    text: "\"Nice to meet you, {{characterName}}.\" Akemi smiles. \"The rest of us went to the Ramsey Training Academy together. Here,\" she walks you around Ronin, who's still glaring at you, and gestures for the others to gather around, \"I'll introduce you.\"\n\n\"This is {{characterName}},\" she says. \"He's a-- whoops! I just realized I didn't even ask you what your class and ranking were! Fill us in, {{characterName}}!\"\n\nThe question makes you think back to your experience in the Activation Chamber at the GPA. Your time there was... eventful. One might even say traumatic.\n\nMeeting the Protocol for the first time always is.",
    next: "protocol_intro",
  },
  protocol_intro: {
    title: "Meet the Protocol",
    type: "text",
    text: "\"Please don't be alarmed,\" the androgenous artificial intelligence told you. Over two dozen needles pointed toward where you stood in the vertical MRI-looking machine.\n\nSurrounding you in the circular room were the technicians and Essence Analysists of the Global Protocol Authority, their faces lit by computer screens and flashing medical equipment.\n\nYou had followed a line of other potential operatives in here, and most had run out screaming.\n\nYeah, you remember thinking. No reason to be alarmed at all.",
    next: "failed_to_connect",
  },
  failed_to_connect: {
    title: "Failed to Connect",
    type: "text",
    text: "The needles plunged into you; the machine whirred to life; the technicians and analysts took their readings.\n\nThis was when the Protocol activated most operatives. This was when its augmented-reality messages appeared, and their hopes of becoming a hero were realized.\n\nYou did not activate.\n\n\"The Protocol has failed to connect,\" the AI said.\n\nYour clothes were handed back, and you were escorted outside.",
    next: "not_over_yet",
  },
  not_over_yet: {
    title: "Not Over Yet",
    type: "text",
    text: "\"It doesn't have to be over,\" the technician who escorted you said. You don't remember her name.\n\nShe handed you a physical device-- a digital readout tailored to your time in the chamber.\n\n\"Sometimes, the Protocol needs a little prompting. Enter your information as though you had been activated, raid a gate or two. Who knows,\" she smiled, \"maybe you'll be one of the lucky ones.\"\n\nYou had entered your information.",
    next: "stat_intro",
    //next should go to stat page with DND stat numbers, all starting at 10 with a point buy of an additional 10
    //after would then lead to equipment, menu, maps
    //then need to make sure they are going to the correct page depending on if they are with the team or entered portal alone
    //if with team - next: "back_to_team",
    //if alone - next: "portal_encounter",
  },
  stat_intro: {
    id: "stat-allocation",
    type: "stats",
    src: "../assets/portal.webp",
    text: "Distribute your stat points. Choose wisely, as your future depends on it.",
    stats: {
      Strength: 10,
      Dexterity: 10,
      Constitution: 10,
      Intelligence: 10,
      Wisdom: 10,
      Charisma: 10,
      points: 10
    },
    next: "class_confirmation",
  },
  class_confirmation: {
    id: "class-confirmation",
    type: "text",
    src: "../assets/portal.webp",
    text: "Distribute your stat points. Choose wisely, as your future depends on it.",
    next: "f",
  },
  back_to_team: {
    title: "Back to the Team",
    type: "text",
    text: "It's hard to believe that was only a week ago. In retrospect, it felt so formative...\n\nAs if the Protocol had been with you all along.\n\nYou tell the others what your selection was on the digital readout, careful not to mentioned your un-ranked status or the fact you're not activated.\n\nThey'd know anyway, if they already read your file.",
    next: "class_decision",
  },
};
