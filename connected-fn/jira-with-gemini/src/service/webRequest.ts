import * as dotenv from "dotenv";
import * as FormData from "form-data";
import fetch, { Response } from "node-fetch";
import { Readable } from "stream";
dotenv.config();

export interface WebRequestOptions {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

export interface FileUploadStringOptions {
  csvString: string;
  filename: string;
  url: string;
  headers?: Record<string, string>;
}

export class WebRequestService {
  static async makeRequest(options: WebRequestOptions): Promise<Response> {
    const baseUrl = process.env.BASE_JIRA_URL || "";
    const { url, method, headers, body } = options;

    try {
      const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.ATLASSIAN_MAIL}:${process.env.ATLASSIAN_TOKEN}`
          ).toString("base64")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          ...headers,
        },
        body: body,
      });

      return response;
    } catch (error) {
      console.error("Error making web request:", error);
      throw error;
    }
  }

  static async uploadFileFromString(
    options: FileUploadStringOptions
  ): Promise<Response> {
    const baseUrl = process.env.BASE_JIRA_URL || "";
    const { csvString, filename, url, headers } = options;

    try {
      const form = new FormData();

      const csvStream = Readable.from([csvString]);

      form.append("file", csvStream, {
        filename,
        contentType: "text/csv",
        knownLength: Buffer.byteLength(csvString),
      });
      const response = await fetch(`${baseUrl}${url}`, {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.ATLASSIAN_MAIL}:${process.env.ATLASSIAN_TOKEN}`
          ).toString("base64")}`,
          "X-Atlassian-Token": "no-check",
          Accept: "application/json",
          ...headers,
          ...form.getHeaders(),
        },
      });

      return response;
    } catch (error) {
      console.error("Error making web request:", error);
      throw error;
    }
  }
}
