import MainLayout from "@/components/MainLayout";
import { withGlobalLoading } from "@/components/GlobalLoading";
import TicketSearch from "./components/Tickets/TicketSearch";
import { useState } from "react";
import PromptToggle from "./components/Prompt/PromptToggle";
import PromptTextArea from "./components/Prompt/PromptTextArea";

function App() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [shouldGenCSV, setShouldGenCSV] = useState(false);

  const handleToggle = () => {
    setIsEnabled((prevState) => !prevState);
  };

  const handleCSVToggle = () => {
    setShouldGenCSV((prevState) => !prevState);
  };

  return (
    <MainLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          height: "100%",
          alignItems: "center",
        }}
      >
        <PromptToggle handleToggle={handleToggle} isEnabled={isEnabled} />
        {isEnabled && (
          <PromptToggle
            handleToggle={handleCSVToggle}
            isEnabled={shouldGenCSV}
            label="Generate CSV"
          />
        )}
        <div style={{ marginBottom: "30px" }}>
          <TicketSearch
            devMode={isEnabled}
            prompt={prompt}
            shouldGenCSV={shouldGenCSV}
          />
        </div>
        {isEnabled && <PromptTextArea onChange={setPrompt} />}
      </div>
    </MainLayout>
  );
}

export default withGlobalLoading(App);
