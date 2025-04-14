import { ExecutionContext } from "@skedulo/pulse-solution-services";

export const context = ExecutionContext.fromCredentials(
  {
    apiServer: import.meta.env.VITE_BASE_SKEDULO_URL || "",
    apiToken: import.meta.env.VITE_SKEDULO_API_KEY || "",
  },
  {
    requestSource: "Jimini",
    userAgent: "Jimini",
  }
);
