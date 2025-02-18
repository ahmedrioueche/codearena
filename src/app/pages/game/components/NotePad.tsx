import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

interface NotepadProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

type PinnedNote = {
  id: string;
  text: string;
};

const Notepad: React.FC<NotepadProps> = ({ isCollapsed, onToggleCollapse }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [pinnedNotes, setPinnedNotes] = useState<PinnedNote[]>([]);

  useEffect(() => {
    if (!isCollapsed && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCollapsed]);

  const downloadNotes = () => {
    const allNotes = [notes, ...pinnedNotes.map((note) => note.text)].join(
      "\n\n"
    );
    if (!allNotes.trim()) return;
    const blob = new Blob([allNotes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `notes-${new Date().toISOString()}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey && notes.trim()) {
      e.preventDefault();
      const newNote: PinnedNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: notes,
      };
      setPinnedNotes((prev) => [...prev, newNote]); // Append to bottom
      setNotes("");
    }
  };

  const removeNote = (id: string) => {
    setPinnedNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div
      className={`relative h-full transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-12" : "w-[100vw]"
      }`}
      role="region"
      aria-label="Notepad"
    >
      {/* Action Buttons */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-2">
        <button
          onClick={downloadNotes}
          className="p-2 rounded-lg bg-light-primary dark:bg-dark-primary hover:bg-light-secondary dark:hover:bg-dark-secondary text-light-foreground dark:text-dark-foreground transition-colors duration-200"
          aria-label="Download notes"
          disabled={!notes && pinnedNotes.length === 0}
        >
          <Download size={20} />
        </button>
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg bg-light-primary dark:bg-dark-primary hover:bg-light-secondary dark:hover:bg-dark-secondary text-light-foreground dark:text-dark-foreground transition-colors duration-200"
          aria-label={isCollapsed ? "Expand notepad" : "Collapse notepad"}
        >
          {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Notepad Area */}
      <div
        className={`flex flex-col h-full transition-all ${
          isCollapsed ? "hidden" : "block"
        }`}
      >
        {/* Writing Area */}
        <div className="flex-1 overflow-auto p-4">
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-full w-full p-4 pl-12 resize-none focus:outline-none bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground  placeholder:text-light-foreground/50 dark:placeholder:text-dark-foreground/50"
            placeholder="Write your notes here... (Shift+Enter to pin)"
            aria-label="Notes text area"
            spellCheck="false"
          />
        </div>

        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <div className="p-4 border-t border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background">
            <h3 className="text-sm font-semibold text-light-foreground dark:text-dark-foreground mb-2">
              Pinned Notes
            </h3>
            <div className="flex flex-wrap gap-2">
              {pinnedNotes.map((note) => (
                <div
                  key={note.id}
                  className="relative max-w-xs p-3 rounded-lg shadow-md text-sm whitespace-pre-wrap break-words bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                  <button
                    onClick={() => removeNote(note.id)}
                    className="absolute -top-2 -right-2 bg-black dark:bg-light-background text-white dark:text-black rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                    aria-label="Remove note"
                  >
                    <X size={12} />
                  </button>
                  {note.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notepad;
