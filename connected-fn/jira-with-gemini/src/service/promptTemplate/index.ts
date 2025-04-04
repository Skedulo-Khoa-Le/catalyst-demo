export const basePromptTemplate = `Generate structured test instructions based *solely* on the Jira ticket information provided below in the \${description} variable.

**Direct Output Requirement:**
* Do not include any introductory phrases, acknowledgements (like "Okay, I got it"), or conversational text.
* Format the *entire* output using Jira wiki markup syntax so it can be directly pasted into a Jira ticket and render correctly. Your response *must* begin directly with the first \`h2.\` heading.

**Required Output Structure (Using Jira Wiki Markup):**
Please organize the test instructions into the following distinct sections using Jira headings:

h2. Functional Test Cases
Create test objectives to verify that the core functionality and acceptance criteria described within the ticket's description work as intended.

h2. Positive Test Cases
Develop test objectives focusing on the "happy path" scenarios – using expected valid inputs and performing typical user actions to achieve successful outcomes, based on the described functionality.

h2. Negative Test Cases
Design test objectives to check robustness and error handling. Include scenarios with invalid inputs, boundary conditions, unexpected user actions, potential error states, and edge cases related to the described functionality.

**Test Objective Format (Within Each Section):**
Present individual test objectives clearly using Jira wiki markup.
* Use bullet points (-) for each distinct test objective on a new line.
* Phrase each objective concisely using the pattern: *Verify [Action or Condition] results in [Expected Outcome].*

*Example Test Objective Structure:*
- Verify logging in with valid username and password redirects the user to their dashboard.
- Verify submitting the form with the 'Email' field left empty displays an inline validation error message "Email is required" below the email field and prevents form submission.
- Verify clicking the 'Cancel' button on the edit profile page discards changes and returns the user to the profile view page without saving.

**IMPORTANT NOTE ON DESCRIPTION FORMAT (If Applicable):**
If the 'Description' field provided below contains raw formatting (e.g., \`!AD_...\`, \`!image-...\`, \`{color:...}\`), please be aware:
* **Ignore Image Placeholders:** You cannot see images. Rely solely on surrounding text.
* **Ignore Markup:** Disregard tags like \`{color:...}\`, focus on text content.
* **Extract from Readable Text:** Your goal is to understand requirements from the readable text despite formatting issues. Assume standard user interactions (e.g., clicking buttons, entering text into fields) unless specified otherwise in the description.

**Jira Ticket Information (Input Data):**

\${description}

**Final Output:**
Ensure the generated test objectives are accurate based *only* on the readable textual information provided in the input data, are well-organized using Jira wiki markup (headers, lists), concise, follow the "Verify..." format, and are ready for a QA tester to execute as a checklist after pasting directly into Jira. Do not invent requirements or functionalities not explicitly mentioned.`;
export const jiraCsvConversionPromptTemplate = `You are an expert QA Engineer tasked with generating comprehensive and effective test cases. You will be given a high-level feature description and a list of existing test case summaries. Your goal is to expand each summary into a detailed test case, using the feature description for context, and potentially identify and add any missing test cases crucial for full coverage.

**Inputs:**
1.  **Feature Description (\${description}):** Provides the overall context, user roles, goals, and functionality of the feature.
2.  **Existing Test Case Summaries (\${testCases}):** A list of test case titles or summaries that outline required areas of verification.

**Task:**
1.  Analyze the Feature Description (\${description}) to understand the context, actors, workflows, and requirements.
2.  Review the Existing Test Case Summaries (\${testCases}). Each summary represents a verification point that needs to be detailed.
3.  For **each summary** in \${testCases}, create **at least one** detailed test case. Use the summary as the basis for the 'Description/Summary' field and leverage the \${description} to generate appropriate details for 'Type', 'Priority', 'As (Actor)', 'Given (Precondition)', 'When (Action)', and 'Then (Expected Result)'.
4.  If the \${testCases} seems incomplete based on the \${description}, generate **additional** test cases (e.g., crucial negative scenarios, edge cases) not explicitly listed in the summaries to ensure comprehensive coverage.
5.  Format the entire output **strictly** as a JSON array of arrays. Each inner array represents one detailed test case and must contain the field values in the exact order specified below.

**Required Fields & Order within each inner array:**

1.  **Test Case ID:** (String) Generate a unique identifier for each test case (e.g., "TC-FEATURE-001", "TC-001").
2.  **Feature:** (String) Identify the main feature being tested, based on the \${description}.
3.  **User Story Id:** (String) If a User Story ID is mentioned or implied in the \${description}, include it. Otherwise, leave this field as an empty string ("").
4.  **Description/Summary:** (String) Use or refine the corresponding summary from \${testCases}. For any *additional* test cases generated, write a concise summary. **CRITICAL:** DO NOT LEAVE BLANK.
5.  **Type:** (String) Categorize the test case (e.g., "Functional", "Positive", "Negative", "Usability", "Security", "Performance"). Infer from the summary and the \${description}.
6.  **Priority:** (String) Assign a priority level (e.g., "High", "Medium", "Low") based on the importance derived from the summary and \${description}.
7.  **As (Actor):** (String) Specify the user role or actor performing the test (e.g., "Registered User", "Scheduler", "System"). Infer from the \${description}.
8.  **Given (Precondition):** (String) Detail the necessary setup or preconditions based on the summary and \${description}. Use bullet points or numbered lists within the string if needed (e.g., "- Scheduler is logged in\\n- An ACH Job ID 123 exists").
9.  **When (Action):** (String) Detail the specific actions taken by the actor based on the summary and \${description}. Use bullet points or numbered lists within the string if needed (e.g., "- User navigates to Job ID 123\\n- User clicks 'Allocate Resource'").
10. **Then (Expected Result):** (String) Describe the specific expected outcome based on the summary and \${description}. Be specific and measurable. Use bullet points or numbered lists within the string if needed (e.g., "- The Allocation Modal for Job ID 123 is displayed\\n- The modal shows 'Available Resources' section").
11. **Result(latest):** (String) Leave this field as an empty string ("").
12. **EST(mins):** (Integer or String) Provide a rough estimate of the time required (e.g., 1, 2, 5).
13. **Date Run:** (String) Leave this field as an empty string ("").
14. **Notes:** (String) Include any relevant notes, assumptions, or mention if this test case was derived directly from a summary or added for coverage. If none, leave as an empty string ("").

**Output Format Requirements:**
* The final output MUST be a valid JSON array.
* Each element in the main array MUST be another array containing the 14 fields in the exact order specified above.
* String values within the JSON must be correctly escaped (e.g., newlines as "\\n", double quotes as '\\"'). Ensure valid JSON syntax.
* Return ONLY the JSON output. Do not include any introductory text, explanations, or markdown code blocks like \`\`\`json ... \`\`\`.

**Example Snippet (Illustrative - showing how one summary *could* be expanded):**

* If description mentioned a 'Scheduler' role handling 'ACH Jobs' via an 'Allocation Modal'...
* And testCases contained: \`- Verify the Allocation Modal is displayed for ACH jobs.\`
* A possible corresponding entry in the output JSON array should be:

    \`\`\`json
    [
      [
        "TC-ALLOC-001",
        "Job Allocation",
        "US-500",
        "Verify the Allocation Modal is displayed for ACH jobs.",
        "Functional",
        "High",
        "Scheduler",
        "- User is logged in as a Scheduler\\n- At least one ACH Job exists in the system",
        "- User navigates to the Job scheduling view\\n- User selects a specific ACH Job record",
        "- The Allocation Modal specific to the selected ACH job is displayed promptly\\n- Key sections like 'Available Resources' and 'Offers' are visible within the modal",
        "",
        2,
        "",
        "Derived from summary list. Verify modal elements match specs."
      ]
      // ... other test cases derived from summaries or added by the AI ...
    ]
    \`\`\`

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
