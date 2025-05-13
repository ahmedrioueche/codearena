import React from "react";
import { Redo } from "lucide-react";
import BaseModal from "../../../../../../components/ui/BaseModal";
import Button from "../../../../../../components/ui/Button";

interface ShowTimeOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ShowTimeOverModal: React.FC<ShowTimeOverModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Get a New Problem"
      icon={Redo}
      width="max-w-md"
      buttons={
        <>
          <Button onClick={onClose} variant="ghost" className="mr-2">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="primary" className="mr-2">
            Confirm
          </Button>
        </>
      }
    >
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-300 mb-2 mt-2">
          Are you sure you want to load a new problem?
        </p>
      </div>
    </BaseModal>
  );
};

export default ShowTimeOverModal;
