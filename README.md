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

Replace `path_to_the_csv_file` with the actual path to your CSV file (e.g., `data/issues.csv`).

### Configuration

Edit the `.env` file to set API keys and other configuration options.