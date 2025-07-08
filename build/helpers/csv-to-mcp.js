import csv from 'csv-parser';
import fs from 'fs';
import { z } from 'zod';
import { config } from '../config.js';
// Zod schema for CSV data validation
const IssueSchema = z.object({
    id: z.string(),
    code: z.string(),
    title: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
    text: z.string().optional(),
    status: z.string(),
    project_id: z.string(),
    created_at: z.string()
});
export async function parseCSVToMCP(csvPath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => {
            try {
                const parsed = IssueSchema.parse({
                    ...data,
                    priority: data.priority.toLowerCase()
                });
                results.push(parsed);
            }
            catch (err) {
                console.warn(`Skipping invalid record: ${err}`);
            }
        })
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}
export async function generateArrayFromCSV(csvPath, schema) {
    return new Promise((resolve, reject) => {
        let results = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => {
            try {
                const parsed = schema.parse(data);
                results.push(parsed);
            }
            catch (err) {
                console.warn(`Skipping invalid record: ${err}`);
            }
        })
            .on('end', () => {
            console.log(`Generated array from CSV: ${results.length} records\n`);
            resolve(results);
        })
            .on('error', (err) => {
            console.error(`Error reading CSV file: ${err}`);
            reject(err);
        });
    });
}
export function createMCPPayloads(issues) {
    return issues.map(issue => ({
        mcp_version: config.MCP_VERSION,
        model: { name: "claude-3-opus", version: "2024-02" },
        instructions: {
            system: "Analyze construction issues and provide structured recommendations.",
            user: {
                issue_id: issue.id,
                title: issue.title,
                description: issue.text || "No description",
                priority: issue.priority,
                project: issue.project_id,
                status: issue.status
            }
        },
        metadata: {
            source: "construction_csv",
            created_at: issue.created_at
        }
    }));
}
