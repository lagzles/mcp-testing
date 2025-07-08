import { Anthropic } from '@anthropic-ai/sdk';
import readline from 'readline';
import { config } from './config.js';
import { generateArrayFromCSV } from './helpers/csv-to-mcp.js';
import { constructionIssueSchema } from './types/construction-issue.js';
export class CSVIssueChat {
    anthropic;
    issues = [];
    context = '';
    constructor() {
        this.anthropic = new Anthropic({
            apiKey: config.ANTHROPIC_API_KEY
        });
    }
    async loadCSV(csvPath) {
        return new Promise(async (resolve, reject) => {
            this.issues = await generateArrayFromCSV(csvPath, constructionIssueSchema);
            this.context = this.generateContext();
            resolve();
        });
    }
    generateContext() {
        return `Construction Issues Summary:
    ${this.issues.map(issue => `
    - [ID:${issue.id}] ${issue.title} (Priority: ${issue.priority}) (due_date: ${issue.due_date}) 
    (type: ${issue.type}) (cause: ${issue.cause})
    (to_review_at: ${issue.to_review_at}) (to_review_by: ${issue.to_review_by}) 
    (closed_at: ${issue.closed_at}) (closed_by: ${issue.closed_by}) (viewpoint_id: ${issue.viewpoint_id}) 
    (origin: ${issue.origin})
      ${issue.text?.substring(0, 100)}...`).join('\n')}
    
    Total Issues: ${this.issues.length}
    `;
    }
    // High Priority: ${this.issues.filter(i => i.priority === 'high').length}
    // Open Issues: ${this.issues.filter(i => i.status === 'open').length}
    async chatAboutIssues() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log('\n=== Construction Issue Chat ===');
        console.log('Ask Claude about any issue (type "quit" to exit)\n');
        const askQuestion = async () => {
            rl.question('You: ', async (question) => {
                if (question.toLowerCase() === 'quit') {
                    rl.close();
                    return;
                }
                try {
                    const response = await this.askClaude(question);
                    console.log('\nClaude:', response);
                }
                catch (error) {
                    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
                }
                askQuestion();
            });
        };
        await askQuestion();
    }
    async askClaude(question) {
        const prompt = `
      Context: ${this.context}
      
      Question: ${question}

      Please answer the question based on the construction issues provided.
      If the question asks about specific issues, please list them with their IDs, titles, and priorities asked, not all of them.
      If the question asks about the number of issues with a specific value, please provide that count.
      If the question asks for a summary or analysis, please provide insights based on the issues.
      If the question asks about specific fields, please include those in your response.
      If the question asks about what the property has the most off something, give the top 5 values, unless the question asks for more or less.

      In your answer, list the issues only if the question ask's you to list them and please use the following format:
      - [ID:issue_id] issue_title (Priority: issue_priority) (due_date: issue_due_date)

      And you don't need to tell me how you are going to analyse the data. Tell me only if you ae asked to do so.
      And you should answer in the same language as the question asked, unless the question is in English, then you should answer in English.
      If the question is not clear, please ask for clarification.

    `;
        //   Answer based on the construction issues above, providing:
        //   1. Relevant issue IDs
        //   2. Priority assessment
        //   3. Recommended actions
        //   4. Any related insights
        const response = await this.anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }]
        });
        const firstBlock = response.content[0];
        if (firstBlock.type === 'text') {
            return firstBlock.text;
        }
        return '[No text response from Claude]';
    }
}
