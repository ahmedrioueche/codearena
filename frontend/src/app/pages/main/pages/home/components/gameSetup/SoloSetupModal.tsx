import React, { useState } from "react";
import { X, Zap, User } from "lucide-react";
import MatchConfig from "./MatchConfig";
import Button from "../../../../../../../components/ui/Button";
import { router } from "../../../../../../../routers";

const SoloMatchSetupModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStartGame = () => {
    setIsGameStarted(true);
    router.navigate({ to: "/game/solo" });
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
              <User className="text-blue-300" />
              <h2 className="text-xl font-bold text-blue-100">Solo Arena</h2>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="p-6 space-y-8">
            <MatchConfig gameMode="solo" isGameStarted={isGameStarted} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-700 bg-gray-900/80 backdrop-blur-sm">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleStartGame}
            variant="primary"
            className="flex items-center text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300 space-x-2 shadow-lg hover:shadow-blue-500/20"
          >
            <Zap className="w-5 h-5" />
            <span>Start Match</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SoloMatchSetupModal;
