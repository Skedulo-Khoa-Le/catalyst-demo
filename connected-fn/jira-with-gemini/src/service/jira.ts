import { text } from "stream/consumers";
import { AI_CONFIG, ai } from "../constant";
import convertJiraTableToCSV from "./csv";
import {
  basePromptTemplate,
  jiraCsvConversionPromptTemplate,
} from "./promptTemplate";
import { WebRequestService } from "./webRequest";

export async function generateStructuredInstructions(
  description: string,
  modelName: string,
  prompt?: string
): Promise<{
  textResponse: string | null;
  tokenCount: number;
  error: string | null;
}> {
  let textResponse: string | null = null;
  let tokenCount = 0;
  let error: string | null = null;

  try {
    const textPrompt = (prompt ? prompt : basePromptTemplate).replace(
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
      error =
        "[GenerateStructuredInstructions] Failed: No text response received from Gemini.";
    }
  } catch (err: any) {
    error = `[GenerateStructuredInstructions] Exception: ${
      err.message || String(err)
    }`;
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
      error =
        "[ConvertToJiraTableComment] Failed: No CSV response received from Gemini.";
      console.warn(error);
    }
  } catch (err: any) {
    error = `[ConvertToJiraTableComment] Exception: ${
      err.message || String(err)
    }`;
    console.error(error, err);
  }

  return { csvResponse, tokenCount, error };
}
export async function getIssueTicket(
  issueKey: string,
  apiVersion: number = 3
): Promise<{
  status: number | null;
  statusText: string | null;
  data: any | null;
  error: string | null;
}> {
  let status: number | null = null;
  let statusText: string | null = null;
  let data: any | null = null;
  let error: string | null = null;

  try {
    if (!issueKey) {
      error = "[GetIssueTicket] Error: Issue key is empty.";
      return { status: null, statusText: null, data: null, error };
    }

    const queryParams = new URLSearchParams({
      fields: "description",
    }).toString();

    const response = await WebRequestService.makeRequest({
      url: `${apiVersion}/issue/${issueKey}?${queryParams}`,
      method: "GET",
    });

    status = response.status || null;
    statusText = response.statusText || null;

    if (status === 200) {
      data = await response.json().catch(() => null);
    } else {
      const responseData = await response.json().catch(() => ({}));
      error = `[GetIssueTicket] Error fetching issue: ${JSON.stringify(
        responseData
      )}`;
    }
  } catch (err: any) {
    error = `[GetIssueTicket] Exception: ${err.message || String(err)}`;
  }

  return { status, statusText, data, error };
}

export async function getIssuesList({
  projectBoard = "",
  maxResults = 100,
  startAt = 0,
  apiVersion = 3,
}: {
  projectBoard?: string;
  maxResults?: number;
  startAt?: number;
  apiVersion?: number;
} = {}): Promise<{
  issues: any[] | null;
  total: number | null;
  error: string | null;
}> {
  let status: number | null = null;
  let statusText: string | null = null;
  let issues: any[] | null = null;
  let total: number | null = null;
  let error: string | null = null;

  try {
    const queryParams = new URLSearchParams({
      jql: `project=${projectBoard}`,
      maxResults: maxResults.toString(),
      startAt: startAt.toString(),
    }).toString();

    const response = await WebRequestService.makeRequest({
      url: `${apiVersion}/search?${queryParams}`,
      method: "GET",
    });

    status = response.status || null;
    statusText = response.statusText || null;

    if (status === 200) {
      const responseData = await response.json().catch(() => null);
      if (responseData) {
        issues =
          (responseData as any)?.issues.map((issue: any) => issue.key) || [];
        total = (responseData as any)?.total || 0;
      }
    } else {
      const responseData = await response.json().catch(() => ({}));
      error = `[GetIssuesList] Error fetching issues: ${JSON.stringify(
        responseData
      )}`;
    }
  } catch (err: any) {
    error = `[GetIssuesList] Exception: ${err.message || String(err)}`;
  }

  return { issues, total, error };
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
      error = "[AddCommentToIssue] Error: Comment text is empty.";
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
      error = `[AddCommentToIssue] Error adding comment: ${JSON.stringify(
        responseData
      )}`;
    }
  } catch (err: any) {
    error = `[AddCommentToIssue] Exception: ${err.message || String(err)}`;
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
      error = "[AddAttachmentToIssue] Error: CSV output is undefined.";

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
      error = `[AddAttachmentToIssue] Error adding attachment: ${JSON.stringify(
        responseData
      )}`;
    }
  } catch (err: any) {
    error = `[AddAttachmentToIssue] Exception: ${err.message || String(err)}`;
  }

  return { status, statusText, error };
}

export async function getProjectsList({
  apiVersion = 3,
  startAt = 0,
  maxResults = 50,
  searchQuery,
  orderBy,
}: {
  apiVersion?: number;
  startAt?: number;
  maxResults?: number;
  searchQuery?: string;
  orderBy?: string;
} = {}): Promise<{
  projects: any[] | null;
  total: number | null;
  error: string | null;
}> {
  let projects: any[] | null = null;
  let total: number | null = null;
  let error: string | null = null;

  try {
    const queryParams = new URLSearchParams({
      startAt: startAt.toString(),
      maxResults: maxResults.toString(),
    });

    if (searchQuery) {
      queryParams.append("query", searchQuery);
    }

    if (orderBy) {
      queryParams.append("orderBy", orderBy);
    }

    const response = await WebRequestService.makeRequest({
      url: `${apiVersion}/project/search?${queryParams.toString()}`,
      method: "GET",
    });

    const status = response.status || null;
    const statusText = response.statusText || null;

    if (status === 200) {
      const responseData = await response.json().catch(() => null);
      if (responseData) {
        projects = (responseData.values || []).map(
          (project: { key: any }) => project.key
        );
        total = responseData.total || 0;
      }
    } else {
      const responseData = await response.json().catch(() => ({}));
      error = `[GetProjectsList] Error fetching projects: ${JSON.stringify(
        responseData
      )}`;
    }
  } catch (err: any) {
    error = `[GetProjectsList] Exception: ${err.message || String(err)}`;
  }

  return { projects, total, error };
}
