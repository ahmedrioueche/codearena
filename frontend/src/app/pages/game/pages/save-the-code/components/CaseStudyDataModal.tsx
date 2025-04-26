import React from "react";
import BaseModal from "../../../../../../components/ui/BaseModal";

interface CaseStudyDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: React.ReactNode;
  images?: string[];
  buttonText?: string;
  onContinue?: () => void;
}

const CaseStudyDataModal: React.FC<CaseStudyDataModalProps> = ({
  isOpen,
  onClose,
  title,
  body,
  images,
  buttonText = "Continue",
  onContinue,
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="800px"
      height="auto"
      buttons={
        <button
          onClick={onContinue}
          className="bg-light-primary dark:bg-dark-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
        >
          {buttonText}
        </button>
      }
    >
      {/* Body Content */}
      <div className="space-y-4">
        {body}
        {images && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Case study image ${index + 1}`}
                className="rounded-lg shadow-md"
              />
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default CaseStudyDataModal;
