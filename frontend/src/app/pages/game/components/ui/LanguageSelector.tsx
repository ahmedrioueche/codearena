import { useState, useEffect } from "react";
import { GameSettings } from "../../../../../types/game/game";
import { languages } from "../../../../../constants/game";

export default function LanguageSelector({
  settings,
  setSettings,
}: {
  settings: GameSettings;
  setSettings: (newSettings: GameSettings) => void;
}) {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return (
      localStorage.getItem("selectedLanguage") ||
      settings.language ||
      "javascript"
    );
  });
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  const topLanguages = [selectedLanguage, ...languages.map((l) => l.id)]
    .filter((id, index, self) => self.indexOf(id) === index)
    .slice(0, 5);

  const remainingLanguages = languages.filter(
    (l) => !topLanguages.includes(l.id)
  );

  const handleSelectLanguage = (langId: string) => {
    setSelectedLanguage(langId);
    setSettings({ ...settings, language: langId });
    setShowMore(false);
  };

  return (
    <div className="space-y-3">
      <div
        className="grid grid-cols-3 gap-2"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
        }}
      >
        {topLanguages.map((langId) => {
          const lang = languages.find((l) => l.id === langId);
          if (!lang) return null;
          return (
            <button
              key={lang.id}
              onClick={() => handleSelectLanguage(lang.id)}
              className={`p-2 rounded-lg border transition-all ${
                selectedLanguage === lang.id
                  ? "border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10"
                  : "border-light-border dark:border-dark-border"
              }`}
            >
              <div className="text-xl mb-1">{lang.icon}</div>
              <div className="text-xs text-light-foreground dark:text-white">
                {lang.name}
              </div>
            </button>
          );
        })}

        <button
          onClick={() => setShowMore(!showMore)}
          className="p-2 rounded-lg border border-light-border dark:border-dark-border"
        >
          <div className="text-xl mb-1">➕</div>
          <div className="text-xs text-light-foreground dark:text-white">
            More
          </div>
        </button>
      </div>

      {showMore && (
        <div className="mt-2 p-2 g bg-white dark:text-white text-black dark:bg-dark-background ">
          <div className="grid grid-cols-2 gap-2">
            {remainingLanguages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleSelectLanguage(lang.id)}
                className="p-2 rounded-lg flex flex-row space-x-1 items-center justify-center border border-light-border dark:border-dark-border transition-all hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
              >
                <div className="text-xl ">{lang.icon}</div>
                <div className="text-xs text-light-foreground dark:text-white">
                  {lang.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
