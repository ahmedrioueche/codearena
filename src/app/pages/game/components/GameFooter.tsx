import React, { useState } from "react";
import { Check, X, Cpu, HardDrive } from "lucide-react";
import { GameMode, TestResult } from "../../../../types/game/game";

const sampleTestResult: TestResult = {
  passed: true,
  executionTime: 125,
  memory: "5.2MB",
  testCases: [
    { input: "[2,7,11,15], 9", expectedOutput: "[0,1]", passed: true },
    { input: "[3,2,4], 6", expectedOutput: "[1,2]", passed: true },
    { input: "[3,3], 6", expectedOutput: "[0,1]", passed: true },
  ],
};

const GameFooter = ({ gameMode }: { gameMode: GameMode }) => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<TestResult>(sampleTestResult);

  const handleSubmit = () => {
    setShowResults(true);
    // In a real implementation, you would run tests here
  };

  return (
    <div className="bg-light-background dark:bg-dark-background border-t border-light-border dark:border-dark-border">
      {showResults ? (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span
                className={`flex items-center gap-2 ${
                  results.passed ? "text-green-500" : "text-red-500"
                }`}
              >
                {results.passed ? <Check size={20} /> : <X size={20} />}
                {results.passed ? "All Tests Passed" : "Some Tests Failed"}
              </span>
              <span className="flex items-center gap-2 text-light-foreground dark:text-dark-foreground">
                <Cpu size={16} />
                {results.executionTime}ms
              </span>
              <span className="flex items-center gap-2 text-light-foreground dark:text-dark-foreground">
                <HardDrive size={16} />
                {results.memory}
              </span>
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 transition-opacity"
              onClick={() => setShowResults(false)}
            >
              Continue
            </button>
          </div>
          <div className="space-y-2">
            {results.testCases.map(
              (
                testCase: {
                  passed: any;
                  input:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                  expectedOutput:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                },
                index: React.Key | null | undefined
              ) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg"
                >
                  <span
                    className={
                      testCase.passed ? "text-green-500" : "text-red-500"
                    }
                  >
                    {testCase.passed ? <Check size={16} /> : <X size={16} />}
                  </span>
                  <div className="flex-1">
                    <div className="font-mono text-sm">
                      Input: {testCase.input}
                    </div>
                    <div className="font-mono text-sm">
                      Expected: {testCase.expectedOutput}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 flex justify-between items-center">
          <div className="text-light-foreground dark:text-dark-foreground">
            Write your solution and click Submit when ready
          </div>
          <button
            className="px-6 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-white hover:opacity-90 transition-opacity"
            onClick={handleSubmit}
          >
            Submit Solution
          </button>
        </div>
      )}
    </div>
  );
};

export default GameFooter;
