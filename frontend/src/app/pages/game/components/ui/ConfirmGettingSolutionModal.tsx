import React, { useEffect, useState } from "react";
import BaseModal from "../../../../../components/ui/BaseModal";
import Button from "../../../../../components/ui/Button";
import { ActionResult } from "../../../../../types/general";
import { Loader, AlertCircle } from "lucide-react";

interface ConfirmGettingSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  operationResult: ActionResult | undefined;
}

const ConfirmGettingSolutionModal: React.FC<
  ConfirmGettingSolutionModalProps
> = ({ isOpen, onClose, onConfirm, operationResult }) => {
  const [result, setResult] = useState<ActionResult | undefined>("idle");

  useEffect(() => {
    setResult(operationResult);
    if (operationResult === "success") {
      onClose();
    }
  }, [operationResult]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Getting Solution"
      width="400px"
      height="auto"
      buttons={
        <>
          <Button onClick={onClose} variant="ghost" className="mr-2">
            Cancel
          </Button>

          <Button
            onClick={() => {
              onConfirm();
              setResult("loading");
            }}
            variant="primary"
            disabled={result === "loading"}
          >
            {result === "loading" ? (
              <Loader className="animate-spin" />
            ) : (
              <span>Get Solution</span>
            )}
          </Button>
        </>
      }
    >
      <div className="flex flex-col space-y-2 items-center justify-center text-gray-700 dark:text-gray-300">
        <span>Are you sure you want to get the solution?</span>
        <span> Maybe try a little harder?</span>

        {/* Error Message */}
        {result === "error" && (
          <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>Something went wrong. Please try again.</span>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default ConfirmGettingSolutionModal;
