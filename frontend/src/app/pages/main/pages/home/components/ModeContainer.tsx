import ModeCard from "./ModeCard";
import { GameMode } from "../../../../../../types/game/game";
import { lazy, Suspense, useState } from "react";
import BattleModeSetupModal from "./gameSetup/BattleSetupModal";
import CollabModeSetupModal from "./gameSetup/CollabSetupModal";
import { modes } from "../../../../../../constants/modes";
const SoloMatchSetupModal = lazy(() => import("./gameSetup/SoloSetupModal"));

const ModesContainer = () => {
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<"null" | GameMode>(
    "null"
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full z-0">
        {modes.map((mode, index) => (
          <div key={index} className="h-full">
            <ModeCard
              {...mode}
              isHorizontal={true}
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
