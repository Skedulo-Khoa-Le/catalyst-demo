export const basePromptTemplate = `Generate structured test instructions based *solely* on the Jira ticket information provided below. Organize the tests into Functional, Regression, and Non-Functional categories.

**Direct Output Requirement:**
* **CRITICAL Heading Format Consistency:** ALL \`h3.\` headings MUST strictly use Title Case format: \`h3. Happy Cases\`, \`h3. Alternative Cases\`, \`h3. Negative Cases\`, \`h3. Edge Cases\`. Do NOT use ALL CAPS. Do NOT add suffixes like '(Regression)'. This applies to ALL sections.
* Do not include any introductory phrases, acknowledgements, or conversational text.
* Format the *entire* output using Jira wiki markup so it can be directly pasted into a Jira ticket and render correctly. Your response *must* begin directly with the first \`h2.\` heading.
* If no test cases can be generated for a specific sub-category (Happy, Alternative, Negative, Edge) based *solely* on the description *within a section that contains derivable tests*, include the correctly formatted \`h3.\` heading (using the exact Title Case format specified above) and write "_No specific tests derivable from the description for this sub-category._" beneath it.
* **RULE:** If *no* test cases can be generated for an *entire* top-level category (i.e., Regression or Non-Functional) based *solely* on the description, output *only* the \`h2.\` heading for that category followed by the text: "_No specific tests derivable from the description for this entire category._" on the next line. Do *not* output the \`h3.\` sub-category headings in this case.
* **REMOVED:** Do not include the descriptive sentence or the '* *Goal:*' line under any \`h3.\` heading.
* **REMOVED:** Do not include the introductory description text under any \`h2.\` heading.

**Required Output Structure (Using Jira Wiki Markup - Headings MUST match this casing):**

h2. Functional Test Cases
h3. Happy Cases
* (_Generate specific bullet points (-) based *only* on description, or use placeholder "_No specific tests derivable from the description for this sub-category._"_)
h3. Alternative Cases
* (_Generate specific bullet points (-) based *only* on description, or use placeholder "_No specific tests derivable from the description for this sub-category._"_)
h3. Negative Cases
* (_Generate specific bullet points (-) based *only* on description, or use placeholder "_No specific tests derivable from the description for this sub-category._"_)
h3. Edge Cases
* (_Generate specific bullet points (-) based *only* on description, or use placeholder "_No specific tests derivable from the description for this sub-category._"_)


h2. Regression Test Cases
*Instructions for AI:* First, determine if *any specific* regression tests can be derived *solely* from the description. Remember: ALL h3 headings generated below MUST use the exact Title Case format: \`h3. Happy Cases\`, \`h3. Alternative Cases\`, \`h3. Negative Cases\`, \`h3. Edge Cases\`.
*If YES:* Generate all four required \`h3.\` sub-categories using the exact Title Case format specified. Populate each \`h3.\` with *specific* bullet points (-) based *only* on the description, or use the sub-category placeholder "_No specific tests derivable from the description for this sub-category._" if none are derivable for that specific \`h3.\`.
*If NO:* Output *only* the text: "_No specific tests derivable from the description for this entire category._" directly below the \`h2. Regression Test Cases\` heading.
--- (Structure if YES - Headings MUST be exactly as shown below) ---
h3. Happy Cases
* (_Generate specific bullet points (-) or use placeholder "_No specific tests derivable..._"_)
h3. Alternative Cases
* (_Generate specific bullet points (-) or use placeholder "_No specific tests derivable..._"_)
h3. Negative Cases
* (_Generate specific bullet points (-) or use placeholder "_No specific tests derivable..._"_)
h3. Edge Cases
* (_Generate specific bullet points (-) or use placeholder "_No specific tests derivable..._"_)
--- (End Structure if YES) ---


h2. Non-Functional Test Cases
*Instructions for AI:* First, determine if *any specific* non-functional tests can be derived *solely* from the description. Remember: ALL h3 headings generated below MUST use the exact Title Case format: \`h3. Happy Cases\`, \`h3. Alternative Cases\`, \`h3. Negative Cases\`, \`h3. Edge Cases\`.
*If YES:* Generate all four required \`h3.\` sub-categories using the exact Title Case format specified. Populate each \`h3.\` with *specific* bullet points (-) based *only* on the description, or use the sub-category placeholder "_No specific tests derivable from the description for this sub-category._" if none are derivable for that specific \`h3.\`.
*If NO:* Output *only* the text: "_No specific tests derivable from the description for this entire category._" directly below the \`h2. Non-Functional Test Cases\` heading.
--- (Structure if YES - Headings MUST be exactly as shown below) ---
h3. Happy Cases
* (_Generate specific bullet points (-) or use placeholder "_No specific tests derivable..._"_)
h3. Alternative Cases
* (_Generate specific bullet points (-) or use placeholder "_No specific tests derivable..._"_)
h3. Negative Cases
* (_Generate specific bullet points (-) or use placeholder "_No specific tests derivable..._"_)
h3. Edge Cases
* (_Generate specific bullet points (-) or use placeholder "_No specific tests derivable..._"_)
--- (End Structure if YES) ---


**Test Objective Format (Within Applicable Sub-Categories):**
Present individual test objectives clearly using Jira wiki markup.
* Use bullet points (-) for each distinct test objective on a new line.
* Phrase each objective concisely using the pattern: *Verify [Action or Condition] results in [Expected Outcome].*

**IMPORTANT NOTE ON DESCRIPTION FORMAT (If Applicable):**
If the 'Description' field provided below contains raw formatting (e.g., \`!AD_...\`, \`!image-...\`, \`{color:...}\`), please be aware:
* **Ignore Image Placeholders:** You cannot see images. Rely solely on surrounding text.
* **Ignore Markup:** Disregard tags like \`{color:...}\`, focus on text content.
* **Extract from Readable Text:** Your goal is to understand requirements from the readable text despite formatting issues. Assume standard user interactions unless specified otherwise.

**Jira Ticket Information (Input Data):**

\${description}

**Final Output:**
Ensure the generated output strictly follows the Jira wiki markup structure. Always include \`h2.\` headings for Functional, Regression, and Non-Functional. Do *not* include any introductory text under the \`h2\` headings. Ensure all \`h3\` headings use the exact Title Case format specified (\`h3. Happy Cases\`, \`h3. Alternative Cases\`, \`h3. Negative Cases\`, \`h3. Edge Cases\`) and do NOT include suffixes. For Functional, Regression, and Non-Functional sections where specific tests *can* be derived, include the relevant \`h3.\` sub-categories (using placeholders if a specific \`h3.\` is empty). For Regression and Non-Functional sections where *no specific tests* can be derived for the entire category, output only the \`h2.\` heading and the "entire category" placeholder text. Generate test objectives using the "Verify..." format where applicable. Do not include descriptive/goal text under h3 headings. Do not invent requirements not present in the description.
`;
export const jiraCsvConversionPromptTemplate = `You are an expert QA Engineer acting as a data transformation tool. Your task is to convert a list of test case summaries into a detailed JSON structure, based **only** on the provided inputs. **Crucially, you must process every single summary provided in the input list.**

**Inputs:**
1.  **Feature Description (description):** Provides the overall context, user roles, goals, and functionality. Use this for background details ONLY when expanding the summaries. Do not invent details not supported by the description or summary.
2.  **Existing Test Case Summaries (testCases):** A list of strings, where each string is a test case title or summary.

**Core Requirement: One-to-One Mapping**
* You **MUST** process **every single summary** from the input \`testCases\` list.
* **Each summary** must result in **exactly one** detailed test case (one inner array) in the output JSON.
* The total number of inner arrays in the final JSON output **MUST BE IDENTICAL** to the number of summaries in the input \`testCases\` list. **NO EXCEPTIONS. DO NOT SKIP OR MERGE ANY SUMMARIES.**

**Task Breakdown (Follow these steps precisely):**
1.  Initialize an empty list that will hold the final JSON output array.
2.  Carefully read the Feature Description (\`description\`) to understand the context.
3.  Iterate through the input \`testCases\` list, processing **one summary at a time** in the order provided.
4.  For the **current summary** being processed:
    a. Create a new inner array representing **one single detailed test case**.
    b. Populate the 15 required fields for this inner array (as defined below) in the specified order.
    c. Use the **current summary** text directly for the 'Description/Summary' field (field 4). Refine slightly if necessary for clarity, but ensure it reflects the original summary. **MUST NOT BE BLANK.**
    d. Use the Feature Description (\`description\`) context to help infer appropriate values for the other fields ('Type', 'TC_category', 'Priority', 'As (Actor)', 'Given', 'When', 'Then', 'EST(mins)').
    e. **Fallback:** If specific details for 'Given', 'When', 'Then', 'Actor', etc., cannot be reliably inferred for the *current summary* even with the description's context, make reasonable, concise assumptions based on the summary's likely intent to complete the fields. **Crucially, still generate the test case entry for this summary.** Do not skip it. For 'Type', default to "Functional" if unsure. For 'Priority', default to "Medium". For 'EST(mins)', default to 5.
    f. Ensure the 'Test Case ID' (field 1) is unique for each generated test case (e.g., using sequential numbering like "TC-001", "TC-002").
    g. Ensure fields 12 ('Result(latest)'), 14 ('Date Run'), and 15 ('Notes') are always empty strings ("").
    h. Append the completed inner array (representing the test case derived from the *current summary*) to the output list you initialized in step 1.
5.  After processing **ALL** summaries from the input \`testCases\` list, ensure the final output list contains exactly the same number of inner arrays as there were summaries in the input.
6.  Format the entire output list **strictly** as a JSON array of arrays.

**Required Fields & Order within each inner array:**

1.  **Test Case ID:** (String) Unique identifier (e.g., "TC-001", "TC-002", ...). **MUST BE UNIQUE.**
2.  **Feature:** (String) Main feature name (from description).
3.  **User Story Id:** (String) From description if available, else "".
4.  **Description/Summary:** (String) Use/refine the corresponding summary from \`testCases\`. **MUST NOT BE BLANK.**
5.  **Type:** (String) "Functional", "Regression", "Non-Functional". Infer from summary/description context. Default: "Functional".
6.  **TC_category:** (String) "Happy Case", "Alternative Case", "Negative Case", "Edge Case". Infer from summary/description context.
7.  **Priority:** (String) "High", "Medium", "Low". Infer from summary/description context. Default: "Medium".
8.  **As (Actor):** (String) User role (from description).
9.  **Given (Precondition):** (String) Setup details (from summary/description context). Use "\\n" for newlines if needed.
10. **When (Action):** (String) Action steps (from summary/description context). Use "\\n" for newlines if needed.
11. **Then (Expected Result):** (String) Expected outcome (from summary/description context). Use "\\n" for newlines if needed.
12. **Result(latest):** (String) Always "".
13. **EST(mins):** (Integer or String) Estimated minutes. Default: 5.
14. **Date Run:** (String) Always "".
15. **Notes:** (String) Always "". **CRITICAL: MUST BE EMPTY STRING.**

**Example JSON Structure (Illustrative - showing ONE inner array):**

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
  // ... more inner arrays would follow here, one for each input summary ...
]
\`\`\`

**Output Format Requirements:**
* The final output MUST be a valid JSON array of arrays.
* Each inner array MUST contain the 15 fields in the exact order specified above.
* String values MUST be correctly JSON escaped (e.g., newlines as "\\n", double quotes as '\\"').
* Return ONLY the JSON output. No explanations, comments, or markdown code blocks like \`\`\`json ... \`\`\`.

**Final Check:** Before outputting, double-check that the number of inner arrays precisely matches the number of summaries in the input \`testCases\` list.

---

**Inputs:**

**1. Feature Description:**
\`\`\`
\${description}
\`\`\`

**2. Existing Test Case Summaries:**
\`\`\`
\${testCases}
\`\`\`

---

**Output (JSON Array of Arrays Only):**
`;