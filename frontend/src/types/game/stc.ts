export interface IncidentI {
  id: string;
  title: string;
  topic: string;
  actuallyHappened: boolean;
  language?: string;
  intro: string;
  body: string;
  whatToDo: string;
  problematicCode: string;
  starterCode: string;
  level: number;
  averageTime?: number;
  points?: number;

  symptoms?: string[];
  logs?: string[];
  files?: Array<{
    name: string;
    type?: "image" | "text" | "json" | "log";
    content: string;
  }>;
  systemInfo?: string[];
  hints?: string[];
  tags?: string[];

  solutionCode: string;
  fixExplanation?: string;
  rootCause?: string;
  takeaways?: string[];
}
