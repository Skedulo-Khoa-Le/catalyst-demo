import App from "./App";
import { render } from "./utils/test-utils";
import { vi } from "vitest";

// mock sdk.getAssetAssignmentById
vi.mock("./utils/getParams");
vi.mock("./sdkGraphql");

describe("App testing", () => {
  it("should match snapshot", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
