import React from "react";
import { Clock } from "lucide-react";
import BaseModal from "../../../../../../components/ui/BaseModal";
import Button from "../../../../../../components/ui/Button";

interface ShowTimeOverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShowTimeOverModal: React.FC<ShowTimeOverModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Time's Up!"
      icon={Clock}
      width="max-w-md"
      buttons={
        <>
          <Button onClick={onClose} variant="primary" className="mr-2">
            Ok
          </Button>
        </>
      }
    >
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-300 mb-2 mt-2">
          The time limit for this problem has expired.
        </p>
      </div>
    </BaseModal>
  );
};

export default ShowTimeOverModal;
