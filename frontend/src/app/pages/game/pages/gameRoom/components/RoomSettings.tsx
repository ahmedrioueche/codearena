import { useEffect, useRef, useState } from "react";
import { BookOpen, Clock, X, ChevronUp, ChevronDown } from "lucide-react";
import {
  difficultyLevels,
  languages,
  timeLimits,
  topics,
} from "../../../../../../constants/game";
import {
  DifficultyLevel,
  GameSettings,
} from "../../../../../../types/game/game";
import useScreen from "../../../../../../hooks/useScreen";
import { Room } from "../../../../../../types/game/room";
import { useAppContext } from "../../../../../../context/AppContext";
import RadioGroup from "../../../../../../components/ui/RadioGroup";
import { DEFAULT_GAME_SETTINGS } from "../../../../main/pages/home/components/gameSetup/CollabSetupModal";

interface RoomSettingsProps {
  room: Room;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onChange: (settings: GameSettings) => void;
}

const RoomSettings = ({
  room,
  isOpen,
  setIsOpen,
  onChange,
}: RoomSettingsProps) => {
  const { currentUser } = useAppContext();
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
  const [topicsOpen, setTopicsOpen] = useState(true);
  const { isMobile } = useScreen();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isAdmin = currentUser?._id === room?.adminId;
  console.log({ room });

  useEffect(() => {
    if (room?.settings) {
      if (JSON.stringify(room.settings) !== JSON.stringify(settings)) {
        setSettings(room.settings);
      }
    }
  }, [room?.settings]);

  useEffect(() => {
    if (isAdmin) onChange(settings);
  }, [settings]);

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
    <div
      ref={sidebarRef}
      className={`fixed left-0 top-16 h-full border-r ${
        isAdmin
          ? "bg-light-background dark:bg-dark-background "
          : `${
              isMobile
                ? "bg-black/40 dark:bg-black/70"
                : "bg-black/10 dark:bg-black/30"
            } backdrop-blur-sm inset-0`
      } border-light-border dark:border-dark-border transition-all duration-300  overflow-auto z-20
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
                      isAdmin && setSettings({ ...settings, language: lang.id })
                    }
                    className={`p-2 rounded-lg border transition-all ${
                      settings.language === lang.id
                        ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                        : "border-light-border dark:border-dark-border"
                    } ${!isAdmin ? "cursor-not-allowed opacity-70" : ""}`}
                    disabled={!isAdmin}
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
                  onClick={() => isAdmin && setTopicsOpen(!topicsOpen)}
                  className="text-light-foreground dark:text-white"
                  disabled={!isAdmin}
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
                        if (!isAdmin) return;
                        const newTopics = settings.topics.includes(topic.id)
                          ? settings.topics.filter((t) => t !== topic.id)
                          : [...settings.topics, topic.id];
                        setSettings({ ...settings, topics: newTopics });
                      }}
                      className={`w-full p-2 rounded-lg border flex items-center space-x-2 ${
                        settings.topics.includes(topic.id)
                          ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                          : "border-light-border dark:border-dark-border"
                      } ${!isAdmin ? "cursor-not-allowed opacity-70" : ""}`}
                      disabled={!isAdmin}
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
                value={settings.difficultyLevel}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    difficultyLevel: value as DifficultyLevel,
                  })
                }
                name="difficulty"
                disabled={!isAdmin}
              />
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
                      isAdmin &&
                      setSettings({ ...settings, timeLimit: time.duration })
                    }
                    className={`p-2 rounded-lg border transition-all ${
                      settings.timeLimit === time.duration
                        ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                        : "border-light-border dark:border-dark-border"
                    } ${!isAdmin ? "cursor-not-allowed opacity-70" : ""}`}
                    disabled={!isAdmin}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1 text-light-foreground dark:text-white" />
                    <div className="text-xs text-light-foreground dark:text-white">
                      {time.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button - Only show for admin */}
            {isAdmin && (
              <button className="w-full p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSettings;
