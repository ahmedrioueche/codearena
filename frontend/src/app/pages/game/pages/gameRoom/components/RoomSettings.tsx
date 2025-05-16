import { useEffect, useRef, useState } from "react";
import { BookOpen, Clock, X, ChevronUp, ChevronDown } from "lucide-react";
import {
  languages,
  timeLimits,
  topics,
} from "../../../../../../constants/game";
import { GameSettings } from "../../../../../../types/game/game";
import useScreen from "../../../../../../hooks/useScreen";
import CustomSelect from "../../../../../../components/ui/CustomSelect";

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
  const [topicsOpen, setTopicsOpen] = useState(true);
  const { isMobile } = useScreen();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMobile, setIsOpen]);

  return (
    <>
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-16 h-full border-r border-light-border dark:border-dark-border transition-all duration-300 bg-light-background dark:bg-dark-background overflow-auto z-20
    ${
      isOpen
        ? "w-80 translate-x-0"
        : "-translate-x-full lg:translate-x-0 w-[25%]"
    }`}
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

              {/* Topics - Now Collapsible */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-light-foreground dark:text-white">
                    Topics
                  </label>
                  <button
                    onClick={() => setTopicsOpen(!topicsOpen)}
                    className="text-light-foreground dark:text-white"
                  >
                    {topicsOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {topicsOpen && (
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
                )}
              </div>

              {/* Player Settings - Improved with CustomSelect */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-light-foreground dark:text-white">
                  Players
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <CustomSelect
                    title="Max Players"
                    options={[
                      { value: "2", label: "2 players" },
                      { value: "4", label: "4 players" },
                      { value: "6", label: "6 players" },
                    ]}
                    selectedOption={settings.maxPlayers}
                    onChange={(value) =>
                      setSettings({ ...settings, maxPlayers: value })
                    }
                  />
                  <CustomSelect
                    title="Team Size"
                    options={[
                      { value: "1", label: "1 per team" },
                      { value: "2", label: "2 per team" },
                      { value: "3", label: "3 per team" },
                    ]}
                    selectedOption={settings.teamSize}
                    onChange={(value) =>
                      setSettings({ ...settings, teamSize: value })
                    }
                    className="bg-light-background dark:bg-dark-background"
                  />
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
