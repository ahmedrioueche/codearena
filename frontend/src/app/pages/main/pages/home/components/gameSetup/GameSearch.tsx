import React, { useState, useEffect } from "react";
import { Users, Loader2, Gamepad2 } from "lucide-react";
import { GameMode } from "../../../../../../../types/game/game";
import { Card, CardContent } from "../../../../../../../components/ui/Card";
import { GameSettings, Player } from "../../../../../../../types/game/game";

type SearchState = "searching" | "found" | "ready";

const GameSearch: React.FC<{
  gameMode: GameMode;
  gameSettings: GameSettings;
}> = ({ gameMode, gameSettings }) => {
  const [searchState, setSearchState] = useState<SearchState>("searching");
  const [foundPlayers, setFoundPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFoundPlayers([
        { id: 1, name: "Player 1", rating: 1500, skillLevel: "beginner" },
        { id: 2, name: "Player 2", rating: 1550, skillLevel: "beginner" },
        { id: 3, name: "Player 3", rating: 1525, skillLevel: "beginner" },
        { id: 4, name: "Player 4", rating: 1575, skillLevel: "beginner" },
      ]);
      setSearchState("found");

      setTimeout(() => {
        setSearchState("ready");
      }, 2000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const renderPlayerGrid = () => {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full">
        {foundPlayers.map((player) => (
          <div
            key={player.id}
            className="flex flex-col items-center text-center"
          >
            <div className="relative inline-block">
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  searchState === "ready"
                    ? "bg-light-primary/10 dark:bg-dark-primary/10"
                    : ""
                }`}
              />
              <img
                src="/icons/developer.png"
                alt={player.name}
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-2 border-light-primary dark:border-dark-primary relative z-10 transition-transform duration-300 hover:scale-105"
              />
              {searchState === "ready" && (
                <div className="absolute -bottom-1 -right-1 bg-light-accent dark:bg-dark-accent rounded-full p-1 sm:p-1.5 shadow-lg z-20">
                  <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-light-background dark:text-dark-background" />
                </div>
              )}
            </div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base font-medium text-light-foreground dark:text-dark-foreground">
              {player.name}
            </p>
            <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary">
              Rating: {player.rating}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Card className="w-full bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border shadow-xl">
        <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Search Status Header */}
          <div className="text-center space-y-1 sm:space-y-2 md:mt-2 mt-6 ">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-stix font-bold text-light-foreground dark:text-dark-foreground px-4 sm:px-6">
              {searchState === "searching" && "Searching for Opponents..."}
              {searchState === "found" && "Players Found!"}
              {searchState === "ready" && "Get Ready to Code!"}
            </h2>
            <p className="text-sm sm:text-base text-light-secondary dark:text-dark-secondary font-medium px-4 sm:px-6">
              {searchState === "searching" &&
                "Looking for players with similar skill level"}
              {searchState === "found" && "Preparing match setup"}
              {searchState === "ready" && "Match starting in 3..."}
            </p>
          </div>

          {/* Search Animation or Players */}
          <div className="relative py-4 sm:py-6 lg:py-8">
            {searchState === "searching" ? (
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className="absolute inset-0 animate-ping rounded-full bg-light-primary/20 dark:bg-dark-primary/20"
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div
                    className="absolute inset-0 animate-ping delay-150 rounded-full bg-light-primary/15 dark:bg-dark-primary/15"
                    style={{ width: "120px", height: "120px" }}
                  />
                  <div className="relative z-10 bg-light-background dark:bg-dark-background rounded-full p-2 sm:p-3 border-2 border-light-primary dark:border-dark-primary shadow-lg">
                    <img
                      src="/icons/developer.png"
                      alt="Developer"
                      className="w-24 h-24 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                {renderPlayerGrid()}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {searchState === "found" && (
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-light-primary dark:text-dark-primary animate-spin" />
                  )}
                  {searchState === "ready" && (
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-light-accent dark:text-dark-accent" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Match Details */}
          <div className="bg-light-secondary/5 dark:bg-dark-secondary/5 rounded-xl p-3 sm:p-4 lg:p-6 border border-light-border dark:border-dark-border">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                { label: "Game Mode", value: gameMode },
                { label: "Language", value: gameSettings.language },
                { label: "Difficulty", value: gameSettings.difficultyLevel },
                {
                  label: "Time Limit",
                  value: `${gameSettings.timeLimit} minutes`,
                },
              ].map((detail, index) => (
                <div key={index} className="space-y-0.5 sm:space-y-1">
                  <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary font-medium">
                    {detail.label}
                  </p>
                  <p className="text-sm md:text-base font-stix font-medium text-light-foreground dark:text-dark-foreground capitalize">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSearch;
