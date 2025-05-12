import React from "react";
import {
  AlertTriangle,
  FileText,
  Clock,
  FileInput,
  FileSearch,
  FileOutput,
  Lightbulb,
  Bug,
  Shield,
} from "lucide-react";
import BaseModal from "../../../../../../components/ui/BaseModal";
import { IncidentI } from "../../../../../../types/game/stc";

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentI;
  hints: string[];
}

const IncidentModal: React.FC<IncidentModalProps> = ({
  isOpen,
  onClose,
  incident,
  hints,
}) => {
  const renderFileContent = (file: {
    name: string;
    type: "image" | "text" | "json" | "log";
    content: string;
  }) => {
    switch (file.type) {
      case "image":
        return (
          <img
            src={file.content}
            alt={file.name}
            className="max-w-full h-auto rounded"
          />
        );
      case "json":
        return (
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto text-black dark:text-white">
            {JSON.stringify(JSON.parse(file.content), null, 2)}
          </pre>
        );
      case "log":
        return (
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto text-black dark:text-white">
            {file.content}
          </pre>
        );
      default:
        return (
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto text-black dark:text-white">
            {file.content}
          </pre>
        );
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={incident.title}
      width="90vw"
      height="90vh"
    >
      <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-150px)]">
        <div className="flex gap-4 flex-wrap">
          {incident.actuallyHappened && (
            <div className="flex items-center gap-1 text-orange-500">
              <AlertTriangle size={16} />
              <span>Real Incident</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-light-primary dark:text-dark-primary">
            <Shield size={16} />
            <span>Level {incident.level}</span>
          </div>
          {incident.points && (
            <div className="flex items-center gap-1 text-black dark:text-white">
              <FileText size={16} />
              <span>{incident.points} points</span>
            </div>
          )}
          {incident.averageTime && (
            <div className="flex items-center gap-1 text-black dark:text-white">
              <Clock size={16} />
              <span>{incident.averageTime} minutes</span>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
            <FileInput size={20} />
            Introduction
          </h2>
          <p className="text-black dark:text-white">{incident.intro}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
            <FileSearch size={20} />
            Incident Details
          </h2>
          <p className="text-black dark:text-white">{incident.body}</p>
        </div>

        {incident.symptoms && incident.symptoms.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
              <AlertTriangle size={20} />
              Symptoms
            </h2>
            <ul className="list-disc pl-6 text-black dark:text-white">
              {incident.symptoms.map(
                (
                  symptom:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined,
                  index: React.Key | null | undefined
                ) => (
                  <li key={index} className="mb-1">
                    {symptom}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {incident.logs && incident.logs.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
              <FileOutput size={20} />
              Logs
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              {incident.logs.map(
                (
                  log:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined,
                  index: React.Key | null | undefined
                ) => (
                  <pre
                    key={index}
                    className="text-black dark:text-white whitespace-pre-wrap overflow-auto"
                  >
                    {log}
                  </pre>
                )
              )}
            </div>
          </div>
        )}

        {/*
{incident.files && incident.files.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
              Related Files
            </h2>
            <div className="grid gap-4">
              {incident.files.map((file: { name: any; type?: "image" | "text" | "json" | "log"; content?: string; }, index: React.Key | null | undefined) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 text-black dark:text-white"
                >
                  <h3 className="font-bold mb-2">{file.name}</h3>
                  {renderFileContent(file)}
                </div>
              ))}
            </div>
          </div>
        )}
 */}

        <div>
          <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
            <Bug size={20} />
            Problematic Code
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-black dark:text-white">
            {incident.problematicCode}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
            What You Should Do
          </h2>
          <p className="text-black dark:text-white">{incident.whatToDo}</p>
        </div>

        {hints.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
              <Lightbulb size={20} />
              Hints
            </h2>
            {hints.map((hint, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 text-black dark:text-white"
              >
                <strong>Hint {index + 1}:</strong> {hint}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default IncidentModal;
