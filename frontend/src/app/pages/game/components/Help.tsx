import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { SCORE_VALUES } from "../../../../constants/game";
import useScreen from "../../../../hooks/useScreen";
import IconButton from "../../../../components/ui/IconButton";

interface HelpProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Help = ({ isCollapsed, onToggleCollapse }: HelpProps) => {
  const [openSections, setOpenSections] = useState({
    score: true,
    howToPlay: false,
    tips: false,
  });
  const { isMobile } = useScreen();
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      className={`relative h-full transition-all duration-300 flex flex-col text-light-foreground dark:text-white ${
        isCollapsed ? "w-12" : "w-full"
      }`}
    >
      <div className="p-1 md:p-4 md:pt-6 overflow-auto">
        {(!isCollapsed || !isMobile) && (
          <div className="space-y-6">
            <div className="flex flex-row items-center justify-between">
              <label className="text-lg font-medium ">Game Guide</label>
              {!isCollapsed && !isMobile && (
                <IconButton onClick={onToggleCollapse} icon={ChevronRight} />
              )}
            </div>

            {/* Rest of your existing Help component content remains the same */}
            <div className="pt-2">
              <button
                onClick={() => toggleSection("score")}
                className="w-full flex items-center justify-between group py-2"
              >
                <h3 className="text-base font-stix">Scoring System</h3>
                <div className="transform transition-transform duration-200">
                  {openSections.score ? (
                    <ChevronUp className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                  )}
                </div>
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openSections.score
                    ? "max-h-[800px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="py-4 space-y-4">
                  <div className="bg-light-background/50 dark:bg-dark-background/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">
                      Base Score Components
                    </h4>
                    <div className="space-y-2">
                      <p>
                        • Correctness: {SCORE_VALUES.correctnessWeight * 100}%
                        of total score
                      </p>
                      <p>• Efficiency Rating Impact:</p>
                      <div className="ml-4 grid grid-cols-2 gap-2">
                        {Object.entries(SCORE_VALUES.efficiencyWeights).map(
                          ([rating, weight]) => (
                            <div
                              key={rating}
                              className="flex items-center space-x-2"
                            >
                              <span className="text-sm">{rating}:</span>
                              <span className="text-sm font-medium">
                                {weight * 100}%
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-light-background/50 dark:bg-dark-background/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Penalties & Bonuses</h4>
                    <div className="space-y-2">
                      <p>
                        • Hint Usage: -{SCORE_VALUES.penalties.hint * 100}% each
                      </p>
                      <p>
                        • Next Line Help: -
                        {SCORE_VALUES.penalties.nextLineHelp * 100}% each
                      </p>
                      <p>
                        • Time Penalty: -
                        {SCORE_VALUES.penalties.timePerSecond * 100}% per second
                        after {SCORE_VALUES.timeThreshold}s
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Play Section */}
            <div className="border-t border-light-border dark:border-dark-border pt-4">
              <button
                onClick={() => toggleSection("howToPlay")}
                className="w-full flex items-center justify-between group py-2"
              >
                <h3 className="text-base font-stix">How to Play</h3>
                <div className="transform transition-transform duration-200">
                  {openSections.howToPlay ? (
                    <ChevronUp className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                  )}
                </div>
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openSections.howToPlay
                    ? "max-h-[400px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="py-4 space-y-3 text-light-foreground dark:text-dark-foreground">
                  <p>1. Write your solution in the code editor</p>
                  <p>2. Use test cases to verify your solution</p>
                  <p>3. Optimize your code for better performance</p>
                  <p>4. Submit when you're ready for final evaluation</p>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="border-t border-light-border dark:border-dark-border pt-4">
              <button
                onClick={() => toggleSection("tips")}
                className="w-full flex items-center justify-between group py-2"
              >
                <h3 className="text-base font-stix">Pro Tips</h3>
                <div className="transform transition-transform duration-200">
                  {openSections.tips ? (
                    <ChevronUp className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-light-primary dark:text-dark-primary" />
                  )}
                </div>
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openSections.tips
                    ? "max-h-[400px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="py-4 space-y-3 ">
                  <p>• Consider edge cases in your solution</p>
                  <p>• Test with various input sizes</p>
                  <p>• Review time complexity before submitting</p>
                  <p>• Use efficient data structures</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;
