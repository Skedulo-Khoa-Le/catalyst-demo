/**
 * Describe the entry-point into the "skedulo-function" by updating the
 * array returned by the `getRoutes` method with additional routes
 */
import { FunctionRoute } from "@skedulo/sdk-utilities";
import * as pathToRegExp from "path-to-regexp";
import onJobFeedBackInserted from "./handlers/onJobFeedBackInserted";

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
          body: { result: "pong", apiServer },
        };
      },
    },
    {
      method: "post",
      path: "/action",
      handler: async (
        body: RequestPayload,
        headers,
        method,
        path,
        skedContext
      ) => {
        const apiServer = skedContext?.auth.baseUrl;

        const userName = skedContext?.userContext.username;

        return {
          status: 200,
          body: { apiServer, userName, requestBody: body },
        };
      },
    },
    {
      method: "post",
      path: "/onJobFeedBackInserted",
      handler: async (
        body: RequestPayload,
        headers,
        method,
        path,
        skedContext
      ) => {
        if (!skedContext) {
          return {
            status: 400,
            body: { error: "Invalid skedContext" },
          };
        }
        return await onJobFeedBackInserted(body, skedContext);
      },
    },
  ];
}
