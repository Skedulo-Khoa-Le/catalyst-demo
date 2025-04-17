import get from "lodash/get";

export interface Credentials {
  apiServer: string;
  apiAccessToken: string;

  vendor:
    | { type: "skedulo"; url: string; token: null }
    | { type: "salesforce"; url: string; token: string };
}

const skedInjected: {
  Services: any;
  context?: string;
  credentials: Credentials;
} = get(window, "skedInjected", {}) as any;

const getCredential = () => {
  return {
    ...get(window, "skedInjected", {}),
    apiServer:
      skedInjected?.credentials?.apiServer || import.meta.env.VITE_SKEDULO_API,
    apiAccessToken:
      skedInjected?.credentials?.apiAccessToken ||
      import.meta.env.VITE_SKEDULO_TOKEN,
  };
};

export default getCredential;
