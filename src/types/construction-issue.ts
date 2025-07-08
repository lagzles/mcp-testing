import { z } from 'zod';

export interface ConstructionIssue {
    id: string;
    title: string;
    text: string;
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



export const constructionIssueSchema = z.object({
    id: z.string(),
    title: z.string(),
    text: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']),
    status: z.string().optional(),
    project_id: z.string().optional(),
    due_date: z.string().optional(),
    type: z.string().optional(), // Added type field
    cause: z.string().optional(), // Added cause field
    to_review_at: z.string().optional(), // Added to_review_at field
    to_review_by: z.string().optional(), // Added to_review_by field
    closed_at: z.string().optional(), // Added closed_at field
    closed_by: z.string().optional(), // Added closed_by field
    viewpoint_id: z.string().optional(), // Added viewpointid field
    origin: z.string().optional() // Added origin field
}).strip();

