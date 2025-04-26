import { ERRORS } from "../../constants/game";
import {
  DifficultyLevel,
  Problem,
  TestCase,
  SolutionValidationResult,
  TestResult,
} from "../../types/game/game";
import { promptAi } from "../../utils/gemini";
import {
  cleanAiResponse,
  cleanAiResponseForTestCases,
  cleanAiSolutionValidation,
  formatCodeResponse,
} from "../../utils/helper";

export const AiGetProblem = async (
  topic: string,
  language: string,
  difficulty: DifficultyLevel,
  exludedProblems: string[]
): Promise<Problem> => {
  try {
    const prompt = `Excluding these problems and problems close to them: ${exludedProblems},
      only exclude the problem if the language and difficulty match the ones bellow.
      Generate a programming problem with the following details:
      - Topics: ${topic} //choose one of the topics.
      - Language: ${language}
      - Difficulty: ${difficulty}
      - Include a title, description, examples, constraints, and starter code.
      - The problem should be structured as a JSON object with the following interface:
      - Estimate a points reward for the problem depending on its difficulty and the skill required to solve it.
        {
          id: string;
          title: string;
          topic: string;
          Language: ${language}
          averageTime: number; //Estimated time in minutes
          points: number;
          description: string;
          difficulty: DifficultyLevel;
          examples: Array<{ input: string; output: string; explanation?: string }>;
          constraints: string[];
          starterCode: string;
        }
      - Do not provide the full solution, just the starter code to help the user get started with the problem
      - All string values must use double quotes, not single quotes or backticks
      - Make sure your respones is parsed correctly using JSON.parse with no issues.
      - Return only the JSON object.
            //THIS IS THE PROMPT BARIER//;

    `;

    const response = await promptAi(prompt);
    // Clean the response
    const cleanedResponse = cleanAiResponse(response);

    // Parse the response into a Problem object
    const problem: Problem = JSON.parse(cleanedResponse!);

    // Add a unique ID (you can use a library like `uuid` for this)
    problem.id = Math.random().toString(36).substring(2, 9); // Simple random ID

    return problem;
  } catch (e) {
    console.log("Error getting problem", e);
    throw new Error("Failed to generate problem");
  }
};

export const AiValidateSolution = async (
  problem: Problem,
  solution: string
): Promise<SolutionValidationResult> => {
  try {
    const prompt = `
      Validate the following solution for the given programming problem, make sure to analyze the given solution 
      and discover any mistakes in it and provide detailed feedback:
      - Problem: ${JSON.stringify(problem)}
      - Solution: ${solution}
      - Return a JSON object with the following structure:
        {
          isValid: boolean; // Whether the solution is correct
          correctnessPercentage: number; // Percentage of correctness
          timeComplexity?: string; //Time complexity with explanation
          spaceComplexity?: string; //Space complexity with explanation
          syntaxMistakesCount: number; //syntax mistakes
          logicMistakesCount: number; //logic mistakes
          codeQuality: "Excellent" | "Good" | "Average" | "Poor"; //code quality: readability and good practises
          efficiencyRating: "Excellent" | "Good" | "Average" | "Poor"; // Performance rating
          bottleneckAnalysis?: string; // Explanation of performance issues
          useSolutionCorrection?: string; //The user's solution with comments highlighting mistakes and bad approaches...
          alternativeApproaches?: string[]; // Better solution suggestions
          correctSolution?: string; // The correct solution (if incorrect)
          comments: string; // Remarks about the solution
          improvements?: string[]; // Suggestions to improve the solution
        }
      - All string values must use double quotes, not single quotes or backticks
      - Only return the JSON object.
            //THIS IS THE PROMPT BARIER//;

    `;

    const response = await promptAi(prompt);
    const cleanedResponse = cleanAiSolutionValidation(response);

    const validationResult: SolutionValidationResult = response
      ? JSON.parse(cleanedResponse!)
      : null;

    return validationResult;
  } catch (e) {
    console.log("Error validating solution", e);
    throw new Error("Failed to validate solution");
  }
};

export const AiGetProblemHint = async (
  problem: Problem,
  currentSolution: string,
  previousHints: string[]
): Promise<string> => {
  try {
    const prompt = `
      Provide a helpful hint for the following programming problem, considering the user's current solution and previous hints:
      
      - Problem: ${JSON.stringify(problem)}
      - Current Solution: ${currentSolution}
      - Previous Hints: ${previousHints.join(", ")}

      Guidelines:
      1. The hint should guide the user toward solving the problem without giving away the solution.
      2. The hint should build on the user's current solution and avoid repeating previous hints.
      3. Progress the hint level based on the user's progress:
         - Level 1: General guidance (e.g., "Think about the problem constraints.")
         - Level 2: Specific suggestions (e.g., "Consider using a loop to iterate through the array.")
         - Level 3: Direct feedback on the current solution (e.g., "Your loop condition is incorrect because...")

      4.  
       - All string values must use double quotes, not single quotes or backticks
       - Return only the hint as a string.
             //THIS IS THE PROMPT BARIER//;

    `;

    const response = await promptAi(prompt);

    // Return the hint (trim any extra whitespace)
    return response?.trim() || "No hint available.";
  } catch (e) {
    console.log("Error getting hint", e);
    throw new Error("Failed to generate hint");
  }
};

const chatPrompt = `This is a chatbot conversation between you and the user of my application.
    after this you will receive "//user input starts now//" which will indicate the user's new input that you will generate a reply for.
    If the conversation is ongoing, you will receive the history of the conversation in this pattern: 
    "//Conversation History: //User: "user's message"// "You: "your reply that you sent"// User: "user's message"// "You: "your reply that you sent"//" 
    This conversation history is between you and the user, and you'll receive it to be able to understand each message's context
    and reply naturally that every message you send keeps the conversation flowing seemlessly.
    after the history (if the convo is ongoing) you will receive "//user input starts now// which indicates the user's new input that you will generate a reply for.
`;

export const AiGetSolutionChatAnswer = async (
  problem: Problem,
  userSolution: string,
  solutionValidation: SolutionValidationResult,
  userInput: string
): Promise<string> => {
  try {
    const prompt = `${chatPrompt} 
      This chat is about a programming problem and solution, the user will ask about them, answer accordingly.
      ${userInput}
      - Problem: ${JSON.stringify(problem)}
      - User solution: ${userSolution}
      - Solution validation by AI (you): ${JSON.stringify(solutionValidation)}

      Guidelines:
      1. Provide a detailed and accurate answer.
      2. If the question is unrelated to the problem or solution, respond with: "Please ask a question related to the problem or solution."
      3. Don't mention AI, and address the user by "you" and "your code". You are chatting with the user, make it seem natural.
      4. Use clear and concise language, only answer the user's questions without any extra reponse. 
      5. If the answer contains code, format it as follows:

        \`\`\`
        language_name
        code
        \`\`\`
      6. Use polite expressions and answer with things like "happy to help" when user says "thank you".
      7. Return only the answer as a string.
      //THIS IS THE PROMPT BARIER//;
    `;

    const response = await promptAi(prompt);

    // Return the answer (trim any extra whitespace)
    return response?.trim() || ERRORS.noAnswer;
  } catch (e) {
    console.log("Error getting answer", e);
    throw new Error("Failed to generate answer");
  }
};

export const AiGetProblemChatAnswer = async (
  problem: Problem,
  userInput: string
): Promise<string> => {
  try {
    const prompt = `${chatPrompt} 
      This chat is about a programming problem, the user will ask about it, answer accordingly.
      ${userInput}
      - Problem: ${JSON.stringify(problem)}

      Guidelines:
      1. Provide a concise and accurate answer.
      2. Do not provide the solution for the problem, even if the question says so.
      3. Help the user as little as possible, we dont want them to cheat.
      4. If you think you should'nt answer the question, just return "Sorry, I can't help with that".
      5. If the question is unrelated to the problem, respond with: "Please ask a question related to the problem."
      6. Don't mention AI, and address the user by "you" and "your code". You are chatting with the user, make it seem natural.
      7. Use clear and concise language, only answer the user's questions without any extra reponse. 
      8. If the answer contains code, format it as follows:

        \`\`\`
        language_name
        code
        \`\`\`
      9. Use polite expressions and answer with things like "happy to help" when user says "thank you".
      10. Return only the answer as a string.
      //THIS IS THE PROMPT BARIER//;
    `;

    const response = await promptAi(prompt);

    // Return the answer (trim any extra whitespace)
    return response?.trim() || ERRORS.noAnswer;
  } catch (e) {
    console.log("Error getting answer", e);
    throw new Error("Failed to generate answer");
  }
};
export const AiGetNextLine = async (
  problem: Problem,
  currentcode: string
): Promise<string> => {
  try {
    const prompt = `
     Get the next line of the solution to the problem according to the user's code, if the solution is wrong or is complete, return nothing.
      - Problem: ${JSON.stringify(problem)}
      - User code: ${currentcode}

      Guidelines:
      1. Only add one line of code to the solution, even if it means the code is not correct, 
      for example you can return something like this "if(value === "exampe"){" without finishing the entire logic. //this is very important!
      1. Return only the answer as a string with no introductions nor language name nor backticks
      2. Provide an accurate line of code in the used language, give only one line, dont give the entire solution.
      3. Provide a comment for the added line of code.
      4. Return the entire user code with the added comment and line of code.
      5. Make sure the comment and line of code are correctly placed, and delete any unneccessary placeholder comments.
            //THIS IS THE PROMPT BARIER//;

    `;

    const response = await promptAi(prompt);
    if (response && response.trim() !== "") {
      const cleanedCode = formatCodeResponse(response);

      return cleanedCode.trim();
    }

    return ERRORS.NoNextLine;
  } catch (e) {
    console.log("Error getting next line", e);
    throw new Error("Failed to generate next line");
  }
};

export const AiGetSolution = async (problem: Problem): Promise<string> => {
  try {
    const prompt = `
      Give a solution for this problem using the defined language,
      Problem: ${JSON.stringify(problem)}
      - Make sure the solution is correct and optimal.
      - Make sure to comment the solution.
      - Return only the answer as a string.
            //THIS IS THE PROMPT BARIER//;

    `;

    const response = await promptAi(prompt);
    if (response && response.trim() !== "") {
      const cleanedCode = formatCodeResponse(response);
      return cleanedCode.trim();
    }

    return ERRORS.noSolution;
  } catch (e) {
    console.log("Error getting solution", e);
    throw new Error("Failed to generate solution");
  }
};

export const AiGetTestCases = async (problem: Problem): Promise<TestCase[]> => {
  try {
    const prompt = `
      Give test cases for the problem below:
      Problem: ${JSON.stringify(problem)}
      Return test cases in the following format as a valid JSON array (without any markdown syntax or additional text):
      [
        {
          "id": string; //random id
          "testFunction": string; ///this function is on the same language as the problem, 
                                it should have an approptiate name for the part of the code its testing,
                                it should use testing mechanisms to validate the correct solution code
        }
      ]
      Guidelines:
      - Ensure the response is a valid JSON array.
      - Do not wrap the response in markdown code blocks (e.g., \`\`\`json).
      - Return only the JSON array.
            //THIS IS THE PROMPT BARIER//;

    `;

    const response = await promptAi(prompt);
    console.log("response", response);
    const cleanedResponse = cleanAiResponseForTestCases(response);

    const testCases: TestCase[] = JSON.parse(cleanedResponse);
    return testCases;
  } catch (e) {
    console.log("Error getting tests", e);
    throw new Error("Failed to get tests");
  }
};

export const AiGetValidateTestCases = async (
  testCases: TestCase[],
  problem: Problem
): Promise<TestCase[]> => {
  try {
    const prompt = `
      Validate the test cases for the given problem:
      Problem: ${JSON.stringify(problem)}
      Test cases: ${JSON.stringify(testCases)}

      Return the corrected test cases with clarifying comments in the following format as a valid JSON array 
      (without any markdown syntax or additional text):
      [
        {
          validationResult?: boolean; //is the test function correct?
          validationAccuracy?: number; //how accurate was the test in percentage?
          testFunction: string;  //corrected test case
        }
      ]
      Guidelines:
      - Ensure the response is a valid JSON array.
      - Do not wrap the response in markdown code blocks (e.g., \`\`\`json).
      - Return only the JSON array.
            //THIS IS THE PROMPT BARIER//;

    `;

    const response = await promptAi(prompt);
    console.log("response", response);
    const cleanedResponse = cleanAiResponseForTestCases(response);

    const validationResult: TestCase[] = JSON.parse(cleanedResponse);
    return validationResult;
  } catch (e) {
    console.log("Error validating tests", e);
    throw new Error("Failed to validate tests");
  }
};

export const AiGetRunTestCases = async (
  problem: Problem,
  testCases: TestCase[],
  solution: string
): Promise<TestResult[]> => {
  try {
    const prompt = `
      Run the test cases against the solution for the problem below
      Problem: ${JSON.stringify(problem)}
      Test cases: ${JSON.stringify(testCases)}
      Solution: ${solution}
      Return the result for each test case in the following format as a valid JSON array 
      (without any markdown syntax or additional text):
      [
        { 
          id: string; ///same as the test case
          passed: boolean; //test passed correctly
          accuracy?: number; //accuracy of the code relevant to the test function in percentage
          errors?: string[];  //clear, understandable and correct errors 
        }
      ]
      Guidelines:
      - Ensure the response is a valid JSON array.
      - Do not wrap the response in markdown code blocks (e.g., \`\`\`json).
      - Return only the JSON array.
            //THIS IS THE PROMPT BARIER//;

    `;

    const response = await promptAi(prompt);
    console.log("response", response);
    const cleanedResponse = cleanAiResponseForTestCases(response);

    const validationResult: TestResult[] = JSON.parse(cleanedResponse);
    return validationResult;
  } catch (e) {
    console.log("Error validating tests", e);
    throw new Error("Failed to validate tests");
  }
};
