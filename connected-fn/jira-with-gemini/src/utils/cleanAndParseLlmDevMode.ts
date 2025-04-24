type TestCaseSubCategoryKey =
  | "happyCases"
  | "alternativeCases"
  | "negativeCases"
  | "edgeCases";

type TestCaseCategory = {
  [key in TestCaseSubCategoryKey]: string[];
};

type TestSectionKey =
  | "functionalTestCases"
  | "regressionTestCases"
  | "nonFunctionalTestCases";

type TestData = {
  [key in TestSectionKey]: Required<TestCaseCategory>;
};

interface SectionMapping {
  title: string;

  key: TestSectionKey;
}

interface CategoryMapping {
  label: string;

  key: TestCaseSubCategoryKey;
}

function isTestCaseCategory(obj: any): obj is TestCaseCategory {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return false;
  }

  const keys: TestCaseSubCategoryKey[] = [
    "happyCases",

    "alternativeCases",

    "negativeCases",

    "edgeCases",
  ];

  return keys.every((key) => Array.isArray(obj[key]));
}

function isTestData(obj: any): obj is TestData {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return false;
  }

  const keys: TestSectionKey[] = [
    "functionalTestCases",

    "regressionTestCases",

    "nonFunctionalTestCases",
  ];

  return keys.every((key) => isTestCaseCategory(obj[key]));
}

export function cleanAndParseLlmJson(rawResponse: string): TestData | null {
  if (!rawResponse) {
    console.error("Received empty response string.");

    return null;
  }

  let jsonString = rawResponse.trim();

  if (jsonString.startsWith("```json") && jsonString.endsWith("```")) {
    jsonString = jsonString.substring(7, jsonString.length - 3).trim();
  } else if (jsonString.startsWith("```") && jsonString.endsWith("```")) {
    jsonString = jsonString.substring(3, jsonString.length - 3).trim();
  }

  try {
    const parsedJson = JSON.parse(jsonString);

    if (isTestData(parsedJson)) {
      return parsedJson;
    } else {
      console.error(
        "Parsed JSON failed structural validation (isTestData check failed)."
      );

      console.error("Parsed object:", parsedJson);

      return null;
    }
  } catch (error) {
    console.error("Failed to parse JSON string:", error);

    console.error("Original raw string:", rawResponse);

    console.error("Attempted to parse string:", jsonString);

    return null;
  }
}

export function convertJsonToJiraMarkup(testData: TestData): string {
  const outputLines: string[] = [];

  const placeholder: string =
    "_No specific tests derivable from the description for this sub-category._";

  const sections: SectionMapping[] = [
    { title: "h2. Functional Test Cases", key: "functionalTestCases" },

    { title: "h2. Regression Test Cases", key: "regressionTestCases" },

    { title: "h2. Non-Functional Test Cases", key: "nonFunctionalTestCases" },
  ];

  const categories: CategoryMapping[] = [
    { label: "*Happy Cases*", key: "happyCases" },

    { label: "*Alternative Cases*", key: "alternativeCases" },

    { label: "*Negative Cases*", key: "negativeCases" },

    { label: "*Edge Cases*", key: "edgeCases" },
  ];

  sections.forEach((section, sectionIndex) => {
    if (sectionIndex > 0) outputLines.push("");

    outputLines.push(section.title);

    const sectionData = testData[section.key];

    categories.forEach((category) => {
      outputLines.push(category.label);

      const testCases = sectionData[category.key] || [];

      if (testCases.length > 0) {
        testCases.forEach((testCase) => outputLines.push(`- ${testCase}`));
      } else {
        outputLines.push(placeholder);
      }
    });
  });

  return outputLines.join("\n");
}

export default function generateJiraMarkupFromLlmResponseDevMode(
  llmRawResponse: string
): string | null {
  const parsedTestData = cleanAndParseLlmJson(llmRawResponse);

  if (!parsedTestData) {
    console.error("Failed to obtain valid test data from the LLM response.");

    return null;
  }

  try {
    const jiraMarkup = convertJsonToJiraMarkup(parsedTestData);

    return jiraMarkup;
  } catch (error) {
    console.error(
      "An unexpected error occurred during Jira markup conversion:",

      error
    );

    return null;
  }
}
