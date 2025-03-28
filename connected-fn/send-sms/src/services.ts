import { SkedContext } from "@skedulo/function-utilities";
import { ExecutionContext } from "@skedulo/pulse-solution-services";

export const context = (skedContext: SkedContext) =>
  ExecutionContext.fromContext(skedContext, {
    requestSource: "send-sms",
    userAgent: "send-sms-agent",
  });
