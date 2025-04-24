export const basePromptTemplate = `Generate structured test instructions as a JSON object based *soleLY* on the Jira ticket information provided below. Organize the tests into Functional, Regression, and Non-Functional categories, each with sub-categories for Happy, Alternative, Negative, and Edge cases.

**Core Directives:**
* **Output Format:** The *entire* response MUST be a single, valid JSON object. Do NOT include any text outside the JSON structure (like introductory phrases, explanations, or markdown formatting like \`\`\`json).
* **Content Source:** Generate tests *ONLY* from the provided 'Jira Ticket Information'. Do NOT infer requirements or use external knowledge. Adhere strictly to the details within the description.
* **Test Type Differentiation:** Follow the specific instructions provided below for Functional, Regression, and Non-Functional sections to ensure the purpose and focus of tests are distinct for each category. Avoid simple duplication, especially between Functional and Regression.
* **JSON Structure:** The output MUST follow the specific JSON structure outlined below. All specified keys MUST be present. Use camelCase for keys as shown.
* **No Extraneous Text:** The response MUST begin directly with the opening brace \`{\` of the JSON object and end with the closing brace \`}\`.
* **Placeholder Usage:**
    * If *no specific tests* can be derived for a specific sub-category (e.g., 'happyCases' under 'functionalTestCases') based *solely* on the description and the specific instructions for that test type, use an empty array \`[]\` as the value for that sub-category key. Do NOT omit the key.

**Required JSON Output Structure & Instructions per Test Type:**

\`\`\`json
{
  "functionalTestCases": {
    "happyCases": [/* Array of strings, or [] if none */],
    "alternativeCases": [/* Array of strings, or [] if none */],
    "negativeCases": [/* Array of strings, or [] if none */],
    "edgeCases": [/* Array of strings, or [] if none */]
  },
  "regressionTestCases": {
    "happyCases": [/* Array of strings, or [] if none */],
    "alternativeCases": [/* Array of strings, or [] if none */],
    "negativeCases": [/* Array of strings, or [] if none */],
    "edgeCases": [/* Array of strings, or [] if none */]
  },
  "nonFunctionalTestCases": {
    "happyCases": [/* Array of strings, or [] if none */],
    "alternativeCases": [/* Array of strings, or [] if none */],
    "negativeCases": [/* Array of strings, or [] if none */],
    "edgeCases": [/* Array of strings, or [] if none */]
  }
}
\`\`\`

--- Functional Test Cases Instructions ---
*Focus:* Verify the specific features, requirements, user stories, and acceptance criteria described *directly* in the Jira ticket for the *new or modified functionality*.
*Goal:* Ensure the functionality works as specified in the description.
*Sub-Category Guidance:* Generate tests covering the main success paths (Happy Cases), valid alternative scenarios (Alternative Cases), expected error conditions/invalid inputs (Negative Cases), and boundary/unusual conditions (Edge Cases) related *directly* to the described changes. Place results as strings within the corresponding array in the \`functionalTestCases\` object (\`happyCases\`, \`alternativeCases\`, \`negativeCases\`, \`edgeCases\`). Use an empty array \`[]\` if no tests apply.

--- Regression Test Cases Instructions ---
*Focus:* Identify potential unintended impacts of the *changes described in this ticket* on *existing* functionality, particularly in related areas (if mentioned or implied in the description).
*Goal:* Ensure that implementing the described changes has not broken other, potentially pre-existing parts of the system hinted at in the description.
*Sub-Category Guidance:* Think about what *existing* functionalities might be affected by the *new* changes. If the description mentions interactions with other modules, data impacts, or modifies shared components, derive tests to verify those related areas remain stable. **CRITICAL:** Do *not* simply duplicate the Functional tests. Aim for tests verifying stability *around* the changes. If the description *only* details the new feature with no context of related existing features, deriving distinct regression tests might be limited – use empty arrays \`[]\` in that case. Place results as strings within the corresponding array in the \`regressionTestCases\` object.

--- Non-Functional Test Cases Instructions ---
*Focus:* Verify quality attributes *other than* core feature logic, but *only if* such requirements are mentioned or clearly implied in the description.
*Goal:* Ensure aspects like performance, security, usability, reliability meet any criteria specified or hinted at in the description.
*Sub-Category Guidance:* Look explicitly for terms or descriptions related to: performance (e.g., response time, load capacity, speed), security (e.g., permissions, data access, encryption), usability (e.g., ease of use, accessibility - often hard from text alone), reliability (e.g., error handling robustness, uptime). If the description contains *no* information related to these aspects, use empty arrays \`[]\` for all sub-categories within the \`nonFunctionalTestCases\` object. Place results as strings within the corresponding array.

**Test Objective Format (Strings within JSON Arrays):**
* Present individual test objectives clearly as strings within the appropriate array (e.g., \`"functionalTestCases.happyCases": ["Objective 1", "Objective 2"]\`).
* Phrase each objective concisely, ideally following the pattern: *"Verify [Action or Condition] results in [Expected Outcome]."*

**Input Description Formatting Notes (If Applicable):**
If the 'Description' field below contains raw formatting (e.g., \`!...\`, \`{color:...}\`):
* **Ignore Visuals/Markup:** Rely solely on the readable text content. Disregard image placeholders and formatting tags.
* **Assume Standard Interaction:** Interpret requirements based on standard user interactions unless explicitly stated otherwise.

**Jira Ticket Information (Input Data):**

\${description}

**Final Check:** Before outputting, mentally review: Is the output *only* a valid JSON object? Does it start with \`{\` and end with \`}\`? Does it strictly follow the specified JSON structure with the correct camelCase keys (\`functionalTestCases\`, \`regressionTestCases\`, \`nonFunctionalTestCases\`, and their sub-keys like \`happyCases\`)? Are test objectives represented as strings within arrays? Is an empty array \`[]\` used correctly for placeholders? Does the content strictly adhere to the provided description and the specific instructions for each test type? Is duplication between Functional/Regression avoided where possible based *only* on the description?
`;


export const jiraCsvConversionPromptTemplate = `You are an expert QA Engineer acting as a data transformation tool. Your task is to convert a list of test case summaries, provided within a structured JSON object, into a detailed flat JSON array-of-arrays structure, based **only** on the provided inputs.

**Inputs:**
1.  **Feature Description (description):** Provides the overall context, user roles, goals, and functionality. Use this for background details ONLY when expanding the summaries. Do not invent details not supported by the description or summary.
2.  **Existing Test Case Summaries (testCases):** A JSON object containing categorized test case summaries. The expected structure is:
    \`\`\`json
    {
      "functionalTestCases": {
        "happyCases": ["summary1", "summary2", ...],
        "alternativeCases": [...],
        "negativeCases": [...],
        "edgeCases": [...]
      },
      "regressionTestCases": {
        "happyCases": [...],
        "alternativeCases": [...],
        "negativeCases": [...],
        "edgeCases": [...]
       },
      "nonFunctionalTestCases": {
        "happyCases": [...],
        "alternativeCases": [...],
        "negativeCases": [...],
        "edgeCases": [...]
       }
    }
    \`\`\`
    Each string within the arrays is a test case title or summary.

**Core Requirement: Filtered One-to-One Mapping**
* You **MUST** traverse the **entire nested structure** of the input \`testCases\` JSON object and process **every single summary string** found within the arrays (e.g., within \`happyCases\`, \`alternativeCases\`, etc.).
* Summary strings exactly matching "_No specific tests derivable from the description for this sub-category._" (including the underscores) **MUST BE IGNORED** wherever they are found and should **NOT** result in an output array.
* **Each summary string** that is **NOT** the ignored placeholder text must result in **exactly one** detailed test case (one inner array) in the output JSON.
* The total number of inner arrays in the final JSON output **MUST BE IDENTICAL** to the total number of summary strings in the input \`testCases\` object **excluding** any summaries that matched the ignored placeholder text. **NO EXCEPTIONS. DO NOT SKIP OR MERGE ANY OTHER SUMMARIES.**

**Task Breakdown (Follow these steps precisely):**
1.  Initialize an empty list that will hold the final JSON output array.
2.  Initialize a counter for the unique Test Case ID sequence, starting at 1.
3.  Carefully read the Feature Description (\`description\`) to understand the context and extract the main Feature name.
4.  Iterate through the top-level keys of the input \`testCases\` object (e.g., \`functionalTestCases\`, \`regressionTestCases\`, \`nonFunctionalTestCases\`).
    a.  Determine the corresponding test case **Type** based on the current top-level key:
        * 'functionalTestCases' -> "Functional"
        * 'regressionTestCases' -> "Regression"
        * 'nonFunctionalTestCases' -> "Non-Functional"
        * (Use "Functional" as a fallback if the key is unexpected).
5.  Within each top-level key, iterate through the second-level keys (e.g., \`happyCases\`, \`alternativeCases\`, \`negativeCases\`, \`edgeCases\`).
    a.  Determine the corresponding **TC_category** based on the current second-level key:
        * 'happyCases' -> "Happy Case"
        * 'alternativeCases' -> "Alternative Case"
        * 'negativeCases' -> "Negative Case"
        * 'edgeCases' -> "Edge Case"
        * (Use "Happy Case" as a fallback if the key is unexpected).
6.  Within each second-level key, iterate through the array of **summary strings**. For the **current summary string** being processed:
    a.  **Check:** Compare the current summary string *exactly* against "_No specific tests derivable from the description for this sub-category._".
    b.  **Skip if Placeholder:** If the summary **matches** the placeholder text, **immediately stop processing this summary string, do NOT create an output array for it,** and proceed to the next summary string in the current array.
    c.  **Process if Valid:** If the summary string does **NOT** match the placeholder text, proceed with the following steps:
        i.  Create a new inner array representing **one single detailed test case**.
        ii. Populate the 15 required fields for this inner array (as defined below) in the specified order.
        iii. Use the **Type** determined in step 4a for the 'Type' field (field 5).
        iv. Use the **TC_category** determined in step 5a for the 'TC_category' field (field 6).
        v.  Use the **current summary string** directly for the 'Description/Summary' field (field 4). Minor grammatical corrections for clarity are permissible, but the core meaning and intent must be preserved. **MUST NOT BE BLANK.**
        vi. Use the Feature Description (\`description\`) context to help infer appropriate values for the *other* fields ('Priority', 'As (Actor)', 'Given', 'When', 'Then'). Extract User Story ID if possible.
        vii. **Fallback:** If specific details for 'Priority', 'Given', 'When', 'Then', 'Actor', 'User Story ID' cannot be reliably inferred for the *current valid summary* even with the description's context, make reasonable, concise assumptions based on the summary's likely intent to complete the fields. **Crucially, still generate the test case entry for this summary.** Do not skip it. Default 'Priority' to "Medium". Default 'User Story ID' to "". Default 'EST(mins)' to 5 (integer).
        viii. Generate the unique 'Test Case ID' (field 1): Create a short prefix from the Feature name (e.g., 'TC-ALLOC-' for 'Job Allocation', max 5-6 chars, using 'TC-' if difficult) and append the current counter value (from step 2), padded with leading zeros to three digits (e.g., '-001', '-002', '-010', '-100').
        ix. Ensure fields 12 ('Result(latest)'), 14 ('Date Run'), and 15 ('Notes') are always empty strings ("").
        x.  Append the completed inner array (representing the valid test case derived from the *current summary string*) to the output list you initialized in step 1.
        xi. **Increment the Test Case ID counter** (from step 2) by 1.
7.  After processing **ALL** summary strings from the **entire nested structure** of the input \`testCases\` object, ensure the final output list contains exactly the same number of inner arrays as there were *valid* (non-placeholder) summary strings found in the input.
8.  Format the entire output list **strictly** as a JSON array of arrays.

**Required Fields & Order within each inner array:**

1.  **Test Case ID:** (String) Unique identifier (e.g., "TC-FEAT-001", "TC-002"). **MUST BE UNIQUE.** Generated as per step 6.c.viii.
2.  **Feature:** (String) Main feature name (from description, step 3).
3.  **User Story Id:** (String) From description if available (look for patterns like 'US-XXX', 'Story-YYY'), else "".
4.  **Description/Summary:** (String) Use the corresponding *valid* summary string from the \`testCases\` structure (step 6.c.v). **MUST NOT BE BLANK.**
5.  **Type:** (String) "Functional", "Regression", "Non-Functional". **Derived directly** from the top-level key in the input \`testCases\` object (step 4a).
6.  **TC_category:** (String) "Happy Case", "Alternative Case", "Negative Case", "Edge Case". **Derived directly** from the second-level key in the input \`testCases\` object (step 5a).
7.  **Priority:** (String) "High", "Medium", "Low". Infer from summary/description context. Default: "Medium" (step 6.c.vii).
8.  **As (Actor):** (String) User role (infer from description/summary context). Provide a reasonable default like "User" if unsure.
9.  **Given (Precondition):** (String) Setup details (infer from summary/description context). Use "\\n" for newlines if needed. Make reasonable assumption if unclear.
10. **When (Action):** (String) Action steps (infer from summary/description context). Use "\\n" for newlines if needed. Make reasonable assumption if unclear.
11. **Then (Expected Result):** (String) Expected outcome (infer from summary/description context). Use "\\n" for newlines if needed. Make reasonable assumption if unclear.
12. **Result(latest):** (String) Always "".
13. **EST(mins):** (Integer) Estimated minutes. Default: 5. **MUST BE AN INTEGER.** (step 6.c.vii).
14. **Date Run:** (String) Always "".
15. **Notes:** (String) Always "". **CRITICAL: MUST BE EMPTY STRING.**

**Example JSON Structure (Illustrative - showing ONE inner array derived from a valid summary):**

\`\`\`json
[
  [
    "TC-ALLOC-001",
    "Job Allocation",
    "US-500",
    "Verify the Allocation Modal is displayed for ACH jobs.",
    "Functional",
    "Happy Case",
    "High",
    "Scheduler",
    "- User is logged in as a Scheduler\\n- At least one ACH Job exists in the system",
    "- User navigates to the Job scheduling view\\n- User selects a specific ACH Job record",
    "- The Allocation Modal specific to the selected ACH job is displayed promptly\\n- Key sections like 'Available Resources' and 'Offers' are visible within the modal",
    "",
    5,
    "",
    ""
  ]
  // ... more inner arrays would follow here, one for each *valid* (non-placeholder) input summary string ...
]
\`\`\`

**Output Format Requirements:**
* The final output MUST be a valid JSON array of arrays (a flat list).
* Each inner array MUST contain the 15 fields in the exact order specified above.
* String values MUST be correctly JSON escaped (e.g., newlines as "\\n", double quotes as '\\"'). Ensure numbers like EST(mins) are output as JSON integers (e.g., 5, not "5").
* Return ONLY the JSON output. No explanations, comments, or markdown code blocks like \`\`\`json ... \`\`\`.

**Final Check:** Before outputting, double-check that the number of inner arrays precisely matches the total number of summary strings found in the input \`testCases\` object **excluding** any summaries that exactly matched "_No specific tests derivable from the description for this sub-category._".

---

**Inputs:**

**1. Feature Description:**
\`\`\`
\${description}
\`\`\`

**2. Existing Test Case Summaries (JSON Object):**
\`\`\`json
\${testCases}
\`\`\`

---

**Output (JSON Array of Arrays Only):**
`;