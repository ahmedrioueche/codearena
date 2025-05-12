import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Loader2,
  Maximize2,
  AlertTriangle,
  FileText,
  FileInput,
  FileOutput,
  FileSearch,
  Lightbulb,
  Bug,
  Shield,
} from "lucide-react";
import useScreen from "../../../../../../hooks/useScreen";
import { IncidentI } from "../../../../../../types/game/stc";

const WIDTH = 600;
const TOTAL_LEVELS = 10; // Assuming there are 10 levels total

interface IncidentProps {
  incident: IncidentI;
  onGetNextIncident: () => void;
  hints: string[];
  isHintLoading: boolean;
  onGetHint: () => void;
  onOpenIncidentModal: () => void;
  isOpenOnMobile: boolean;
}

const Incident: React.FC<IncidentProps> = ({
  incident,
  hints,
  isHintLoading,
  onGetHint,
  onOpenIncidentModal: onOpenProblemModal,
  isOpenOnMobile,
}) => {
  const { isMobile } = useScreen();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isResizing = useRef(false);
  const [width, setWidth] = useState<number>(
    isMobile ? window.innerWidth : WIDTH
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentIncident, setCurrentIncident] = useState(incident);

  useEffect(() => {
    setCurrentIncident(incident);
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  }, [incident]);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(!isOpenOnMobile);
    }
  }, [isOpenOnMobile]);

  const toggleCollapse = () => {
    if (!isCollapsed) {
      setWidth(containerRef.current?.offsetWidth || WIDTH);
    } else {
      setWidth(isMobile ? window.innerWidth : WIDTH);
    }
    setIsCollapsed(!isCollapsed);
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !containerRef.current) return;

    const newWidth =
      e.clientX - containerRef.current.getBoundingClientRect().left;
    if (newWidth > 200 && newWidth < window.innerWidth * 0.8) {
      containerRef.current.style.width = `${newWidth}px`;
    }
  };

  const stopResizing = () => {
    if (!containerRef.current) return;
    setWidth(parseInt(containerRef.current.style.width, 10));
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, []);

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

  const renderLevelTracker = () => {
    return (
      <div className="flex flex-col w-full mt-6">
        <div className="flex items-center gap-2 w-full">
          {Array.from({ length: TOTAL_LEVELS }).map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full ${
                index + 1 === currentIncident.level
                  ? "bg-light-primary dark:bg-dark-primary"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
        <div className="text-center mt-2 text-sm text-black dark:text-white">
          Level {currentIncident.level} of {TOTAL_LEVELS}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative mt-8 flex flex-col transition-all duration-300 ease-in-out overflow-auto pb-10 group
    ${isMobile ? "w-full" : "h-screen"} 
    bg-light-background dark:bg-dark-background border-r border-light-border dark:border-dark-border overflow-y-auto`}
      style={{
        width: isCollapsed ? (isMobile ? "0px" : "44px") : `${width}px`,
        zoom: 0.85,
      }}
    >
      <button
        onClick={toggleCollapse}
        className={`absolute top-3 ${
          isCollapsed ? "right-1" : "right-3"
        } p-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg 
      opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {!isCollapsed && (
        <button
          onClick={onOpenProblemModal}
          className="absolute top-3 right-12 p-2 bg-light-primary dark:bg-dark-primary 
        text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Maximize2 size={16} />
        </button>
      )}

      {!isCollapsed && (
        <div
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
          onMouseDown={startResizing}
        />
      )}

      {!isCollapsed && (
        <div className="p-6 overflow-auto">
          {currentIncident ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-black dark:text-white">
                  {currentIncident.title}
                </h1>
                {currentIncident.actuallyHappened && (
                  <div className="flex items-center gap-1 text-orange-500 mt-1">
                    <AlertTriangle size={16} className="mb-0.5" />
                    <span>Real Incident</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mb-6 flex-wrap">
                <span className="flex items-center gap-1 text-light-primary dark:text-dark-primary">
                  <Shield size={18} className="mb-0.5" />
                  Level {currentIncident.level}
                </span>
                {currentIncident.points && (
                  <span className="flex items-center gap-1 text-black dark:text-white">
                    <FileText size={18} className="mb-0.5" />
                    {currentIncident.points} points
                  </span>
                )}
                {currentIncident.averageTime && (
                  <span className="flex items-center gap-1 text-black dark:text-white">
                    <Clock size={18} className="mb-0.5" />
                    {currentIncident.averageTime} minutes
                  </span>
                )}
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
                    Introduction
                  </h2>
                  <p className="text-black dark:text-white">
                    {currentIncident.intro}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
                    Incident Details
                  </h2>
                  <p className="text-black dark:text-white">
                    {currentIncident.body}
                  </p>
                </div>

                {currentIncident.symptoms &&
                  currentIncident.symptoms.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
                        Symptoms
                      </h2>
                      <ul className="list-disc pl-6 text-black dark:text-white">
                        {currentIncident.symptoms.map((symptom, index) => (
                          <li key={index} className="mb-1">
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {currentIncident.logs && currentIncident.logs.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
                      Logs
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                      {currentIncident.logs.map((log, index) => (
                        <pre
                          key={index}
                          className="text-black dark:text-white whitespace-pre-wrap overflow-auto"
                        >
                          {log}
                        </pre>
                      ))}
                    </div>
                  </div>
                )}

                {currentIncident.files && currentIncident.files.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
                      Related Files
                    </h2>
                    <div className="grid gap-4">
                      {currentIncident.files.map((file, index) => (
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

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
                    Problematic Code
                  </h2>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-black dark:text-white">
                    {currentIncident.problematicCode}
                  </pre>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
                    What You Should Do
                  </h2>
                  <p className="text-black dark:text-white">
                    {currentIncident.whatToDo}
                  </p>
                </div>

                {hints.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3 text-black dark:text-white flex items-center gap-2">
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

                <div className="flex gap-4">
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-light-secondary dark:bg-dark-secondary text-white hover:opacity-90 transition-opacity"
                    onClick={onGetHint}
                  >
                    {isHintLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <HelpCircle size={18} />
                    )}
                    Hint
                  </button>
                </div>
              </div>

              {renderLevelTracker()}
            </>
          ) : (
            <div className="text-black dark:text-white">
              No incident available.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Incident;
