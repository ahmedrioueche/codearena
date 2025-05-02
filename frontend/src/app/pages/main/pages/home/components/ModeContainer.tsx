import { useState } from "react";
import { GameMode } from "../../../../../../types/game/game";
import { modes } from "../../../../../../constants/modes";
import ModeCard from "./ModeCard";
import SoloMatchSetupModal from "./gameSetup/SoloSetupModal";
import BattleModeSetupModal from "./gameSetup/BattleSetupModal";
import CollabModeSetupModal from "./gameSetup/CollabSetupModal";

const ModesContainer = () => {
  const [activeMode, setActiveMode] = useState<GameMode | "null">("null");

  return (
    <div className="space-y-8">
      {modes.map((mode) => (
        <ModeCard
          key={mode.modeId}
          modeId={mode.modeId}
          mode={mode.mode}
          description={mode.description}
          icon={mode.icon}
          isImplemented={mode.isImplemented}
          onStartGame={setActiveMode}
        />
      ))}

      {/* Modals */}
      <SoloMatchSetupModal
        isOpen={activeMode === "solo"}
        onClose={() => setActiveMode("null")}
      />
      <BattleModeSetupModal
        isOpen={activeMode === "battle"}
        onClose={() => setActiveMode("null")}
      />
      <CollabModeSetupModal
        isOpen={activeMode === "collab"}
        onClose={() => setActiveMode("null")}
      />
    </div>
  );
};

export default ModesContainer;
