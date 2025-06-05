export const adventurePages = {
  page_1: {
    title: "The Forest Edge",
    src: "../assets/portal.webp",
    text: "You stand at the edge of the golden portal. It churns like liquid glass, flickering with eerie light. Behind you, the city is still.\n\nYour orders were clear: breach the portal, eliminate the threat, and clear the way for the mining team.",
    choices: [
      { label: "Step into the portal", next: "page_2" },
      { label: "Inspect the edges", next: "page_3" },
      { label: "Return to the entrance", next: "page_4" },
    ],
  },
  page_2: {
    title: "Forest Battle",
    src: "../assets/portal.webp",
    text: "All your life, you longed for adventure, and the moment is finally here. What will it feel like when step into this shimmering superfluid? Will you emerge on the other side a different person? Will you finally be the hero you always saw yourself as?\n\nYou know the life behind you. Ahead, there is only possibility.\n\nYou step forward, prepared to enter, when a strong hand grabs your wrist.",
    choices: [
      { label: "Fight the beast", next: "battle" },
      { label: "Flee back to the edge", next: "page_1" },
    ],
  },
  page_3: {
    title: "The Village",
    text: "Curious, you trace your eyes along the portal's circumference. This is the first time you've seen one up close. It's smaller than you imagined....\n\nAnd noisier.\n\nThe thing sloshes, buzzes, and whispers. It sounds like a beach, a server farm, and a distant train station all in one.\n\nIt also sounds utterly alien.",
    choices: [
      { label: "Rest at the inn", next: "page_4" },
      { label: "Head back to the forest", next: "page_1" },
    ],
  },
  page_4: {
    title: "A Peaceful Night",
    text: "Better play it safe. This is your first time being so close to one of these, after all.",
    choices: [
      { label: "Begin again", next: "page_1" },
    ],
  },
  battle: {
    title: "Battle: Wild Beast",
    text: "Roll the dice to determine the outcome!",
    choices: [
      { label: "Victory! Continue deeper.", next: "page_5" },
      { label: "Defeated! Retreat to safety.", next: "page_3" },
    ],
  },
  page_5: {
    title: "Deeper Mysteries",
    text: "Victorious, you move deeper into the unknown...",
    choices: [
      { label: "Explore further", next: "page_1" },
    ],
  }
};
