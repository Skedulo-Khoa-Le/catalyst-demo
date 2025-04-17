/**
 * Extracts the value of a specific query parameter from a URL.
 *
 * @param url - The URL to extract the query parameter from
 * @param paramName - The name of the query parameter to extract
 * @returns The value of the query parameter, or null if not found
 */
export function extractQueryParam(
  paramName: string,
  urlOrQuery: string
): string | null {
  try {
    let searchParams: URLSearchParams;
    
    // Check if this is a full URL or just a query string
    if (urlOrQuery.includes('://')) {
      // This is a full URL
      const urlObj = new URL(urlOrQuery);
      searchParams = urlObj.searchParams;
    } else {
      // This is just a query string (might or might not start with '?')
      const queryString = urlOrQuery.startsWith('?') 
        ? urlOrQuery.substring(1) 
        : urlOrQuery;
      searchParams = new URLSearchParams(queryString);
    }
    
    return searchParams.get(paramName);
  } catch (error) {
    console.error("Invalid input provided:", error);
    return null;
  }
}

// Example usage:
// const url = 'http://localhost:3000/listTickets?projectBoard=GT';
// const projectBoard = extractQueryParam('projectBoard', url); // Returns 'GT'
// const nonExistent = extractQueryParam('nonExistent', url); // Returns null
