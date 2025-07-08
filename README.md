# CSV Chatbot Application

This application is a Node.js-based chatbot that interacts with users using data from a CSV file. The main logic resides in `index.ts` and the `csv-chat` module.

## Features

- Chatbot powered by data from a user-provided CSV file.
- Easily configurable via environment variables in the `.env` file.
- Integrates with external APIs (e.g., OpenAI, Anthropic, NWS).

### Other features
- index-weather: Claude tool that add's a weather request on the Claude chat
- index-analyse-csv: script that analyses the csv and gives the user a report about them

## Getting Started

### Customization
To create other schemas to use, you can:
- follow 'construction-issue.ts'. Create a interface and a zObject for schema
- Create a new Chat and adjust the CSVIssueChat.loadCSV method for it (csv-chat.ts)
- Update your generateContext to your new object schema
- Enjoy your conversation with Claude

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (Node Package Manager)

### Installation

1. Clone the repository and navigate to the project directory.
2. Install dependencies:

   ```bash
   npm install
   ```

### Build

Compile the TypeScript source code:

```bash
npm run build
```

### Usage

Run the chatbot by providing the path to your CSV file:

```bash
node build/index.js path_to_the_csv_file
```

Replace `path_to_the_csv_file` with the actual path to your CSV file (e.g., `C:\\folder\\other_folder\\mcp-testing\issues.csv`).

Estimated costs:
- csv qith 330 lines => avarege 38k tokens/question  $0.12/question

### Configuration

Edit the `.env` file to set API keys and other configuration options.
ANTHROPIC_API_KEY (go to https://console.anthropic.com/settings/keys) and MCP_VERSION=1.0
