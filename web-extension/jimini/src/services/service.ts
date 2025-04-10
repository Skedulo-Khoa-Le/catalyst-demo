import { SkedContext } from "@skedulo/function-utilities";
import { ExecutionContext } from "@skedulo/pulse-solution-services";

export const context = (skedContext: SkedContext) =>
  ExecutionContext.fromContext(skedContext, {
    requestSource: "jimini",
    userAgent: "jimini",
  });
