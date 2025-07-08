import { Anthropic } from '@anthropic-ai/sdk';
import csv from 'csv-parser';
import fs from 'fs';
import readline from 'readline';
import { config } from './config.js';

interface ConstructionIssue {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  project_id: string;
    due_date: string;
    type: string; // Added type field
    cause: string; // Added cause field
    to_review_at:string; // Added to_review_at field
    to_review_by:string; // Added to_review_by field
    closed_at: string; // Added closed_at field
    closed_by: string; // Added closed_by field
    viewpoint_id: string; // Added viewpointid field
    origin: string; // Added origin field
}

export class CSVIssueChat {
  private anthropic: Anthropic;
  private issues: ConstructionIssue[] = [];
  private context = '';

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: config.ANTHROPIC_API_KEY
    });
  }

  async loadCSV(csvPath: string) {
    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
            this.issues.push({
                id: data.id,
                title: data.title,
                description: data.text || 'No description',
                priority: data.priority.toLowerCase(),
                status: data.status,
                project_id: data.project_id,
                due_date: data.due_date || 'No due date',
                type: data.type || 'No type',
                cause: data.cause || 'No cause',    
                to_review_at: data.to_review_at || 'No review date',
                to_review_by: data.to_review_by || 'No reviewer',
                closed_at: data.closed_at || 'Not closed',
                closed_by: data.closed_by || 'Not closed by anyone',
                viewpoint_id: data.viewpoint_id || 'No viewpoint ID',
                origin: data.origin || 'No origin'
          });
        })
        .on('end', () => {
          this.context = this.generateContext();
          resolve();
        })
        .on('error', reject);
    });
  }

  private generateContext(): string {
    return `Construction Issues Summary:
    ${this.issues.map(issue => `
    - [ID:${issue.id}] ${issue.title} (Priority: ${issue.priority}) (due_date: ${issue.due_date}) 
    (type: ${issue.type}) (cause: ${issue.cause})
    (to_review_at: ${issue.to_review_at}) (to_review_by: ${issue.to_review_by}) 
    (closed_at: ${issue.closed_at}) (closed_by: ${issue.closed_by}) (viewpoint_id: ${issue.viewpoint_id}) 
    (origin: ${issue.origin})
      ${issue.description.substring(0, 100)}...`).join('\n')}
    
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
    console.log(`Loaded ${this.issues.length} issues`);
    console.log('Ask Claude about any issue (type "quit" to exit)\n');

    const askQuestion = async (): Promise<void> => {
      rl.question('You: ', async (question: string) => {
        if (question.toLowerCase() === 'quit') {
          rl.close();
          return;
        }

        try {
          const response = await this.askClaude(question);
          console.log('\nClaude:', response);
        } catch (error) {
          console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
        }
        askQuestion();
      });
    };

    await askQuestion();
  }

  private async askClaude(question: string): Promise<string> {
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