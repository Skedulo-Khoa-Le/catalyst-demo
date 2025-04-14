import { Button } from "@skedulo/sked-ui";
import { useGlobalLoading } from "../GlobalLoading";
import { makeRequest } from "@/services/webRequest";
import { useState } from "react";

function TicketSearch() {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading();

  const [issueKey, setIssueKey] = useState<string>("");

  async function fetchIssueTicket(issueKey: string) {
    startGlobalLoading();
    try {
      await makeRequest({
        url: `gemini`,
        method: "POST",
        body: JSON.stringify({
          issueKey: issueKey,
        }),
      }).then((response) => {
        console.log((response as any).json());
      });
    } catch (error) {
      console.error("Error fetching issue ticket:", error);
    } finally {
      endGlobalLoading();
    }
  }

  return (
    <div
      className="cx-app-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        gap: 16,
      }}
    >
      <header
        className="cx-app-header"
        style={{
          marginBottom: "16px",
          width: "100%",
          textAlign: "center",
          padding: "16px 0",
        }}
      >
        <h1
          className="cx-app-title"
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#333",
            margin: 0,
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Jimini
        </h1>
      </header>
      <div
        className="cx-app-input-container"
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <input
          onChange={(e) => setIssueKey(e.target.value)}
          type="text"
          className="cx-app-input"
          placeholder="IssueKey"
          style={{
            outline: "none",
          }}
        />
        <Button
          buttonType="primary"
          className="cx-app-button"
          onClick={() => {
            fetchIssueTicket(issueKey);
          }}
        >
          Gen Test Case
        </Button>
      </div>
    </div>
  );
}

export default TicketSearch;
