export const basePromptTemplate = `Generate structured test instructions based *solely* on the Jira ticket information provided below.

**Direct Output Requirement:**
* Do not include any introductory phrases, acknowledgements (like "Okay, I got it"), or conversational text.
* Format the *entire* output using Jira wiki markup syntax so it can be directly pasted into a Jira ticket and render correctly. Your response *must* begin directly with the first \`h2.\` heading.

**Required Output Structure (Using Jira Wiki Markup):**
Please organize the test instructions into the following distinct sections using Jira headings. Aim to place each specific verification point in the *most appropriate* section to minimize redundancy.

h2. Functional Test Cases
Generate test cases that directly verify the *existence* and *basic capability* of features or components explicitly mentioned in the ticket's requirements or acceptance criteria. Focus on confirming that necessary elements (buttons, fields, links) are present and can be interacted with as intended at a basic level. **Avoid detailing specific outcomes related to valid/invalid data here** – those belong in the Positive/Negative sections below.
* *Goal:* Does the feature/component exist and basically function as required?

h2. Positive Test Cases
Generate test cases focusing *exclusively* on the "happy path" scenarios and successful outcomes. Verify that using *valid inputs* and performing standard user actions (as described or implied) leads to the expected successful result. **Assume the basic functional components exist (covered in Functional). Do not repeat basic existence checks.**
* *Goal:* Does the feature work correctly with expected, valid usage?

h2. Negative Test Cases
Generate test cases focusing *exclusively* on error handling, robustness, edge cases, and boundary conditions. Verify the system's correct behavior (e.g., showing specific error messages, preventing invalid actions, handling empty/invalid/boundary inputs) when encountering unexpected or invalid scenarios. **Assume the basic functional components exist. Do not repeat functional checks or positive path outcomes.**
* *Goal:* Does the feature handle errors, invalid input, and edge cases gracefully?

**Test Objective Format (Within Each Section):** 
Present individual test objectives clearly using Jira wiki markup.
* Use bullet points (-) for each distinct test objective on a new line.
* Phrase each objective concisely using the pattern: *Verify [Action or Condition] results in [Expected Outcome].*

*Example Test Objective Structure:* 
- Verify logging in with valid username and password redirects the user to their dashboard.
- Verify submitting the form with the 'Email' field left empty displays an inline validation error message "Email is required" below the email field and prevents form submission.
- Verify clicking the 'Cancel' button on the edit profile page discards changes and returns the user to the profile view page without saving.

**Minimize Redundancy:** // Added explicit instruction block
While related, ensure each test case primarily fits the specific goal of its section (Functional: Existence/Capability based on requirements; Positive: Success with valid data; Negative: Handling of invalid data/errors). **Actively avoid stating the exact same verification point in multiple sections.** If a test could arguably fit in more than one, place it in the section that best represents its *primary* purpose (e.g., checking a specific error message belongs in Negative, even though error handling is part of overall functionality).

**IMPORTANT NOTE ON DESCRIPTION FORMAT (If Applicable):**
If the 'Description' field provided below contains raw formatting (e.g., \`!AD_...\`, \`!image-...\`, \`{color:...}\`), please be aware:
* **Ignore Image Placeholders:** You cannot see images. Rely solely on surrounding text.
* **Ignore Markup:** Disregard tags like \`{color:...}\`, focus on text content.
* **Extract from Readable Text:** Your goal is to understand requirements from the readable text despite formatting issues. Assume standard user interactions (e.g., clicking buttons, entering text into fields) unless specified otherwise in the description.

**Jira Ticket Information (Input Data):**

\${description}

**Final Output:**
Ensure the generated test objectives are accurate based *only* on the readable textual information provided in the input data, are well-organized using Jira wiki markup (headers, lists), concise, follow the "Verify..." format, **clearly differentiated based on the refined section definitions above with minimal redundancy,** and are ready for a QA tester to execute as a checklist after pasting directly into Jira. Do not invent requirements or functionalities not explicitly mentioned.`;
export const jiraCsvConversionPromptTemplate = `You are an expert QA Engineer tasked with generating detailed test cases based **only** on a provided list of summaries. You will be given a high-level feature description for context and a list of existing test case summaries. Your goal is to expand **each** summary into **exactly one** detailed test case. **Do not add any test cases that are not directly derived from a summary in the input list.**

**Inputs:**
1.  **Feature Description (\${description}):** Provides the overall context, user roles, goals, and functionality of the feature. Use this for background details when expanding the summaries.
2.  **Existing Test Case Summaries (\${testCases}):** A list of test case titles or summaries. **Each summary in this list must result in exactly one detailed test case in the output.**

**Task:**
1.  Analyze the Feature Description (\${description}) to understand the context, actors, workflows, and requirements relevant to the provided summaries.
2.  Review the Existing Test Case Summaries (\${testCases}).
3.  For **each summary** in \${testCases}, create **exactly one** detailed test case. Use the summary as the basis for the 'Description/Summary' field and leverage the \${description} to generate appropriate details for 'Type', 'Priority', 'As (Actor)', 'Given (Precondition)', 'When (Action)', and 'Then (Expected Result)'.
4.  Ensure the total number of detailed test cases generated in the output JSON array is **identical** to the number of summaries provided in the \${testCases} input.
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
