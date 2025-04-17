import { Button, InlineBanner, Link } from "@skedulo/sked-ui";
import { useGlobalLoading } from "../GlobalLoading";
import { makeRequest } from "@/services/webRequest";
import { ReactNode, useState } from "react";
import { isValidJiraTicket } from "@/utils/TicketValidator";

// Constants
const JIRA_BASE_URL = "https://skedulo.atlassian.net/browse";

// Types
type BannerType = "success" | "warning" | "error" | "general";

function TicketSearch({
  devMode,
  prompt,
}: {
  devMode?: boolean;
  prompt?: string;
}) {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading();

  // State management
  const [issueKey, setIssueKey] = useState<string>("");
  const [banner, setBanner] = useState<{
    message: string | ReactNode;
    type: BannerType;
    visible: boolean;
  }>({
    message: "",
    type: "general",
    visible: false,
  });

  const showBanner = (message: string | ReactNode, type: BannerType) => {
    setBanner({
      message,
      type,
      visible: true,
    });
  };

  const hideBanner = () => {
    setBanner((prev) => ({ ...prev, visible: false }));
  };

  async function fetchIssueTicket(issueKey: string) {
    startGlobalLoading();
    hideBanner();

    if (!issueKey) {
      showBanner("Please enter a issue key", "error");
      endGlobalLoading();
      return null;
    }

    if (!isValidJiraTicket(issueKey)) {
      showBanner(
        "Invalid ticket format. Please use the format PROJECT-123",
        "error"
      );
      endGlobalLoading();
      return null;
    }

    try {
      const response = await makeRequest({
        url: devMode ? `geminiDev` : `gemini`,
        method: "POST",
        body: JSON.stringify({ issueKey, prompt }),
      });

      const data = await (response as any).json();

      // Check if response contains error
      if (data?.error) {
        throw new Error(data.error);
      }

      if (devMode) {
        showBanner(
          <div className="test-list-container">
            {data.testList.split("h2.").map((section: string, index: number) => {
              if (!section.trim()) return null;
              
              const [title, ...items] = section.split('\n').map(item => item.trim());
              
              return (
                <div key={index} className="test-section">
                  <h2>{title}</h2>
                  <ul>
                    {items.filter(item => item).map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>,
          "success"
        );
        return;
      }

      const jiraLink = `${JIRA_BASE_URL}/${issueKey}`;
      showBanner(
        <Link
          href={jiraLink}
          type="primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to Jira Ticket: {issueKey}
        </Link>,
        "success"
      );

      return data;
    } catch (error) {
      console.error("Error fetching issue ticket:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      showBanner(errorMessage, "error");
      return null;
    } finally {
      endGlobalLoading();
    }
  }

  // Styles
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: "16px",
    },
    header: {
      marginBottom: "16px",
      width: "100%",
      textAlign: "center" as const,
      padding: "16px 0",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#333",
      margin: 0,
      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    },
    inputContainer: {
      minWidth: "750px",
      width: "max-content",
      border: "1px solid #ccc",
      padding: "16px",
      borderRadius: "8px",
      display: "flex",
    },
    input: {
      flex: 1,
      outline: "none",
    },
    banner: {
      width: "fit-content",
    },
  };

  return (
    <div className="cx-app-container" style={styles.container}>
      <header className="cx-app-header" style={styles.header}>
        <h1 className="cx-app-title" style={styles.title}>
          Jimini
        </h1>
      </header>

      <div className="cx-app-input-container" style={styles.inputContainer}>
        <input
          onChange={(e) => setIssueKey(e.target.value)}
          type="text"
          className="cx-app-input"
          placeholder="Place your issue key here: PROJECT-123"
          style={styles.input}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          {devMode && (
            <Button
              buttonType="primary"
              className="cx-app-button cx-bg-red-500 cx-border-0"
              onClick={() => fetchIssueTicket(issueKey)}
            >
              Dev Gen Test Case
            </Button>
          )}
          <Button
            buttonType="primary"
            className="cx-app-button"
            onClick={() => fetchIssueTicket(issueKey)}
          >
            Generate Test Case
          </Button>
        </div>
      </div>

      {banner.visible && (
        <InlineBanner type={banner.type} style={styles.banner}>
          {banner.message}
        </InlineBanner>
      )}
    </div>
  );
}

export default TicketSearch;
