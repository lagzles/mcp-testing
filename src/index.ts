import { CSVIssueChat } from './csv-chat.js';

async function main() {
  if (process.argv.length < 3) {
    console.log('Usage: node dist/index.js <path_to_issues.csv>');
    process.exit(1);
  }

  const chat = new CSVIssueChat();
  
  try {
    await chat.loadCSV(process.argv[2]);

    let issues_with_no_description = chat.issues.filter(issue => !issue.text);
    if (issues_with_no_description.length > 0) {
      console.log('There are issues with no description. Please check the CSV file.');
      console.log('Issues with no description:', issues_with_no_description.length);
      console.log('You can add descriptions to these issues in the CSV file and try again.');
    }

    await chat.chatAboutIssues();
  } catch (err) {
    console.error('Failed to start chat:', err instanceof Error ? err.message : 'Unknown error');
    process.exit(1);
  }
}

main();