import { Code, Swords, User, Users } from "lucide-react";
import { GameMode } from "../types/game/game";

export const modes = [
  {
    modeId: "solo" as GameMode,
    mode: "Solo Arena",
    description: [
      "Practice algorithms & data structures",
      "Track your performance metrics",
      "Complete daily challenges",
    ],
    icon: User,
    isImplemented: true,
  },
  {
    modeId: "battle" as GameMode,
    mode: "Battle Arena",
    description: [
      "Real-time 1v1 coding battles",
      "Join competitive tournaments",
      "Climb global rankings",
    ],
    icon: Swords,
    playerCount: 0,
    isImplemented: false,
  },
  {
    modeId: "collab" as GameMode,
    mode: "Collab Arena",
    description: [
      "Solve team challenges",
      "Build projects together",
      "Join language-specific rooms",
    ],
    icon: Users,
    playerCount: 0,
    isImplemented: false,
  },
  {
    modeId: "save-the-code" as GameMode,
    mode: "Save The Code",
    description: [
      "Explore tech's biggest software failures.",
      "Debug critical systems in real-time.",
      "Learn from historic coding disasters.",
    ],
    icon: Code,
    isImplemented: false,
  },
];
