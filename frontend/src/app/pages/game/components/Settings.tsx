import { useState } from "react";
import { BookOpen, ChevronRight, Clock, X } from "lucide-react";
import { DifficultyLevel, GameSettings } from "../../../../types/game/game";
import useScreen from "../../../../hooks/useScreen";
import {
  difficultyLevels,
  timeLimits,
  topics,
} from "../../../../constants/game";
import LanguageSelector from "./ui/LanguageSelector";
import { useMatchConfig } from "../../../hooks/useMatchConfig";
import RadioGroup from "../../../../components/ui/RadioGroup";
import IconButton from "../../../../components/ui/IconButton";

interface SettingsProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Settings = ({ isCollapsed, onToggleCollapse }: SettingsProps) => {
  const { saveConfig, matchConfig } = useMatchConfig();

  const [settings, setSettings] = useState<GameSettings>({
    language: matchConfig?.language || "javascript",
    topics: matchConfig?.topics || topics.filter((t) => t.id === "algorithms"),
    difficultyLevel: matchConfig?.difficultyLevel || "medium",
    timeLimit: matchConfig?.timeLimit || "30",
    maxPlayers: "2",
    teamSize: "1",
  });

  const { isMobile } = useScreen();

  const handleSave = () => {
    saveConfig({
      language: settings.language,
      topics: settings.topics,
      difficultyLevel: settings.difficultyLevel,
      timeLimit: settings.timeLimit,
    });
    onToggleCollapse();
    window.location.reload();
  };

  return (
    <>
      <div
        className={`relative h-full transition-all duration-300 flex flex-col md:pr-10 ${
          isCollapsed ? "w-12" : "w-full"
        }`}
        role="region"
        aria-label="settings"
      >
        <div className="p-1 md:p-4 md:pt-6 overflow-auto">
          {(!isCollapsed || !isMobile) && (
            <div className="space-y-6">
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-light-foreground dark:text-white">
                  Language
                </label>
                {!isCollapsed && !isMobile && (
                  <IconButton onClick={onToggleCollapse} icon={ChevronRight} />
                )}
              </div>

              <LanguageSelector settings={settings} setSettings={setSettings} />

              {/* Topics */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-light-foreground dark:text-white">
                  Topics
                </label>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  }}
                >
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        const newTopics = settings.topics.includes(topic.id)
                          ? settings.topics.filter((t) => t !== topic.id)
                          : [...settings.topics, topic.id];
                        setSettings({ ...settings, topics: newTopics });
                      }}
                      className={`w-full p-2 rounded-lg border flex items-center space-x-2 ${
                        settings.topics.includes(topic.id)
                          ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                          : "border-light-border dark:border-dark-border"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-light-foreground dark:text-white" />
                      <span className="text-sm text-light-foreground dark:text-white">
                        {topic.name}
                      </span>
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
                    icon: level.icon,
                  }))}
                  value={settings.difficultyLevel}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      difficultyLevel: value as DifficultyLevel,
                    })
                  }
                  name="difficulty"
                />
              </div>
              {/* Time Limit */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-light-foreground dark:text-white">
                  Time Limit
                </label>
                <div
                  className="grid grid-cols-3 gap-2"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                  }}
                >
                  {timeLimits.map((time) => (
                    <button
                      key={time.id}
                      onClick={() =>
                        setSettings({ ...settings, timeLimit: time.id })
                      }
                      className={`p-2 rounded-lg border transition-all ${
                        settings.timeLimit === time.id
                          ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                          : "border-light-border dark:border-dark-border"
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1 text-light-foreground dark:text-white" />
                      <div className="text-xs text-light-foreground dark:text-white">
                        {time.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
