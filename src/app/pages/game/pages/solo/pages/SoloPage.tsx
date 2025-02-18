import React, { useState } from "react";
import ProblemContainer from "../../../components/ProblemContainer";
import CodeEditor from "../../../components/CodeEditor";
import ControlsMenu from "../../../components/ControlsMenu";
import GameFooter from "../../../components/GameFooter";
import Board from "../../../components/Board";
import Notepad from "../../../components/NotePad";

const SoloPage = () => {
  const [isBoardCollapsed, setIsBoardCollapsed] = useState(true);
  const [isNotePadCollapsed, setIsNotePadCollapsed] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [codeEditorWidth, setCodeEditorWidth] = useState(
    window.innerWidth * 0.6
  );

  const handleToggleBoard = () => {
    const willBoardBeCollapsed = !isBoardCollapsed;

    setIsBoardCollapsed(willBoardBeCollapsed);
    // Close Notepad when opening Board
    if (!willBoardBeCollapsed) {
      setIsNotePadCollapsed(true);
    }

    // Adjust the CodeEditor width
    if (willBoardBeCollapsed) {
      handleCodeEditorResize(window.innerWidth * 0.6);
    } else {
      handleCodeEditorResize(window.innerWidth * 0.4);
    }
  };

  const handleToggleNotePad = () => {
    const willNotePadBeCollapsed = !isNotePadCollapsed;

    setIsNotePadCollapsed(willNotePadBeCollapsed);
    // Close Board when opening Notepad
    if (!willNotePadBeCollapsed) {
      setIsBoardCollapsed(true);
    }

    // Adjust the CodeEditor width
    if (willNotePadBeCollapsed) {
      handleCodeEditorResize(window.innerWidth * 0.6);
    } else {
      handleCodeEditorResize(window.innerWidth * 0.4);
    }
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
        <ProblemContainer gameMode="solo" />

        {/* Main Content Section */}
        <div className="relative flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Code Editor */}
          <CodeEditor
            gameMode="solo"
            width={codeEditorWidth}
            onResize={handleCodeEditorResize}
          />

          {/* Board */}
          <div
            className={`lg:h-full overflow-hidden transition-all duration-300 ${
              isBoardCollapsed ? "w-0 hidden" : "flex-grow"
            }`}
            style={{ maxWidth: "100rem" }}
          >
            <Board
              gameMode="solo"
              isCollapsed={isBoardCollapsed}
              onToggleCollapse={handleToggleBoard}
            />
          </div>

          {/* Notepad */}
          <div
            className={`lg:h-full overflow-hidden transition-all duration-300 ${
              isNotePadCollapsed ? "w-0 hidden" : "flex-grow"
            }`}
            style={{ maxWidth: "100rem" }}
          >
            <Notepad
              isCollapsed={isNotePadCollapsed}
              onToggleCollapse={handleToggleNotePad}
            />
          </div>

          {/* Solo Controls Menu */}
          <div className="absolute right-0 top-0 h-full flex items-center">
            <ControlsMenu
              isSidebarCollapsed={isSidebarCollapsed}
              onToggleSidebar={handleToggleSidebar}
              onToggleBoard={handleToggleBoard}
              onToggleNotePad={handleToggleNotePad}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0">
        <GameFooter gameMode="solo" />
      </div>
    </div>
  );
};

export default SoloPage;
