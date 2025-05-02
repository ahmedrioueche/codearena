import { useState } from "react";
import Board from "../../../components/Board";
import Notepad from "../../../components/NotePad";
import PlayersContainer from "../components/PlayersContainer";
import OpponentContainer from "../components/OpponentContainer";
import { Player } from "../../../../../../types/game/game";

const BattlePage = () => {
  // Single state object to track collapsed states
  const [collapsedStates, setCollapsedStates] = useState({
    isBoardCollapsed: true,
    isNotePadCollapsed: true,
    isPlayersCollapsed: true,
    isOpponentCollapsed: true,
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [codeEditorWidth, setCodeEditorWidth] = useState(
    window.innerWidth * 0.6
  );
  const [selectedOpponent, setSelectedOpponent] = useState<Player>();

  // Helper function to update collapsed state
  const updateCollapsedState = (
    key: keyof typeof collapsedStates,
    value: boolean
  ) => {
    setCollapsedStates((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper function to close all containers except the one being toggled
  const closeAllContainersExcept = (
    keyToKeepOpen: keyof typeof collapsedStates
  ) => {
    setCollapsedStates((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (key !== keyToKeepOpen) {
          newState[key as keyof typeof collapsedStates] = true;
        }
      });
      return newState;
    });
  };

  const handleToggleBoard = () => {
    const willBoardBeCollapsed = !collapsedStates.isBoardCollapsed;

    // Close all other containers except Board
    if (!willBoardBeCollapsed) {
      closeAllContainersExcept("isBoardCollapsed");
    }

    // Adjust the CodeEditor width
    handleCodeEditorResize(
      willBoardBeCollapsed ? window.innerWidth * 0.6 : window.innerWidth * 0.4
    );

    // Update Board collapsed state
    updateCollapsedState("isBoardCollapsed", willBoardBeCollapsed);
  };

  const handleToggleNotePad = () => {
    const willNotePadBeCollapsed = !collapsedStates.isNotePadCollapsed;

    // Close all other containers except Notepad
    if (!willNotePadBeCollapsed) {
      closeAllContainersExcept("isNotePadCollapsed");
    }

    // Adjust the CodeEditor width
    handleCodeEditorResize(
      willNotePadBeCollapsed ? window.innerWidth * 0.6 : window.innerWidth * 0.4
    );

    // Update Notepad collapsed state
    updateCollapsedState("isNotePadCollapsed", willNotePadBeCollapsed);
  };

  const handleTogglePlayers = () => {
    const willPlayersCollapsed = !collapsedStates.isPlayersCollapsed;

    // Close all other containers except Players
    if (!willPlayersCollapsed) {
      closeAllContainersExcept("isPlayersCollapsed");
    }

    // Adjust the CodeEditor width
    handleCodeEditorResize(
      willPlayersCollapsed ? window.innerWidth * 0.6 : window.innerWidth * 0.4
    );

    // Update Players collapsed state
    updateCollapsedState("isPlayersCollapsed", willPlayersCollapsed);
  };

  const handleToggleOpponent = () => {
    const willOpponentBeCollapsed = !collapsedStates.isOpponentCollapsed;
    console.log({ willOpponentBeCollapsed });
    // Close all other containers except Opponent
    if (!willOpponentBeCollapsed) {
      closeAllContainersExcept("isOpponentCollapsed");
    }

    // Adjust the CodeEditor width
    handleCodeEditorResize(
      willOpponentBeCollapsed
        ? window.innerWidth * 0.6
        : window.innerWidth * 0.4
    );

    // Update Opponent collapsed state
    updateCollapsedState("isOpponentCollapsed", willOpponentBeCollapsed);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleCodeEditorResize = (newWidth: number) => {
    setCodeEditorWidth(newWidth);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-light-background dark:bg-dark-background">
      {/* Top Navigation Offset */}
      <div className="h-16 flex-shrink-0" />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Main Content Section */}
        <div className="relative flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Board */}
          <div
            className={`lg:h-full overflow-hidden transition-all duration-300 ${
              collapsedStates.isBoardCollapsed ? "w-0 hidden" : "flex-grow"
            }`}
            style={{ maxWidth: "100rem" }}
          >
            <Board
              gameMode="solo"
              isCollapsed={collapsedStates.isBoardCollapsed}
              onToggleCollapse={handleToggleBoard}
            />
          </div>

          {/* Notepad */}
          <div
            className={`lg:h-full overflow-hidden transition-all duration-300 ${
              collapsedStates.isNotePadCollapsed ? "w-0 hidden" : "flex-grow"
            }`}
            style={{ maxWidth: "100rem" }}
          >
            <Notepad
              isCollapsed={collapsedStates.isNotePadCollapsed}
              onToggleCollapse={handleToggleNotePad}
            />
          </div>

          {/* Players Container */}
          <div
            className={`lg:h-full overflow-hidden transition-all duration-300 ${
              collapsedStates.isPlayersCollapsed ? "w-0 hidden" : "flex-grow"
            }`}
            style={{ maxWidth: "220px" }}
          >
            <PlayersContainer
              isCollapsed={collapsedStates.isPlayersCollapsed}
              onToggleCollapse={handleTogglePlayers}
              onSelectOpponent={(player) => {
                setSelectedOpponent(player);
                handleToggleOpponent();
              }}
            />
          </div>

          {/* Opponent Container */}
          {selectedOpponent && (
            <div
              className={`lg:h-full overflow-hidden transition-all duration-300 ${
                collapsedStates.isOpponentCollapsed ? "w-0 hidden" : "flex-grow"
              }`}
              style={{ maxWidth: "200rem" }}
            >
              <OpponentContainer
                opponent={selectedOpponent}
                isCollapsed={collapsedStates.isOpponentCollapsed}
                onToggleCollapse={handleToggleOpponent}
              />
            </div>
          )}

          {/* Controls Menu */}
          <div className="absolute right-0 top-0 h-full flex items-center"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0"></div>
    </div>
  );
};

export default BattlePage;
