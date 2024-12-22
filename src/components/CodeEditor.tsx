import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { dict } from "../utils/dict";

interface CodeEditorProps {
  onSave: (code: string) => void;
  onCancel: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onSave, onCancel }) => {
  const language = useLanguage();
  const text = dict[language];
  const [code, setCode] = useState("");

  const handleSave = () => {
    onSave(code);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-light-background dark:bg-dark-background">
      {/* Title */}
      <h1 className="text-2xl font-stix mb-4 text-light-foreground dark:text-dark-foreground">
        {text.codeEditor.title}
      </h1>

      {/* Code Editor Area */}
      <textarea
        className="flex-grow w-full p-4 text-sm font-mono bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground border border-light-secondary-disabled dark:border-dark-secondary-disabled rounded-md focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={text.codeEditor.placeholder}
      />

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end gap-4">
        <button
          className="px-4 py-2 bg-light-secondary dark:bg-dark-secondary text-light-foreground dark:text-dark-foreground rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition duration-200"
          onClick={handleSave}
        >
          {text.actions.save}
        </button>
        <button
          className="px-4 py-2 bg-light-secondary-disabled dark:bg-dark-secondary-disabled text-light-foreground dark:text-dark-foreground rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition duration-200"
          onClick={onCancel}
        >
          {text.actions.cancel}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
