import { makeRequest } from "@/services/webRequest";
import { useState, ChangeEvent, useEffect } from "react";

interface PromptTextAreaProps {
  onChange: (text: string) => void;
}

function PromptTextArea({ onChange }: PromptTextAreaProps) {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const fetchPrompt = async (text: string) => {
    const response = await makeRequest({
      url: `prompt`,
      method: "GET",
    });

    return await (response as any).json();
  };

  useEffect(() => {
    const loadInitialPrompt = async () => {
      try {
        const response = await fetchPrompt("");
        if (response && response.prompt) {
          setValue(response.prompt);
          if (onChange) {
            onChange(response.prompt);
          }
        }
      } catch (error) {
        console.error("Failed to load initial prompt:", error);
      }
    };

    loadInitialPrompt();
  }, []);
  return (
    <div
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <textarea
        value={value}
        onChange={handleChange}
        style={{
          outline: "none",
          border: "none",
          width: "100%",
          height: "100%",
          resize: "none",
          padding: "10px",
          boxSizing: "border-box",
        }}
        placeholder="Enter your prompt here..."
      />
    </div>
  );
}

export default PromptTextArea;
