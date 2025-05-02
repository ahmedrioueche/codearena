import { useState } from "react";
import { BookOpen, Clock, X } from "lucide-react";
import {
  languages,
  timeLimits,
  topics,
} from "../../../../../../constants/game";
import { GameSettings } from "../../../../../../types/game/game";
import useScreen from "../../../../../../hooks/useScreen";

interface RoomSettingsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const RoomSettings = ({ isOpen, setIsOpen }: RoomSettingsProps) => {
  const [settings, setSettings] = useState<GameSettings>({
    language: "javascript",
    topics: [],
    maxPlayers: "4",
    teamSize: "2",
    timeLimit: "30",
    difficultyLevel: "easy",
  });
  const { isMobile } = useScreen();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 h-full border-r border-light-border dark:border-dark-border transition-all duration-300 bg-light-background dark:bg-dark-background overflow-auto
          ${
            isOpen
              ? "w-80 translate-x-0"
              : "-translate-x-full lg:translate-x-0 lg:w-80"
          }`}
        style={{ zoom: 0.9 }}
      >
        {/* Close Button (Left Arrow) at Top-Right of Sidebar */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-4 right-4 z-50 p-1 bg-light-primary dark:bg-dark-primary text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-4 pt-6">
          {(isOpen || !isMobile) && (
            <div className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-light-foreground dark:text-white">
                  Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() =>
                        setSettings({ ...settings, language: lang.id })
                      }
                      className={`p-2 rounded-lg border transition-all ${
                        settings.language === lang.id
                          ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                          : "border-light-border dark:border-dark-border"
                      }`}
                    >
                      <div className="text-xl mb-1">{lang.icon}</div>
                      <div className="text-xs text-light-foreground dark:text-white">
                        {lang.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-light-foreground dark:text-white">
                  Topics
                </label>
                <div className="space-y-2">
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

              {/* Player Settings */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-light-foreground dark:text-white">
                  Players
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs mb-1 block text-light-foreground dark:text-white">
                      Max Players
                    </label>
                    <select
                      value={settings.maxPlayers}
                      onChange={(e) =>
                        setSettings({ ...settings, maxPlayers: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-foreground dark:text-white"
                    >
                      {["2", "4", "6"].map((num) => (
                        <option key={num} value={num}>
                          {num} players
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block text-light-foreground dark:text-white">
                      Team Size
                    </label>
                    <select
                      value={settings.teamSize}
                      onChange={(e) =>
                        setSettings({ ...settings, teamSize: e.target.value })
                      }
                      className="w-full p-2 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-foreground dark:text-white"
                    >
                      {["1", "2", "3"].map((num) => (
                        <option key={num} value={num}>
                          {num} per team
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Time Limit */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-light-foreground dark:text-white">
                  Time Limit
                </label>
                <div className="grid grid-cols-3 gap-2">
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
              <button className="w-full p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomSettings;
