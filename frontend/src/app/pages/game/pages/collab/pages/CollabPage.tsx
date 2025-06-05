import {
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
  lazy,
} from "react";
import { useAppContext } from "../../../../../../context/AppContext";
import Problem from "../../../components/Problem";
import CodeEditor from "../../../components/CodeEditor";
import ControlsMenu from "../../../components/ControlsMenu";
import GameFooter from "../../../components/GameFooter";
import { useProblem } from "../../../hooks/useProblem";
import {
  Problem as ProblemInterface,
  SolutionValidationResult,
  GameMode,
} from "../../../../../../types/game/game";
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
import PlayersContainer from "../../battle/components/PlayersContainer";
const Notepad = lazy(() => import("../../../components/NotePad"));
const Board = lazy(() => import("../../../components/Board"));
const ProblemModal = lazy(() => import("../../../components/ProblemModal"));
const Settings = lazy(() => import("../../../components/Settings"));
const Help = lazy(() => import("../../../components/Help"));
const TestCases = lazy(
  () => import("../../../components/test-cases/TestCases")
);
const ProblemChat = lazy(() => import("../../../components/ProblemChat"));
const WIDTH_FACTOR = 0.74;

function CollabPage() {
  const { currentRoom } = useAppContext();
  const [collapsedStates, setCollapsedStates] = useState({
    board: true,
    notepad: true,
    controlsMenu: true,
    settings: true,
    help: true,
    testCases: true,
    chat: true,
    collaborators: true,
    players: true,
  });
  const [codeEditorWidth, setCodeEditorWidth] = useState(
    window.innerWidth * WIDTH_FACTOR
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
  const [hints, setHints] = useState<string[]>([]);
  const [currentCode, setCurrentCode] = useState("");
  const hasFetched = useRef(false);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [isNewProblem, setIsNewProblem] = useState(false);
  const [solutionValidationResult, setSolutionValidationResult] =
    useState<SolutionValidationResult>();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [nextLineHelpCount, setNextLineHelpCount] = useState(0);
  const [problemScore, setProblemScore] = useState(0);
  const [showTimeOver, setShowTimeOver] = useState(false);
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
        currentRoom.settings.topics.join(","),
        currentRoom.settings.language,
        currentRoom.settings.difficultyLevel
      );
      setProblem(problem!);
      setIsGameStarted(true);
      setIsNewProblem(true);
      excludeProblem(problem?.title, problem?.language, problem?.difficulty);
      setCurrentCode(problem?.starterCode || "");
      setTimeout(() => {
        setIsNewProblem(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);

  const handleGetHint = async () => {
    if (!problem) return;
    try {
      const hint = await getHint(problem, currentCode, hints);
      const cleanedHint = hint?.replace(/"/g, "");
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
        setProblemScore(totalScore);
      }
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

  const handleTimerChange = (timer: number) => {
    setTimer(timer);
  };

  const handleErrorRetry = async () => {
    setIsErrorOpen(false);
    if (error?.includes("validate")) {
      await handleSolutionSubmit();
    }
  };

  const handleGetNewProblem = async () => {
    setIsGameStarted(false);
    setIsProblemModalOpen(false);
    setSolutionValidationResult(undefined);
    setIsNewProblem(true);
    setHints([]);
    fetch();

    setTimeout(() => {
      setIsNewProblem(false);
    }, 3000);
  };

  const handleTimeOver = () => {
    setShowTimeOver(true);
  };

  const handleToggleComponent = (component: keyof typeof collapsedStates) => {
    setCollapsedStates((prevStates) => {
      const newStates = { ...prevStates };
      Object.keys(newStates).forEach((key) => {
        if (key !== component) {
          newStates[key as keyof typeof collapsedStates] = true;
        }
      });
      if (component !== "controlsMenu") {
        newStates.controlsMenu = true;
      }
      newStates[component] = !prevStates[component];
      handleCodeEditorResize(
        newStates[component]
          ? window.innerWidth * WIDTH_FACTOR
          : component === "chat"
          ? window.innerWidth * 0.49
          : component === "board"
          ? window.innerWidth * 0.3
          : window.innerWidth * 0.4
      );
      return newStates;
    });
  };

  const handleCodeEditorResize = (newWidth: number) => {
    setCodeEditorWidth(newWidth);
  };

  const gameMode: GameMode = "collab";
  const boardGameMode = "multiplayer";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-light-background dark:bg-dark-background">
      {loadingProblem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <LoadingSpinner />
            <p className="text-white mt-4">Loading problem...</p>
          </div>
        </div>
      )}

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

      <div className="h-16 flex-shrink-0" />
      <div className="flex flex-1 lg:flex-row min-h-0 overflow-hidden">
        {/* Problem Section */}
        <Problem
          gameMode={gameMode}
          problem={problem!}
          hints={hints}
          isHintLoading={loadingHint}
          onGetHint={handleGetHint}
          onOpenProblemModal={() => setIsProblemModalOpen(true)}
          isOpenOnMobile={isProblemOpenOnMobile}
          onGetNewProblem={handleGetNewProblem}
        />

        {/* Code Editor and Side Panels */}
        <div className="relative flex flex-1 md:flex-row min-h-0 overflow-hidden">
          {/* Code Editor */}
          <div
            className="flex-shrink-0 h-full"
            style={{ width: `${codeEditorWidth}px` }}
          >
            <CodeEditor
              gameMode={gameMode}
              width={codeEditorWidth}
              onResize={handleCodeEditorResize}
              starterCode={problem?.starterCode}
              currentCode={currentCode}
              onCodeChange={handleCodeChange}
            />
          </div>

          {isMobile ? (
            <>
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
                    gameMode={boardGameMode}
                    isCollapsed={collapsedStates.board}
                    onToggleCollapse={() => handleToggleComponent("board")}
                  />
                </Suspense>
              </BaseModal>

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
            </>
          ) : (
            <>
              <div
                className={`lg:h-full overflow-hidden transition-all duration-300 ${
                  collapsedStates.board ? "w-0 hidden" : "flex-grow"
                }`}
                style={{ maxWidth: "100rem" }}
              >
                <Suspense fallback={null}>
                  <Board
                    gameMode={boardGameMode}
                    isCollapsed={collapsedStates.board}
                    onToggleCollapse={() => handleToggleComponent("board")}
                  />
                </Suspense>
              </div>

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
              <div
                className={`lg:h-full overflow-hidden transition-all duration-300 ${
                  collapsedStates.players ? "w-0 hidden" : "flex-grow"
                }`}
                style={{ maxWidth: "100rem" }}
              >
                <Suspense fallback={null}>
                  <PlayersContainer
                    isCollapsed={collapsedStates.players}
                    onToggleCollapse={() => handleToggleComponent("players")}
                    onSelectOpponent={(player) => {}}
                  />
                </Suspense>
              </div>
            </>
          )}

          <div
            className={`lg:h-full overflow-hidden transition-all duration-300`}
          >
            <ControlsMenu
              gameMode={gameMode}
              isCollapsed={true}
              isGameStarted={isGameStarted}
              isOpenOnMobile={isControlsOpenOnMobile}
              onTimerChange={handleTimerChange}
              onToggleComponent={(component: string) =>
                handleToggleComponent(component as keyof typeof collapsedStates)
              }
              onGetNewProblem={handleGetNewProblem}
            />
          </div>
        </div>
      </div>

      <GameFooter
        gameMode={gameMode}
        problem={problem!}
        userSolution={currentCode}
        onSolutionSubmit={handleSolutionSubmit}
        onGetNextLine={handleGetNextLine}
        validationResult={solutionValidationResult}
        validationError={error}
        onGetSolution={handleGetSolution}
        onNewProblem={handleGetNewProblem}
        onTimeOver={handleTimeOver}
        timer={timer}
        hintCount={hints?.length}
        nextLineHelpCount={nextLineHelpCount}
        score={problemScore}
      />

      <Suspense fallback={null}>
        <ProblemModal
          isOpen={isProblemModalOpen}
          onClose={() => setIsProblemModalOpen(false)}
          problem={problem!}
          hints={hints}
          isHintLoading={loadingHint}
          onGetHint={handleGetHint}
          onGetNewProblem={handleGetNewProblem}
        />
      </Suspense>
    </div>
  );
}

export default CollabPage;
