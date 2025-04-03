import { SkedContext } from "@skedulo/function-utilities";
import { FunctionPayload } from "@skedulo/sdk-utilities";
import axios from "axios";
import * as dotenv from "dotenv";
import { context } from "../services";
import { SmsResponse } from "@skedulo/pulse-solution-services";

dotenv.config();

type Body = {
  data: {
    schemaJobFeedBack: {
      data: {
        UID?: string;
        Note?: string;
      };
      operation?: string;
      timestamp?: string;
    };
  };
}[];

export default async (
  body: FunctionPayload["body"],
  skedContext: SkedContext
) => {
  const jobFeedbackId = (body as Body)[0].data.schemaJobFeedBack.data.UID;
  
  const jobFeedbackBuilder = context(skedContext)
    .newQueryBuilder({
      objectName: "JobFeedBack",
      operationName: "fetchJobFeedBack",
      readOnly: true,
    })
    .withFilter(`UID == '${jobFeedbackId}'`);

  jobFeedbackBuilder
    .withChildQuery("Job")
    .withChildQuery("Contact")
    .withFields(["FullName", "MobilePhone", "Region { CountryCode }"]);

  jobFeedbackBuilder.withChildQuery("FeedbackGiver").withFields(["Name"]);

  const jobFeedback = await jobFeedbackBuilder.execute();

  const jobFeedbackRecord = jobFeedback.records[0];
  const contact = jobFeedbackRecord.Job.Contact;
  const feedbackGiver = jobFeedbackRecord.FeedbackGiver;
  const note = (body as Body)[0].data.schemaJobFeedBack.data.Note;

  const contactName = contact.FullName;
  const countryCode = contact.Region?.CountryCode ?? "US";
  const phoneNumber = contact.MobilePhone ?? "+19736499320";
  const feedBackGiverName = feedbackGiver.Name;

  const template = `${contactName}: You have a feedback from ${feedBackGiverName} with the note that: ${note}`;


  const result: SmsResponse = await context(
    skedContext
  ).mobileNotificationClient.sendSms({
    phoneNumber: phoneNumber,
    countryCode: countryCode,
    message: template,
    expectsReply: false,
  });
  
  if (!result.success) {
    return {
      status: 401,
      body: { error: `Failed to send SMS` },
    };
  }

  return {
    status: 200,
    body: { message: "SMS sent successfully" },
  };
};
