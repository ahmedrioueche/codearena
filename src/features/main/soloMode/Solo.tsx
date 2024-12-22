import React from "react";
import CodeEditor from "../../../components/CodeEditor";

function Solo() {
  return (
    <div>
      <CodeEditor
        onSave={function (code: string): void {
          throw new Error("Function not implemented.");
        }}
        onCancel={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
}

export default Solo;
