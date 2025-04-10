import React from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "@skedulo/sked-ui";
import App from "./App";
import { SWRConfig } from "swr";
import { fetchStatusMiddleware } from "./hooks/useSWR";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        use: [fetchStatusMiddleware],
      }}
    >
      <App />
      <ToastContainer
        icon={false}
        position="top-right"
        autoClose={5000}
        pauseOnHover={true}
        hideProgressBar={true}
        className="cx-z-9999"
      />
    </SWRConfig>
  </React.StrictMode>
);
