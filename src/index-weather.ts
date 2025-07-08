import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { AlertsResponse, ForecastPeriod, ForecastResponse, PointsResponse } from "./types/nws-types.js";
import { makeNWSRequest, formatAlert } from "./helpers/nws-helper.js";
import { getAlertsByState } from "./helpers/nws-get-alerts.js";
import { getForecastByPoint } from "./helpers/nws-get-forecast.js";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

// Create server instance
const server = new McpServer({
  name: "weather",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});



// Register weather tools
server.tool(
  "get-alerts",
  "Get weather alerts for a state",
  {
    state: z.string().length(2).describe("Two-letter state code (e.g. CA, NY)"),
  },
  async ({ state }, _extra) => {
    // getAlertsByState should return { content: [{ type: "text", text: string }] }
    const result = await getAlertsByState({ state });
    // Ensure each content item has type as a string literal "text"
    return {
      ...result,
      content: (result.content || []).map(item => ({
        ...item,
        type: "text"
      }))
    };
  },
);

server.tool(
  "get-forecast",
  "Get weather forecast for a location",
  {
    latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .describe("Longitude of the location"),
  },
  async ({ latitude, longitude }) => {

    const result = await getForecastByPoint({ latitude, longitude });

    return {
      ...result,
      content: (result.content || []).map(item => ({
        ...item,
        type: "text"
      })),
    }
  },
);


async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});





