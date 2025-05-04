import TestCaseItem from "./TestCaseItem";
import { TestCase, TestResult } from "../../../../../types/game/game";
import { PlusCircle } from "lucide-react";
import Button from "../../../../../components/ui/Button";
import { ActionResult } from "../../../../../types/general";

interface TestCaseListProps {
  testCases: TestCase[];
  addTestCase: () => void;
  toggleTestCaseExpansion: (id: string) => void;
  runTestCase: (testCase: TestCase) => Promise<ActionResult>;
  updateTestCaseFunction: (id: string, testFunction: string) => void;
  testCasesResult: TestResult[];
}

const TestCaseList = ({
  testCases,
  addTestCase,
  toggleTestCaseExpansion,
  runTestCase,
  updateTestCaseFunction,
  testCasesResult,
}: TestCaseListProps) => (
  <div className="space-y-4 mb-6">
    {testCases.length === 0 ? (
      <div className="text-center py-8  rounded-lg">
        <p className="mb-4">No test cases yet.</p>

        <Button onClick={addTestCase} variant="primary">
          <div className="flex flex-row space-x-2">
            <PlusCircle />
            <span className="ml-2">Add Test Case</span>
          </div>
        </Button>
      </div>
    ) : (
      testCases &&
      Array.isArray(testCases) &&
      testCases.map((testCase) => (
        <TestCaseItem
          key={testCase.id}
          testCase={testCase}
          testResult={testCasesResult.find(
            (result) => result.id === testCase.id
          )}
          toggleTestCaseExpansion={toggleTestCaseExpansion}
          runTestCase={runTestCase}
          updateTestCaseInput={updateTestCaseFunction}
        />
      ))
    )}
  </div>
);

export default TestCaseList;
