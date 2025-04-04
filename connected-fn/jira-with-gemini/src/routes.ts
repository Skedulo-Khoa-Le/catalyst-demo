/**
 * Describe the entry-point into the "skedulo-function" by updating the
 * array returned by the `getRoutes` method with additional routes
 */
import { FunctionRoute } from "@skedulo/sdk-utilities";
import * as pathToRegExp from "path-to-regexp";
import { requestGemini } from "./service/gemini";

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
        const description = body?.issue.fields?.description;
        const issueKey = body?.issue.key;
        const result = await requestGemini({ description, issueKey });

        return {
          status: 200,
          body: result,
        };
      },
    },
  ];
}
