/**
 * Describe the entry-point into the "skedulo-function" by updating the
 * array returned by the `getRoutes` method with additional routes
 */
import { FunctionRoute } from "@skedulo/sdk-utilities";
import * as pathToRegExp from "path-to-regexp";
import { requestGemini } from "./service/gemini";
import { getIssuesList } from "./service/jira";
import { basePromptTemplate } from "./service/promptTemplate";
import { extractQueryParam } from "./utils/extractQueryParam";

// tslint:disable-next-line:no-empty-interface
interface RequestPayload {}

export function getCompiledRoutes() {
  return getRoutes().map((route) => {
    const regex = pathToRegExp(route.path);

    return {
      regex,
      method: route.method,
      handler: route.handler,
    };
  });
}

function getRoutes(): FunctionRoute[] {
  return [
    {
      method: "get",
      path: "/ping",
      handler: async (__, headers, method, path, skedContext) => {
        const apiServer = skedContext?.auth.baseUrl;
        return {
          status: 200,
          body: { result: "pong", apiServer: apiServer },
        };
      },
    },
    {
      method: "get",
      path: "/prompt",
      handler: async (__, headers, method, path, skedContext) => {
        return {
          status: 200,
          body: { prompt: basePromptTemplate },
        };
      },
    },
    {
      method: "post",
      path: "/gemini",
      handler: async (
        body: any,
        headers: { [key: string]: string },
        method: string,
        path: string,
        skedContext: any
      ) => {
        const issueKey = body?.issueKey;
        const prompt = body?.prompt;

        const result = await requestGemini({ issueKey, prompt });

        return {
          status: 200,
          body: result,
        };
      },
    },
    {
      method: "get",
      path: "/listTickets",
      handler: async (
        body: any,
        headers: { [key: string]: string },
        method: string,
        path: string,
        skedContext: any,
        query: any
      ) => {
        const startAt = extractQueryParam("startAt", query) || "0";
        const maxResults = extractQueryParam("maxResults", query) || "50";
        const projectBoard = extractQueryParam("projectBoard", query) || "";

        const result = await getIssuesList({
          projectBoard: projectBoard,
          startAt: parseInt(startAt, 10),
          maxResults: parseInt(maxResults, 10),
        });

        return {
          status: 200,
          body: result,
        };
      },
    },

    {
      method: "get",
      path: "/listProjects",
      handler: async (
        body: any,
        headers: { [key: string]: string },
        method: string,
        path: string,
        skedContext: any,
        query: any
      ) => {
        //TBD
        // const startAt = query?.startAt || "0";
        // const maxResults = query?.maxResults || "50";
        // const searchQuery = query?.query || "";
        // const result = await getProjectsList({
        //   startAt: parseInt(startAt, 10),
        //   maxResults: parseInt(maxResults, 10),
        //   searchQuery: searchQuery,
        // });

        return {
          status: 200,
          body: { issues: ["GT", "SOLE", "ICQ", "ENG"], total: 4, error: null },
        };
      },
    },
  ];
}
