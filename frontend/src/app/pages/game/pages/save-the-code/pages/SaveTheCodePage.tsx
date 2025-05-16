import { useState, useEffect } from "react";
import { IncidentI } from "../../../../../../types/game/stc";
import Incident from "../components/Incident";
import CodeEditor from "../../../components/CodeEditor";
import IncidentModal from "../components/IncedentModal";
import IncidentFooter from "../components/IncidentFooter";
import { stcIncidents } from "../../../../../../constants/stc";

function SaveTheCodePage() {
  const [incident, setIncident] = useState<IncidentI | undefined>(
    stcIncidents[0]
  );
  const [hints, setHints] = useState<string[]>([]);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editorWidth, setEditorWidth] = useState(600);
  const [userSolution, setUserSolution] = useState(incident?.starterCode || "");
  const [validationResult, setValidationResult] = useState<any>(undefined);
  const [timer, setTimer] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [score, setScore] = useState<number | undefined>();

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGetNextIncident = () => {
    setIncident(undefined); // In a real app, fetch new incident
    setHints([]);
    setUserSolution("");
    setValidationResult(undefined);
    setTimer(0);
    setHintCount(0);
    setScore(undefined);
  };

  const handleGetHint = () => {
    if (!incident?.hints) return;

    setIsHintLoading(true);
    setTimeout(() => {
      const nextHint = incident.hints && incident.hints[hints.length];
      if (nextHint) {
        setHints([...hints, nextHint]);
        setHintCount((prev) => prev + 1);
      }
      setIsHintLoading(false);
    }, 1000);
  };

  const handleOpenIncidentModal = () => {
    setIsModalOpen(true);
  };

  const handleEditorResize = (newWidth: number) => {
    setEditorWidth(newWidth);
  };

  const handleSolutionSubmit = () => {
    // Simple validation - compare with solution code
    const isCorrect = userSolution.trim() === incident?.solutionCode.trim();
    const correctnessPercentage = isCorrect
      ? 100
      : calculateCorrectness(userSolution, incident?.solutionCode || "");

    setValidationResult({
      isValid: isCorrect,
      correctnessPercentage,
      timeComplexity: "O(n)", // Calculate based on solution
      spaceComplexity: "O(1)", // Calculate based on solution
      comments: isCorrect
        ? "Great job! Your solution matches the expected solution."
        : "Your solution doesn't quite match the expected solution. Compare the differences.",
      correctSolution: incident?.solutionCode,
      improvements: !isCorrect
        ? [
            "Consider adding sensor redundancy checks",
            "Ensure manual override takes precedence",
            "Add validation for sensor data discrepancies",
          ]
        : undefined,
    });

    setScore(
      isCorrect
        ? incident?.points
        : Math.floor((incident?.points || 0) * (correctnessPercentage / 100))
    );
  };

  const calculateCorrectness = (userCode: string, solutionCode: string) => {
    const userLines = userCode.split("\n").filter((line) => line.trim() !== "");
    const solutionLines = solutionCode
      .split("\n")
      .filter((line) => line.trim() !== "");

    let matchingLines = 0;
    userLines.forEach((line, i) => {
      if (solutionLines[i] && line.trim() === solutionLines[i].trim()) {
        matchingLines++;
      }
    });

    return Math.floor((matchingLines / solutionLines.length) * 100);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-light-background dark:bg-dark-background">
      <div className="flex flex-1 overflow-hidden mt-10">
        {/* Incident Panel */}
        <Incident
          incident={incident!}
          onGetNextIncident={handleGetNextIncident}
          hints={hints}
          isHintLoading={isHintLoading}
          onGetHint={handleGetHint}
          onOpenIncidentModal={handleOpenIncidentModal}
          isOpenOnMobile={isModalOpen}
        />

        {/* Code Editor */}
        <CodeEditor
          width={editorWidth}
          onResize={handleEditorResize}
          starterCode={incident?.starterCode}
          isReadOnly={false}
        />
      </div>

      {/* Incident Footer */}
      <IncidentFooter
        incident={incident!}
        userSolution={userSolution}
        validationResult={validationResult}
        onSolutionSubmit={handleSolutionSubmit}
        onNewProblem={handleGetNextIncident}
        validationError={null}
        timer={timer}
        hintCount={hintCount}
        score={score}
      />

      {isModalOpen && (
        <IncidentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          incident={incident!}
          hints={hints}
        />
      )}
    </div>
  );
}

export default SaveTheCodePage;
