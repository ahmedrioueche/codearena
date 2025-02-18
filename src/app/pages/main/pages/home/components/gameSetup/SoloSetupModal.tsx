import React, { useState } from "react";
import { X, Zap, User } from "lucide-react";
import Button from "../../../../../../../components/ui/Button";
import { useRouter } from "@tanstack/react-router";
import MatchConfig from "./MatchConfig";

const SoloMatchSetupModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const router = useRouter();

  const handleStartGame = () => {
    setIsGameStarted(true);
    router.navigate({ to: "/game/solo" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-3xl max-h-[95vh] bg-light-background dark:bg-dark-background rounded-2xl shadow-xl transition-opacity duration-300 ">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 p-2 rounded-full hover:bg-light-secondary/10 dark:hover:bg-dark-secondary/10 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-light-secondary dark:text-dark-secondary" />
        </button>

        {/* Header */}
        <div className="p-6 py-3 border-b border-light-border dark:border-dark-border">
          <div className="space-y-1 pr-8">
            <div className="flex flex-row space-x-2">
              <User className="text-light-primary dark:text-dark-primary" />
              <h2 className="text-xl font-bold text-light-foreground dark:text-dark-foreground">
                Solo Arena
              </h2>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-light-secondary/20 scrollbar-track-transparent">
          <div className="p-6 space-y-8">
            <MatchConfig gameMode="solo" isGameStarted={isGameStarted} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-light-border dark:border-dark-border bg-light-background/80 dark:bg-dark-background/80 backdrop-blur-sm">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => handleStartGame()}
            variant="primary"
            className="flex items-center text-light-background hover:text-light-background/90 space-x-2 shadow-lg hover:shadow-light-primary/20 dark:hover:shadow-dark-primary/20"
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
