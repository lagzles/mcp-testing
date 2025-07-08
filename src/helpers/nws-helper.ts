const USER_AGENT = process.env.USER_AGENT || "weather-app/1.0";


// Helper function for making NWS API requests
async function makeNWSRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/geo+json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

import { AlertFeature, AlertsResponse, PointsResponse, ForecastResponse } from "../types/nws-types.js";
// In Node.js with "moduleResolution": "node16" or "nodenext", you must use the file extension that will exist at runtime.
// TypeScript files (.ts) are compiled to JavaScript (.js), so you must import using .js even though the source file is .ts.
// This allows the import to work after compilation.
function formatAlert(feature: AlertFeature): string {
  const props = feature.properties;
  return [
    `Event: ${props.event || "Unknown"}`,
    `Area: ${props.areaDesc || "Unknown"}`,
    `Severity: ${props.severity || "Unknown"}`,
    `Status: ${props.status || "Unknown"}`,
    `Headline: ${props.headline || "No headline"}`,
    "---",
  ].join("\n");
}

export { makeNWSRequest, formatAlert };
