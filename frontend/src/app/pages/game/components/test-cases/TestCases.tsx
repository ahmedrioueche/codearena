import { useState, useCallback, useEffect } from "react";
import { RefreshCw, Loader2, ChevronRight, PlusCircle } from "lucide-react";
import TestCaseList from "./TestCaseList";
import Button from "../../../../../components/ui/Button";
import { Problem, TestCase, TestResult } from "../../../../../types/game/game";
import IconButton from "../../../../../components/ui/IconButton";
import { useProblem } from "../../hooks/useProblem";
import { ActionResult } from "../../../../../types/general";
import useScreen from "../../../../../hooks/useScreen";

interface TestCaseProps {
  problem: Problem | undefined;
  solution: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isNew: boolean;
}

function TestCases({
  problem,
  solution,
  isCollapsed,
  onToggleCollapse,
  isNew,
}: TestCaseProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { getTestCases, validateTestCases, runTestCases } = useProblem();
  const [testCasesGenerated, setTestCasesGenerated] = useState(false);
  const [testCasesValidated, setTestCasesValidated] = useState(false);
  const [code, setCode] = useState("");
  const [testCasesResult, setTestCasesResult] = useState<TestResult[]>([]);
  const { isMobile } = useScreen();

  useEffect(() => {
    setCode(solution);
  }, [solution]);

  useEffect(() => {
    setTestCasesGenerated(false);
    setTestCasesValidated(false);
    setTestCases([]);
    setTestCasesResult([]);
  }, [isNew]);

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: `${testCases.length + 1}`,
      input: "",
      expectedOutput: "",
      expanded: true,
    };
    setTestCases((prev) => [...prev, newTestCase]);
  };

  const generateTestCases = async () => {
    setIsGenerating(true);
    try {
      if (problem) {
        const testCases = await getTestCases(problem);
        setTestCases((prev) => [...prev, ...testCases]);
        setTestCasesGenerated(true);
      }
    } catch (error) {
      console.error("Failed to generate test cases:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const validateTests = useCallback(async () => {
    setIsValidating(true);
    try {
      if (problem) {
        const testValidationResult = await validateTestCases(
          testCases,
          problem
        );
        if (testValidationResult) setTestCases(testValidationResult);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsValidating(false);
    }
  }, [testCases]);

  const runTests = async () => {
    setIsRunningTests(true);
    try {
      if (problem) {
        const result: TestResult[] = await runTestCases(
          problem,
          testCases,
          code
        );
        console.log("result", result);
        if (result) {
          setTestCasesResult(result);
        }
      }
    } catch (e) {
      console.log("Error running tests", e);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleRunTestCase = async (
    testCase: TestCase
  ): Promise<ActionResult> => {
    try {
      const testCases = [testCase];
      if (problem) {
        const result: TestResult[] = await runTestCases(
          problem,
          testCases,
          code
        );

        if (result && result.length > 0) {
          setTestCasesResult((prev) => {
            const updatedResults = prev.filter((tc) => tc.id !== testCase.id); // Remove old result
            return [...updatedResults, result[0]]; // Add new result
          });
        }
      }
      return "success";
    } catch (e) {
      console.log("Error running tests", e);
      return "error";
    } finally {
      setIsRunningTests(false);
    }
  };

  const toggleTestCaseExpansion = useCallback((id: string) => {
    setTestCases((prev) =>
      prev.map((tc) => (tc.id === id ? { ...tc, expanded: !tc.expanded } : tc))
    );
  }, []);

  const updateTestCaseFunction = useCallback(
    (id: string, testFunction: string) => {
      setTestCases((prev) =>
        prev.map((tc) =>
          tc.id === id ? { ...tc, testFunction: testFunction } : tc
        )
      );
    },
    []
  );

  return (
    <div
      className={`relative h-full transition-all duration-300 flex flex-col mt-4 pb-10 dark:text-white text-black ${
        isCollapsed ? "w-12" : "w-full"
      }`}
      role="region"
      aria-label="test-cases"
    >
      {!isCollapsed && (
        <>
          {/* Responsive Header */}
          <div className="flex flex-col mb-6 px-4">
            {!isMobile && (
              <div className="flex flex-row justify-between mb-4 items-center">
                <h2 className="text-lg">Test Cases</h2>
                <IconButton onClick={onToggleCollapse} icon={ChevronRight} />
              </div>
            )}

            {/* Generate Button */}
            <div className="flex flex-col gap-2 items-start">
              <Button
                onClick={generateTestCases}
                disabled={isGenerating || testCasesGenerated}
                variant="primary"
                className="w-full md:w-auto"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RefreshCw />
                )}
                <span className="ml-2">Generate using AI</span>
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto px-4">
            <TestCaseList
              testCases={testCases}
              addTestCase={addTestCase}
              toggleTestCaseExpansion={toggleTestCaseExpansion}
              runTestCase={handleRunTestCase}
              updateTestCaseFunction={updateTestCaseFunction}
              testCasesResult={testCasesResult}
            />
          </div>

          {/* Bottom Buttons */}
          <div className="mt-4 px-4 py-1">
            <div className="flex md:flex-row flex-col gap-2">
              <Button
                onClick={addTestCase}
                variant="primary"
                className="w-full md:w-auto px-2"
              >
                <PlusCircle />
                <span className="ml-2">Add</span>
              </Button>

              <Button
                onClick={() => {
                  validateTests();
                }}
                disabled={
                  isValidating ||
                  testCasesGenerated ||
                  testCasesValidated ||
                  testCases.length === 0
                }
                variant="primary"
                className="w-full md:w-auto px-2"
              >
                {isValidating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RefreshCw />
                )}
                <span className="ml-2">Validate</span>
              </Button>
              <Button
                onClick={() => {
                  runTests();
                }}
                disabled={isRunningTests || testCases.length === 0}
                variant="primary"
                className="w-full md:w-auto px-2"
              >
                {isRunningTests ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RefreshCw />
                )}
                <span className="ml-2">Run</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TestCases;
