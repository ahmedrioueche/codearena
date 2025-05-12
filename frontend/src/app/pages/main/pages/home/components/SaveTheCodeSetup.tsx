import React from "react";
import { X, Code, AlertTriangle, Shield, Clock, Zap } from "lucide-react";
import Button from "../../../../../../components/ui/Button";

function SaveTheCodeSetup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl transition-opacity duration-300 border border-gray-700 custom-scrollbar"
        style={{
          background:
            "linear-gradient(135deg, #001122 0%, #001A2F 50%, #00253D 100%)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 p-2 rounded-full hover:bg-gray-700/50 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        {/* Header */}
        <div className="p-6 py-3 border-b border-gray-700">
          <div className="space-y-1 pr-8">
            <div className="flex flex-row space-x-2">
              <Code className="text-blue-300" />
              <h2 className="text-xl font-bold text-blue-100">
                Save The Code Challenge
              </h2>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-100">
                What is Save The Code?
              </h3>
              <p className="text-gray-300">
                Save The Code is an immersive coding challenge where you analyze
                and fix real-world software failures. Each incident presents a
                critical system failure, your task is to diagnose the issue and
                implement a solution.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-100">
                How It Works
              </h3>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="flex-shrink-0 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-200">
                      Real Incidents
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Work with actual software failures that caused real-world
                      consequences. Understand the context and impact of each
                      incident.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Code className="flex-shrink-0 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-200">
                      Problematic Code
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Analyze the original flawed implementation. Identify the
                      root cause and security vulnerabilities in the code.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="flex-shrink-0 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-200">Your Mission</h4>
                    <p className="text-gray-400 text-sm">
                      Rewrite the code to fix the issues while maintaining
                      functionality. Your solution should prevent the failure
                      from happening again.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="flex-shrink-0 text-purple-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-200">
                      Timed Challenges
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Each incident has a recommended time limit. Your score
                      depends on correctness, efficiency, and time taken.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-100">
                Example Scenario
              </h3>
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h4 className="font-medium text-gray-200 mb-2">
                  Lion Air 610 Crash
                </h4>
                <p className="text-gray-400 text-sm">
                  The MCAS system in Boeing 737 MAX aircraft relied on a single
                  sensor input, causing fatal crashes. Your task would be to
                  redesign this safety-critical system with proper redundancy
                  and fail-safes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-700 bg-gray-900/80 backdrop-blur-sm">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => (location.href = "/game/save-the-code")}
            variant="primary"
            className="flex items-center text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300 space-x-2 shadow-lg hover:shadow-blue-500/20"
          >
            <Zap className="w-5 h-5" />
            <span>Start Challenge</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SaveTheCodeSetup;
