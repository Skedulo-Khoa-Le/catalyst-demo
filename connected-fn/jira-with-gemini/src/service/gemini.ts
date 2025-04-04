
import { GEMINI_MODEL } from '../constant';
import {
  addAttachmentToIssue,
  convertToJiraTableComment,
  generateStructuredInstructions,
} from './jira';

interface RequestGeminiEarlyResult {
  issueKey: string;
  structuredText: string | null;
}
export async function requestGemini({
  description,
  issueKey,
}: {
  description: string;
  issueKey: string;
}): Promise<RequestGeminiEarlyResult> {
  const modelName = GEMINI_MODEL;
  console.log(`[Main ${issueKey}] Starting Step 1...`);

  const step1Result = await generateStructuredInstructions(
    description,
    modelName,
  );

  if (step1Result.error || !step1Result.textResponse) {
    console.error(`[Main ${issueKey}] Step 1 failed. Returning error.`);
    return {
      issueKey: issueKey,
      structuredText: null,
    };
  }

  const earlyResult: RequestGeminiEarlyResult = {
    issueKey: issueKey,
    structuredText: step1Result.textResponse,
  };

  console.log(
    `[Main ${issueKey}] Step 1 successful. Returning structured text early.`,
  );

  // Use IIAFE as background tasks
  (async () => {
    try {
      console.log(
        `[Background ${issueKey}] Starting Step 2 (CSV Generation)...`,
      );

      const step2Result = await convertToJiraTableComment(
        step1Result.textResponse!,
        description,
        modelName,
      );

      if (step2Result.csvResponse && !step2Result.error) {
        try {
          console.log(
            `[Background ${issueKey}] Step 2 successful. Starting Step 3 (Jira Attachment)...`,
          );

          await addAttachmentToIssue(step2Result.csvResponse, issueKey);
          console.log(
            `[Background ${issueKey}] Step 3 completed successfully.`,
          );

          console.log('-------RUN INFO------');
          console.log('Issue Key:', issueKey);
          console.log('Step 1 Token', step1Result.tokenCount);
          console.log('Step 2 Token', step2Result.tokenCount);
          console.log(
            'Total Token',
            step1Result.tokenCount + step2Result.tokenCount,
          );
          console.log('---------------------');
        } catch (step3Error) {
          console.error(
            `[Background ${issueKey}] Error during Step 3 (addAttachmentToIssue):`,
            step3Error,
          );
        }
      } else {
        console.error(
          `[Background ${issueKey}] Step 2 failed or returned no CSV. Skipping Step 3. Error: ${step2Result.error}`,
        );
      }
    } catch (step2Error) {
      console.error(
        `[Background ${issueKey}] Error during Step 2 (convertToJiraTableComment):`,
        step2Error,
      );
    }
  })();

  // Return the result early
  return earlyResult;
}
