import { useState, useRef, useEffect, Suspense, lazy } from "react";
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
  FileCode2,
  Award,
  InfoIcon,
  CheckCircle,
  AlertTriangle,
  Bug,
  StepForward,
} from "lucide-react";
import {
  GameMode,
  Problem,
  SolutionValidationResult,
} from "../../../../types/game/game";
import CodeEditor from "./CodeEditor";
import useScreen from "../../../../hooks/useScreen";
import { convertSeconds } from "../../../../utils/helper";
import SolutionChat from "./SolutionChat";
import { ActionResult } from "../../../../types/general";
import Button from "../../../../components/ui/Button";
import TimeProgressBar from "./ui/TimeProgressBar";

const ScoreDetails = lazy(() => import("../components/ScoreDetails"));
const ConfirmGettingSolutionModal = lazy(
  () => import("./ui/ConfirmGettingSolutionModal")
);

const GameFooter = ({
  problem,
  userSolution,
  validationResult,
  onSolutionSubmit,
  onGetNextLine,
  onNewProblem,
  onGetSolution,
  validationError,
  timer,
  hintCount,
  nextLineHelpCount,
  score,
}: {
  gameMode: GameMode;
  problem: Problem;
  userSolution: string;
  validationResult: SolutionValidationResult | undefined;
  onSolutionSubmit: () => void;
  onGetNextLine: () => void;
  onNewProblem: () => void;
  onGetSolution: () => Promise<ActionResult>;
  validationError: string | null;
  timer: number;
  hintCount: number;
  nextLineHelpCount: number;
  score?: number;
}) => {
  const [showResults, setShowResults] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<"submit" | "next_line" | "null">(
    "null"
  );
  const [solutionValidationResult, setSolutionValidationResult] = useState<
    SolutionValidationResult | undefined
  >();
  const { isMobile } = useScreen();
  const [time, setTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const [IsGetSolutionModalOpen, setIsGetSolutionModalOpen] = useState(false);
  const [getSolutionResult, setGetSolutionResult] =
    useState<ActionResult>("idle");
  const [problemScore, setProblemScore] = useState<number | undefined>(0);

  useEffect(() => {
    setTime(timer);
  }, [timer]);

  useEffect(() => {
    setGetSolutionResult("idle");
  }, [problem?.id]);

  useEffect(() => {
    setProblemScore(score);
  }, [score]);

  const handleSubmit = () => {
    setElapsedTime(time);
    setIsLoading("submit");
    setShowResults(true);
    onSolutionSubmit();
  };

  useEffect(() => {
    setSolutionValidationResult(validationResult);
    setIsLoading("null");
  }, [JSON.stringify(validationResult)]);

  useEffect(() => {
    setIsLoading("null");
  }, [validationError]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleGetNextLine = () => {
    setIsLoading("next_line");
    onGetNextLine();
    setTimeout(() => {
      setIsLoading("null");
    }, 3000);
  };

  const handleGetSolution = async () => {
    const getSolutionResult = await onGetSolution();
    setGetSolutionResult(getSolutionResult);
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
              <span className="inline-flex items-center gap-2 text-light-foreground dark:text-dark-foreground">
                <Award size={16} />
                {!isMobile && <span>Score:</span>}
                <span>{`${problemScore} points ${
                  problem?.points ? `out of ${problem?.points}` : ""
                }`}</span>
                <button
                  onClick={() => setShowScoreDetails(true)}
                  className="hover:scale-105"
                >
                  <InfoIcon size={16} />
                </button>
              </span>
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
                  <span>{`Code Quatlity: ${validationResult.codeQuality}`}</span>
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

            {!validationResult.isValid &&
              validationResult.useSolutionCorrection && (
                <div className="flex flex-col p-3 bg-gray-100 dark:bg-gray-800 rounded-lg h-[400px]">
                  <span className="font-bold text-light-foreground dark:text-dark-foreground">
                    Feedback and Correction
                  </span>
                  <CodeEditor
                    gameMode="solo"
                    starterCode={validationResult.useSolutionCorrection}
                    isReadOnly={true}
                  />
                </div>
              )}

            {!validationResult.isValid && validationResult.correctSolution && (
              <div className="flex flex-col p-3 bg-gray-100 dark:bg-gray-800 rounded-lg h-[400px]">
                <span className="font-bold text-light-foreground dark:text-dark-foreground">
                  Correct Solution:
                </span>
                <CodeEditor
                  gameMode="solo"
                  starterCode={validationResult.correctSolution}
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

            {validationResult.improvements &&
              validationResult.improvements.length > 0 && (
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex flex-col space-y-2">
                  <div className="flex items-center gap-2 text-light-foreground dark:text-dark-foreground">
                    <Lightbulb size={16} className="flex-shrink-0" />
                    <span>Suggestions to Improve:</span>
                  </div>
                  <ul className="list-disc pl-6 text-light-foreground dark:text-dark-foreground">
                    {validationResult.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Chat Component */}
            {problem && (
              <SolutionChat
                problem={problem}
                userSolution={userSolution}
                solutionValidation={validationResult}
              />
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
            currentTime={time}
            averageTime={problem?.averageTime!}
          />

          <div className="flex flex-row space-x-2">
            <Button
              onClick={() => setIsGetSolutionModalOpen(true)}
              variant="primary"
              disabled={
                isLoading === "next_line" ||
                isLoading === "submit" ||
                getSolutionResult === "success"
              }
            >
              <div className="flex flex-row items-center space-x-2">
                <FileCode2 size={20} />
                <span>Solution</span>
              </div>
            </Button>
            <Button
              onClick={handleGetNextLine}
              variant="primary"
              disabled={
                getSolutionResult === "success" || isLoading == "submit"
              }
            >
              {isLoading === "next_line" ? (
                <div className="flex flex-row space-x-2">
                  <Loader2 className="animate-spin" />
                  <span> Help...</span>
                </div>
              ) : (
                <div className="flex flex-row items-center space-x-2">
                  <StepForward size={22} />
                  <span>Help</span>
                </div>
              )}
            </Button>
            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={
                getSolutionResult === "success" || isLoading == "next_line"
              }
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
      {validationResult && (
        <Suspense fallback={null}>
          <ScoreDetails
            isOpen={showScoreDetails}
            onClose={() => setShowScoreDetails(false)}
            problemPoints={problem?.points}
            result={validationResult}
            hintsCount={hintCount}
            nextLineHelpCount={nextLineHelpCount}
            timer={time}
          />
        </Suspense>
      )}
      <Suspense>
        <ConfirmGettingSolutionModal
          isOpen={IsGetSolutionModalOpen}
          onClose={() => setIsGetSolutionModalOpen(false)}
          onConfirm={handleGetSolution}
          operationResult={getSolutionResult}
        />
      </Suspense>
    </div>
  );
};

export default GameFooter;
