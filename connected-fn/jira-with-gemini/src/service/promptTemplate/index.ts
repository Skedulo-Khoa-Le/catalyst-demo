export const basePromptTemplate = `Generate structured test instructions based *soleLY* on the Jira ticket information provided below. Organize the tests into Functional, Regression, and Non-Functional categories using the specified formatting.

**Core Directives:**
* **Output Format:** The *entire* response MUST use Jira wiki markup suitable for direct pasting.
* **Content Source:** Generate tests *ONLY* from the provided 'Jira Ticket Information'. Do NOT infer requirements or use external knowledge. Adhere strictly to the details within the description.
* **Test Type Differentiation:** Follow the specific instructions provided below for Functional, Regression, and Non-Functional sections to ensure the purpose and focus of tests are distinct for each category. Avoid simple duplication, especially between Functional and Regression.
* **Consistent Structure:** ALL three sections (Functional, Regression, Non-Functional) MUST include the \`h2.\` heading followed by ALL four bolded sub-category labels.
* **Formatting:**
    * **Main Headings:** Use \`h2.\` for main categories. MUST be exactly: \`h2. Functional Test Cases\`, \`h2. Regression Test Cases\`, \`h2. Non-Functional Test Cases\`.
    * **Sub-Category Labels:** Use **bold text** (asterisks surrounding the text). The text content MUST use **Title Case**. Examples: \`*Happy Cases*\`, \`*Alternative Cases*\`, \`*Negative Cases*\`, \`*Edge Cases*\`. Do **NOT** use ALL CAPS for these labels.
* **No Extraneous Text:** Do NOT include introductory phrases, acknowledgements, explanations, or conversational text. The response MUST begin directly with the first \`h2.\` heading. Do NOT include descriptive text under \`h2\` headings or the bold sub-category labels.
* **Placeholder Usage:**
    * If *no specific tests* can be derived for a specific sub-category based *solely* on the description and the specific instructions for that test type (Functional, Regression, Non-Functional), include the correctly formatted **bold sub-category label** (using Title Case content, e.g., \`*Happy Cases*\`) and write "_No specific tests derivable from the description for this sub-category._" on the next line beneath it. This applies under *all* bold sub-category labels in *all* \`h2\` sections.

**Required Output Structure & Instructions per Test Type (Using Jira Wiki Markup):**

--- Functional Test Cases Instructions ---
*Focus:* Verify the specific features, requirements, user stories, and acceptance criteria described *directly* in the Jira ticket for the *new or modified functionality*.
*Goal:* Ensure the functionality works as specified in the description.
*Sub-Category Guidance:* Generate tests covering the main success paths (Happy Cases), valid alternative scenarios (Alternative Cases), expected error conditions/invalid inputs (Negative Cases), and boundary/unusual conditions (Edge Cases) related *directly* to the described changes. Place results under the corresponding bold Title Case label.
h2. Functional Test Cases
*Happy Cases*
- (_Generate specific bullet points (-) based *only* on description and Functional instructions, or use placeholder_)
*Alternative Cases*
- (_Generate specific bullet points (-) based *only* on description and Functional instructions, or use placeholder_)
*Negative Cases*
- (_Generate specific bullet points (-) based *only* on description and Functional instructions, or use placeholder_)
*Edge Cases*
- (_Generate specific bullet points (-) based *only* on description and Functional instructions, or use placeholder_)

--- Regression Test Cases Instructions ---
*Focus:* Identify potential unintended impacts of the *changes described in this ticket* on *existing* functionality, particularly in related areas (if mentioned or implied in the description).
*Goal:* Ensure that implementing the described changes has not broken other, potentially pre-existing parts of the system hinted at in the description.
*Sub-Category Guidance:* Think about what *existing* functionalities might be affected by the *new* changes. If the description mentions interactions with other modules, data impacts, or modifies shared components, derive tests to verify those related areas remain stable. **CRITICAL:** Do *not* simply duplicate the Functional tests. Aim for tests verifying stability *around* the changes. If the description *only* details the new feature with no context of related existing features, deriving distinct regression tests might be limited – use placeholders in that case. Place results under the corresponding bold Title Case label.
h2. Regression Test Cases
*Happy Cases*
- (_Generate specific bullet points (-) focused on verifying related existing functionality remains unaffected, based *only* on description/implications, or use placeholder_)
*Alternative Cases*
- (_Generate specific bullet points (-) focused on verifying related existing functionality handles alternative scenarios correctly after the change, based *only* on description/implications, or use placeholder_)
*Negative Cases*
- (_Generate specific bullet points (-) focused on verifying related existing functionality handles errors correctly after the change, based *only* on description/implications, or use placeholder_)
*Edge Cases*
- (_Generate specific bullet points (-) focused on verifying related existing functionality handles edge cases correctly after the change, based *only* on description/implications, or use placeholder_)

--- Non-Functional Test Cases Instructions ---
*Focus:* Verify quality attributes *other than* core feature logic, but *only if* such requirements are mentioned or clearly implied in the description.
*Goal:* Ensure aspects like performance, security, usability, reliability meet any criteria specified or hinted at in the description.
*Sub-Category Guidance:* Look explicitly for terms or descriptions related to: performance (e.g., response time, load capacity, speed), security (e.g., permissions, data access, encryption), usability (e.g., ease of use, accessibility - often hard from text alone), reliability (e.g., error handling robustness, uptime). If the description contains *no* information related to these aspects, use the placeholder for all sub-categories. Place results under the corresponding bold Title Case label.
h2. Non-Functional Test Cases
*Happy Cases*
- (_Generate specific bullet points (-) for non-functional aspects based *only* on description, or use placeholder_)
*Alternative Cases*
- (_Generate specific bullet points (-) for non-functional aspects based *only* on description, or use placeholder_)
*Negative Cases*
- (_Generate specific bullet points (-) for non-functional aspects based *only* on description, or use placeholder_)
*Edge Cases*
- (_Generate specific bullet points (-) for non-functional aspects based *only* on description, or use placeholder_)

**Test Objective Format (Within Applicable Sub-Categories):**
Present individual test objectives clearly using Jira wiki markup bullet points.
- Phrase each objective concisely using the pattern: *Verify [Action or Condition] results in [Expected Outcome].* Use a new bullet point (-) for each distinct objective. Bullet points below a bold line will be indented naturally in Jira.

**Input Description Formatting Notes (If Applicable):**
If the 'Description' field below contains raw formatting (e.g., \`!...\`, \`{color:...}\`):
* **Ignore Visuals/Markup:** Rely solely on the readable text content. Disregard image placeholders and formatting tags.
* **Assume Standard Interaction:** Interpret requirements based on standard user interactions unless explicitly stated otherwise.

**Jira Ticket Information (Input Data):**

\${description}

**Final Check:** Before outputting, mentally review: Is the output *only* Jira wiki markup? Does it start with \`h2. Functional Test Cases\`? Are *all three* \`h2\` sections present? Does each \`h2\` section contain *all four* required sub-category labels? **Critically verify every single sub-category label uses the bold format with Title Case content (e.g., \`*Happy Cases*\`, \`*Alternative Cases*\`) and NOT ALL CAPS.** Does the content strictly adhere to the provided description and the specific instructions for each test type? Are placeholders used correctly? Is duplication between Functional/Regression avoided where possible based *only* on the description?
`;


export const jiraCsvConversionPromptTemplate = `You are an expert QA Engineer acting as a data transformation tool. Your task is to convert a list of test case summaries into a detailed JSON structure, based **only** on the provided inputs.

**Inputs:**
1.  **Feature Description (description):** Provides the overall context, user roles, goals, and functionality. Use this for background details ONLY when expanding the summaries. Do not invent details not supported by the description or summary.
2.  **Existing Test Case Summaries (testCases):** A list of strings, where each string is a test case title or summary.

**Core Requirement: Filtered One-to-One Mapping**
* You **MUST** iterate through **every single summary** provided in the input \`testCases\` list.
* Summaries exactly matching "_No specific tests derivable from the description for this sub-category._" (including the underscores) **MUST BE IGNORED** and should **NOT** result in an output array.
* **Each summary** that is **NOT** the ignored placeholder text must result in **exactly one** detailed test case (one inner array) in the output JSON.
* The total number of inner arrays in the final JSON output **MUST BE IDENTICAL** to the number of summaries in the input \`testCases\` list **excluding** any summaries that matched the ignored placeholder text. **NO EXCEPTIONS. DO NOT SKIP OR MERGE ANY OTHER SUMMARIES.**

**Task Breakdown (Follow these steps precisely):**
1.  Initialize an empty list that will hold the final JSON output array.
2.  Carefully read the Feature Description (\`description\`) to understand the context.
3.  Iterate through the input \`testCases\` list, processing **one summary at a time** in the order provided.
4.  For the **current summary** being processed:
    a.  **Check:** Compare the current summary string *exactly* against "_No specific tests derivable from the description for this sub-category._".
    b.  **Skip if Placeholder:** If the summary **matches** the placeholder text, **immediately stop processing this summary, do NOT create an output array for it,** and proceed to the next summary in the \`testCases\` list.
    c.  **Process if Valid:** If the summary does **NOT** match the placeholder text, proceed with the following steps:
        i.  Create a new inner array representing **one single detailed test case**.
        ii. Populate the 15 required fields for this inner array (as defined below) in the specified order.
        iii. Use the **current summary** text directly for the 'Description/Summary' field (field 4). Refine slightly if necessary for clarity, but ensure it reflects the original summary. **MUST NOT BE BLANK.**
        iv. Use the Feature Description (\`description\`) context to help infer appropriate values for the other fields ('Type', 'TC_category', 'Priority', 'As (Actor)', 'Given', 'When', 'Then', 'EST(mins)').
        v.  **Fallback:** If specific details for 'Given', 'When', 'Then', 'Actor', etc., cannot be reliably inferred for the *current valid summary* even with the description's context, make reasonable, concise assumptions based on the summary's likely intent to complete the fields. **Crucially, still generate the test case entry for this summary.** Do not skip it. For 'Type', default to "Functional" if unsure. For 'Priority', default to "Medium". For 'EST(mins)', default to 5.
        vi. Ensure the 'Test Case ID' (field 1) is unique for each generated test case (e.g., using sequential numbering like "TC-001", "TC-002" based on the count of *valid* processed summaries).
        vii. Ensure fields 12 ('Result(latest)'), 14 ('Date Run'), and 15 ('Notes') are always empty strings ("").
        viii. Append the completed inner array (representing the valid test case derived from the *current summary*) to the output list you initialized in step 1.
5.  After attempting to process **ALL** summaries from the input \`testCases\` list, ensure the final output list contains exactly the same number of inner arrays as there were *valid* (non-placeholder) summaries in the input.
6.  Format the entire output list **strictly** as a JSON array of arrays.

**Required Fields & Order within each inner array:**

1.  **Test Case ID:** (String) Unique identifier (e.g., "TC-001", "TC-002", ...). **MUST BE UNIQUE.**
2.  **Feature:** (String) Main feature name (from description).
3.  **User Story Id:** (String) From description if available, else "".
4.  **Description/Summary:** (String) Use/refine the corresponding *valid* summary from \`testCases\`. **MUST NOT BE BLANK.**
5.  **Type:** (String) "Functional", "Regression", "Non-Functional". Infer from summary/description context. Default: "Functional".
6.  **TC_category:** (String) "Happy Case", "Alternative Case", "Negative Case", "Edge Case". Infer from summary/description context.
7.  **Priority:** (String) "High", "Medium", "Low". Infer from summary/description context. Default: "Medium".
8.  **As (Actor):** (String) User role (from description).
9.  **Given (Precondition):** (String) Setup details (from summary/description context). Use "\\n" for newlines if needed.
10. **When (Action):** (String) Action steps (from summary/description context). Use "\\n" for newlines if needed.
11. **Then (Expected Result):** (String) Expected outcome (from summary/description context). Use "\\n" for newlines if needed.
12. **Result(latest):** (String) Always "".
13. **EST(mins):** (Integer or String) Estimated minutes. Default: 5. Convert to integer if possible, otherwise keep as string "5".
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
  // ... more inner arrays would follow here, one for each *valid* (non-placeholder) input summary ...
]
\`\`\`

**Output Format Requirements:**
* The final output MUST be a valid JSON array of arrays.
* Each inner array MUST contain the 15 fields in the exact order specified above.
* String values MUST be correctly JSON escaped (e.g., newlines as "\\n", double quotes as '\\"'). Ensure numbers like EST(mins) are output as JSON numbers, not strings, where possible (default 5, not "5").
* Return ONLY the JSON output. No explanations, comments, or markdown code blocks like \`\`\`json ... \`\`\`.

**Final Check:** Before outputting, double-check that the number of inner arrays precisely matches the number of summaries in the input \`testCases\` list **excluding** any summaries that exactly matched "_No specific tests derivable from the description for this sub-category._".

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