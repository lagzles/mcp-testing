import { parseCSVToMCP, createMCPPayloads } from './helpers/csv-to-mcp.js';
import { MCPClaudeProcessor } from './mcp-processor.js';
async function main() {
    try {
        // 1. Parse CSV
        const pathTOCsv = "c:\\users\\legon\\source\\repos\\mcp-testing\\issue.csv";
        const issues = await parseCSVToMCP(pathTOCsv);
        // 2. Create MCP payloads
        const payloads = createMCPPayloads(issues);
        // 3. Process with Claude
        const processor = new MCPClaudeProcessor();
        let error_counting = 0;
        let issues_counter = 0;
        const results = await Promise.all(payloads.map(async (payload, index) => {
            try {
                if (issues_counter === 5) {
                    console.log('Processed 5 issues, stopping further processing.');
                }
                if (issues_counter < 5) {
                    const analysis = await processor.process(payload);
                    issues_counter++;
                    console.log(`Processing issue ${payload.instructions.user.issue_id} (${index + 1}/${payloads.length})...`);
                    return {
                        issue_id: payload.instructions.user.issue_id,
                        ...analysis
                    };
                }
            }
            catch (err) {
                error_counting++;
                if (error_counting > 3) {
                    console.error('Too many errors, stopping processing.');
                    process.exit(1);
                }
                console.error(`Failed to process issue ${payload.instructions.user.issue_id}:`, err);
                return {
                    issue_id: payload.instructions.user.issue_id,
                    error: err instanceof Error ? err.message : 'Unknown error'
                };
            }
        }));
        console.log('Analysis Results:');
        console.table(results);
    }
    catch (err) {
        console.error('Fatal error:', err);
        process.exit(1);
    }
}
main();
