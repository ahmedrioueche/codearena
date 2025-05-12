import {
  useState,
  useRef,
  useEffect,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import {
  Check,
  X,
  Info,
  Lightbulb,
  AlertCircle,
  Fullscreen,
  Minimize,
  Loader2,
  Timer,
  Server,
  Target,
  ArrowRightCircle,
  Redo,
  Clock,
  Send,
  Award,
  CheckCircle,
  AlertTriangle,
  Bug,
} from "lucide-react";
import CodeEditor from "../../../components/CodeEditor";
import Button from "../../../../../../components/ui/Button";
import useScreen from "../../../../../../hooks/useScreen";
import { IncidentI } from "../../../../../../types/game/stc";
import { convertSeconds } from "../../../../../../utils/helper";
import TimeProgressBar from "../../../components/ui/TimeProgressBar";

interface SolutionValidationResult {
  isValid: boolean;
  correctnessPercentage: number;
  timeComplexity?: string;
  spaceComplexity?: string;
  syntaxMistakesCount?: number;
  logicMistakesCount?: number;
  codeQuality?: string;
  efficiencyRating?: string;
  comments?: string;
  useSolutionCorrection?: string;
  correctSolution?: string;
  bottleneckAnalysis?: string;
  improvements?: string[];
}

interface IncidentFooterProps {
  incident: IncidentI;
  userSolution: string;
  validationResult?: SolutionValidationResult;
  onSolutionSubmit: () => void;
  onNewProblem: () => void;
  validationError: string | null;
  timer: number;
  hintCount: number;
  score?: number;
}

const IncidentFooter = ({
  incident,
  userSolution,
  validationResult,
  onSolutionSubmit,
  onNewProblem,
  validationError,
  timer,
  hintCount,
  score,
}: IncidentFooterProps) => {
  const [showResults, setShowResults] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<"submit" | "null">("null");
  const [solutionValidationResult, setSolutionValidationResult] = useState<
    SolutionValidationResult | undefined
  >();
  const { isMobile } = useScreen();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [problemScore, setProblemScore] = useState<number | undefined>(score);

  useEffect(() => {
    setSolutionValidationResult(validationResult);
    setIsLoading("null");
  }, [JSON.stringify(validationResult)]);

  useEffect(() => {
    setIsLoading("null");
  }, [validationError]);

  useEffect(() => {
    setProblemScore(score);
  }, [score]);

  const handleSubmit = () => {
    setElapsedTime(timer);
    setIsLoading("submit");
    setShowResults(true);
    onSolutionSubmit();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-light-background dark:bg-dark-background border-t border-light-border dark:border-dark-border 
        ${
          solutionValidationResult !== undefined ? "h-[90vh]" : "h-18"
        } flex flex-col`}
    >
      {showResults && validationResult ? (
        <>
          {/* Fixed Header */}
          <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-800 p-3 px-6 sticky top-0">
            <div
              className={`flex ${
                isMobile ? "flex-col gap-2" : "items-center gap-4"
              }`}
            >
              <span
                className={`flex items-center gap-2 ${
                  validationResult.isValid ? "text-green-500" : "text-red-500"
                }`}
              >
                {validationResult.isValid ? (
                  <Check size={20} />
                ) : (
                  <X size={20} />
                )}
                {isMobile
                  ? validationResult.isValid
                    ? "Correct!"
                    : "Incorrect!"
                  : validationResult.isValid
                  ? "Solution is Correct!"
                  : "Solution is Incorrect!"}
              </span>
              <span className="flex items-center gap-2 text-light-foreground dark:text-dark-foreground">
                <Target size={16} />
                Accuracy: {`${validationResult.correctnessPercentage}%`}
              </span>
              <span className="flex items-center gap-2 text-light-foreground dark:text-dark-foreground">
                <Clock size={16} />
                {!isMobile && "Time:"} {`${convertSeconds(elapsedTime)} `}
              </span>
              {incident.points && (
                <span className="inline-flex items-center gap-2 text-light-foreground dark:text-dark-foreground">
                  <Award size={16} />
                  {!isMobile && <span>Score:</span>}
                  <span>{`${problemScore} points out of ${incident.points}`}</span>
                </span>
              )}
            </div>

            <div className="flex flex-col space-y-1 md:flex-row md:space-x-2 items-center">
              <button
                className="px-4 py-2 md:mt-1 rounded-lg bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 transition-opacity"
                onClick={() => {
                  setShowResults(false);
                  setSolutionValidationResult(undefined);
                  onNewProblem();
                }}
              >
                {!isMobile ? "New Problem" : <Redo size={18} />}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 transition-opacity"
                onClick={() => {
                  setShowResults(false);
                  setSolutionValidationResult(undefined);
                }}
              >
                {!isMobile ? "Continue" : <ArrowRightCircle size={18} />}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 transition-opacity"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize size={18} />
                ) : (
                  <Fullscreen size={isMobile ? 18 : 24} />
                )}
              </button>
            </div>
          </div>

          <div className="overflow-y-scroll flex-1 p-4 space-y-4">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 text-black dark:text-white">
              {validationResult.timeComplexity !== undefined && (
                <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Timer size={16} className="flex-shrink-0" />
                  <span>{`Time Complexity: ${validationResult.timeComplexity}`}</span>
                </div>
              )}
              {validationResult.spaceComplexity !== undefined && (
                <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Server size={16} className="flex-shrink-0" />
                  <span>{`Space Complexity: ${validationResult.spaceComplexity}`}</span>
                </div>
              )}

              {validationResult.syntaxMistakesCount !== undefined && (
                <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <AlertTriangle size={16} className="flex-shrink-0" />
                  <span>{`Syntax Mistakes: ${validationResult.syntaxMistakesCount}`}</span>
                </div>
              )}
              {validationResult.logicMistakesCount !== undefined && (
                <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Bug size={16} className="flex-shrink-0" />
                  <span>{`Logic Mistakes: ${validationResult.logicMistakesCount}`}</span>
                </div>
              )}
              {validationResult.codeQuality !== undefined && (
                <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <CheckCircle size={16} className="flex-shrink-0" />
                  <span>{`Code Quality: ${validationResult.codeQuality}`}</span>
                </div>
              )}
              {validationResult.efficiencyRating && (
                <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{`Efficiency: ${validationResult.efficiencyRating}`}</span>
                </div>
              )}
            </div>

            {validationResult.comments && (
              <div className="flex items-center gap-2 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-light-foreground dark:text-dark-foreground">
                <Info size={16} className="flex-shrink-0" />
                <span>{validationResult.comments}</span>
              </div>
            )}

            {incident.rootCause && (
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg flex flex-col space-y-1">
                <div className="flex items-start gap-2 text-light-foreground dark:text-dark-foreground">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>Root Cause:</span>
                </div>
                <p className="text-light-foreground dark:text-dark-foreground">
                  {incident.rootCause}
                </p>
              </div>
            )}

            {incident.fixExplanation && (
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg flex flex-col space-y-1">
                <div className="flex items-start gap-2 text-light-foreground dark:text-dark-foreground">
                  <Info size={16} className="flex-shrink-0" />
                  <span>Fix Explanation:</span>
                </div>
                <p className="text-light-foreground dark:text-dark-foreground">
                  {incident.fixExplanation}
                </p>
              </div>
            )}

            {!validationResult.isValid && incident.solutionCode && (
              <div className="flex flex-col p-3 bg-gray-100 dark:bg-gray-800 rounded-lg h-[400px]">
                <span className="font-bold text-light-foreground dark:text-dark-foreground">
                  Correct Solution:
                </span>
                <CodeEditor
                  gameMode="solo"
                  starterCode={incident.solutionCode}
                  isReadOnly={true}
                />
              </div>
            )}

            {validationResult.bottleneckAnalysis && (
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg flex flex-col space-y-1">
                <div className="flex items-start gap-2 text-light-foreground dark:text-dark-foreground">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>Bottleneck Analysis:</span>
                </div>
                <p className="text-light-foreground dark:text-dark-foreground">
                  {validationResult.bottleneckAnalysis}
                </p>
              </div>
            )}

            {(validationResult.improvements || incident.takeaways) && (
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex flex-col space-y-2">
                <div className="flex items-center gap-2 text-light-foreground dark:text-dark-foreground">
                  <Lightbulb size={16} className="flex-shrink-0" />
                  <span>Key Takeaways:</span>
                </div>
                <ul className="list-disc pl-6 text-light-foreground dark:text-dark-foreground">
                  {validationResult.improvements?.map((improvement, index) => (
                    <li key={`improvement-${index}`}>{improvement}</li>
                  ))}
                  {incident.takeaways?.map(
                    (
                      takeaway:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | null
                        | undefined,
                      index: any
                    ) => (
                      <li key={`takeaway-${index}`}>{takeaway}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          className={`flex ${
            isMobile
              ? "flex-col items-center space-y-4"
              : "justify-between items-center"
          } p-4`}
        >
          <TimeProgressBar
            currentTime={timer}
            averageTime={incident?.averageTime || 0}
          />

          <div className="flex flex-row space-x-2">
            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={isLoading === "submit"}
            >
              {isLoading === "submit" ? (
                <div className="flex flex-row space-x-2">
                  <Loader2 className="animate-spin" />
                  <span> Submit...</span>
                </div>
              ) : (
                <div className="flex flex-row items-center space-x-2">
                  <Send size={18} />
                  <span>Submit</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentFooter;
