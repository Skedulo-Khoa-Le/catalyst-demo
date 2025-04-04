import { AI_CONFIG, ai } from "../constant";
import convertJiraTableToCSV from "./csv";
import {
  basePromptTemplate,
  jiraCsvConversionPromptTemplate,
} from "./promptTemplate";
import { WebRequestService } from "./webRequest";

export async function generateStructuredInstructions(
  description: string,
  modelName: string
): Promise<{
  textResponse: string | null;
  tokenCount: number;
  error: string | null;
}> {
  let textResponse: string | null = null;
  let tokenCount = 0;
  let error: string | null = null;

  try {
    const textPrompt = basePromptTemplate.replace(
      "${description}",
      description
    );
    const textContentsPayload = [
      { role: "user", parts: [{ text: textPrompt }] },
    ];

    const textResult = await ai.models.generateContent({
      model: modelName,
      contents: textContentsPayload,
      config: AI_CONFIG,
    });

    tokenCount = textResult?.usageMetadata?.totalTokenCount || 0;

    textResponse = textResult.text || null;

    if (!textResponse) {
      error = "Step 1 failed: No text response received from Gemini.";
    }
  } catch (err: any) {
    error = `[Step 1] Exception: ${err.message || String(err)}`;
  }

  return { textResponse, tokenCount, error };
}

export async function convertToJiraTableComment(
  testCases: string,
  description: string,
  modelName: string
): Promise<{
  csvResponse: string | null;
  tokenCount: number;
  error: string | null;
}> {
  let csvResponse: string | null = null;
  let tokenCount = 0;
  let error: string | null = null;

  try {
    const csvPrompt = jiraCsvConversionPromptTemplate
      .replace("${description}", description)
      .replace("${testCases}", testCases);

    const csvContentsPayload = [{ role: "user", parts: [{ text: csvPrompt }] }];

    const csvResult = await ai.models.generateContent({
      model: modelName,
      contents: csvContentsPayload,
      config: AI_CONFIG,
    });

    tokenCount = csvResult?.usageMetadata?.totalTokenCount || 0;

    csvResponse = csvResult.text?.trim() || null;

    if (!csvResponse) {
      error = "[Step 2] Failed: No CSV response received from Gemini.";
      console.warn(error);
    }
  } catch (err: any) {
    error = `[Step 2] Exception: ${err.message || String(err)}`;
    console.error(error, err);
  }

  return { csvResponse, tokenCount, error };
}

export async function addCommentToIssue(
  commentText: string,
  issueKey: string,
  apiVersion: number = 3
): Promise<{
  status: number | null;
  statusText: string | null;
  error: string | null;
}> {
  let status: number | null = null;
  let statusText: string | null = null;
  let error: string | null = null;

  try {
    if (!commentText) {
      error = "[Step 1.5] Error: Comment text is empty.";
      return { status: null, statusText: null, error };
    }

    const bodyData = JSON.stringify({
      body: commentText,
    });

    const response = await WebRequestService.makeRequest({
      url: `${apiVersion}/issue/${issueKey}/comment`,
      body: bodyData,
      method: "POST",
    });

    status = response.status || null;
    statusText = response.statusText || null;

    if (status !== 200 && status !== 201) {
      const responseData = await response.json().catch(() => ({}));
      error = `[Step 1.5] Error adding comment:${JSON.stringify(responseData)}`;
    }
  } catch (err: any) {
    error = `[Step 1.5] Exception: ${err.message || String(err)}`;
  }

  return { status, statusText, error };
}

export async function addAttachmentToIssue(
  issueKey: string,
  csvString: string,
  apiVersion: number = 3
): Promise<{
  status: number | null;
  statusText: string | null;
  error: string | null;
}> {
  let status: number | null = null;
  let statusText: string | null = null;
  let error: string | null = null;

  try {
    const csvOutput = convertJiraTableToCSV(csvString);

    if (!csvOutput) {
      error = "[Step 3] Error: CSV output is undefined.";

      return { status: null, statusText: null, error };
    }

    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const filename = `[${issueKey}]_${timestamp}.csv`;

    const response = await WebRequestService.uploadFileFromString({
      csvString: csvOutput,
      filename,
      url: `${apiVersion}/issue/${issueKey}/attachments`,
    });

    status = response.status || null;
    statusText = response.statusText || null;

    if (status !== 200 && status !== 201) {
      const responseData = await response.json().catch(() => ({}));
      error = `[Step 3] Error adding attachment: ${JSON.stringify(
        responseData
      )}`;
    }
  } catch (err: any) {
    error = `[Step 3] Exception: ${err.message || String(err)}`;
  }

  return { status, statusText, error };
}
