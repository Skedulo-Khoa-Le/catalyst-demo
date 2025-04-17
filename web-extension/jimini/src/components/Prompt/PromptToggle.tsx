function PromptToggle({
  isEnabled,
  handleToggle,
}: {
  handleToggle: () => void;
  isEnabled: boolean;
}) {
  return (
    <div
      className=" cx-border-solid cx-border-blue-500"
      style={{
        width: "fit-content",
        alignSelf: "flex-end",
        border: "1px",
        borderRadius: "4px",
      }}
    >
      <button
        onClick={handleToggle}
        className="cx-px-2 cx-py-2 cx-rounded cx-transition-colors  cx-text-blue-500 cx-flex cx-items-center cx-gap-2 cx-w-fit"
      >
        <span>Dev mode:</span>
        <div
          className={`cx-px-2 cx-py-1 cx-rounded cx-text-sm cx-font-medium cx-transition-colors ${
            isEnabled
              ? "cx-bg-blue-500 cx-text-white cx-border cx-border-blue-600"
              : "cx-bg-red-500 cx-text-white cx-border cx-border-red-600"
          }`}
        >
          {isEnabled ? "ON" : "OFF"}
        </div>
      </button>
    </div>
  );
}
export default PromptToggle;
