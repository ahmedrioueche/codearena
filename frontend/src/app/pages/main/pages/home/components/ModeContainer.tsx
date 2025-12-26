import { useState } from "react";
import { modes } from "../../../../../../constants/modes";
import { GameMode } from "../../../../../../types/game/game";
import BattleModeSetupModal from "./gameSetup/BattleSetupModal";
import CollabModeSetupModal from "./gameSetup/CollabSetupModal";
import SoloMatchSetupModal from "./gameSetup/SoloSetupModal";
import ModeCard from "./ModeCard";
import SaveTheCodeSetup from "./SaveTheCodeSetup";

const ModesContainer = () => {
  const [activeMode, setActiveMode] = useState<GameMode | "null">("null");

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-8 ">
      {modes.map((mode) => (
        <ModeCard
          key={mode.modeId}
          modeId={mode.modeId}
          mode={mode.mode}
          description={mode.description}
          icon={mode.icon}
          isImplemented={mode.isImplemented}
          onStartGame={(mode) => setActiveMode(mode)}
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
      <SaveTheCodeSetup
        isOpen={activeMode === "save-the-code"}
        onClose={() => setActiveMode("null")}
      />
    </div>
  );
};

export default ModesContainer;
