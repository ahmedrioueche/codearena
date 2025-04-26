import React, { useState, useEffect } from "react";
import CodeEditor from "../../../components/CodeEditor";
import { Player } from "../../../../../../types/game/game";

interface OpponentContainerProps {
  opponent: Player;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const OpponentContainer: React.FC<OpponentContainerProps> = ({
  opponent,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealTimeLeft, setRevealTimeLeft] = useState(0);
  const REVEAL_DURATION = 5; // seconds
  console.log({ opponent });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRevealed && revealTimeLeft > 0) {
      timer = setInterval(() => {
        setRevealTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRevealed(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRevealed, revealTimeLeft]);

  const handleReveal = () => {
    setIsRevealed(true);
    setRevealTimeLeft(REVEAL_DURATION);
  };

  return (
    <div
      className={`relative h-full transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-full"
      }`}
    >
      {" "}
      {/* CodeEditor Component */}
      <div
        className={`h-full w-full ${
          !isRevealed ? "blur-md" : ""
        } transition-all duration-300`}
      >
        <CodeEditor
          gameMode="battle"
          width={window.innerWidth}
          onResize={() => {}}
        />
      </div>
      {/* Overlay Content */}
      {!isRevealed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 dark:bg-white/10">
          <span className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-4">
            Opponent's Code
          </span>
          <button
            onClick={handleReveal}
            className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Reveal Code
          </button>
        </div>
      )}
      {/* Timer when revealed */}
      {isRevealed && revealTimeLeft > 0 && (
        <div className="absolute top-4 right-4 bg-light-primary dark:bg-dark-primary text-white px-3 py-1 rounded-full">
          {revealTimeLeft}s
        </div>
      )}
    </div>
  );
};

export default OpponentContainer;
