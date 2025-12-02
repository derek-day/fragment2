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
    type: "route",
    route: "alone",
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
    type: "route",
    route: "team",
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
    type: "classRedirect",
    src: "../assets/portal.webp",
    text: "It's hard to believe that was only a week ago. In retrospect, it felt so formative...\n\nAs if the Protocol had been with you all along.\n\nYou tell the others what your selection was on the digital readout, careful not to mentioned your un-ranked status or the fact you're not activated.\n\nThey'd know anyway, if they already read your file.",
    classNext: {
      Warrior: {
        team: "team_Warrior",
        alone: "alone_equipment",
      },
      Mage: {
        team: "team_Mage",
        alone: "alone_equipment",
      },
      Summoner: {
        team: "team_Summoner",
        alone: "alone_equipment",
      },
      Undecided: {
        team: "team_Undecided",
        alone: "alone_equipment",
      },
      Mixed: {
        team: "team_Mixed",
        alone: "alone_equipment",
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
    type: "text",
    next: "portal_encounter",
    text: "Just as you finish reviewing your gear, something small and quick darts at you from the nearest tuft of fauna.\n\nYou try to react, but the strain of this place makes you sluggish.\n\nYou raise your weapon just in time to defend yourself, but you know this fight will be harder than you hoped.",
  },
  portal_encounter: {
    title: "First Battle",
    type: "battle",
    enemy: {
      name: "Critter",
      maxHP: 100,      // Enemy health
      ac: 10,          // Armor Class (difficulty to hit)
      attack: 12,      // Attack bonus
      magic: 10        // Magic attack bonus
    },
    text: "",
    fail: "death",
    next: "portal_victory",
  },
  team_Warrior: {
    title: "Warrior",
    type: "text",
    next: "team_intro1",
    text: "\"You and Kaelion will get along great then,\" Akemi says, gesturing to a man in armor so fancy it could have supported your family for a month.\n\nYou're not too sure. There aren't too many rich people on your side of town.",
  },
  team_Mage: {
    title: "Mage",
    type: "text",
    next: "team_intro1",
    text: "Akemi smiles. \"I'm sure you and Sheemie will have plenty to talk about.\" She leans in, and you detect a hint of lavender and sandalwood. \"Just don't get him started on ecology.\"\n\nYou nod, thinking over the advice.",
  },
  team_Summoner: {
    title: "Summoner",
    type: "text",
    next: "team_intro1",
    text: "Akemi smirks. \"As long as your goal isn't to summon the creepy things Mitzi talks about, I think we'll still get along fine!\"\n\nYou consider asking for specifics, but decide now might not be the time.",
  },
  team_Undecided: {
    title: "Undecided",
    type: "text",
    next: "team_intro1",
    text: "\"Me, too!\" Akemi exclaims. \"Well, kinda. I just don't wanna get bogged down into a specific skillset, yaknow?\"\n\n\"Maybe that's something we can work on together. I was voted 'most likely to claim to be a mentor' at the Ramsey Academy three years in a row.\"",
  },
  team_Mixed: {
    title: "Mixed",
    type: "text",
    next: "team_intro1",
    text: "\"Me, too!\" Akemi exclaims. \"Well, kinda. I just don't wanna get bogged down into a specific skillset, yaknow?\"\n\n\"I can already tell we're going to be best friends!\"",
  },
  team_intro1: {
    title: "Harla",
    type: "text",
    text: "Akemi turns back to the others.\n\n\"Well, don't be afraid, guys! Introduce yourselves to our new friend!\"\n\nA large black woman is the first to raise her hand in greeting. She is wearing armor that looks like it's already seen quite a bit of fighting. \"I'm Harla,\" she says, \"the closest thing this group has to a healer. I can take hits,\" she pauses to address the armor, \"but I would rather not.\"",
    next: "team_intro2",
  },
  team_intro2: {
    title: "Kaelion",
    type: "text",
    text: "\"Kaelion Virehart,\" says the man in fancy armor next to her. It's difficult to pay attention to anything about him besides that and the handlebar moustache.\n\nAnd the voice.\n\n\"I await our shared endeavor ahead. May the wind be forever at our backs!\"\n\nHe sounds like a knight in the tales of yore...",
    next: "team_intro3",
  },
  team_intro3: {
    title: "Team Intro",
    type: "Sheemie",
    text: "\"Sheemie!\" the short boy yells from next to him. The greeting is piercing and immediately makes you forget about the knight.\n\nHe literally says nothing else. He just shouts his name and stares.\n\nYou nod back.",
    next: "team_intro4",
  },
  team_intro4: {
    title: "Team Intro",
    type: "Mitzi",
    text: "Rivaling his energy in the opposite direction, a girl in skin-tight black leather says, simply, \"Mitzi\"\n\nShe also says nothing else.\n\nYou're okay with that.",
    next: "team_intro5",
  },
  team_intro5: {
    title: "Aleth",
    type: "text",
    text: "Akemi sighs and nods at the aloof member of the group. He has been close enough to listen to your conversation, but remains transfixed on the portal.\n\n\"And that's Aleth,\" she says. \"Don't let his anti-social behavior fool you; he's a real sweetheart.\"\n\n\"Something about this doesn't feel right,\" Aleth whispers.\n\nAkemi frowns. \"He says stuff like that a lot. You'll get used to it.\"",
    next: "ronin_intro",
  },
  ronin_intro: {
    title: "Ronin",
    type: "choice",
    text: "You look at Ronin, who has distanced himself from the others. Like Aleth, the Seeker-in-training has his attention firmly on the portal. Unlike Aleth, it seems he is doing so simply to avoid you and the others.",
    choices: [
      { label: "Introduce Ronin to the others", next: "introduce_ronin" },
      { label: "Say nothing", next: "nothing_ronin" },
    ],
  },
  introduce_ronin: {
    title: "Introduce Ronin",
    type: "text",
    text: "\"That's Ronin,\" you say. \"He's usually a lot friendlier than this. He just really doesn't like me.\"\n\n\"Why doesn't he like you?\" Harla asks. She is leaning forward, hungry for gossip.\n\nBefore you can answer, your conversation is interrupted.",
    next: "threx_brief",
  },
  nothing_ronin: {
    title: "Say Nothing",
    type: "text",
    text: "You keep quiet. Ronin had his chance to make a good first impression. It isn't your fault he's a jerk.",
    next: "threx_brief",
  },
  threx_brief: {
    title: "Threx Briefing",
    type: "choice",
    text: "\"Alright!\" Threx yells. \"It's about time to head in. Gather around for the obligatory pre-raid briefing.\"\n\nThere are grumbled affirmatives from most of the group, but you feel differently.\n\nYou feel...",
    choices: [
      { label: "Excited", next: "excited" },
      { label: "Nervous", next: "nervous" },
      { label: "Like this is a waste of time", next: "waste" },
    ],
  },
  excited: {
    title: "Excited",
    type: "text",
    text: "You sway from one foot to another, excited to take this first step in activating and realizing your true potential.\n\nBy the time you clear this gate, the Protocol will have to want you.",
    next: "excited2",
  },
  excited2: {
    title: "Excited",
    type: "text",
    text: "\"These gates appeared three years ago,\" the party leader begins, citing common knowledge. \"They can lead us anywhere, and can lead anything to us. If a gate isn't cleared in time, it opens a rift in our world. We do not want a rift.\"",
    next: "excited3",
  },
  excited3: {
    title: "Excited",
    type: "text",
    text: "\"The world before this one was complacent. We cannot be complacent.\n\nThe world before this one failed. We cannot fail.\n\nWe have two things the old world did not. The first is the Protocol. Without it, we would be the weak, biologically-damned beings of our ancestors. Without it, we'd be no match for most of what's in these gates.\n\nThe second things is each other.\n\nNow, let's check our gear a final time and then kick some ass.\"",
    next: "",
  },
  nervous: {
    title: "Nervous",
    type: "text",
    text: "You sway from one foot to another, nervous to take this first step into a world that can kill you.\n\nWhat if, after everything you face in there, the Protocol still doesn't activate you?",
    next: "",
  },
  waste: {
    title: "Waste of Time",
    type: "text",
    text: "\"These gates appeared three years ago,\" the party leader begins, citing common knowledge. \"They can lead us anywhere, and can lead anything to us. If a gate isn't cleared in time, it opens a rift in our world. We do not want a rift.\"",
    next: "waste2",
  },
  waste2: {
    title: "Waste of Time",
    type: "text",
    text: "Threx talks about the fall of the world that existed before the gates. He talks about the arrival of the Protocol-- humanity's mysterious and powerful benefactor-- that swooped in to save the day. He talks about the importance of staying together.",
    next: "waste3",
  },
  waste3: {
    title: "Waste of Time",
    type: "text",
    text: "You tune most of it out.\n\nNear the end of his speech, Threx notices you aren't paying attention.\n\nHe claps his hands in front of you, prompting a start.",
    next: "waste4",
  },
  waste4: {
    title: "Waste of Time",
    type: "text",
    text: "\"I'm sorry, am I boring you?\" He looks between you and Ronin. \"I was worried about you two freelancers before, but now I'm concerned.\"\n\n\"Don't lump me in with him!\" Ronin snaps. \"I'm paying attention. I have my gear. I'm ready to do this thing. Besides,\" he squares up with the C-Class Seeker, \"Silas Knorrs is freelance. Ember Naes, too. Give us more credit!\"",
    next: "waste5",
  },
  waste5: {
    title: "Waste of Time",
    type: "choice",
    text: "\"That's true. Half of our top hunters are freelance.\" Threx leans forward. \"But so are most of the bodies we bring back. Are you sure you wanna do this?\"\n\nRonin turns back to the portal, and Simon's attention turns to you.\n\n\"What about you? It isn't too late to back out, kid.\"",
    choices: [
      { label: "Go home", next: "go_home" },
      { label: "Punch Threx in the face", next: "punch_threx" },
      { label: "\"I can handle this.\"", next: "handle_this" },
    ],
  },
  go_home: {
    title: "Go Home",
    type: "text",
    text: "This was a mistake. Gatebreaking isn't for you. That's okay; maybe you'll have better luck working retail or something.\n\nAt least you realized your limitations before it was too late.\n\nRonin laughs as you walk off, but that's okay. Let him have his glory.\n\nAt least you have your life.",
    next: "home_end",
  },
  home_end: {
    title: "The End",
    type: "text",
    text: "The End.",
  },
  handle_this: {
    title: "Handle This",
    type: "text",
    text: "\"Fair enough, but don't come crying to me if you get in above your head out there.\"\n\nThrex gives you and Ronin a final piercing look before turning back to others. \"Let's do a final gear check before leading these two to their deaths.\"",
    next: "",
  },
  punch_threx: {
    title: "Punch Threx",
    type: "roll",
    text: "You could argue your point, but it's easier to show than to tell. This'll teach him to doubt a freelance hunter!",
    roll: {
      stat: "Strength",
      dc: 12,
      successText: "Your strike is quick, powerful, and straight to the point. It hits Threx clean across the face, eliciting a grunt from the big man and a gasp from the others. Even Ronin seems impressed.",
      failText: "Threx has been fighting for a long time, and against creatures far more powerful than you. He easily ducks your fist and retorts with a strike of his own.\n\nA moment later, you're looking up at the man who hit you.",
      nextSuccess: "threx_hits",
      nextFail: "threx_miss",
    },
  },
  threx_hits: {
    title: "Threx Hits Back",
    type: "text",
    text: "Your strike is quick, powerful, and straight to the point. It hits Threx clean across the face, eliciting a grunt from the big man and a gasp from the others. Even Ronin seems impressed.\n\nAny celebration is short-lived, though. Threx quickly shrugs off the strike, and returns with an attack of his own.",
    next: "threx_hits2",
  },
  threx_hits2: {
    title: "Threx Hits Back",
    type: "text",
    text: "Threx wipes the floor with the player immediately, showcasing the power disparity between class E and C.",
    next: "very_dumb",
  },
  threx_miss: {
    title: "Threx Missed",
    type: "text",
    text: "Threx has been fighting for a long time, and against creatures far more powerful than you. He easily ducks your fist and retorts with a strike of his own.\n\nA moment later, you're looking up at the man who hit you.",
    next: "very_dumb",
  },
  very_dumb: {
    title: "Very Dumb",
    type: "text",
    text: "\"That was very dumb of you... but I appreciate your gusto. Here...\"",
    next: "thanks_threx",
  },
  thanks_threx: {
    title: "Potion added",
    type: "text",
    text: "Your digital readout dings with a notification.\n\nHealth potion added.",
    next: "now_what",
  },
  now_what: {
    title: "Now What?",
    type: "choice",
    text: "\"Now, are you backing out of this thing, or what?\"",
    choices: [
      { label: "Go home", next: "go_home" },
      { label: "\"I can handle this.\"", next: "handle_this" },
    ],
  },
};
