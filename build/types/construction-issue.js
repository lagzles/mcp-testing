import { z } from 'zod';
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
