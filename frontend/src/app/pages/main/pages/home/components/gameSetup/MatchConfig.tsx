import { BookOpen, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import RadioGroup from "../../../../../../../components/ui/RadioGroup";
import {
  DifficultyLevel,
  GameMode,
  GameSettings,
} from "../../../../../../../types/game/game";
import {
  difficultyLevels,
  languages,
  timeLimits,
  topics,
} from "../../../../../../../constants/game";
import { useMatchConfig } from "../../../../../../hooks/useMatchConfig";

function MatchConfig({
  gameMode,
  isGameStarted,
  onChange,
}: {
  gameMode: GameMode;
  isGameStarted?: boolean;
  onChange?: (settings: GameSettings) => void;
}) {
  const { matchConfig } = useMatchConfig();
  const [newMatchConfig, setNewMatchConfig] = useState<GameSettings>({
    gameMode: gameMode,
    language: matchConfig?.language || "javascript",
    topics: matchConfig?.topics || topics.filter((t) => t.id === "algorithms"),
    difficultyLevel: matchConfig?.difficultyLevel || "medium",
    timeLimit: matchConfig?.timeLimit || "30",
  });

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>("medium");
  const [selectedTime, setSelectedTime] = useState("30");
  const { saveConfig } = useMatchConfig();

  useEffect(() => {
    saveConfig({
      gameMode: newMatchConfig.gameMode,
      language: newMatchConfig.language,
      topics: newMatchConfig.topics,
      difficultyLevel: selectedDifficulty,
      timeLimit: selectedTime,
    });
  }, [isGameStarted]);

  useEffect(() => {
    onChange ? onChange(newMatchConfig) : null;
  }, [newMatchConfig]);

  return (
    <div className="space-y-8">
      {/* Language Selection */}
      <div className="space-y-4">
        <label className="block text-base font-medium text-light-foreground dark:text-dark-foreground">
          Programming Language
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() =>
                setNewMatchConfig({ ...newMatchConfig, language: lang.id })
              }
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                newMatchConfig.language === lang.id
                  ? "border-light-primary dark:border-dark-primary bg-light-primary/5 dark:bg-dark-primary/10"
                  : "border-light-border dark:border-dark-border"
              }`}
            >
              <div className="text-2xl mb-2">{lang.icon}</div>
              <div className="text-sm font-medium text-light-foreground dark:text-dark-foreground">
                {lang.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        <label className="block text-base font-medium text-light-foreground dark:text-dark-foreground">
          Topics
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                const newTopics = newMatchConfig.topics.includes(topic.id)
                  ? newMatchConfig.topics.filter((t) => t !== topic.id)
                  : [...newMatchConfig.topics, topic.id];
                setNewMatchConfig({ ...newMatchConfig, topics: newTopics });
              }}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                newMatchConfig.topics.includes(topic.id)
                  ? "border-light-primary dark:border-dark-primary bg-light-primary/5 dark:bg-dark-primary/10"
                  : "border-light-border dark:border-dark-border"
              }`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                <span className="text-sm font-medium text-light-foreground dark:text-dark-foreground">
                  {topic.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-light-foreground dark:text-dark-foreground">
          Difficulty Level
        </label>
        <RadioGroup
          options={difficultyLevels.map((level) => ({
            id: level.id,
            label: level.name,
            description: level.description,
            icon: level.icon,
          }))}
          value={selectedDifficulty}
          onChange={(value) => setSelectedDifficulty(value as DifficultyLevel)}
          name="difficulty"
        />
      </div>

      {/* Time Limit Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-light-foreground dark:text-dark-foreground">
          Time Limit
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {timeLimits.map((time) => (
            <button
              key={time.id}
              onClick={() => setSelectedTime(time.id)}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selectedTime === time.id
                  ? "border-light-primary dark:border-dark-primary bg-light-primary/5 dark:bg-dark-primary/10 shadow-lg"
                  : "border-light-border dark:border-dark-border hover:border-light-primary/50 dark:hover:border-dark-primary/50"
              }`}
            >
              <div className="flex flex-col items-center">
                <Clock
                  className={`w-6 h-6 mb-3 
                      text-light-primary dark:text-dark-primary                  `}
                />
                <div className="text-xl font-bold text-light-foreground dark:text-dark-foreground mb-1">
                  {time.duration}
                </div>
                <div className="text-xs text-light-foreground dark:text-dark-foreground">
                  minutes
                </div>
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-t from-light-primary/5 to-transparent dark:from-dark-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
                  selectedTime === time.id ? "opacity-100" : ""
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MatchConfig;
