import React, { useState, useEffect } from "react";
import { Users, Loader2, Gamepad2 } from "lucide-react";
import { GameMode } from "../../../../../../../types/game/game";
import { Card, CardContent } from "../../../../../../../components/ui/Card";
import { GameSettings } from "../../../../../../../types/game/game";
import { User } from "../../../../../../../types/user";
import { GameApi } from "../../../../../../../api/game/game";
import { useAppContext } from "../../../../../../../context/AppContext";
import Button from "../../../../../../../components/ui/Button";

type SearchState = "idle" | "searching" | "found" | "ready" | "error";

interface MatchProgress {
  message: string;
  matchedCount: number;
}

const GameSearch: React.FC<{
  gameMode: GameMode;
  gameSettings: GameSettings;
  isSearchStarted: boolean;
}> = ({ gameSettings, isSearchStarted }) => {
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [foundPlayers, setFoundPlayers] = useState<User[]>([]);
  const [countdown, setCountdown] = useState<number>(3);
  const [progress, setProgress] = useState<MatchProgress>({ message: "", matchedCount: 0 });
  const { currentUser, setCurrentRoom } = useAppContext();

  useEffect(() => {
    if (isSearchStarted) {
      startSearch();
    } else {
      cancelSearch();
    }
    
    // Cleanup on unmount
    return () => {
      GameApi.cancelSearch();
    };
  }, [isSearchStarted]);

  const startSearch = async () => {
    setSearchState("searching");
    try {
      await GameApi.searchPlayers(gameSettings, {
        onMatchFound: (data) => {
          setCurrentRoom(data.room);
          setFoundPlayers(data.matchedUsers || []);
          setSearchState("found");
          startMatchCountdown();
        },
        onMatchProgress: (data) => {
          setProgress(data);
        },
        onError: (error) => {
          console.error("Search error:", error);
          setSearchState("error");
        },
      });
    } catch (error) {
      console.error("Failed to start search:", error);
      setSearchState("error");
    }
  };

  const cancelSearch = async () => {
    try {
      await GameApi.cancelSearch();
      setSearchState("idle");
      setProgress({ message: "", matchedCount: 0 });
    } catch (error) {
      console.error("Failed to cancel search:", error);
    }
  };

  const startMatchCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSearchState("ready");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const renderPlayerGrid = () => {
    // Include current user in the display
    const allPlayers = [currentUser, ...foundPlayers];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full">
        {allPlayers.map((player) => (
          <div
            key={player._id}
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
                src={"/icons/developer.png"}
                alt={player.username}
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full border-2 border-light-primary dark:border-dark-primary relative z-10 transition-transform duration-300 hover:scale-105"
              />
              {searchState === "ready" && (
                <div className="absolute -bottom-1 -right-1 bg-light-accent dark:bg-dark-accent rounded-full p-1 sm:p-1.5 shadow-lg z-20">
                  <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-light-background dark:text-dark-background" />
                </div>
              )}
            </div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base font-medium text-light-foreground dark:text-dark-foreground">
              {player.username}
              {player._id === currentUser._id && " (You)"}
            </p>
            <p className="text-xs sm:text-sm text-light-secondary dark:text-dark-secondary">
              Rating: {player.rank}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const getStatusMessage = () => {
    switch (searchState) {
      case "idle":
        return {
          title: "Ready to Search",
          subtitle: "Preparing matchmaking...",
        };
      case "searching":
        return {
          title: "Searching for Opponents...",
          subtitle: progress.message || "Looking for players with similar skill level",
        };
      case "found":
        return {
          title: "Players Found!",
          subtitle: `Match starting in ${countdown}...`,
        };
      case "ready":
        return {
          title: "Get Ready to Code!",
          subtitle: "Match is about to begin",
        };
      case "error":
        return {
          title: "No Players Found",
          subtitle: "Couldn't find opponents with current settings",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="w-full">
      <Card className="w-full border border-light-border dark:border-dark-border shadow-xl">
        <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Search Status Header */}
          <div className="text-center space-y-1 sm:space-y-2 md:mt-2 mt-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-stix font-bold text-light-text-primary dark:text-dark-text-primary px-4 sm:px-6">
              {status.title}
            </h2>
            <p className="text-sm sm:text-base text-light-text-secondary dark:text-dark-text-secondary font-medium px-4 sm:px-6">
              {status.subtitle}
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
                      src={"/icons/developer.png"}
                      alt="You"
                      className="w-24 h-24 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ) : searchState === "error" ? (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="bg-light-background dark:bg-dark-background rounded-full p-2 sm:p-3 border-2 border-light-primary/50 dark:border-dark-primary/50 shadow-lg">
                    <img
                      src={"/icons/developer.png"}
                      alt="You"
                      className="w-24 h-24 rounded-full opacity-80"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-2 shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <Button
                  onClick={startSearch}
                  variant="primary"
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              renderPlayerGrid()
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSearch;
