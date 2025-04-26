import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { URL } from "url";

// Load environment variables from .env file
dotenv.config();

// Get API key from environment variables
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;

if (!API_KEY) {
  console.error("API key is missing!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Resolve the dictionary path and convert it to a file URL
const dictPath = path.resolve("./src/utils/dict.ts");
const dictURL = new URL(`file://${dictPath}`); // Convert to file:// URL
const DICT_PATH = "./src/utils/dict.ts";

let dict = loadDictionary();
//try {
//  dict = (await import(dictURL)).dict; // Dynamically import the dict.js module
//} catch (error) {
//  console.error("Error loading dictionary:", error.message);
//  process.exit(1);
//}
function loadDictionary() {
  if (!fs.existsSync(DICT_PATH)) return { en: {} };

  const dictContent = fs.readFileSync(DICT_PATH, "utf8");
  try {
    const match = dictContent.match(/=\s*({[\s\S]*});/);
    return match ? eval(`(${match[1]})`) : { en: {} };
  } catch (error) {
    console.error("Error loading dictionary:", error);
    return { en: {} };
  }
}
// Define model
const model = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" });

const languages = {
  en: "English",
  zh: "Mandarin Chinese",
  hi: "Hindi",
  es: "Spanish",
  ar: "Arabic",
  bn: "Bengali",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  pa: "Punjabi",
  de: "German",
  jv: "Javanese",
  wu: "Wu Chinese",
  ms: "Malay",
  te: "Telugu",
  vi: "Vietnamese",
  ko: "Korean",
  fr: "French",
  mr: "Marathi",
  ta: "Tamil",
  ur: "Urdu",
  tr: "Turkish",
  it: "Italian",
  th: "Thai",
  gu: "Gujarati",
  fa: "Persian",
  pl: "Polish",
  uk: "Ukrainian",
  ml: "Malayalam",
  kn: "Kannada",
  my: "Burmese",
  fil: "Filipino",
  ro: "Romanian",
  nl: "Dutch",
  hu: "Hungarian",
  el: "Greek",
  cs: "Czech",
  sw: "Swahili",
  si: "Sinhala",
  bg: "Bulgarian",
  hr: "Croatian",
  az: "Azerbaijani",
  he: "Hebrew",
  sk: "Slovak",
  da: "Danish",
  fi: "Finnish",
  id: "Indonesian",
  no: "Norwegian",
  sv: "Swedish",
  am: "Amharic",
};

// Function to list available languages
const listLanguages = () => {
  console.log("Available languages for translation:");
  for (const [code, name] of Object.entries(languages)) {
    console.log(`${code}: ${name}`);
  }
};

// Main translation prompt
const ADD_LANG_PROMPT = `Please translate the following object values into the target language, 
while keeping the structure the same. You will receive a dict object with key "en", 
give back the same structure with the target language. For example:
If you receive:
{
  en: {
    Auth: {
      login: "Login",
      logout: "Logout"
    }
  }
}
and the target language "fr" (French),
you should return:
{
  en: {
    Auth: {
      login: "Se connecter",
      logout: "Se déconnecter"
    }
  },
  fr: {
    Auth: {
      login: "Se connecter",
      logout: "Se déconnecter"
    }
  }
}
Do not give an introduction or conclusion. If you cannot do it for some reason, just return "error".`;

const ADD_CAT_PROMPT = `Please add a new category to the English dictionary with appropriate key-value pairs.
The category name will be provided, and you should create relevant key-value pairs for that category.
Do not modify any existing categories or their contents.
Return the entire dictionary with the new category added.
For example, if adding a "notifications" category:
{
  en: {
    existing_category: {
      // existing content remains unchanged
    },
    notifications: {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Information"
      // other relevant key-value pairs
    }
  }
}
Only return the JSON object, no introduction or explanation. If you cannot do it for some reason, just return "error".`;

// Synchronization prompt
const SYNC_PROMPT = `Please synchronize the translations from the reference language (en) with the target language. 
You will receive a dict object with key "en" and possibly other languages. 
Your task is to synchronize the existing translations in the target language with the keys from the reference language ("en").
all languages should have the same keys as the english (en) translation, with the values corresponding to that specific language.
For example:
If you receive:
{
  en: {
    Auth: {
      login: "Login",
      logout: "Logout"
    }
  },
  fr: {
    Auth: {
      logout: "Se déconnecter"
    }
  }
}
and you are synchronizing with "en", you should return:
{
  en: {
    Auth: {
      login: "Login",
      logout: "Logout"
    }
  },
  fr: {
    Auth: {
      login: "Se connecter",
      logout: "Se déconnecter"
    }
  }
}
Do not give an introduction or conclusion. If you cannot do it for some reason, just return "error".`;

const FILL_PROMPT = `Please fill in all subobjects (categories) in the "en" dictionary with all possible key values, 
while preserving all existing key values. Do not change any existing key values. 
Add more possible categories, give app, auth, user, actions and other similair categories, without altering the original structure. 
return "
en: {
  category_1: {
    key_1: value_1
    //as many as reasonable
  }, 
  category_2: {
    key_1: value_1
     //as many as reasonable
  }, 
   //as many as reasonable
}"
Here is the current "en" dictionary:`;

const INIT_PROMPT = `Please fill in the "en" dictionary with all possible categories and key-value pairs
relevant to a web application, give app, auth, user, actions and other similair categories, 
while preserving the existing key values. Do not alter any current values. 
add new categories and key-value pairs in the "en" dictionary. 
return "
{
en: {
  category_1: {
    key_1: value_1
    //as many as reasonable
  }, 
  category_2: {
    key_1: value_1
     //as many as reasonable
  }, 
   //as many as reasonable
}
}"
Here is the current "en" dictionary:`;

const initTranslations = async (dict) => {
  try {
    // Prepare the prompt for filling the "en" dictionary
    const prompt = `${INIT_PROMPT} ${JSON.stringify(dict.en)}`;

    // Get the response from the model
    const response = await geminiGetAnswer(prompt);
    // Clean and parse the response
    const cleanedResponse = cleanResponse(response);
    if (!cleanedResponse) {
      console.error("Failed to clean or validate the response.");
      return null; // Return null if response cleaning fails
    }

    // Parse the cleaned response into JSON
    const parsedResponse = JSON.parse(cleanedResponse);
    if (!parsedResponse.en) {
      console.error("Error: The filled dictionary does not contain 'en' key.");
      return null;
    }

    // Merge the filled "en" category with the existing dict
    dict.en = { ...dict.en, ...parsedResponse.en };

    return dict; // Return the filled dictionary
  } catch (error) {
    console.error(`Error filling translations: ${error.message}`);
    return null; // Return null in case of error
  }
};

// Function to check if the dict.ts file exists, and create it if not
const ensureDictExists = async () => {
  const dictFolderPath = path.resolve("./src/utils");
  const dictFilePath = path.resolve(dictFolderPath, "dict.ts");

  // Check if the utils directory exists
  if (!fs.existsSync(dictFolderPath)) {
    console.log("Creating 'utils' directory...");
    fs.mkdirSync(dictFolderPath, { recursive: true });
  }

  // Check if dict.ts exists
  if (fs.existsSync(dictFilePath)) {
    console.log("dict.ts already exists, run the 'fill' command to fill it.");
    process.exit(0); // Exit if the file already exists
  }

  // If dict.ts doesn't exist, initiate it by filling it with categories and key-values
  console.log("Creating and filling dict.ts...");
  const translatedText = await initTranslations({ en: {} }); // Start with empty "en" object

  if (!translatedText) {
    console.error("Failed to fill the dictionary.");
    process.exit(1);
  }

  // Save the filled dictionary to dict.ts
  const outputPath = dictFilePath;
  await saveTranslatedDict(translatedText, outputPath);
  console.log("dict.ts has been created and filled.");
};

// Function to fill translations
async function fillTranslations(dict) {
  try {
    const prompt = `${FILL_PROMPT} ${JSON.stringify(dict.en)}`;

    const response = await geminiGetAnswer(prompt);

    // Clean and parse the response
    const cleanedResponse = cleanResponse(response);
    if (!cleanedResponse) {
      console.error("Failed to clean or validate the response.");
      return dict; // Return null if response cleaning fails
    }

    const parsedResponse = JSON.parse(cleanedResponse);
    if (!parsedResponse.en) {
      console.error("Error: The filled dictionary does not contain 'en' key.");
      return dict;
    }

    // Merge the filled "en" category with the existing dict
    dict.en = { ...dict.en, ...parsedResponse.en };

    // If there are other language translations, sync them with the new category
    if (Object.keys(dict).length > 1) {
      const syncedDict = await syncTranslations(dict);
      return syncedDict || dict;
    }

    return dict; // Return the filled dictionary
  } catch (error) {
    console.error(`Error filling translations: ${error.message}`);
    return null; // Return null in case of error
  }
}

// Function to translate text
async function addLanguage(dict, language) {
  try {
    console.log(`Translating to ${languages[language]}...`);
    const prompt = `${ADD_LANG_PROMPT} Here is the text: ${JSON.stringify(
      dict
    )}, translate it into ${language}.`;

    const response = await geminiGetAnswer(prompt);

    // Clean and parse the response
    const cleanedResponse = cleanResponse(response);
    if (!cleanedResponse) {
      console.error("Failed to clean or validate the response.");
      return null; // Return null if response cleaning fails
    }

    const parsedResponse = JSON.parse(cleanedResponse);
    return parsedResponse; // Return the entire translated object
  } catch (error) {
    console.error(`Error translating text: ${error.message}`);
    return null; // Return null in case of error
  }
}

// Function to add a new category to the dictionary
async function addCategory(dict, category) {
  try {
    // Prepare the prompt with the current dictionary and new category
    const prompt = `${ADD_CAT_PROMPT}
      Category to add: "${category}"
      Current dictionary: ${JSON.stringify(dict)}`;

    // Get the response from the model
    const response = await geminiGetAnswer(prompt);

    // Clean and parse the response
    const cleanedResponse = cleanResponse(response);
    if (!cleanedResponse) {
      console.error("Failed to clean or validate the response.");
      return dict;
    }

    const parsedResponse = JSON.parse(cleanedResponse);
    if (!parsedResponse.en || !parsedResponse.en[category]) {
      console.error(
        `Error: The new category "${category}" was not added properly.`
      );
      return dict;
    }

    // Merge the new category with the existing dictionary
    // Preserve all existing categories and their content
    const updatedDict = {
      ...dict,
      en: {
        ...dict.en,
        [category]: parsedResponse.en[category],
      },
    };

    // If there are other language translations, sync them with the new category
    if (Object.keys(dict).length > 1) {
      const syncedDict = await syncTranslations(updatedDict);
      return syncedDict || updatedDict;
    }

    return updatedDict;
  } catch (error) {
    console.error(`Error adding category: ${error.message}`);
    return dict;
  }
}

// Function to synchronize translations
async function syncTranslations(text) {
  try {
    if (Object.keys(dict).length < 2) {
      console.log("Nothing to sync...");
      return;
    }

    const prompt = `${SYNC_PROMPT} Here is the text: ${JSON.stringify(text)}.`;

    const response = await geminiGetAnswer(prompt);

    // Clean and parse the response
    const cleanedResponse = cleanResponse(response);
    if (!cleanedResponse) {
      console.error("Failed to clean or validate the response.");
      return null; // Return null if response cleaning fails
    }

    const parsedResponse = JSON.parse(cleanedResponse);
    return parsedResponse; // Return the entire synchronized object
  } catch (error) {
    console.error(`Error synchronizing translations: ${error.message}`);
    return null; // Return null in case of error
  }
}

// Function to clean the response and make it valid JSON
const cleanResponse = (response) => {
  let cleanedResponse = response.replace(/```json|```/g, "").trim();

  try {
    JSON.parse(cleanedResponse); // Check if it's valid JSON
  } catch (e) {
    console.error("Error cleaning response:", e);
    return null; // Return null if parsing fails
  }

  return cleanedResponse;
};

// Function to get an answer from the generative model
const geminiGetAnswer = async (prompt) => {
  const result = await model?.generateContent(prompt);
  return result?.response.text();
};

// Function to save the translated or synchronized dict
async function saveTranslatedDict(translatedDict, outputPath) {
  try {
    const jsContent = `export const dict = ${JSON.stringify(
      translatedDict,
      null,
      2
    )};`;
    fs.writeFileSync(outputPath, jsContent, "utf8");
    console.log("Translation saved to", outputPath);
  } catch (error) {
    console.error("Error saving translated dictionary:", error.message);
  }
}

// Main function that orchestrates the actions
async function main() {
  // Get the language and action from the command-line arguments
  const action = process.argv[2];
  const targetLanguage = process.argv[3];
  const category = process.argv[3];

  if (
    !action ||
    (action !== "init" &&
      action !== "fill" &&
      action !== "addLang" &&
      action !== "addCat" &&
      action !== "sync")
  ) {
    console.error(
      "Please provide a valid action ('init' or 'fill' or 'addLang' or 'addCat' or 'sync')."
    );
    process.exit(1);
  }

  if (action === "init") {
    console.log("Initiating dictionary... Please wait.");
    await ensureDictExists();
    return;
  }

  if (action === "fill") {
    console.log("Starting translation filling... Please wait.");
    const filledDict = await fillTranslations(dict);
    const outputPath = dictPath;
    await saveTranslatedDict(filledDict, outputPath);
    return;
  }

  if (action === "addLang" && (!targetLanguage || !languages[targetLanguage])) {
    console.error("Please provide a valid target language code (e.g., 'fr').");
    listLanguages();
    process.exit(1);
  }

  // Perform the selected action
  if (action === "addLang") {
    console.log("Starting translation... Please wait.");
    const translatedDict = await addLanguage(dict, targetLanguage);

    if (!translatedDict) {
      console.error("Translation failed or could not be added.");
      process.exit(1);
    }

    if (!translatedDict[targetLanguage]) {
      console.error("Target language translation not found.");
      process.exit(1);
    }

    dict[targetLanguage] = translatedDict[targetLanguage];
    const outputPath = dictPath; // Overwrite the dict.js file
    await saveTranslatedDict(dict, outputPath);

    return;
  }

  if (action === "addCat" && !category) {
    console.error("Please provide a valid category (a valid english word).");
    process.exit(1);
  }

  if (action === "addCat" && category) {
    console.log(`Adding ${category} category... Please wait.`);
    const updatedDict = await addCategory(dict, category);
    const outputPath = dictPath;
    await saveTranslatedDict(updatedDict, outputPath);
    return;
  }

  if (action === "sync") {
    console.log("Starting synchronization... Please wait.");
    const syncedDict = await syncTranslations(dict);

    if (!syncedDict) {
      if (Object.keys(dict).length > 1) {
        console.error("Synchronization failed.");
      }
      process.exit(1);
    }

    dict = syncedDict;
    const outputPath = dictPath; // Overwrite the dict.ts file
    await saveTranslatedDict(dict, outputPath);
    return;
  }
}

// Run the main function
main().catch((error) => {
  console.error("Error in main function:", error.message);
  process.exit(1);
});
