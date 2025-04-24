export default function convertLlmJsonToCSV(rawLlmResponse: string) {
  if (
    typeof rawLlmResponse !== "string" ||
    rawLlmResponse.trim().length === 0
  ) {
    console.warn("⚠️ Input is not a valid non-empty string. Cannot process.");
    return undefined;
  }

  let testCasesArray;
  let cleanedJsonString: string;

  try {
    cleanedJsonString = rawLlmResponse
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();
    if (cleanedJsonString.length === 0) {
      console.warn(
        "⚠️ Input string was empty after cleaning markdown wrappers."
      );
      return undefined;
    }

    testCasesArray = JSON.parse(cleanedJsonString);

    // Optional: Log first few parsed items for debugging
    // console.log('Parsed JSON (first 5 rows):', testCasesArray.slice(0, 5));

    if (!Array.isArray(testCasesArray) || testCasesArray.length === 0) {
      console.warn(
        "⚠️ Parsed data is not a valid non-empty array. Cannot convert to CSV."
      );
      return undefined;
    }

    // 5. --- Define Target CSV Structure ---
    const targetHeaders = [
      "TC ID",
      "Feature",
      "User Story ID",
      "Description / Summary",
      "Type",
      "TC_Category",
      "Priority",
      "AS (Actor)",
      "GIVEN (Precondition)",
      "WHEN (Steps)",
      "THEN (Expected Result)",
      "Result (latest)",
      "Est (mins)",
      "Date Run",
      "Notes",
    ];

    const finalRows = testCasesArray
      .map((jsonRow, index) => {
        if (!Array.isArray(jsonRow) || jsonRow.length !== 15) {
          console.warn(
            `⚠️ Skipping row index ${index} due to unexpected format (unexpected array with ${
              jsonRow.length
            } items): ${JSON.stringify(jsonRow)}`
          );
          // [TODO]Re-add to validate inner row structure
          //return null; // Mark row as invalid
        }

        // Map JSON array elements to CSV columns, adding the initial empty column
        return [
          jsonRow[0] || "", // TC ID
          jsonRow[1] || "", // Feature
          jsonRow[2] || "", // User Story ID
          jsonRow[3] || "", // Description / Summary
          jsonRow[4] || "", // Type
          jsonRow[5] || "", // TC_Category
          jsonRow[6] || "", // Priority
          jsonRow[7] || "", // AS (Actor)
          jsonRow[8] || "", // GIVEN (Precondition)
          jsonRow[9] || "", // WHEN (Steps)
          jsonRow[10] || "", // THEN (Expected Result)
          jsonRow[11] || "", // Result (latest)
          jsonRow[12] || "", // Est (mins)
          jsonRow[13] || "", // Date Run
          jsonRow[14] || "", // Notes
        ];
      })
      .filter((row) => row !== null); // Remove invalid rows marked as null

    if (finalRows.length === 0) {
      console.warn(
        "⚠️ No valid test case rows found in the parsed data after filtering."
      );
      return undefined;
    }

    const delimiter = ",";
    const newline = "\r\n";

    const escapeCsvField = (field: any) => {
      const stringField =
        field === null || field === undefined ? "" : String(field);
      if (
        stringField.includes(delimiter) ||
        stringField.includes('"') ||
        stringField.includes("\r") ||
        stringField.includes("\n")
      ) {
        const escapedField = stringField.replace(/"/g, '""');
        return `"${escapedField}"`;
      }
      return stringField;
    };

    // Process header row
    const headerRowString = targetHeaders.map(escapeCsvField).join(delimiter);

    // Process data rows
    const dataRowStrings = finalRows.map((row) =>
      (row as string[]).map(escapeCsvField).join(delimiter)
    );

    const csvOutput = [headerRowString, ...dataRowStrings].join(newline);

    return csvOutput;
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error("❌ Error parsing JSON from LLM response:", err);
      console.error("Error details:", rawLlmResponse);
    } else {
      console.error("❌ Error processing data or generating CSV:", err);
    }
    return undefined;
  }
}
