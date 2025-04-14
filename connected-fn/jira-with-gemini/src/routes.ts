/**
 * Describe the entry-point into the "skedulo-function" by updating the
 * array returned by the `getRoutes` method with additional routes
 */
import { FunctionRoute } from "@skedulo/sdk-utilities";
import * as pathToRegExp from "path-to-regexp";
import { requestGemini } from "./service/gemini";
import { getIssuesList } from "./service/jira";

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

        const result = await requestGemini({ issueKey });

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
        skedContext: any
      ) => {
        const {
          startAt = "0",
          maxResults = "50",
          projectBoard = "GT",
          query = "",
        } = body || {};
        const result = await getIssuesList({
          projectBoard,
          startAt: startAt,
          maxResults: maxResults,
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
        skedContext: any
      ) => {
        //TBD
        // const { startAt = "0", maxResults = "50", query = "" } = body || {};
        // const result = await getProjectsList({
        //   startAt: parseInt(startAt, 10),
        //   maxResults: parseInt(maxResults, 10),
        //   searchQuery: query,
        // });

        return {
          status: 200,
          body: {issues: ["GT", "SOLE", "ICQ", "ENG"], total: 4, error: null},
        };
      },
    },
  ];
}
