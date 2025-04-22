import { context } from "./service";

// export async function callServerlessFunction<
//   TRequest extends object | undefined,
//   TResponse
// >(
//   functionPath: string,
//   payload: TRequest,
//   endpoint?: string
// ): Promise<TResponse> {
//   try {
//     const response = await context.baseClient.performRequest({
//       method: "POST",
//       endpoint: endpoint ?? `function/${functionPath}`,
//       body: payload,
//     });

//     return response as TResponse;
//   } catch (error) {
//     console.error(`Error calling serverless function ${functionPath}:`, error);
//     throw error;
//   }
// }

export interface WebRequestOptions {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string>;
}

export async function makeRequest(
  options: WebRequestOptions
): Promise<Response> {
  
  const baseUrl = "http://127.0.0.1:3000/";
  //const baseUrl = import.meta.env.VITE_BASE_SKEDULO_URL 
  const { url, method, headers, body, queryParams } = options;

  // Build URL with query parameters
  let fullUrl = `${baseUrl}${url}`;
  if (queryParams) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      searchParams.append(key, value);
    }
    fullUrl += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SKEDULO_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      body: body,
    });

    return response;
  } catch (error) {
    console.error("Error making web request:", error);
    throw error;
  }
}
