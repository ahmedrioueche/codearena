import React from "react";
import { AlertTriangle } from "lucide-react";
import BaseModal from "../../../../../components/ui/BaseModal";

interface LeaveConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LeaveConfirmation: React.FC<LeaveConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Page?"
      icon={AlertTriangle}
      buttons={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 duration-300 transition"
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 duration-300 transition"
          >
            Leave
          </button>
        </>
      }
    >
      <p className="text-gray-500 dark:text-gray-300 text-center">
        Are you sure you want to leave this page? Your progress will be lost.
      </p>
    </BaseModal>
  );
};

export default LeaveConfirmation;
