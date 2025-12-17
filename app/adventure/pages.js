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
    type: "choices",
    text: "You step forward, prepared to enter, when a strong hand grabs your wrist.\n\n\"What are you doing!?\" Threx, the highest-ranked Breaker and leader of your party, yells. \"We haven't even gone over the game plan yet! No one here knows a damn thing about you! Get back with the others!\"",
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
    text: "\"Dumbass,\" Threx hisses as you pull free and enter the portal anyway.\n\nWho is he to stand in the way of your destiny?\n\nYou emerge on the other side, in another world. The rules are different here. You were hoping for a world less punishing than you own. In this one, however, where the gravity is heavier and the air thinner, each step and every breath is a struggle.",
    next: "portal_entrance",
  },
  portal_entrance: {
    title: "Portal Entrance",
    src: "../assets/forest.webp",
    type: "text",
    text: "Even more, the place's qualities assault your senses. The sweet aroma makes your mouth water, and the visual cues induce vertigo.\n\nThe land stretches out and up, culminating in an inverted sphere fifty miles across. Spindly purple fauna obscures most of the ground itself... and whatever creatures lurk beneath. Crystal clear streams vein between the overgrowth, breaking it up into a patchwork of assorted purples. The liquid reflects the ground opposite it, where more streams do the same.",
    next: "portal_view",
  },
  portal_view: {
    title: "Portal View",
    src: "../assets/forest.webp",
    type: "text",
    text: "The result is a muted kaleidoscope. It's beautiful, but it can also be brain-breaking.\n\nThe lack of an immediate threat gives you the chance to strategize. You take a moment to index your gear and think back on your training, of what little there was. You had signed up for this Break at the last minute, after several long days of soul-searching.\n\nThe thought leads you to a memory--  your experience in the Activation Chamber at the GPA. It... wasn't exactly what you were expecting...",
    next: "protocol_intro",
  },
  inspect_edges: {
    title: "Inspect the Edges",
    type: "text",
    text: "Curious, you trace your eyes along the portal's circumference. This is the first time you've seen one up close. It's smaller than you imagined....\n\nAnd noisier.\n\nThe thing sloshes, buzzes, and whispers. It sounds like a beach, a server farm, and a distant train station all in one.",
    next: "edges_continued",
  },
  edges_continued: {
    title: "The First Gate",
    type: "choice",
    text: "There are all kinds of portals, and each hints at the dangers waiting on the other side.\n\nSome appear as buildings. Others as holes or spheres. Sometimes, their color gives the creatures inside away. Other times, the color may be an intentional trap.\n\nGold portals usually indicate treasure, and this one was already measured to be E-rank, the easiest there is.",
    choices: [
      { label: "Step into the portal", next: "step_into_portal" },
      { label: "Return to the entrance", next: "return_to_entrance" },
    ],
  },
  return_to_entrance: {
    title: "Return to the Entrance",
    type: "route",
    route: "team",
    text: "Better play it safe. Too many Breakers have lost their lives rushing into gates they weren't ready for.\n\nYour companions welcome you back. A few smile as you approach. Others watch the portal with nervous or excited expressions.\n\nOne sneers at you. This is the only person you know here, and he hates your guts.",
    next: "team_intro",
  },
  team_intro: {
    title: "Meet Your Team",
    type: "text",
    text: "\"Scared to enter the portal on your own, huh?\" Ronin teases. \"It would have been better if you did; it would spare the rest of us the liability of having you on the team.\"\n\n\"That's not very nice,\" a woman says from behind him. She steps around Ronin and extends a hand in greeting. \"I'm Akemi, and apparently **he's** an asshole.\"",
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
    text: "\"Nice to meet you, {{characterName}}.\" Akemi smiles. \"The rest of us went to the Ramsey Training Academy together. I'll introduce you.\" She pushes past Ronin and gestures for the others to gather around.\n\n\"What's your class and ranking?\" She whispers before the others are in earshot. \"I don't remember seeing your name on the docket for today.\"\n\n\You nod. She wouldn't have. You signed up for this Break last minute and only after long days of soul-searching.\n\nThe question makes you think back to your experience in the Activation Chamber at the GPA. Your time there wasn't exactly what you were expecting...",
    next: "protocol_intro",
  },
  protocol_intro: {
    title: "Meet the Protocol",
    type: "text",
    src: "../assets/lab.webp",
    text: "\"Please don't be alarmed,\" the androgenous voice of the Halycon AI told you. From where you stood in the vertical MRI-looking machine, a dozen needles pointed your way.\n\nBeyond them were the half-dozen technicians and essence analysts of the Global Protocol Authority (GPA), their faces lit by computer screens and flashing medical equipment. You had followed a line of other potential operatives in here, and most had run out screaming.\n\n\"Yeah,\" you remember whispering. \"Nothing to be alarmed about here.\"",
    next: "failed_to_connect",
  },
  failed_to_connect: {
    title: "Failed to Connect",
    src: "../assets/lab.webp",
    type: "text",
    text: "The needles plunged into you. The machine whirred to life; the technicians and analysts took their readings.\n\nThis moment was when the AI bridged the gap, and the Protocol activated most Breakers. This was when the mysterious augmented-reality messages appeared. This was where the hero's journey was supposed to begin.\n\nThis was where yours did not.\n\n\"The Protocol has failed to connect,\" the AI told you.",
    next: "not_over_yet",
  },
  not_over_yet: {
    title: "Not Over Yet",
    src: "../assets/lab.webp",
    type: "text",
    text: "Your clothes were handed back to you, and you were escorted outside. A digital reader replaced the AR display you were hoping for, tailored to your time in the chamber. It was make-believe, a cosplay of the version of yourself you had just been denied.\n\nSome Breakers were insane enough to brave gates without being activated yet. Their hope-- before their skulls were usually crushed by whatever beasts waited inside-- was that the Protocol would change its mind.\n\nYou, apparently, were one of the insane ones, because you entered your wish, hoping it would be made real.",
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
    src: "../assets/lab.webp",
    text: "Distribute your stat points. Choose wisely, as your future depends on it.",
    stats: {
      HP: 20,
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
    src: "../assets/lab.webp",
    text: "You tell the others what your selection was on the digital readout, careful not to mention your unranked status or that you're not activated.  They'll eventually know anyway, if they bother to read your file. For now, though, it's better if only Ronin thinks you're a liability.",
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
    src: "../assets/stream.webp",
    type: "text",
    next: "portal_encounter",
    text: "Something small and quick darts at you from the nearest tuft of fauna, pulling you from the past. You try to react, but the strain of this place makes you sluggish.\n\nYou raise your weapon just in time to defend yourself, but you already know this fight will be more challenging than you hoped.",
  },
  portal_encounter: {
    title: "First Battle",
    src: "../assets/stream.webp",
    type: "battle",
    enemy: {
      name: "Critter",
      maxHP: 10,      // Enemy health
      ac: 10,          // Armor Class (difficulty to hit)
      attack: 2,      // Attack bonus
      magic: 1        // Magic attack bonus
    },
    text: "",
    fail: "death",
    next: "portal_victory",
  },
  team_Warrior: {
    title: "Warrior",
    type: "text",
    next: "team_intro1",
    text: "\"You and Kaelion will get along great then,\" Akemi says, gesturing to a man in armor so fancy it could have supported your family for a month.\n\nYou doubt her assumption. There aren't too many rich people on your side of town.",
  },
  team_Mage: {
    title: "Mage",
    type: "text",
    next: "team_intro1",
    text: "Akemi smiles. \"I'm sure you and Sheemie will have plenty to talk about.\" She leans in, and you detect a hint of lavender and sandalwood. \"Just don't get him started on ecology.\"\n\nYou cock your head, unsure of how to take the advice.",
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
    text: "\"Same here!\" Akemi exclaims. \"Well, kinda. I just don't wanna get stuck with a specific skillset, yaknow?\"\n\nYou nod, knowing exactly how she feels. If you ever do get activated, there would be a million different paths to take. How could anyone ever decide on just one?",
  },
  team_Mixed: {
    title: "Mixed",
    type: "text",
    next: "team_intro1",
    text: "\"Same here!\" Akemi exclaims. \"Well, kinda. I just don't wanna get stuck with a specific skillset, yaknow?\"\n\nYou nod, knowing exactly how she feels. If you ever do get activated, there would be a million different paths to take. How could anyone ever decide on just one?",
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
    text: "\"Kaelion Virehart,\" says the man in fancy armor next to her. It's difficult to pay attention to anything about him besides that and the handlebar moustache.\n\nAnd his choice of words. He sounds like a knight in the stories your mom used to read you before bed.\n\n\"I await our shared endeavor ahead. May the wind be forever at our backs!\"",
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
    text: "Akemi sighs and nods at the final member of the group. He has been close enough to listen to your conversation, but remains transfixed on the portal.\n\n\"And that's Aleth,\" she says. \"Don't let his anti-social behavior fool you; he's a real sweetheart.\"\n\n\"Something about this doesn't feel right,\" Aleth whispers.\n\nAkemi frowns. \"He says stuff like that a lot. You'll get used to it.\"",
    next: "ronin_intro",
  },
  ronin_intro: {
    title: "Ronin",
    type: "choice",
    text: "You look at Ronin, who has distanced himself from the others. Like Aleth, the Breaker-in-training has his attention firmly on the portal. Unlike Aleth, it seems he is doing it to avoid you and the others.",
    choices: [
      { label: "Introduce Ronin to the others", next: "introduce_ronin" },
      { label: "Say nothing", next: "nothing_ronin" },
    ],
  },
  introduce_ronin: {
    title: "Introduce Ronin",
    type: "text",
    text: "\"That's Ronin,\" you say. \"He's usually a lot friendlier than this. He just **really** doesn't like me.\"\n\n\"Why doesn't he like you?\" Harla asks. She is leaning forward, hungry for gossip.",
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
    text: "You sway from one foot to another, excited to take this first step toward activating and realizing your true potential.\n\nBy the time you clear this gate, the Protocol will want you.",
    next: "excited2",
  },
    nervous: {
    title: "Nervous",
    type: "text",
    text: "You sway from one foot to another, nervous to take this first step into a world that can kill you.\n\nWhat if, after everything you face in there, the Protocol **still** doesn't activate you?",
    next: "threx_brief2",
  },
  threx_brief2: {
    title: "Threx Briefing",
    type: "text",
    text: "\"These gates appeared three years ago,\" the party leader begins, citing common knowledge. \"They can lead us anywhere, and can lead anything to us. If a gate isn't cleared in time, it opens a rift in our world. We do **not** want a rift.\"",
    next: "threx_brief3",
  },
  threx_brief3: {
    title: "Threx Briefing",
    type: "text",
    text: "\"The world before this one failed. We cannot fail.\n\nWe have two things the old world did not. The first is the Protocol. Without it, we would be the weak, biologically-damned beings that our ancestors were. Without it, we'd be no match for most of what's in these gates. Halycon has connected us to that entity, and we're stronger now because of it.\n\nThe second things is each other.\n\nNow, let's check our gear a final time and then kick some ass!\"",
    next: "team_equipment",
  },
  waste: {
    title: "Waste of Time",
    type: "text",
    text: "\"These gates appeared three years ago,\" the party leader begins, citing common knowledge. \"They can lead us anywhere, and can lead anything to us. If a gate isn't cleared in time, it opens a rift in our world. We do **not** want a rift.\"",
    next: "waste2",
  },
  waste2: {
    title: "Waste of Time",
    type: "text",
    text: "Threx talks about the fall of the world that existed before the gates. He talks about the arrival of the Protocol, and how the Halycon AI bridged the gap between it and humanity. He talks about the importance of staying together as a species.\n\nYou tune most of it out.\n\nAt least, up until the moment the big man claps his hands in your face.",
    next: "waste3",
  },
  waste3: {
    title: "Waste of Time",
    type: "text",
    text: "\"I'm sorry, am I boring you?\" He looks between you and Ronin. \"I was worried about you two freelancers before, but now I'm **concerned**.\"\n\n\"Don't lump me in with him!\" Ronin snaps. \"I'm paying attention. I have my gear. I'm ready to do this thing. Besides,\" he squares up with the C-Class Breaker, \"Silas Knorrs is freelance. Ember Naes, too. Give us more credit!\"",
    next: "waste4",
  },
  waste4: {
    title: "Waste of Time",
    type: "choice",
    text: "\"That's true. Half of our top hunters **are** freelance.\" Threx leans forward. \"But so are three-quarters of the bodies we bring back. Are you sure you wanna do this?\"\n\nRonin turns back to the portal, and Threx's attention turns to you.\n\n\"What about you? It isn't too late to back out, kid.\"",
    choices: [
      { label: "Go home", next: "go_home" },
      { label: "Punch Threx in the face", next: "punch_threx" },
      { label: "\"I can handle this.\"", next: "handle_this" },
    ],
  },
  go_home: {
    title: "Go Home",
    type: "end",
    text: "This was a mistake. Gatebreaking isn't for you. That's okay; maybe you'll have better luck working retail or something.\n\nRonin laughs as you walk off, but that's okay. Let him have his glory.\n\nAt least you have your life.\n\nThe End.",
    next: "home_end",
  },
  handle_this: {
    title: "I Can Handle This",
    type: "text",
    text: "\"Fair enough, but don't come crying to me if you get in above your head out there.\"\n\nThrex gives you and Ronin a final piercing look before turning back to others. \"Let's do a final gear check before leading these two to their deaths.\"",
    next: "team_equipment",
  },
  punch_threx: {
    title: "Punch Threx In The Face",
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
    text: "Threx wipes the floor with you immediately, showcasing the power disparity between class E and C.",
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
    text: "\"That was very dumb of you... but I appreciate your gusto. Here...\"\n\nYour digital readout dings with a notification.\n\nHealth potion added.",
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
  team_equipment: {
    title: "Equipment",
    // type: "equipment",
    type: "text",
    text: "",
    next: "team_portal_entry",
  },
  team_portal_entry: {
    title: "Team Portal Entry",
    src: "../assets/forest.webp",
    type: "text",
    text: "With your gear checked and your role in the party understood as best it can be, you follow the others to the portal.\n\nIt crackles, sloshes, and whispers at your approach, speaking in a language even its denizens fail to understand. Its surface runs like quicksilver. Its golden facade sparkles against the sun. It's the most beautiful thing you've ever seen.\n\nAnd also the most terrifying.\n\nYou enter... and all you've ever known disappears behind you.",
    next: "team_portal_inside",
  },
  team_portal_inside: {
    title: "Team Portal Inside",
    src: "../assets/forest.webp",
    type: "choice",
    text: "You emerge on the other side, in another world. The rules are different here, like in most portals. Gravity is heavier; the air has less oxygen.\n\n**Shit**, you think. You had been hoping for a world less punishing than your own; on one of those, you would have felt stronger. On this one, you must fight for every breath and every step.\n\n\"Here,\" Akemi says, handing you a vial of caustic purple liquid. \"It'll fortify you against the environment for the next few hours.\"",
    choices: [
      { label: "Take the vial", next: "take_vial" },
      { label: "Hold off for now", next: "hold_vial" },
    ],
  },
  take_vial: {
    title: "Take the Vial",
    type: "text",
    text: "You drain the vial, and the ill effects of this world immediately dull.\n\n\"All potions work the same way,\" Akemi tells you. \"The effect is immediate, and it'll last for however long it is advertised! The only exception is health potions; those will heal you right up and keep you that way unless you get hurt again!\"\n\n\"And poison,\" Mitzi says, deadpan. \"That's permanent, too.\"",
    next: "team_portal_view_take"
  },
  hold_vial: {
    title: "Hold Off For Now",
    type: "text",
    text: "You thank Akemi and pocket the potion for later. This place is brutal, but it's nothing you can't handle.\n\nBetter to hold on to it until you actually need it.\n\nItem Added to Inventory",
    next: "team_portal_view_hold"
  },
  team_portal_view_take: {
    title: "Team Portal View",
    src: "../assets/forest.webp",
    type: "text",
    text: "You marvel at your new surroundings. Not only are the physical laws here different from what you're used to, but its sensory qualities also assault you. The sweet aroma makes your mouth water, and the visual cues induce vertigo.\n\nThe land stretches out and up, culminating in an inverted sphere fifty miles across. Spindly purple fauna obscures most of the ground itself... and whatever creatures lurk beneath. Crystal clear streams vein between the overgrowth, breaking it up into a patchwork of assorted purples. The liquid reflects the ground opposite it, where more streams do the same.\n\nThe result is a muted kaleidoscope. It's beautiful, but it can also be brain-breaking.\n\nAll of it, when combined, also creates an unfortunate distraction.",
    next: "team_portal_encounter_take",
  },
  team_portal_view_hold: {
    title: "Team Portal View",
    src: "../assets/forest.webp",
    type: "text",
    text: "You marvel at your new surroundings. Not only are the physical laws here different from what you're used to, but its sensory qualities also assault you. The sweet aroma makes your mouth water, and the visual cues induce vertigo.\n\nThe land stretches out and up, culminating in an inverted sphere fifty miles across. Spindly purple fauna obscures most of the ground itself... and whatever creatures lurk beneath. Crystal clear streams vein between the overgrowth, breaking it up into a patchwork of assorted purples. The liquid reflects the ground opposite it, where more streams do the same.\n\nThe result is a muted kaleidoscope. It's beautiful, but it can also be brain-breaking.\n\nAll of it, when combined, also creates an unfortunate distraction.",
    next: "team_portal_encounter_hold",
  },
  team_portal_encounter_take: {
    title: "What Is That?",
    src: "../assets/stream.webp",
    type: "choice",
    text: "Something small and quick darts at you from the nearest tuft of fauna. You react quickly to the threat, beating your companions to the punch.",
    choices: [
      { label: "Eliminate the threat", next: "team_portal_battle" },
      { label: "Dive for cover", next: "team_portal_dive" },
    ],
  },
  team_portal_battle: {
    title: "First Battle",
    src: "../assets/stream.webp",
    type: "battle",
    enemy: {
      name: "Critter",
      maxHP: 10,      // Enemy health
      ac: 10,          // Armor Class (difficulty to hit)
      attack: 2,      // Attack bonus
      magic: 1,
      points: 5,
      item: ""        // Magic attack bonus
    },
    team: [
      { name: "Akemi", maxHP: 15, ac: 12, attack: 3, magic: 5 },
      { name: "Harla", maxHP: 20, ac: 14, attack: 4, magic: 2 },
      { name: "Kaelion", maxHP: 18, ac: 13, attack: 5, magic: 3 },
      { name: "Sheemie", maxHP: 12, ac: 11, attack: 2, magic: 6 },
      { name: "Mitzi", maxHP: 14, ac: 12, attack: 3, magic: 4 },
      { name: "Aleth", maxHP: 16, ac: 13, attack: 4, magic: 3 },
    ],
    text: "",
    fail: "death",
    next: "team_portal_battle_finish",
  },
  team_portal_dive: {
    title: "Dive For Cover",
    src: "../assets/stream.webp",
    type: "text",
    text: "Aleth addresses the threat, stilling it with a throwing knife to the face.\n\n\"Not bad for someone who hasn't been activated,\" Threx says, patting him on the back. \"Mark my words: the Protocol will notice you yet!\"",
    next: "team_portal_battle_finish",
  },
  team_portal_encounter_hold: {
    title: "What Is That?",
    src: "../assets/stream.webp",
    type: "text",
    text: "Something small and quick darts at you from the nearest tuft of fauna. You try to react, but the strain of this place makes you sluggish.\n\nLuckily, you're not here alone. Aleth addresses the threat, stilling it with a throwing knife to the face.\n\n\"Not bad for someone who hasn't been activated,\" Threx says, patting him on the back. \"Mark my words: the Protocol will notice you yet!\"",
    next: "team_portal_battle_finish",
  },
  team_portal_battle_finish: {
    title: "Critter Defeated",
    src: "../assets/stream.webp",
    type: "text",
    text: "\"That's not fair!\" Ronin yells, arriving with his own blade a moment too late. \"Unactivated people only get pretend points. I'm activated, like most of you. Why wasn't it split between us evenly?\"\n\n\"The Protocol registers assists somehow,\" Akemi explains. \"It knows who put the work in. There's nothing 'pretend' about that.\"\n\n\"You just need to be faster, my friend,\" Kaelion says, flashing Ronin a playful grin.\"",
    next: "team_portal_victory",
  },
  team_portal_victory: {
    title: "Breaker Points?",
    src: "../assets/stream.webp",
    type: "text",
    text: "\"I can't wait to start investing my Breaker points into Mage abilities!\" Sheemie exclaims. \"I'd love to specialize in something plant-based.\"\n\n\"Poor kid never left his treehouse,\" Mitzi says in a stage whisper.\n\n\"Who **doesn't** love a good treehouse?\" Sheemie laughs. \"Nah, I just really wanna get into the Thomur Guild. I heard they have a penchant for recruits who hyper-specialize in things most people don't think about.\"\n\n\"But...plants?\"",
    next: "team_portal_victory2",
  },
  team_portal_victory2: {
    title: "Guilds?",
    src: "../assets/stream.webp",
    type: "text",
    text: "\"Oh, please,\" Harla cuts in. \"Like you're one to talk, Mitzi. Don't you plan to join The Silhouettes once you're strong enough? Those people are weirder than some tiny guild no one has heard about.\"\n\n\"Hey!\" Sheemie exclaims in his high-pitched way.\"\n\nMitzi ignores the outburst. \"Well, yeah. I mean, either **The Silhouettes** or **Protocol Null**.\"\n\nShe doesn't elaborate. She doesn't need to. Everyone knows about the two major breakaway factions.",
    next: "team_portal_victory3",
  },
  team_portal_victory3: {
    title: "Destroy The Protocol?",
    src: "../assets/stream.webp",
    type: "text",
    text: "\"How can one be so ambivalent toward the Protocol?\" Kaelion Virehart asks. \"You used the Activation Chamber like the rest of us. You've embarked upon this quest like the rest of us, too. Do you surely intend to use the Protocol to evolve... so that you can destroy the Protocol?\"\n\nMitzi shrugged. \"I'd settle for understanding it. It seems to me like no one else is questioning what this thing is. I mean, what does it want? Is it really on our side? If The Silhouettes or Protocol Null get me closer to an answer, then that's where I'm heading.\"",
    next: "team_portal_victory4",
  },
  team_portal_victory4: {
    title: "Guilds and Factions",
    src: "../assets/stream.webp",
    type: "text",
    text: "\"You could always join the **Veil Cult**,\" Harla offers. \"They claim to have all the answers.\"\n\nMitzi rolls her eyes.\n\nAkemi turns to you. \"How about you, {{characterName}}. Are there any factions or guilds you have your eye on?\"",
    next: "team_portal_victory5",
  },
  team_portal_victory5: {
    title: "Guild Opinion",
    src: "../assets/stream.webp",
    type: "choice",
    text: "You've thought about this question a lot. Who hasn't? There are few people alive who haven't fantasized about fighting alongside the heroes of the **Global Protocol Authority (GPA)**, or experimenting with the exciting tech of the **Epoch Corporation**.\n\nBut there are plenty of smaller guilds, too. The **Thomur Guild** specializes in niche markets. The **Silk Road** specializes in trade. You know of at least a dozen guilds that most people would kill to be a member of.\n\nThen again, there's a certain coolness factor of remaining freelance, too.\n\nYou realize Akemi is still staring at you, waiting for an answer.",
    choices: [
      { label: "Global Protocol Authority", next: "guild_gpa" },
      { label: "The Epoch Corporation", next: "guild_epoch" },
      { label: "The Silhouette", next: "guild_silhouette" },
      { label: "Protocol Null", next: "guild_protocol_null" },
      { label: "The Veil Cult", next: "guild_veil_cult" },
      { label: "The Silk Road", next: "guild_silk_road" },
      { label: "The Thomur Guild", next: "guild_thomur_guild" },
      { label: "Freelance", next: "guild_freelance" },
      { label: "You haven't decided", next: "guild_no_preference" },
    ],
  },
  guild_gpa: {
    title: "Global Protocol Authority",
    type: "text",
    text: "You shrug. \"The GPA, probably. There's a global element there, and they tend to get priority with Breaks.\" You pause before adding, \"Plus, they're the closest thing we have to what existed before the gates.\"\n\n\"That's understandable,\" Akemi says. \"The GPA is the route the Ramsey Academy pushed most of us to go in, too. It makes sense, seeing as they fund the place and everything.\" With a wink, she adds, \"You'd fit in nicely there; they always get the cutest Breakers.\"\n\nYou're not sure if she's joking, but you chuckle just to be safe.",
    next: "keep_moving",
  },
  guild_epoch: {
    title: "Epoch Corporation",
    type: "text",
    text: "\"Probably the Epoch Corporation,\" you say, thinking of the countless advancements they have given the world since their inception.\n\nAkemi opens her mouth to respond, but Ronin beats her to it.\n\n\"Ha! Like E-Corp would want anything to do with you! They worship ingenuity and originality above all else. What would they want with someone as morally bankrupt as you!\"\n\n\"What's he talking about?\" Akemi asks.\n\nYou notice Harla leaning in, too, anxious for potential drama. The others look on, even though they've clearly heard the slight. You're not sure what Ronin is talking about, but you remember that he also wanted to join the Epoch Corporation.\n\nIs he worried you might keep him from that goal?",
    next: "keep_moving",
  },
  guild_silhouette: {
    title: "The Silhouette",
    type: "text",
    text: "You look at Mitzi, who is using a purple stick to make the dead creature smile. You say, \"I want to join the Silhouette, actually.\"\n\n\"A bad boy, huh?\" Akemi is smiling, but you sense genuine interest behind her words. She also seems a little disappointed. \"I guess you don't intend to stick around then.\"\n\nYou shrug. In truth, you hadn't really thought that far ahead. Your priority is to the people back home-- Cale, Crixon, Ryke.\n\nYour siblings need you to come through for them, and being accepted into any guild or any faction would come with an impressive salary. That included **the Silhouette**, even though the group is often seen as dangerous by those outside it.\n\nUntil now, you hadn't imagined what actual membership would look like. Neither Blackspire nor Halycon Refract-- where they are strongest-- is close to home.",
    next: "keep_moving",
  },
  guild_protocol_null: {
    title: "Protocol Null",
    type: "text",
    text: "You whisper the motto of the most interesting faction there is.\n\n\"Unlink yourself.\"\n\nAkemi's eyes go wide. \"Protocol Null? For real?\"\n\nYou shrug, trying to play it cool. \"Yeah, they just feel like the most serious option. Everyone else is content with playing the game; Protocol Null is the only group interested in transcending it.\"\n\n\"Why are you and Mitzi here, then?\" she asks. \"If you don't trust the gates or the Protocol, why risk your lives?\"\n\n\"It's the easiest way to get stronger. How else can we level up enough to catch Protocol Null's attention?\"\n\nAkemi studies you, and you study her back. Could she be interested in joining Protocol Null one day, too?\n\n\"We should talk about it sometime,\" she says at last.",
    next: "keep_moving",
  },
  guild_veil_cult: {
    title: "The Veil Cult",
    type: "text",
    text: "To admit interest in the Veil Cult could make you a target of ridicule for most people. Akemi doesn't seem like the judgmental sort, though.\n\n\"I... think these gates are the most beautiful thing to ever grace humanity.\" You look around, taking this world in again. \"It's...**divine**, even.\"\n\n\"Yeah, I...Oh!\" Akemi grasps your meaning and stumbles through a response. \"I actually haven't, uh, met any members of the...\" she pauses. \"Is it offensive to use the name? I mean, do **you**--\"\n\n\"They call themselves the Scribes,\" you say, smiling. \"But, honestly, I haven't even met any of them yet. Maybe one day, though.\"\n\n \"That's fascinating. I think a lot of people find divinity in the gates and the Protocol; I wish they talked about it more.\"\n\n\"Yes!\" you exclaim. That was your thought exactly.\n\n**She gets it.**",
    next: "keep_moving",
  },
  guild_silk_road: {
    title: "The Silk Road",
    type: "text",
    text: "\"I'm thinking the Silk Road, actually.\"\n\nOf all the guilds, the Silk Road is, by far, the wealthiest. If they recruited you, Cale, Crixon, and Ryke wouldn't want for a single thing again. Your siblings would suddenly have every opportunity in the world.\n\nWith the Silk Road, Cale might even get the help he needs.\n\n\"That's cool!\" Akemi exclaims. \"We had a few members of the Silk Road come speak to us at the Ramsey Academy. They seemed really strong. Cool uniforms, too.\"",
    next: "keep_moving",
  },
  guild_thomur_guild: {
    title: "The Thomur Guild",
    type: "choice",
    text: "\"I think Sheemie has the right idea. I'd love to get into a guild that isn't established yet. Grow with it, ya know?\"\n\nAkemi's eyes flash with understanding. In a measured tone, she asks, \"Is it the Thomur Guild specifically, or just the prospect of getting in on the ground floor of 'the next big thing?'\"",
    choices: [
      { label: "Thomur", next: "thomur_choice" },
      { label: "Anything new, if it has promise", next: "anything_new_choice" },
    ],
  },
  thomur_choice: {
    title: "Thomur",
    type: "text",
    text: "\"Probably Thomur,\" you reply. \"Their rise to prominence  this year has been inspiring. I really think they might be a top-five guild one day.\"\n\n\"Boo!\" Akemi says with a playful pout. \"And here I was about to invite you into the one I'll be starting.\"\n\nYou perk up at this. Starting one's own guild is probably even harder than being a Breaker.",
    next: "keep_moving",
  },
  anything_new_choice: {
    title: "Anything New",
    type: "text",
    text: "\"I'm willing to consider anything I feel has promise,\" you reply. \"Though... I have a long way to go before I'll need to think about it.\"\n\n \"I plan to start a guild of my own once I'm strong enough. Maybe you can be my first member.\" She winks. \"**If** you see promise in it.\"",
    next: "keep_moving",
  },
  guild_freelance: {
    title: "Freelance",
    type: "text",
    text: "\"I'm freelance all the way.\"\n\nAkemi laughs. \"I figured as much based on how you approached today's gate. Plenty of Breakers have made a name for themselves by going freelance. Who knows, maybe you'll  be one of them!\"\n\nYou doubt it, but appreciate the positivity. In truth, joining a guild always felt like a pipe dream. One has to be C-Class just to apply, and even then, it doesn't guarantee anything.\n\n\"Maybe,\" you say instead, feigning her same positivity.\n\n\"Well, if you ever decide not to do this solo, keep me in mind. It won't be for a while yet, but I plan to start my own guild one day.\"\n\nYou perk up at this. Starting one's own guild is probably harder than being a successful freelancer.\n\n\"Did you have a name in mind?\" you ask.\n\nBefore Akemi can respond, a stern voice calls out from ahead of you.",
    next: "keep_moving",
  },  
  guild_no_preference: {
    title: "No Preference",
    type: "text",
    text: "You give an exaggerated shrug. \"My priority right now is staying alive. I'll worry about the next step when I'm ready to leave this one.\"\n\nAkemi laughs, and a part of you thinks you'd like to hear more of that sound. The other part can't figure out whether or not she's making fun of you.\n\n\"You're either brave or crazy,\" she says at last. \"I can't imagine entering one of these things without knowing the Protocol had my back.\" She pauses to look at Aleth. \"He isn't activated, either.",
    next: "guild_no_preference2",
  },
  guild_no_preference2: {
    title: "No Preference",
    type: "text",
    text: "You do know most people never activate, right?\" Harla says, clear eavesdropping. \"You're subjecting yourself to more danger than the rest of us by being here. We at least know Aleth can take care of himself.\n\nYou remain silent. Cale, Crixon, and Ryke need you to succeed. For the sake of your siblings, the risks are worth it.\n\n\"Well,\" Akemi says after flashing Harla a death stare, \"when you activate, I'd love to tell you about the guild I plan to start. Maybe you can be the first member!\"\n\nBefore you can ask about it, a stern voice calls out from ahead of you.",
    next: "keep_moving",
  },
  keep_moving: {
    title: "Keep Moving",
    type: "text",
    text: "\"We need to keep moving,\" Threx says. He's already several paces ahead of the group.\n\nTogether, you enter the alien forest, and the big picture of the place disappears beneath the purple tree-things.",
    next: "alien_forest",
  },
  alien_forest: {
    title: "Alien Forest",
    src: "../assets/forest_deep.webp",
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
    text: "This place is dangerous. It's more important to keep an eye open for threats than to admire the scenery.",
    roll: {
      stat: "Wisdom",
      dc: 14,
      successText: "You pull your eyes from the carvings and take in the forest beyond the trees. There is a layout to the woods themselves, as though it's been painstakingly designed.Following the converging lines of the purple tree-things, you notice a shimmer in the distance.\n\nIt's only there for a moment, then it disappears.",
      failText: "This place is strange, but it doesn't feel threatening. You look for movement beyond the trees, but find nothing.\n\n\"Have you ever told us which guild you'd be interested in?\" Akemi asks Aleth.\n\nHis answer comes quickly.\n\n\"Freelance. Especially if I don't activate. The Ramsey Academy credentials are just to get me access to more gates.\"",
      nextSuccess: "moving_success",
      nextFail: "forest_deeper",
    },
  },
  moving_success: {
    title: "Keep Moving Success",
    type: "choice",
    text: "\"Have you ever told us which guild you'd be interested in?\" Akemi asks Aleth.\n\nHis answer comes quickly.\n\n\"Freelance. Especially if I don't activate. The Ramsey Academy credentials are just to get me access to more gates.\"",
    choices: [
      { label: "Warn the group about the shimmer", next: "warn_shimmer" }, 
      { label: "Keep it to yourself and keep your guard up", next: "keep_guard" },]
  },
  warn_shimmer: {
    title: "Warn The Group",
    type: "text",
    text: "\"I saw something moving behind us,\" you report.\n\nThe group stops.\n\n\"Where?\" Threx asks.\n\nYou point to your rear and describe the shimmering.\n\n\"He's always been skittish,\" Ronin teases. \"It was probably just a tree or an eye floater or something.\"\n\nThrex looks at you a moment longer.",
    //need to come back and set next page based on previous choices
    next: "",
  },
  keep_guard: {
    title: "Keep Your Guard Up",
    type: "text",
    text: "You decide to keep your observations to yourself for now. Better to stay alert and see what happens next.\n\nThe rest of the journey through the forest is tense, but uneventful.",
    next: "forest_aftermath",
  },
  moving_fail: {
    title: "Keep Moving Fail",
    type: "text",
    text: "The others already think you're a weak link for not attending the academy with them. You don't want them to think you're scared of every eye floater or shifting tree-thing.",
    next: "inspect_fail",
  },
  tree_inspect: {
    title: "Inspect the Carvings",
    type: "roll",
    text: "You take a moment to admire them. They are deep and no wider than the width of your pinky. Did a creature create these, or are they beautifully natural, like snowflakes? ",
    roll: {
      stat: "Wisdom",
      dc: 14,
      successText: "You peer closer, and the pattern beneath the patterns assembles itself. Though each carving is different from the rest, you recognize a distinction between groups of them.\n\nThere are many with curved edges. These are the tree-things.\n\nThere are several longer, squigly ones. These are the streams.\n\nThere are a few jagged ones. You're not sure what they are, but most are congregated in two locations across these various tapestries.\n\nMovement catches your eye amongst a grouping of eight small dots. Seven of them are... moving.",
      failText: "It's difficult to tell.\n\nYou stare at the carvings a moment longer, admiring their beauty before continuing on.\n\n\"Have you ever told us which guild you'd be interested in?\" Akemi asks Aleth.\n\nHis answer comes quickly.\n\n\"Freelance. Especially if I don't activate. The Ramsey Academy credentials are just to get me access to more gates.\"",
      nextSuccess: "inspect_success",
      nextFail: "inspect_fail",
    },
  },
  inspect_fail: {
    title: "Inspect Fail",
    type: "text",
    text: "It's difficult to tell.\n\nYou stare at the carvings a moment longer, admiring their beauty before continuing on.\n\n\"Have you ever told us which guild you'd be interested in?\" Akemi asks Aleth.\n\nHis answer comes quickly.\n\n\"Freelance. Especially if I don't activate. The Ramsey Academy credentials are just to get me access to more gates.\"",
    next: "forest_deeper",
  },
  forest_deeper: {
    title: "Deeper In The Forest",
    type: "text",
    text: "Threx leads you deeper into the forest, following a wide and well-defined footpath.\n\n\"It's weird nothing else has tried to kill us,\" Mitzi says.\n\n The party leader nods. \"I agree. This place isn't very large, and we definitely stand out against all the purple.\"\n\n\"I hate purple.\"\n\n\"You hate everything.\"\n\nMitzi smirks. \"True.\"\n\nAt last, the path leads into a clearing. For the first time since entering the gate, you see a color other than purple.\n\n\"It's beautiful!\" Akemi exclaims. Others echo the same sentiment, and you have to agree.\n\nThe yellow pattern before you is comprised of neither rock nor flower. Yet, the material carries properties of both. It smells better than the trees, too. Instead of sour milk, the clearing smells almost like lilacs and chocolate.",
    next: "forest_clearing",
  },
  forest_clearing: {
    title: "Forest Clearing",
    src: "../assets/forest_clearing.webp",
    type: "text",
    text: "You feel mollified. Content. You're not worrying about your family, or your need to prove yourself, or even how dangerous this world may be. For a moment, there is only this moment.\n\n\"It's like something out of a fantasy,\" Mitzi says, smiling. \"I... don't hate this.\"\n\nUnfortunately, reality returns all too quickly.\n\nAll at once, the field becomes chaos. Twelve creatures emerge from the underbrush and charge you and your companions.\n\nThe beasts of this world are cotton candy colored, just like the trees. These are larger than the one you faced near the gate, and their tusked teeth are stained with the blood of other creatures they've killed.\n\n\"Shit!\" Threx yells, drawing his warhammer. \"We walked right into an ambush! Everyone, form up on me!\"",
    next: "forest_clearing_encounter",
  },
  forest_clearing_encounter: {
    title: "Forest Clearing Encounter",
    src: "../assets/stream.webp",
    type: "battle",
    enemy: {
      name: "Cotton Candy Creature",
      maxHP: 40,      // Enemy health
      ac: 13,          // Armor Class (difficulty to hit)
      attack: 7,      // Attack bonus
      magic: 5,
      points: 15,
      item: ""        // Magic attack bonus
    },
    text: "",
    fail: "forest_clearing_encounter_fail",
    next: "forest_encounter_success",
  },
  forest_clearing_encounter_fail: {
    title: "Forest Encounter Defeat",
    type: "text",
    text: "The viciousness of these things is too much for you to handle. Their sharp teeth tear into your flesh. Their muscular necks rag you back and forth. Your arm is disabled first, then a leg. Chunks are ripped from you, and the world goes from purple to red.\n\nYou scream, but blood fills your throat.\n\nYou feel a powerful set of jaws close around your neck.\n\nThis is it.\n\nThe jaws close, and the red goes to black.",
    next: "forest_clearing_encounter_fail2",
  },
  forest_clearing_encounter_fail2: {
    title: "---",
    type: "text",
    text: "\"Go back,\" a voice says. \"I'm not ready for you yet.\"",
    next: "forest_clearing_encounter_fail3",
  },
  forest_clearing_encounter_fail3: {
    title: "!!!",
    type: "text",
    text: "You scream and realize your vocal cords are once again intact. You grasp your throat; the flesh has regrown.",
    next: "forest_clearing_encounter_fail4",
  },
  forest_clearing_encounter_fail4: {
    title: "Revived",
    type: "text",
    text: "\"You're okay,\" Harla whispers.\n\nDead beasts litter the ground around you, and your companions appear battered but standing.\n\n\"Can't believe you went down,\" Ronin huffs. His armor and mechanical knife are covered in viscera.\n\n\"Don't feel bad,\" Sheemi offers, nursing his arm. \"Mitsi and I got injured, too. That's why we have such a great healer!\"\n\nHarla shrugs. \"I am pretty great, aren't I?\"\n\n\"Sheemie,\" Threx says. \"Is the gate stabilizer still intact after that hit you took?\"\n\nAlready back to full strength, the plant aficionado pulls a grey sphere from his robe. The Epoch Corporation logo is clearly visible across it.",
    next: "gate_stabilizer_check",
  },
  inspect_success: {
    title: "Inspect Success",
    type: "choice",
    text: "Oblivious, the rest of the group trudges on. You see their movements echoed on the maps.\n\n\"Have you ever told us which guild you'd be interested in?\" Akemi asks Aleth.\n\nYou watch the carvings. If you continue the way Threx is leading, you will walk into an area surrounded by the jagged symbols.\n\nAleth's answer comes quickly.\n\n\"Freelance. Especially if I don't activate. The Ramsey Academy credentials are just to get me access to more gates.\"\n\n\"We're walking into an ambush,\" you whisper.",
    choices: [
      { label: "Warn the others", next: "alert_team" }, 
      { label: "Keep it to yourself", next: "keep_to_yourself" },]
  },
  alert_team: {
    title: "Alert The Team",
    type: "text",
    text: "\"Hold up,\" you tell the others. \"We can learn something from the trees. I... think we're walking into an ambush.\"\n\nRonin snorts in derision. To you, he whispers, \"Maybe you and the plant weirdo can join the Thomur Guild together.\"\n\nThrex doubles back to reach you. \"This better be good, {{characterName}}. We can't afford to waste any more time here.\"\n\n\"No, he's definitely onto something.\" Aleth stands near a tree of his own now, looking over the symbols. \"I think this is a map.\" \n\nAfter a moment to see for himself, the party leader nods.\n\n\"There's a symbol on this tree that looks different from all the others,\" Threx says. \"That must be the being the portal is tied to.\"",
    next: "alert_team2",
  },
  alert_team2: {
    title: "Alert The Team",
    type: "choice",
    text: "\"We could skip all its minions and head right for it,\" Harla offers. \"I bet all those squiggles around it are its horde.\"\n\n\"And then what?\" Kaelion Virehart retorts. \"We must dispense with the minions so the mining crew has sanctuary for their work.\"\n\n\"The minions will have less cause to fight if we slay their leader first,\" Ronin offers. \"Look at how many are up there waiting for us; we could use that to our advantage.\"\n\nAkemi shakes her head. \"Or we can step into the ambush prepared. If we head to the boss first, and it proves powerful enough to stall us, that risks us getting flanked by the minions.\"\n\n\"True,\" Mitzi agrees. \"They'd see us changing course. We have no idea how fast they are, either.\"\n\nThe group looks to Threx for an answer. The C-Class Breaker mulls over his options.\n\nNow's your chance to voice your own two cents.",
    choices: [
      { label: "Go after the boss first", next: "head_to_boss" },
      { label: "Clear the minions first", next: "clear_minions" },
      { label: "See what Threx decides", next: "threx_decides" },
    ],
  },
  head_to_boss: {
    title: "Head To The Boss",
    type: "text",
    text: "\"I say we go for the boss first,\" you state confidently. \"If we can take it down quickly, the minions might lose their will to fight.\"\n\nThrex nods slowly. \"Alright. Let's move out. Stay sharp, everyone.\"\n\nYou steel yourself for the battle ahead, hoping your plan pays off.",
    //next depends on if player failed any previous encounters or rolls, alone or with group
    next: "",
  },
  clear_minions: {
    title: "Clear The Minions",
    type: "text",
    text: "\"I agree with Kaelion and Mitzi,\" you say. \"Better to face what we know before facing what we don't.\"",
    next: "forest_encounter_prepare",
  },
  threx_decides: {
    title: "Threx Decides",
    type: "text",
    text: "After taking a moment to reflect, Threx says, \"I agree with Mitzi and Ronin. We already know we can face the minions easily enough; better to do it early.\"",
    next: "forest_encounter_prepare",
  },
  forest_encounter_prepare: {
    title: "Forest Encounter Preparation",
    type: "text",
    text: "\"Everyone, tighten up. Aleth, cover our rear with {{characterName}}. Roland, I want you and Akemi on the right flank. Mitzi, you and Ronin take the left.\"",
    next: "forest_encounter_prepare2",
  },
  forest_encounter_prepare2: {
    title: "Forest Encounter Preparation",
    type: "text",
    text: "\"Harla, you're in the center. Keep an eye open for whoever might need healing.\" The C-Class Breaker draws his warhammer. \"And I'll strike down anything stupid enough to come at us head-on.\"\n\nThe forest is silent in the wake of this formation, sans the occasional groan of a tree-thing.\n\n\"I told you so,\" Ronin offers meekly. \"{{characterName}} is afraid of his own shadow.\"\n\nThrex ignores him. \"We're moving. Keep your guard up.\"",
    next: "forest_encounter_prepare3",
  },
  forest_encounter_prepare3: {
    title: "Forest Encounter Preparation",
    type: "text",
    text: "He leads you through the forest. There's a wide and well-defined footpath next to you, but he takes you along a slight ridge running parallel to it instead. Eventually, the path leads into a clearing that would have been ideal for an ambush. Instead, when the creatures inevitably come, the ridge protects your flank.\n\n\"Good call, freelancer,\" Threx yells as the horde of creatures screams your way. \"We would have been surrounded if you hadn't said something.\"\n\nThe beasts of this world are cotton candy colored, just like the trees. These are larger than the one you faced near the gate, and their tusked teeth are stained with the blood of other creatures they've killed.\n\n\"Reverse phalanx!\" Threx commands.",
    next: "forest_encounter_prepare4",
  },
  forest_encounter_prepare4: {
    title: "Forest Encounter Preparation",
    type: "text",
    text: "The graduates of the Ramsey Academy loosen their grouping and quickly form a reverse V. You and Ronin trade a confused glance, then form up where there's room.\n\nThe creatures are funneled to the group's strongest member. Threx bats three of them aside with ease.\n\nRealizing their mistake too late, the beasts panic. With the deadliest threat at their front and more of their ilk pushing at their rear, they desperately lash out wherever they can.\n\nTwo come after you.",
    next: "forest_prepare_encounter",
  },
    forest_prepare_encounter: {
    title: "Forest Encounter",
    src: "../assets/stream.webp",
    type: "battle",
    enemy: {
      name: "Cotton Candy Creature",
      maxHP: 20,      // Enemy health
      ac: 12,          // Armor Class (difficulty to hit)
      attack: 4,      // Attack bonus
      magic: 3,
      points: 10,
      item: ""        // Magic attack bonus
    },
    text: "",
    fail: "forest_encounter_fail",
    next: "forest_prepare_encounter_success",
  },
  forest_prepare_encounter_success: {
    title: "Forest Encounter Success",
    type: "text",
    text: "Both beasts fall into pieces. Around you, the rest are similarly dispatched. Sheemie and Mitzi are injured, but Harla quickly sets them right with her healing magic. The healer also has one or two new dents in her armor.\n\n\"Good call, {{characterName}},\" Threx says again. \"One of us could have gone down if these things had ambushed us.\"",
    next: "threx_sweat",
  },
  keep_to_yourself: {
    title: "Keep It To Yourself",
    type: "text",
    text: "Most of your companions are graduates of the prestigious Ramsey Academy. Surely they can take care of themselves.\n\nWhen you arrive at the clearing, you see a color other than purple. The yellow pattern is comprised of neither rock nor flower. Yet, the material carries properties of both. It smells better than the trees, too. Instead of sour milk, the clearing smells almost like lilacs and chocolate.\n\n\"It's beautiful!\" Akemi exclaims. Others echo the same sentiment.\n\nYou don't have time to marvel at the scenery. Your attackers are already moving, using the breathtaking sight to mask their movements.You decapitate one yellow flower, then another.\n\n\"What are you doing!?\" Harla cries.",
    next: "keep_to_yourself2",
  },
  keep_to_yourself2: {
    title: "Keep It To Yourself",
    type: "text",
    text: "Two geysers of blood answer her as the creatures beneath the flowers howl in anguish. Already, two of your enemies are out of the fight.\n\nAll at once, the field becomes chaos. Ten more creatures emerge from the underbrush and charge you and your companions.\n\nThe beasts of this world are cotton candy colored, just like the trees. These are larger than the one you faced near the gate, and their tusked teeth are stained with the blood of other creatures they've killed.\n\n\"Shit!\" Threx yells, drawing his warhammer. \"We walked right into an ambush! Everyone, form up on me!\"\n\nYou smile, already charging into the fight. While the others take their time to regroup, you prepare to add more notches to your belt.\n\nThe Protocol will **have** to activate you after today.",
    next: "forest_encounter",
  },
  forest_encounter: {
    title: "Forest Encounter",
    src: "../assets/stream.webp",
    type: "battle",
    enemy: {
      name: "Cotton Candy Creature",
      maxHP: 30,      // Enemy health
      ac: 12,          // Armor Class (difficulty to hit)
      attack: 5,      // Attack bonus
      magic: 3,
      points: 10,
      item: ""        // Magic attack bonus
    },
    text: "",
    fail: "forest_encounter_fail",
    next: "forest_encounter_success",
  },
  forest_encounter_fail: {
    title: "Forest Encounter Defeat",
    type: "text",
    text: "The viciousness of these things is too much for you to handle. Their sharp teeth tear into your flesh. Their muscular necks ragdoll you back and forth. Your arm is disabled first, then a leg. Chunks are ripped from you, and the world goes from purple to red.\n\nYou scream, but blood fills your throat.\n\nYou feel a powerful set of jaws close around your neck.\n\nThis is it.\n\nThe jaws close, and the red goes to black.",
    next: "forest_encounter_fail2",
  },
  forest_encounter_fail2: {
    title: "---",
    type: "text",
    text: "\"Go back,\" a soft voice tells you. It sounds so familiar. \"I'm not ready for you yet.\"",
    next: "forest_encounter_fail3",
  },
  forest_encounter_fail3: {
    title: "!!!",
    type: "text",
    text: "You scream and realize your vocal cords are once again intact. You grasp your throat; the flesh has regrown.",
    next: "forest_encounter_fail4",
  },
  forest_encounter_fail4: {
    title: "Revieved",
    type: "text",
    text: "\"You're okay,\" Harla whispers.\n\nDead beasts litter the ground around you, and your companions appear battered but standing.\n\n\"Can't believe you went down,\" Ronin huffs. His armor and mechanical knife are covered in viscera.\n\n\"Don't feel bad,\" Sheemi offers, nursing his arm. \"Mitsi and I got injured, too. That's why we have such a great healer!\"\n\nHarla shrugs. \"I am pretty great, aren't I?\"\n\nA strong hand grabs your shoulder.\n\n\"You did good with that warning,\" Threx says. \"We would have lost more people if we had walked into that ambush. Maybe permanently.\"",
    next: "threx_sweat",
  },
  threx_sweat: {
    title: "Agreed",
    type: "text",
    text: "You nod. Though that may have been true, you know Threx would have done just fine.\n\nHe hasn't even broken a sweat.",
    next: "forest_encounter_success2",
  },
  forest_encounter_success: {
    title: "Forest Encounter Success",
    type: "text",
    text: "The final beast collapses at your feet.\n\n\"That... sucked,\" Ronin pants while cleaning off his mechanical knife.\n\nBehind him, Harla regrows the flesh on Mitzi's arm and resets Sheemie's broken leg. The healer also has one or two new dents in her armor.",
    next: "forest_encounter_success2",
  },
  forest_encounter_success2: {
    title: "Forest Encounter Success",
    type: "text",
    text: "\"Haza!\" Kaelion exclaims. \"We have bested the beasts! Surely they've just thrown everything they had at us?\"\n\nAleth nudges one of the dead creatures with his foot. Like Threx, he doesn't even seem winded. \"None of these feels like their leader.\"\n\n\"Aleth's right,\" Akemi says. \"I haven't gotten any messages from the Protocol that the gate's losing stability. Has anyone else?\"\n\nThe rest of the group consults their augmented-reality displays, then shakes their heads. You hold off on checking your handheld digital reader. It would only remind the others that you haven't actually been activated yet.\n\nRonin wipes off his blade. \"Well, we already killed its bodyguards. Finding their trail home shouldn't be too difficult.\"\n\nThrex nods. \"Sheemie, is the Gate Stabilizer still intact after that skirmish?\"\n\nThe plant aficionado pulls a gray sphere from his robe. The Epoch Corporation logo is clearly visible across it.",
    next: "gate_stabilizer_check",
  },
  gate_stabilizer_check: {
    title: "Gate Stabilizer Check",
    type: "text",
    text: "\"Sure is, boss! We lodge this thing in the Tethered Being after we kill it, and that portal will be locked open!\"\n\nLike the portal itself, this is the first time you've seen a Gate Stabilizer in person. It's smaller than you imagined, and simpler. Without it, you and your companions would only have ten minutes to exit this place after killing the Tethered Being.\n\nThe alternative was being stuck here forever.\n\n\"Thank God for E-Corp!\" Ronin exclaims. His oscillating knives are built by the same company.\n\nSheemie puts the Gate Stabilizer away. \"I'm excited to stick around a bit after we clear this place,\" he says, inspecting a nearby tree. \"I'd love some time to inspect these carvings.\"\n\nMitzi sighs and whispers, \"Tree guy.\"",
    next: "gate_stabilizer_check2",
  },
  gate_stabilizer_check2: {
    title: "Gate Stabilizer Check",
    type: "text",
    text: "\"**After,**\" Threx says, already following the most well-defined path of the creatures. \"We can't afford to let our guards down yet.\"\n\nIt doesn't take long to reach the lair of the gate's Tethered Being. The tracks of your former attackers take you along the path of least resistance. When you finally lay eyes on it, your heart flutters. So far, everything about this world has seemed so... natural. Even the beasts felt akin to forest animals.\n\nThis place eliminates that facade.\n\n\"It's so... gawdy,\" Akemi whispers, scrunching her nose.\n\n\"I think it looks regal!\" Kaelion Virehart argues. \"The creature inside must be a fine specimen!\"\n\n\"I think,\" Aleth says, \"that there is something wrong about this place.\"\n\nYou think he might be right.",
    next: "forest_shack",
  },
  forest_shack: {
    title: "Forest Shack",
    type: "choice",
    text: "The shack stands in sharp contrast to the surrounding purple. Its walls are tiled with amber, gold, and sapphire. It isn't large, but it holds enough material to justify the gate's golden appearance.\n\nThrex grunts. \"I don't think this place belongs to the creature we're looking for. I... think it's just being kept here... as bait.\"\n\nThere is a faint **tsk tsk tsk** that comes from the porch. When you see the source, you shudder.\n\nThe thing is sitting atop a throne at the porch's corner, overlooking a pristine view of the inverted sphere. You only see a side profile, but the thing appears to be as alien to this world as you are.\n\n\"You killed my pets,\" the alien-thing says in a voice like sandpaper.\n\nYour companions trade worried glances. Plenty of creatures inside of gates can talk, but none that are E-Class.",
    choices: [
      { label: "Speak to the creature", next: "speak_to_creature" },
      { label: "Send a runner back through the gate for help", next: "send_a_runner" },
      { label: "Remain silent", next: "remain_silent" },
    ],
  },
  remain_silent: {
    title: "Remain Silent",
    type: "text",
    text: "You keep quiet, unsure how to talk to Tethered Beings.\n\n\"Kaelion,\" Threx hisses, \"down your armor and get back to the gate. Tell the GPA that our Tethered Being is a Camper.\"\n\n\"Yessir!\" the wannabee knight yells, dropping his chest plate.\n\n\"The rest of you,\" Threx takes a step forward and angles his warhammer sideways, \"get behind me.\"\n\n\"We have a better chance fighting this thing together!\" Ronin protests. \"I--\"\n\n\"Now!\"\n\nThe C-Class Breaker reveals his full strength for the first time. It dwarfs the rest of you. Ronin stops arguing and files behind Threx with you and the others. Behind all of you, Kaelion drops the last of his armor and begins his sprint to the exit.",
    next: "camper_hunt",
  },
  camper_hunt: {
    title: "Camper Hunt",
    src: "../assets/forest_clearing.webp",
    type: "text",
    text: "\"Good,\" the Camper rasps. \"I was hoping for lively sport today.\"\n\nThere's a blur across the porch, and the creature is suddenly standing at the top of the stairs.\n\nYou see it in its full glory now... and shudder.\n\nThe thing is a head taller than Threx and sports golden armor that is one part duster and one part cloak. A black katana hangs from its hip. Its mouth is curled into a permanent snarl, and its shiny pink skin gives it the appearance of a burn victim.\n\nAnd the scars... There are too many to count.\n\nWorst of all is the **other** thing it's wearing. Fresh blood coats the creature like a crimson robe. It drips onto the decadent porch, adding faux-ruby to the amber, gold, and sapphire.\n\n\"Kael!\" Harla screams.\n\nThe knight collapses into chunks of butchered meat. He doesn't even have time to scream.",
    //if they haven't cleared out the previous minions, there is another page before the battle
    next: "",
  },
  send_a_runner: {
    title: "Send A Runner",
    type: "text",
    text: "\"Mitzi,\" you whisper. \"Run back to the gate and get us some help. Aleth is right; something about this feels off.\"\n\nThe woman blinks at you. \"Excuse me? If you're so worried about it, why don't you go? I'm here to get stronger. I can't do that if I'm running away, can I?\"\n\n\"Mitzi,\" Threx hisses. \"Do what he's telling you. Inform the GPA that our Tethered Being is a Camper.\"\n\n\"A what?\" Mitsi is incredulous. \"No way! I'm not going anywhere.\"\n\n\"Now!\"",
    next: "send_a_runner2",
  },
  send_a_runner2: {
    title: "Send A Runner",
    type: "text",
    text: "The C-Class Breaker reveals his full strength for the first time. It dwarfs the rest of you. Mitzi stops arguing and spins around. She's moving at a full sprint before the creature speaks again.\n\n\"Good,\" it rasps. \"I was hoping for lively sport today.\"\n\nThere's a blur across the porch, and the creature is suddenly standing at the top of the stairs.\n\nYou see it in its full glory now... and shudder.",
    next: "send_a_runner3",
  },
  send_a_runner3: {
    title: "Send A Runner",
    type: "text",
    text: "The thing is a head taller than Threx and sports golden armor that is one part duster and one part cloak. A black katana hangs from its hip. Its mouth is curled into a permanent snarl, and its shiny pink skin gives it the appearance of a burn victim.\n\nAnd the scars... There are too many to count.\n\nWorst of all is the other thing it's wearing. Fresh blood coats the creature like a crimson robe. It drips onto the decadent porch, adding faux-ruby to the amber, gold, and sapphire.\n\n\"Mitzi!\" Akemi screams.\n\nThe girl with hopes of joining Protocol Null has **become** null. She collapses into chunks of butchered meat.\n\nShe didn't even have time to scream.",
    //if they haven't cleared out the previous minions, there is another page before the battle
    next: "",
  },
  speak_to_creature: {
    title: "Speak To The Creature",
    type: "text",
    text: "\"They tried to kill us first,\" you say. Your companions turn, dumbstruck.",
    next: "speak_to_creature2",
  },
  speak_to_creature2: {
    title: "Speak To The Creature",
    type: "text",
    text: "\"Don't engage with the Camper,\" Threx warns.\n\n\"The **what?**\" asks Akemi.\n\n\"It's a creature that doesn't belong here,\" the C-Class Breaker replies. \"It came the same way we did, through some other gate. It isn't connected to the world itself, which is why the portal didn't register a higher threat.\"\n\nAleth says, \"It waits in places like this one... so it can ambush lower-level explorers.\"",
    next: "speak_to_creature3",
  },
  speak_to_creature3: {
    title: "Speak To The Creature",
    type: "choice",
    text: "\"Kaelion,\" Threx hisses, \"down your armor and get back to the gate. Tell the GPA that our Tethered Being is a Camper.\"\n\n\"Yessir!\" Kaelion yells, dropping his chest plate.\n\n\"The rest of you,\" Threx takes a step forward and angles his warhammer sideways, \"get behind me.\"",
    choices: [
      { label: "Keep talking to the Camper", next: "continue_talking" },
      { label: "Get behind Threx", next: "behind_threx" },
    ],
  },
  behind_threx: {
    title: "Get Behind Threx",
    type: "text",
    text: "You file behind the group leader with the others. Threx takes a step forward and angles his warhammer sideways.",
    next: "threx_ahead",
  },
  threx_ahead: {
    title: "Threx Ahead",
    type: "text",
    text: "For the first time since you've met him, the C-Class Breaker reveals his full power. It dwarfs the rest of you.\n\nKaelion drops the last of his armor and begins his sprint to the exit.",
    next: "camper_hunt",
  },
  continue_talking: {
    title: "Continue Talking",
    type: "choice",
    text: "You step forward, putting  the group leader at your back.\n\n\"I want to know more about you,\" you say. \"Where are you from, originally? How long have you been here?\"\n\nThe thing cocks its head, amused. \"I know some things about the world you come from. Tell me: does a human converse with an insect before stepping on it?\"",
    choices: [
      { label: "Sometimes", next: "sometimes_camper" },
      { label: "No", next: "no_camper" },
    ],
  },
  sometimes_camper: {
    title: "Sometimes",
    type: "text",
    text: "You shrug. \"That depends on the human, I guess. Some people are lonelier than others.\"\n\nBehind you, Kaelion drops the last of his armor and begins his sprint to the portal.\n\nThere's a blur across the porch, and the creature is suddenly standing at the top of the stairs.\n\nYou see it in its full glory now... and shudder.",
    next: "sometimes_camper2",
  },
  sometimes_camper2: {
    title: "Sometimes",
    type: "text",
    text: "The thing is a head taller than Threx and sports golden armor that is one part duster and one part cloak. A black katana hangs from its hip. Its mouth is curled into a permanent snarl, and its shiny pink skin gives it the appearance of a burn victim.\n\nAnd the scars... There are too many to count.\n\nWorst of all is the other thing it's wearing. Fresh blood coats the creature like a crimson robe. It drips onto the decadent porch, adding faux-ruby to the amber, gold, and sapphire.\n\n\"Kael!\" Harla screams.\n\nThe knight collapses into chunks of butchered meat. He doesn't even have time to scream.",
    //if they haven't cleared out the previous minions, there is another page before the battle
    next: "",
  },
  no_camper: {
    title: "No",
    type: "text",
    text: "You take a step back, realizing your folly in trying to reason with this thing. Threx grabs your wrist and pulls you behind him.\n\n\"Dumbass,\" he says.",
    next: "",
  },
};
