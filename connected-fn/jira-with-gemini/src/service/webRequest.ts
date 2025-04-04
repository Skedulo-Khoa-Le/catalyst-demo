
import * as FormData from 'form-data';
import fetch from 'node-fetch';
import { Readable } from 'stream';
import * as dotenv from "dotenv";
dotenv.config();

export interface WebRequestOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
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
  static async makeRequest(options: WebRequestOptions): Promise<any> {
    const baseUrl = process.env.BASE_JIRA_URL || '';
    const { url, method, headers, body } = options;

    try {
      const response = await fetch(`${baseUrl}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseText = await response.text();
      console.log(`Response: ${response.status} ${response.statusText}`);
      return responseText;
    } catch (error) {
      console.error('Error making web request:', error);
      throw error;
    }
  }

  static async uploadFileFromString(options: FileUploadStringOptions): Promise<{
    status: string;
    statusText: string;
    error?: string;
  }> {
    const baseUrl = process.env.BASE_JIRA_URL || '';
    const { csvString, filename, url, headers } = options;

    try {
      const form = new FormData();

      const csvStream = Readable.from([csvString]);

      form.append('file', csvStream, {
        filename,
        contentType: 'text/csv',
        knownLength: Buffer.byteLength(csvString),
      });
      const response = await fetch(`${baseUrl}${url}`, {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `Basic ${Buffer.from(`khoa.le@skedulo.com:${process.env.ATLASSIAN_TOKEN}`).toString('base64')}`,
          'X-Atlassian-Token': 'no-check',
          Accept: 'application/json',
          ...headers,
          ...form.getHeaders(),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          status: response.status.toString(),
          statusText: response.statusText,
          error: errorText,
        };
      }

      return { status: response.status.toString(), statusText: response.statusText };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        status: '500',
        statusText: 'Internal Server Error',
        error: (error as Error).message || 'Unknown error',
      };
    }
  }
}
