import { Swords, User, Users } from "lucide-react";
import ModeCard from "./ModeCard";
import { GameMode } from "../../../../../../types/game/game";
import { lazy, Suspense, useState } from "react";
import BattleModeSetupModal from "./gameSetup/BattleSetupModal";
import CollabModeSetupModal from "./gameSetup/CollabSetupModal";
const SoloMatchSetupModal = lazy(() => import("./gameSetup/SoloSetupModal"));

const modes = [
  {
    modeId: "solo" as GameMode,
    mode: "Solo Arena",
    description: [
      "Practice algorithms & data structures",
      "Track your performance metrics",
      "Complete daily challenges",
    ],
    icon: User,
    rank: "Diamond II",
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
    playerCount: 124,
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
    playerCount: 3,
  },
];

const ModesContainer = () => {
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<"null" | GameMode>(
    "null"
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full z-0">
        {modes.map((mode, index) => (
          <div key={index} className="h-full">
            <ModeCard
              {...mode}
              onStartGame={(mode) => setIsSetupModalOpen(mode)}
            />
          </div>
        ))}
      </div>
      <Suspense fallback={null}>
        <SoloMatchSetupModal
          isOpen={isSetupModalOpen === "solo"}
          onClose={() => setIsSetupModalOpen("null")}
        />
      </Suspense>
      <Suspense fallback={null}>
        <BattleModeSetupModal
          isOpen={isSetupModalOpen === "battle"}
          onClose={() => setIsSetupModalOpen("null")}
        />
      </Suspense>
      <Suspense fallback={null}>
        <CollabModeSetupModal
          isOpen={isSetupModalOpen === "collab"}
          onClose={() => setIsSetupModalOpen("null")}
        />
      </Suspense>
    </div>
  );
};

export default ModesContainer;
