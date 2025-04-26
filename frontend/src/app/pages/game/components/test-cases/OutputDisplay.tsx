import { TestCase } from "../../../../../types/game/game";

interface OutputDisplayProps {
  testCase: TestCase;
}

const OutputDisplay = ({ testCase }: OutputDisplayProps) => (
  <div className="mb-4">
    <label className="block mb-2 font-medium">Actual Output</label>
    <div
      className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700 ${
        testCase.passed
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      }`}
    >
      {testCase.actualOutput}
    </div>
  </div>
);

export default OutputDisplay;
