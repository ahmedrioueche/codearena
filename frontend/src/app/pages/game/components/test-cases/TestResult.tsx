import { Loader2, PlayCircle } from "lucide-react";

interface TestResultsProps {
  successRate: number;
  runAllTests: () => void;
  isRunning: boolean;
}

const TestResults = ({
  successRate,
  runAllTests,
  isRunning,
}: TestResultsProps) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="font-medium">Success Rate</span>
        <span className="font-medium">{successRate}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-light-primary dark:bg-dark-primary h-2.5 rounded-full"
          style={{ width: `${successRate}%` }}
        />
      </div>
    </div>
    <button
      className="w-full px-4 py-2 bg-light-secondary dark:bg-dark-secondary text-white rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
      onClick={runAllTests}
      disabled={isRunning}
    >
      {isRunning ? <Loader2 className="animate-spin" /> : <PlayCircle />}
      Run All Tests
    </button>
  </div>
);

export default TestResults;
