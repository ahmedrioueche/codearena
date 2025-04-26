import {
  PlayCircle,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { TestCase, TestResult } from "../../../../../types/game/game";
import EditorSection from "./Editor";
import { useState } from "react";
import { ActionResult } from "../../../../../types/general";

interface TestCaseItemProps {
  testCase: TestCase;
  testResult: TestResult | undefined;
  toggleTestCaseExpansion: (id: string) => void;
  runTestCase: (testCase: TestCase) => Promise<ActionResult>;
  updateTestCaseInput: (id: string, input: string) => void;
}

const TestCaseItem = ({
  testCase,
  testResult,
  toggleTestCaseExpansion,
  runTestCase,
  updateTestCaseInput,
}: TestCaseItemProps) => {
  const [isRunningTestCase, setRunningTestCaseState] =
    useState<ActionResult>("idle");
  return (
    <div className="bg-gray-300 dark:bg-gray-800 rounded-lg overflow-hidden border border-light-border dark:border-dark-border">
      <div
        className="flex justify-between items-center p-3 bg-gray-300 dark:bg-gray-800 cursor-pointer"
        onClick={() => toggleTestCaseExpansion(testCase.id)}
      >
        <div className="flex items-center gap-3">
          {testResult?.passed !== undefined && (
            <span
              className={`rounded-full p-1 ${
                testResult.passed
                  ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
              }`}
            >
              {testResult.passed ? <Check size={16} /> : <X size={16} />}
            </span>
          )}
          <span className="font-medium truncate">Test Case {testCase.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1 rounded hover:scale-110 transition duration-300"
            onClick={async (e) => {
              e.stopPropagation();
              setRunningTestCaseState("loading");
              const result: ActionResult = await runTestCase(testCase);
              setRunningTestCaseState(result);
            }}
          >
            {isRunningTestCase === "loading" ? (
              <Loader2
                className="animate-spin text-light-primary dark:text-dark-primary"
                size={22}
              />
            ) : (
              <PlayCircle
                size={22}
                className="text-light-primary dark:text-dark-primary"
              />
            )}
          </button>
          {testCase.expanded ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>
      </div>
      {testCase.expanded && (
        <div className="p-4 space-y-4">
          <EditorSection
            label="function"
            value={testCase?.testFunction}
            onChange={(value) => updateTestCaseInput(testCase.id, value)}
          />

          {testCase.validationResult && (
            <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <p className="text-base text-gray-700 dark:text-gray-300">
                Test is valid!
              </p>
            </div>
          )}

          {!testResult && testCase.validationAccuracy !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Accuracy
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {testCase.validationAccuracy}%
                </span>
              </div>
              {/* Success Bar */}
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${testCase.validationAccuracy}%` }}
                ></div>
              </div>
            </div>
          )}
          {testResult && testResult.accuracy !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Code Accuracy
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {testResult.accuracy}%
                </span>
              </div>
              {/* Success Bar */}
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${testResult.accuracy}%` }}
                ></div>
              </div>
            </div>
          )}
          {testResult &&
            testResult.errors &&
            Array.isArray(testResult.errors) &&
            testResult.errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-800 rounded-lg overflow-hidden">
                <ul className="list-disc list-inside text-red-800 dark:text-red-200">
                  {testResult.errors.map((error, index) => (
                    <li
                      key={index}
                      className="break-words whitespace-normal overflow-wrap-anywhere"
                    >
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default TestCaseItem;
