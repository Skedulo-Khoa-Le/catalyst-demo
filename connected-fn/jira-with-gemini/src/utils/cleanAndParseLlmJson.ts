// --- EXISTING TYPE DEFINITIONS AND INTERFACES (Unchanged) ---

type TestCaseSubCategoryKey =
  | "happyCases"
  | "alternativeCases"
  | "negativeCases"
  | "edgeCases";

type TestCaseCategory = {
  // Use Partial temporarily to allow for missing keys during initial parsing if needed,
  // but the validation ensures they exist in the final valid TestData.
  // Sticking with the original definition assuming validation is strict.
  [key in TestCaseSubCategoryKey]: string[];
};

type TestSectionKey =
  | "functionalTestCases"
  | "regressionTestCases"
  | "nonFunctionalTestCases";

// Ensures all TestCaseCategory keys are present after validation
type ValidatedTestData = {
  [key in TestSectionKey]: Required<TestCaseCategory>;
};

// Interface for mapping internal keys to display titles/labels
interface SectionMapping {
  title: string; // Plain text title (no markup)
  key: TestSectionKey;
}

interface CategoryMapping {
  label: string; // Plain text label (no markup)
  key: TestCaseSubCategoryKey;
}

// --- BASIC ADF TYPE DEFINITIONS (for clarity, can be expanded) ---

// Using 'any' for content flexibility, stricter types can be defined if needed
export type AdfMark = { type: "strong" | "em" }; // Bold, Italic
export type AdfTextNode = { type: "text"; text: string; marks?: AdfMark[] };
export type AdfParagraphNode = { type: "paragraph"; content: AdfTextNode[] }; // Simplified: assuming paragraphs only contain text nodes directly
export type AdfHeadingNode = {
  type: "heading";
  attrs: { level: 2 };
  content: AdfTextNode[];
}; // Using level 2 headings
export type AdfListItemNode = { type: "listItem"; content: AdfParagraphNode[] }; // List items contain paragraphs
export type AdfBulletListNode = {
  type: "bulletList";
  content: AdfListItemNode[];
};
export type AdfTopLevelNode =
  | AdfHeadingNode
  | AdfParagraphNode
  | AdfBulletListNode;
export type AdfDocument = {
  version: 1;
  type: "doc";
  content: AdfTopLevelNode[];
};

// --- EXISTING TYPE GUARDS (Unchanged) ---

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
  // Ensure all required keys exist and are arrays
  return keys.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(obj, key) && Array.isArray(obj[key])
  );
}

function isTestData(obj: any): obj is ValidatedTestData {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return false;
  }
  const keys: TestSectionKey[] = [
    "functionalTestCases",
    "regressionTestCases",
    "nonFunctionalTestCases",
  ];
  // Ensure all required section keys exist and their values pass the category check
  return keys.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(obj, key) &&
      isTestCaseCategory(obj[key])
  );
}

// --- EXISTING PARSING FUNCTION (Unchanged) ---

export function cleanAndParseLlmJson(
  rawResponse: string
): ValidatedTestData | null {
  if (!rawResponse) {
    console.error("Received empty response string.");
    return null;
  }
  let jsonString = rawResponse.trim();

  // Remove markdown code fences
  if (jsonString.startsWith("```json") && jsonString.endsWith("```")) {
    jsonString = jsonString.substring(7, jsonString.length - 3).trim();
  } else if (jsonString.startsWith("```") && jsonString.endsWith("```")) {
    jsonString = jsonString.substring(3, jsonString.length - 3).trim();
  }

  try {
    const parsedJson = JSON.parse(jsonString);

    // Perform structural validation
    if (isTestData(parsedJson)) {
      // At this point, we know parsedJson conforms to ValidatedTestData
      return parsedJson;
    } else {
      console.error(
        "Parsed JSON failed structural validation (isTestData check failed)."
      );
      // Log structure for debugging
      // console.error("Parsed object structure:", JSON.stringify(parsedJson, null, 2));
      return null;
    }
  } catch (error) {
    console.error("Failed to parse JSON string:", error);
    console.error("Original raw string:", rawResponse);
    console.error("Attempted to parse string:", jsonString);
    return null;
  }
}

// --- NEW ADF CONVERSION FUNCTION ---

/**
 * Converts validated test data into Atlassian Document Format (ADF) JSON.
 * @param testData The validated test data object.
 * @returns An ADF Document object.
 */
export function convertJsonToAdf(testData: ValidatedTestData): AdfDocument {
  const adf: AdfDocument = {
    version: 1,
    type: "doc",
    content: [],
  };

  const placeholderText: string =
    "No specific tests derivable from the description for this sub-category.";

  // Define sections and categories without wiki markup
  const sections: SectionMapping[] = [
    { title: "Functional Test Cases", key: "functionalTestCases" },
    { title: "Regression Test Cases", key: "regressionTestCases" },
    { title: "Non-Functional Test Cases", key: "nonFunctionalTestCases" },
  ];
  const categories: CategoryMapping[] = [
    { label: "Happy Cases", key: "happyCases" },
    { label: "Alternative Cases", key: "alternativeCases" },
    { label: "Negative Cases", key: "negativeCases" },
    { label: "Edge Cases", key: "edgeCases" },
  ];

  sections.forEach((section) => {
    // Add Section Heading (h2)
    adf.content.push({
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: section.title }],
    });

    const sectionData = testData[section.key];

    categories.forEach((category) => {
      // Add Category Label (bold paragraph)
      adf.content.push({
        type: "paragraph",
        content: [
          {
            type: "text",
            text: category.label,
            marks: [{ type: "strong" }], // Apply bold mark
          },
        ],
      });

      const testCases = sectionData[category.key]; // Already validated to be string[]

      if (testCases.length > 0) {
        // Add Bullet List for test cases
        const listItems: AdfListItemNode[] = testCases.map(
          (testCase): AdfListItemNode => ({
            type: "listItem",
            content: [
              {
                // List items contain paragraphs
                type: "paragraph",
                content: [{ type: "text", text: testCase }], // Plain text content
              },
            ],
          })
        );

        adf.content.push({
          type: "bulletList",
          content: listItems,
        });
      } else {
        // Add Placeholder (italic paragraph)
        adf.content.push({
          type: "paragraph",
          content: [
            {
              type: "text",
              text: placeholderText,
              marks: [{ type: "em" }], // Apply italic mark
            },
          ],
        });
      }
    });
    // Optionally add an empty paragraph for spacing between sections if desired
    // adf.content.push({ type: 'paragraph', content: [] });
  });

  return adf;
}

// --- UPDATED MAIN EXPORT FUNCTION ---

/**
 * Parses an LLM response, validates the structure, and converts it
 * into an Atlassian Document Format (ADF) JSON object suitable for Jira V3 API.
 * @param llmRawResponse The raw string response from the LLM.
 * @returns An ADF Document object, or null if parsing/validation fails.
 */
export default function generateAdfFromLlmResponse(
  llmRawResponse: string
): AdfDocument | null {
  const parsedTestData = cleanAndParseLlmJson(llmRawResponse);

  if (!parsedTestData) {
    console.error("Failed to obtain valid test data from the LLM response.");
    return null; // Error already logged in cleanAndParseLlmJson
  }

  try {
    // Convert the validated data to ADF format
    const adfResult = convertJsonToAdf(parsedTestData);
    return adfResult;
  } catch (error) {
    console.error("An unexpected error occurred during ADF conversion:", error);
    return null;
  }
}
