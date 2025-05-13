import {
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
  lazy,
} from "react";
import Problem from "../../../components/Problem";
import CodeEditor from "../../../components/CodeEditor";
import ControlsMenu from "../../../components/ControlsMenu";
import GameFooter from "../../../components/GameFooter";
import { useProblem } from "../../../hooks/useProblem";
import {
  Problem as ProblemInterface,
  SolutionValidationResult,
} from "../../../../../../types/game/game";
import { useMatchConfig } from "../../../../../hooks/useMatchConfig";
import LoadingSpinner from "../../../../../../components/ui/LoadingSpinner";
import BaseModal from "../../../../../../components/ui/BaseModal";
import Button from "../../../../../../components/ui/Button";
import { useScore } from "../../../hooks/useScore";
import useScreen from "../../../../../../hooks/useScreen";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import { ERRORS } from "../../../../../../constants/game";
import { ActionResult } from "../../../../../../types/general";
import {
  Cog,
  Hammer,
  HelpCircle,
  Layout,
  MessageCircle,
  Notebook,
} from "lucide-react";
const Notepad = lazy(() => import("../../../components/NotePad"));
const Board = lazy(() => import("../../../components/Board"));
const ProblemModal = lazy(() => import("../../../components/ProblemModal"));
const LeaveConfirmationModal = lazy(
  () => import("../../../components/ui/LeaveConfirmationModal")
);
const GetProblemConfirmationModal = lazy(
  () => import("../components/GetProblemConfirmationModal")
);
const ShowTimeOverModal = lazy(() => import("../components/ShowTimeOverModal"));

const Settings = lazy(() => import("../../../components/Settings"));
const Help = lazy(() => import("../../../components/Help"));
const TestCases = lazy(
  () => import("../../../components/test-cases/TestCases")
);
const ProblemChat = lazy(() => import("../../../components/ProblemChat"));

const SoloPage = () => {
  const [collapsedStates, setCollapsedStates] = useState({
    board: true,
    notepad: true,
    controlsMenu: true,
    settings: true,
    help: true,
    testCases: true,
    chat: true,
  });
  const [codeEditorWidth, setCodeEditorWidth] = useState(
    window.innerWidth * 0.6
  );
  const [problem, setProblem] = useState<ProblemInterface>();
  const {
    getProblem,
    getHint,
    validateSolution,
    getNextLine,
    getSolution,
    excludeProblem,
    loadingProblem,
    loadingHint,
    error,
  } = useProblem();
  const { matchConfig } = useMatchConfig();
  const [hints, setHints] = useState<string[]>([]);
  const [currentCode, setCurrentCode] = useState("");
  const hasFetched = useRef(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showNewProblemConfirmation, setShowNewProblemConfirmation] =
    useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(false);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [isNewProblem, setIsisNewProblem] = useState(false);
  const [solutionValidationResult, setSolutionValidationResult] =
    useState<SolutionValidationResult>();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [showTimeOver, setShowTimeOver] = useState(false);
  const [nextLineHelpCount, setNextLineHelpCount] = useState(0);
  const [problemScore, setProblemScore] = useState(0);
  const { calculateScore } = useScore();
  const { isMobile } = useScreen();
  const isProblemOpenOnMobile = useSelector(
    (state: RootState) => state.problemControl.isProblemToggled
  );
  const isControlsOpenOnMobile = useSelector(
    (state: RootState) => state.problemControl.isControlsToggled
  );

  useEffect(() => {
    if (error && error?.trim() !== "") {
      setIsErrorOpen(true);
    }
  }, [error]);

  const fetchProblem = useCallback(async () => {
    setSolutionValidationResult(undefined);

    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch();
  }, []);

  const fetch = async () => {
    try {
      const problem = await getProblem(
        matchConfig?.topics.join(","),
        matchConfig?.language,
        matchConfig?.difficultyLevel
      );
      setProblem(problem!);
      setIsGameStarted(true);
      setIsisNewProblem(true);
      excludeProblem(
        problem?.title,
        problem?.language || matchConfig?.language,
        problem?.difficulty
      );
      setCurrentCode(problem?.starterCode || "");
      setTimeout(() => {
        setIsisNewProblem(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);

  const handleGetNewProblem = async () => {
    setIsGameStarted(false);
    setIsProblemModalOpen(false);
    setSolutionValidationResult(undefined);
    setIsisNewProblem(true);
    setHints([]);
    fetch();

    setTimeout(() => {
      setIsisNewProblem(false);
    }, 3000);
  };

  const handleGetSolution = async (): Promise<ActionResult> => {
    try {
      const solution = await getSolution(problem!);
      if (solution.trim() !== "" && solution.trim() !== ERRORS.noSolution) {
        setCurrentCode(solution);
      }
      return "success";
    } catch (e) {
      console.log("Error getting solution", e);
      return "error";
    }
  };

  const handleGetHint = async () => {
    if (!problem) return;

    try {
      const hint = await getHint(problem, currentCode, hints);
      const cleanedHint = hint?.replace(/"/g, ""); // Removes all double quotes

      setHints((prevHints) => [...prevHints, cleanedHint!]);
    } catch (error) {
      console.error("Error fetching hint:", error);
      setHints((prevHints) => [
        ...prevHints,
        "Failed to fetch hint. Please try again.",
      ]);
    }
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
  };

  const handleSolutionSubmit = async () => {
    try {
      const result = await validateSolution(currentCode);
      setSolutionValidationResult(result);
      if (result) {
        const { totalScore } = calculateScore(
          problem?.points,
          result,
          hints.length,
          nextLineHelpCount,
          timer,
          problem?.averageTime!
        );
        console.log("totalScore", totalScore);
        setProblemScore(totalScore);
        await updateUserScore();
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const updateUserScore = async () => {
    try {
      let response; //updateUser({ addedScore: problemScore });
      console.log({ response });
    } catch (e) {
      console.log("Error", e);
    }
  };

  const handleGetNextLine = async () => {
    try {
      const code = await getNextLine(problem!, currentCode);
      if (code.trim() !== "") {
        setCurrentCode(code);
        setNextLineHelpCount((prev) => prev + 1);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const handleTimerChange = (timer: number) => {
    setTimer(timer);
  };

  const handleErrorRetry = async () => {
    setIsErrorOpen(false);

    if (error?.includes("validate")) {
      await handleSolutionSubmit();
    } else {
      await handleGetNewProblem();
    }
  };

  const handleTimeOver = () => {
    setShowTimeOver(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      setShowLeaveModal(true);
      return "";
    };

    const handleRouteChange = () => {
      setPendingNavigation(true);
      setShowLeaveModal(true);
      throw "Navigation cancelled";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [currentCode, problem?.starterCode]);

  const handleConfirmLeave = () => {
    if (pendingNavigation) {
      window.history.back();
    }
    setShowLeaveModal(false);
    setPendingNavigation(false);
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    setPendingNavigation(false);
  };

  const handleToggleComponent = (component: keyof typeof collapsedStates) => {
    setCollapsedStates((prevStates) => {
      const newStates = { ...prevStates };

      // Collapse all other components except the one being toggled
      Object.keys(newStates).forEach((key) => {
        if (key !== component) {
          newStates[key as keyof typeof collapsedStates] = true;
        }
      });

      // Always collapse the ControlsMenu when toggling other components
      if (component !== "controlsMenu") {
        newStates.controlsMenu = true;
      }

      // Toggle the state of the component being toggled
      newStates[component] = !prevStates[component];

      // Adjust the code editor width based on the component being toggled
      handleCodeEditorResize(
        newStates[component] ? window.innerWidth * 0.6 : window.innerWidth * 0.4
      );

      return newStates;
    });
  };

  const handleCodeEditorResize = (newWidth: number) => {
    setCodeEditorWidth(newWidth);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-light-background dark:bg-dark-background">
      {/* Loading Spinner */}
      {loadingProblem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <LoadingSpinner />
            <p className="text-white mt-4">Loading problem...</p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {isErrorOpen && (
        <BaseModal
          isOpen={isErrorOpen}
          onClose={() => setIsErrorOpen(false)}
          title="Error"
          width="40vw"
          buttons={
            <div className="flex flex-row space-x-2">
              <Button variant="primary" onClick={handleErrorRetry}>
                Retry
              </Button>
              <Button variant="ghost" onClick={() => setIsErrorOpen(false)}>
                Cancel
              </Button>
            </div>
          }
        >
          <p className="flex items-center justify-center text-center text-white">
            Error: {String(error)}
          </p>
        </BaseModal>
      )}

      {/* Main Content */}
      <div className="h-16 flex-shrink-0" />
      <div className="flex flex-1 lg:flex-row min-h-0 overflow-hidden">
        {/* Problem Section */}
        <Problem
          gameMode="solo"
          problem={problem!}
          onGetNewProblem={() => setShowNewProblemConfirmation(true)}
          hints={hints}
          isHintLoading={loadingHint}
          onGetHint={handleGetHint}
          onOpenProblemModal={() => setIsProblemModalOpen(true)}
          isOpenOnMobile={isProblemOpenOnMobile}
        />

        {/* Code Editor and Side Panels */}
        <div className="relative flex flex-1 md:flex-row min-h-0 overflow-hidden">
          {/* Code Editor */}
          <CodeEditor
            gameMode="solo"
            width={codeEditorWidth}
            onResize={handleCodeEditorResize}
            starterCode={problem?.starterCode}
            currentCode={currentCode}
            onCodeChange={handleCodeChange}
          />

          {/* Board */}
          {isMobile ? (
            <BaseModal
              isOpen={!collapsedStates.board}
              onClose={() => handleToggleComponent("board")}
              title="Board"
              icon={Layout}
              width="95vw"
              height="90vh"
            >
              <Suspense fallback={null}>
                <Board
                  gameMode="solo"
                  isCollapsed={collapsedStates.board}
                  onToggleCollapse={() => handleToggleComponent("board")}
                />
              </Suspense>
            </BaseModal>
          ) : (
            <div
              className={`lg:h-full overflow-hidden transition-all duration-300 ${
                collapsedStates.board ? "w-0 hidden" : "flex-grow"
              }`}
              style={{ maxWidth: "100rem" }}
            >
              <Suspense fallback={null}>
                <Board
                  gameMode="solo"
                  isCollapsed={collapsedStates.board}
                  onToggleCollapse={() => handleToggleComponent("board")}
                />
              </Suspense>
            </div>
          )}

          {/* Notepad */}
          {isMobile ? (
            <BaseModal
              isOpen={!collapsedStates.notepad}
              onClose={() => handleToggleComponent("notepad")}
              title="Notepad"
              icon={Notebook}
              width="95vw"
              height="90vh"
            >
              <Suspense fallback={null}>
                <Notepad
                  isCollapsed={collapsedStates.notepad}
                  onToggleCollapse={() => handleToggleComponent("notepad")}
                />
              </Suspense>
            </BaseModal>
          ) : (
            <div
              className={`lg:h-full overflow-hidden transition-all duration-300 ${
                collapsedStates.notepad ? "w-0 hidden" : "flex-grow"
              }`}
              style={{ maxWidth: "100rem" }}
            >
              <Suspense fallback={null}>
                <Notepad
                  isCollapsed={collapsedStates.notepad}
                  onToggleCollapse={() => handleToggleComponent("notepad")}
                />
              </Suspense>
            </div>
          )}

          {/* Settings */}
          {isMobile ? (
            <BaseModal
              isOpen={!collapsedStates.settings}
              onClose={() => handleToggleComponent("settings")}
              title="Settings"
              icon={Cog}
              width="95vw"
              height="90vh"
            >
              <Suspense fallback={null}>
                <Settings
                  isCollapsed={collapsedStates.settings}
                  onToggleCollapse={() => handleToggleComponent("settings")}
                />
              </Suspense>
            </BaseModal>
          ) : (
            <div
              className={`lg:h-full overflow-hidden transition-all duration-300 ${
                collapsedStates.settings ? "w-0 hidden" : "flex-grow"
              }`}
              style={{ maxWidth: "100rem" }}
            >
              <Suspense fallback={null}>
                <Settings
                  isCollapsed={collapsedStates.settings}
                  onToggleCollapse={() => handleToggleComponent("settings")}
                />
              </Suspense>
            </div>
          )}

          {/* Help */}
          {isMobile ? (
            <BaseModal
              isOpen={!collapsedStates.help}
              onClose={() => handleToggleComponent("help")}
              title="Help"
              icon={HelpCircle}
              width="95vw"
              height="90vh"
            >
              <Suspense fallback={null}>
                <Help
                  isCollapsed={collapsedStates.help}
                  onToggleCollapse={() => handleToggleComponent("help")}
                />
              </Suspense>
            </BaseModal>
          ) : (
            <div
              className={`lg:h-full overflow-hidden transition-all duration-300 ${
                collapsedStates.help ? "w-0 hidden" : "flex-grow"
              }`}
              style={{ maxWidth: "100rem" }}
            >
              <Suspense fallback={null}>
                <Help
                  isCollapsed={collapsedStates.help}
                  onToggleCollapse={() => handleToggleComponent("help")}
                />
              </Suspense>
            </div>
          )}

          {/* Test */}
          {isMobile ? (
            <BaseModal
              isOpen={!collapsedStates.testCases}
              onClose={() => handleToggleComponent("testCases")}
              title="Test Cases"
              icon={Hammer}
              width="95vw"
              height="90vh"
            >
              <Suspense fallback={null}>
                <TestCases
                  problem={problem}
                  solution={currentCode}
                  isCollapsed={collapsedStates.testCases}
                  onToggleCollapse={() => handleToggleComponent("testCases")}
                  isNew={isNewProblem}
                />
              </Suspense>
            </BaseModal>
          ) : (
            <div
              className={`lg:h-full overflow-hidden transition-all duration-300 ${
                collapsedStates.testCases ? "w-0 hidden" : "flex-grow"
              }`}
              style={{ maxWidth: "100rem" }}
            >
              <Suspense fallback={null}>
                <TestCases
                  problem={problem}
                  solution={currentCode}
                  isCollapsed={collapsedStates.testCases}
                  onToggleCollapse={() => handleToggleComponent("testCases")}
                  isNew={isNewProblem}
                />
              </Suspense>
            </div>
          )}

          {isMobile ? (
            <BaseModal
              isOpen={!collapsedStates.chat}
              onClose={() => handleToggleComponent("chat")}
              title="Chat with AI"
              icon={MessageCircle}
              width="95vw"
              height="90vh"
            >
              <Suspense fallback={null}>
                <ProblemChat
                  problem={problem!}
                  isCollapsed={collapsedStates.chat}
                  onToggleCollapse={() => handleToggleComponent("chat")}
                />
              </Suspense>
            </BaseModal>
          ) : (
            <div
              className={`lg:h-full overflow-hidden transition-all duration-300 ${
                collapsedStates.chat ? "w-0 hidden" : "flex-none w-[400px]"
              }`}
              style={{ maxWidth: "100%" }}
            >
              <Suspense fallback={null}>
                <ProblemChat
                  problem={problem!}
                  isCollapsed={collapsedStates.chat}
                  onToggleCollapse={() => handleToggleComponent("chat")}
                />
              </Suspense>
            </div>
          )}

          {/* Controls Menu */}
          <div
            className={`lg:h-full overflow-hidden transition-all duration-300`}
            style={{ maxWidth: "100rem" }}
          >
            <ControlsMenu
              gameMode="solo"
              isCollapsed={collapsedStates.controlsMenu}
              isGameStarted={isGameStarted}
              isOpenOnMobile={isControlsOpenOnMobile}
              onTimerChange={handleTimerChange}
              onGetNewProblem={() => setShowNewProblemConfirmation(true)}
              onToggleComponent={(component: string) =>
                handleToggleComponent(component as keyof typeof collapsedStates)
              }
            />
          </div>
        </div>
      </div>

      {/* Game Footer */}
      <div className="flex-shrink-0 overflow-auto">
        <GameFooter
          gameMode="solo"
          problem={problem!}
          userSolution={currentCode}
          onSolutionSubmit={handleSolutionSubmit}
          onGetNextLine={handleGetNextLine}
          validationResult={solutionValidationResult}
          validationError={error}
          onNewProblem={handleGetNewProblem}
          onGetSolution={handleGetSolution}
          onTimeOver={handleTimeOver}
          timer={timer}
          hintCount={hints?.length}
          nextLineHelpCount={nextLineHelpCount}
          score={problemScore}
        />
      </div>

      <Suspense fallback={null}>
        <ProblemModal
          isOpen={isProblemModalOpen}
          onClose={() => setIsProblemModalOpen(false)}
          problem={problem!}
          onGetNewProblem={() => setShowNewProblemConfirmation(true)}
          hints={hints}
          isHintLoading={loadingHint}
          onGetHint={handleGetHint}
        />
      </Suspense>

      <Suspense fallback={null}>
        <LeaveConfirmationModal
          isOpen={showLeaveModal}
          onClose={handleCancelLeave}
          onConfirm={handleConfirmLeave}
        />
      </Suspense>

      <Suspense fallback={null}>
        <GetProblemConfirmationModal
          isOpen={showNewProblemConfirmation}
          onClose={() => setShowNewProblemConfirmation(false)}
          onConfirm={() => {
            handleGetNewProblem();
            setShowNewProblemConfirmation(false);
          }}
        />
      </Suspense>

      <Suspense fallback={null}>
        <ShowTimeOverModal
          isOpen={showTimeOver}
          onClose={() => setShowTimeOver(false)}
        />
      </Suspense>
    </div>
  );
};

export default SoloPage;
