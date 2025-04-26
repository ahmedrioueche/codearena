import CodeEditor from "../CodeEditor";

interface EditorSectionProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const EditorSection = ({ label, value, onChange }: EditorSectionProps) => (
  <div className="h-[300px]">
    <CodeEditor
      starterCode={value}
      currentCode={value}
      onCodeChange={onChange}
      gameMode={"solo"}
    />
  </div>
);

export default EditorSection;
