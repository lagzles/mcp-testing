import { CSVIssueChat } from './csv-chat.js';
async function main() {
    if (process.argv.length < 3) {
        console.log('Usage: node dist/index.js <path_to_issues.csv>');
        process.exit(1);
    }
    const chat = new CSVIssueChat();
    try {
        await chat.loadCSV(process.argv[2]);
        await chat.chatAboutIssues();
    }
    catch (err) {
        console.error('Failed to start chat:', err instanceof Error ? err.message : 'Unknown error');
        process.exit(1);
    }
}
main();
