import { GEMINI_MODEL } from "../constant";
import { addAttachmentToIssue, addCommentToIssue, convertToJiraTableComment, generateStructuredInstructions, getIssueTicket } from "./jira";

export async function requestGemini({
  issueKey,
}: {
  issueKey: string;
}): Promise<any> {
  const modelName = GEMINI_MODEL;

  console.log(`[${issueKey}] Starting Step 0...`);
  const step0Result = await getIssueTicket(issueKey,2);
  const description = step0Result.data?.fields?.description;

  if (step0Result.error || !step0Result.statusText || !description) {
    return {
      error: `[${issueKey}] Step 0 failed. Error: ${
        step0Result.error ?? "No description"
      }`,
    };
  }

  console.log(`[${issueKey}] Starting Step 1...`);

  const step1Result = await generateStructuredInstructions(
    description,
    modelName
  );

  if (step1Result.error || !step1Result.textResponse) {
    return {
      error: `[${issueKey}] Step 1 failed. Error: ${step1Result.error}`,
    };
  }
  console.log(`[${issueKey}] Starting Step 1.5 (Adding Comment)...`);

  const commentResult = await addCommentToIssue(
    step1Result.textResponse,
    issueKey,
    2
  );

  if (commentResult.error) {
    return {
      error: `[${issueKey}] Step 1.5 failed. Error: ${commentResult.error}`,
    };
  }

  console.log(`[${issueKey}] Starting Step 2 (CSV Generation)...`);

  const step2Result = await convertToJiraTableComment(
    step1Result.textResponse!,
    description,
    modelName
  );

  if (step2Result.error || !step2Result.csvResponse) {
    return {
      error: `[${issueKey}] Step 2 failed or returned no CSV. Error: ${step2Result.error}`,
    };
  }

  console.log(`[${issueKey}] Starting Step 3 (Attach CSV to Jira)...`);

  const step3Result = await addAttachmentToIssue(
    issueKey,
    step2Result.csvResponse
  );

  if (step3Result.error) {
    return {
      error: `[${issueKey}] Step 3 failed or returned no CSV. Error: ${step3Result.error}`,
    };
  } else console.log(`[ ${issueKey}] Step 3 completed successfully.`);

  console.log("-------RUN INFO------");
  console.log("Issue Key:", issueKey);
  console.log("Step 1 Token", step1Result.tokenCount);
  console.log("Step 2 Token", step2Result.tokenCount);
  console.log("Total Token", step1Result.tokenCount + step2Result.tokenCount);
  console.log("---------------------");
  return { success: true };
}
